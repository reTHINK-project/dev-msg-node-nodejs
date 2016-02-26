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
    let _this = this;

    this._id = 0;

    config.url = config.url.replace(/.*?:\/\//g, '');
    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    this._bus.addListener('*', (msg) => {
      _this._open(() => {
        if (_this._filter(msg)) {
          _this._sock.emit('message', JSON.stringify(msg));
        }
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

  get runtimeSession() {
    return this._runtimeSessionURL;
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
  }

  postMessage(msg) {
    this._sock.send(JSON.stringify(msg));
  }

  _sendOpen(callback) {
    let _this = this;

    _this._id++;
    let msg = {
      id: _this._id,
      type: 'open',
      from: _this._config.runtimeURL,
      to: 'mn:/session'
    };

    //register and wait for open reply...
    let hasResponse = false;
    _this._sessionCallback = function(reply) {

      if (reply.type === 'response' & reply.id === msg.id) {
        hasResponse = true;

        if (reply.body.code === 200) {
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
      id: _this._id,
      type: 'close',
      from: _this._config.runtimeURL,
      to: 'mn:/session'
    };

    _this._sock.send(JSON.stringify(msg));
  }

  _sendStatus(value, reason) {
    let _this = this;

    let msg = {
      type: 'update',
      from: _this._runtimeProtoStubURL,
      to: _this._runtimeProtoStubURL + '/status',
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
    if (!msg.body) msg.body = {};

    msg.body.via = this._runtimeProtoStubURL;

    this._bus.postMessage(msg);
  }

  _open(callback) {
    let _this = this;
    if (!_this._sock) {
      _this._sock = io(_this._config.url, {
        forceNew: true
      });
      _this._sock.on('connect', function() {
        _this._sendOpen(() => {
          callback();
        });
      });

      _this._sock.on('message', function(msg) {
        if (typeof msg !== 'object') {
          try {
            msg = JSON.parse(msg);
          } catch (e) {
            msg = {};
          }
        }

        if (msg.hasOwnProperty('from') && msg.from === 'mn:/session') {
          if (_this._sessionCallback) {
            _this._sessionCallback(msg);
          }
        } else {
          _this._deliver(msg);
        }
      });

      _this._sock.on('disconnect', function(reason) {
        _this._sendStatus('disconnected', reason);
        delete _this._sock;
      });

      _this._sock.on('error', function(reason) {
      });
    } else {
      _this._waitReady(callback);
    }
  }
}

export default function activate(url, bus, config) {
  return {
    name: 'NodejsProtoStub',
    instance: new NodejsProtoStub(url, bus, config)
  };
}
