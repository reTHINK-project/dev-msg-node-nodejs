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
let uuid = require('uuid');

class AddressAllocationManager {
  constructor(name, registry) {
    this.registry = registry;
    this.mnPersist = this.registry.getComponent('mn:/MNpersistManager');
    this.name = name;
    this.baseURL = 'hyperty://' + this.registry.getDomain() + '/';
    this.logger = this.registry.getLogger();
    this.allocationKeyList = [];
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();
    let body = msg.getBody();
    let number = 0;
    let allocationKey = null;
    let childrenResources = null;

    if (typeof body.value != 'undefined') {
      if (typeof body.value.number !== 'undefined') {
        number = body.value.number;
      }

      if (typeof body.value.allocationKey !== 'undefined') {
        allocationKey = body.value.allocationKey;
      }

      if (typeof body.value.childrenResources !== 'undefined') {
        childrenResources = body.value.childrenResources;
      }
    }

    if (msg.getType() === 'create') {

      this.logger.info('[', this.getName(), '] handle create msg');
      this.logger.info('--------------------------------------  this.mnPersist',   this.mnPersist);

      let allocated = this.allocate(clientMessage, number);

      if (allocationKey !== null) {
        this.logger.info('[', this.getName(), '] associate', number, 'URLs for allocation key', allocationKey);
        this.allocationKeyList[allocationKey] = allocated;
      }

      let reply = new Message();
      reply.setId(msg.getId());
      reply.setFrom(this.name);
      reply.setTo(msg.getFrom());
      reply.setType('response');
      reply.setReplyCode(200);
      reply.getBody().value = {};
      reply.getBody().value.allocated = allocated;

      clientMessage.reply(reply);

    } else if (msg.getType() === 'delete') {

      this.logger.info('[', this.getName(), '] handle delete msg');

      // delete Block by allocation key
      if (allocationKey !== null && allocationKey in this.allocationKeyList) {
        this.logger.info('[', this.getName(), '] deallocate', this.allocationKeyList[key].length, 'from body allocation key', allocationKey);
        this.allocationKeyList[key].forEach((val) => {
          this.deallocate(clientMessage, val);
        });
      }

      // delete dedicated address(es)
      if (childrenResources !== null) {
        this.logger.info('[', this.getName(), '] deallocate', childrenResources.length, 'from body childrenResources');
        childrenResources.forEach((val) => {
          this.deallocate(clientMessage, val);
        });
      }

      clientMessage.replyok(this.name);
    }
  }

  allocate(clientMessage, number) {
    let list = [];
    let i;
    for (i = 0; i < number; i++) {
      let url = this.baseURL + uuid.v4();
      list.push(url);
      clientMessage.getResource().subscribe(url);
    }

    this.logger.info('[' + this.getName() + '] allocate URLs', list);
    return list;
  }

  deallocate(clientMessage, url) {
    clientMessage.getResource().unsubscribe(url);
  }
}
module.exports = AddressAllocationManager;
