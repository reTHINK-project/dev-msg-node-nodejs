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

let Message = require('./../Message');
let JSRequest = require('./../../../modules/JSRequest');

class GlobalRegistryManager {

  constructor(registryURL, registry) {
    this.request = new JSRequest();
    this.registry = registry;
    this.registryURL = this.registry.getConfig().globalRegistryUrl;
    this.logger = this.registry.getLogger();
  }

  getName() {
    return this.name;
  }

  processMessage(msg, callback) {
    // let msg = clientMessage.getMessage();
    let body = msg.getBody();
    this.logger.error(msg);
    switch (msg.getType().toLowerCase()) {
      case 'create':
      case 'update':
        try {
              if(typeof body.value !== 'undefined' && 'hypertyURL' in body.value) {
                this.logger.info('[Gloabl-Registry-Manager] Add hyperty with :',  body.value);
                this.addHyperty(body.value.user, body.value.hypertyURL, body.value.hypertyDescriptorURL, body.value.expires, callback);
              } else {
                this.logger.info('[Global-Registry-Manager] Add data Object :' + body.value.name);
                this.addDataObject(body.value.name, body.value.schema, body.value.expires, body.value.url, body.value.reporter, callback);
              }
            } catch (e) {
                this.logger.error('[Global-Registry-Manager] [', this.getName(), ']: Error while processing message:\n', e);
            }
            break;

            case 'delete':
              if(typeof body.value !=='undefined' && 'hypertyURL' in body.value) {
                this.logger.info('[Global-Registry-Manager] Delete hyperty with :', body.value.hyeprtyURL);
                this.deleteHyperty(body.value.user, body.value.hyeprtyURL, callback)
              } else {
                this.logger.info('[Global-Registry-Manager] Delete data object with :', body.resource);
                this.deleteDataObject(body.resource.hypertyURL, callback);
              }

            break;

            case 'read':
              if(body.resource.startWith('dataObject://')) {
                this.logger.info('[Global-Registry-Manager] Get dat object with :' + body.resource);
                thi.getDataObject(body.resource, callback);
              } else {
                this.logger.info('[Global-Registry-Manager] Get user with :', msg);
                thi.getUser(body.resource, callback);
              }

            break;

            break;
            default:
              clientMessage.replyError(this.getName(), 'Unrecognized type :"' + msg.getType() + '"');
    }
  }

  getBody(response, statusCode) {
    let body = {
      code: statusCode
    };
    if(statusCode !== 500 && typeof response !== 'undefined') {
      body.value = JSON.parse(response);
    }

    return body;
  }

  getUser(userid, callback) {
    let endpoint = '/hyperty/user/' + encodeURIComponent(userid);

    this.logger.debug('getUser: ', this.registryURL + endpoint);
    this.request.get(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('getUser: ', statusCode);
      if(err) {
          this.logger.error('[Global-Registry-Manager] Error :', err);
      }


      callback(this.getBody(response, statusCode)); // TODO: getBody()
    });
  }

  addHyperty(userid, hypertyid, hypertyDescriptor, expires, callback) {
    let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);
    let data = {
      descriptor: hypertyDescriptor,
      expires: expires
    };

    this.logger.debug('addHyperty :', this.registryURL + endpoint);
    this.request.put(this.registryURL + endpoint, JSON.stringify(data), (err, response, statusCode) => {

      this.logger.debug('addHyperty :', statusCode);
      if(err) {
        this.logger.error('[Global-Registry-Manager] Error :', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  deleteHyperty(userid, hypertyid, callback) {
    let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);
    this.request.del(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('deleteHyperty: ', statusCode);
      if(err) {
        this.logger.console.error('[Global-Registry-Manager] Error : ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  getDataObject(resource, callback) {
    let dataobj = resource.split('://')[1];
    let endpoint = '/hyperty/dataObject/' + encodeURIComponent(dataobj);

    this.logger.debug('getDataObject: ', this.registryURL + endpoint);
    this.request.get(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('addDataObject: ', statusCode);
      if(err) {
        this.logger.error('[Global-Registry-Manager] Error :', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  addDataObject(dataobjName, schema, expires, url, reporter, callback) {
    let endpoint = '/hyperty/dataobject' + encodeURIComponent(dataobjName);
    let data = {
      name: dataobjName,
      schema: schema,
      url: url,
      reporter: reporter,
      expires:expires
    };

    this.logger.debug('addDataObject: ', this.registryURL + endpoint);
    this.request.put(this.registryURL + endpoint, JSON.stringify(data), (err, response, statusCode) => {
      this.logger.debug('addDataObject: ', statusCode);
      if(err) {
        this.logger.error('[Global-Registry-Manager] Error : ', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }

  deleteDataObject(dataobjectName, callback) {
    let endpoint = '/hyperty/dataobject/'+ encodeURIComponent(dataobjectName);

    this.logger.debug('deleteDataObject: ', this.registryURL + endpoint);
    this.request.del(this.registryURL + endpoint, (err, response, statusCode) => {
      this.logger.debug('deleteDataObject: ', statusCode);
      if(err) {
        this.logger.error('[Global-Registry-Manager] Error :', err);
      }

      callback(this.getBody(response, statusCode));
    });
  }
}

module.exports = GlobalRegistryManager;
