/**
 * Created by hao on 20/04/17.
 */
let divideEmail = require('./context/Utils').divideEmail;
let divideURL = require('./context/Utils').divideURL;
let removePathFromURL = require('./context/Utils').removePathFromURL;
let getUserEmailFromURL = require('./context/Utils').getUserEmailFromURL;
let moment = require('moment');
let config = require('../../../configs/server-settings');

let msgTypes = {
    registration:(msg)=>{
        let result = false;
        let urlPattern = "domain://registry.";
        if (msg.from.startsWith(urlPattern) || msg.to.startsWith(urlPattern)) {
            result = true;
        }
        return result;
    },
    addressAllocation:(msg)=>{
        let result = false;
        let urlPattern = "/address-allocation";
        if (msg.from.endsWith(urlPattern) && msg.to.endsWith(urlPattern)) {
            result = true;
        }
        return result;
    },
    discovery:(msg)=>{
        let result = false;
        let urlPattern = "/discovery/";
        if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
            result = true;
        }
        return result;
    },
    globalRegistry:(msg)=>{
        let result = false;
        let urlPattern = "/graph-connector";
        if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
            result = true;
        }
        return result;
    },
    identityManagement:(msg)=>{
        let result = false;
        let urlPattern = "/idm";
        if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
            result = true;
        }
        return result;
    },
    dataSync:(msg)=>{
        let result = false;
        let urlPattern = "/sm";
        if (msg.from.endsWith(urlPattern) || msg.to.endsWith(urlPattern)) {
            result = true;
        }
        return result;
    },
    p2pConnection:(msg)=>{
        let result = false;
        if (msg.from.endsWith("/ua") || msg.to.endsWith("/ua")) {
            result = true;
        } else if (msg.from.endsWith("/sm") || msg.to.endsWith("/sm")) {
            result = true;
        }
        return result;
    }
};

class Attributes {
    // ============================== environment attributes =============================
    date(msg, context){
        return moment().format("YYYY-MM-DD");
    }
    time(msg, context){
        return moment().format("HH:mm:ss");
    }
    weekday(msg, context){
        return moment().format("dddd");
    }
    // ============================== subject attributes =================================
    srcIDPDomain(msg, context){
        if (msg.body.identity !== undefined) {
            return divideEmail(msg.body.identity.userProfile.username).domain;
        } else {
            return undefined;
        }
    }
    srcUsername(msg, context){
        if (msg.body.identity !== undefined) {
            return msg.body.identity.userProfile.username;
        } else if (msg.from.startsWith('hyperty://'|| msg.from.startsWith('runtime://'))){
            let infoList = context.policyEngine.pip.getRegistryCacheEntry(removePathFromURL(msg.from));
            if (infoList.length) {
                return getUserEmailFromURL(infoList[0].userID);
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
    srcRuntime(msg, context){
        if (msg.from.startsWith('runtime://')) {
            return removePathFromURL(msg.from);
        } else if (msg.from.startsWith('hyperty://')) {
            let infoList = context.policyEngine.pip.getRegistryCacheEntry(removePathFromURL(msg.from));
            if (infoList.length) {
               return infoList[0].runtime;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
    srcHyperty(msg, context){
        if (msg.from.startsWith('hyperty://')) {
            return removePathFromURL(msg.from);
        } else {
            return undefined;
        }
    }
    srcIDP(msg, context){
        if (msg.body.identity !== undefined) {
            return msg.body.identity.idp;
        } else {
            return undefined;
        }
    }
    srcSPDomain(msg, context){
        let from = msg.from;
        return divideURL(from).domain;
    }
    srcScheme(msg, context){
        let from = msg.from;
        return divideURL(from).type;
    }
    msgFrom(msg, context){
        return msg.from;
    }
    // ==================================== object attributes =========================================
    msgTo(msg, context){
        return msg.to;
    }
    dstScheme(msg, context){
        let to = msg.to;
        return divideURL(to).type;
    }
    dstSPDomain(msg, context){
        let to = msg.to;
        return divideURL(to).domain;
    }
    dstUsername(msg, context){
        if (msg.to.startsWith('hyperty://'|| msg.to.startsWith('runtime://'))){
            let infoList = context.policyEngine.pip.getRegistryCacheEntry(removePathFromURL(msg.to));
            if (infoList.length) {
                return getUserEmailFromURL(infoList[0].userID);
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
    dstRuntime(msg, context){
        if (msg.to.startsWith('runtime://')) {
            return removePathFromURL(msg.to);
        } else if (msg.to.startsWith('hyperty://')) {
            let infoList = context.policyEngine.pip.getRegistryCacheEntry(removePathFromURL(msg.to));
            if (infoList.length) {
                return infoList[0].runtime;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
    dstHyperty(msg, context){
        if (msg.to.startsWith('hyperty://')) {
            return removePathFromURL(msg.to);
        } else {
            return undefined;
        }
    }
    // ==================================== resource & action attributes ==========================================
    actionType(msg, context){
        return msg.type;
    }
    resource(msg, context){
        if (msg.body.resource !== undefined) {
            return msg.body.resource;
        } else {
            return undefined;
        }
    }
    // ===================================== system attributes =========================================
    msgId(msg, context){
        return msg.id;
    }
    msgType(msg, context){
        for (let key in msgTypes) {
            if (msgTypes.hasOwnProperty(key) && msgTypes[key](msg)) {
                return key;
            }
        }
        return undefined;
    }
    auth(msg, context){
        if (msg.body.auth !== undefined) {
            return msg.body.auth;
        } else {
            return undefined;
        }
    }
    domain(msg, context){
        return config.MNdomain;
    }

    domainRegistry(msg, context){
        return config.domainRegistryConfig.url;
    }
    port(msg, context){
        return config.port;
    }
    useSSL(msg, context){
        return config.useSSL;
    }
}
module.exports = Attributes;