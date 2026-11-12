---
package: tey
version: "0.2.1-dev"
source: tey/snapshot.kex
title: Tey.Snapshot
entities:
  - { kind: module, name: "Tey.Snapshot" }
---

# Tey.Snapshot

## module `Tey.Snapshot`

### `create` (foul)

```kex
create(name: String, declaredPath: String, declaringRoot: String) -> Result<Tey.Lockfile.Dependency, String>
```

Turns a path dependency into an immutable, content-addressed cache entry. The declared path remains in the lockfile for explanation; builds use the snapshot identified by `sha256`, never the live directory.

### `cachedPath` (foul)

```kex
cachedPath(dependency: Tey.Lockfile.Dependency) -> String
```

### `verify` (foul)

```kex
verify(dependency: Tey.Lockfile.Dependency) -> Result<String, String>
```

### `sourceFiles` (foul)

```kex
sourceFiles(root: String) -> [String]
```

The files a snapshot of `root` holds, relative to it: everything but VCS metadata, build output and `.teyignore` matches.

### `contentDigest` (foul)

```kex
contentDigest(root: String) -> Result<String, String>
```

The content digest a snapshot of `root` is published under.
