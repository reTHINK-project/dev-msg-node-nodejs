/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
* Copyright 2016 IMT/Telecom Bretagne
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
let Message = require('./Message');

class ClientMessage {

  constructor(registry, client, msg) {
    this.registry = registry;
    this.client = client;
    this.msg = msg;
    this.logger = registry.getLogger();
  }

  getMessage() {
    return this.msg;
  }

  getRuntimeUrl() {
    return this.client.getRuntimeUrl();
  }

  getResource() {
    return this.client;
  }

  getResourceUid() {
    return this.client.getUid();
  }

  dispatch() {
    // get policyEngine
    const pep = this.registry.getComponent('PEP');
    // validate request with policy
    pep.analyse(this.msg.msg).then(function (result) {
      if (!result.validated) {
        this.replyError(this.msg.getFrom(), result.error);
        return;
      }
    let comp = this.registry.getComponent(this.msg.getTo());
    if (comp) {
      this.logger.info('[ClientMessage] dispatch msg to internal', comp.getName());
      try {
        comp.handle(this);
      } catch (e) {
        this.replyError(comp.getName(), e);
      }
    } else {
      this.logger.info('[ClientMessage] forward msg to', this.msg.getTo());
      this.registry.getComponent('MessageBus').publish(this.msg.getTo(), this.msg.msg);
    }
    });
  }

  reply(msg) {
    msg.setType('response');
    this.client.reply(msg);
  }

  replyok(from) {
    let reply = new Message();
    reply.setId(this.msg.getId());
    reply.setFrom(from);
    reply.setTo(this.msg.getFrom());
    reply.setReplyCode(200);
    reply.setType('response');
    this.client.reply(reply);
  }

  replyError(from, error) {
    let reply = new Message();
    reply.setId(this.msg.getId());
    reply.setFrom(from);
    reply.setTo(this.msg.getFrom());
    reply.setReplyCode('error');
    reply.setErrorDescription(error);
    reply.setType('response');
    this.client.reply(reply);
  }

  disconnect() {
    this.logger.info('[S] Force close socket', this.getResourceUid());
    this.client.disconnect();
  }
}
module.exports = ClientMessage;
