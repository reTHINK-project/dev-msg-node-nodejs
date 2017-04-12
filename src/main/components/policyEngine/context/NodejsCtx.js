/**
 * Created by hjiang on 3/9/17.
 */
let ReThinkCtx = require('./ReThinkCtx');

class NodejsCtx extends ReThinkCtx {

    constructor(registry) {
        super();
        this.name = 'PDP';
        this.registry = registry;
        this.logger = this.registry.getLogger();
        this.msg = null;
        this.msgTypes = {
            registration: function (msg) {
                let result = false;
                let urlPattern = "domain://registry.";
                if (msg.from.startsWith(urlPattern) || msg.to.startsWith(urlPattern)) {
                    result = true;
                }
                return result;
            },
            addressAllocation: function (msg) {
                let result = false;
                let urlPattern = "/address-allocation";
                if (msg.from.endsWith(urlPattern) && msg.to.endsWith(urlPattern)) {
                    result = true;
                }
                return result;
            },
            discovery: function (msg) {
                let result = false;
                let urlPattern = "/discovery/";
                if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
                    result = true;
                }
                return result;
            },
            globalRegistry: function (msg) {
                let result = false;
                let urlPattern = "/graph-connector";
                if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
                    result = true;
                }
                return result;
            },
            identityManagement: function (msg) {
                let result = false;
                let urlPattern = "/idm";
                if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
                    result = true;
                }
                return result;
            },
            dataSync: function (msg) {
                let result = false;
                let urlPattern = "/sm";
                if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
                    result = true;
                }
                return result;
            },
            p2pConnection: function (msg) {
                let result = false;
                if (msg.from.endsWith("/ua") || msg.to.endsWith("/ua")) {
                    result = true;
                } else if (msg.from.endsWith("/sm") || msg.to.endsWith("/sm")) {
                    result = true;
                }
                return result;
            }
        }
    }

    get domainUrl(){
        return this.registry.getDomain();
    }

    get domainRegistryUrl(){
        return this.registry.getConfig().domainRegistryConfig.url;
    }

    get port(){
        return this.registry.getConfig().port;
    }

    get useSSL(){
        return this.registry.getConfig().useSSL;
    }

    get msgType() {
        return this._msgType;
    }

    set msgType(params){
        for (let key in this.msgTypes) {
            if (this.msgTypes.hasOwnProperty(key) && this.msgTypes[key](params.message)) {
                this._msgType = key;
            }
        }
    }

    isAttribute(attr){
        if (attr.startsWith("<") && attr.endsWith(">") && (attr.substr(1, attr.length - 2) in this)){
            return attr.substr(1, attr.length - 2);
        } else {
            return null;
        }
    }
}
module.exports = NodejsCtx;