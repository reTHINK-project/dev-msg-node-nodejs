'use strict';
class Message {
	
  constructor(msg) {
    if (typeof msg === 'undefined') {
      msg = {};
    } else if (typeof msg === 'string') {
      try {
        msg = JSON.parse(msg);
      } catch(e) {
        msg = {};
      }
    }
    if (!msg.hasOwnProperty('header')) {
      msg.header = {};
    }
    if (!msg.hasOwnProperty('body')) {
      msg.body = {};
    }
    this.msg = msg;
  }

  getJson() {
    return this.msg;
  }

  getHeader() {
    return this.msg.header;
  }

  getBody() {
    return this.msg.body; 
  }

  getId() {
    return this.getHeader().id;
  }
  
  setId(id) {
    this.msg.header.id = id;
    return this;
  }

  getFrom() {
    return this.getHeader().from;
  }
  
  setFrom(from) {
    this.msg.header.from = from;
    return this;
  }

  getTo() {
    return this.getHeader().to;
  }
  
  setTo(to) {
    this.msg.header.to = to;
    return this;
  }

  getType() {
    return this.getHeader().type;
  }
  
  setType(type) {
    this.msg.header.type = type;
    return this;
  }

  getReplyCode() {
    return this.getBody().code;
  }
  
  setReplyCode(code) {
    this.msg.body.code = code;
    return this;
  }

  getErrorDescription() {
    return this.getBody().desc;
  }
  
  setErrorDescription(desc) {
    this.msg.body.desc = desc;
    return this;
  }

  toString() {
    return JSON.stringify(msg);
  }
}
module.exports = Message;