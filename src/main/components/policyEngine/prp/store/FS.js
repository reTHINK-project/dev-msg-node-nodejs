const IStore = require("./IStore");
const fs = require('fs');
const path = require('path');
const PolicySet = require('../../PolicySet');

class FSStore extends IStore {

    constructor(){
        this.name = "FSStore";
        this.srcPath = "../policy/policy.json";
        this.policySet = loadPolicies();
    }

    loadPolicies(srcPath = this.srcPath){
        let policyFile = JSON.parse(
            fs.readFileSync(srcPath)
        );
        return new PolicySet(policyFile);
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
    getPolicy(context, message) {
        let policies = this.policySet.getPolicies();
        for (let i in policies){
            if(!policies.hasOwnProperty(i)) continue;
            if (policies[i].isApplicable(context, message)) {
                return policies[i];
            }
        }
    }
}

export default FSStore;