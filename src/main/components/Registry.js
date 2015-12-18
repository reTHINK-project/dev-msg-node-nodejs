'use strict';
class Registry {

  constructor(domain) {
    this.domain = domain;
    this.urlSpace = [];
    this.components = [];
    this.logger = null;
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
    if (name in this.components) {
      return this.components[name];
    }
  }

  allocate(url, runtimeURL) {
    if (url in this.urlSpace) {
      return false;
    }

    this.urlSpace[url] = runtimeURL;
    console.log(this.urlSpace);
    return true;
  }

  deallocate(url) {
    if (url in this.urlSpace) {
      delete this.urlSpace[url];
    }
  }

  resolve(url) {
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
