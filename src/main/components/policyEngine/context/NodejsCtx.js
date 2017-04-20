/**
 * Created by hjiang on 3/9/17.
 */
let ReThinkCtx = require('./ReThinkCtx');
let Attributes = require('./../Attributes');

class NodejsCtx extends ReThinkCtx {

    constructor(registry) {
        super();
        this.name = 'PDP';
        this.registry = registry;
        this.devMode = registry.config.policyConfig.development;
        this.logger = this.registry.getLogger();
        this.attri = new Attributes();
    }

    extractValueOfAttribute(attr, msg) {
        if (attr in this.attri) {
            return this.attri[attr](msg, this);
        } else {
            this.logger.error(`[${this.name}] attribute ${attr} is not extractable for the message ${msg}`);
        }
    }

    isAttribute(attr) {
        return Object.getOwnPropertyNames(this.attri.__proto__).slice(1).includes(attr);
    }

    isAttributed(attr){
        if (attr.startsWith("<") && attr.endsWith(">") && this.isAttribute(attr.slice(1,-1))){
            return attr.slice(1,-1);
        } else {
            return null;
        }
    }

    extractAllAttributeValues(msg){

        let [attributes, attributeValues] = [Object.getOwnPropertyNames(this.attri.__proto__).slice(1), new Map()];
        for (let index in attributes) {
            let attribute = attributes[index];
            attributeValues.set(attribute, this.attri[attribute](msg, this));
        }
        return attributeValues;
    }

}
module.exports = NodejsCtx;