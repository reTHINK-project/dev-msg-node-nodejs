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

  publish(url, msgString) {
    this.logger.info('[S] publish message to url');
    //TODO publish msg on bus
  }

  onEvent() {
    //listen and dispatch message from bus
  }
}
module.exports = MessageBus;