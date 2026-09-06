---
package: tey
version: "0.2.0-dev"
source: tey/snapshot.kex
title: Tey.Snapshot
entities:
  - { kind: module, name: "Tey.Snapshot" }
---

# Tey.Snapshot

## module `Tey.Snapshot`

## function `create`

Turns a path dependency into an immutable, content-addressed cache entry. The declared path remains in the lockfile for explanation; builds use the snapshot identified by `sha256`, never the live directory.


```kex
create(name, declaredPath, declaringRoot)
```


## function `cachedPath`


```kex
cachedPath(dependency)
```


## function `verify`


```kex
verify(dependency)
```

