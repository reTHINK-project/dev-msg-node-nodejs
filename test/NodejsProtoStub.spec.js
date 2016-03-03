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
            body: { value: 'disconnected', desc: 'No status code was actually present.' }
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

  it('hyperty registration', function(done) {
    let protoURL = 'hyperty-runtime://sp1/protostub/123';
    let send;
    let proto;

    let seq = 0;
    let firstURL;
    let secondURL;

    let bus = {
      postMessage: (msg) => {
        if (seq === 0) {
          expect(msg).to.eql({
            type: 'update', from: protoURL, to: 'hyperty-runtime://sp1/protostub/123/status',
            body: { value: 'connected' }
          });
        }

        if (seq === 1) {
          /*expect something like -> {
            id: 1, type: 'response', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: 'runtime:/alice/registry/allocation',
            body: {code: 200, allocated: ['hyperty-instance://ua.pt/fbf7dc26-ff4f-454f-961e-22edda927561', 'hyperty-instance://ua.pt/6e8f126b-1c56-4525-9a38-5dcd340194da']}
          }*/

          expect(msg).to.eql({ id: 1, type: 'response', from: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation', to: 'runtime:/alice/registry/allocation', body: msg.body });

          expect(msg.body.code).to.eql(200);
          expect(msg.body.value.allocated).to.have.length(2);

          firstURL = msg.body.value.allocated[0];
          secondURL = msg.body.value.allocated[1];

          send({ id: 1, type: 'ping', from: firstURL, to: secondURL });
        }

        if (seq === 2) {
          expect(msg).to.eql({
            id: 1, type: 'ping', from: firstURL, to: secondURL,
            body: { via: protoURL }
          });

          proto.disconnect();
          done();
        }

        seq++;
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    proto = activate(protoURL, bus, config).instance;

    send({
      id: 1, type: 'create', from: 'runtime:/alice/registry/allocation', to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation',
      body: { value: { number: 2 } }
    });
  });

  it('hyperty hello', function(done) {
    let aliceSend;
    let bobSend;

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
            body: { value: 'connected' }
          });

          bob = activate('hyperty-runtime://sp1/protostub/123', bobBus, bobConfig).instance;
          bob.connect();

          aliceSend({
            id: 1, type: 'create', from: 'runtime:/alice/registry/allocation', to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation',
            body: { value: { number: nbUrl } }
          });
        }

        if (seqAlice === 1) {
          expect(msg.body.value.allocated).to.have.length(nbUrl);
          aliceUrl = msg.body.value.allocated[0];
        }

        if (seqAlice === 2) {
          expect(msg.body.message).to.eql('hello');

          aliceSend({
            id: 1,
            from: aliceUrl,
            to: bobUrl,
            body: { message: 'world' }
          });
        }

        seqAlice++;
      },

      addListener: (url, callback) => {
        aliceSend = callback;
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
            body: { value: 'connected' }
          });

          bobSend({
            id: 1,
            type: 'create',
            from: 'hyperty-runtime:/bob/registry/allocation',
            to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation',
            body: { value: { number: nbUrl } }
          });
        }

        if (seqBob === 1) {
          expect(msg.body.value.allocated).to.have.length(nbUrl);
          bobUrl = msg.body.value.allocated[0];

          bobSend({
            id: 1,
            from: bobUrl,
            to: aliceUrl,
            body: { message: 'hello' }
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
        bobSend = callback;
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
    } catch (e) {
      console.log(e);
    }
  });

  it('object registration', function(done) {
    let protoURL = 'hyperty-runtime://sp1/protostub/123';
    let send;
    let proto;

    let seq = 0;
    let url;
    let urlChildren;

    let bus = {
      postMessage: (msg) => {
        if (seq === 0) {
          expect(msg).to.eql({
            type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status',
            body: { value: 'connected' }
          });
        }

        if (seq === 1) {
          expect(msg).to.eql({ id: 1, type: 'response', from: 'domain://msg-node.' + serverConfig.url  + '/object-address-allocation', to: 'runtime:/alice/registry/allocation', body: msg.body });
          expect(msg.body.code).to.eql(200);
          expect(msg.body.value.allocated).to.have.length(1);

          url = msg.body.value.allocated[0];
          urlChildren = url + '/children/message';

          send({ id: 1, type: 'ping', from: url, to: urlChildren });
        }

        if (seq === 2) {
          expect(msg).to.eql({
            id: 1, type: 'ping', from: url, to: urlChildren,
            body: { via: protoURL }
          });

          proto.disconnect();
          done();
        }

        seq++;
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    proto = activate('hyperty-runtime://sp1/protostub/123', bus, config).instance;

    send({
      id: 1, type: 'create', from: 'runtime:/alice/registry/allocation', to: 'domain://msg-node.' + serverConfig.url  + '/object-address-allocation',
      body: { scheme: 'fake', childrenResources: ['message'], value: { number: 1 } }
    });
  });

});
