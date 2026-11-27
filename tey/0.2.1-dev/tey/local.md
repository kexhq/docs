---
package: tey
version: "0.2.1-dev"
source: tey/local.kex
title: Tey.Local
entities:
  - { kind: module, name: "Tey.Local" }
---

# Tey.Local

## module `Tey.Local`

Local overrides: `package.local.kex` files that point a dependency at a checkout on this machine.

The files are never committed. `set` adds them to `.gitignore`, and a tracked one is an error.

### `load` (foul)

```kex
load(context: Context) -> Result<[Override], String>
```

Returns the overrides declared at the workspace root and in every member.

It is an error when an override's checkout has no `package.kex` or declares a different package, when one name is overridden in more than one place, or when a `package.local.kex` is tracked by Git.

### `set` (foul)

```kex
set(context: Context, name: String, path: String) -> Result<String, String>
```

Points `name` at the checkout at `path`, in the `package.local.kex` of the current member or else of the workspace root, and returns the package name.

A relative `path` is relative to that directory. Any earlier override of the same name in that file is replaced.

### `remove` (foul)

```kex
remove(context: Context, name: String) -> Result<String, String>
```

Removes the override of `name` from the file that declares it, and returns `name`.

### `validateAgainstLock`

```kex
validateAgainstLock(overrides: [Override], lock: Tey.Lockfile.LockState) -> Result<Void, String>
```

Checks that each override matches what `tey.lock` records for its package: the same version, the same dependencies and the same plugin interfaces.

## record `Override`

A local override: the package name, the checkout it points at, the `package.local.kex` that declares it, and the checkout's manifest.

**Fields**

  - `overrideName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `overridePath` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `overrideFile` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `overrideManifest` : [ManifestPackage](../tey/manifest.md#record-tey-manifest-manifestpackage)


