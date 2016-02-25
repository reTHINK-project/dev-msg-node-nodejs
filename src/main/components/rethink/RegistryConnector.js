'use strict';
let JSRequest = require('./JSRequest');

class RegistryConnector {
    constructor(registryURL, registry) {
      this.request = new JSRequest();
      this.registryURL = registryURL;
      this.registry = registry;
      this.logger = this.registry.getLogger();
    }

    processMessage(msg, callback) {
      switch (msg.type) {
        case 'READ':
          this.logger.info('[Registry-Connector] Get user with ' + msg.body.resource);
          this.getUser(msg.body.resource, callback);
        break;

        case 'CREATE':
          this.logger.info('[Registry-Connector] Add Hyperty with ' + msg.body.value.hypertyURL);
          this.addHyperty(msg.body.value.user, msg.body.value.hypertyURL, msg.body.value.hypertyDescriptorURL, callback);
        break;

        case 'DELETE':
          this.logger.info('[Registry-Connector] Delete Hyperty with ' + msg.body.value.hypertyURL);
          this.deleteHyperty(msg.body.value.user, msg.body.value.hypertyURL, callback);
        break;
      }
    }

    getUser(userid, callback) {
      this.request.get(this.registryURL + '/hyperty/user/' + encodeURIComponent(userid), function(err, response, statusCode) {
          this.logger.info('Get user: ' + response);

          var body = {
            code: statusCode,
            value: JSON.parse(response)
          };

          callback(body);
        });
    }

    addHyperty(userid, hypertyid, hypertyDescriptor, callback) {
      var endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);
      var data = { descriptor: hypertyDescriptor };

      this.request.put(this.registryURL + endpoint, JSON.stringify(data), function(err, response, statusCode) {
        this.logger.info('Add hyperty: ' + response);

        var body = {
          code: statusCode
        };

        callback(body);
      });
    }

    deleteHyperty(userid, hypertyid, callback) {
      var endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);

      this.request.del(this.registryURL + endpoint, function(err, response, statusCode) {
        this.logger.info('Delete hyperty: ' + response);

        var body = {
          code: statusCode
        };

        callback(body);
      });
    }
}
module.exports = RegistryConnector;
