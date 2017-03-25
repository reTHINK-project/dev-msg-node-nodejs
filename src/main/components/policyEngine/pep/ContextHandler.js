/**
 * Created by hjiang on 3/2/17.
 */

class ContextHandler {

    constructor(context) {
        this.name = "PEP Context Handler";
        this.context = context;
        this.logger = this.context.registry.getLogger();
    }

    parseToAuthzRequest(msg) {

        // Todo: add derived attributes and instant attributes to the request.
        // PEPs can send any number of attributes to the PDP. At the very minimum it needs to send "key" attributes
        // i.e. the user identity, the resource identity and type and the action identity. This creates the minimal viable PEP request.
        // The PEP can also send derived attributes - attributes that are derived from the key attributes.
        // For instance a user's job title, department, and clearance are all derived from the user's username or ID.
        // PEPs can also send "instant" attributes - attributes that the PEP alone knows such as the IP of the requesting user,
        // the device type, HTTP headers... These are attributes that are most commonly (easily) sent by the PEP.

        return msg;
    }

    parseToAuthzResponse(decision) {

        // Todo: explore more capabilities and add more options. Translate into a set of actions for example.

        return decision;
    }

}

module.exports = ContextHandler;