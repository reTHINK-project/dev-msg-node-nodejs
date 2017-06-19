/**
 * Created by hjiang on 3/4/17.
 */
let AttributeCondition = require("./AttributeCondition");
let Operators = require("./Operators");


class Condition {

    constructor(owner, context, condition, usedFor = "Condition"){
        this.name = owner+' '+usedFor;
        this.develop = context.devMode;
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.operators = new Operators();
        this.condition = this._buildCondition(condition);
    }

    _buildCondition(condition){
        // if the condition is of MAP type
        if (condition.constructor === Object) {
            // if the map has multiple keys, which are of AND relations
            if (Object.keys(condition).length > 1) {
                let allOf = [];
                for (let key in condition) {
                    if(!condition.hasOwnProperty(key)) continue;
                    let value = condition[key];
                    allOf.push(this._buildCondition({[key]: value}));
                }
                condition = {"allOf": allOf};
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
                else {
                    key = this.context.isAttributed(key);
                    if (key) {
                        condition = new AttributeCondition(this.context, key, value);
                    } else {
                        this.logger.error(`[${this.name}] unrecognized key when building condition: ${key}!`);
                    }
                }
            }
            // else the map is empty
            // else {
            // this.logger.info(`[${this.name}] warning: empty ${this.usedFor} implies global applicability`);
            // }
        }
        // if the condition is of ARRAY type, which contains subConditions with OR relations
        else {
            condition = condition.map(subCondition=>{return this._buildCondition(subCondition)});
            condition = condition.length===0?{}:{"anyOf": condition};
        }
        return condition;
    }

    isApplicable(message, condition = this.condition){

        if (condition instanceof AttributeCondition){
            let _applicable = condition.isApplicable(message);
            if (this.develop){
                this.logger.info(`[${this.name}] ${condition.attribute} ${condition.getAttributeValue(message)} ${JSON.stringify(condition.expression).slice(1,-1)}: ${_applicable}`);
            }
            return _applicable;
        }
        // if the condition is not of Object type
        else if (condition.constructor !== Object) {
            throw new Error(`[${this.name}] syntax error: compiled condition should only be of Object type!`);
        }
        // the condition is not an instance of AttributeCondition
        // the condition contains multiple keys
        else if (Object.keys(condition).length > 1){
            throw new Error(`[${this.name}] syntax error: compiled condition contains multiple keys in a map!`);
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
            } else if (this.context.isAttributed(key)){
                throw new Error(`[${this.name}] syntax error: attribute is failed to build attribute condition object: ${key}!`);
            } else {
                throw new Error(`[${this.name}] syntax error: unrecognized key in condition field: ${key}!`);
            }
        }
        // empty condition
        else {
            if (this.develop){
                this.logger.info(`[${this.name}] is globally applicable`);
            }
            return true;
        }
    }
}

module.exports = Condition;