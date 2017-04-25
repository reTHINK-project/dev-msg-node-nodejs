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
let Obligator = require("./Obligator");

class PEP {
    constructor(context, pdp) {
        this.name = 'PEP';
        this.context = context;
        this.develop = context.devMode;
        this.logger = this.context.registry.getLogger();
        this.pdp = pdp;
        this.contextHandler = new ContextHandler(context);
        this.obligator = new Obligator(context);
        this.logger.info(`[${this.name}] new instance`);
    }

    // ======================== public ========================

    getName(){
        return this.name
    }

    analyse(clientMsg) {
        let msg = this._validate(clientMsg.msg.msg);
        if (msg) {
            let request  = this.contextHandler.parseToAuthzRequest(clientMsg);
            let response = this.pdp.authorize(request);
            response.setMessage(msg);
            let authorizationResponse = this.contextHandler.parseToAuthzResponse(response);
            return this._enforce(authorizationResponse);
        } else {
            return {
                result: false,
                getInfo: ()=>{return 'invalid message'}
            };
        }
    }
    // ======================== private =======================

    _validate(msg) {
        if (!(msg && msg.id && msg.from && msg.to && msg.type)){
            this.logger.info(`[${this.name}] Invalid message`);
            return null;
        }
        return msg;
    }

    _enforce(response) {
        if (response.obligations.size){
            if (this.develop) {
                this.logger.info(`[${this.name}] Obligation`, response.obligations);
            }
            return this.obligator.obligate(response);
        } else {
            return response;
        }
    }
}

module.exports = PEP;