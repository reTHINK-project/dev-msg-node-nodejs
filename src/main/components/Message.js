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
    if (!msg.hasOwnProperty('body')) {
      msg.body = {};
    }
    this.msg = msg;
  }

  getJson() {
    return this.msg;
  }

  getBody() {
    return this.msg.body;
  }

  getId() {
    return this.msg.id;
  }

  setId(id) {
    this.msg.id = id;
    return this;
  }

  getFrom() {
    return this.msg.from;
  }

  setFrom(from) {
    this.msg.from = from;
    return this;
  }

  getTo() {
    return this.msg.to;
  }

  setTo(to) {
    this.msg.to = to;
    return this;
  }

  getType() {
    return this.msg.type;
  }

  setType(type) {
    this.msg.type = type;
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
    return JSON.stringify(this.msg.msg);
  }
}
module.exports = Message;
