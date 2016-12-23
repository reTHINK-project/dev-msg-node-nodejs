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
class SubscriptionManager {

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
    let body = msg.getBody();
    let resources;
    let source;
    // this.logger.info('----------------------SubscriptionManager---------------------msg :', msg )

    if (msg.getType() === 'subscribe') {
      resources = body.subscribe;
      clientMessage.getResource().subscribe((typeof body.source !== 'undefined') ? body.source : msg.getFrom());

      if (resources) {
        this.logger.info('[', this.getName(), '] handle subscribe of', msg.getFrom(), 'for resources', resources);
        resources.forEach(function(child) {
          clientMessage.getResource().subscribe(child);
        });
      } else {
        this.logger.error('[', this.getName(), '] no subscribe resources available in msg.body', resources);
      }

      clientMessage.replyok(this.getName());
    } else if (msg.getType() === 'unsubscribe') {

      resources = body.unsubscribe;

      if (resources) {
        this.logger.info('[', this.getName(), '] handle unsubscribe of', msg.getFrom(), 'for resources', resources);
        resources.forEach(function(child) {
            clientMessage.getResource().unsubscribe(child);
          });
      } else {
        this.logger.error('[', this.getName(), '] no unsubscribe resources available in msg.body', resources);
      }

      clientMessage.replyok(this.getName());
    } else {
      clientMessage.replyError(name, 'Unrecognized type "' + msg.getType() + '"');
    }
  }
}
module.exports = SubscriptionManager;
