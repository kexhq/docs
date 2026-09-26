---
package: prelude
version: "0.4.0-beta.4-dev"
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
  - { kind: function, name: "to" }
  - { kind: make, name: "Either<L, R>" }
---

# Optional

## type `Optional<X>`

An optional value: `Just(x)` carries a value, `None` says there is none.

`X?` is shorthand for `Optional<X>`, and is the spelling you will normally write. Kex has no `null`: anything that might not produce a value returns an `Optional` instead, so the compiler makes you say what happens when it is empty. Most of the time that is a single `.or(default)` at the end of a chain.

Pattern matching handles the cases that need more than a default:

**Examples**

```kex
let names = ["ada", "grace"]
names.first.or("nobody")        # => "ada"
names.at(9).or("nobody")        # => "nobody"
names.first.map(~upperCase)        # => Just("ADA")
```

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

#### `set?` (from Optionable)

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

#### `or` (from Optionable)

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

Use it instead of `map` when the step can also fail: `map` would give you a doubly wrapped `Just(Just(x))`, `flatMap` gives a single layer. A `None` anywhere in the chain short-circuits the rest.

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

**Examples**

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

#### `ok?` (from Resultable)

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

#### `or` (from Resultable)

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

Unlike `Result`, neither side means failure: `Either` is for a value that is legitimately one of two shapes.

**Examples**

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

#### `either` (from Eitherable)

```kex
either(onLeft: (L -> A), onRight: (R -> A)) -> A
```

Case analysis: applies `onLeft` to a `Left` and `onRight` to a `Right`.

The way an `Either` is consumed without a `match`, and the operation `Eitherable` requires. Both branches answer the same type, so the result is a plain value rather than another `Either`.

**Parameters**

  - `onLeft` — applied to a `Left`
  - `onRight` — applied to a `Right`

**Returns**: whichever branch ran

**Examples**

```kex
Left(2).either(~toString, ~upperCase)       # => "2"
Right("ok").either(~toString, ~upperCase)   # => "OK"
```

_Collapsing an id to text_

```kex
let render(id: Either<Integer, String>) -> String do
  id.either({ |n| "#${n}" }, { |slug| slug })
end
```

#### `left?`

```kex
left? : Bool
```

Returns `true` for a `Left`.

**Examples**

```kex
Left(1).left?    # => true
Right(1).left?   # => false
```

#### `right?`

```kex
right? : Bool
```

Returns `true` for a `Right`. The opposite of `left?`.

**Examples**

```kex
Right(1).right?   # => true
Left(1).right?    # => false
```

## trait `Optionable`

A value that may be absent. Constrain a generic parameter with it when a function accepts any optional value.

The two operations below are what make the constraint worth having: an empty trait would accept a value and then let you do nothing with it, since there would be no method to call. `map` is deliberately NOT required — its result type differs per implementer (`Y?` here, `Result<Y, E>` for `Resultable`), which needs a higher-kinded parameter Kex does not have.

Implemented by [`Optional<X>`](#make-optional).

### Required methods

#### `set?`

```kex
set? : Bool
```

Answers `true` when a value is present.

The one operation an `Optionable` type must define; `none?` is its negation.

**Returns**: `true` for a present value

**Examples**

```kex
Just(1).set?   # => true
None.set?      # => false
```

#### `or`

```kex
or(default: X) -> X
```

Returns the wrapped value, or `default` when there is none.

The way out of the optional world, and the reason a constrained parameter is usable at all.

**Parameters**

  - `default` — the value to use when absent

**Returns**: the wrapped value, or `default`

**Examples**

```kex
Just(42).or(0)   # => 42
None.or(0)       # => 0
```



## trait `Resultable`

A value that either succeeded or failed with a reason. Constrain a generic parameter with it when a function accepts any result value.

Implemented by [`Result<X, E>`](#make-result).

### Required methods

#### `ok?`

```kex
ok? : Bool
```

Answers `true` for a success.

The one operation a `Resultable` type must define; `error?` is its negation.

**Returns**: `true` for `Ok`

**Examples**

```kex
Ok(1).ok?         # => true
Error("!").ok?    # => false
```

#### `or`

```kex
or(default: X) -> X
```

Returns the success value, or `default` on failure.

**Parameters**

  - `default` — the value to use on failure

**Returns**: the `Ok` value, or `default`

**Examples**

```kex
Ok(42).or(0)       # => 42
Error("!").or(0)   # => 0
```



## trait `Eitherable`

One of two values, neither meaning failure. Constrain a generic parameter with it when a function accepts any either value.

Implemented by [`Either<L, R>`](#make-either).

### Required methods

#### `either`

```kex
either(onLeft: (L -> A), onRight: (R -> A)) -> A
```

Case analysis: applies `onLeft` to a `Left` and `onRight` to a `Right`.

The one operation an `Eitherable` type must define — `left?` and `right?` are both written in terms of it. A discriminator alone would let you ask which side a value is on without being able to reach it, which is why this is the requirement rather than those.

**Parameters**

  - `onLeft` — applied to a `Left`
  - `onRight` — applied to a `Right`

**Returns**: whichever branch ran

**Examples**

```kex
Left(2).either(~toString, ~upperCase)      # => "2"
Right("ok").either(~toString, ~upperCase)  # => "OK"
```



## function `to`

```kex
to(value, t: Type, radix: Integer) -> A?
```

Converts `value` to the type `t`, or `None` if it cannot be represented.

`t` is a runtime type value: write the type name itself: `String`, `Integer`, `Float`, `List`. Conversion to `String` goes through the `Showable` protocol, so it works for every value.

The result is an `Optional`, not a `Result`, and deliberately so: the reason a conversion failed is usually implied by the types alone. When the reason carries information (where a parse gave up and on what) reach for `Integer.parse` or `Float.parse`, which answer with `Result<_, ParseError>`. So: `to` for every day, `parse` when the failure needs handling.

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
