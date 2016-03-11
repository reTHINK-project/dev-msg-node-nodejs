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
class MessageBus {

  constructor(name, registry) {
    this.name = name;
    this.registry = registry;
    this.logger = this.registry.getLogger();

    //TODO manage redis pub/sub client
  }

  getName() {
    return this.name;
  }

  // publish(url, msgString) {
  //   this.logger.info('[' + this.getName() + '] publish', msgString, 'to', url);
  //   this.registry.getWSServer().to(url).emit('message', msgString);
  // }

  publish(url, msgString) {
    let io = this.registry.getWSServer();
    let room = io.sockets.adapter.rooms[url];

    this.logger.info('[' + this.getName() + '] publish', msgString, 'to room', url);
    if (typeof room !== 'undefined') {
      this.logger.debug('[' + this.getName() + ']', room.length, ' sockets in room');
    } else {
      this.logger.error('[' + this.getName() + '] no socket in room', url);
    }

    this.registry.getWSServer().to(url).emit('message', msgString);
  }

  onEvent() {
    //listen and dispatch message from bus
  }
}
module.exports = MessageBus;
