/**
 * Created by Hao on 2017/3/6.
 */

let Operators = require('./Operators');

class AttributeCondition {

    constructor(context, condition) {
        this.name = "PDP Attribute Condition";
        this.context = context;
        this.logger = this.context.getLogger();
        this.attribute = Object.keys(condition)[0];
        this.expression = condition[Object.keys(condition)[0]];
        this.operators = new Operators();
    }

    isApplicable(message, expression = this.expression) {
        /**
         * Verifies if the condition is applicable to the message.
         * First, the system value that corresponds to the attribute is retrieved;
         * then, that value is compared with the parameter specified in the condition
         * by executing the operator implementation.
         * @param  {Object}    message
         */
        this.context[this.attribute] = {message: message};
        let value = this.context[this.attribute];
        let results = [];
        if (expression.constructor === Object) {
            for (let operator in expression) {
                if (!(expression.hasOwnProperty(operator))) continue;
                let params = expression[operator];
                if (operator==="not"){
                    results.push(this.operators.not(this.isApplicable(message, params)));
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
                return this.isApplicable(message, express);
            });
        } else {
            throw new Error(`Unsupported condition format`);
        }
    }
}

module.exports = AttributeCondition;