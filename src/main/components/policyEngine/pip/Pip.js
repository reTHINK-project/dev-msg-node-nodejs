/**
 * Created by hao on 13/04/17.
 */

let removePathFromURL = require('../context/Utils').removePathFromURL;
let NodeCache = require('node-cache');
const RegistryDomainConnector = require('dev-registry-domain/connector');

class PIP {
    constructor (context) {
        let _this = this;
        _this.name = "PIP";
        _this.registry = context.registry;
        _this.cacheTTL = 3600;
        _this.logger = _this.registry.getLogger();
        _this.registryConnector = new RegistryDomainConnector(_this.registry.getConfig().domainRegistryConfig);
        _this.cache = new NodeCache({ stdTTL: _this.cacheTTL, checkperiod: 600 });
        _this.logger.info(`[${_this.name}] new instance`);
    }

    setRegistryCacheEntry(msg, res){
        let _this = this;
        let value = null;
        if (msg.type === 'create' && msg.body.value.url.startsWith('hyperty') && res.body.code === 200) {
            value = {
                userID: msg.body.value.user,
                descriptor: msg.body.value.descriptor,
                hypertyID: msg.body.value.url,
                resources: msg.body.value.resources,
                expires: msg.body.value.expires,
                dataSchemes: msg.body.value.dataSchemes,
                status: msg.body.value.status,
                runtime: msg.body.value.runtime,
            };
        } else if (msg.type === 'update' && msg.body.value && msg.body.value.user && msg.body.resource.startsWith('hyperty') && res.body.code === 200) {
            value = {
                userID: msg.body.value.user,
                descriptor: msg.body.value.descriptor,
                hypertyID: msg.body.resource,
                resources: msg.body.value.resources,
                expires: msg.body.value.expires || _this.cacheTTL,
                dataSchemes: msg.body.value.dataSchemes,
                status: msg.body.value.status,
                runtime: msg.from.startsWith('runtime')? removePathFromURL(msg.from): undefined,
            };
        }
        if (value) {
            _this.cache.set(value.userID+ ' ' +value.hypertyID+ ' ' +value.runtime, JSON.stringify(value), value.expires);
            console.log(`[${_this.name}] setting registry cache entry`, JSON.stringify(value));
        }
    }

    getRegistryCacheEntry(objURL){
        let [results, keys] = [[], this.cache.keys()];
        for (let index in keys) {
            let key = keys[index];
            if (key.split(' ').includes(objURL)) {
                results.push(this.cache.get(key));
            }
        }
        return results;
    }

    getDomainRegistryEntry(objURL){
        let _this = this;
        let query = {
            "type" : "read",
            "body" : { "resource": objURL}
        };
        let parseObj = (obj)=> {
            if (obj.constructor === Object) {
                for (let i in Object.keys(obj)) {
                    let key = Object.keys(obj)[i];
                    obj[key] = JSON.parse(obj[key]);
                }
                return obj;
            }
            throw new Error(`invalid response from domain registry: ${obj}`);
        };
        return new Promise((resolve, reject)=>{
            try {
                _this.registryConnector.processMessage(query, (res) => {
                    resolve(parseObj(res));
                });
            } catch (e) {
                _this.logger.error(`[${_this.name}] error while registryConnector processing message. ${e}`);
                reject(e);
            }
        });
    }

}

module.exports = PIP;