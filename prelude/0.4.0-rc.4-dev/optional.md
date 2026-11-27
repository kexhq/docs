---
package: prelude
version: "0.4.0-rc.4-dev"
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
  - { kind: make, name: "Result<_, E>" }
  - { kind: type, name: "Validation" }
  - { kind: make, name: "Validation<X, E>" }
  - { kind: make, name: "Validation<_, E>" }
  - { kind: function, name: "to" }
  - { kind: make, name: "Either<L, R>" }
---

# Optional

## type `Optional<X>`

An optional value: `Just(x)` carries a value, `None` says there is none.

`X?` is shorthand for `Optional<X>` and is the usual spelling. Kex has no `null`; a function that may have nothing to return returns an `Optional`, and the caller has to decide what happens when it is empty. Usually that is an `.or(default)` at the end of a chain.

When a default is not enough, match on the two cases:

**Examples**

```kex
let names = ["ada", "grace"]
names.first.or("nobody")        # => "ada"
names.at(9).or("nobody")        # => "nobody"
names.first.map(~upperCase)     # => Just("ADA")
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

Implements [`Blankable`](blankable.md#trait-blankable), [`Showable`](kex.md#trait-showable), [`Optionable`](#trait-optionable), [`Functor`](algebra.md#trait-functor), [`Bindable`](algebra.md#trait-bindable), [`Monad`](algebra.md#trait-monad), [`Applicable`](algebra.md#trait-applicable), [`Truthyable`](truthyable.md#trait-truthyable).

### Functions

#### `set?` (from Optionable)

```kex
set? -> Bool
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
none? -> Bool
```

Returns `true` when there is no value; the opposite of `set?`.

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

This is the usual way to end a chain of optional steps: the code after `.or` works with a plain value.

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

#### `map` (from Functor)

```kex
map(f: (X -> Y)) -> Y?
```

Applies `f` to the wrapped value and wraps the result. On `None`, `f` is not called and `None` is returned.

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

#### `into` (from Bindable, Monad)

```kex
into(f: (X -> Y?)) -> Y?
```

Applies `f`, which itself returns an optional, and returns its result.

Use it for a step that can come up empty: `map` would give a nested `Just(Just(x))`. Once a step returns `None`, the later steps do not run.

**Parameters**

  - `f` — the next optional-returning step

**Returns**: the result of `f`, or `None`

**Examples**

```kex
Just(4).into { |x| x > 0 then Just(x * 2) else None }   # => Just(8)
Just(-4).into { |x| x > 0 then Just(x * 2) else None }  # => None
None.into { |x| Just(x * 2) }                           # => None
```

_Chaining lookups that may each come up empty_

```kex
users.get(id)
  .into { |user| user.address }
  .into { |address| address.postcode }
  .or("unknown")
```

#### `with` (from Applicable)

```kex
with(other: Y?, f: (X -> Y -> Z)) -> Z?
```

Applies `f` to this value and `other`'s when both are present, and returns `None` otherwise. This is `Applicable`'s `with`.

**Parameters**

  - `other` — the second optional
  - `f` — combines the two values

**Returns**: `Just` the combined value, or `None`

**Examples**

```kex
Just(1).with(Just(2)) { |a, b| a + b }   # => Just(3)
Just(1).with(None) { |a, b| a + b }      # => None
```

#### `wrap` (from Monad, Applicable)

```kex
wrap(value: Y) -> Y?
```

Returns `Just(value)`. This is `Monad`'s `wrap`.

**Parameters**

  - `value` — the value to wrap

**Returns**: `Just(value)`

**Examples**

```kex
Optional.wrap(1)   # => Just(1)
```

#### `filter`

```kex
filter(pred: (X -> Bool)) -> X?
```

Keeps the value only when `pred` accepts it, and returns `None` otherwise.

**Parameters**

  - `pred` — the test the value must pass

**Returns**: the value, or `None`

**Examples**

```kex
Just(4).filter { |n| n.even? }   # => Just(4)
Just(3).filter { |n| n.even? }   # => None
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

