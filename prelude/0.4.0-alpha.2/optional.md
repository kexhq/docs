---
package: prelude
version: "0.4.0-alpha.2"
source: optional.kex
title: Optional
entities:
  - { kind: type, name: "Optional" }
  - { kind: type, name: "Result" }
  - { kind: type, name: "Either" }
  - { kind: trait, name: "Optionable" }
  - { kind: trait, name: "Resultable" }
  - { kind: trait, name: "Eitherable" }
  - { kind: make, name: "Optional<X>" }
  - { kind: make, name: "Result<X, E>" }
  - { kind: function, name: "or" }
  - { kind: function, name: "to" }
  - { kind: make, name: "Either<L, R>" }
---

# Optional

## type `Optional<X>`

An optional value: `Just(x)` carries a value, `None` says there is none.

`X?` is shorthand for `Optional<X>`, and is the spelling you will normally write. Kex has no `null` — anything that might not produce a value returns an `Optional` instead, so the compiler makes you say what happens when it is empty. Most of the time that is a single `.or(default)` at the end of a chain.

```kex
let names = ["ada", "grace"]
names.first.or("nobody")        # => "ada"
names.at(9).or("nobody")        # => "nobody"
names.first.map(~upperCase)        # => Just("ADA")
```

Pattern matching handles the cases that need more than a default:

```kex
match config.get("port") do
  Just(port) => IO.printLine("listening on ${port}")
  None       => IO.printLine("no port configured")
end
```

**Variants**

  - `Just(X)`
  - `None`

