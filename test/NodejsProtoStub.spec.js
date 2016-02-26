import expect from 'expect.js';
import activate from '../src/js/NodejsProtoStub';
import serverConfig from '../src/configs/server-settings.js';

var chai = require('chai');
var should = chai.should();

describe('NodejsProtoStub', function() {

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
            body: {value: 'connected'}
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
            body: {value: 'disconnected'}
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
      runtimeURL: 'runtime:/alice1'
    };
    try {
      proto = activate('hyperty-runtime://sp1/protostub/123', bus, config).instance;
      proto.connect();
    } catch (e) {
      console.log(e);
    }
  });

  it('hyperty registration', function(done) {
    let send;

    let seq = 0;
    let proto;
    let nbUrl = 2;

    let bus = {
      postMessage: (msg) => {
        expect(msg).to.be.an('object');
        if (seq === 0) {
          expect(msg).to.eql({
            type: 'update',
            from: 'hyperty-runtime://sp1/protostub/123',
            to: 'hyperty-runtime://sp1/protostub/123/status',
            body: {value: 'connected'}
          });

          proto.postMessage({
            id: 1,
            type: 'create',
            from: 'hyperty-runtime:/alice/registry/allocation',
            to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation',
            body: {number: nbUrl}
          });
        }

        if (seq === 1) {
          expect(msg).to.eql({id: 1, type: 'response', from: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation', to: 'hyperty-runtime:/alice/registry/allocation', body: msg.body});
          expect(msg.body.code).to.eql(200);
          expect(msg.body.allocated).to.have.length(nbUrl);
          msg.body.allocated.forEach(function(v) {
            expect(v).to.match(/^hyperty:\/\/[a-z0-9-\.]+\/[a-z0-9-]{36}/); //uuid of 36 characters length
          });

          done();
          proto.disconnect();
        }

        seq++;
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    let config = {
      url: serverConfig.url + ':' + serverConfig.port,
      runtimeURL: 'runtime:/alice'
    };

    try {
      proto = activate('hyperty-runtime://sp1/protostub/123', bus, config).instance;
      proto.connect();
    } catch (e) {
      console.log(e);
    }
  });

  it('hyperty hello', function(done) {
    let send;

    let seqAlice = 0;
    let seqBob = 0;
    let alice;
    let bob;
    let nbUrl = 1;

    let aliceUrl;
    let bobUrl;

    let aliceBus = {
      postMessage: (msg) => {
        expect(msg).to.be.an('object');
        if (seqAlice === 0) {
          expect(msg).to.eql({
            type: 'update',
            from: 'hyperty-runtime://sp1/protostub/123',
            to: 'hyperty-runtime://sp1/protostub/123/status',
            body: {value: 'connected'}
          });

          bob.connect();

          alice.postMessage({
            id: 1,
            type: 'create',
            from: 'hyperty-runtime:/alice/registry/allocation',
            to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation',
            body: {number: nbUrl}
          });
        }

        if (seqAlice === 1) {
          expect(msg.body.allocated).to.have.length(nbUrl);
          aliceUrl = msg.body.allocated[0];
        }

        if (seqAlice === 2) {
          expect(msg.body.message).to.eql('hello');

          alice.postMessage({
            id: 1,
            from: aliceUrl,
            to: bobUrl,
            body: {message: 'world'}
          });
        }

        seqAlice++;
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    let bobBus = {
      postMessage: (msg) => {
        expect(msg).to.be.an('object');
        if (seqBob === 0) {
          expect(msg).to.eql({
            type: 'update',
            from: 'hyperty-runtime://sp1/protostub/123',
            to: 'hyperty-runtime://sp1/protostub/123/status',
            body: {value: 'connected'}
          });

          bob.postMessage({
            id: 1,
            type: 'create',
            from: 'hyperty-runtime:/bob/registry/allocation',
            to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation',
            body: {number: nbUrl}
          });
        }

        if (seqBob === 1) {
          expect(msg.body.allocated).to.have.length(nbUrl);
          bobUrl = msg.body.allocated[0];
          bob.postMessage({
            id: 1,
            from: bobUrl,
            to: aliceUrl,
            body: {message: 'hello'}
          });
        }

        if (seqBob === 2) {
          expect(msg.body.message).to.eql('world');
          alice.disconnect();
          bob.disconnect();
          done();
        }

        seqBob++;
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    let aliceConfig = {
      url: serverConfig.url + ':' + serverConfig.port,
      runtimeURL: 'runtime:/alice'
    };

    let bobConfig = {
      url: serverConfig.url + ':' + serverConfig.port,
      runtimeURL: 'runtime:/bob'
    };

    try {
      alice = activate('hyperty-runtime://sp1/protostub/123', aliceBus, aliceConfig).instance;
      alice.connect();
      bob = activate('hyperty-runtime://sp1/protostub/123', bobBus, bobConfig).instance;

    } catch (e) {
      console.log(e);
    }
  });

});
