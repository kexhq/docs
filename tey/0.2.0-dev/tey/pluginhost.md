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

## record `Invocation`

**Fields**

  - `invocationKind` : String
  - `invocationNamespace` : String
  - `invocationOperation` : String
  - `workspaceRoot` : String
  - `currentMember` : String? (optional)
  - `members` : {String: String} (optional)
  - `graph` : [[Tey.Lockfile.Dependency](../tey/lockfile.md#record-dependency)] (optional)
  - `lock` : [Tey.Lockfile.LockState](../tey/lockfile.md#record-lockstate)
  - `toolchain` : [Tey.Toolchain.ToolchainInfo](../tey/toolchain.md#record-toolchaininfo)
  - `arguments` : [String] (optional)
  - `options` : {String: Any} (optional)
  - `environment` : {String: String} (optional)

## function `encodeInvocation`

The host-to-child half of protocol version 1. It is deliberately ordinary JSON rather than Kex source: a plugin receives data and cannot make Tey evaluate declarations smuggled into its context.


```kex
encodeInvocation(invocation)
```


## function `typedOptions`


```kex
typedOptions(operation, supplied)
```

