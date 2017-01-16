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

var io = require('socket.io-client');

class NodejsProtoStub {

  /**
   * Nodejs ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".s
   * @return {NodejsProtoStub}
   */
  constructor(runtimeProtoStubURL, bus, config) {
    this._id = 0;

    config.url = config.url.replace(/.*?:\/\//g, '');
    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    this._sock = null;

    this._bus.addListener('*', (msg) => {
      //   console.log('event detected', msg);
      this._assumeOpen = true;
      this._sendMsg(msg);
    });
  }

  /**
   * Get the configuration for this ProtoStub
   * @return {Object} - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   */
  get config() {
    return this._config;
  }

  get runtimeSession() {
    return this._runtimeSessionURL;
  }

  /**
   * Try to open the connection to the MessageNode. Connection is auto managed, there is no need to call this explicitly.
   * However, if "disconnect()" is called, it's necessary to call this to enable connections again.
   * A status message is sent to "runtimeProtoStubURL/status", containing the value "connected" if successful, or "disconnected" if some error occurs.
   */
  connect() {
    this._assumeOpen = true;
    return new Promise((resolve, reject) => {
      let _this = this;

      if (this._sock !== null && this._sock.connected) {
        // console.log('io already defined');
        resolve(this._sock);
        return;
      }

      //   console.log('init socket.io');
    if(typeof window === 'undefined'){
          console.log('Node environment');
          this._sock = io.connect('http://'+ this._config.url);
        } else {
          console.log('Browser environment');
          this._sock = io(this._config.url, {
            forceNew: true
          });
        }
      // this._sock = io(this._config.url, {
      //   forceNew: true
      // });
      this._sock.on('connect', function() {
        // console.log('io connected');
        _this._sendOpen();
      });

      this._sock.on('message', function(msg) {
        if (typeof msg !== 'object') {
          try {
            msg = JSON.parse(msg);
          } catch (e) {
            msg = {};
          }
        }

        if (msg.hasOwnProperty('from') && msg.from === 'mn:/session') {
          //   console.log('msg from mn:/session', msg.type, msg.id);
          if (msg.body.code === 200) {
            _this._sendStatus('connected');
          } else {
            _this._sendStatus('disconnected', reply.body.desc);
          }

          resolve(_this._sock);
        } else {
          _this._deliver(msg);
        }
      });

      this._sock.on('disconnect', function(reason) {
        _this._sendStatus('disconnected', reason);
        delete _this._sock;
      });

      this._sock.on('error', function(reason) {
      });
    });
  }

  /**
   * It will disconnect and order to stay disconnected. Reconnection tries, will not be attempted, unless "connect()" is called.
   * A status message is sent to "runtimeProtoStubURL/status" with value "disconnected".
   */
  disconnect() {
    // console.log('disconnect');
    this._sendClose();
    this._assumeOpen = false;
  }

  postMessage(msg) {
    // console.log('postMessage');
    this._sock.send(JSON.stringify(msg));
  }

  _sendMsg(msg) {
    // console.log('_sendMsg', msg);
    if (this._filter(msg)) {
      if (this._assumeOpen)
        this.connect().then(() => {
          //   console.log('then post message', msg);
          this.postMessage(msg);
        });
    }
  }

  _sendOpen() {
    // console.log('_sendOpen');
    this._id++;

    this._sendMsg({
      id: this._id,
      type: 'open',
      from: this._config.runtimeURL,
      to: 'mn:/session'
    });
  }

  _sendClose() {
    // console.log('_sendClose');

    this._id++;
    this._sendMsg({
      id: this._id,
      type: 'close',
      from: this._config.runtimeURL,
      to: 'mn:/session'
    });
  }

  _sendStatus(value, reason) {
    // console.log('_sendStatus', value);

    let msg = {
      type: 'update',
      from: this._runtimeProtoStubURL,
      to: this._runtimeProtoStubURL + '/status',
      body: {
        value: value
      }
    };

    if (reason) {
      msg.body.desc = reason;
    }

    this._bus.postMessage(msg);
  }

  /**
   * Filter method that should be used for every messages in direction: Protostub -> MessageNode
   * @param  {Message} msg Original message from the MessageBus
   * @return {boolean} true if it's to be deliver in the MessageNode
   */
  _filter(msg) {
    if (msg.body && msg.body.via === this._runtimeProtoStubURL)
      return false;
    return true;
  }

  /**
   * Method that should be used to deliver the message in direction: Protostub -> MessageBus (core)
   * @param  {Message} msg Original message from the MessageNode
   */
  _deliver(msg) {
    // console.log('_deliver', msg);
    if (!msg.body) msg.body = {};

    msg.body.via = this._runtimeProtoStubURL;

    this._bus.postMessage(msg);
  }
}

export default function activate(url, bus, config) {
  return {
    name: 'NodejsProtoStub',
    instance: new NodejsProtoStub(url, bus, config)
  };
}
