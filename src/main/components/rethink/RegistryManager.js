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
let Message = require('./../Message');

let RegistryInterfaceConnector = require('./RegistryInterfaceConnector');

class RegistryManager {

  constructor(name, registry) {
    this.name = name;
    this.registry = registry;
    this.registryConnector = new RegistryInterfaceConnector(this.registry.getConfig().domainRegistryUrl, this.registry);
    this.logger = this.registry.getLogger();
    /*

    registryURL: 'http://registry.rethink.apizee.com:4567',
    rethink-msg-nodejs          |   registry:
    rethink-msg-nodejs          |    Registry {
    rethink-msg-nodejs          |      config:
    rethink-msg-nodejs          |       { url: 'rethink.apizee.com',
    rethink-msg-nodejs          |         domainRegistryUrl: 'http://registry.rethink.apizee.com:4567/',
    rethink-msg-nodejs          |         port: '9090',
    rethink-msg-nodejs          |         ioConfig: [Object],
    rethink-msg-nodejs          |         log4jsConfig: '/usr/src/app/src/configs/log-conf.json',
    rethink-msg-nodejs          |         logLevel: 'INFO',
    rethink-msg-nodejs          |         logDir: '/usr/src/app/logs',
    rethink-msg-nodejs          |         sessionCookieName: 'rethink.express.sid',
    rethink-msg-nodejs          |         sessionCookieSecret: '88HpNxVxm5k94AY2',
    rethink-msg-nodejs          |         useSSL: false,
    rethink-msg-nodejs          |         sslCertificate: '/usr/src/app/server.crt',
    rethink-msg-nodejs          |         sslPKey: '/usr/src/app/key.pem' },
    rethink-msg-nodejs          |      domain: 'rethink.apizee.com',
    rethink-msg-nodejs          |      urlSpace: [],
    rethink-msg-nodejs          |      components:
    rethink-msg-nodejs          |       [ MessageBus: [Object],
    rethink-msg-nodejs          |         'mn:/session': [Object],
    rethink-msg-nodejs          |         'domain://msg-node.rethink.apizee.com/hyperty-address-allocation': [Object],
    rethink-msg-nodejs          |         'domain://msg-node.rethink.apizee.com/object-address-allocation': [Object],
    rethink-msg-nodejs          |         'domain://msg-node.rethink.apizee.com/sm': [Object] ],
    rethink-msg-nodejs          |      logger:
    rethink-msg-nodejs          |       Logger {
    rethink-msg-nodejs          |         category: 'server',
    rethink-msg-nodejs          |         level: [Object],
    rethink-msg-nodejs          |         _events: [Object],
    rethink-msg-nodejs          |         _eventsCount: 1 },
    rethink-msg-nodejs          |      wss:
    rethink-msg-nodejs          |       Server {
    rethink-msg-nodejs          |         nsps: [Object],
    rethink-msg-nodejs          |         _path: '/socket.io',
    rethink-msg-nodejs          |         _serveClient: true,
    rethink-msg-nodejs          |         _adapter: [Function: Adapter],
    rethink-msg-nodejs          |         _origins: '*:*',
    rethink-msg-nodejs          |         sockets: [Object],
    rethink-msg-nodejs          |         eio: [Object],
    rethink-msg-nodejs          |         httpServer: [Object],
    rethink-msg-nodejs          |         engine: [Object] } },
    rethink-msg-nodejs          |   logger:
    rethink-msg-nodejs          |    Logger {
    rethink-msg-nodejs          |      category: 'server',
    rethink-msg-nodejs          |      level: Level { level: 20000, levelStr: 'INFO' },
    rethink-msg-nodejs          |      _events: { log: [Object] },
  */
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();
    this.logger.info('msg--------------', msg);
    this.logger.info('----------------[', this.getName(), '] handle registry message------------');
    this.registryConnector.processRegistryMessage(msg, (res) => {
      this.logger.info('[', _this.getName(), '] Reply from domain registry', res);
      this.logger.debug('  this.registryConnector : ',   this.registryConnector);
      let reply = new Message();
      reply.setId(msg.getId());
      reply.setFrom(this.getName());
      reply.setTo(msg.getFrom());
      reply.setReplyCode(res.code);
      reply.setBody(res);
      clientMessage.reply(reply);
    });
  }
}
module.exports = RegistryManager;
