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
    }

    getDomainUrl(){
        return this.config.url;
    }

    getDomainRegistryUrl(){
        return this.config.domainRegistryUrl;
    }

    getGlobalRegistryUrl(){
        return this.config.globalRegistryUrl;
    }

    getPort(){
        return this.config.port;
    }

    getUseSSL(){
        return this.config.useSSL;
    }
}