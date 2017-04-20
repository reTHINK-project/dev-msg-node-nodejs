/**
 * Created by hjiang on 3/1/17.
 */

let Condition = require("./Condition");
let Response = require("./Response");
class Rule {

    constructor(owner, context, rule) {
        if (!("id" in rule)) throw new Error("id is not defined.");
        if (!("target" in rule)) throw new Error("target is not defined.");
        if (!("condition" in rule)) throw new Error("condition is not defined.");
        if (!("obligations" in rule)) throw new Error("obligations is not defined.");
        if (!("effect" in rule)) throw new Error("effect is not defined.");
        if (!("priority" in rule)) throw new Error("priority is not defined.");
        this.context = context;
        this.id = rule.id;
        this.name = owner+` | Rule ${this.id}`;
        this.logger = this.context.registry.getLogger();
        this.target = new Condition(this.name, this.context, rule.target, 'Target');
        this.condition = new Condition(this.name, this.context, rule.condition);
        this.obligations = rule.obligations;
        this.effect = rule.effect;
        this.priority = rule.priority;

    }

    isApplicable(message){
        return this.target.isApplicable(message);
    }

    evaluateCondition(message) {
        let res = new Response(this.name);
        let isApplicable = this.condition.isApplicable(message);
        if (isApplicable) {
            res.setEffect(this.effect);
            res.addObligations(new Map().set(this.name.substr(4),this.obligations));
            return res;
        }
        return res;
    }

}

module.exports = Rule;