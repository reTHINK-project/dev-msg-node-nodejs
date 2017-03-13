/**
 * Created by hjiang on 3/1/17.
 */

import Rule from "./Rule";
import BlockOverrides from './algorithm/BlockOverrides';
import AllowOverrides from './algorithm/AllowOverrides';
import FirstApplicable from './algorithm/FirstApplicable';
import Response from './Response';

class Policy {

    constructor(policyObj) {
        if (!("id" in policyObj)) throw new Error("id is not defined.");
        if (!("scope" in policyObj)) throw new Error("scope is not defined.");
        if (!("rules" in policyObj)) throw new Error("rules is not defined.");
        if (!("combiningAlgorithm" in policyObj)) throw new Error("combiningAlgorithm is not defined.");
        if (!("conditionalActions" in policyObj)) throw new Error("conditionalActions is not defined.");
        this.id = policyObj.id;
        this.scope = new Scope(policyObj.scope);
        this.conditionalActions = policyObj.conditionalActions;
        this._setRules(policyObj.rules);
        this._setCombiningAlgorithm(policyObj.combiningAlgorithm);
    }

    isApplicable(context, message){
        return this.scope.isApplicable(context, message);
    }

    evaluateRules(context, message){
        let results = [];
        for (let i in this.rules) {
            if (!this.rules[i].isApplicable(context, message)) continue;
            results.push(this.rules[i].evaluateCondition(context, message));
        }
        response = this.combiningAlgorithm.combine(results);
        let actions = this.conditionalActions[response.effect];
        response.addActions(actions);
        return response;
    }

    _setRules(rules) {
        this.rules = [];

        for (let i in rules) {
            if (!rules.hasOwnProperty(i)) continue;
            let rule = rules[i];
            if (rule.priority === undefined) {
                rule.priority = this._getLastPriority() + 1;
            }
            if (!(rule instanceof Rule)) {
                rule = new Rule(rule);
            }
            this.rules.push(rule);
        }
    }

    _setCombiningAlgorithm(combiningAlgorithm) {
        if (!combiningAlgorithm) {
            combiningAlgorithm = 'blockOverrides';
        }
        switch (combiningAlgorithm) {
            case 'blockOverrides':
                this.combiningAlgorithm = new BlockOverrides();
                break;
            case 'allowOverrides':
                this.combiningAlgorithm = new AllowOverrides();
                break;
            case 'firstApplicable':
                this.combiningAlgorithm = new FirstApplicable();
                break;
            default:
                throw Error('Unknown algorithm: ' + combiningAlgorithm);
        }
    }

    _getLastPriority() {
        let priorities = [];

        if (this.rules.length !== 0) {
            for (let i in this.rules) {
                priorities.push(this.rules[i].priority);
            }
            return Math.max.apply(Math, priorities);
        } else {
            return -1;
        }
    }

}

export default Policy;