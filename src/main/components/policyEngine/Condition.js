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
        if (condition) {

        }


    }



}

export default Condition;