---
package: prelude
version: "0.4.0-beta.4-dev"
source: taggedvalidation.kex
title: TaggedValidation
entities:
  - { kind: module, name: "TaggedValidation" }
---

# TaggedValidation

## module `TaggedValidation`

Diagnostics returned by compile-time validators for tagged literals.

A tagged literal (`` re`\d+` ``, `` sql`SELECT ...` ``) can be checked while your program is compiled rather than when it runs. The compiler finds the checker by name: a tag `foo` is validated by a function named `validateFoo` taking the literal's text and returning a list of `Issue` values. An empty list means the literal is fine.

```kex
let validateHex(source: String) -> [TaggedValidation.Issue] do
  match source.chars.findIndex { |c| !c.digit? && !c.in?('a'..'f') } do
    Just(offset) => [TaggedValidation.fatalAt(offset, "not a hex digit")]
    None         => []
  end
end
```

A `Fatal` issue stops the build with the message, pointing the caret at the offset; a `Warn` reports without stopping.

Byte offsets are zero-based and relative to the cooked literal body.

### `fatal`

```kex
fatal(message: String) -> Issue
```

A fatal issue about the literal as a whole, with no particular position.

**Parameters**

  - `message` — what is wrong

**Returns**: the diagnostic

**Examples**

```kex
TaggedValidation.fatal("an empty pattern matches nothing")
```

### `fatalAt`

```kex
fatalAt(offset: Integer, message: String) -> Issue
```

A fatal issue at one offset in the literal.

The offset is where the caret points in the compiler's error, so use the position the underlying checker reported.

**Parameters**

  - `offset` — the zero-based byte offset in the literal body
  - `message` — what is wrong

**Returns**: the diagnostic

**Examples**

```kex
TaggedValidation.fatalAt(3, "missing closing parenthesis")
```

_Reporting what a checker found_

```kex
match Kex.Intrinsic.Regex.validate(source) do
  Just((offset, message)) => [TaggedValidation.fatalAt(offset, message)]
  None                    => []
end
```

### `fatalBetween`

```kex
fatalBetween : Integer -> Integer -> String -> Issue
```

A fatal issue spanning a range of the literal.

**Parameters**

  - `start` — the first byte offset of the span
  - `finish` — the offset just past its end
  - `message` — what is wrong

**Returns**: the diagnostic

**Examples**

```kex
TaggedValidation.fatalBetween(0, 4, "this group can never match")
```

### `warn`

```kex
warn(message: String) -> Issue
```

A warning about the literal as a whole. Reported, but the build continues.

**Parameters**

  - `message` — what is questionable

**Returns**: the diagnostic

**Examples**

```kex
TaggedValidation.warn("this pattern is very slow on long inputs")
```

### `warnAt`

```kex
warnAt(offset: Integer, message: String) -> Issue
```

A warning at one offset in the literal.

**Parameters**

  - `offset` — the zero-based byte offset in the literal body
  - `message` — what is questionable

**Returns**: the diagnostic

**Examples**

```kex
TaggedValidation.warnAt(7, "redundant escape")
```

### `warnBetween`

```kex
warnBetween : Integer -> Integer -> String -> Issue
```

A warning spanning a range of the literal.

**Parameters**

  - `start` — the first byte offset of the span
  - `finish` — the offset just past its end
  - `message` — what is questionable

**Returns**: the diagnostic

**Examples**

```kex
TaggedValidation.warnBetween(2, 6, "this alternation is always taken")
```

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


