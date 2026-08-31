---
package: prelude
version: "0.4.0-alpha"
source: taggedvalidation.kex
title: TaggedValidation
entities:
  - { kind: module, name: "TaggedValidation" }
---

# TaggedValidation

## module `TaggedValidation`

Diagnostics returned by compile-time validators for tagged literals.

A tagged literal (`` re`\d`` ``, `` sql`SELECT ...` ``) can be checked while your program is compiled rather than when it runs. The compiler finds the checker by name: a tag `foo` is validated by a function named `validateFoo` taking the literal's text and returning a list of `Issue` values. An empty list means the literal is fine.

```kex
let validateHex(source: String) -> [TaggedValidation.Issue] do
  match source.chars.findIndex { |c| !c.digit? && !c.in?('a'..'f') } do
    Just(offset) => [TaggedValidation.fatalAt(offset, "not a hex digit")]
    None         => []
  end
end
```

A `Fatal` issue stops the build with the message, pointing the caret at the offset; a `Warn+ reports without stopping.

Byte offsets are zero-based and relative to the cooked literal body.

## type `ByteSpan`

Where in the literal an issue applies: a single offset, or a range.

Both are byte offsets into the literal body, counted from zero.



**Variants**

  - `At(Integer)`
  - `Between(Integer, Integer)`

## type `Issue`

One diagnostic about a tagged literal.

`Fatal` stops the build; `Warn` reports and lets it continue. The span is optional: an issue about the literal as a whole carries `None`.



**Variants**

  - `Fatal(ByteSpan?, String)`
  - `Warn(ByteSpan?, String)`

## function `fatal`

A fatal issue about the literal as a whole, with no particular position.


```kex
fatal(message) : String -> Issue
```


## function `fatalAt`

A fatal issue at one offset in the literal.

The offset is where the caret points in the compiler's error, so use the position the underlying checker reported.


```kex
fatalAt(offset, message) : Integer -> String -> Issue
```


## function `fatalBetween`

A fatal issue spanning a range of the literal.


```kex
fatalBetween : Integer -> Integer -> String -> Issue
```


## function `warn`

A warning about the literal as a whole. Reported, but the build continues.


```kex
warn(message) : String -> Issue
```


## function `warnAt`

A warning at one offset in the literal.


```kex
warnAt(offset, message) : Integer -> String -> Issue
```


## function `warnBetween`

A warning spanning a range of the literal.


```kex
warnBetween : Integer -> Integer -> String -> Issue
```

