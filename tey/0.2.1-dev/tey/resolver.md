---
package: tey
version: "0.2.1-dev"
source: tey/resolver.kex
title: Tey.Resolver
entities:
  - { kind: module, name: "Tey.Resolver" }
---

# Tey.Resolver

## module `Tey.Resolver`

### `fingerprint` (foul)

```kex
fingerprint(context: Context) -> String
```

### `resolveWorkspace` (foul)

```kex
resolveWorkspace(context: Context) -> Result<LockState, String>
```

### `resolveWorkspaceWithInfo` (foul)

```kex
resolveWorkspaceWithInfo(context: Context, toolchain: Tey.Toolchain.ToolchainInfo) -> Result<LockState, String>
```

The caller may already have inspected the selected compiler while deciding whether an existing lock is reusable. Passing that result through keeps the `--info` contract to one invocation per install/resolve decision.

### `resolvePackage` (foul)

```kex
resolvePackage(manifest: ManifestPackage) -> Result<LockState, String>
```

### `chooseFromTags`

```kex
chooseFromTags(name: String, tags: [String], requested: String) -> Result<String, String>
```

A monorepo can release its members independently as `parser-v1.2.3`. Prefer that package's namespace when it exists; a repository with no package-prefixed tags retains the ordinary `v1.2.3` convention.

### `externalizeWorkspaceDependencies`

```kex
externalizeWorkspaceDependencies(dependencies: [Tey.Manifest.Dependency], parent: Tey.Lockfile.Dependency) -> [Tey.Manifest.Dependency]
```

`workspace: true` inside a fetched package refers to a sibling in that package's repository, at exactly the same commit. Once outside the source workspace it is therefore a Git source with an implicit discoverable subdirectory, not a reference to the consumer's local workspace.
