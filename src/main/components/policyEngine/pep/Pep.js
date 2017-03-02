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
import ContextHandler from "./ContextHandler";
import PDP from "../pdp/Pdp";

class PEP {
    constructor(name, registry) {
        this.name = name;
        this.registry = registry;
        this.logger = this.registry.getLogger();
        this.pdp = new PDP(this.registry);
        this.contextHandler = new ContextHandler(registry);
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
    // ======================== public ========================

    getName(){
        return this.name
    }

    analyse(msg) {

        msg = this._validate(msg);

        let authorizationRequest = this.contextHandler.parseToAuthzRequest(msg);

        return this.pdp.authorize(authorizationRequest).then(decision => {
            let authorizationResponse = this.contextHandler.parseToAuthzResponse(decision);
            this._enforce(authorizationResponse);
        });
    }
    // ======================== private =======================

    _validate(msg) {

        // Todo: enrich with more means appropriate to check the validity of the message

        if (!msg) throw new Error('message is not defined');
        if (!msg.id) throw new Error('message.id is not defined');
        if (!msg.from) throw new Error('message.from is not defined');
        if (!msg.to) throw new Error('message.to is not defined');
        if (!msg.type) throw new Error('message.type is not defined');
        msg.body = msg.body || {};
        return msg;
    }

    _enforce(response) {

        // Todo: take actions according to/specified in the decision from PDP

        if (response.denied) {
            throw new Error(decision.info)
        }
    }
}

export default PEP;