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

### `load`

```kex
load(context: Context) -> Result<[Override], String>
```

### `set`

```kex
set(context: Context, name: String, path: String) -> Result<String, String>
```

### `remove`

```kex
remove(context: Context, name: String) -> Result<String, String>
```

### `validateAgainstLock`

```kex
validateAgainstLock(overrides: [Override], lock: Tey.Lockfile.LockState) -> Result<Void, String>
```

## record `Override`

**Fields**

  - `overrideName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `overridePath` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `overrideFile` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `overrideManifest` : [ManifestPackage](../tey/manifest.md#record-tey-manifest-manifestpackage)


