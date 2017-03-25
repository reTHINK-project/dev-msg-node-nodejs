/**
 * Created by Hao on 2017/3/6.
 */

let Operators = require('./Operators');

class AttributeCondition {

    constructor(context, condition) {
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.attribute = Object.keys(condition)[0];
        this.expression = condition[Object.keys(condition)[0]];
        this.operators = new Operators();
        this.name = "PDP AttrCond";
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
        let final = false;
        if (expression.constructor === Object) {
            let results = [];
            for (let operator in expression) {
                let result = false;
                if (!(expression.hasOwnProperty(operator))) continue;
                let params = expression[operator];
                // if logical operator
                if (operator==="not" || operator==="allOf" || operator === "anyOf"){
                    params = Array.isArray(params)?params:[params];
                    result = this.operators[operator](params.map(param=>{return this.isApplicable(message, param)}));
                }
                // otherwise it is comparative operator
                // if params is an array
                else if (params.constructor === Array) {
                    result = params.some(param => {
                        return this.operators[operator](value, param, this.attribute);
                    });
                }
                // otherwise it is a value
                else {
                    result = this.operators[operator](value, params, this.attribute);
                }
                results.push(result);
            }
            final = this.operators.allOf(results);
        } else if (expression.constructor === Array) {
            final = expression.some(express=>{
                return this.isApplicable(message, express);
            });
        } else {
            throw new Error(`Unsupported condition format`);
        }
        if (expression === this.expression) {
            this.logger.info(`[${this.name}] ${this.attribute} ${value} fulfils ${JSON.stringify(expression)}: ${final}`);
        }
        return final;
    }
}

module.exports = AttributeCondition;