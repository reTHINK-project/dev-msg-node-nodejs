/**
 * Created by Hao on 2017/3/6.
 */

import Operators from './Operators';

class AttributeCondition {

    constructor(condition) {
        this.attribute = Object.keys(condition)[0];
        this.expression = Object.values(condition)[0];
        this.operators = new Operators();
    }

    isApplicable(context, message, expression = this.expression) {
        /**
         * Verifies if the condition is applicable to the message.
         * First, the system value that corresponds to the attribute is retrieved;
         * then, that value is compared with the parameter specified in the condition
         * by executing the operator implementation.
         * @param  {Object}    context   environment where the Policy Engine is being used
         * @param  {Object}    message
         */
        context[this.attribute] = {message: message};
        let value = context[this.attribute];
        let results = [];
        if (expression.constructor === Object) {
            for (let operator in expression) {
                if (!(expression.hasOwnProperty(operator))) continue;
                let params = expression(operator);
                if (operator==="not"){
                    results.push(this.operators.not(this.isApplicable(context, message, params)));
                    continue;
                }
                if (params.constructor === Array) {
                    results.push(params.some(param => {
                        return this.operators[operator](value, param, this.attribute);
                    }));
                    continue;
                }
                results.push(this.operators[operator](value, params, this.attribute));
            }
            return this.operators.allOf(results);

        } else if (expression.constructor === Array) {
            return expression.some(express=>{
                return this.isApplicable(context, message, express);
            });
        } else {
            throw new Error(`Unsupported condition format`);
        }
    }
}

export default AttributeCondition;