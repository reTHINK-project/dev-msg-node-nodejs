/**
 * Created by hjiang on 3/1/17.
 */
import Target from "./Target";
import Condition from "./Condition";


class Rule {

    constructor(rule) {
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