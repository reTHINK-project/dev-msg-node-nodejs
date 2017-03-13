/**
 * Created by hjiang on 3/4/17.
 */
import AttributeCondition from "./AttributeCondition";
import Operators from "./Operators";


class Condition {

    constructor(condition){
        this.operators = new Operators();
        this.condition = this._buildCondition(condition);
    }

    _buildCondition(condition){
        if (Object.keys(condition)[0] in this.operators){
            condition[Object.keys(condition)[0]] = Object.values(condition)[0].map(subCondition=>{
                return this._buildCondition(subCondition);
            });
        } else {
            return new AttributeCondition(condition);
        }
        return condition;
    }

    isApplicable(context, message, condition = this.condition){
        if (condition instanceof AttributeCondition){
            return condition.isApplicable(context, message);
        } else {
            let operator = Object.keys(condition)[0];
            return this.operators[operator](
                Object.values(condition)[0].map(subCondition=>{
                    return this.isApplicable(context, message, subCondition);
                })
            );
        }
    }

}

export default Condition;