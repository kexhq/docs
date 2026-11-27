---
package: tey
version: "0.2.1-dev"
source: tey/cache.kex
title: Tey.Cache
entities:
  - { kind: module, name: "Tey.Cache" }
---

# Tey.Cache

## module `Tey.Cache`

### `root` (foul)

```kex
root -> String
```

Returns the cache directory: `TEY_CACHE`, or `~/.cache/tey`, or `.tey-cache` when `HOME` is not set.

### `packagePath` (foul)

```kex
packagePath(dep: Tey.Lockfile.Dependency) -> String
```

Returns where a dependency's package lives in the cache.

A Git checkout is stored under a hash of its URL and then its commit, so two packages with the same name from different sources never share one. A `path` dependency's location comes from `Tey.Snapshot`.

### `repositoryPath` (foul)

```kex
repositoryPath(dep: Tey.Lockfile.Dependency) -> String
```

### `fetch` (foul)

```kex
fetch(dep: Tey.Lockfile.Dependency) -> Result<String, String>
```

Makes sure a dependency is in the cache, cloning it at its locked commit if needed, and returns its package path.

A workspace package is an error, since it is never cached.

### `verify` (foul)

```kex
verify(dep: Tey.Lockfile.Dependency) -> Result<String, String>
```

Checks that a cached dependency matches the SHA-256 in the lockfile, and returns its package path.

It is an error when the dependency is not cached, or when `git archive` of its commit hashes to something else.
