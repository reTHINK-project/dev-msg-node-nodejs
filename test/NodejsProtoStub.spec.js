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
        if (seq === 0) {
          expect(msg).to.be.an('object');
          expect(msg).to.eql({
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
            body: {value: 'connected'}
          });

          //send loopback ping
          //          send({
          //            header: {id: 1, type: 'ping', from: 'runtime:/alice1', to: 'runtime:/alice1'}
          //          });

        }

        if (seq === 1) {
          //if the runtime is registered, ping should arrive here
          //          expect(msg).to.eql({
          //            header: {id: 1, type: 'ping', from: 'runtime:/alice1', to: 'runtime:/alice1'}
          //          });

          proto.disconnect();
        }

        if (seq === 2) {
          expect(msg).to.be.an('object');
          expect(msg).to.eql({
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
            body: {value: 'disconnected', desc: 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.'}
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
    let firstURL;
    let secondURL;

    let bus = {
      postMessage: (msg) => {
        if (seq === 0) {
          expect(msg).to.eql({
            header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
            body: {value: 'connected'}
          });
        }

        if (seq === 1) {
          /*expect something like -> {
            header: {id: 1, type: 'reply', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: 'runtime:/alice/registry/allocation'},
            body: {code: 'ok', allocated: ['hyperty-instance://ua.pt/fbf7dc26-ff4f-454f-961e-22edda927561', 'hyperty-instance://ua.pt/6e8f126b-1c56-4525-9a38-5dcd340194da']}
          }*/
          expect(msg.header).to.eql({id: 1, type: 'reply', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: 'runtime:/alice/registry/allocation'});
          expect(msg.body.code).to.eql('ok');
          expect(msg.body.allocated).to.have.length(2);

          firstURL = msg.body.allocated[0];
          secondURL = msg.body.allocated[1];

          send({
            header: {id: 1, type: 'ping', from: firstURL, to: secondURL}
          });
        }

        if (seq === 2) {
          expect(msg).to.eql({
            header: {id: 1, type: 'ping', from: firstURL, to: secondURL}
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

    let config = {
      url: serverConfig.url + ':' + serverConfig.port,
      runtimeURL: 'runtime:/alice2'
    };

    let proto = new NodejsProtoStub('hyperty-runtime://sp1/protostub/123', bus, config);

    send({
      header: {id: 1, type: 'create', from: 'runtime:/alice/registry/allocation', to: 'domain://msg-node.ua.pt/hyperty-address-allocation'},
      body: {number: 2}
    });
  });

});
