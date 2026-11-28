---
package: prelude
version: "0.4.0-rc.4-dev"
source: tagged_validation.kex
title: TaggedValidation
entities:
  - { kind: module, name: "TaggedValidation" }
---

# TaggedValidation

## module `TaggedValidation`

Diagnostics that compile-time validators return for tagged literals.

A tagged literal (`` re`\d+` ``, `` sql`SELECT ...` ``) can be checked when the program is compiled. The compiler looks the checker up by name: tag `foo` is checked by a function `validateFoo` that takes the literal's text and returns a list of `Issue` values. An empty list means the literal is fine.

```kex
let validateHex(source: String) -> [TaggedValidation.Issue] do
  match source.chars.findIndex { |c| !c.digit? && !c.in?('a'..'f') } do
    Just(offset) => [TaggedValidation.fatalAt(offset, "not a hex digit")]
    None         => []
  end
end
```

A `Fatal` issue fails the build with its message and puts the caret at its offset. A `Warn` issue is reported and the build goes on.

Offsets count bytes from zero, from the start of the literal body after escapes are processed.

### `fatal`

```kex
fatal(message: String) -> Issue
```

Returns a fatal issue about the whole literal, with no position.

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

Returns a fatal issue at one offset in the literal.

The compiler's error puts its caret at `offset`, so pass the position your checker reported.

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
match checkPattern(source) do
  Just((offset, message)) => [TaggedValidation.fatalAt(offset, message)]
  None                    => []
end
```

### `fatalBetween`

```kex
fatalBetween(start: Integer, finish: Integer, message: String) -> Issue
```

Returns a fatal issue covering a range of the literal.

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

Returns a warning about the whole literal. The build goes on.

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

Returns a warning at one offset in the literal.

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
warnBetween(start: Integer, finish: Integer, message: String) -> Issue
```

Returns a warning covering a range of the literal.

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

Where in the literal an issue applies: one offset, or a range.

Both count bytes into the literal body from zero.

**Variants**

  - `At(Integer)`
  - `Between(Integer, Integer)`



## type `Issue`

One diagnostic about a tagged literal.

`Fatal` fails the build and `Warn` is reported while the build goes on. An issue about the whole literal has `None` for its span.

**Variants**

  - `Fatal(ByteSpan?, String)`
  - `Warn(ByteSpan?, String)`


