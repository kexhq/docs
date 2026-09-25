---
package: tey
version: "0.2.0-dev"
source: tey/lockfile.kex
title: Tey.Lockfile
entities:
  - { kind: module, name: "Tey.Lockfile" }
---

# Tey.Lockfile

## module `Tey.Lockfile`

Pure, and declared so. Reading and writing `tey.lock` is somebody else's job — this module only turns the text into a LockState and back, which is what makes the whole format testable without a disk (tey/spec/lockfile.spec.kex).

### `encode`

```kex
encode(lock: LockState) -> String
```

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

## record `Dependency`

**Fields**

  - `name` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `version` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `source` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `git` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `resolved` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `commit` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `subdir` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `path` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `sha256` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `groups` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)
  - `dependencies` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)
  - `pluginFingerprints` : {[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string): [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)} (optional)
  - `workspace?` : [Bool](../../../prelude/0.4.0-beta.4-dev/truthyable.md#make-bool) (optional)



## record `LockState`

**Fields**

  - `kexRequirement` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `kexVersion` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `otpRequirement` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `otpRelease` : [Integer](../../../prelude/0.4.0-beta.4-dev/number.md#make-integer) (optional)
  - `workspaceMembers` : {[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string): [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)} (optional)
  - `manifestFingerprint` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `lockedDependencies` : [Dependency]
  - `pluginApprovals` : {[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string): [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)} (optional)


