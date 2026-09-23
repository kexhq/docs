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

## make `Integer`

Whole numbers, of arbitrary size.

`Integer` has no width limit: factorials and cryptographic moduli are ordinary values, not a special big-number type you have to opt into.

`Integer` and `Float` are one numeric tower: they compare and order across the boundary, so `0 == 0.0` is `true` and `[1, 2.5, 3].sort` works. What differs is the arithmetic. `/` on two integers is integer division, and `sqrt` answers a `Float` because a square root generally is one.

```kex
7 / 2          # => 3      (integer division)
7.0 / 2.0      # => 3.5
16.sqrt        # => 4.0    (a Float, even from an Integer)
(-7).modulo(3) # => 2      (mathematical modulo, not C remainder)
```


#### `even?`

Returns `true` when the integer is divisible by two. Zero is even, and negative numbers follow the same rule.

```kex
even? : Bool
```

**Returns**: `Bool` — `true` for an even integer

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

#### `odd?`

Returns `true` when the integer is not divisible by two. The opposite of `even?`.

```kex
odd? : Bool
```

**Returns**: `Bool` — `true` for an odd integer

**Examples**

```kex
3.odd?   # => true
4.odd?   # => false
```

#### `abs`

Returns the magnitude of the integer, discarding its sign.

```kex
abs : Integer
```

**Returns**: `Integer` — the absolute value

**Examples**

```kex
(-5).abs   # => 5
5.abs      # => 5
```
_Distance between two positions_

```kex
(a - b).abs
```

#### `sqrt`

Returns the square root as a `Float`.

The result is a `Float` even when the root is exact, because in general it is not. Round or floor it when you need an integer back.

```kex
sqrt : Float
```

**Returns**: `Float` — the square root

**Examples**

```kex
16.sqrt          # => 4.0
2.sqrt           # => 1.4142135623730951
16.sqrt.round    # => 4
```

#### `modulo`

Returns `this` modulo `n`.

The result takes the sign of `n`, which is mathematical modulo rather than the C-style remainder other languages give. That is what makes it safe for wrapping an index that may have gone negative.

```kex
modulo(n) : Integer -> Integer
```

**Returns**: `Integer` — the remainder, with the sign of `n`

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

#### `in?`

Returns `true` when the integer falls inside `range`, endpoints included.

```kex
in?(range) : Range<Integer> -> Bool
```

**Returns**: `Bool` — `true` when the integer is in range

**Examples**

```kex
5.in?(1..10)    # => true
11.in?(1..10)   # => false
```
_Validating a port number_

```kex
port.in?(1..65535)
```

#### `times`

Calls `f` exactly `this` times, passing the 0-based iteration index.

This is the counting loop. When you want the numbers themselves rather than a count of repetitions, `(1..n).items.each` often reads better.

```kex
times(block) : (Integer -> Void) -> Void
times(block) : Block<Void> -> Void
```

**Returns**: `Void`

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

#### `floor`

Returns the integer unchanged. Present so that code written against `Number` works whichever half of the tower it is handed.

```kex
floor : Integer
```

**Returns**: `Integer` — the same integer

**Examples**

```kex
7.floor   # => 7
```

#### `ceil`

Returns the integer unchanged. The `Integer` counterpart of `Float.ceil`.

```kex
ceil : Integer
```

**Returns**: `Integer` — the same integer

**Examples**

```kex
7.ceil   # => 7
```

#### `round`

Returns the integer unchanged. The `Integer` counterpart of `Float.round`.

```kex
round : Integer
```

**Returns**: `Integer` — the same integer

**Examples**

```kex
7.round   # => 7
```

## make `Float`

Double-precision floating-point numbers.

A Kex `Float` is always finite. An operation that would produce `NaN` or `Infinity` raises instead: the same rule the BEAM enforces, where those two values cannot exist at all. So a `Float` you are holding is always a real number, and there is no `nan?` to check for.

`Float` and `Integer` compare and order across the boundary; see `Integer` for the rest of the numeric tower.

```kex
3.7.floor      # => 3
3.7.round      # => 4
(-3.7).toInteger  # => -3   (truncates toward zero)
```


#### `abs`

Returns the magnitude of the float, discarding its sign.

```kex
abs : Float
```

**Returns**: `Float` — the absolute value

**Examples**

```kex
(-3.14).abs   # => 3.14
3.14.abs      # => 3.14
```
_An approximate-equality test_

```kex
(a - b).abs < 0.0001
```

#### `sqrt`

Returns the square root. Raises for a negative receiver, which has no real root.

```kex
sqrt : Float
```

**Returns**: `Float` — the square root

**Examples**

```kex
25.0.sqrt   # => 5.0
2.0.sqrt    # => 1.4142135623730951
```

#### `in?`

Returns `true` when the float falls inside `range`, endpoints included.

```kex
in?(range) : Range<Float> -> Bool
```

**Returns**: `Bool` — `true` when the float is in range

**Examples**

_Comparing directly is usually clearer for floats_

```kex
let ratio = 0.75
ratio >= 0.0 && ratio <= 1.0   # => true
```

#### `floor`

Returns the largest integer that is not greater than the float: it always rounds toward negative infinity, which is what separates it from `toInteger` for negative values.

```kex
floor : Integer
```

**Returns**: `Integer` — the floor

