---
package: prelude
version: "0.3.4"
source: number.kex
title: Number
entities:
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: module, name: "Integer" }
  - { kind: module, name: "Float" }
  - { kind: module, name: "Number" }
---

# Number

## type `Integer`

Implements [`Monoid`](algebra.md#trait-monoid), [`Group`](algebra.md#trait-group), [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

### `even?`

```kex
even? : Bool
```

Returns `true` if the integer is even.

**Examples**

```kex
4.even?   # => true
3.even?   # => false
```

### `odd?`

```kex
odd? : Bool
```

Returns `true` if the integer is odd.

**Examples**

```kex
3.odd?   # => true
4.odd?   # => false
```

### `abs`

```kex
abs : Integer
```

Returns the absolute value.

**Examples**

```kex
(-5).abs   # => 5
5.abs      # => 5
```

### `sqrt`

```kex
sqrt : Float
```

Returns the square root as a Float.

**Examples**

```kex
16.sqrt   # => 4.0
```

### `modulo`

```kex
modulo(n: Integer) -> Integer
```

Returns `this` modulo `n`. The result has the same sign as `n`, consistent with mathematical modulo (not C remainder).

**Examples**

```kex
7.modulo(3)     # => 1
(-7).modulo(3)  # => 2
```

### `in?`

```kex
in?(range: Range<Integer>) -> Bool
```

Returns `true` if the integer falls within `range` (inclusive).

**Examples**

```kex
5.in?(1..10)    # => true
11.in?(1..10)   # => false
```

### `times`

```kex
times(block: (Integer -> Void)) -> Void
```

Calls `f` exactly `this` times, passing the current index (0-based).

**Examples**

```kex
3.times { |i| IO.printLine(i) }   # prints 0, 1, 2
```

### `floor`

```kex
floor : Integer
```

Returns the greatest integer ≤ this. No-op on integers.

### `ceil`

```kex
ceil : Integer
```

Returns the smallest integer ≥ this. No-op on integers.

### `round`

```kex
round : Integer
```

Rounds to the nearest integer. No-op on integers.

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### Defined in other modules

  - [Algebra](algebra.md#make-integer): [`identity`](algebra.md#integer-identity), [`combine`](algebra.md#integer-combine), [`inverse`](algebra.md#integer-inverse)
  - [Blankable](blankable.md#make-integer): [`blank?`](blankable.md#integer-blank?)
  - [Truthyable](truthyable.md#make-integer): [`truthy?`](truthyable.md#integer-truthy?)

## type `Float`

Implements [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

### `abs`

```kex
abs : Float
```

Returns the absolute value.

**Examples**

```kex
(-3.14).abs   # => 3.14
```

### `sqrt`

```kex
sqrt : Float
```

Returns the square root.

**Examples**

```kex
25.0.sqrt   # => 5.0
```

### `in?`

```kex
in?(range: Range<Float>) -> Bool
```

Returns `true` if the float falls within `range` (inclusive).

**Examples**

```kex
1.5.in?(1.0..2.0)   # => true
```

### `floor`

```kex
floor : Integer
```

Returns the greatest integer ≤ this.

### `ceil`

```kex
ceil : Integer
```

Returns the smallest integer ≥ this.

### `round`

```kex
round : Integer
```

Rounds to the nearest integer.

### `toInteger`

```kex
toInteger : Integer
```

Truncates toward zero, converting to an `Integer`.

### Defined in other modules

  - [Blankable](blankable.md#make-float): [`blank?`](blankable.md#float-blank?)
  - [Truthyable](truthyable.md#make-float): [`truthy?`](truthyable.md#float-truthy?)

## module `Integer`

### `parse`

```kex
parse(s: String) -> Result<Integer, ParseError>
parse(s: String, radix: Integer) -> Result<Integer, ParseError>
```

Parses `s` in base `radix` (2..36), e.g. `Integer.parse("ff", radix: 16)`. Digits above 9 are accepted in either case.

### `parsePrefix`

```kex
parsePrefix(s: String) -> (Integer, String)?
```

## module `Float`

### `parse`

```kex
parse(s: String) -> Result<Float, ParseError>
```

### `parsePrefix`

```kex
parsePrefix(s: String) -> (Float, String)?
```

## module `Number`

### `parse`

```kex
parse(s: String) -> Result<Number, ParseError>
```
