/**
 * Created by TBtuo on 22/08/16.
 */

'use strict';

const fsStore = require('./store/FS');
const comparator = require('./Comparator');

class PDP {
    constructor() {

    }
    setStore(store) {
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
                    return {
                        validated: false,
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
        // console.log('compare here!!');
        return new Promise((resolve, reject) => {
            //for now, compare with rules
            const denied = policy.rules.some(rule => {
                if (!rule.condition) {
                    //final decision
                    return rule.effect === 'deny';
                }
                const parts = rule.condition.split(" ");
                const tag = parts.shift(); //time,  weekday, etc.
                if (tag in comparator) {
                    const bingo = comparator[tag].apply(comparator, parts);
                    return rule.effect === 'deny' ? bingo : !bingo;
                }
                //no method found, deny
                return true;
            });
            resolve(denied);
        });
    }
    otherAlgo() {
        // todo : other method which depend on the other compare algorithm to filter the message with the policy
        return true
    }
}
module.exports = new PDP();