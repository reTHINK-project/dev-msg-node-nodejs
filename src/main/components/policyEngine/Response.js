/**
 * Created by hjiang on 3/13/17.
 */

class Response {

    constructor (effect = 'notApplicable'){
        this.effect = effect;
        this.actions = new Map();
    }

    addActions(actions) {
        if (Object.keys(actions).length){
            for (let key in actions) {
                if (!actions.hasOwnProperty(key)) continue;
                this.actions.set(key, actions[key]);
            }
        }

    }

    setEffect(effect){
        this.effect = effect;
    }

    clearActions() {
        this.actions.clear();
    }

}

export default Response;