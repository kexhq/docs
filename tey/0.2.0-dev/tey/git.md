---
package: tey
version: "0.2.0-dev"
source: tey/git.kex
title: Tey.Git
entities:
  - { kind: module, name: "Tey.Git" }
---

# Tey.Git

## module `Tey.Git`

### `execute`

```kex
execute(args: [String]) -> Result<ProcessResult, String>
```

### `pinRef`

```kex
pinRef(url: String, selector: String, requested: String) -> Result<(String, String), String>
```

### `tags`

```kex
tags(url: String) -> Result<[String], String>
```

Every version-shaped tag a repository publishes, newest first. Used to answer a range requirement, and to list installable Kex toolchains.
