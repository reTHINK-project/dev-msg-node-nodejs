/**
 * Created by hao on 17/04/17.
 */
let Moment = require('moment');

class Request {
    constructor (message, context) {
        this.msg = message;
        this.timeStamp = Moment();
        this.context = context;
    }

    getMessage(){
        return this.msg;
    }

    getTimeStamp(){
        return this.timeStamp;
    }

    getContext(){
        return this.context;
    }
}

module.exports = Request;