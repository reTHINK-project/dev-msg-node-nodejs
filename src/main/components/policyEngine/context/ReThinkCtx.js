/**
 * Created by hjiang on 3/9/17.
 */
import {divideEmail, divideURL, isDataObjectURL} from './Utils';

class ReThinkCtx {

    constructor(){
        this.defaultBehaviour = true;
        this.groups  = {};
    }

    get scheme() {
        return this._scheme;
    }

    get date() {
        return this._date;
    }

    get domain() {
        return this._domain;
    }

    get type() {
        return this._type;
    }

    get source() {
        return this._source;
    }

    get time() {
        return this._time;
    }

    get weekday() {
        return this._weekday;
    }

    set scheme(params) {
        let from = params.message.from;
        if (isDataObjectURL(from)) {
            this._scheme = divideURL(from).type;
        } else {
            this._scheme = undefined;
        }
    }

    set date(now) {
        let date = new Date();
        let day = String(date.getDate());
        if (day.length === 1) {
            day = '0' + day;
        }
        let month = String(date.getMonth() + 1);
        if (month.length === 1) {
            month = '0' + month;
        }
        this._date = day + '/' + month + '/' + date.getFullYear();
    }

    set domain(params) {
        if (params.message.body.identity !== undefined) {
            this._domain = divideEmail(params.message.body.identity.userProfile.username).domain;
        }
    }

    set type(params) {
        let message = params.message;
        if (message.body.value !== undefined) {
            this._type = message.body.value.resourceType;
        }
    }

    set source(params) {
        if (params.message.body.identity !== undefined) {
            this._source = params.message.body.identity.userProfile.username;
        }
    }

    set time(now) {
        now = new Date();
        let minutes = String(now.getMinutes());
        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }
        this._time = parseInt(String(now.getHours()) + minutes);
    }

    set weekday(now) {
        this._weekday = String(new Date().getDay());
    }

}

export default ReThinkCtx