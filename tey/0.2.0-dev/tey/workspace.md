---
package: tey
version: "0.2.0-dev"
source: tey/workspace.kex
title: Tey.Workspace
entities:
  - { kind: module, name: "Tey.Workspace" }
---

# Tey.Workspace

## module `Tey.Workspace`

### `discover`

```kex
discover(start: String) -> Result<Context, String>
```

Discovers the outermost workspace containing `start`. Without a workspace, the nearest package is a one-member context. Paths are lexical and absolute; discovery never changes the process working directory.

### `select`

```kex
select(context: Context, packageName: String, workspace?: Bool) -> Result<[Member], String>
```

Selects the members a workspace-aware command should operate on. An explicit package always wins; otherwise commands at a member stay local, while commands at the workspace root (or another non-member directory) use every member. `--workspace` broadens the implicit member selection.

### `dependencyLayers`

```kex
dependencyLayers(members: [Member]) -> [[Member]]
```

Dependency-ready layers for workspace-wide commands. Cyclic leftovers form one final layer so callers can continue, while discovery reports the cycle.

### `memberName`

```kex
memberName(member: Member) -> String
```

### `memberDependencies`

```kex
memberDependencies(member: Member) -> [String]
```

## record `Member`

**Fields**

  - `memberRoot` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `memberManifest` : [ManifestPackage](../tey/manifest.md#record-tey-manifest-manifestpackage)



## record `Context`

**Fields**

  - `workspaceRoot` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `members` : [[Member](#record-tey-workspace-member)] (optional)
  - `currentMember` : [Member](#record-tey-workspace-member)? (optional)
  - `warnings` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)


