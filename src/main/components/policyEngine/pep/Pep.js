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
let ContextHandler = require("./ContextHandler");
let PDP = require("../pdp/Pdp");

class PEP {
    constructor(name, context) {
        this.name = name;
        context.pep = this;
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.pdp = new PDP(this.context);
        this.contextHandler = new ContextHandler(this.context);
        this.logger.info(`[${this.name}] new instance`);
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

        let response = this.pdp.authorize(authorizationRequest);

        let authorizationResponse = this.contextHandler.parseToAuthzResponse(response);

        return this._enforce(authorizationResponse, msg);
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

    _enforce(response, msg) {

        // Todo: take actions according to/specified in the decision from PDP
        let permitted = response.effect === "permit";
        this.logger.info(`[${this.name}] message authorized: ${permitted}, policing decision: ${response.effect}`);
        msg.body.auth = permitted;
        return msg;
    }
}

module.exports = PEP;