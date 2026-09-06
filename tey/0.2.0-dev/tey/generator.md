---
package: tey
version: "0.2.0-dev"
source: tey/generator.kex
title: Tey.Generator
entities:
  - { kind: module, name: "Tey.Generator" }
---

# Tey.Generator

## module `Tey.Generator`

## type `Operation`



**Variants**

  - `WriteFile(String, String)`
  - `DeleteFile(String)`

## function `decode`

Decodes the child-to-host half of the separately versioned protocol. Plugin stdout is data, never Kex source evaluated in Tey's process.


```kex
decode(text)
```


## function `apply`


```kex
apply(operations, workspaceRoot, force?)
```


## function `safePath`


```kex
safePath(workspaceRoot, path)
```

