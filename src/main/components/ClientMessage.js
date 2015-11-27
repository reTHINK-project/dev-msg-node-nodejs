'use strict';
let Message = require('./Message');

class ClientMessage {

  constructor(registry, client, msg) {
    this.registry = registry;
    this.client = client;
    this.msg = msg;
    this.logger = registry.getLogger();
  }

  getMessage() {
    return this.msg;
  }

  getRuntimeUrl() {
    return this.client.getRuntimeUrl();
  }

  getResource() {
    return this.client;
  }

  getResourceUid() {
    return this.client.getUid();
  }

  dispatch() {
    let url = this.registry.resolve(this.msg.getTo());
    if (url !== false) {
      this.logger.info('[ClientMessage] "to" was resolved, publish msg to', url);

      //TODO publish message on MessageBus
      let msgBus = this.registry.getComponent('MessageBus');
      msgBus.publish(url, this.msg.toString());
    } else {
      let comp = this.registry.getComponent(this.msg.getTo());
      this.logger.info('[ClientMessage] url not found, publish msg to', comp.getName());
      if (comp != null) {
        try {
          comp.handle(this);
        } catch (e) {
          this.replyError(comp.getName(), e);
        }
      }
    }
  }

  reply(msg) {
    this.client.reply(msg);
  }

  replyOK(from) {
    let reply = new Message();
    reply.setId(this.msg.getId());
    reply.setFrom(from);
    reply.setTo(this.msg.getFrom());
    reply.setReplyCode('ok');
    this.client.reply(reply);
  }

  replyError(from, error) {
    let reply = new Message();
    reply.setId(this.msg.getId());
    reply.setFrom(from);
    reply.setTo(this.msg.getFrom());
    reply.setReplyCode('error');
    reply.setErrorDescription(error);
    this.client.reply(reply);
  }

  disconnect() {
    this.client.disconnect();
  }
}
module.exports = ClientMessage;
