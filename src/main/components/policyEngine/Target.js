/**
 * Created by hjiang on 3/4/17.
 */

let AttributeCondition = require('./AttributeCondition');

class Target {

    constructor (context, target) {
        this.name = "PDP Rule Target";
        this.target = target;
        this.context = context;
        this.logger = this.context.getLogger();
    }

    isApplicable(message) {
        if (!Object.keys(this.target).length){
            return true;
        } else if (Array.isArray(this.target)){
            return this.target.some(subTarget=>{
                let subCond1 = new AttributeCondition(this.context, subTarget);
                return subCond1.isApplicable(message);
            });
        } else {
            return Object.keys(this.target).every(subAttri=>{
                let subCond2 = new AttributeCondition(this.context, {[subAttri]: this.target[subAttri]});
                return subCond2.isApplicable(message);
            });
        }
    }

}

module.exports = Target;