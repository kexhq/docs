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

### `packagePath` (foul)

```kex
packagePath(dep: Tey.Lockfile.Dependency) -> String
```

Include the source URL in the cache identity: two packages with the same display name must never share a checkout.

### `repositoryPath` (foul)

```kex
repositoryPath(dep: Tey.Lockfile.Dependency) -> String
```

### `fetch` (foul)

```kex
fetch(dep: Tey.Lockfile.Dependency) -> Result<String, String>
```

### `verify` (foul)

```kex
verify(dep: Tey.Lockfile.Dependency) -> Result<String, String>
```
