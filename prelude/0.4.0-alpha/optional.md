---
package: prelude
version: "0.4.0-alpha"
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

`X?` is shorthand for `Optional<X>`, and is the spelling you will normally write. Kex has no `null`: anything that might not produce a value returns an `Optional` instead, so the compiler makes you say what happens when it is empty. Most of the time that is a single `.or(default)` at the end of a chain.

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

## type `Either<L, R>`

One of two values, of possibly different types: `Left(l)` or `Right(r)`.

Unlike `Result`, neither side means failure: `Either` is for a value that is legitimately one of two shapes.

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

## trait `Optionable`

Marker trait for `Optional`. Constrain a generic parameter with it when a function accepts any optional value.



## trait `Resultable`

Marker trait for `Result`. Constrain a generic parameter with it when a function accepts any result value.



## trait `Eitherable`

Marker trait for `Either`. Constrain a generic parameter with it when a function accepts any either value.



## make `Optional<X>` implements [Optionable](#trait-optionable)


#### `set?`

Returns `true` when a value is present.

```kex
set? : Bool
```

**Returns**: `Bool`

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

Returns `true` when there is no value. The opposite of `set?`.

```kex
none? : Bool
```

**Returns**: `Bool`

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

Returns the wrapped value, or `default` when there is none.

This is the usual way an optional leaves the optional world: put `.or` at the end of a chain and the rest of your code works with a plain value.

```kex
or : X -> X
```

**Returns**: `X` — the wrapped value, or `default`

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

Applies `f` to the wrapped value, keeping the result wrapped. `None` is returned unchanged, so `f` never sees a missing value.

```kex
map : (X -> Y) -> Y?
```

**Returns**: `Y?` — `Just(f(x))`, or `None`

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

Applies `f`, which itself returns an optional, and flattens the result.

Use it instead of `map` when the step can also fail: `map` would give you a doubly wrapped `Just(Just(x))`, `flatMap` gives a single layer. A `None` anywhere in the chain short-circuits the rest.

```kex
flatMap : (X -> Y?) -> Y?
```

**Returns**: `Y?` — the result of `f`, or `None`

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

## make `Result<X, E>` implements [Resultable](#trait-resultable)


#### `ok?`

Returns `true` when the result is `Ok`.

```kex
ok? : Bool
```

**Returns**: `Bool`

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

Returns `true` when the result is `Error`. The opposite of `ok?`.

```kex
error? : Bool
```

**Returns**: `Bool`

**Examples**

```kex
Error("oops").error?   # => true
Ok(42).error?          # => false
```

#### `or`

Returns the `Ok` value, or `default` when the result is an `Error`.

The error payload is discarded. Match on the result instead when you need to report why it failed.

```kex
or : X -> X
```

**Returns**: `X` — the `Ok` value, or `default`

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

Applies `f` to the `Ok` value. An `Error` passes through untouched, so a chain of `map` calls describes the success path only.

```kex
map : (X -> Y) -> Result<Y, E>
```

**Returns**: `Result<Y, E>` — `Ok(f(x))`, or the original `Error`

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

Applies `f`, which itself returns a `Result`, and flattens the result.

The step-by-step form of `map` for stages that can fail on their own. The first `Error` ends the chain and is the answer.

```kex
flatMap : (X -> Result<Y, E>) -> Result<Y, E>
```

**Returns**: `Result<Y, E>` — the result of `f`, or the original `Error`

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

Converts the result to an `Optional`, dropping the error payload.

Useful when a caller only needs to know whether there is a value, and everything downstream already speaks `Optional`.

```kex
optional : X?
```

**Returns**: `X?` — `Just` of the `Ok` value, or `None`

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

## function `or`

Returns the value unchanged.

The catch-all clause of `or`: a value that is neither an `Optional` nor a `Result` has already succeeded, so there is nothing to fall back to. This is what lets `.or(default)` be written after a call whose return type may later stop being optional, without the call site changing.


```kex
or(value, _)
```


## function `to`

Converts `value` to the type `t`, or `None` if it cannot be represented.

`t` is a runtime type value: write the type name itself: `String`, `Integer`, `Float`, `List`. Conversion to `String` goes through the `Showable` protocol, so it works for every value.

The result is an `Optional`, not a `Result`, and deliberately so: the reason a conversion failed is usually implied by the types alone. When the reason carries information (where a parse gave up and on what) reach for `Integer.parse` or `Float.parse`, which answer with `Result<_, ParseError>`. So: `to` for every day, `parse` when the failure needs handling.


```kex
to(value, String)
```


## make `Either<L, R>` implements [Eitherable](#trait-eitherable)


