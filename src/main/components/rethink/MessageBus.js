'use strict';
class MessageBus {

  constructor(name, registry, io) {
    this.name = name;
    this.registry = registry;
    this.logger = this.registry.getLogger();
    this.io = io;

    //TODO manage redis pub/sub client
  }

  getName() {
    return this.name;
  }

  publish(url, msgString) {
    this.logger.info('[' + this.getName() + '] publish', msgString, 'to url', url);
    if (url.startsWith('runtime:/')) {
      url = this.registry.resolve(url);
      this.logger.info('corresponding to socket', url);
    }
    console.log(this.io.sockets.connected[url]);
    this.io.to(url).emit('message', msgString);
  }

  onEvent() {
    //listen and dispatch message from bus
  }
}
module.exports = MessageBus;
