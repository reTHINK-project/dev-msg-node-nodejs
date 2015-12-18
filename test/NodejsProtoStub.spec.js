import expect from 'expect.js';
import NodejsProtoStub from '../src/js/NodejsProtoStub';
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
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
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
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
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
      proto = new NodejsProtoStub('hyperty-runtime://sp1/protostub/123', bus, config);
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
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
            body: {value: 'connected'}
          });
          
          proto.postMessage({
            header: {id: 1, type: 'create', from: 'hyperty-runtime:/alice/registry/allocation', to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation'},
            body: {number: nbUrl}
          });
        }

        if (seq === 1) {
          expect(msg.header).to.eql({id: 1, type: 'reply', from: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation', to: 'hyperty-runtime:/alice/registry/allocation'});
          expect(msg.body.code).to.eql('ok');
          expect(msg.body.allocated).to.have.length(nbUrl);
          msg.body.allocated.forEach(function(v) {
            expect(v).to.match(/^hyperty:\/\/localhost\/[a-z0-9-]{36}/); //uuid of 36 characters length
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
      proto = new NodejsProtoStub('hyperty-runtime://sp1/protostub/123', bus, config);
      proto.connect();
    } catch (e) {
      console.log(e);
    }
  });
  
  it('hyperty hello', function(done) {
    let send;

    let seqAlice = 0;
    let seqBob = 0;
    let alice, bob;
    let nbUrl = 1;
    
    let aliceUrl, bobUrl;

    let aliceBus = {
      postMessage: (msg) => {
        expect(msg).to.be.an('object');
        if (seqAlice === 0) {
          expect(msg).to.eql({
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
            body: {value: 'connected'}
          });
          
          bob.connect();
          
          alice.postMessage({
            header: {id: 1, type: 'create', from: 'hyperty-runtime:/alice/registry/allocation', to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation'},
            body: {number: nbUrl}
          });
        }

        if (seqAlice === 1) {
          expect(msg.body.allocated).to.have.length(nbUrl);
          aliceUrl = msg.body.allocated[0];
        }
        
        if (seqAlice === 2) {
          console.log('#### receive msg', msg);
          alice.disconnect();
          bob.disconnect();
          done();
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
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
            body: {value: 'connected'}
          });
          
          bob.postMessage({
            header: {id: 1, type: 'create', from: 'hyperty-runtime:/bob/registry/allocation', to: 'domain://msg-node.' + serverConfig.url  + '/hyperty-address-allocation'},
            body: {number: nbUrl}
          });
        }

        if (seqBob === 1) {
          expect(msg.body.allocated).to.have.length(nbUrl);
          bobUrl = msg.body.allocated[0];
          console.log('receive addr send message from', bobUrl, 'to', aliceUrl);
          bob.postMessage({
            header: {id: 1, from: bobUrl, to: aliceUrl},
            body: {message: 'hello'}
          });
        }
        
//        if (seqBob === 2) {
//          console.log('receive msg', msg);
//          bob.disconnect();
//          done();
//        }

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
      alice = new NodejsProtoStub('hyperty-runtime://sp1/protostub/123', aliceBus, aliceConfig);
      alice.connect();
      bob = new NodejsProtoStub('hyperty-runtime://sp1/protostub/123', bobBus, bobConfig);
    
    } catch (e) {
      console.log(e);
    }
  });

});
