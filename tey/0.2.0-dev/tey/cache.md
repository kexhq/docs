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

## constant `root`



## function `packagePath`

Include the source URL in the cache identity: two packages with the same display name must never share a checkout.


```kex
packagePath(dep)
```


## function `fetch`


```kex
fetch(dep)
```


## function `verify`


```kex
verify(dep)
```

