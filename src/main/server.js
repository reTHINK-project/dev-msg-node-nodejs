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

//'use strict';
var path = require('path');
var MsgNode = require('./MsgNode');

//var configs = require('./server-settings.js');
var configs = require(path.resolve(path.join(__dirname, '../', '/configs/server-settings.js')));

//var configs = {
//  port: 8080,
//  log4jsConfig: path.resolve(path.join(__dirname, '../', '/configs/log-conf.json')),
//  logDir: path.resolve(path.join(__dirname, '../../', '/logs'))
//};

var args = process.argv.slice(2);
if (args.length) {
  configs.port = args[0];
}

var node = new MsgNode(configs);
