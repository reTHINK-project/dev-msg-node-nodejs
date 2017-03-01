/*
* Policy Enforcement Point - Point which intercepts user's access request to a resource, makes a decision request to the
* PDP to obtain the access decision (i.e. access to the resource is approved or rejected), and acts on the received decision.
* When a user tries to access a file or other resource on a computer network or server that uses policy-based access management,
* the PEP will describe the user’s attributes to other entities on the system. Therefore, PEPs are usually specific to an application
* and cannot be re-used for different applications.
*
* A user makes an access request to a resource. The request is received by a policy enforcement point. The policy enforcement point
* might check the user’s credentials to see if the user has been authenticated.
* */

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
    analyse(clientMsg) {
        return this.pdp.analyse(clientMsg.msg.msg)
            .then(result=>{
                if (result.denied) {
                    throw new Error(result.error);
                }
            });
    }
}
module.exports = PEP;