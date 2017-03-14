/**
 * Created by hjiang on 3/4/17.
 */

let moment = require("moment");
let Policy = require("./Policy");

class PolicySet {

    constructor (context, policySetObj) {
        this.name = "PDP Policy Set";
        if (!("version" in policySetObj)) throw new Error("version is not defined.");
        if (!("update" in policySetObj)) throw new Error("last update time is not defined.");
        if (!("policies" in policySetObj)) throw new Error("policies is not defined.");
        this.context = context;
        this.logger = this.context.getLogger();
        this.version = policySetObj.version;
        this.update = moment(policySetObj.update);
        this._setPolicies(policySetObj.policies);
    }

    getPolicies(){
        return this.policies;
    }

    getUpdateTime(){
        return this.update;
    }

    getVersion(){
        return this.version;
    }

    _setPolicies(policies){
        this.policies = [];

        for (let i in policies) {
            if (!policies.hasOwnProperty(i)) continue;
            let policy = policies[i];
            if (!(policy instanceof Policy)) {
                policy = new Policy(this.context, policy);
            }
            this.policies.push(policy);
        }
    }

    toString(){
        return JSON.stringify(this.policies);
    }
}

module.exports = PolicySet;