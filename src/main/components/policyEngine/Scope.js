/**
 * Created by hjiang on 3/13/17.
 */

import AttributeCondition from './AttributeCondition';

class Scope {

    constructor (scope) {
        this.scope = scope
    }

    isApplicable(context, message) {
        if (!Object.keys(this.scope).length){
            return true;
        } else if (Array.isArray(this.scope)){
            return this.scope(subScope=>{
                let subCond1 = new AttributeCondition(subScope);
                return subCond1.isApplicable(context, message);
            });
        } else {
            return Object.keys(this.scope).every(subAttri=>{
                let subCond2 = new AttributeCondition({[subAttri]: this.scope[subAttri]});
                return subCond2.isApplicable(context, message);
            });
        }
    }

}

export default Scope;