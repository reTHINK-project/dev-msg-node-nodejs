import expect from 'expect.js';
import activate from '../src/js/NodejsProtoStub';
import serverConfig from '../src/configs/server-settings.js';

describe('Listeners', function() {
  let protoURL = 'hyperty-runtime://sp1/protostub/123';

  it('add and test listener', function(done) {
    let send;

    let seq = 0;
    let proto;

    let toSubscribe = 'resource://' + serverConfig.url  + '/1';

    //TODO: requirement -> vertx MN must be online on ws://localhost:9090/ws

    let bus = {
      postMessage: (msg) => {
        seq++;

        if (seq === 1) {
          expect(msg).to.eql({
            type: 'update', from: protoURL, to: 'hyperty-runtime://sp1/protostub/123/status',
            body: { value: 'connected' }
          });
        }

        if (seq === 2) {
          expect(msg).to.eql({
            id: 1, type: 'response', from: 'domain://msg-node.' + serverConfig.url  + '/sm', to: 'runtime:/alice/listeners/sm',
            body: { code: 200, via: protoURL }
          });

          send({ id: 2, type: 'update', from: toSubscribe, to: toSubscribe  + '/changes', body: { value: 'changed-value' } });
        }

        if (seq === 3) {
          expect(msg).to.eql({
            id: 2, type: 'update', from: toSubscribe, to: toSubscribe  + '/changes',
            body: { value: 'changed-value', via: protoURL }
          });

          done();
        }
      },

      addListener: (url, callback) => {
        send = callback;
      },
    };

    let config = {
      url: serverConfig.url + ':' + serverConfig.port,
      runtimeURL: 'runtime:/alice/listeners',
    };

    proto = activate(protoURL, bus, config).instance;

    //send subscribe msg...
    send({
      id: 1, type: 'subscribe', from: 'runtime:/alice/listeners/sm', to: 'domain://msg-node.' + serverConfig.url  + '/sm',
      body: { resource: toSubscribe, children: ['children1', 'children2'] },
    });
  });

});
