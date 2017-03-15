/**
 * Created by hjiang on 3/4/17.
 */
let AttributeCondition = require("./AttributeCondition");
let Operators = require("./Operators");


class Condition {

    constructor(context, condition){
        this.name = "PDP";
        this.context = context;
        this.logger = this.context.getLogger();
        this.operators = new Operators();
        this.toString = JSON.stringify(condition);
        this.condition = this._buildCondition(condition);
    }

    _buildCondition(condition){
        if (Object.keys(condition)[0] in this.operators){
            condition[Object.keys(condition)[0]] = condition[Object.keys(condition)[0]].map(subCondition=>{
                return this._buildCondition(subCondition);
            });
        } else {
            return new AttributeCondition(this.context, condition);
        }
        return condition;
    }

    isApplicable(message, condition = this.condition){
        if (condition instanceof AttributeCondition){
            return condition.isApplicable(message);
        } else {
            let operator = Object.keys(condition)[0];
            return this.operators[operator](
                condition[Object.keys(condition)[0]].map(subCondition=>{
                    return this.isApplicable(message, subCondition);
                })
            );
        }
    }

}

module.exports = Condition;