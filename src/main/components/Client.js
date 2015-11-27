'use strict';
let Message = require('./Message');
let ClientMessage = require('./ClientMessage');

class Client {

  constructor(registry, socket) {
    this.registry = registry;
    this.uid = socket.handshake.sessionID;
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
    this.logger.info('[S->C] emit msg', msg, 'to', this.getUid());
//    this.registry.getWSServer().to(this.registry.resolve(msg.getTo())).emit();
    this.socket.emit('message', msg);
  }
  
  disconnect() {
    this.socket.disconnect();
  }
}
module.exports = Client;
