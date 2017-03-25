/**
 * Created by hjiang on 3/13/17.
 */

class Response {

    constructor (source, info = null, effect = 'notApplicable'){
        this.name = "PDP Response";
        this.effect = effect;
        this.obligations = new Map();
        this.info = info;
        this.source = source;
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

    setInfo(info){
        this.info = info
    }

}

module.exports = Response;