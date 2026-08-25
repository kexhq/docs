---
package: prelude
version: "0.3.0"
source: taggedvalidation.kex
title: TaggedValidation
entities:
  - { kind: module, name: "TaggedValidation" }
---

# TaggedValidation

## module `TaggedValidation`

Diagnostics returned by optional compile-time tagged-literal validators. Byte offsets are zero-based and relative to the cooked literal body.

## type `ByteSpan`



**Variants**

  - `At(Integer)`
  - `Between(Integer, Integer)`

## type `Issue`



**Variants**

  - `Fatal(ByteSpan?, String)`
  - `Warn(ByteSpan?, String)`

## function `fatal`


```kex
fatal(message) : String -> Issue
```


## function `fatalAt`


```kex
fatalAt(offset, message) : Integer -> String -> Issue
```


## function `fatalBetween`


```kex
fatalBetween : Integer -> Integer -> String -> Issue
```


## function `warn`


```kex
warn(message) : String -> Issue
```


## function `warnAt`


```kex
warnAt(offset, message) : Integer -> String -> Issue
```


## function `warnBetween`


```kex
warnBetween : Integer -> Integer -> String -> Issue
```

