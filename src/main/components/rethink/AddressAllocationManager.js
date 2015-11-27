'use strict';
let Message = require('./../Message');
let uuid = require('uuid');

class AddressAllocationManager {
  constructor(registry) {
    this.registry = registry;
    this.name = 'domain://msg-node.' + this.registry.getDomain()  + '/hyperty-address-allocation';
    this.baseURL = 'hyperty-instance://' + this.registry.getDomain() + '/';
    this.logger = this.registry.getLogger();
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();

    if (msg.getType() === 'create') {
      this.logger.info('[', this.getName(), '] handle create msg');
      let number = msg.getBody().number;
      let allocated = this.allocate(clientMessage, number);

      let reply = new Message();
      reply.setId(msg.getId());
      reply.setFrom(this.name);
      reply.setTo(msg.getFrom());
      reply.setReplyCode('ok');

      reply.body.allocated = allocated;

      clientMessage.reply(reply);
    }
  }

  allocate(clientMessage, number) {
    let list = [];
    let i;
    for (i = 0; i < number; i++) {
      let url = this.baseURL + uuid.v4();
      if (this.registry.allocate(url, clientMessage.getRuntimeUrl())) {
        list.push(url);
      }
    }

    this.logger.info('[', this.getName(), '] allocate URLs', list);
    return list;
  }
}
module.exports = AddressAllocationManager;
