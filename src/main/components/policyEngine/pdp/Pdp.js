/**
 * Created by Hao Jiang on 22/02/17.
 * Policy Decision Point - Point which evaluates access requests against authorization policies before issuing access decisions.
 * The PDP evaluates the authorization request against the policies it is configured with. The policies are acquired via
 * the Policy Retrieval Point (PRP) and managed by the Policy Administration Point (PAP). If needed it also retrieves attribute values from underlying Policy Information Points (PIP).
 * The PDP reaches a decision (Permit / Deny / NotApplicable / Indeterminate) and returns it to the PEP
 */

'use strict';

let PRP = require("../prp/Prp");

class PDP {
    constructor(context) {
        this.name = 'PDP';
        context.pdp = this;
        this.context = context;
        this.logger = this.context.getLogger();
        this.prp = new PRP(this.context);
        this.logger.info(`[${this.name}] new instance`);
    }

    // ========================= public =============================

    authorize(authorizationRequest) {

        authorizationRequest = this._validate(authorizationRequest);

        let policy = this.prp.getPolicy(authorizationRequest);

        return policy.evaluateRules(authorizationRequest);

    }

    // ========================= private ============================

    _validate(authorizationRequest) {

    // Todo: Identify fields to check for request validation.

        return authorizationRequest;
    }
}

module.exports = PDP;