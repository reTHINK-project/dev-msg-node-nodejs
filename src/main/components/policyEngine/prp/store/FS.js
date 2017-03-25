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

        let policyFile = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, srcPath))
        );
        return policyFile.map(policySet=>{return new PolicySet(this.context, policySet)});
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
        for (let index in this.policySets) {
            if (!this.policySets.hasOwnProperty(index)) continue;
            let policySet = this.policySets[index];
            if (policySet.isApplicable(message)) {
                return policySet;
            }
        }
        return null;
    }

}

module.exports = FSStore;