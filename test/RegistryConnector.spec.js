import expect from 'expect.js';
import activate from '../src/js/NodejsProtoStub';
import serverConfig from '../src/configs/server-settings.js';

describe('RegistryConnector', function() {
  let protoURL = 'hyperty-runtime://sp1/protostub/123';
  let config = {
    url: 'wss://msg-node.' + serverConfig.url + ':' + serverConfig.port + '/',
    runtimeURL: 'runtime:/alice1'
  };

  it('create user', function(done) {
    let send;

    let bus = {
      postMessage: (msg) => {
        if (msg.id === 2) {
          expect(msg).to.eql({
            id: 2, type: 'response', from: 'domain://registry.' + serverConfig.url  + '/', to: 'hyper-1',
            body: { code: 200, via: protoURL }
          });

          done();
        }
      },

      addListener: (url, callback) => {
        send = callback;
      }
    };

    let proto = activate(protoURL, bus, config).activate;

    send({
      id: 2,
      type: 'CREATE',
      from: 'hyper-1',
      to: 'domain://registry.' + serverConfig.url  + '/',
      body: {
        value: {
          user: 'user://google.com/testuser10',
          hypertyDescriptorURL: 'hyper-1',
          hypertyURL: 'hyperty-instance://' + serverConfig.url  + '/1'
        }
      }
    });
  });
});
