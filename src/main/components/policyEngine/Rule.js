/**
 * Created by hjiang on 3/1/17.
 */
import Target from "./Target";
import Condition from "./Condition";
import Response from "./Response";
class Rule {

    constructor(rule) {
        if (!("target" in rule)) throw new Error("target is not defined.");
        if (!("condition" in rule)) throw new Error("condition is not defined.");
        if (!("actions" in rule)) throw new Error("actions is not defined.");
        if (!("effect" in rule)) throw new Error("effect is not defined.");
        if (!("priority" in rule)) throw new Error("priority is not defined.");
        this.target = new Target(rule.target);
        this.condition = new Condition(rule.condition);
        this.actions = rule.actions;
        this.effect = rule.effect;
        this.priority = rule.priority;
    }

    isApplicable(context, message){
        return this.target.isApplicable(context, message);
    }

    evaluateCondition(context, message) {
        let res = new Response();
        if (this.condition.isApplicable(context, message)) {
            res.setEffect(this.effect);
            res.addActions(this.actions);
            return res;
        }
        return res;
    }

}

export default Rule;