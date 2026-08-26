---
package: prelude
version: "0.4.0-alpha"
source: errorable.kex
title: Errorable
entities:
  - { kind: trait, name: "Errorable" }
  - { kind: record, name: "ParseError" }
---

# Errorable

## trait `Errorable`

`Errorable` — the trait for values that describe a failure.

Implemented by error types that carry a human-readable message, so a generic handler can display or log any error without knowing its concrete type or its structured fields.

  foul report(e: Errorable) -> Void do     IO.printError("error: ${e.message}")   end


#### `message`

A human-readable description of what went wrong.

Written for a person reading output, not for a program to match on — branch on the error's own type or fields for that.

```kex
message : String
```

**Returns**: `String` — the failure message

**Examples**

```kex
  IO.printError("error: ${e.message}")
```

## record `ParseError`

A parse failure, with everything needed to report it or to carry on from it.

Answered by `Integer.parse`, `Float.parse` and `Number.parse` when the input is not what they expected. Reach for those over `to(Integer)` exactly when this detail matters: `to` answers a plain `None`.

  Integer.parse("12x")   # => Error(ParseError { input: "12x", position: 2, value: 12,   #                       message: "trailing characters after integer",   #                       rest: "x" })

The `position` and `rest` are what make a hand-written scanner possible: the error says exactly where it stopped and what was left.

**Fields**

  - `input` : String
  - `position` : Integer
  - `value` : Any
  - `message` : String
  - `rest` : String
