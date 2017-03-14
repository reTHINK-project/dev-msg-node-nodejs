const IStore = require("./IStore");
const fs = require('fs');
const path = require('path');
const PolicySet = require('../../PolicySet');

class FSStore extends IStore {

    constructor(context){
        super();
        this.name = "PRP FSStore";
        this.context = context;
        this.logger = this.context.getLogger();
        this.srcPath = "../policy/policy.json";
        this.policySet = this.loadPolicies();
        this.logger.info(`[${this.name}] new instance`);
    }

    loadPolicies(srcPath = this.srcPath){
        let policyFile = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, srcPath))
        );
        return new PolicySet(this.context, policyFile);
    }

    getSource() {
        return this.srcPath;
    }

    setSource(srcPath) {
        this.srcPath = srcPath;
    }

    /**
     * @param {Object} message
     * @param {Object} context
     * @returns Promise
     */
    getPolicy(message) {
        let policies = this.policySet.getPolicies();
        for (let i in policies){
            if(!policies.hasOwnProperty(i)) continue;
            if (policies[i].isApplicable(message)) {
                return policies[i];
            }
        }
    }
}

module.exports = FSStore;