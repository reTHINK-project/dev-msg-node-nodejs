/**
 * Created by hjiang on 3/9/17.
 */
let divideEmail = require('./Utils').divideEmail;
let divideURL = require('./Utils').divideURL;
let isDataObjectURL = require('./Utils').isDataObjectURL;
let moment = require('moment');
let operators = require('../Operators');

class ReThinkCtx {

    constructor(){
        this.defaultBehaviour = true;
        this.operators = new operators();
        this.groups  = {};
    }

    // ==================================== environment attributes ======================================

    get date() {
        return this._date;
    }

    set date(now) {
        this._date = moment().format("YYYY-MM-DD");
    }

    get time() {
        return this._time;
    }

    set time(now) {
        this._time = moment().format("HH:mm:ss");
    }

    get weekday() {
        return this._weekday;
    }

    set weekday(now) {
        this._weekday = moment().format("dddd");
    }

    // ==================================== subject attributes =========================================

    get srcIDPDomain() {
        return this._srcIDPDomain;
    }

    set srcIDPDomain(params) {
        if (params.message.body.identity !== undefined) {
            this._srcIDPDomain = divideEmail(params.message.body.identity.userProfile.username).domain;
        }
    }

    get srcUsername() {
        return this._srcUsername;
    }

    set srcUsername(params) {
        if (params.message.body.identity !== undefined) {
            this._srcUsername = params.message.body.identity.userProfile.username;
        }
    }

    get srcIDP() {
        return this._srcIDP;
    }

    set srcIDP(params) {
        if (params.message.body.identity !== undefined) {
            this._srcIDP = params.message.body.identity.idp;
        }
    }

    get srcSPDomain() {
        return this._srcSPDomain;
    }

    set srcSPDomain(params) {
        let from = params.message.from;
        this._srcSPDomain = divideURL(from).domain;
    }

    get srcScheme() {
        return this._srcScheme;
    }

    set srcScheme(params) {
        let from = params.message.from;
        this._srcScheme = divideURL(from).type;
    }

    get msgFrom() {
        return this._msgFrom;
    }

    set msgFrom(params) {
        this._msgFrom = params.message.from;
    }

    // ==================================== object attributes =========================================
    get msgTo() {
        return this._msgTo;
    }

    set msgTo(params) {
        this._msgTo = params.message.to;
    }

    get dstScheme() {
        return this._dstScheme;
    }

    set dstScheme(params) {
        let to = params.message.to;
        this._dstScheme = divideURL(to).type;
    }

    get dstSPDomain() {
        return this._dstSPDomain;
    }

    set dstSPDomain(params) {
        let to = params.message.to;
        this._dstSPDomain = divideURL(to).domain;
    }

    // ==================================== action attribute ==========================================

    get actionType() {
        return this._actionType;
    }

    set actionType(params) {
        this._actionType = params.message.type;
    }

    // ===================================== resource attribute =======================================
    get resource() {
        return this._resource;
    }

    set resource(params) {
        if (params.message.body.resource !== undefined) {
            this._resource = params.message.body.resource;
        }
    }

    // ===================================== system attribute =========================================
    get msgId() {
        return this._msgId;
    }

    set msgId(params) {
        this._msgId = params.message.id;
    }

    get msgType() {
        throw new Error("method must be implemented");
    }

    set msgType(params) {
        throw new Error("method must be implemented");
    }
}

module.exports = ReThinkCtx;