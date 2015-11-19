/*jslint nomen: true*/
/*global
module, require, __dirname
*/
var path = require('path');

module.exports = {
  port: 8080,
  log4jsConfig: path.join(__dirname, '../', '/configs/log-conf.json'),
  logDir: path.join(__dirname, '../../', '/logs')
};
