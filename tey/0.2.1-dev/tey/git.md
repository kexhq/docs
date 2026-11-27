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

Returns the tags a repository publishes, newest version first. Tags that are not versions sort last. Used to resolve a range requirement and to list the Kex toolchains that can be installed.

### `commitId?`

```kex
commitId?(text: String) -> Bool
```

Returns whether `text` is a full commit id: 40 lowercase hexadecimal digits. A short id is not accepted, since it could also be a ref name.
