/**
 * Created by hjiang on 3/1/17.
 */
let Target = require("./Target");
let Condition = require("./Condition");
let Response = require("./Response");
class Rule {

    constructor(context, rule) {
        if (!("id" in rule)) throw new Error("id is not defined.");
        if (!("target" in rule)) throw new Error("target is not defined.");
        if (!("condition" in rule)) throw new Error("condition is not defined.");
        if (!("actions" in rule)) throw new Error("actions is not defined.");
        if (!("effect" in rule)) throw new Error("effect is not defined.");
        if (!("priority" in rule)) throw new Error("priority is not defined.");
        this.context = context;
        this.name = "PDP Policy Rule";
        this.logger = this.context.getLogger();
        this.target = new Target(this.context, rule.target);
        this.condition = new Condition(this.context, rule.condition);
        this.id = rule.id;
        this.actions = rule.actions;
        this.effect = rule.effect;
        this.priority = rule.priority;
    }

    isApplicable(message){
        let isApplicable = this.target.isApplicable(message);
        this.logger.info(`[${this.name}] checking rule: ${this.id}, target: ${JSON.stringify(this.target.target)}, applicability: ${isApplicable}`);
        return isApplicable;
    }

    evaluateCondition(message) {
        let res = new Response();
        let isApplicable = this.condition.isApplicable(message);
        this.logger.info(`[${this.name}] evaluating against rule: ${this.id}, condition: ${this.condition.toString}, applicability: ${isApplicable}, effect: ${this.effect}`);
        if (isApplicable) {
            res.setEffect(this.effect);
            res.addActions(this.actions);
            res.attachRule(this);
            return res;
        }
        return res;
    }

}

module.exports = Rule;