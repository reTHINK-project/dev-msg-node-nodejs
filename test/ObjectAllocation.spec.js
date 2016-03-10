import expect from 'expect.js';
import activate from '../src/js/NodejsProtoStub';
import serverConfig from '../src/configs/server-settings.js';

describe('ObjectAllocation', function() {
  let protoURL = 'hyperty-runtime://sp1/protostub/123';
  let config = {
    url: 'wss://msg-node.' + serverConfig.url + ':' + serverConfig.port + '/',
    runtimeURL: 'runtime:/alice1'
  };

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
