/**
 * Created by hao on 18/04/17.
 */
let pdp = require('./pdp/Pdp');
let pep = require('./pep/Pep');
let pip = require('./pip/Pip');
let prp = require('./prp/Prp');

class PolicyEngine {
    constructor(name, context) {
        this.name = name;
        context.policyEngine = this;
        this.context = context;
        this.logger = context.registry.getLogger();
        this.pip = new pip(context);
        this.prp = new prp(context);
        this.pdp = new pdp(context, this.prp);
        this.pep = new pep(context, this.pdp);
        this.logger.info(`[${this.name}] started ${context.devMode? "in development mode": ""}`);
    }

    getName(){
        return this.name
    }

    getPDP(){
        return this.pdp;
    }

    getPEP(){
        return this.pep;
    }

    getPRP(){
        return this.prp;
    }

    getPIP(){
        return this.pip;
    }

}

module.exports = PolicyEngine;