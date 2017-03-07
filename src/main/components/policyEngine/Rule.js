/**
 * Created by hjiang on 3/1/17.
 */
import Target from "./Target";
import Condition from "./Condition";


class Rule {

    constructor(rule) {
        if (!("target" in rule)) throw new Error("target is not defined.");
        if (!("condition" in rule)) throw new Error("condition is not defined.");
        if (!("actions" in rule)) throw new Error("actions is not defined.");
        if (!("effect" in rule)) throw new Error("effect is not defined.");
        if (!("priority" in rule)) throw new Error("priority is not defined.");
        this._setTarget(rule.target);
        this._setCondition(rule.condition);
        this._setActions(rule.actions);
        this.effect = rule.effect;
        this.priority = rule.priority;
    }

    _setTarget(target) {
    //    Todo
        this.target = new Target(target);
    }

    _setCondition(condition) {
    //    Todo
        this.condition = new Condition(condition);
    }

    _setActions(actions) {
    //    Todo
        this.actions = actions;
    }

}

export default Rule;