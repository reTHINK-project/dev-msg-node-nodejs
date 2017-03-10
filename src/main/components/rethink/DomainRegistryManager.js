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

const RegistryDomainConnector = require('dev-registry-domain/connector');

class DomainRegistryManager {

  constructor(name, registry) {
    this.name = name;
    this.registry = registry;
    this.registryConnector = new RegistryDomainConnector(this.registry.getConfig().domainRegistryUrl);
    this.logger = this.registry.getLogger();

  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();
    this.logger.info('[Domain-Registry-Manager], [', this.getName(), ']: handle registry message :\n', msg.msg);

    switch (msg.msg.type.toLowerCase()) {
      case 'create':
      case 'read':
      case 'delete':
      case 'update':
        try {
          this.logger.info('msg.msg.type.toLowerCase() is:', msg.msg.type.toLowerCase());
          this.registryConnector.processMessage(msg.msg, (res) => {
            this.logger.info('[', this.getName(), '] Reply from domain registry :\n ', res);
            this.logger.debug('  this.registryConnector : ',   this.registryConnector);
            let reply = new Message();
            reply = {
                id: msg.msg.id,
                type: 'response',
                from:msg.msg.to,
                to: msg.msg.from,
                body: res
              };
              // reply.body.code = 200;
            clientMessage.replyDomain(reply);
          });
        } catch (e) {
          this.logger.error('[', this.getName(), ']: Error while processing message:\n', e);
        }

      break;
      default:
        clientMessage.replyError(this.getName(), 'Unrecognized type :"' + msg.getType() + '"');
    }
  }
}
module.exports = DomainRegistryManager;
