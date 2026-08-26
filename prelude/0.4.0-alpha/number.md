---
package: prelude
version: "0.4.0-alpha"
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

## make `Integer`

Whole numbers, of arbitrary size.

`Integer` has no width limit — factorials and cryptographic moduli are ordinary values, not a special big-number type you have to opt into.

`Integer` and `Float` are one numeric tower: they compare and order across the boundary, so `0 == 0.0` is `true` and `[1, 2.5, 3].sort` works. What differs is the arithmetic. `/` on two integers is integer division, and `sqrt` answers a `Float` because a square root generally is one.

```kex
7 / 2          # => 3      (integer division)
7.0 / 2.0      # => 3.5
16.sqrt        # => 4.0    (a Float, even from an Integer)
(-7).modulo(3) # => 2      (mathematical modulo, not C remainder)
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

## make `Float`

Double-precision floating-point numbers.

A Kex `Float` is always finite. An operation that would produce `NaN` or `Infinity` raises instead — the same rule the BEAM enforces, where those two values cannot exist at all. So a `Float` you are holding is always a real number, and there is no `nan?` to check for.

`Float` and `Integer` compare and order across the boundary; see `Integer` for the rest of the numeric tower.

```kex
3.7.floor      # => 3
3.7.round      # => 4
(-3.7).toInteger  # => -3   (truncates toward zero)
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

## module `Integer`

Reading integers out of text.

Use `parse` when a failure needs explaining and `"42".to(Integer)` when it does not — `to` answers a plain `Optional`, `parse` answers a `Result` carrying a `ParseError` that says where it stopped and what it had read so far.

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


## module `Number`

Reading a number out of text without deciding in advance which half of the numeric tower it belongs to.

## function `parse`

Parses the whole string as an `Integer` or a `Float`, whichever the text describes.

Use it when the input's shape is not known ahead of time — a config value, a CSV column that may hold either.


```kex
parse(s) : String -> Result<Number, ParseError>
```

