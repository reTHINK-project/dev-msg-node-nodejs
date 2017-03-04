/**
 * Created by hjiang on 3/4/17.
 */

import moment from "moment";
import Policy from "./Policy";

class PolicySet {

    constructor (policySetObj) {
        if (!("version" in policySetObj)) throw new Error("version is not defined.");
        if (!("update" in policySetObj)) throw new Error("last update time is not defined.");
        if (!("policies" in policySetObj)) throw new Error("policies is not defined.");
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
                policy = new Policy(policy);
            }
            this.policies.push(policy);
        }
    }
}

export default PolicySet;