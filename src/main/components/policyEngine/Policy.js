/**
 * Created by hjiang on 3/1/17.
 */

let Rule = require("./Rule");
let Target = require("./Condition");
let BlockOverrides = require('./algorithm/BlockOverrides');
let AllowOverrides = require('./algorithm/AllowOverrides');
let FirstApplicable = require('./algorithm/FirstApplicable');

class Policy {

    constructor(context, policyObj) {
        if (!("id" in policyObj)) throw new Error("id is not defined.");
        if (!("priority" in policyObj)) throw new Error("priority is not defined.");
        if (!("target" in policyObj)) throw new Error("target is not defined.");
        if (!("rules" in policyObj)) throw new Error("rules is not defined.");
        if (!("ruleCombiningAlgorithm" in policyObj)) throw new Error("ruleCombiningAlgorithm is not defined.");
        if (!("obligations" in policyObj)) throw new Error("obligations is not defined.");
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.id = policyObj.id;
        this.name = `PDP Policy ${this.id}`;
        this.priority = policyObj.priority;
        this.target = new Target(this.name, this.context, policyObj.target, 'Target');
        this.obligations = policyObj.obligations;
        this.rules = this._setRules(policyObj.rules);
        this.ruleCombiningAlgorithm = this._setRuleCombiningAlgorithm(policyObj.ruleCombiningAlgorithm);
    }

    isApplicable(message){
        return this.target.isApplicable(message);
    }

    evaluateRules(message){
        let results = [];
        for (let i in this.rules) {
            if (!this.rules.hasOwnProperty(i)) continue;
            if (!this.rules[i].isApplicable(message)) continue;
            results.push(this.rules[i].evaluateCondition(message));
        }
        let response = this.ruleCombiningAlgorithm.combine(results);
        let obligations = this.obligations[response.effect];
        if (obligations) response.addObligations(obligations);
        return response;
    }

    _setRules(rules) {
        let nrules = [];
        for (let i in rules) {
            if (!rules.hasOwnProperty(i)) continue;
            let rule = rules[i];
            if (rule.priority === undefined) {
                rule.priority = this._getLastPriority() + 1;
            }
            if (!(rule instanceof Rule)) {
                rule = new Rule(this.context, rule);
            }
            nrules.push(rule);
        }
        return nrules;
    }

    _setRuleCombiningAlgorithm(combiningAlgorithm) {
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

    _getLastPriority() {
        let priorities = [];

        if (this.rules.length !== 0) {
            for (let i in this.rules) {
                if (!this.rules.hasOwnProperty(i)) continue;
                priorities.push(this.rules[i].priority);
            }
            return Math.max.apply(Math, priorities);
        } else {
            return -1;
        }
    }

}

module.exports = Policy;