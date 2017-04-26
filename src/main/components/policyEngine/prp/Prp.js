/**
 * Created by hjiang on 3/2/17.
 */

let FS = require("./store/FS");
let Redis = require("./store/Redis");

class PRP {

    constructor(context) {
        this.name = "PRP";
        this.context = context;
        this.develop = context.devMode;
        this.logger = this.context.registry.getLogger();
        this.fsStore = new FS(this.context);
        this.redisStore = new Redis(this.context);
        this.setPolicySrc();
        this.logger.info(`[${this.name}] new instance`);
    }

    // =================== public ====================

    setPolicySrc(source= "FSStore"){
        switch (source) {
            case "FSStore":
            case "RedisStore":
                this.policySrc = source;
                break;
            default:
                throw new Error(`the policy source ${source} is not defined.`);
        }
    }

    getPolicySrc(source = this.policySrc){
        switch (source) {
            case "FSStore":
                return this.fsStore;
            case "RedisStore":
                return this.redisStore;
            default:
                throw new Error(`the policy source ${source} is not defined.`);
        }
    }

    getPolicySet(request){
        return this.getPolicySrc().getPolicySet(request);
    }

}

module.exports = PRP;