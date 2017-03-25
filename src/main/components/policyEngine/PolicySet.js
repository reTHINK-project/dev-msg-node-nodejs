/**
 * Created by hjiang on 3/4/17.
 */

let moment = require("moment");
let Policy = require("./Policy");
let Target = require("./Condition");
let BlockOverrides = require('./algorithm/BlockOverrides');
let AllowOverrides = require('./algorithm/AllowOverrides');
let FirstApplicable = require('./algorithm/FirstApplicable');

class PolicySet {

    constructor (context, policySetObj) {
        this.name = "PDP Policy Set";
        if (!("id" in policySetObj)) throw new Error("id is not defined.");
        if (!("target" in policySetObj)) throw new Error("target is not defined.");
        if (!("version" in policySetObj)) throw new Error("version is not defined.");
        if (!("update" in policySetObj)) throw new Error("last update time is not defined.");
        if (!("policies" in policySetObj)) throw new Error("policies is not defined.");
        if (!("priority" in policySetObj)) throw new Error("priority is not defined.");
        if (!("obligations" in policySetObj)) throw new Error("obligations is not defined.");
        if (!("policyCombiningAlgorithm" in policySetObj)) throw new Error("policyCombiningAlgorithm is not defined.");
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.id = policySetObj.id;
        this.target = new Target(this.context, policySetObj.target);
        this.version = policySetObj.version;
        this.update = moment(policySetObj.update);
        this.policies = this._setPolicies(policySetObj.policies);
        this.priority = policySetObj.priority;
        this.obligations = policySetObj.obligations;
        this.policyCombiningAlgorithm = this._setPolicyCombiningAlgorithm(policySetObj.policyCombiningAlgorithm);
    }

    isApplicable(message){
        this.logger.info(`[${this.name}] checking applicability`);
        let isApplicable = this.target.isApplicable(message);
        this.logger.info(`[${this.name}] policySet is applicable: ${isApplicable}`);
        return isApplicable;
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
        let npolicies = [];
        for (let i in policies) {
            if (!policies.hasOwnProperty(i)) continue;
            let policy = policies[i];
            if (!(policy instanceof Policy)) {
                policy = new Policy(this.context, policy);
            }
            this.policies.push(policy);
        }
        return npolicies;
    }

    _setPolicyCombiningAlgorithm(combiningAlgorithm){
        if (!combiningAlgorithm) {
            return 'blockOverrides';
        }
        switch (combiningAlgorithm) {
            case 'blockOverrides':
                return new BlockOverrides(this.context);
                break;
            case 'allowOverrides':
                return new AllowOverrides(this.context);
                break;
            case 'firstApplicable':
                return new FirstApplicable(this.context);
                break;
            default:
                throw Error('Unknown algorithm: ' + combiningAlgorithm);
        }
    }

    toString(){
        return JSON.stringify(this.policies);
    }
}

module.exports = PolicySet;