### Defined in other modules

  - [Blankable](blankable.md#make-optional): [`blank?`](blankable.md#optional-blank?)
  - [Kex](kex.md#make-optional-showable): [`showValue`](kex.md#optional-showable-showvalue)
  - [Truthyable](truthyable.md#make-optional): [`truthy?`](truthyable.md#optional-truthy?)

## type `Result<X, E>`

The outcome of an operation that can fail: `Ok(x)` on success, `Error(e)` on failure with a reason.

Use `Result` when the caller needs to know why something failed, and `Optional` when it only needs to know whether it did. `"12x".to(Integer)` returns `None`, while `Integer.parse("12x")` returns `Error(Trailing(12, "x"))`, which says where parsing stopped and on what.

**Examples**

```kex
Integer.parse("42").or(0)     # => 42
Integer.parse("4x").or(0)     # => 0

match Integer.parse(input) do
  Ok(n)    => IO.printLine("got ${n}")
  Error(e) => IO.printError("bad number: ${e.message}")
end
```

**Variants**

  - `Ok(X)`
  - `Error(E)`

Implements [`Showable`](kex.md#trait-showable), [`Resultable`](#trait-resultable), [`Functor`](algebra.md#trait-functor), [`Bindable`](algebra.md#trait-bindable), [`Monad`](algebra.md#trait-monad), [`Applicable`](algebra.md#trait-applicable).

### Functions

#### `ok?` (from Resultable)

```kex
ok? -> Bool
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
error? -> Bool
```

Returns `true` when the result is `Error`; the opposite of `ok?`.

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

The error is discarded. To report why it failed, match on the result.

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

Applies `f` to the `Ok` value. An `Error` is returned as it is, and `f` is not called.

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

#### `into`

```kex
into(f: (X -> Result<Y, E>)) -> Result<Y, E>
```

Applies `f`, which itself returns a `Result`, and returns its result.

Use it to chain steps that can each fail. The first `Error` ends the chain and is what the chain returns.

**Parameters**

  - `f` — the next fallible step

**Returns**: the result of `f`, or the original `Error`

**Examples**

```kex
Ok(4).into { |x| x > 0 then Ok(x * 2) else Error("neg") }    # => Ok(8)
Ok(-4).into { |x| x > 0 then Ok(x * 2) else Error("neg") }   # => Error("neg")
```

_A pipeline where each stage may fail_

```kex
Integer.parse(raw)
  .into { |n| n > 0 then Ok(n) else Error("must be positive") }
  .into { |n| n < 65536 then Ok(n) else Error("out of range") }
```

#### `with`

```kex
with(other: Result<Y, E>, f: (X -> Y -> Z)) -> Result<Z, E>
```

Applies `f` to this success and `other`'s, or returns the first error. This is `Applicable`'s `with`.

**Parameters**

  - `other` — the second result
  - `f` — combines the two values

**Returns**: `Ok` the combined value, or the first `Error`

**Examples**

```kex
Ok(1).with(Ok(2)) { |a, b| a + b }           # => Ok(3)
Ok(1).with(Error("no")) { |a, b| a + b }     # => Error("no")
```

#### `optional`

```kex
optional -> X?
```

Converts the result to an `Optional`, dropping the error.

Use it when the caller only cares whether there is a value, or the code that follows works with optionals.

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

#### `mapError`

```kex
mapError(f: (E -> F)) -> Result<X, F>
```

Applies `f` to the error and leaves a success alone; `map` for the error side.

**Parameters**

  - `f` — applied to the error

**Returns**: the same `Ok`, or `Error(f(e))`

**Examples**

```kex
Error(404).mapError { |code| "HTTP ${code}" }   # => Error("HTTP 404")
Ok(1).mapError { |code| "HTTP ${code}" }        # => Ok(1)
```

#### `error`

```kex
error -> E?
```

Returns the error wrapped in `Just`, or `None` for a success; the counterpart of `optional`.

**Returns**: the error, or `None`

**Examples**

```kex
Error("bad").error   # => Just("bad")
Ok(1).error          # => None
```

### On `Result<_, E>`

Makes `Result` a `Functor`, `Bindable`, `Monad` and `Applicable` over its success value, with the error type `E` fixed. The `map` and `into` above are the ones these traits use.

#### `wrap` (from Monad, Applicable)

```kex
wrap(value: Y) -> Result<Y, E>
```

Returns `Ok(value)`. This is `Monad`'s `wrap`.

**Parameters**

  - `value` — the success value

**Returns**: `Ok(value)`

**Examples**

```kex
Result.wrap(1)   # => Ok(1)
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

### Defined in other modules

  - [Kex](kex.md#make-result): [`showValue`](kex.md#result-showvalue)

## type `Either<L, R>`

One of two values, of possibly different types: `Left(l)` or `Right(r)`.

Neither side means failure, as `Error` does in a `Result`. Use `Either` for a value that can take one of two shapes.

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

### Functions

#### `either` (from Eitherable)

```kex
either(onLeft: (L -> A), onRight: (R -> A)) -> A
```

Applies `onLeft` to a `Left` or `onRight` to a `Right` and returns the result.

Use it to turn an `Either` into one value without a `match`. Both functions return the same type `A`.

**Parameters**

  - `onLeft` — applied to a `Left`
  - `onRight` — applied to a `Right`

**Returns**: whichever branch ran

**Examples**

```kex
Left(2).either(~showValue, ~upperCase)       # => "2"
Right("ok").either(~showValue, ~upperCase)   # => "OK"
```

_Collapsing an id to text_

```kex
let render(id: Either<Integer, String>) -> String do
  id.either({ |n| "#${n}" }, { |slug| slug })
end
```

#### `left?`

```kex
left? -> Bool
```

Returns `true` for a `Left`.

**Examples**

```kex
Left(1).left?    # => true
Right(1).left?   # => false
```

#### `right?`

```kex
right? -> Bool
```

Returns `true` for a `Right`; the opposite of `left?`.

**Examples**

```kex
Right(1).right?   # => true
Left(1).right?    # => false
```

## trait `Optionable`

A value that may be absent. Constrain a generic parameter with it when a function accepts any optional value.

The trait requires only `set?` and `or`. It does not require `map`, because the result type of `map` differs between implementers (`Y?` for an `Optional`, `Result<Y, E>` for a `Result`), and expressing that would need a higher-kinded type parameter, which Kex does not have.

Implemented by [`Optional<X>`](#make-optional).

### Required functions

#### `set?`

```kex
set? -> Bool
```

Returns `true` when a value is present.

Every `Optionable` type must define it; `none?` is its negation.

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

### Required functions

#### `ok?`

```kex
ok? -> Bool
```

Returns `true` for a success.

Every `Resultable` type must define it; `error?` is its negation.

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

### Required functions

#### `either`

```kex
either(onLeft: (L -> A), onRight: (R -> A)) -> A
```

Applies `onLeft` to a `Left` or `onRight` to a `Right` and returns the result.

Every `Eitherable` type must define it. The trait requires this, and not `left?` or `right?`, because those only say which side a value is on; `either` also hands over the value.

**Parameters**

  - `onLeft` — applied to a `Left`
  - `onRight` — applied to a `Right`

**Returns**: whichever branch ran

**Examples**

```kex
Left(2).either(~showValue, ~upperCase)      # => "2"
Right("ok").either(~showValue, ~upperCase)  # => "OK"
```



## type `Validation<T, E>`

The outcome of several independent checks: `Valid` with the value, or `Invalid` with every failure. Combining +Result+s stops at the first error; combining +Validation+s with `with` collects all of them, so a form or a config file can report every problem at once:

```kex
let checkedName(name: String) -> Validation<String, String> do
  return name.empty? then Invalid(["name is empty"]) else Valid(name)
end

checkedName("").with(checkedEmail("x")) do |n, e|
  Signup { name: n, email: e }
end
# => Invalid(["name is empty", "email has no @"])
```

`Validation` is `Applicable` but not a `Monad`. A chained step needs the previous value, which a failure does not have, so chaining could only stop at the first failure.

**Variants**

  - `Valid(T)`
  - `Invalid([E])`

Implements [`Functor`](algebra.md#trait-functor), [`Applicable`](algebra.md#trait-applicable).

### Functions

#### `map`

```kex
map(f: (X -> Y)) -> Validation<Y, E>
```

Applies `f` to the value when valid, and leaves the failures of an `Invalid` as they are.

**Parameters**

  - `f` — applied to a valid value

**Returns**: `Valid(f(x))`, or the same failures

**Examples**

```kex
Valid(2).map { |n| n * 10 }   # => Valid(20)
```

#### `with`

```kex
with(other: Validation<Y, E>, f: (X -> Y -> Z)) -> Validation<Z, E>
```

Applies `f` to this value and `other`'s when both are valid. Otherwise it returns the failures of both, this one's first. This is `Applicable`'s `with`.

**Parameters**

  - `other` — the second validation
  - `f` — combines the two values

**Returns**: `Valid` the combined value, or every failure

**Examples**

```kex
Valid(1).with(Valid(2)) { |a, b| a + b }                   # => Valid(3)
Invalid(["a"]).with(Invalid(["b"])) { |a, b| a + b }       # => Invalid(["a", "b"])
```

#### `toResult`

```kex
toResult -> Result<X, [E]>
```

Converts to a `Result`: `Ok` with the value, or `Error` with the list of failures.

**Returns**: the value, or every failure

**Examples**

```kex
Invalid(["a", "b"]).toResult   # => Error(["a", "b"])
```

### On `Validation<_, E>`

#### `wrap` (from Applicable)

```kex
wrap(value: Y) -> Validation<Y, E>
```

Returns `Valid(value)`. This is `Applicable`'s `wrap`.

**Parameters**

  - `value` — the value

**Returns**: `Valid(value)`

**Examples**

```kex
Validation.wrap(1)   # => Valid(1)
```

## function `to`

```kex
to(value: A, t: Type<T>) -> T?
to(value: A, t: Type<T>, radix: Integer) -> T?
```

Converts `value` to the type `t`, or `None` if it cannot be represented.

Pass the type name itself as `t`: `String`, `Integer`, `Float`, `List`. Conversion to `String` uses `showValue`, so it works for every value.

Most failed conversions need no explanation, so `to` returns an `Optional`. When you need to know where a parse gave up and on what, use `Integer.parse` or `Float.parse`, which return a `Result` with a `ParseError`.

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
let port = env.get("PORT").into { |s| s.to(Integer) }.or(8080)
```
