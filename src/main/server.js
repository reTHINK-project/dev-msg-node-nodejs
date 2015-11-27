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
