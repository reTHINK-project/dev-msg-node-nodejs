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

let RegistryConnector = require('./RegistryConnector');

class RegistryManager {

  constructor(name, registry) {
    this.name = name;
    this.registry = registry;
    this.registryConnector = new RegistryConnector(this.registry.getConfig().domainRegistryUrl, this.registry);
    this.logger = this.registry.getLogger();
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();
    this.logger.info('[', this.getName(), '] handle registry message');
    this.registryConnector.processMessage(msg, (res) => {
      //   _this.logger.info('[', _this.getName(), '] Reply from domain registry', res);

      let reply = new Message();
      reply.setId(msg.getId());
      reply.setFrom(this.getName());
      reply.setTo(msg.getFrom());
      reply.setReplyCode(res.code);
      reply.setBody(res);

      this.logger.error(reply);

      //   reply.body = msg.getJson();

      clientMessage.reply(reply);
    });
  }
}
module.exports = RegistryManager;
