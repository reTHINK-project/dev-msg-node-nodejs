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
    constructor(context) {
        this.name = 'PDP';
        context.pdp = this;
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.prp = new PRP(this.context);
        this.logger.info(`[${this.name}] new instance`);
    }

    // ========================= public =============================

    authorize(authorizationRequest) {

        authorizationRequest = this._validate(authorizationRequest);

        let policySet = this.prp.getPolicySet(authorizationRequest);

        let response = policySet ? policySet.evaluatePolicies(authorizationRequest) : new Response(this.name, 'No policies could be found from PRP');

        return this._respond(response);

    }

    // ========================= private ============================

    _validate(authorizationRequest) {

    // Todo: Identify fields to check for request validation.

        return authorizationRequest;
    }

    _respond(response) {
    // Todo
        return response;
    }
}

module.exports = PDP;