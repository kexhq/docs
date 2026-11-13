---
package: tey
version: "0.2.0-dev"
source: tey/cache.kex
title: Tey.Cache
entities:
  - { kind: module, name: "Tey.Cache" }
---

# Tey.Cache

## module `Tey.Cache`

### `root`

```kex
root : String
```

### `packagePath`

```kex
packagePath(dep: Tey.Lockfile.Dependency) -> String
```

Include the source URL in the cache identity: two packages with the same display name must never share a checkout.

### `repositoryPath`

```kex
repositoryPath(dep: Tey.Lockfile.Dependency) -> String
```

### `fetch`

```kex
fetch(dep: Tey.Lockfile.Dependency) -> Result<String, String>
```

### `verify`

```kex
verify(dep: Tey.Lockfile.Dependency) -> Result<String, String>
```
