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

### `fingerprint`

```kex
fingerprint(plugin: Plugin) -> String
```

Fingerprints only the declared interface and requested resources. Provider implementation changes do not silently revoke approval; a capability, command schema, generator schema, or supported-Tey change does.

### `fingerprints`

```kex
fingerprints(plugins: [Plugin]) -> {String: String}
```

### `approved?`

```kex
approved?(plugin: Plugin, approvals: {String: String}) -> Bool
```

### `missingApprovals`

```kex
missingApprovals(plugins: [Plugin], approvals: {String: String}) -> [Plugin]
```

### `validApprovals`

```kex
validApprovals(plugins: [Plugin], approvals: {String: String}) -> {String: String}
```

Keeps only approvals still backed by an identical visible declaration. This is used when a lock is refreshed: removed plugins and interfaces whose resources changed cannot inherit an old authorization.

### `bindingApproved?`

```kex
bindingApproved?(binding: Binding, approvals: {String: String}) -> Bool
```

### `missingBindingApprovals`

```kex
missingBindingApprovals(bindings: [Binding], approvals: {String: String}) -> [Binding]
```

### `validBindingApprovals`

```kex
validBindingApprovals(bindings: [Binding], approvals: {String: String}) -> {String: String}
```

### `validateScopes`

```kex
validateScopes(globals: [Binding], locals: [Binding]) -> Result<Void, String>
```

### `visibleBinding`

```kex
visibleBinding(bindings: [Binding], namespace: String, currentMember: String?) -> Result<Binding, String>
```

### `generator`

```kex
generator(binding: Binding, name: String) -> Result<PluginOperation, String>
```

## record `Binding`

**Fields**

  - `approvalKey` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `scopeName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `declaration` : [Plugin](../tey/manifest.md#record-tey-manifest-plugin)


