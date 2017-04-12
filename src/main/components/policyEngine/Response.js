/**
 * Created by hjiang on 3/13/17.
 */

class Response {

    constructor (source, info = '', effect = 'notApplicable'){
        this.effect = effect;
        this.obligations = new Map();
        this.info = info;
        this.source = source.substr(4);
    }

    addObligations(obligations) {
        for (let [key,value] of obligations) {
            this.obligations.set(key, value);
        }
    }

    appendSource(child){
        this.source = this.source + '/' + child;
    }

    pushSource(parent){
        this.source =  parent + '/' + this.source;
    }

    popSource(){
        this.source = this.source.substr(0, this.source.lastIndexOf("/"))
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