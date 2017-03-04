/**
 * Created by hjiang on 3/1/17.
 */

import Rule from "./Rule";

class Policy {

    constructor(policyObj) {
        if (!("id" in policySetObj)) throw new Error("id is not defined.");
        if (!("target" in policySetObj)) throw new Error("target is not defined.");
        if (!("rules" in policySetObj)) throw new Error("rules is not defined.");
        if (!("combiningAlgorithm" in policySetObj)) throw new Error("combiningAlgorithm is not defined.");
        if (!("conditionalActions" in policySetObj)) throw new Error("conditionalActions is not defined.");
        this.id = id;
        this._setRules(rules);
        this._setCombiningAlgorithm(combiningAlgorithm);
        this._setConditionalActions(conditionalActions);
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