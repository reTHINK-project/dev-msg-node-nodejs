'use strict';
class MsgNode {
  /**
   * Nodejs ProtoStub creation
   * @param  {Object} config - Server configuration.
   * @return {NodejsProtoStub}
   */
  constructor(config) {
    let _this = this;

    this.config = config;

    this.log4js = require('log4js');
    this.log4js.configure(this.config.log4jsConfig, {
      reloadSecs: 60,
      cwd: this.config.logDir
    });
    this.logger = this.log4js.getLogger('server');

    this.app = require('express')();
    this.app.use(this.log4js.connectLogger(this.logger, {
      level: 'auto'
    }));

    this.io = require('socket.io').listen(this.app.listen(this.config.port), {
      transports: [
      'polling',
      'websocket'
      ],
      allowUpgrades: true
    });

    //app.get('/', function (req, res) {
    //  res.sendfile(__dirname + '/index.html');
    //});

    this.io.on('connection', function(socket) {
      socket.emit('new-message', { hello: 'world' });
      socket.on('message', function(data) {
        console.log(data);
      });
    });

    this.logger.info('[S] HTTP & WS server listening on', this.config.port);
  }
}
module.exports = MsgNode;
