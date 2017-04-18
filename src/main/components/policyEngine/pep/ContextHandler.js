/**
 * Created by hjiang on 3/2/17.
 */
let Request = require('../Request');
class ContextHandler {

    constructor(context) {
        this.name = "PEP";
        this.context = context;
        this.logger = this.context.registry.getLogger();
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
            response.result = this.context.defaultBehaviour;
            response.msg.body.auth = false;
        } else if (response.effect === "deny"){
            response.msg.body.auth = false;
            response.result = false;
        }
        return response;
    }

}

module.exports = ContextHandler;