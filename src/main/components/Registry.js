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
class Registry {

  constructor(config) {
    this.config = config;
    this.domain = config.url;

    this.urlSpace = [];
    this.components = [];
    this.logger = null;
  }

  getConfig() {
    return this.config;
  }

  setLogger(logger) {
    this.logger = logger;
  }

  getLogger() {
    return this.logger;
  }

  setWSServer(wss) {
    this.wss = wss;
  }

  getWSServer() {
    return this.wss;
  }

  getDomain() {
    return this.domain;
  }

  registerComponent(component) {
    this.components[component.getName()] = component;
  }

  getComponent(name) {
    this.logger.info('getComponent(name):', name);
    if (name in this.components) {
        this.logger.info('this.components', this.components);
      return this.components[name];
    }

    let comp = false;
    Object.keys(this.components).forEach((key) => {
      if (key.indexOf(name) !== -1) {
        comp = this.components[key];
        return -1;
      }
    });
    return comp;
  }

  allocate(url, runtimeURL) {
    if (url in this.urlSpace) {
      return false;
    }

    this.urlSpace[url] = runtimeURL;
    this.logger.debug('urlSpace after allocate', this.urlSpace);
    return true;
  }

  deallocate(url) {
    if (url in this.urlSpace) {
      delete this.urlSpace[url];
      this.logger.debug('urlSpace after deallocate', this.urlSpace);
    }
  }

  resolve(url) {
    this.logger.debug('resolving', url);
    if (url in this.urlSpace) {
      return this.urlSpace[url];
    } else {
      return false;
    }
  }

  bind(runtimeURL, resourceUID) {
    this.logger.info('[S] bind', runtimeURL, 'with socket', resourceUID);
    this.allocate(runtimeURL, resourceUID);
    return this;
  }

  /**
   * Removes runtimeURL relation from the "whatever" resource channel that is registered.
   * @param string runtimeURL The runtimeURL
   * @return this
   */
  unbind(runtimeURL) {
    this.logger.info('[S] unbind', runtimeURL);
    this.deallocate(runtimeURL);
    this.urlSpace.forEach(function(v) {
      console.log(v);
    });

    return this;
  }
}
module.exports = Registry;
