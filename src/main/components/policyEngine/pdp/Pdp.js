/**
 * Created by Hao Jiang on 22/02/17.
 * Policy Decision Point - Point which evaluates access requests against authorization policies before issuing access decisions.
 * The PDP evaluates the authorization request against the policies it is configured with. The policies are acquired via
 * the Policy Retrieval Point (PRP) and managed by the Policy Administration Point (PAP). If needed it also retrieves attribute values from underlying Policy Information Points (PIP).
 * The PDP reaches a decision (Permit / Deny / NotApplicable / Indeterminate) and returns it to the PEP
 */

'use strict';

import PRP from "../prp/Prp"

class PDP {
    constructor(registry) {
        this.name = 'PDP';
        this.registry = registry;
        this.logger = this.registry.getLogger();
        this.prp = new PRP(registry);
    }

    /**
     * @param {Object} opt
     * @returns Promise
     */
    getPolicy(opt) {
        //todo get policy from db
        return this.store.getPolicy(opt);
    }

    /**
     * @param {Object} msg
     * @returns Promise
     */
    analyse(msg) {
        return this.getPolicy(msg)
            .then(policy => {
                if (!policy) {
                    this.logger.info(`[${this.name}] No policy can be applied to the message.`);
                    return {
                        denied: true,
                        info: "NO_POLICY"
                    };
                }
                return this.compare(msg, policy);
            });
    }

    /**
     * @param msg
     * @param policy
     * @returns Promise
     */
    compare(msg, policy) {
        const denied = policy.rules.some(rule => {
                if (!rule.condition) {
                    //final decision
                    this.logger.info(`[${this.name}] Applying default action: ${rule.effect}`);
                    return rule.effect == 'deny';
                }
                const parts = rule.condition.split(" ");
                const tag = parts.shift(); //time,  weekday, etc.
                if (tag in comparator) {
                    let bingo = comparator[tag].apply(comparator,parts);
                    this.logger.info(`[${this.name}] Checking if ${tag} fulfils condition ${parts}: ${bingo}`);
                    return bingo ? rule.effect == 'deny' : false;
                } else {
                    this.logger.info(`[${this.name}] Comparator has no method to analyze ${tag} condition.`);
                    return false;
                }
            });
        this.logger.info(`[${this.name}] Message passed: ${!denied}`);
        return {denied: denied, info: 'Policing'};
    }
    otherAlgo() {
        // todo : other method which depend on the other compare algorithm to filter the message with the policy
        return true
    }
}
module.exports = PDP;