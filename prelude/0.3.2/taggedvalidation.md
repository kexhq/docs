---
package: prelude
version: "0.3.2"
source: taggedvalidation.kex
title: TaggedValidation
entities:
  - { kind: module, name: "TaggedValidation" }
---

# TaggedValidation

## module `TaggedValidation`

Diagnostics returned by optional compile-time tagged-literal validators. Byte offsets are zero-based and relative to the cooked literal body.

### `fatal`

```kex
fatal(message: String) -> Issue
```

### `fatalAt`

```kex
fatalAt(offset: Integer, message: String) -> Issue
```

### `fatalBetween`

```kex
fatalBetween : Integer -> Integer -> String -> Issue
```

### `warn`

```kex
warn(message: String) -> Issue
```

### `warnAt`

```kex
warnAt(offset: Integer, message: String) -> Issue
```

### `warnBetween`

```kex
warnBetween : Integer -> Integer -> String -> Issue
```

## type `ByteSpan`

**Variants**

  - `At(Integer)`
  - `Between(Integer, Integer)`



## type `Issue`

**Variants**

  - `Fatal(ByteSpan?, String)`
  - `Warn(ByteSpan?, String)`


