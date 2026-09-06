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

## function `fingerprint`


```kex
fingerprint(context)
```


## function `resolveWorkspace`


```kex
resolveWorkspace(context)
```


## function `resolveWorkspaceWithInfo`

The caller may already have inspected the selected compiler while deciding whether an existing lock is reusable. Passing that result through keeps the `--info` contract to one invocation per install/resolve decision.


```kex
resolveWorkspaceWithInfo(context, toolchain)
```


## function `resolvePackage`


```kex
resolvePackage(manifest)
```

