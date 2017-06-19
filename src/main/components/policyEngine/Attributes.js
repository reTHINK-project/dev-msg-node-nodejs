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
    date(msg, context, newValue = null){
        return moment().format("YYYY-MM-DD");
    }
    time(msg, context, newValue = null){
        return moment().format("HH:mm:ss");
    }
    weekday(msg, context, newValue = null){
        return moment().format("dddd");
    }
    // ============================== subject attributes =================================
    srcIDPDomain(msg, context, newValue = null){
        if (msg.body.identity !== undefined) {
            return divideEmail(msg.body.identity.userProfile.username).domain;
        } else {
            return undefined;
        }
    }
    srcUsername(msg, context, newValue = null){
        if (msg.body.identity !== undefined) {
            return msg.body.identity.userProfile.username;
        } else if (msg.body.value && msg.body.value.user){
            return getUserEmailFromURL(msg.body.value.user);
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
    srcRuntime(msg, context, newValue = null){
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
    srcHyperty(msg, context, newValue = null){
        if (msg.from.startsWith('hyperty://')) {
            return removePathFromURL(msg.from);
        } else {
            return undefined;
        }
    }
    srcIDP(msg, context, newValue = null){
        if (msg.body.identity !== undefined) {
            return msg.body.identity.idp;
        } else {
            return undefined;
        }
    }
    srcSPDomain(msg, context, newValue = null){
        let from = msg.from;
        return divideURL(from).domain;
    }
    srcScheme(msg, context, newValue = null){
        let from = msg.from;
        return divideURL(from).type;
    }
    msgFrom(msg, context, newValue = null){
        return msg.from;
    }
    // ==================================== object attributes =========================================
    msgTo(msg, context, newValue = null){
        return msg.to;
    }
    dstScheme(msg, context, newValue = null){
        let to = msg.to;
        return divideURL(to).type;
    }
    dstSPDomain(msg, context, newValue = null){
        let to = msg.to;
        return divideURL(to).domain;
    }
    dstUsername(msg, context, newValue = null){
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
    dstRuntime(msg, context, newValue = null){
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
    dstHyperty(msg, context, newValue = null){
        if (msg.to.startsWith('hyperty://')) {
            return removePathFromURL(msg.to);
        } else {
            return undefined;
        }
    }
    // ==================================== resource & action attributes ==========================================
    actType(msg, context, newValue = null){
        return msg.type;
    }
    resource(msg, context, newValue = null){
        if (msg.body !== undefined) {
            return msg.body.resource;
        } else {
            return undefined;
        }
    }
    valueResources(msg, context, newValue = null) {
        if (msg.body.value !== undefined) {
            return msg.body.value.resources;
        } else {
            return undefined;
        }
    }
    // ===================================== system attributes =========================================
    msgId(msg, context, newValue = null){
        return msg.id;
    }
    msgType(msg, context, newValue = null){
        for (let key in msgTypes) {
            if (msgTypes.hasOwnProperty(key) && msgTypes[key](msg)) {
                return key;
            }
        }
        return undefined;
    }
    auth(msg, context, newValue = null){
        if (msg.body !== undefined) {
            return msg.body.auth;
        } else {
            return undefined;
        }
    }
    domain(msg, context, newValue = null){
        return config.MNdomain;
    }

    domainRegistry(msg, context, newValue = null){
        return config.domainRegistryConfig.url;
    }
    port(msg, context, newValue = null){
        return config.port;
    }
    useSSL(msg, context, newValue = null){
        return config.useSSL;
    }
    // ===================================== message specific attributes ==================================
    // e.g., address allocation messages
    valueNumber(msg, context, newValue = null){
        if (newValue){
            if (msg.body.value !== undefined) {
                msg.body.value.number = newValue;
                return msg;
            }
        } else {
            if (msg.body.value !== undefined) {
                return msg.body.value.number;
            } else {
                return undefined;
            }
        }
    }
    valueAllocated(msg, context, newValue = null){
        if (newValue) {
            if (msg.body.value !== undefined) {
                msg.body.value.allocated = newValue;
                return msg;
            }
        } else {
            if (msg.body.value !== undefined) {
                return msg.body.value.allocated;
            } else {
                return undefined;
            }
        }
    }
    valueExpires(msg, context, newValue = null) {
        if (msg.body.value && msg.body.value.expires){
            return msg.body.value.expires;
        } else {
            return undefined;
        }
    }
    // ====================================== others ==========================================
    userRegistries(msg, context, newValue = null) {
        if (msg.body.value && msg.body.value.user){
            return context.policyEngine.pip.getRegistryCacheEntry(msg.body.value.user);
        } else {
            return undefined;
        }
    }
}
module.exports = Attributes;