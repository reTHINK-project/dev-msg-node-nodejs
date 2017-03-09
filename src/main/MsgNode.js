/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
* Copyrignt 2016 IMT/Telecom Bretagne
 *
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

'use strict';

// @link https://github.com/nomiddlename/log4js-node
let log4js = require('log4js');
let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

// @link https://github.com/expressjs/session
let expressSession = require('express-session');

// @link https://www.npmjs.com/package/session-file-store
// lot of store are available, including rethinkDB :)
// => https://github.com/expressjs/session#compatible-session-stores
let FileStore = require('session-file-store')(expressSession);

let Client = require('./components/Client');
let Registry = require('./components/Registry');
let Message = require('./components/Message');
let PEP = require('./components/policyEngine/pep/Pep');
let NodejsCtx = require('./components/policyEngine/context/NodejsCtx');
let MessageBus = require('./components/MessageBus');
let SessionManager = require('./components/SessionManager');

let AddressAllocationManager = require('./components/rethink/AddressAllocationManager');
let DomainRegistryManager = require('./components/rethink/DomainRegistryManager');
let GlobalRegistryManager = require('./components/rethink/GlobalRegistryManager');
let SubscriptionManager = require('./components/rethink/SubscriptionManager');
let ObjectAllocationManager = require('./components/rethink/ObjectAllocationManager');

class MsgNode {

  /**
   * Nodejs ProtoStub creation
   * @param  {Object} config - Server configuration.
   * @return {NodejsProtoStub}
   */
  constructor(config) {
    let _this = this;
    this.config = config;
    this.config.domainRegistryUrl = this.config.domainRegistryUrl.replace(/\/$/, '') + '/';

    // define logger configuration
    log4js.configure(this.config.log4jsConfig, {
      reloadSecs: 10,
      cwd: this.config.logDir
    });
    this.logger = log4js.getLogger('server');
    this.logger.setLevel(this.config.logLevel);

    this.app = express();

    // define logger for express
    this.app.use(log4js.connectLogger(this.logger, {
      level: 'auto'
    }));

    this.app.set('trust proxy', 1);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.get('/logs', (req, res) => {
      require('fs').createReadStream(this.config.logDir + '/server.log').pipe(res);
    });

    this.app.get('/live', (req, res) => {
      res.send({
        status:'up',
        domain: this.config.url,
        domainRegistry: this.config.domainRegistryUrl,
        globalRegistry: this.config.globalRegistryUrl,
        time: (new Date()).toISOString(),
        connected: Object.keys(this.io.sockets.sockets).length
      });
    });

    // start listening HTTP & WS server
    if (this.config.useSSL) {
      let fs = require('fs');
      let https = require('https');
      this.io = require('socket.io').listen(https.createServer({
        cert: fs.readFileSync(this.config.sslCertificate).toString(),
        key: fs.readFileSync(this.config.sslPKey).toString()
      }, this.app).listen(this.config.port), this.config.ioConfig);
    } else {
      this.io = require('socket.io').listen(this.app.listen(this.config.port), this.config.ioConfig);
    }

    // global registry
    this.registry = new Registry(this.config);
    this.registry.setLogger(this.logger);
    this.registry.setWSServer(this.io);
    let bus = new MessageBus('MessageBus', this.registry);
    this.registry.registerComponent(bus);
    let pep = new PEP('PEP', new NodejsCtx(this.registry, this.config));
    this.registry.registerComponent(pep);
    let sm = new SessionManager('mn:/session', this.registry);
    this.registry.registerComponent(sm);
    let alm = new AddressAllocationManager('domain://msg-node.' + this.registry.getDomain()  + '/hyperty-address-allocation', this.registry);
    this.registry.registerComponent(alm);
    let olm = new ObjectAllocationManager('domain://msg-node.' + this.registry.getDomain()  + '/object-address-allocation', this.registry);
    this.registry.registerComponent(olm);
    let syncm = new SubscriptionManager('domain://msg-node.' + this.registry.getDomain()  + '/sm', this.registry);
    this.registry.registerComponent(syncm);
    let rm = new DomainRegistryManager('domain://registry.' + this.registry.getDomain() + '/', this.registry);
    this.registry.registerComponent(rm);
    let glbm = new GlobalRegistryManager(this.registry.getDomain().globalRegistryUrl, this.registry);
    this.registry.registerComponent(glbm);

    this.io.on('connection', this.onConnection.bind(this));

    this.logger.info('[S] HTTP & WS server listening on', this.config.port);
  }

  onConnection(socket) {
    let _this = this;

    //socket.id : socket.io id
    //socket.handshake.sessionID : express shared sessionId
    this.logger.info('[C->S] new client connection : ', socket.id);

    //    socket.join(socket.id);
    let client = new Client(this.registry, socket);

    socket.on('message', function(data) {
      _this.logger.info('[C->S] new event : ', data);
      try {
        client.processMessage(new Message(data));
      } catch (e) {
        _this.logger.error(e);
      }
    });

    socket.on('disconnect', function() {
      _this.logger.info('[C->S] client disconnect: ', socket.id);

      client.disconnect();
    });

    socket.on('error', function(e) {
      _this.logger.info('[C->S] socket error :  ', socket.id, e);
    });

    // test ws route
    socket.on('echo', function(msg, callback) {
      _this.logger.info('[C->S] receive echo : ');
      callback = callback || function() {};

      _this.logger.info('[S->C] test ping back :');
      socket.emit('echo', msg);
      callback(null, 'Done.');
    });
  }
}
module.exports = MsgNode;
