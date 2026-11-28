---
package: tey
version: "0.2.1-dev"
source: tey/lockfile.kex
title: Tey.Lockfile
entities:
  - { kind: module, name: "Tey.Lockfile" }
---

# Tey.Lockfile

## module `Tey.Lockfile`

Encoding and decoding `tey.lock`.

The functions here are pure: they turn the file's text into a `LockState` and back, and never touch the disk.

### `encode`

```kex
encode(lock: LockState) -> String
```

Returns the text of `tey.lock` for `lock`, with packages sorted by name.

### `dependencyName`

```kex
dependencyName(dep: Dependency) -> String
```

### `dependencyGit`

```kex
dependencyGit(dep: Dependency) -> String
```

### `dependencyCommit`

```kex
dependencyCommit(dep: Dependency) -> String
```

### `dependencySha256`

```kex
dependencySha256(dep: Dependency) -> String
```

### `dependencyGroups`

```kex
dependencyGroups(dep: Dependency) -> [String]
```

### `dependencyListLine`

```kex
dependencyListLine(dep: Dependency) -> String
```

### `decode`

```kex
decode(text: String) -> Result<LockState, String>
```

Parses the text of `tey.lock`.

It is an error when the text is not JSON, the format version is not 1, the workspace or toolchain section is missing, or a package lacks the fields its source needs.

## record `Dependency`

One locked package: where it came from, the exact commit or path, and its content hash.

**Fields**

  - `name` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `version` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `source` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `git` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `resolved` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `commit` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `subdir` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `path` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sha256` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `groups` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `dependencies` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `pluginFingerprints` : {[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string): [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)} (optional)
  - `workspace?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)



## record `LockState`

Everything `tey.lock` records: the toolchain, the workspace and every locked package.

**Fields**

  - `kexRequirement` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `kexVersion` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `otpRequirement` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `otpRelease` : [Integer](../../../prelude/0.4.0-rc.5-dev/number.md#make-integer) (optional)
  - `workspaceMembers` : {[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string): [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)} (optional)
  - `manifestFingerprint` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `lockedDependencies` : [Dependency]
  - `pluginApprovals` : {[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string): [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)} (optional)


