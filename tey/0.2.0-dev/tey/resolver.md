---
package: tey
version: "0.2.0-dev"
source: tey/resolver.kex
title: Tey.Resolver
entities:
  - { kind: module, name: "Tey.Resolver" }
---

# Tey.Resolver

## module `Tey.Resolver`

### `fingerprint`

```kex
fingerprint(context: Context) -> String
```

### `resolveWorkspace`

```kex
resolveWorkspace(context: Context) -> Result<LockState, String>
```

### `resolveWorkspaceWithInfo`

```kex
resolveWorkspaceWithInfo(context: Context, toolchain: Tey.Toolchain.ToolchainInfo) -> Result<LockState, String>
```

The caller may already have inspected the selected compiler while deciding whether an existing lock is reusable. Passing that result through keeps the `--info` contract to one invocation per install/resolve decision.

### `resolvePackage`

```kex
resolvePackage(manifest: ManifestPackage) -> Result<LockState, String>
```
