'use strict';
let JSRequest = require('./../../../modules/JSRequest');

class RegistryConnector {
    constructor(registryURL, registry) {
      this.request = new JSRequest();
      this.registryURL = registryURL;
      this.registry = registry;
      this.logger = this.registry.getLogger();
    }

    processMessage(msg, callback) {
      this.logger.info(msg);
      let body = msg.getBody();
      switch (msg.getType().toLowerCase()) {
        case 'read':
          this.logger.info('[Registry-Connector] Get user with ' + body.resource);
          this.getUser(body.resource, callback);
        break;

        case 'create':
          this.logger.info('[Registry-Connector] Add hyperty with ' + body.value.hypertyURL);
          this.addHyperty(body.value.user, body.value.hypertyURL, body.value.hypertyDescriptorURL, callback);
        break;

        case 'delete':
          this.logger.info('[Registry-Connector] Delete hyperty with ' + body.value.hypertyURL);
          this.deleteHyperty(body.value.user, body.value.hypertyURL, callback);
        break;
      }
    }

    getUser(userid, callback) {
      let _this = this;
      this.request.get(this.registryURL + '/hyperty/user/' + encodeURIComponent(userid), function(err, response, statusCode) {
          _this.logger.info('Get user: ' + response);

          let body = {
            code: statusCode,
            value: JSON.parse(response)
          };

          callback(body);
        });
    }

    addHyperty(userid, hypertyid, hypertyDescriptor, callback) {
      let _this = this;
      let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);
      let data = { descriptor: hypertyDescriptor };
      this.logger.debug('addHyperty', this.registryURL + endpoint);
      this.request.put(this.registryURL + endpoint, JSON.stringify(data), function(err, response, statusCode) {
        _this.logger.debug('Domain registry response:', response);
        if (err) {
          _this.logger.error('Domain registry error: ', err);
        }

        console.log();
        let body = {
          code: statusCode
        };

        callback(body);
      });
    }

    deleteHyperty(userid, hypertyid, callback) {
      let _this = this;
      let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);

      this.request.del(this.registryURL + endpoint, function(err, response, statusCode) {
        _this.logger.info('Delete hyperty: ' + response);

        let body = {
          code: statusCode
        };

        callback(body);
      });
    }
}
module.exports = RegistryConnector;
