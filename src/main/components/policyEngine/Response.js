/**
 * Created by hjiang on 3/13/17.
 */

class Response {

    constructor (effect = 'notApplicable'){
        this.name = "PDP Response";
        this.effect = effect;
        this.obligations = new Map();
        this.rules = [];
    }

    addObligations(obligations) {
        if (Object.keys(obligations).length){
            for (let key in obligations) {
                if (!obligations.hasOwnProperty(key)) continue;
                this.obligations.set(key, obligations[key]);
            }
        }

    }

    setEffect(effect){
        this.effect = effect;
    }

    clearObligations() {
        this.obligations.clear();
    }

    attachRule(rule){
        this.rules.push(rule);
    }

}

module.exports = Response;