Implements [`Blankable`](blankable.md#trait-blankable), [`Showable`](kex.md#trait-showable), [`Optionable`](#trait-optionable), [`Truthyable`](truthyable.md#trait-truthyable).

### Methods

#### `set?`

```kex
set? : Bool
```

Returns `true` when a value is present.

**Examples**

```kex
Just(42).set?   # => true
None.set?       # => false
```

_Guarding on presence_

```kex
let cached = lookup(key)
if cached.set?
  IO.printLine("hit")
end
```

#### `none?`

```kex
none? : Bool
```

Returns `true` when there is no value. The opposite of `set?`.

**Examples**

```kex
None.none?       # => true
Just(42).none?   # => false
```

_Reporting a missing entry_

```kex
if config.get("host").none?
  IO.printError("host is required")
end
```

#### `or`

```kex
or(default: X) -> X
```

Returns the wrapped value, or `default` when there is none.

This is the usual way an optional leaves the optional world: put `.or` at the end of a chain and the rest of your code works with a plain value.

**Parameters**

  - `default` — the value to use when `None`

**Returns**: the wrapped value, or `default`

**Examples**

```kex
Just(42).or(0)   # => 42
None.or(0)       # => 0
```

_Closing a chain of lookups_

```kex
["a", "b"].first.or("?")            # => "a"
[].first.or("?")                    # => "?"
"hello".indexOf('z').or(-1)         # => -1
```

#### `map`

```kex
map(f: (X -> Y)) -> Y?
```

Applies `f` to the wrapped value, keeping the result wrapped. `None` is returned unchanged, so `f` never sees a missing value.

**Parameters**

  - `f` — applied to the value when present

**Returns**: `Just(f(x))`, or `None`

**Examples**

```kex
Just(2).map { |x| x * 3 }   # => Just(6)
None.map { |x| x * 3 }      # => None
```

_Transforming before supplying a default_

```kex
["ada"].first.map(~upperCase).or("ANON")   # => "ADA"
[].first.map(~upperCase).or("ANON")        # => "ANON"
```

#### `flatMap`

```kex
flatMap(f: (X -> Y?)) -> Y?
```

Applies `f`, which itself returns an optional, and flattens the result.

Use it instead of `map` when the step can also fail — `map` would give you a doubly wrapped `Just(Just(x))`, `flatMap` gives a single layer. A `None` anywhere in the chain short-circuits the rest.

**Parameters**

  - `f` — the next optional-returning step

**Returns**: the result of `f`, or `None`

**Examples**

```kex
Just(4).flatMap { |x| x > 0 then Just(x * 2) else None }   # => Just(8)
Just(-4).flatMap { |x| x > 0 then Just(x * 2) else None }  # => None
None.flatMap { |x| Just(x * 2) }                           # => None
```

_Chaining lookups that may each come up empty_

```kex
users.get(id)
  .flatMap { |user| user.address }
  .flatMap { |address| address.postcode }
  .or("unknown")
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

### Defined in other modules

  - [Blankable](blankable.md#make-optional): [`blank?`](blankable.md#optional-blank?)
  - [Kex](kex.md#make-optional-showable): [`showValue`](kex.md#optional-showable-showvalue)
  - [Truthyable](truthyable.md#make-optional): [`truthy?`](truthyable.md#optional-truthy?)

## type `Result<X, E>`

The outcome of an operation that can fail: `Ok(x)` on success, `Error(e)` on failure with a reason.

Use `Result` over `Optional` when the *reason* for failure matters to the caller. Parsing is the standard example: `"12x".to(Integer)` answers `None`, while `Integer.parse("12x")` answers an `Error` that says where it stopped.

```kex
Integer.parse("42").or(0)     # => 42
Integer.parse("4x").or(0)     # => 0

match Integer.parse(input) do
  Ok(n)    => IO.printLine("got ${n}")
  Error(e) => IO.printError("bad number: ${e}")
end
```

**Variants**

  - `Ok(X)`
  - `Error(E)`

Implements [`Showable`](kex.md#trait-showable), [`Resultable`](#trait-resultable).

### Methods

#### `ok?`

```kex
ok? : Bool
```

Returns `true` when the result is `Ok`.

**Examples**

```kex
Ok(42).ok?         # => true
Error("!").ok?     # => false
```

_Counting successes_

```kex
inputs.map(~Integer.parse).count(~ok?)
```

#### `error?`

```kex
error? : Bool
```

Returns `true` when the result is `Error`. The opposite of `ok?`.

**Examples**

```kex
Error("oops").error?   # => true
Ok(42).error?          # => false
```

#### `or`

```kex
or(default: X) -> X
```

Returns the `Ok` value, or `default` when the result is an `Error`.

The error payload is discarded. Match on the result instead when you need to report why it failed.

**Parameters**

  - `default` — the value to use on failure

**Returns**: the `Ok` value, or `default`

**Examples**

```kex
Ok(42).or(0)       # => 42
Error("!").or(0)   # => 0
```

_Parsing with a fallback_

```kex
Integer.parse(input).or(8080)
```

#### `map`

```kex
map(f: (X -> Y)) -> Result<Y, E>
```

Applies `f` to the `Ok` value. An `Error` passes through untouched, so a chain of `map` calls describes the success path only.

**Parameters**

  - `f` — applied to the value on success

**Returns**: `Ok(f(x))`, or the original `Error`

**Examples**

```kex
Ok(2).map { |x| x * 3 }        # => Ok(6)
Error("oops").map { |x| x }    # => Error("oops")
```

_Converting a parsed value_

```kex
Integer.parse("21").map { |n| n * 2 }   # => Ok(42)
```

#### `flatMap`

```kex
flatMap(f: (X -> Result<Y, E>)) -> Result<Y, E>
```

Applies `f`, which itself returns a `Result`, and flattens the result.

The step-by-step form of `map` for stages that can fail on their own. The first `Error` ends the chain and is the answer.

**Parameters**

  - `f` — the next fallible step

**Returns**: the result of `f`, or the original `Error`

**Examples**

```kex
Ok(4).flatMap { |x| x > 0 then Ok(x * 2) else Error("neg") }    # => Ok(8)
Ok(-4).flatMap { |x| x > 0 then Ok(x * 2) else Error("neg") }   # => Error("neg")
```

_A pipeline where each stage may fail_

```kex
Integer.parse(raw)
  .flatMap { |n| n > 0 then Ok(n) else Error("must be positive") }
  .flatMap { |n| n < 65536 then Ok(n) else Error("out of range") }
```

#### `optional`

```kex
optional : X?
```

Converts the result to an `Optional`, dropping the error payload.

Useful when a caller only needs to know whether there is a value, and everything downstream already speaks `Optional`.

**Returns**: `Just` of the `Ok` value, or `None`

**Examples**

```kex
Ok(42).optional          # => Just(42)
Error("oops").optional   # => None
```

_Keeping only the values that parsed_

```kex
["1", "x", "3"]
  .map { |s| Integer.parse(s).optional }
  .filter(~set?)
  .map { |o| o.or(0) }    # => [1, 3]
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

### Defined in other modules

  - [Kex](kex.md#make-result): [`showValue`](kex.md#result-showvalue)

## type `Either<L, R>`

One of two values, of possibly different types: `Left(l)` or `Right(r)`.

Unlike `Result`, neither side means failure — `Either` is for a value that is legitimately one of two shapes.

```kex
type Id = Either<Integer, String>

let describe(id: Id) -> String do
  match id do
    Left(n)  => "numeric id ${n}"
    Right(s) => "slug id ${s}"
  end
end
```

**Variants**

  - `Left(L)`
  - `Right(R)`

Implements [`Eitherable`](#trait-eitherable).

### Methods



## trait `Optionable`

Marker trait for `Optional`. Constrain a generic parameter with it when a function accepts any optional value.

Implemented by [`Optional<X>`](#make-optional).



## trait `Resultable`

Marker trait for `Result`. Constrain a generic parameter with it when a function accepts any result value.

Implemented by [`Result<X, E>`](#make-result).



## trait `Eitherable`

Marker trait for `Either`. Constrain a generic parameter with it when a function accepts any either value.

Implemented by [`Either<L, R>`](#make-either).



## function `or`

```kex
or(value: A, _) -> A
```

Returns the value unchanged.

The catch-all clause of `or`: a value that is neither an `Optional` nor a `Result` has already succeeded, so there is nothing to fall back to. This is what lets `.or(default)` be written after a call whose return type may later stop being optional, without the call site changing.

**Parameters**

  - `value` — any plain value

**Returns**: the same value

**Examples**

```kex
42.or(0)        # => 42
"text".or("")   # => "text"
```

## function `to`

```kex
to(value, t: Type, radix: Integer) -> A?
```

Converts `value` to the type `t`, or `None` if it cannot be represented.

`t` is a runtime type value — write the type name itself: `String`, `Integer`, `Float`, `List`. Conversion to `String` goes through the `Showable` protocol, so it works for every value.

The result is an `Optional`, not a `Result`, and deliberately so: the reason a conversion failed is usually implied by the types alone. When the reason carries information — where a parse gave up and on what — reach for `Integer.parse` or `Float.parse`, which answer with `Result<_, ParseError>`. So: `to` for every day, `parse` when the failure needs handling.

**Parameters**

  - `t` — the target type

**Returns**: the converted value, or `None`

**Examples**

_Numbers and strings_

```kex
42.to(String)        # => Just("42")
"42".to(Integer)     # => Just(42)
"4x".to(Integer)     # => None
"3.5".to(Float)      # => Just(3.5)
```

_Closing the conversion immediately_

```kex
let port = env.get("PORT").flatMap { |s| s.to(Integer) }.or(8080)
```
