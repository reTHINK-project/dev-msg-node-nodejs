'use strict';
class SessionManager {

  constructor(name, registry) {
    this.name = name;
    this.registry = registry;
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();

    if (msg.getType() === 'open') {
      this.logger.info('[', this.getName(), '] handle open msg');
      this.registry.bind(msg.getFrom(), clientMessage.getResourceUid());
      clientMessage.getResource().setRuntimeUrl(msg.getFrom());
      clientMessage.replyOK(this.getName());
    }

    if (msg.getType() === 'close') {
      this.logger.info('[', this.getName(), '] handle close msg');
      this.registry.unbind(msg.getFrom());
      clientMessage.disconnect();
    }
  }
}
module.exports = SessionManager;
