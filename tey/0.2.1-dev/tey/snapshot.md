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

Copies a path dependency into the cache as an immutable snapshot named by its content digest, and returns its lockfile entry.

The lockfile keeps the declared path for reference, but builds use the snapshot named by `sha256`, never the live directory. Fails when the directory is missing, its `package.kex` cannot be read or names another package, or a symbolic link in it is broken or points outside it.

### `cachedPath` (foul)

```kex
cachedPath(dependency: Tey.Lockfile.Dependency) -> String
```

Returns the cache directory of a dependency's snapshot.

### `verify` (foul)

```kex
verify(dependency: Tey.Lockfile.Dependency) -> Result<String, String>
```

Returns the snapshot directory of `dependency` after checking that it is in the cache and that its content still matches the locked `sha256`.

### `sourceFiles` (foul)

```kex
sourceFiles(root: String) -> [String]
```

Returns the files a snapshot of `root` holds, relative to it and sorted: everything except VCS metadata, build output, `package.local.kex`, `tey.lock` and paths matched by `.teyignore`.

### `contentDigest` (foul)

```kex
contentDigest(root: String) -> Result<String, String>
```

Returns the content digest a snapshot of `root` is published under.
