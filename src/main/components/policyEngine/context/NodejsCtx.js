/**
 * Created by hjiang on 3/9/17.
 */
let ReThinkCtx = require('./ReThinkCtx');

class NodejsCtx extends ReThinkCtx {

    constructor(registry, config) {
        super();
        this.name = 'PDP';
        this.registry = registry;
        this.config = config;
        this.msg = null;
    }

    get domainUrl(){
        return this.config.url;
    }

    get domainRegistryUrl(){
        return this.config.domainRegistryUrl;
    }

    get globalRegistryUrl(){
        return this.config.globalRegistryUrl;
    }

    get port(){
        return this.config.port;
    }

    get useSSL(){
        return this.config.useSSL;
    }
}
module.exports = NodejsCtx;