/**
 * Created by hjiang on 3/9/17.
 */
let divideEmail = require('./Utils').divideEmail();
let divideURL = require('./Utils').divideURL();
let isDataObjectURL = require('./Utils').isDataObjectURL();
let moment = require('moment');

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

    get rscType() {
        return this._rscType;
    }

    get msgType() {
        return this._msgType;
    }

    get msgId() {
        return this._msgId;
    }

    get srcUser() {
        return this._srcUser;
    }

    get msgFrom() {
        return this._msgFrom;
    }

    get msgTo() {
        return this._msgTo;
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

    set rscType(params) {
        if (params.message.body.value !== undefined) {
            this._rscType = params.message.body.value.resourceType;
        }
    }

    set msgType(params) {
        this._msgType = params.message.type;
    }

    set msgId(params) {
        this._msgId = params.message.id;
    }

    set msgFrom(params) {
        this._msgFrom = params.message.from;
    }

    set msgTo(params) {
        this._msgTo = params.message.to;
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

module.exports = ReThinkCtx;