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
    let _this = this;
    let msg = clientMessage.getMessage();
    this.logger.info('[', this.getName(), '] handle registry message');
    this.registryConnector.processMessage(msg, function(res) {
      _this.logger.info('[', _this.getName(), '] Reply from domain registry', res);

      let reply = new Message();
      reply.setId(msg.getId());
      reply.setFrom(_this.getName());
      reply.setTo(msg.getFrom());
      reply.setReplyCode(200);
      reply.body = msg.getJson();
      clientMessage.reply(reply);
    });
  }
}
module.exports = RegistryManager;
