'use strict';
class RegistryManager {

  constructor(name, registry) {
    this.name = name;
    this.registry = registry;
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();

    let url = msg.getBody().url;
    if (url != null) {
      clientMessage.replyError(this.getName(), 'No url present in body!');
      return;
    }

    if (msg.getType() === 'add') {
      this.logger.info('[', this.getName(), '] handle add msg');
      this.registry.bind(url, clientMessage.getResourceUid());
      clientMessage.replyOK(this.getName());
    }

    if (msg.getType() === 'remove') {
      this.logger.info('[', this.getName(), '] handle remove msg');
      this.registry.unbind(url);
      clientMessage.replyOK(this.getName());
    }
  }
}
module.exports = RegistryManager;
