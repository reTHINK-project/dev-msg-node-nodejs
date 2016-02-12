'use strict';
let Message = require('./Message');
let ClientMessage = require('./ClientMessage');

class Client {

  constructor(registry, socket) {
    this.registry = registry;
    this.uid = socket.id;//socket.handshake.sessionID;
    this.socket = socket;
    this.logger = this.registry.getLogger();
    this.runtimeUrl = null;
  }

  getUid() {
    return this.uid;
  }

  getRuntimeUrl() {
    return this.runtimeUrl;
  }

  setRuntimeUrl(runtimeUrl) {
    this.runtimeUrl = runtimeUrl;
  }

  processMessage(msg) {
    try {
      let clientMessage = new ClientMessage(this.registry, this, msg);
      clientMessage.dispatch();
    } catch (e) {
      this.logger.info(e);
    }
  }

  reply(msg) {
    this.logger.info('[S->C] emit msg', msg.getJson(), 'to', this.getUid());
    this.socket.emit('message', msg.getJson());
  }

  disconnect() {
    // unallocate url from runtime ?
    this.registry.unbind(this.getRuntimeUrl());
    this.socket.disconnect();
  }
}
module.exports = Client;
