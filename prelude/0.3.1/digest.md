---
package: prelude
version: "0.3.1"
source: digest.kex
title: Digest
entities:
  - { kind: module, name: "Digest" }
---

# Digest

## module `Digest`

Cryptographic content digests. Hex strings are used at the public boundary so Kex programs never need to handle backend-specific binary values.

## function `sha256`


```kex
sha256(content) : String -> String
```


## function `fileSha256`


```kex
fileSha256(path) : String -> String?
```

