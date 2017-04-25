### ReTHINK Policy Examples for Nodejs Messaging Node

***

In [reThink](http://www.rethink-project.eu/), we have designed and implemented a [JSON-based policy description language (PDL)](https://github.com/Heriam/dev-msg-node-nodejs/tree/develop/src/main/components/policyEngine/prp/policy) for the policy engine deployed on the Nodejs messaging node. In this document, we further illustrate and evaluate the PDL using a set of policy examples. We choose the *Connector* hyperty for demonstration, analyse in details about the signalling messages and phases based on communication sequence diagram. As a result, we have identified for this use case a total of 33 policy control points (PCPs) available for the deployment of different policies. This document provides a concret view of the policies that could be deployed based on these PCPs.

#### Preknowledge: ReTHINK Framework and Hyperties

Preknowledge of the concept of hyperties and the reTHINK framework is requried to understand this document. The picture below depicts the basic architecture of reTHINK within a CSP domain. We don't go into details in this section. Please find [here](https://github.com/reTHINK-project/specs) the full detailed specification of reTHINK Framework.

![](https://raw.githubusercontent.com/Heriam/dev-msg-node-nodejs/develop/docs/images/rethink-arch.png)

The connector hyperty is one of the hyperties that are available on the [reTHINK testbed](https://github.com/Heriam/reThink-testbed). It provides services like user search and WebRTC call. When running on the user device runtime, the hyperty represents for the user as a live instance providing communication services within the reTHINK framework. 

The Node.js based Messaging Node is one of the reference implementations of the CSP Messaging services in the reTHINK Architecture. The role of Messaging Nodes in the reTHINK Architecture is described in detail in [Hyperty Messaging Framework](https://github.com/reTHINK-project/specs/blob/master/messaging-framework/readme.md). Overall, as part of CSP backend services, it interacts with other rethink CSP backend components like the CSP domain registry, CSP catalogue. 

#### Connector Hyperty Communication Sequence Diagram and PCPs

In this section we analyse the connector hyperty use case step by step from the initiation to the termination of the call.

**Phase 1. Hyperty download and registration**

![callflow_Page_04](./images/callflow_Page_04.png)

The first observed message is sent from the runtime to the address allocation manager of the messaging node to request for an address for the just loaded Connector hyperty. Thus the first PCP can be identified for the policy-based control (deny/permit) of this procedure on the message node. At this point, the policy can limit the number of requested addresses as expressed in following examples.

- Example 1: For messages of *addressAllocation* type, if the actType is *create* and the requested number of addresses is more than 1, then deny.

```json
{
  "target": {"msgType": {"equals": "addressAllocation"}},
  "condition": {
    "actType": {"equals": "create"},
    "valueNumber": {"moreThan": 1}
  },
  "effect": "deny"
}
```

- Example 2: For messages of *addressAllocation* type, if the actType is *response* and the allocated number of addresses is more than 1, then permit but limit the number of allocated addresses to 1.

```json
{
  "target": {"msgType": {"equals": "addressAllocation"}},
  "condition": {
    "actType": {"equals": "response"},
    "valueAllocate": {"moreThan": 1}
  },
  "effect": "permit",
  "obligations": {"limitNumber": {"valueAllocated": 1}}
}
```

![callflow_Page_05](./images/callflow_Page_05.png)

The next message is to register the new hyperty to the domain registry with all the necessary information such as its address, user url, runtime url, etc.. Here some policies can be deployed to examine the content of the registry entry, or the validity of the requested service for the given user.

- Example 3: 

```json

```

