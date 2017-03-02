/**
 * Created by hjiang on 3/1/17.
 */

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
    }

    _setCondition(condition) {
    //    Todo
    }

    _setActions(actions) {
    //    Todo
    }

}

export default Rule;