/**
 * Created by hjiang on 3/2/17.
 */

import fs from 'fs';
import path from 'path';

class PRP {

    constructor(registry) {
        this.name = "PRP";
        this.registry = registry;
        this.logger = this.registry.getLogger();
        this.policySrcs = [{"local": "./policy/policy.json"}]
    }

    // =================== public ====================

    setPolicySrc(source="local"){

        for (let i in [...Array(this.policySrcs.length).keys()] ){
            if (this.policySrcs[i]){

            }
        }

    }



    // =================== private ===================



}

export default PRP;