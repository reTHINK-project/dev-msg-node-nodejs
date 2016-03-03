/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
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

let AddressAllocationManager = require('./components/rethink/AddressAllocationManager');
let RegistryManager = require('./components/rethink/RegistryManager');
let SessionManager = require('./components/rethink/SessionManager');
let MessageBus = require('./components/rethink/MessageBus');

class MsgNode {

  /**
   * Nodejs ProtoStub creation
   * @param  {Object} config - Server configuration.
   * @return {NodejsProtoStub}
   */
  constructor(config) {
    let _this = this;

    this.config = config;

    // define logger configuration
    log4js.configure(this.config.log4jsConfig, {
      reloadSecs: 60,
      cwd: this.config.logDir
    });
    this.logger = log4js.getLogger('server');

    this.app = express();

    // define logger for express
    this.app.use(log4js.connectLogger(this.logger, {
      level: 'auto'
    }));
    this.app.set('trust proxy', 1);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    let sessionManager = expressSession({
      key: this.config.sessionCookieName,
      secret: this.config.sessionCookieSecret,
      resave: true,
      saveUninitialized: true,
      store: new FileStore({ logFn: function() {} })
    });
    this.app.use(sessionManager);

    // start listening HTTP & WS server
    this.io = require('socket.io').listen(this.app.listen(this.config.port), this.config.ioConfig);

    //    this.io.use(require('socketio-wildcard')());
    // share session with socket.io socket handshake
    this.io.use(function(socket, next) {
      sessionManager(socket.handshake, {}, next);
    });

    // global registry
    this.registry = new Registry(this.config);
    this.registry.setLogger(this.logger);
    this.registry.setWSServer(this.io);
    let alm = new AddressAllocationManager('domain://msg-node.' + this.registry.getDomain()  + '/hyperty-address-allocation', this.registry);
    this.registry.registerComponent(alm);
    let sm = new SessionManager('mn:/session', this.registry);
    this.registry.registerComponent(sm);
    let rm = new RegistryManager('domain://registry.' + this.registry.getDomain() + '/', this.registry);
    this.registry.registerComponent(rm);
    let bus = new MessageBus('MessageBus', this.registry, this.io);
    this.registry.registerComponent(bus);

    this.io.on('connection', this.onConnection.bind(this));

    this.logger.info('[S] HTTP & WS server listening on', this.config.port);
  }

  onConnection(socket) {
    let _this = this;

    //socket.id : socket.io id
    //socket.handshake.sessionID : express shared sessionId
    this.logger.info('[C->S] new client connection', socket.id, socket.handshake.sessionID);

    //    socket.join(socket.id);
    let client = new Client(this.registry, socket);

    socket.on('message', function(data) {
      _this.logger.info('[C->S] new event', data);
      client.processMessage(new Message(data));
    });

    socket.on('disconnect', function() {
      _this.logger.info('[C->S] client disconnect', socket.handshake.sessionID);

      client.disconnect();
    });

    socket.on('error', function(e) {
      _this.logger.info('[C->S] socket error', socket.handshake.sessionID, e);
    });

    // test ws route
    socket.on('echo', function(msg, callback) {
      _this.logger.info('[C->S] receive echo');
      callback = callback || function() {};

      _this.logger.info('[S->C] test ping back');
      socket.emit('echo', msg);
      callback(null, 'Done.');
    });
  }
}
module.exports = MsgNode;
