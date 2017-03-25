const IStore = require("./IStore");
const fs = require('fs');
const path = require('path');
const PolicySet = require('../../PolicySet');

class FSStore extends IStore {

    constructor(context){
        super();
        this.name = "PRP FSStore";
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.srcPath = "../policy/policy.json";
        this.policySets = this.loadPolicies();
    }

    loadPolicies(srcPath = this.srcPath){
        try {
            let policyFile = JSON.parse(
                fs.readFileSync(path.resolve(__dirname, srcPath))
            );
            return policyFile.map(policySet=>{return new PolicySet(this.context, policySet)});
        } catch (e) {
            throw new Error(`[${this.name}] error when loading policies. ${e}`);
        }
    }

    getSource() {
        return this.srcPath;
    }

    setSource(srcPath) {
        this.srcPath = srcPath;
    }

    /**
     * @param {Object} message
     */
    getPolicySet(message) {
        for (let policySet in this.policySets) {
            if (!this.policySets.hasOwnProperty(policySet)) continue;
            if (policySet.isApplicable(message)) {
                return policySet;
            }
        }
        return null;
    }

}

module.exports = FSStore;