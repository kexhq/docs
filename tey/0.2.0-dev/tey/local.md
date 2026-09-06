---
package: tey
version: "0.2.0-dev"
source: tey/local.kex
title: Tey.Local
entities:
  - { kind: module, name: "Tey.Local" }
---

# Tey.Local

## module `Tey.Local`

## record `Override`

**Fields**

  - `overrideName` : String
  - `overridePath` : String
  - `overrideFile` : String
  - `overrideManifest` : [ManifestPackage](../tey/manifest.md#record-manifestpackage)

## function `load`


```kex
load(context)
```


## function `set`


```kex
set(context, name, path)
```


## function `remove`


```kex
remove(context, name)
```


## function `validateAgainstLock`


```kex
validateAgainstLock(overrides, lock)
```

