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

## function `execute`


```kex
execute(args)
```


## function `pinRef`


```kex
pinRef(url, selector, requested)
```


## function `tags`

Every version-shaped tag a repository publishes, newest first. Used to answer a range requirement, and to list installable Kex toolchains.


```kex
tags(url)
```

