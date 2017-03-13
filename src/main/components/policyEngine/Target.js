/**
 * Created by hjiang on 3/4/17.
 */

import AttributeCondition from './AttributeCondition';

class Target {

    constructor (target) {
        this.target = target;
    }

    isApplicable(context, message) {
        if (!Object.keys(this.target).length){
            return true;
        } else if (Array.isArray(this.target)){
            return this.target.some(subTarget=>{
                let subCond1 = new AttributeCondition(subTarget);
                return subCond1.isApplicable(context, message);
            });
        } else {
            return Object.keys(this.target).every(subAttri=>{
                let subCond2 = new AttributeCondition({[subAttri]: this.target[subAttri]});
                return subCond2.isApplicable(context, message);
            });
        }
    }

}

export default Target;