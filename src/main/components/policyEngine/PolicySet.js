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
        this.name = `PDP PolicySet ${this.id}`;
        this.target = new Target(this.name, this.context, policySetObj.target, 'Target');
        this.version = policySetObj.version;
        this.update = moment(policySetObj.update);
        this.policies = this._setPolicies(policySetObj.policies);
        this.priority = policySetObj.priority;
        this.obligations = policySetObj.obligations;
        this.policyCombiningAlgorithm = this._setPolicyCombiningAlgorithm(policySetObj.policyCombiningAlgorithm);
    }

    isApplicable(message){
        return this.target.isApplicable(message);
    }

    evaluatePolicies(message){
        let results = [];
        for (let i in this.policies) {
            if (!this.policies.hasOwnProperty(i)) continue;
            if (!this.policies[i].isApplicable(message)) continue;
            results.push(this.policies[i].evaluateRules(message));
        }
        let response = this.policyCombiningAlgorithm.combine(results);
        let obligations = this.obligations[response.effect];
        if (obligations) response.addObligations(new Map().set(this.name.substr(4), obligations));
        return response;
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
            npolicies.push(policy);
        }
        return npolicies;
    }

    _setPolicyCombiningAlgorithm(combiningAlgorithm){
        if (!combiningAlgorithm) {
            return 'blockOverrides';
        }
        switch (combiningAlgorithm) {
            case 'blockOverrides':
                return new BlockOverrides(this.context, this.name);
                break;
            case 'allowOverrides':
                return new AllowOverrides(this.context, this.name);
                break;
            case 'firstApplicable':
                return new FirstApplicable(this.context, this.name);
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