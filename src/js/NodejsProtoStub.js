var io = require('socket.io-client');

export default class NodejsProtoStub {

  /**
   * Vertx ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {NodejsProtoStub}
   */
  constructor(runtimeProtoStubURL, bus, config) {
    let _this = this;

    this._id = 0;
    this._continuousOpen = true;

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    bus.addListener('*', (msg) => {
      _this._open(() => {
        _this._sock.emit('message', JSON.stringify(msg));
      });
    });
  }

  /**
   * Get the configuration for this ProtoStub
   * @return {Object} - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   */
  get config() {
    return this._config;
  }

  /**
   * Try to open the connection to the MessageNode. Connection is auto managed, there is no need to call this explicitly.
   * However, if "disconnect()" is called, it's necessary to call this to enable connections again.
   * A status message is sent to "runtimeProtoStubURL/status", containing the value "connected" if successful, or "disconnected" if some error occurs.
   */
  connect() {
    let _this = this;

    _this._open(() => {});
  }

  /**
   * It will disconnect and order to stay disconnected. Reconnection tries, will not be attempted, unless "connect()" is called.
   * A status message is sent to "runtimeProtoStubURL/status" with value "disconnected".
   */
  disconnect() {
    let _this = this;

    if (_this._sock) {
      _this._sendClose();
    }

    _this._sock.disconnect();
  }

  _sendOpen(callback) {
    console.warn('###_sendOpen ok');
    let _this = this;

    _this._id++;
    let msg = {
      header: {
        id: _this._id,
        type: 'open',
        from: _this._config.runtimeURL,
        to: 'mn:/session',
        tokenID: '??'
      }
    };

    //register and wait for open reply...
    let hasResponse = false;
    _this._sessionCallback = function(reply) {
      if (reply.header.type === 'reply' & reply.header.id === msg.header.id) {
        hasResponse = true;
        if (reply.body.code === 'ok') {
          _this._sendStatus('connected');
          callback();
        } else {
          _this._sendStatus('disconnected', reply.body.desc);
        }
      }
    };

    _this._sock.send(JSON.stringify(msg));
    setTimeout(() => {
      if (!hasResponse) {
        //no response after x seconds...
        _this._sendStatus('disconnected', 'Timeout from mn:/session');
      }
    }, 3000);
  }

  _sendClose() {
    let _this = this;

    _this._id++;
    let msg = {
      header: {
        id: _this._id,
        type: 'close',
        from: _this._config.runtimeURL,
        to: 'mn:/session',
        tokenID: '??'
      }
    };

    _this._sock.send(JSON.stringify(msg));
  }

  _sendStatus(value, reason) {
    let _this = this;

    let msg = {
      header: {
        type: 'update',
        from: _this._runtimeProtoStubURL,
        to: _this._runtimeProtoStubURL + '/status'
      },
      body: {
        value: value
      }
    };

    if (reason) {
      msg.body.desc = reason;
    }

    _this._bus.postMessage(msg);
  }

  _waitReady(callback) {
    let _this = this;

    if (_this._sock.readyState === 1) {
      callback();
    } else {
      setTimeout(() => {
        _this._waitReady(callback);
      });
    }
  }

  _open(callback) {
    
    let _this = this;

    if (!_this._sock) {

      _this._sock = io(_this._config.url);

      _this._sock.on('connect', function() {
        _this._sendOpen(() => {
          callback();
        });
      });

      _this._sock.on('message', function(msg) {
        var msg = JSON.parse(msg);
        console.log('#########');
        console.log(msg);
        console.log(msg.header);
        console.log(msg.body);
        if (msg.header.from === 'mn:/session') {
          if (_this._sessionCallback) {
            _this._sessionCallback(msg);
          }
        } else {
          _this._bus.postMessage(msg);
        }
      });

      _this._sock.on('disconnect', function(event) {
        let reason;

        //See https://tools.ietf.org/html/rfc6455#section-7.4
        if (event.code == 1000) {
          reason = 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
        } else if (event.code == 1001) {
          reason = 'An endpoint is \'going away\', such as a server going down or a browser having navigated away from a page.';
        } else if (event.code == 1002) {
          reason = 'An endpoint is terminating the connection due to a protocol error';
        } else if (event.code == 1003) {
          reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
        } else if (event.code == 1004) {
          reason = 'Reserved. The specific meaning might be defined in the future.';
        } else if (event.code == 1005) {
          reason = 'No status code was actually present.';
        } else if (event.code == 1006) {
          reason = 'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
        } else if (event.code == 1007) {
          reason = 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).';
        } else if (event.code == 1008) {
          reason = 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
        } else if (event.code == 1009) {
          reason = 'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
        } else if (event.code == 1010) {
          reason = 'An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\'t return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ' + event.reason;
        } else if (event.code == 1011) {
          reason = 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
        } else if (event.code == 1015) {
          reason = 'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).';
        } else {
          reason = 'Unknown reason';
        }

        _this._sendStatus('disconnected', reason);
        delete _this._sock;
      });

    } else {
      _this._waitReady(callback);
    }
  }
}

/**
* Callback used to send messages
* @callback PostMessage
* @param {Message} msg - Message to send
*/
