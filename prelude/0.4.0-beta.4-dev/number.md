---
package: prelude
version: "0.4.0-beta.4-dev"
source: number.kex
title: Number
entities:
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: module, name: "Integer" }
  - { kind: module, name: "Float" }
  - { kind: module, name: "Float32" }
  - { kind: module, name: "Float64" }
  - { kind: module, name: "Int8" }
  - { kind: module, name: "Int16" }
  - { kind: module, name: "Int32" }
  - { kind: module, name: "Int64" }
  - { kind: module, name: "UInt8" }
  - { kind: module, name: "UInt16" }
  - { kind: module, name: "UInt32" }
  - { kind: module, name: "UInt64" }
  - { kind: module, name: "Byte" }
  - { kind: module, name: "Number" }
---

# Number

## type `Integer`

Implements [`Monoid`](algebra.md#trait-monoid), [`Group`](algebra.md#trait-group), [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

Whole numbers, of arbitrary size.

`Integer` has no width limit: factorials and cryptographic moduli are ordinary values, not a special big-number type you have to opt into.

`Integer` and `Float` are one numeric tower: they compare and order across the boundary, so `0 == 0.0` is `true` and `[1, 2.5, 3].sort` works. What differs is the arithmetic. `/` on two integers is integer division, and `sqrt` answers a `Float` because a square root generally is one.

```kex
7 / 2          # => 3      (integer division)
7.0 / 2.0      # => 3.5
16.sqrt        # => 4.0    (a Float, even from an Integer)
(-7).modulo(3) # => 2      (mathematical modulo, not C remainder)
```

### `even?`

```kex
even? : Bool
```

Returns `true` when the integer is divisible by two. Zero is even, and negative numbers follow the same rule.

**Returns**: `true` for an even integer

**Examples**

```kex
4.even?      # => true
3.even?      # => false
(-2).even?   # => true
```

_Splitting a list into evens and odds_

```kex
[1, 2, 3, 4].partition { |n| n.even? }   # => ([2, 4], [1, 3])
```

### `odd?`

```kex
odd? : Bool
```

Returns `true` when the integer is not divisible by two. The opposite of `even?`.

**Returns**: `true` for an odd integer

**Examples**

```kex
3.odd?   # => true
4.odd?   # => false
```

### `abs`

```kex
abs : Integer
```

Returns the magnitude of the integer, discarding its sign.

**Returns**: the absolute value

**Examples**

```kex
(-5).abs   # => 5
5.abs      # => 5
```

_Distance between two positions_

```kex
(a - b).abs
```

### `sqrt`

```kex
sqrt : Float
```

Returns the square root as a `Float`.

The result is a `Float` even when the root is exact, because in general it is not. Round or floor it when you need an integer back.

**Returns**: the square root

**Examples**

```kex
16.sqrt          # => 4.0
2.sqrt           # => 1.4142135623730951
16.sqrt.round    # => 4
```

### `modulo`

```kex
modulo(n: Integer) -> Integer
```

Returns `this` modulo `n`.

The result takes the sign of `n`, which is mathematical modulo rather than the C-style remainder other languages give. That is what makes it safe for wrapping an index that may have gone negative.

**Parameters**

  - `n` — the modulus

**Returns**: the remainder, with the sign of `n`

**Examples**

```kex
7.modulo(3)      # => 1
(-7).modulo(3)   # => 2
```

_Wrapping an index around a list_

```kex
let items = ["a", "b", "c"]
items.at((-1).modulo(items.count))   # => Just("c")
```

### `in?`

```kex
in?(range: Range<Integer>) -> Bool
```

Returns `true` when the integer falls inside `range`, endpoints included.

**Parameters**

  - `range` — the inclusive range

**Returns**: `true` when the integer is in range

**Examples**

```kex
5.in?(1..10)    # => true
11.in?(1..10)   # => false
```

_Validating a port number_

```kex
port.in?(1..65535)
```

### `times`

```kex
times(block: (Integer -> Void)) -> Void
times(block: Block<Void>) -> Void
```

Calls `f` exactly `this` times, passing the 0-based iteration index.

This is the counting loop. When you want the numbers themselves rather than a count of repetitions, `(1..n).items.each` often reads better.

**Parameters**

  - `f` — called once per iteration with the index

**Examples**

```kex
3.times { |i| IO.printLine(i) }   # prints 0, then 1, then 2
```

_Repeating an action_

```kex
retries.times { |_| attemptConnection }
```

_Repeating an action that needs no index_

```kex
3.times do
  IO.printLine("hi")
end
```

### `floor`

```kex
floor : Integer
```

Returns the integer unchanged. Present so that code written against `Number` works whichever half of the tower it is handed.

**Returns**: the same integer

**Examples**

```kex
7.floor   # => 7
```

### `ceil`

```kex
ceil : Integer
```

Returns the integer unchanged. The `Integer` counterpart of `Float.ceil`.

**Returns**: the same integer

**Examples**

```kex
7.ceil   # => 7
```

### `round`

```kex
round : Integer
```

Returns the integer unchanged. The `Integer` counterpart of `Float.round`.

**Returns**: the same integer

**Examples**

```kex
7.round   # => 7
```

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### Defined in other modules

  - [Algebra](algebra.md#make-integer): [`identity`](algebra.md#integer-identity), [`combine`](algebra.md#integer-combine), [`inverse`](algebra.md#integer-inverse)
  - [Blankable](blankable.md#make-integer): [`blank?`](blankable.md#integer-blank?)
  - [Time](time.md#make-integer): [`milliseconds`](time.md#integer-milliseconds), [`seconds`](time.md#integer-seconds), [`minutes`](time.md#integer-minutes), [`hours`](time.md#integer-hours), [`days`](time.md#integer-days), [`weeks`](time.md#integer-weeks), [`months`](time.md#integer-months), [`years`](time.md#integer-years)
  - [Truthyable](truthyable.md#make-integer): [`truthy?`](truthyable.md#integer-truthy?)
  - [Units](units.md#make-integer): [`nanosecond`](units.md#integer-nanosecond), [`microsecond`](units.md#integer-microsecond), [`millisecond`](units.md#integer-millisecond), [`sec`](units.md#integer-sec), [`minute`](units.md#integer-minute), [`hour`](units.md#integer-hour), [`day`](units.md#integer-day), [`week`](units.md#integer-week), [`timeMeasure`](units.md#integer-timemeasure)
  - [Units.SI](units/si.md#make-integer): [`kilo`](units/si.md#integer-kilo)

## type `Float`

Implements [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

Double-precision floating-point numbers.

A Kex `Float` is always finite. An operation that would produce `NaN` or `Infinity` raises instead: the same rule the BEAM enforces, where those two values cannot exist at all. So a `Float` you are holding is always a real number, and there is no `nan?` to check for.

`Float` and `Integer` compare and order across the boundary; see `Integer` for the rest of the numeric tower.

```kex
3.7.floor      # => 3
3.7.round      # => 4
(-3.7).toInteger  # => -3   (truncates toward zero)
```

### `abs`

```kex
abs : Float
```

Returns the magnitude of the float, discarding its sign.

**Returns**: the absolute value

**Examples**

```kex
(-3.14).abs   # => 3.14
3.14.abs      # => 3.14
```

_An approximate-equality test_

```kex
(a - b).abs < 0.0001
```

### `sqrt`

```kex
sqrt : Float
```

Returns the square root. Raises for a negative receiver, which has no real root.

**Returns**: the square root

**Examples**

```kex
25.0.sqrt   # => 5.0
2.0.sqrt    # => 1.4142135623730951
```

### `in?`

```kex
in?(range: Range<Float>) -> Bool
```

Returns `true` when the float falls inside `range`, endpoints included.

**Parameters**

  - `range` — the inclusive range

**Returns**: `true` when the float is in range

**Examples**

_Comparing directly is usually clearer for floats_

```kex
let ratio = 0.75
ratio >= 0.0 && ratio <= 1.0   # => true
```

### `floor`

```kex
floor : Integer
```

Returns the largest integer that is not greater than the float: it always rounds toward negative infinity, which is what separates it from `toInteger` for negative values.

**Returns**: the floor

**Examples**

```kex
3.7.floor      # => 3
3.2.floor      # => 3
(-3.2).floor   # => -4
```

### `ceil`

```kex
ceil : Integer
```

Returns the smallest integer that is not less than the float: it always rounds toward positive infinity.

**Returns**: the ceiling

**Examples**

```kex
3.2.ceil       # => 4
3.0.ceil       # => 3
(-3.7).ceil    # => -3
```

_How many pages of a fixed size a list needs_

```kex
(items.count.to(Float).or(0.0) / 20.0).ceil
```

### `round`

```kex
round : Integer
```

Returns the nearest integer, with halves rounding away from zero.

**Returns**: the rounded value

**Examples**

```kex
3.2.round    # => 3
3.5.round    # => 4
3.7.round    # => 4
```

### `toInteger`

```kex
toInteger : Integer
```

Truncates toward zero and returns the result as an `Integer`: it drops the fractional part rather than rounding, so it differs from both `floor` and `round` for negative values.

**Returns**: the truncated value

**Examples**

```kex
3.7.toInteger      # => 3
(-3.7).toInteger   # => -3   (floor would give -4)
```

### Defined in other modules

  - [Blankable](blankable.md#make-float): [`blank?`](blankable.md#float-blank?)
  - [Time](time.md#make-float): [`milliseconds`](time.md#float-milliseconds), [`seconds`](time.md#float-seconds), [`minutes`](time.md#float-minutes), [`hours`](time.md#float-hours), [`days`](time.md#float-days), [`weeks`](time.md#float-weeks)
  - [Truthyable](truthyable.md#make-float): [`truthy?`](truthyable.md#float-truthy?)
  - [Units](units.md#make-float): [`nanosecond`](units.md#float-nanosecond), [`microsecond`](units.md#float-microsecond), [`millisecond`](units.md#float-millisecond), [`sec`](units.md#float-sec), [`minute`](units.md#float-minute), [`hour`](units.md#float-hour), [`day`](units.md#float-day), [`week`](units.md#float-week), [`timeMeasure`](units.md#float-timemeasure)
  - [Units.SI](units/si.md#make-float): [`kilo`](units/si.md#float-kilo)

## module `Integer`

Reading integers out of text.

Use `parse` when a failure needs explaining and `"42".to(Integer)` when it does not: `to` answers a plain `Optional`, `parse` answers a `Result` carrying a `ParseError` that says where it stopped and what it had read so far.

### `parse`

```kex
parse(s: String) -> Result<Integer, ParseError>
parse(s: String, radix: Integer) -> Result<Integer, ParseError>
```

Parses the whole string as a base-10 integer.

The string must be entirely consumed: leading or trailing characters make it an `Error`, with a `ParseError` describing where parsing stopped. Use `parsePrefix` when a trailing remainder is expected.

**Parameters**

  - `s` — the text to parse

**Returns**: the integer, or a described failure

**Examples**

```kex
Integer.parse("42")     # => Ok(42)
Integer.parse("-7")     # => Ok(-7)
Integer.parse("4x")     # => Error(ParseError { ... rest: "x" ... })
```

_Reading a setting with a fallback_

```kex
let port = Integer.parse(raw).or(8080)
```

_Reporting why the input was rejected_

```kex
match Integer.parse(raw) do
  Ok(n)    => IO.printLine("port ${n}")
  Error(e) => IO.printError("bad port: ${e.message}")
end
```

### `parsePrefix`

```kex
parsePrefix(s: String) -> (Integer, String)?
```

Parses an integer from the front of the string and returns it together with whatever text was left over.

This is the building block for hand-written scanners: parse a number, keep going from the remainder. Answers `None` when the string does not begin with a number at all.

**Parameters**

  - `s` — the text to parse from

**Returns**: the value and the unconsumed remainder

**Examples**

```kex
Integer.parsePrefix("42abc")   # => Just((42, "abc"))
Integer.parsePrefix("abc")     # => None
```

_Reading a leading count off a line_

```kex
match Integer.parsePrefix("3 items") do
  Just(pair) => do
    let (count, rest) = pair
    IO.printLine("${count} of${rest}")   # prints: 3 of items
  end
  None => IO.printError("no leading count")
end
```

## module `Float`

Reading floating-point numbers out of text.

### `parse`

```kex
parse(s: String) -> Result<Float, ParseError>
```

Parses the whole string as a float.

The string must be entirely consumed; anything left over makes it an `Error` carrying a `ParseError`.

**Parameters**

  - `s` — the text to parse

**Returns**: the float, or a described failure

**Examples**

```kex
Float.parse("3.5")     # => Ok(3.5)
Float.parse("-0.25")   # => Ok(-0.25)
Float.parse("3.5m")    # => Error(ParseError { ... rest: "m" ... })
```

_Averaging a column of text values_

```kex
rows.map { |r| Float.parse(r).or(0.0) }.sum / rows.count.to(Float).or(1.0)
```

### `parsePrefix`

```kex
parsePrefix(s: String) -> (Float, String)?
```

Parses a float from the front of the string and returns it together with the unconsumed remainder. Answers `None` when the string does not begin with a number.

**Parameters**

  - `s` — the text to parse from

**Returns**: the value and the remainder

**Examples**

```kex
Float.parsePrefix("3.5rest")   # => Just((3.5, "rest"))
Float.parsePrefix("rest")      # => None
```

_Splitting a measurement from its unit_

```kex
Float.parsePrefix("12.5kg")   # => Just((12.5, "kg"))
```

### `MAX` (constant)

```kex
MAX : Float
```

The largest finite `Float`.

A Kex `Float` is always finite, so there is no infinity to start from: this is the bound to use instead, say as the first "smallest so far".

**Examples**

```kex
let smallest = readings.reduce(Float.MAX) { |low, x| x < low then x else low }
```



### `MIN` (constant)

```kex
MIN : Float
```

The most negative finite `Float`: `-Float.MAX`. Not the smallest positive one, which some languages call MIN.



## module `Float32`

The bounds of the sized numeric types: `Int8.MAX`, `UInt64.MAX`, `Float32.MIN` and so on. `Integer` has none: it is arbitrary-precision. For a float type, `MIN` is the most negative finite value, not the smallest positive one.

The range of a 32-bit float.

### `MAX` (constant)

```kex
MAX : Float32
```

The largest Float32: 3.4028234663852886e38.



### `MIN` (constant)

```kex
MIN : Float32
```

The most negative finite Float32: -3.4028234663852886e38.



## module `Float64`

The range of a 64-bit float, the same as a `Float`.

### `MAX` (constant)

```kex
MAX : Float64
```

The largest Float64: 1.7976931348623157e308.



### `MIN` (constant)

```kex
MIN : Float64
```

The most negative finite Float64: -1.7976931348623157e308.



## module `Int8`

The range of a signed 8-bit integer.

### `MAX` (constant)

```kex
MAX : Int8
```

The largest Int8: 127.



### `MIN` (constant)

```kex
MIN : Int8
```

The smallest Int8: -128.



## module `Int16`

The range of a signed 16-bit integer.

### `MAX` (constant)

```kex
MAX : Int16
```

The largest Int16: 32767.



### `MIN` (constant)

```kex
MIN : Int16
```

The smallest Int16: -32768.



## module `Int32`

The range of a signed 32-bit integer.

### `MAX` (constant)

```kex
MAX : Int32
```

The largest Int32: 2147483647.



### `MIN` (constant)

```kex
MIN : Int32
```

The smallest Int32: -2147483648.



## module `Int64`

The range of a signed 64-bit integer.

### `MAX` (constant)

```kex
MAX : Int64
```

The largest Int64: 9223372036854775807.



### `MIN` (constant)

```kex
MIN : Int64
```

The smallest Int64: -9223372036854775808.



## module `UInt8`

The range of an unsigned 8-bit integer: `UInt8` is another name for `Byte`.

### `MAX` (constant)

```kex
MAX : UInt8
```

The largest UInt8: 255.



### `MIN` (constant)

```kex
MIN : UInt8
```

The smallest UInt8: 0.



## module `UInt16`

The range of an unsigned 16-bit integer.

### `MAX` (constant)

```kex
MAX : UInt16
```

The largest UInt16: 65535.



### `MIN` (constant)

```kex
MIN : UInt16
```

The smallest UInt16: 0.



## module `UInt32`

The range of an unsigned 32-bit integer.

### `MAX` (constant)

```kex
MAX : UInt32
```

The largest UInt32: 4294967295.



### `MIN` (constant)

```kex
MIN : UInt32
```

The smallest UInt32: 0.



## module `UInt64`

The range of an unsigned 64-bit integer.

### `MAX` (constant)

```kex
MAX : UInt64
```

The largest UInt64: 18446744073709551615.



### `MIN` (constant)

```kex
MIN : UInt64
```

The smallest UInt64: 0.



## module `Byte`

The range of a `Byte`, Kex's unsigned 8-bit integer (also called `UInt8`).

### `MAX` (constant)

```kex
MAX : Byte
```

The largest Byte: 255.



### `MIN` (constant)

```kex
MIN : Byte
```

The smallest Byte: 0.



## module `Number`

Reading a number out of text without deciding in advance which half of the numeric tower it belongs to.

### `parse`

```kex
parse(s: String) -> Result<Number, ParseError>
```

Parses the whole string as an `Integer` or a `Float`, whichever the text describes.

Use it when the input's shape is not known ahead of time: a config value, a CSV column that may hold either.

**Parameters**

  - `s` — the text to parse

**Returns**: the number, or a described failure

**Examples**

```kex
Number.parse("42")     # => Ok(42)
Number.parse("3.5")    # => Ok(3.5)
Number.parse("x")      # => Error(ParseError { ... })
```
