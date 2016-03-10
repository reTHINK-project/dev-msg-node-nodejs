import expect from 'expect.js';
import activate from '../src/js/NodejsProtoStub';
import serverConfig from '../src/configs/server-settings.js';

var chai = require('chai');
var should = chai.should();

describe('NodejsProtoStub', function() {

  let config = {
    url: serverConfig.url + ':' + serverConfig.port,
    runtimeURL: 'runtime:/alice'
  };

  it('runtime connectivity', function(done) {
    let send;

    let seq = 0;
    let proto;

    let bus = {
      postMessage: (msg) => {
        expect(msg).to.be.an('object');
        if (seq === 0) {
          expect(msg).to.eql({
            type: 'update',
            from: 'hyperty-runtime://sp1/protostub/123',
            to: 'hyperty-runtime://sp1/protostub/123/status',
            body: { value: 'connected' }
          });
          proto.disconnect();
        }

        if (seq === 1) {
          // socket.io disconnect event doesn't report rfc compliant reason, exclude this property in test
          if (msg.body.hasOwnProperty('desc')) {
            delete msg.body.desc;
          }

          expect(msg).to.eql({
            type: 'update',
            from: 'hyperty-runtime://sp1/protostub/123',
            to: 'hyperty-runtime://sp1/protostub/123/status',
            body: { value: 'disconnected' }
          });
          done();
        }

        seq++;
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    try {
      proto = activate('hyperty-runtime://sp1/protostub/123', bus, config).instance;
      proto.connect();
    } catch (e) {
      console.log(e);
    }
  });

  it('runtime re-connection', function(done) {
    let protoURL = 'hyperty-runtime://sp1/protostub/1';
    let send;
    let proto;

    let seq = 0;

    let bus = {
      postMessage: (msg) => {
        if (seq === 0) {
          expect(msg).to.eql({
            type: 'update', from: protoURL, to: 'hyperty-runtime://sp1/protostub/1/status',
            body: { value: 'connected' }
          });
          proto._sock.disconnect(); //simulate abnormal close
        }

        if (seq === 1) {
          expect(msg).to.eql({
            type: 'update', from: protoURL, to: 'hyperty-runtime://sp1/protostub/1/status',
            body: { value: 'disconnected', desc: 'io client disconnect' }
          });
          proto.connect();
        }

        if (seq === 2) {
          expect(msg).to.eql({
            type: 'update', from: protoURL, to: 'hyperty-runtime://sp1/protostub/1/status',
            body: { value: 'connected' }
          });

          send({ id: 1, type: 'ping', from: proto.runtimeSession, to: proto.runtimeSession });
        }

        if (seq === 3) {
          expect(msg).to.eql({
            id: 1, type: 'ping', from: proto.runtimeSession, to: proto.runtimeSession,
            body: { via: protoURL }
          });
          proto.disconnect();
        }

        if (seq === 4) {
          expect(msg).to.eql({
            type: 'update', from: protoURL, to: 'hyperty-runtime://sp1/protostub/1/status',
            body: { value: 'disconnected', desc: 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.' }
          });

          done();
        }

        seq++;
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    let config = {
      url: serverConfig.url + ':' + serverConfig.port,
      runtimeURL: 'runtime:/alice-reconnect'
    };

    proto = activate(protoURL, bus, config).instance;
    proto.connect();
  });

});
