/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

'use strict';
class Message {

  constructor(msg) {
    if (typeof msg === 'undefined') {
      msg = {};
    } else if (typeof msg === 'string') {
      try {
        msg = JSON.parse(msg);
      } catch (e) {
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
