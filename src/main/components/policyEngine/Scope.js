/**
 * Created by hjiang on 3/13/17.
 */

let AttributeCondition = require('./AttributeCondition');

class Scope {

    constructor (context, scope) {
        this.name = "PDP Policy Scope";
        this.scope = scope;
        this.context = context;
        this.logger = this.context.getLogger();

    }

    isApplicable(message) {
        if (!Object.keys(this.scope).length){
            return true;
        } else if (Array.isArray(this.scope)){
            return this.scope(subScope=>{
                let subCond1 = new AttributeCondition(this.context, subScope);
                return subCond1.isApplicable(message);
            });
        } else {
            return Object.keys(this.scope).every(subAttri=>{
                let subCond2 = new AttributeCondition(this.context, {[subAttri]: this.scope[subAttri]});
                return subCond2.isApplicable(message);
            });
        }
    }

}

module.exports = Scope;