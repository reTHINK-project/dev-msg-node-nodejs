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
        if (!("obligations" in rule)) throw new Error("obligations is not defined.");
        if (!("effect" in rule)) throw new Error("effect is not defined.");
        if (!("priority" in rule)) throw new Error("priority is not defined.");
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.target = new Target(this.context, rule.target);
        this.condition = new Condition(this.context, rule.condition);
        this.id = rule.id;
        this.obligations = rule.obligations;
        this.effect = rule.effect;
        this.priority = rule.priority;
        this.name = `PDP Rule ${this.id}`;
    }

    isApplicable(message){
        this.logger.info(`[${this.name}] checking applicability`);
        let isApplicable = this.target.isApplicable(message);
        this.logger.info(`[${this.name}] rule is applicable: ${isApplicable}`);
        return isApplicable;
    }

    evaluateCondition(message) {
        let res = new Response();
        this.logger.info(`[${this.name}] evaluating condition`);
        let isApplicable = this.condition.isApplicable(message);
        this.logger.info(`[${this.name}] condition is fulfilled: ${isApplicable}, effect: ${this.effect}`);
        if (isApplicable) {
            res.setEffect(this.effect);
            res.addObligations(this.obligations);
            res.attachRule(this);
            return res;
        }
        return res;
    }

}

module.exports = Rule;