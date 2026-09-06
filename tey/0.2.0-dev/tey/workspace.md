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

## record `Member`

**Fields**

  - `memberRoot` : String
  - `memberManifest` : [ManifestPackage](../tey/manifest.md#record-manifestpackage)

## record `Context`

**Fields**

  - `workspaceRoot` : String
  - `members` : [[Member](#record-member)] (optional)
  - `currentMember` : [Member](#record-member)? (optional)
  - `warnings` : [String] (optional)

## function `discover`

Discovers the outermost workspace containing `start`. Without a workspace, the nearest package is a one-member context. Paths are lexical and absolute; discovery never changes the process working directory.


```kex
discover(start)
```


## function `select`

Selects the members a workspace-aware command should operate on. An explicit package always wins; otherwise commands at a member stay local, while commands at the workspace root (or another non-member directory) use every member. `--workspace` broadens the implicit member selection.


```kex
select(context, packageName, workspace?)
```


## function `dependencyLayers`

Dependency-ready layers for workspace-wide commands. Cyclic leftovers form one final layer so callers can continue, while discovery reports the cycle.


```kex
dependencyLayers(members)
```


## function `memberName`


```kex
memberName(member)
```


## function `memberDependencies`


```kex
memberDependencies(member)
```

