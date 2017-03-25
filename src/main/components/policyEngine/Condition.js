/**
 * Created by hjiang on 3/4/17.
 */
let AttributeCondition = require("./AttributeCondition");
let Operators = require("./Operators");


class Condition {

    constructor(context, condition){
        this.name = "PDP";
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.operators = new Operators();
        this.toString = JSON.stringify(condition);
        this.condition = this._buildCondition(condition);
    }

    _buildCondition(condition){
        // if the condition is of MAP type
        if (condition.constructor === Object) {
            // if the map has multiple keys, which are of AND relations
            if (Object.keys(condition).length > 1) {
                condition["allOf"] = [];
                for (let key in condition) {
                    if(!condition.hasOwnProperty(key)) continue;
                    let value = condition[key];
                    delete condition[key];
                    condition["allOf"].push(this._buildCondition({[key]: value}));
                }
            }
            // if the map contains exactly one key
            else if (Object.keys(condition).length === 1){
                let key = Object.keys(condition)[0];
                let value = condition[key];
                // if the key is an operator
                if (key in this.operators){
                    value = Array.isArray(value)?value:[value];
                    condition[key] = value.map(subCondition=>{
                        return this._buildCondition(subCondition);
                    });
                }
                // if the key is an attribute
                else if (key in this.context){
                    condition = new AttributeCondition(this.context, condition);
                }
                // else invalid
                else {
                    this.logger.info(`[${this.name}] warning: unrecognized key when building condition: ${key}`);
                }
            }
            // else the map is empty
            else {
                this.logger.info(`[${this.name}] warning: empty condition/target implies global applicability`);
            }
        }
        // if the condition is of ARRAY type, which contains subConditions with OR relations
        else {
                condition = condition.map(subCondition=>{return this._buildCondition(subCondition)});
                condition = {"anyOf": condition};
        }
        return condition;
    }

    isApplicable(message, condition = this.condition){
        // if the condition is not of Object type
        if (condition.constructor !== Object) {
            throw new Error(`[${this.name}] syntax error: compiled condition should only be of Object type`);
        }
        // the condition is of Object type
        // if the condition is an instance of AttributeCondition
        else if (condition instanceof AttributeCondition){
            return condition.isApplicable(message);
        }
        // the condition is not an instance of AttributeCondition
        // the condition contains multiple keys
        else if (Object.keys(condition).length > 1){
            throw new Error(`[${this.name}] syntax error: compiled condition contains multiple keys in a map`);
        }
        // the condition contains only one key
        else if (Object.keys(condition).length === 1) {
            let key = Object.keys(condition)[0];
            let value = condition[key];
            if (key in this.operators) {
                return this.operators[key](
                    value.map(subCondition => {
                        return this.isApplicable(message, subCondition);
                    })
                );
            } else if (key in this.context){
                throw new Error(`[${this.name}] syntax error: attribute is failed to build attribute condition object: ${key}`);
            } else {
                throw new Error(`[${this.name}] syntax error: unrecognized key in condition field: ${key}`);
            }
        }
        // empty condition
        else {
            this.logger.info(`[${this.name}] warning: applying empty condition/target`);
            return true;
        }
    }
}

module.exports = Condition;