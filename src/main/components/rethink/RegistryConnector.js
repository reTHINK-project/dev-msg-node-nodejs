/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

'use strict';
let JSRequest = require('./../../../modules/JSRequest');

class RegistryConnector {
  constructor(registryURL, registry) {
    this.request = new JSRequest();
    this.registryURL = registryURL.replace(/\/$/, '');
    this.registry = registry;
    this.logger = this.registry.getLogger();
  }

  processMessage(msg, callback) {
    let body = msg.getBody();
    this.logger.error(msg);
    switch (msg.getType().toLowerCase()) {
      case 'read':
        if (body.resource.startsWith('dataObject://')) {
          this.logger.info('[Registry-Connector] Get data object with ' + body.resource);
          this.getDataObject(body.resource, callback);
        } else {
          this.logger.info('[Registry-Connector] Get user with ', msg);
          this.getUser(body.resource, callback);
        }

      break;

      case 'create':
      case 'update':
        if (typeof body.value !== 'undefined' && 'hypertyURL' in body.value) {
          this.logger.info('[Registry-Connector] Add hyperty with ', body.value);
          this.addHyperty(body.value.user, body.value.hypertyURL, body.value.hypertyDescriptorURL, body.value.expires, callback);
        } else {
          this.logger.info('[Registry-Connector] Add data object ' + body.value.name);
          this.addDataObject(body.value.name, body.value.schema, body.value.expires, body.value.url, body.value.reporter, callback);
        }

      break;

      case 'delete':
        if (typeof body.value !== 'undefined' && 'hypertyURL' in body.value) {
          this.logger.info('[Registry-Connector] Delete hyperty with ', body.value.hypertyURL);
          this.deleteHyperty(body.value.user, body.value.hypertyURL, callback);
        } else {
          this.logger.info('[Registry-Connector] Delete data object with ', body.resource);
          this.deleteDataObject(body.resource.hypertyURL, callback);
        }

      break;
    }
  }

  getBody(response, statusCode) {
    let body = {
      code: statusCode
    };
    if (statusCode !== 500 && typeof response !== 'undefined') {
      body.value = JSON.parse(response);
    }

    return body;
  }

  getUser(userid, callback) {
    let endpoint = '/hyperty/user/' + encodeURIComponent(userid);

    this.logger.debug('getUser', this.registryURL + endpoint);
    this.request.get(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('getUser:', statusCode);
      if (err) {
        this.logger.error('Domain registry error: ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  addHyperty(userid, hypertyid, hypertyDescriptor, expires, callback) {
    let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);
    let data = {
      descriptor: hypertyDescriptor,
      expires: expires
    };

    this.logger.debug('addHyperty', this.registryURL + endpoint);
    this.request.put(this.registryURL + endpoint, JSON.stringify(data), (err, response, statusCode) => {
      this.logger.debug('addHyperty:', statusCode);
      if (err) {
        this.logger.error('Domain registry error: ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  deleteHyperty(userid, hypertyid, callback) {
    let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);

    this.logger.debug('deleteHyperty', this.registryURL + endpoint);
    this.request.del(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('deleteHyperty:', statusCode);
      if (err) {
        this.logger.error('Domain registry error: ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  getDataObject(resource, callback) {
    let dataobj = resource.split('://')[1];
    let endpoint = '/hyperty/dataobject/' + encodeURIComponent(dataobj);

    this.logger.debug('getDataObject', this.registryURL + endpoint);
    this.request.get(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('addDataObject:', statusCode);
      if (err) {
        this.logger.error('Domain registry error: ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  addDataObject(dataobjName, schema, expires, url, reporter, callback) {
    let endpoint = '/hyperty/dataobject/' + encodeURIComponent(dataobjName);
    let data = {
      name: dataobjName,
      schema: schema,
      url: url,
      reporter: reporter,
      expires: expires
    };

    this.logger.debug('addDataObject', this.registryURL + endpoint);
    this.request.put(this.registryURL + endpoint, JSON.stringify(data), (err, response, statusCode) => {
      this.logger.debug('addDataObject:', statusCode);
      if (err) {
        this.logger.error('Domain registry error: ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  deleteDataObject(dataObjectName, callback) {
    let endpoint = '/hyperty/dataobject/' + encodeURIComponent(dataObjectName);

    this.logger.debug('deleteDataObject', this.registryURL + endpoint);
    this.request.del(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('deleteDataObject:', statusCode);
      if (err) {
        this.logger.error('Domain registry error: ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }
}
module.exports = RegistryConnector;
