/*jslint nomen: true*/
var path = require('path');

module.exports = {
  url: 'localhost',
  port: 9080,
  ioConfig: {
    transports: [
      'polling',
      'websocket'
    ],
    allowUpgrades: true,
    forceNew: true //needed for test
  },
  log4jsConfig: __dirname + '/log-conf.json',
  logDir: path.resolve(path.join(__dirname, '../../', '/logs')),
  sessionCookieName: 'rethink.express.sid',
  sessionCookieSecret: '88HpNxVxm5k94AY2'
};
