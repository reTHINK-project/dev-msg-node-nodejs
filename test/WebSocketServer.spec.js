import expect from 'expect.js';
import NodejsProtoStub from '../src/js/NodejsProtoStub';
import serverConfig from '../src/configs/server-settings.js';

var chai = require('chai');
var should = chai.should();

describe('WS server', function() {
  var io = require('socket.io-client');

  it('echo message', function(done) {
    var client = io.connect(serverConfig.url + ':' + serverConfig.port, serverConfig.ioConfig, {
      query: 'session_id=' + ''
    });

    client.once('connect', function() {
      var msg = 'hello';
      client.once('echo', function(message) {
        message.should.equal(msg);
        client.disconnect();
        done();
      });

      client.emit('echo', msg);
    });
  });

});
