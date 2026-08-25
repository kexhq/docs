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
  - `git` : String
  - `resolved` : String
  - `commit` : String
  - `sha256` : String
  - `groups` : [String] (optional)

## record `LockState`

**Fields**

  - `kexRequirement` : String
  - `kexVersion` : String
  - `otpRequirement` : String (optional)
  - `otpRelease` : Integer (optional)
  - `lockedDependencies` : [Dependency]

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

