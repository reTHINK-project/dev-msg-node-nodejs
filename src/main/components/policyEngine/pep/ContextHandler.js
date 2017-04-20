/**
 * Created by hjiang on 3/2/17.
 */
let Request = require('../Request');
class ContextHandler {

    constructor(context) {
        this.name = "PEP";
        this.context = context;
        this.logger = this.context.registry.getLogger();
        this.develop = context.devMode;
    }

    parseToAuthzRequest(clientMsg) {
        let msg = clientMsg.getMessage().msg;
        msg.body = msg.body || {};

        return new Request(msg, this.context);
    }

    parseToAuthzResponse(response) {

        if (response.effect === "permit"){
            response.msg.body.auth = true;
            response.result = true;
        } else if (response.effect === "notApplicable") {
            response.result = this.context.registry.config.policyConfig.defaultBehavior;
            response.msg.body.auth = false;
        } else if (response.effect === "deny"){
            response.msg.body.auth = false;
            response.result = false;
        }
        if (!this.develop){
            this.logger.info(response.getInfo());
        }
        return response;
    }

}

module.exports = ContextHandler;