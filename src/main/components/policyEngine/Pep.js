const PDP = require("./Pdp");
class PEP {
    constructor(name, registry) {
        const cfg = require('../../../../src/configs/policy');
        const Store = require(`./store/${cfg.store}`);
        this.name = name;
        this.registry = registry;
        this.logger = this.registry.getLogger();
        this.pdp = new PDP(this.registry,Store);
    }
    /**
     * @param {Object} msg
     * @param {String} msg.id
     * @param {String} msg.type
     * @param {String} msg.from
     * @param {String} msg.to
     * @param {Object} msg.body
     * @returns {denied:Boolean,error:Object}
     */

    getName(){
        return this.name
    }
    analyse(msg) {
        return this.pdp.analyse(msg)
            .then(result=>{
                if (result.denied) {
                    throw new Error(result.error);
                }
            });
    }
}
module.exports = PEP;