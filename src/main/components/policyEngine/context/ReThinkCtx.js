/**
 * Created by hjiang on 3/9/17.
 */
import {divideEmail, divideURL, isDataObjectURL} from './Utils';
import moment from 'moment';

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

    get srcDomain() {
        return this._srcDomain;
    }

    get type() {
        return this._type;
    }

    get srcUser() {
        return this._srcUser;
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
        this._date = moment().format("YYYY-MM-DD");
    }

    set srcDomain(params) {
        if (params.message.body.identity !== undefined) {
            this._srcDomain = divideEmail(params.message.body.identity.userProfile.username).domain;
        }
    }

    set type(params) {
        let message = params.message;
        if (message.body.value !== undefined) {
            this._type = message.body.value.resourceType;
        }
    }

    set srcUser(params) {
        if (params.message.body.identity !== undefined) {
            this._srcUser = params.message.body.identity.userProfile.username;
        }
    }

    set time(now) {
        this._time = moment().format("HH:mm:ss");
    }

    set weekday(now) {
        this._weekday = moment().format("dddd");
    }

}

export default ReThinkCtx