**Examples**

```kex
3.7.floor      # => 3
3.2.floor      # => 3
(-3.2).floor   # => -4
```

#### `ceil`

Returns the smallest integer that is not less than the float: it always rounds toward positive infinity.

```kex
ceil : Integer
```

**Returns**: `Integer` — the ceiling

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

#### `round`

Returns the nearest integer, with halves rounding away from zero.

```kex
round : Integer
```

**Returns**: `Integer` — the rounded value

**Examples**

```kex
3.2.round    # => 3
3.5.round    # => 4
3.7.round    # => 4
```

#### `toInteger`

Truncates toward zero and returns the result as an `Integer`: it drops the fractional part rather than rounding, so it differs from both `floor` and `round` for negative values.

```kex
toInteger : Integer
```

**Returns**: `Integer` — the truncated value

**Examples**

```kex
3.7.toInteger      # => 3
(-3.7).toInteger   # => -3   (floor would give -4)
```

## module `Integer`

Reading integers out of text.

Use `parse` when a failure needs explaining and `"42".to(Integer)` when it does not: `to` answers a plain `Optional`, `parse` answers a `Result` carrying a `ParseError` that says where it stopped and what it had read so far.

## function `parse`

Parses the whole string as a base-10 integer.

The string must be entirely consumed: leading or trailing characters make it an `Error`, with a `ParseError` describing where parsing stopped. Use `parsePrefix` when a trailing remainder is expected.


```kex
parse(s) : String -> Result<Integer, ParseError>
parse(s) : String -> Integer -> Result<Integer, ParseError>
```


## function `parsePrefix`

Parses an integer from the front of the string and returns it together with whatever text was left over.

This is the building block for hand-written scanners: parse a number, keep going from the remainder. Answers `None` when the string does not begin with a number at all.


```kex
parsePrefix(s) : String -> (Integer, String)?
```


## module `Float`

Reading floating-point numbers out of text.

## function `parse`

Parses the whole string as a float.

The string must be entirely consumed; anything left over makes it an `Error` carrying a `ParseError`.


```kex
parse(s) : String -> Result<Float, ParseError>
```


## function `parsePrefix`

Parses a float from the front of the string and returns it together with the unconsumed remainder. Answers `None` when the string does not begin with a number.


```kex
parsePrefix(s) : String -> (Float, String)?
```


## constant `MAX`

The largest finite `Float`.

A Kex `Float` is always finite, so there is no infinity to start from: this is the bound to use instead, say as the first "smallest so far".



## constant `MIN`

The most negative finite `Float`: `-Float.MAX`. Not the smallest positive one, which some languages call MIN.



## module `Float32`

The bounds of the sized numeric types: `Int8.MAX`, `UInt64.MAX`, `Float32.MIN` and so on. `Integer` has none: it is arbitrary-precision. For a float type, `MIN` is the most negative finite value, not the smallest positive one.

The range of a 32-bit float.

## constant `MAX`

The largest Float32: 3.4028234663852886e38.



## constant `MIN`

The most negative finite Float32: -3.4028234663852886e38.



## module `Float64`

The range of a 64-bit float, the same as a `Float`.

## constant `MAX`

The largest Float64: 1.7976931348623157e308.



## constant `MIN`

The most negative finite Float64: -1.7976931348623157e308.



## module `Int8`

The range of a signed 8-bit integer.

## constant `MAX`

The largest Int8: 127.



## constant `MIN`

The smallest Int8: -128.



## module `Int16`

The range of a signed 16-bit integer.

## constant `MAX`

The largest Int16: 32767.



## constant `MIN`

The smallest Int16: -32768.



## module `Int32`

The range of a signed 32-bit integer.

## constant `MAX`

The largest Int32: 2147483647.



## constant `MIN`

The smallest Int32: -2147483648.



## module `Int64`

The range of a signed 64-bit integer.

## constant `MAX`

The largest Int64: 9223372036854775807.



## constant `MIN`

The smallest Int64: -9223372036854775808.



## module `UInt8`

The range of an unsigned 8-bit integer: `UInt8` is another name for `Byte`.

## constant `MAX`

The largest UInt8: 255.



## constant `MIN`

The smallest UInt8: 0.



## module `UInt16`

The range of an unsigned 16-bit integer.

## constant `MAX`

The largest UInt16: 65535.



## constant `MIN`

The smallest UInt16: 0.



## module `UInt32`

The range of an unsigned 32-bit integer.

## constant `MAX`

The largest UInt32: 4294967295.



## constant `MIN`

The smallest UInt32: 0.



## module `UInt64`

The range of an unsigned 64-bit integer.

## constant `MAX`

The largest UInt64: 18446744073709551615.



## constant `MIN`

The smallest UInt64: 0.



## module `Byte`

The range of a `Byte`, Kex's unsigned 8-bit integer (also called `UInt8`).

## constant `MAX`

The largest Byte: 255.



## constant `MIN`

The smallest Byte: 0.



## module `Number`

Reading a number out of text without deciding in advance which half of the numeric tower it belongs to.

## function `parse`

Parses the whole string as an `Integer` or a `Float`, whichever the text describes.

Use it when the input's shape is not known ahead of time: a config value, a CSV column that may hold either.


```kex
parse(s) : String -> Result<Number, ParseError>
```

