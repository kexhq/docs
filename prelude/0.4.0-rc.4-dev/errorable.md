---
package: prelude
version: "0.4.0-rc.4-dev"
source: errorable.kex
title: Errorable
entities:
  - { kind: trait, name: "Errorable" }
  - { kind: type, name: "ParseError" }
  - { kind: make, name: "ParseError<T>" }
  - { kind: record, name: "PatternError" }
---

# Errorable

## trait `Errorable`

`Errorable`: the trait for error values that carry a message.

An error type implements it by supplying `message`. A handler that only needs to show or log the error can then take any `Errorable`.

```kex
foul report(e: Errorable) -> Void do
  IO.printError("error: ${e.message}")
end
```

Implemented by [`ParseError<T>`](#make-parseerror).

### Required functions

#### `message`

```kex
message -> String
```

Returns a description of what went wrong, written for a person to read.

To decide what to do about an error, match on its type or fields; the wording of the message may change.

**Returns**: the failure message

**Examples**

```kex
IO.printError("error: ${e.message}")
```



## type `ParseError<T>`

The reason `Integer.parse`, `Float.parse` or `Number.parse` could not read a number, with one case per reason. Positions count characters from the start of the text.

```kex
match Integer.parse(text) do
  Ok(n) => Money(n, Currency.DEFAULT)
  Error(Trailing(n, unit)) => Money(n, unit.trim)
  Error(NoDigits(_)) => die("no amount in ${text}")
  Error(e) => die(e.message)
end
```

Use `parse` when the reason matters. `to(Integer)` only returns `None`.

**Variants**

  - `NoDigits(Integer)`
  - `Trailing(T, String)`
  - `BadGrouping(Integer)`
  - `OutOfRange`
  - `BadRadix(Integer)`
  - `BadCulture`

Implements [`Errorable`](#trait-errorable).

### Functions

#### `message` (from Errorable)

```kex
message -> String
```

Returns the failure as a sentence for a person to read.

**Examples**

```kex
Integer.parse("abc").mapError(~message)   # => Error("expected a digit at 0")
```

## record `PatternError`

The error `NumberFormat.parse` and `DateFormat.parse` return for a pattern they cannot read. It says where the pattern goes wrong and why, for the pattern's author to fix.

**Fields**

  - `position` : [Integer](number.md#make-integer)
  - `message` : [String](string.md#make-string)


