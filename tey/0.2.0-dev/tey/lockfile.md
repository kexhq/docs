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

## record `Dependency`

**Fields**

  - `name` : String
  - `version` : String (optional)
  - `source` : String (optional)
  - `git` : String (optional)
  - `resolved` : String (optional)
  - `commit` : String (optional)
  - `subdir` : String (optional)
  - `path` : String (optional)
  - `sha256` : String (optional)
  - `groups` : [String] (optional)
  - `dependencies` : [String] (optional)
  - `pluginFingerprints` : {String: String} (optional)
  - `workspace?` : Bool (optional)

## record `LockState`

**Fields**

  - `kexRequirement` : String
  - `kexVersion` : String
  - `otpRequirement` : String (optional)
  - `otpRelease` : Integer (optional)
  - `workspaceMembers` : {String: String} (optional)
  - `manifestFingerprint` : String (optional)
  - `lockedDependencies` : [Dependency]
  - `pluginApprovals` : {String: String} (optional)

## function `encode`


```kex
encode(lock)
```


## function `dependencyName`


```kex
dependencyName(dep)
```


## function `dependencyGit`


```kex
dependencyGit(dep)
```


## function `dependencyCommit`


```kex
dependencyCommit(dep)
```


## function `dependencySha256`


```kex
dependencySha256(dep)
```


## function `dependencyGroups`


```kex
dependencyGroups(dep)
```


## function `dependencyListLine`


```kex
dependencyListLine(dep)
```


## function `decode`


```kex
decode(text)
```

