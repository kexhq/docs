---
package: tey
version: "0.2.1-dev"
source: tey/git.kex
title: Tey.Git
entities:
  - { kind: module, name: "Tey.Git" }
---

# Tey.Git

## module `Tey.Git`

### `execute` (foul)

```kex
execute(args: [String]) -> Result<ProcessResult, String>
```

### `pinRef` (foul)

```kex
pinRef(url: String, selector: String, requested: String) -> Result<(String, String), String>
```

### `tags` (foul)

```kex
tags(url: String) -> Result<[String], String>
```

Every version-shaped tag a repository publishes, newest first. Used to answer a range requirement, and to list installable Kex toolchains.

### `commitId?`

```kex
commitId?(text: String) -> Bool
```

A full hexadecimal commit id. A short one is left to `ls-remote`: it could as well be a ref name.
