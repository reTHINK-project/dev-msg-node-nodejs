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
let Message = require('./Message');
let ClientMessage = require('./ClientMessage');

class Client {

  constructor(registry, socket) {
    this.registry = registry;
    this.uid = socket.id;//socket.handshake.sessionID;
    this.socket = socket;
    this.logger = this.registry.getLogger();
    this.runtimeUrl = null;
  }

  getUid() {
    return this.uid;
  }

  getRuntimeUrl() {
    return this.runtimeUrl;
  }

  setRuntimeUrl(runtimeUrl) {
    this.runtimeUrl = runtimeUrl;
  }

  processMessage(msg) {
    try {
      let clientMessage = new ClientMessage(this.registry, this, msg);
      clientMessage.dispatch();
    } catch (e) {
      this.logger.info(e);
    }
  }

  reply(msg) {
    this.logger.info('[S->C] emit msg', msg.getJson(), 'to', this.getUid());
    this.socket.emit('message', msg.getJson());
  }

  disconnect() {
    // unallocate url from runtime ?
    this.registry.unbind(this.getRuntimeUrl());
    this.socket.disconnect();
  }
}
module.exports = Client;
