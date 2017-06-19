/**
 * Created by hao on 13/04/17.
 */

let removePathFromURL = require('../context/Utils').removePathFromURL;
let NodeCache = require('node-cache');
const RegistryDomainConnector = require('dev-registry-domain/connector');

class PIP {
    constructor (context) {
        this.name = "PIP";
        this.registry = context.registry;
        this.develop = context.devMode;
        this.cacheTTL = 3600;
        this.logger = this.registry.getLogger();
        this.registryConnector = new RegistryDomainConnector(this.registry.getConfig().domainRegistryConfig);
        this.cache = new NodeCache({ stdTTL: this.cacheTTL, checkperiod: 600 });
        this.logger.info(`[${this.name}] new instance`);
    }

    setRegistryCacheEntry(msg, res){
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
                expires: msg.body.value.expires || this.cacheTTL,
                dataSchemes: msg.body.value.dataSchemes,
                status: msg.body.value.status,
                runtime: msg.from.startsWith('runtime')? removePathFromURL(msg.from): undefined,
            };
        }
        if (value) {
            if (this.develop){
                this.logger.info(`[${this.name}] setting registry cache entry`, value);
            }
            this.cache.set(value.userID+ ' ' +value.hypertyID+ ' ' +value.runtime, value, value.expires);
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
        if (this.develop){
            this.logger.info(`[${this.name}] getting registry cache entry`, results);
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