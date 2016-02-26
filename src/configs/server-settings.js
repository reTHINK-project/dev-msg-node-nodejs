/*jslint nomen: true*/
var path = require('path');

module.exports = {
  url: 'apizee.nico',
  domainRegistryUrl: 'http://registry-domain.apizee.nico',
  port: 9090,
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
