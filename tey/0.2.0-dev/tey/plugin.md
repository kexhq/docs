---
package: tey
version: "0.2.0-dev"
source: tey/plugin.kex
title: Tey.Plugin
entities:
  - { kind: module, name: "Tey.Plugin" }
---

# Tey.Plugin

## module `Tey.Plugin`

## record `Binding`

**Fields**

  - `approvalKey` : String
  - `scopeName` : String
  - `declaration` : [Plugin](../tey/manifest.md#record-plugin)

## function `fingerprint`

Fingerprints only the declared interface and requested resources. Provider implementation changes do not silently revoke approval; a capability, command schema, generator schema, or supported-Tey change does.


```kex
fingerprint(plugin)
```


## function `fingerprints`


```kex
fingerprints(plugins)
```


## function `approved?`


```kex
approved?(plugin, approvals)
```


## function `missingApprovals`


```kex
missingApprovals(plugins, approvals)
```


## function `validApprovals`

Keeps only approvals still backed by an identical visible declaration. This is used when a lock is refreshed: removed plugins and interfaces whose resources changed cannot inherit an old authorization.


```kex
validApprovals(plugins, approvals)
```


## function `bindingApproved?`


```kex
bindingApproved?(binding, approvals)
```


## function `missingBindingApprovals`


```kex
missingBindingApprovals(bindings, approvals)
```


## function `validBindingApprovals`


```kex
validBindingApprovals(bindings, approvals)
```


## function `validateScopes`


```kex
validateScopes(globals, locals)
```


## function `visibleBinding`


```kex
visibleBinding(bindings, namespace, currentMember)
```


## function `generator`


```kex
generator(binding, name)
```

