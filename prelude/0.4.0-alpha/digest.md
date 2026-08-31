---
package: prelude
version: "0.4.0-alpha"
source: digest.kex
title: Digest
entities:
  - { kind: module, name: "Digest" }
---

# Digest

## module `Digest`

Cryptographic content digests.

Digests are returned as lowercase hex strings, so a Kex program never has to handle backend-specific binary values: they compare with `==`, print directly, and go into a map key unchanged.

```kex
Digest.sha256("hello")
# => "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
```

SHA-256 is a content fingerprint: use it to tell whether two things are the same, to key a cache, or to check that a download arrived intact. It is not a password hash: a purpose-built password KDF is what that needs.

## function `sha256`

Returns the SHA-256 digest of `content`, as a 64-character lowercase hex string.


```kex
sha256(content) : String -> String
sha256(content) : Binary -> Binary
```


## function `fileSha256`

Returns the SHA-256 digest of the file at `path`, or `None` when the file cannot be read.

Reads the file for you, so a large file does not have to be pulled into a `String` first.


```kex
fileSha256(path) : String -> String?
```

