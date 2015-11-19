'use strict';
var path = require("path");
var MsgNode = require('./MsgNode');

var configs = require(path.join(__dirname, '../../', 'server-settings.js'));

new MsgNode(configs);