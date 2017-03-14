/**
 * Created by hjiang on 3/1/17.
 */

let Rule = require("./Rule");
let Scope = require("./Scope");
let BlockOverrides = require('./algorithm/BlockOverrides');
let AllowOverrides = require('./algorithm/AllowOverrides');
let FirstApplicable = require('./algorithm/FirstApplicable');

class Policy {

    constructor(context, policyObj) {
        this.name = "PDP Policy";
        if (!("id" in policyObj)) throw new Error("id is not defined.");
        if (!("scope" in policyObj)) throw new Error("scope is not defined.");
        if (!("rules" in policyObj)) throw new Error("rules is not defined.");
        if (!("combiningAlgorithm" in policyObj)) throw new Error("combiningAlgorithm is not defined.");
        if (!("conditionalActions" in policyObj)) throw new Error("conditionalActions is not defined.");
        this.context = context;
        this.logger = this.context.getLogger();
        this.id = policyObj.id;
        this.scope = new Scope(this.context, policyObj.scope);
        this.conditionalActions = policyObj.conditionalActions;
        this._setRules(policyObj.rules);
        this._setCombiningAlgorithm(policyObj.combiningAlgorithm);
    }

    isApplicable(message){
        let isApplicable = this.scope.isApplicable(message);
        this.logger.info(`[${this.name}] checking policy: ${this.id}, scope: ${JSON.stringify(this.scope.scope)}, applicability: ${isApplicable}`);
        return isApplicable;
    }

    evaluateRules(message){
        this.logger.info(`[${this.name}] examining against policy ${this.id}`);
        let results = [];
        for (let i in this.rules) {
            if (!this.rules[i].isApplicable(message)) continue;
            results.push(this.rules[i].evaluateCondition(message));
        }
        let response = this.combiningAlgorithm.combine(results);
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
                rule = new Rule(this.context, rule);
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
                this.combiningAlgorithm = new BlockOverrides(this.context);
                break;
            case 'allowOverrides':
                this.combiningAlgorithm = new AllowOverrides(this.context);
                break;
            case 'firstApplicable':
                this.combiningAlgorithm = new FirstApplicable(this.context);
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

module.exports = Policy;