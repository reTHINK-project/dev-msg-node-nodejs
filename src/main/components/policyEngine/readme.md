# Msg-node-nodejs-PolicyEngine
## Overview

We present below a NodeJs-based prototype of the PEP and PDP initially dedicated to the NodeJS version of the [Messaging Node developed by Apizee](https://github.com/reTHINK-project/dev-msg-node-nodejs). 

![global_view](../../../../docs/global-view.png)

By modifying the PEP hook, it is possible to apply our approach to other versions of the Messaging Node or to other components of the reTHINK architecture requiring an authorization control framework. 

## Setting up Environment

You should follow the Setup Environment of [dev-msg-node-nodejs](https://github.com/reTHINK-project/dev-msg-node-nodejs).

## Overview of the development

This section describes the integration & deployment of the PolicyEngine into the Messaging Node architecture.

### Integration the PolicyEngine in MsgNode/Nodejs

[Here](../../../../docs/event-mgmt.png) we have a presentation of the functional blocks of the Messaging Node architecture.

The graphic below shows where to hook the PolicyEngine Component to the core component of MsgNode.

![Intergration_PolicyEngine](../../../../docs/Intergration_PE.png)


### Global design of the prototype

The graphic below describes the relations between the Classes in the PolicyEngine and the key methods within them.

![Relation between Entities](../../../../docs/Relation_Entities.png)
### Sequence diagram

The graphic below describes an abstract sequence diagram of the execution process among the entities.
![Sequence diagram](../../../../docs/Sequence_diagram.png)

## Policy description
### Policy

A Policy is composed by the key-value pairs of target, combinatory algorithm and a set of rules which is defined in the MsgNode/Nodejs is a JSON object that has 3 fields. It contains:
- target: a combination of certain key-value pairs (which is a resource attribute[terms-3]) of the message (for example the ‘type’ in the message header), all of these are used to decide if a Policy apply to the coming message’s case.
- apply: The combinatory algorithm[Terms-1] for the rules, there are two possibilities at the moment: permit-overrides and deny-overrides
- rules: An array of rules. A rule specifies if a matched target should have or not access to a certain route. A rule defines a decision to allow or deny access. It contains two fields:
 - condition: represents which is the restriction (which concerns the environment attribute[terms-4])
 - effect: the decision of the restriction is satisfied or not. Can be permit or deny. [terms-2]

### Syntax

```
[
    {
        "target": {
            "resource attribute": "resource value",
        },
        "apply": "algorithm-name",
        "rules": [
            {
                "condition":"<environment attribute1> <parameters>",
                "effect": "permit/deny"
            },
            {
                "condition": "<environment attribute2> <parameters>",
                "effect": "permit/deny"
            },
            {
                "condition": "<environment attributeN> <parameters>",
                "effect": "permit/deny"
            },
            {
                "effect": "permit/deny"
            }
        ]
    }
]
```

### Terms

1. combinatory algorithms: When there is more than one rule inside a policy, the combinatory algorithm will decide the final result from the multiple results. There are two possibilities:
 - permit-overrides --- If at least one rule permits, the final decision for that policy should be permit (deny, unless one permit)
 - deny-overrides --- if at least one rule denies, then the final decision for that policy should be deny (permit, unless one denies)
2. rule effect: if a rule applies (target match), the effect is the access decision for that rule. It can be:
 - permit --- If rule apply, decision is to allow access.
 - deny --- If rule apply, decision is to deny access.
When the rule(s) do not apply (the target don’t match), then the decision is deny, since it is not clear if the certain message can access or not the route.
3. The resource attribute: The resource attributes (the resource for which access is required) are stored in repositories and are retrieved through the Policy Information Point (PIP) (which is represented by "IStore" in the current IMT-TB version of the PolicyEngine) at the time of an access request and prior to or during the computation of the decision. We introduce several this kind of attributes such as ‘id’, ‘type’, ‘from’, ‘to’ present in the message.
4. The environment attribute: which depends on the availability of the environment setup that can detect and report values are somewhat different from the resource attributes which can be administratively created/modified by the users/operators/DB administrators, that means the rules such as time, weekdays, temperature which is aware of the environment context.

### Example

```
[
    {
        "target": {
            "id": 1,
            "type": "subscribe",
        },
        "apply": "deny-overrides",
        "rules": [
            {
                "condition":"time 12:00 13:00",
                "effect": "deny"
            },
            {
                "condition": "weekday monday",
                "effect": "deny"
            },
            {
                "effect": "permit"
            }
        ]
    }
]
```

## References

- [the XACML policies](https://en.wikipedia.org/wiki/XACML)

- [ABAC](https://en.wikipedia.org/wiki/Attribute-Based_Access_Control)

- [A Rule Based Access Control module for hapi](https://github.com/franciscogouveia/hapi-rbac)  