/**
 * Created by TBtuo on 22/08/16.
 */

'use strict';

const fsStore = require('./store/FS');
const comparator = require('./Comparator');

class PDP {
    constructor(registry, store) {
        this.name = 'PDP';
        this.registry = registry;
        this.logger = this.registry.getLogger();
        this.store = store;
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
                        error: "NO_POLICY"
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
        return new Promise((resolve, reject) => {
            //permit, unless one denies
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
            resolve({denied: denied, error: 'Policing'});
        });
    }
    otherAlgo() {
        // todo : other method which depend on the other compare algorithm to filter the message with the policy
        return true
    }
}
module.exports = PDP;