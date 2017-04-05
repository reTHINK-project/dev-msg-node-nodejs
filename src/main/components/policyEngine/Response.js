/**
 * Created by hjiang on 3/13/17.
 */

class Response {

    constructor (source, info = '', effect = 'notApplicable'){
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

    appendSource(child){
        this.source = this.source + '/' + child.substr(3);
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
        return `${this.source} determined to ${this.effect}. ${this.info}`
    }

}

module.exports = Response;