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
class SessionManager {

  constructor(name, registry) {
    this.name = name;
    this.registry = registry;
    this.logger = this.registry.getLogger();
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();

    if (msg.getType() === 'open') {

      this.logger.info('[', this.getName(), '] handle open msg');
      clientMessage.getResource().setRuntimeUrl(msg.getFrom());
      clientMessage.replyOK(this.getName());

    } else if (msg.getType() === 're-open') {

      this.logger.info('[', this.getName(), '] handle re-open msg');
      clientMessage.replyOK(this.getName());

    } else if (msg.getType() === 'close') {

      //TODO manage room suppression on ws close
      this.logger.info('[', this.getName(), '] handle close msg');
      this.registry.unbind(msg.getFrom());
      clientMessage.disconnect();

    }
  }
}
module.exports = SessionManager;
