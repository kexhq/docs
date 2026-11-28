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

Returns a fingerprint of the workspace members' manifests and `.teyignore` files. It changes whenever the lockfile may need resolving again.

### `resolveWorkspace` (foul)

```kex
resolveWorkspace(context: Context) -> Result<LockState, String>
```

Resolves the dependencies of every workspace member into one lock state, using the active toolchain.

### `resolveWorkspaceWithInfo` (foul)

```kex
resolveWorkspaceWithInfo(context: Context, toolchain: Tey.Toolchain.ToolchainInfo) -> Result<LockState, String>
```

Resolves the workspace like `resolveWorkspace`, with toolchain information the caller already has. The compiler's `--info` is then queried only once per install or resolve.

### `resolvePackage` (foul)

```kex
resolvePackage(manifest: ManifestPackage) -> Result<LockState, String>
```

Resolves one package's dependencies into a lock state. Fails when the active Kex or the running Erlang/OTP is older than the package or the toolchain requires.

### `chooseFromTags`

```kex
chooseFromTags(name: String, tags: [String], requested: String) -> Result<String, String>
```

Returns the tag of the newest version of `name` that satisfies `requested`.

A monorepo can tag each member separately, as `parser-v1.2.3`. When tags with the package's prefix exist, only those are considered; otherwise plain tags such as `v1.2.3` are.

### `externalizeWorkspaceDependencies`

```kex
externalizeWorkspaceDependencies(dependencies: [Tey.Manifest.Dependency], parent: Tey.Lockfile.Dependency) -> [Tey.Manifest.Dependency]
```

Rewrites the `workspace: true` dependencies of a fetched package as Git dependencies on the same repository and commit as `parent`.

In a fetched package, `workspace: true` names a sibling in that package's repository, not a member of the consumer's workspace. The sibling's subdirectory is found later.
