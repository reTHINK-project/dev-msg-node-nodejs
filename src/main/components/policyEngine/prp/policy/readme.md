# reThink Policy Description Language

A policy describes principles or strategies for a plan of action designed to achieve a particular set of goals. We define a policy as a function that maps a series of events into a set of actions. In this section we introduce our Policy Description Language (PDL), a simple but expressive language to specify policies. PDL is specifically designed for turning the needs of access control into meaningful policies that can govern whether and where a request should be blocked, filter which elements of the returned resource it can contain, and constrain the values that can be set for properties. The reTHINK Policy Specification Language is a PDL tailored to the requirements of reTHINK framework. Policies following this language use a closed vocabulary that gives the ability to configure end user or service provider configurations in an expressive and flexible way.

## Background

The reThink project defines a PEP/PDP model for its [policy engines](https://github.com/Heriam/dev-msg-node-nodejs/tree/dev-policies/src/main/components/policyEngine). As shown in Figure 1, upon the interception of a message, the PEP analyzes it and collects necessary attributes into a authorization request to PDP. The PDP then gets the right policies for the request from a database remotely or locally, evaluates the attributes against the policies, and finally responds with a decision such as *permit*, *deny*, *not applicable*, or *indeterminate*. 

![](../../../../../../docs/images/pe_msging.png)

**Figure 1:** PEP-PDP interaction

- A **request** normally contains four kinds of attributes such as Subject, Resource, Action, and Environment. Subject attribute contains subject's details such as name, e-mail, role and so on. Resource attribute details the resource for which access is requested and action attribute specifies the requested action to be performed on resource such as read or write. Also, Environment attribute is optional and contains attributes of environment.
- A **response** represents the authorization decision information made by PDP. It contains one or more result attributes. Each result includes a decision such as permit, deny, notApplicable, or indeterminate. In addition, there might some status information which gives the errors occurred and their descriptions while evaluating the request and optionally one or more obligations which specifies tasks in the policySet and policy elements in the policy description which should be performed before or after granting or denying access.

## PDL Structure

The reThink PDL contains three structural elements, namely Policy Set, Policy, and Rule. The fields of each element and the relationships between them are presented in Figure 2. 

![](../../../../../../docs/images/pdl_structure.png)

**Figure 2:** Policy Language Structure

- A **rule** element defines the target elements to which the rule is applied and details conditions to apply the rule and has three components such as target, effect, and condition. A target element specifies the resources, subjects, actions and the environment to which the rule is applied. A condition element shows the conditions to apply the rule and a effect is the consequence of the rule as either permit or deny. 
- A **policy** is the set of rules which are combined with some algorithms. These algorithms are called rule-combining algorithms. For instance "Permit Override" algorithm allows the policy to evaluate to "Permit" if any rule in the policy evaluates to "Permit". A policy also contains target elements which shows the subjects, resources, actions, environment that policy is applied.
- A **policy set** consists of Policies combined with policy-combined algorithm. It has also target like a Policy.

## PDL Syntax

Policies are expressed in JSON format with a set of key-value pairs. Following the PDL structure as mentioned above, the policies are formatted with three layers respectively: the outmost PolicySets, the inner Policies, and the innermost Rules. 

### Policy Sets, Policies, and Rules

As shown in Figure 3, for a specific PolicySet, an **id** is given in order to uniquely identify it, and a **version** field shows the current version of this PolicySet. The **update** field indicates the timestamp of last update. A **target** defines a simple Boolean condition that, if satisfied (evaluates to True) by the attributes of the request, establishes the need for subsequent evaluation against the **policies** in this set. If no target matches the request, the decision then would be *not applicable*, and if the target condition evaluates to True for and the policies of this set fails to evaluate for any reason, the result of this policy set would be *indeterminate*. The **priority** field specifies the weight of current policy set compared to others. The **obligations** specifies tasks that should be performed before or after granting or denying access.

```json
{
  "id": <id>,
  "version": <version>,
  "update": <update timestamp>,
  "target": <boolean condition>,
  "policies": [<policy1>, <policy2>, ...],
  "policyCombiningAlgorithm": <algorithm>,
  "obligations": [<task1>, <task2>, ...],
  "priority": <priority>
}
```

**Figure 3:** PolicySet syntax

Each policy, as show in Figure 4, contains id, target, priority, and obligations fields like policy set. Similarly, it contains a set of rules and combining algorithm for the evaluation of attributes contained in the request. 

```json
{
  "id": <id>,
  "target": <boolean condition>,
  "rules": [<rule1>, <rule2>, ...],
  "ruleCombiningAlgorithm": <algorithm>,
  "obligations": [<task1>, <task2>, ...],
  "priority": <priority>
}
```

**Figure 4:** Policy syntax

As show in Figure 5, in addition to a target, a rule includes one or a combination of Boolean conditions that, if evaluated true, have an effect of either Permit or Deny. If the target condition evaluates to True for a Rule and the Rule’s condition fails to evaluate for any reason, the effect of the Rule is Indeterminate. In comparison to the (matching) condition of a target, the conditions of a Rule or Policy are typically more complex and may include functions (e.g., "greater-than", "less-than", "equal") for the comparison of attribute values, and operations (e.g., "not", "and", "or") for the computation of Boolean values.

```json
{
  "id": <id>,
  "target": <boolean condition>,
  "condition": <condition>,
  "effect": <effect>,
  "obligations": [<task1>, <task2>, ...],
  "priority": <priority>
}
```

**Figure 5:** Rule syntax

### Operators and Attributes

In a rule entry of a policy, the condition field represents the restriction under which the rule could be applied. When the policy engine examines a message, it firstly looks for the predefined policy for the message, and then compares the message against the policy rule by rule using the condition field. As depicted in the previous section, the conditions can be expressed using as many kinds of attributes as possible in order to achieve strong flexibility, expressiveness and functionality such as time, weekday, source of the message, domain, and so on. The Table 1 below lists all the supported condition attributes. 

| Attribute      | Description                              |
| -------------- | ---------------------------------------- |
| srcUser        | username of the source of the message    |
| srcDomain      | domain of the source of the message      |
| srcHyperty     | hyperty of the source of the message     |
| idp            | identity provider of the source of the message |
| dstUser        | username of the recipient of the message |
| dstDomain      | domain of the recipient of the message   |
| dstHyperty     | hyperty of the recipient of the message  |
| msgType        | type of message, e.g., open, create, update, etc. |
| rscType        | resource type                            |
| schema         | data object schema                       |
| authorization  | authorization status                     |
| authentication | authentication status                    |
| time           | time of the day, HH:mm:ss                |
| date           | date of the year, YYYY-MM-DD             |
| weekday        | day of the week                          |

**Table 1:** Attributes

The type of operation to do to verify an attribute value against a given parameter defined in policy is done through the operators such as "equals", "moreThan", "lessThan", etc... The operation keyword of the condition states how the evaluation of the policy must deal with the system attribute and its parameter independently of what the system attribute is. For instance, the operation may verify if the system attribute is equal to the parameter, if it is part of a collection, or if its value is greater than or less than the parameter. The Table 2 presents operations supported by the policy engine.

| Operator | Description                              |
| -------- | ---------------------------------------- |
| in       | Verifies if a given value is part of a collection |
| equals   | Verifies if a given value is equal to other |
| moreThan | Verifies if a given value is greater than the other |
| lessThan | Verifies if a given value is less than the other |
| between  | Verifies if a given value (including time) is within a scope |
| contains | Verifies if a given collection contains a value |
| like     | Verifies if a given string fulfils a specific pattern using wildcards (one or more "*") |

**Table 2:** Operators

### Targets and Conditions

//Todo

### Example

//Todo

For a better understanding, Figure 6 gives an example of a policy in JSON.

```json
{
  "id": 1,
  "version": 1,
  "update" : "2017-03-14 17:18:31",
  "target": {},
  "policyCombiningAlgorithm": "firstApplicable",
  "obligations": {},
  "priority": 0,
  "policies": [
    {
      "id": 1,
      "target": {},
      "ruleCombiningAlgorithm": "blockOverrides",
      "priority": 0,
      "obligations": {"deny": {"emailto": "admin@imt-atlantic.fr"}},
      "rules": [
        { "id": 1,
          "target":[
            {"srcDomain": {"equals": "gmail.com"}},
            {"msgType": {"equals": ["create","update","open","subscribe","response", "handshake"]}}],
          "condition": {
            "anyOf": [
              {"allOf": [
                {"weekday": {"not": {"equals": ["saturday", "sunday"]}}},
                {"time": {"between": ["06:00:00 12:30:00", "13:00:00 23:00:00"]}}]},
              {"allOf": [
                {"weekday": {"equals": ["saturday", "sunday"]}},
                {"time": {"between": ["07:00:00 12:00:00", "13:30:00 22:30:00"]}}]}]},
          "effect": "permit",
          "obligations": {"emailto": "admin@imt-atlantic.fr"},
          "priority": 0
        }
      ]
    }
  ]
}
```

**Figure 6:** Policy example



### Combining Algorithms

Because a policy may contain multiple rules, and a policy set may contain multiple policies or policy sets, each rule, policy, or policy set may evaluate to different decisions (permit, deny, not applicable, or indeterminate). reThink PDL provides a way of reconciling the decisions each makes. This reconciliation is achieved through a collection of combining algorithms. Each algorithm represents a different way of combining multiple local decisions into a single global decision. There are several combining algorithms, to include the following:

- Deny-overrides: if any decision evaluates to Deny, or no decision evaluates to Permit, then the result is Deny. If all decisions evaluate to Permit, the result is Permit.
- Permit-overrides: if any decision evaluates to Permit, then the result is Permit, otherwise the result is Deny.
- First-applicable: the rules are evaluated following the order given by the priority field, and the decision of the first that applies (either deny or allow), is the final result of the policy evaluation.

Combining algorithms are applied to rules in a Policy and Policies within a policy set in arriving at an ultimate decision of the PDP. Combining algorithms can be used to build up increasingly complex policies. For example, given that a subject request is Permitted (by the PDP) only if the aggregate (ultimate) decision is Permit, the effect of the Permit-overrides combining algorithm is an “OR” operation on Permit (any decision can evaluate to Permit), and the effect of a Deny-overrides is an “AND” operation on Permit (all decisions must evaluate to Permit).

### Obligations and Advice

The reThink PDL includes the concepts of obligation and advice expressions. An obligation optionally specified in a Rule, Policy, or PolicySet is a directive from the PDP to the Policy Enforcement Point (PEP) on what must be carried out before or after an access request is approved or denied. Advice is similar to an obligation, except that advice may be ignored by the PEP. A few examples include:

- If Alice is denied access to document X: email her manager that Alice tried to access document X.
- If a user is denied access to a file: inform the user why the access was denied.
- If a user is approved to view document X: watermark the document “DRAFT” before delivery.


## PDL Implementation

//Todo

## References

- [Policy Description Language in the Runtime of reThink](https://github.com/reTHINK-project/specs/blob/master/policy-management/policy-specification-language.md)




