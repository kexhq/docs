---
package: prelude
version: "0.4.0-rc.3-dev"
source: digest.kex
title: Digest
entities:
  - { kind: module, name: "Digest" }
---

# Digest

## module `Digest`

Cryptographic content digests.

A digest of a `String` is returned as a lowercase hex string, so a Kex program never has to handle backend-specific binary values: it compares with `==`, prints directly, and goes into a map key unchanged. A digest of a `Binary` is the raw digest bytes, as a `Binary`.

```kex
Digest.sha256("hello")
# => "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
```

SHA-256 is a content fingerprint: use it to tell whether two things are the same, to key a cache, or to check that a download arrived intact. It is not a password hash: a purpose-built password KDF is what that needs.

### `sha256`

```kex
sha256(content: String) -> String
sha256(content: Binary) -> Binary
```

Returns the SHA-256 digest of `content`, as a 64-character lowercase hex string.

**Parameters**

  - `content` — the text to hash

**Returns**: the hex digest

**Examples**

```kex
Digest.sha256("hello")
# => "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
Digest.sha256("")
# => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
```

_A cache key derived from an input_

```kex
let key = Digest.sha256(source).take(12)
```

_Detecting that content changed_

```kex
Digest.sha256(newText) != Digest.sha256(oldText)
```

### `fileSha256`

```kex
fileSha256(path: String) -> Result<String, ReadError>
```

Returns the SHA-256 digest of the file at `path`, or `ReadFailed` when the file cannot be read.

Reads the file for you, so a large file does not have to be pulled into a `String` first.

**Parameters**

  - `path` — the file to hash

**Returns**: the hex digest, or `ReadFailed`

**Examples**

```kex
Digest.fileSha256("archive.tar.gz")   # => Ok("a3f1...")
Digest.fileSha256("nowhere")          # => Error(ReadFailed)
```

_Verifying a download against a published checksum_

```kex
Digest.fileSha256(path).map { |actual| actual == expected }.or(false)
```
