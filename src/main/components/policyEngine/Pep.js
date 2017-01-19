const PDP = require("./Pdp");
class PEP {
    constructor(name, registry) {
        this.name = name;
        this.registry = registry;
        this.logger = this.registry.getLogger();
      const cfg = require('../../../../src/configs/policy');
      const Store = require(`./store/${cfg.store}`);
        PDP.setStore(Store);
    }
    /**
     * @param {Object} msg
     * @param {String} msg.id
     * @param {String} msg.type
     * @param {String} msg.from
     * @param {String} msg.to
     * @param {Object} msg.body
     * @returns {validated:Boolean,error:Object}
     */

    getName(){
        return this.name
    }
    analyse(msg) {
        this.logger.info('[Policy Engine] Analysing Message', JSON.stringify(msg));
        return PDP.analyse(msg).then(function (result) {
            if (!result.validated) {
                return this.response(result.error, false);
            }
            return this.response("OK",true);
        });
    }
    response(msg, validated) {
        const res = {
            validated: validated,
        };
        if (!validated) {
            res.error = msg;
        }
        return res;
    }
}
module.exports = PEP;