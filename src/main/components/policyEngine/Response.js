/**
 * Created by hjiang on 3/13/17.
 */

class Response {

    constructor (source, info = '', effect = 'notApplicable'){
        this.effect = effect;
        this.obligations = new Map();
        this.info = info;
        this.source = source;
        this.msg = null;
    }

    addObligations(obligations) {
        for (let [key,value] of obligations) {
            this.obligations.set(key, value);
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

    getInfo(){
        return `[${this.source}] determined to ${this.effect}. ${this.info}`
    }

    getMessage(){
        return this.msg;
    }

    setMessage(msg){
        this.msg = msg;
    }


}

module.exports = Response;