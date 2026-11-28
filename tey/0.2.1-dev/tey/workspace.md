---
package: tey
version: "0.2.1-dev"
source: tey/workspace.kex
title: Tey.Workspace
entities:
  - { kind: module, name: "Tey.Workspace" }
---

# Tey.Workspace

## module `Tey.Workspace`

### `discover` (foul)

```kex
discover(start: String) -> Result<Context, String>
```

Returns the outermost workspace containing `start`, with its members.

When no `package.kex` above `start` declares a workspace, the nearest package is the only member. Paths are made absolute without resolving symlinks, and the working directory is not changed. It fails when there is no `package.kex` at or above `start`, or when two members share a name. Dependency cycles among members are reported in `warnings`.

### `select`

```kex
select(context: Context, packageName: String, workspace?: Bool) -> Result<[Member], String>
```

Returns the members a workspace-aware command should act on.

A non-empty `packageName` selects that member, and is an error when none has that name. Otherwise `workspace?` (the `--workspace` flag) selects every member. Without either, a command run inside a member acts on that member, and one run at the workspace root or outside any member acts on all of them.

### `dependencyLayers`

```kex
dependencyLayers(members: [Member]) -> [[Member]]
```

Returns the members in layers, each depending only on members in earlier layers.

Members caught in a dependency cycle go together in a final layer, so a command can still run them; `discover` reports the cycle as a warning.

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

  - `memberRoot` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `memberManifest` : [ManifestPackage](../tey/manifest.md#record-tey-manifest-manifestpackage)



## record `Context`

**Fields**

  - `workspaceRoot` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `members` : [[Member](#record-tey-workspace-member)] (optional)
  - `currentMember` : [Member](#record-tey-workspace-member)? (optional)
  - `warnings` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)


