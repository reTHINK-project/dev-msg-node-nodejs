/**
 * Created by hjiang on 3/2/17.
 */

import FS from "./store/FS"
import Redis from "./store/Redis"

class PRP {

    constructor(registry) {
        this.name = "PRP";
        this.registry = registry;
        this.logger = this.registry.getLogger();
        this.fsStore = new FS();
        this.redisStore = new Redis();
        this.setPolicySrc();
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

    getPolicy(context, request){
        return this.getPolicySrc().getPolicy(context, request);
    }

}

export default PRP;