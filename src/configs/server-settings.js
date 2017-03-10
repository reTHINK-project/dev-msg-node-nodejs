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

/*jslint nomen: true*/
var path = require('path');

module.exports = {
  MNdomain: process.env.MNdomain || 'localhost',
  domainRegistryUrl: process.env.domainRegistryUrl || 'http://localhost:4567',
  redisURL:process.env.redisURL || 'localhost',
  port: process.env.PORT || '9090',
  ioConfig: {
    transports: [
      'polling',
      'websocket'
    ],
    allowUpgrades: true,
    forceNew: true //needed for test
  },
  log4jsConfig: __dirname + '/log-conf.json',
  logLevel: process.env.logLevel || 'ERROR',
  logDir: process.env.logDir || path.resolve(path.join(__dirname, '../../', '/logs')),
  sessionCookieName: 'rethink.express.sid',
  sessionCookieSecret: '88HpNxVxm5k94AY2',
  useSSL: process.env.useSSL || false,
  sslCertificate: process.env.sslCertificate || path.resolve(path.join(__dirname, '../../', '/') + '/server.crt'),
  sslPKey: process.env.sslPKey || path.resolve(path.join(__dirname, '../../', '/') + '/key.pem')
};
