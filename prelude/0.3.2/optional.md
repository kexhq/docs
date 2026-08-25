---
package: prelude
version: "0.3.2"
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

`X?` is shorthand for `Optional<X>`. `Just(x)` wraps a value; `None` represents absence.



**Variants**

  - `Just(X)`
  - `None`

## type `Result<X, E>`

`Result<X, E>` represents a computation that either succeeded with `Ok(x)` or failed with `Error(e)`.



**Variants**

  - `Ok(X)`
  - `Error(E)`

## type `Either<L, R>`

`Either<L, R>` holds one of two possible value types.



**Variants**

  - `Left(L)`
  - `Right(R)`

## trait `Optionable`

Marker traits used by generic code that accepts one of these ADT families. Their conformances are exported through KexI like any user-defined trait.



## trait `Resultable`



## trait `Eitherable`



## make `Optional<X>` implements [Optionable](#trait-optionable)


#### `set?`

Returns `true` if this optional has value.

```kex
set? : Bool
```

**Returns**: `Bool`

**Examples**

```kex
  Just(42).set?    # => true
  None.set?        # => false
```

#### `none?`

Returns `true` if this optional is empty.

```kex
none? : Bool
```

**Returns**: `Bool`

**Examples**

```kex
  None.none?       # => true
  Just(42).none?   # => false
```

#### `or`

Unwraps the value, returning `default` when `None`.

```kex
or : X -> X
```

**Returns**: `X`

**Examples**

```kex
  Just(42).or(0)   # => 42
  None.or(0)       # => 0
```

#### `map`

Applies `f` to the wrapped value, leaving `None` unchanged.

```kex
map : (X -> Y) -> Y?
```

**Returns**: `Y?`

**Examples**

```kex
  Just(2).map { |x| x * 3 }   # => Just(6)
  None.map { |x| x * 3 }      # => None
```

#### `flatMap`

Chains optional-returning functions, short-circuiting on `None`.

```kex
flatMap : (X -> Y?) -> Y?
```

**Returns**: `Y?`

**Examples**

```kex
  Just(4).flatMap { |x| x > 0 then Just(x * 2) else None }   # => Just(8)
  None.flatMap { |x| Just(x * 2) }                           # => None
```

## make `Result<X, E>` implements [Resultable](#trait-resultable)


#### `ok?`

Returns `true` if the result is `Ok`.

```kex
ok? : Bool
```

**Returns**: `Bool`

**Examples**

```kex
  Ok(42).ok?      # => true
  Error("!").ok?  # => false
```

#### `error?`

Returns `true` if the result is `Error`.

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

Unwraps the `Ok` value, returning `default` on `Error`.

```kex
or : X -> X
```

**Returns**: `X`

**Examples**

```kex
  Ok(42).or(0)       # => 42
  Error("!").or(0)   # => 0
```

#### `map`

Applies `f` to the `Ok` value, passing `Error` through unchanged.

```kex
map : (X -> Y) -> Result<Y, E>
```

**Returns**: `Result<Y, E>`

**Examples**

```kex
  Ok(2).map { |x| x * 3 }      # => Ok(6)
  Error("oops").map { |x| x }   # => Error("oops")
```

#### `flatMap`

Chains result-returning functions, propagating `Error`.

```kex
flatMap : (X -> Result<Y, E>) -> Result<Y, E>
```

**Returns**: `Result<Y, E>`

**Examples**

```kex
  Ok(4).flatMap { |x| x > 0 then Ok(x * 2) else Error("neg") }   # => Ok(8)
```

#### `optional`

Converts to `Optional`, discarding the error value on failure.

```kex
optional : X?
```

**Returns**: `X?`

**Examples**

```kex
  Ok(42).optional        # => Just(42)
  Error("oops").optional # => None
```

## function `or`

Universal `.or(default)` catch-all: a value that is neither Optional nor Result is already a successful result — return it unchanged.


```kex
or(value, _)
```


## function `to`

Universal `.to(Type)` conversion. The type argument is a runtime Type value (e.g. String, Integer, Float, List). Returns an Optional result.

Optional, NOT Result, and deliberately: `to` is the everyday conversion, and what it can report on failure is almost always derivable from the types alone — `x.to(List)` on a non-list fails because a non-list is not a list, which an error payload saying "cannot convert Int to List" does not improve. When the reason IS information — where a parse gave up and on what — `Integer.parse`/`Float.parse` answer with `Result<_, ParseError>`. So: `to` for every day, `parse` when the failure needs handling.

A String target goes through the Showable protocol, exactly as `make Showable do let to(String) = Just(this.showValue)` says it does. The intrinsic below renders the raw runtime term instead, which on BEAM never reached the `Optional` implementation of showValue: `Just(42).to(String)` answered `Just("Just(42)")` there and `Just("42")` on the tree walker, which dispatches to the Showable clause. Intrinsics cannot call back into the prelude (dependency_layering_test), so the protocol has to be honoured here.


```kex
to(value, String)
```


## make `Either<L, R>` implements [Eitherable](#trait-eitherable)


