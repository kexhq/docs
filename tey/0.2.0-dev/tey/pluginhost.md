---
package: tey
version: "0.2.0-dev"
source: tey/pluginhost.kex
title: Tey.PluginHost
entities:
  - { kind: module, name: "Tey.PluginHost" }
---

# Tey.PluginHost

## module `Tey.PluginHost`

### `encodeInvocation`

```kex
encodeInvocation(invocation: Invocation) -> String
```

The host-to-child half of protocol version 1. It is deliberately ordinary JSON rather than Kex source: a plugin receives data and cannot make Tey evaluate declarations smuggled into its context.

### `typedOptions`

```kex
typedOptions(operation: Tey.Manifest.PluginOperation, supplied: {String: String}) -> Result<{String: Any}, String>
```

## record `Invocation`

**Fields**

  - `invocationKind` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `invocationNamespace` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `invocationOperation` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `workspaceRoot` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `currentMember` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)? (optional)
  - `members` : {[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string): [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)} (optional)
  - `graph` : [[Tey.Lockfile.Dependency](../tey/lockfile.md#record-tey-lockfile-dependency)] (optional)
  - `lock` : [Tey.Lockfile.LockState](../tey/lockfile.md#record-tey-lockfile-lockstate)
  - `toolchain` : [Tey.Toolchain.ToolchainInfo](../tey/toolchain.md#record-tey-toolchain-toolchaininfo)
  - `arguments` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)
  - `options` : {[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string): Any} (optional)
  - `environment` : {[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string): [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)} (optional)


