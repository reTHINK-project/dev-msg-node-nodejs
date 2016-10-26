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
    this.logger.info('handle open msg', msg);

    if (msg.type === 'open') {

      this.logger.info('[', this.name, '] handle open msg');
      clientMessage.getResource().setRuntimeUrl(msg.from);
      clientMessage.replyok(this.name);

      //FIX: this hack should not be here! Maybe there should be a separated message flow to register the runtime SM?
      //slack #dev-msg-node 10/03/2016 5:50PM
      clientMessage.getResource().subscribe(msg.from + '/sm');

    } else if (msg.type === 're-open') {

      this.logger.info('[', this.name, '] handle re-open msg');
      clientMessage.replyok(this.getName());

    } else if (msg.type === 'close') {

      //TODO manage room suppression on ws close
      this.logger.info('[', this.getName(), '] handle close msg');
      this.registry.unbind(msg.from);
      clientMessage.disconnect();

    }
  }
}
module.exports = SessionManager;
