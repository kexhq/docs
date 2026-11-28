---
package: tey
version: "0.2.1-dev"
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

Returns a fingerprint of a plugin's declared interface and requested resources, which an approval is tied to.

Changing the plugin's implementation keeps the approval; changing a capability, a command or generator schema, or the supported Tey versions needs a new one.

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

Returns the approvals whose plugin is still declared with the same fingerprint.

Used when the lock file is refreshed, so a removed plugin, or one whose interface changed, loses its approval.

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

  - `approvalKey` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `scopeName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `declaration` : [Plugin](../tey/manifest.md#record-tey-manifest-plugin)


