---
package: prelude
version: "0.3.4"
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

Implements [`Blankable`](blankable.md#trait-blankable), [`Optionable`](#trait-optionable), [`Truthyable`](truthyable.md#trait-truthyable).

### Methods

#### `set?`

```kex
set? : Bool
```

Returns `true` if this optional has value.

**Examples**

```kex
Just(42).set?    # => true
None.set?        # => false
```

#### `none?`

```kex
none? : Bool
```

Returns `true` if this optional is empty.

**Examples**

```kex
None.none?       # => true
Just(42).none?   # => false
```

#### `or`

```kex
or(default: X) -> X
```

Unwraps the value, returning `default` when `None`.

**Examples**

```kex
Just(42).or(0)   # => 42
None.or(0)       # => 0
```

#### `map`

```kex
map(f: (X -> Y)) -> Y?
```

Applies `f` to the wrapped value, leaving `None` unchanged.

**Examples**

```kex
Just(2).map { |x| x * 3 }   # => Just(6)
None.map { |x| x * 3 }      # => None
```

#### `flatMap`

```kex
flatMap(f: (X -> Y?)) -> Y?
```

Chains optional-returning functions, short-circuiting on `None`.

**Examples**

```kex
Just(4).flatMap { |x| x > 0 then Just(x * 2) else None }   # => Just(8)
None.flatMap { |x| Just(x * 2) }                           # => None
```

### Defined in other modules

  - [Blankable](blankable.md#make-optional): [`blank?`](blankable.md#optional-blank?)
  - [Truthyable](truthyable.md#make-optional): [`truthy?`](truthyable.md#optional-truthy?)

## type `Result<X, E>`

`Result<X, E>` represents a computation that either succeeded with `Ok(x)` or failed with `Error(e)`.

**Variants**

  - `Ok(X)`
  - `Error(E)`

Implements [`Resultable`](#trait-resultable).

### Methods

#### `ok?`

```kex
ok? : Bool
```

Returns `true` if the result is `Ok`.

**Examples**

```kex
Ok(42).ok?      # => true
Error("!").ok?  # => false
```

#### `error?`

```kex
error? : Bool
```

Returns `true` if the result is `Error`.

**Examples**

```kex
Error("oops").error?   # => true
Ok(42).error?          # => false
```

#### `or`

```kex
or(default: X) -> X
```

Unwraps the `Ok` value, returning `default` on `Error`.

**Examples**

```kex
Ok(42).or(0)       # => 42
Error("!").or(0)   # => 0
```

#### `map`

```kex
map(f: (X -> Y)) -> Result<Y, E>
```

Applies `f` to the `Ok` value, passing `Error` through unchanged.

**Examples**

```kex
Ok(2).map { |x| x * 3 }      # => Ok(6)
Error("oops").map { |x| x }   # => Error("oops")
```

#### `flatMap`

```kex
flatMap(f: (X -> Result<Y, E>)) -> Result<Y, E>
```

Chains result-returning functions, propagating `Error`.

**Examples**

```kex
Ok(4).flatMap { |x| x > 0 then Ok(x * 2) else Error("neg") }   # => Ok(8)
```

#### `optional`

```kex
optional : X?
```

Converts to `Optional`, discarding the error value on failure.

**Examples**

```kex
Ok(42).optional        # => Just(42)
Error("oops").optional # => None
```

## type `Either<L, R>`

`Either<L, R>` holds one of two possible value types.

**Variants**

  - `Left(L)`
  - `Right(R)`

Implements [`Eitherable`](#trait-eitherable).

### Methods



## trait `Optionable`

Marker traits used by generic code that accepts one of these ADT families. Their conformances are exported through KexI like any user-defined trait.

Implemented by [`Optional<X>`](#make-optional).



## trait `Resultable`

Implemented by [`Result<X, E>`](#make-result).



## trait `Eitherable`

Implemented by [`Either<L, R>`](#make-either).



## function `or`

```kex
or(value, _)
```

Universal `.or(default)` catch-all: a value that is neither Optional nor Result is already a successful result — return it unchanged.

## function `to`

```kex
to(value, t, radix: Integer)
```

Universal `.to(Type)` conversion. The type argument is a runtime Type value (e.g. String, Integer, Float, List). Returns an Optional result.

Optional, NOT Result, and deliberately: `to` is the everyday conversion, and what it can report on failure is almost always derivable from the types alone — `x.to(List)` on a non-list fails because a non-list is not a list, which an error payload saying "cannot convert Int to List" does not improve. When the reason IS information — where a parse gave up and on what — `Integer.parse`/`Float.parse` answer with `Result<_, ParseError>`. So: `to` for every day, `parse` when the failure needs handling.

A String target goes through the Showable protocol, exactly as `make Showable do let to(String) = Just(this.showValue)` says it does. The intrinsic below renders the raw runtime term instead, which on BEAM never reached the `Optional` implementation of showValue: `Just(42).to(String)` answered `Just("Just(42)")` there and `Just("42")` on the tree walker, which dispatches to the Showable clause. Intrinsics cannot call back into the prelude (dependency_layering_test), so the protocol has to be honoured here.
