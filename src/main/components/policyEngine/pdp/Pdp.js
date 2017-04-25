/**
 * Created by Hao Jiang on 22/02/17.
 * Policy Decision Point - Point which evaluates access requests against authorization policies before issuing access decisions.
 * The PDP evaluates the authorization request against the policies it is configured with. The policies are acquired via
 * the Policy Retrieval Point (PRP) and managed by the Policy Administration Point (PAP). If needed it also retrieves attribute values from underlying Policy Information Points (PIP).
 * The PDP reaches a decision (Permit / Deny / NotApplicable / Indeterminate) and returns it to the PEP
 */

'use strict';

let PRP = require("../prp/Prp");
let Response = require("../Response");

class PDP {
    constructor(context, prp) {
        this.name = 'PDP';
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.prp = prp;
        this.logger.info(`[${this.name}] new instance`);
        this.develop = context.devMode;
    }

    // ========================= public =============================

    authorize(request) {
        let policySet = null;
        let msg = this._validate(request);
        if (msg) {
            if (this.develop){
                this.logger.info(`[${this.name}] message attributes`, this.context.getAllAttributeValues(msg));
            }
            policySet = this.prp.getPolicySet(msg);
        }
        return this._respond(policySet, msg);
    }

    // ========================= private ============================

    _validate(request) {
        let msg = request.getMessage();
        if (!(msg && msg.id && msg.from && msg.to && msg.type)){
            this.logger.error(`[${this.name}] Invalid message`);
            return null;
        }
        return msg;
    }

    _respond(policySet, msg) {
        let response = new Response(this.name, 'No policies could be found from PRP');
        if (policySet) {
            response = policySet.evaluatePolicies(msg);
        }
        return response;
    }
}

module.exports = PDP;