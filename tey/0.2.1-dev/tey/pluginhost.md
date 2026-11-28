---
package: tey
version: "0.2.1-dev"
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

Encodes an invocation as the message Tey sends a plugin process in version 1 of the plugin protocol: one line of JSON.

The message is JSON, not Kex source, so a plugin only ever receives data, and nothing in its context can make Tey evaluate a declaration.

### `typedOptions`

```kex
typedOptions(operation: Tey.Manifest.PluginOperation, supplied: {String: String}) -> Result<{String: Any}, String>
```

Converts options supplied as text to the types `operation` declares for them (`String`, `Integer`, `Float` or `Bool`). Returns an error for an option the operation does not declare, or a value that does not parse as its type.

## record `Invocation`

**Fields**

  - `invocationKind` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `invocationNamespace` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `invocationOperation` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `workspaceRoot` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `currentMember` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)? (optional)
  - `members` : {[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string): [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)} (optional)
  - `graph` : [[Tey.Lockfile.Dependency](../tey/lockfile.md#record-tey-lockfile-dependency)] (optional)
  - `lock` : [Tey.Lockfile.LockState](../tey/lockfile.md#record-tey-lockfile-lockstate)
  - `toolchain` : [Tey.Toolchain.ToolchainInfo](../tey/toolchain.md#record-tey-toolchain-toolchaininfo)
  - `arguments` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `options` : {[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string): Any} (optional)
  - `environment` : {[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string): [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)} (optional)


