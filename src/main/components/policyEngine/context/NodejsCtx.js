/**
 * Created by hjiang on 3/9/17.
 */
import ReThinkCtx from './ReThinkCtx';
import {divideURL, getUserEmailFromURL, isDataObjectURL} from './Utils';
import FirstApplicable from '../algorithm/FirstApplicable';
import AllowOverrides from '../algorithm/AllowOverrides';
import BlockOverrides from '../algorithm/BlockOverrides';

class NodejsCtx extends ReThinkCtx {

    constructor(registry, config) {
        super();
        this.registry = registry;
        this.config = config;
        this.msg = null;
    }

    get domainUrl(){
        return this.config.url;
    }

    get domainRegistryUrl(){
        return this.config.domainRegistryUrl;
    }

    get globalRegistryUrl(){
        return this.config.globalRegistryUrl;
    }

    get port(){
        return this.config.port;
    }

    get useSSL(){
        return this.config.useSSL;
    }


}