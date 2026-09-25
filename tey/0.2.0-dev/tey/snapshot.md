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

### `create`

```kex
create(name: String, declaredPath: String, declaringRoot: String) -> Result<Tey.Lockfile.Dependency, String>
```

Turns a path dependency into an immutable, content-addressed cache entry. The declared path remains in the lockfile for explanation; builds use the snapshot identified by `sha256`, never the live directory.

### `cachedPath`

```kex
cachedPath(dependency: Tey.Lockfile.Dependency) -> String
```

### `verify`

```kex
verify(dependency: Tey.Lockfile.Dependency) -> Result<String, String>
```
