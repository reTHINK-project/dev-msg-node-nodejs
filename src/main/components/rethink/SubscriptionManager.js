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

    let resourceURL = body.resource;
    let children = body.childrenResources;

    if (resourceURL != null) {
      if (msg.getType() === 'subscribe') {
        this.logger.info('[', this.getName(), '] handle subscribe of', msg.getFrom(), 'for url', resourceURL + '/changes');
        clientMessage.getResource().subscribe(resourceURL + '/changes');

        if (children != null) {
          children.forEach(function(child) {
            clientMessage.getResource().subscribe(resourceURL + '/children/' + child);
          });
        }

        clientMessage.replyOK(this.getName());
      } else if (msg.getType() === 'unsubscribe') {
        this.logger.info('[', this.getName(), '] handle unsubscribe of', msg.getFrom(), 'for url', resourceURL + '/changes');

        clientMessage.getResource().unsubscribe(resourceURL + '/changes');

        if (children != null) {
          children.forEach(function(child) {
            clientMessage.getResource().unsubscribe(resourceURL + '/children/' + child);
          });
        }

        clientMessage.replyOK(this.getName());
      } else {
        clientMessage.replyError(name, 'Unrecognized type "' + msg.getType() + '"');
      }
    } else {
      clientMessage.replyError(name, 'No mandatory field "body.resource"');
    }
  }
}
module.exports = SubscriptionManager;
