---
package: prelude
version: "0.4.0-rc.4-dev"
source: number.kex
title: NumberFormat
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
  - { kind: record, name: "NumberFormat" }
  - { kind: module, name: "NumberFormat" }
  - { kind: make, name: "Number" }
---

# NumberFormat

## type `Integer`

Implements [`Monoid`](algebra.md#trait-monoid), [`Group`](algebra.md#trait-group), [`Blankable`](blankable.md#trait-blankable), [`Discrete`](range.md#trait-discrete), [`Truthyable`](truthyable.md#trait-truthyable).

Whole numbers, of arbitrary size.

`Integer` has no width limit, so a factorial or a cryptographic modulus is an `Integer` like any other.

`Integer` and `Float` compare and sort together: `0 == 0.0` is `true` and `[1, 2.5, 3].sort` works. Their arithmetic differs. `/` on two integers is integer division, and `sqrt` always returns a `Float`.

```kex
7 / 2          # => 3      (integer division)
7.0 / 2.0      # => 3.5
16.sqrt        # => 4.0    (a Float, even from an Integer)
(-7).modulo(3) # => 2      (mathematical modulo, not C remainder)
```

### `even?`

```kex
even? -> Bool
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
odd? -> Bool
```

Returns `true` when the integer is not divisible by two. The opposite of `even?`.

**Returns**: `true` for an odd integer

**Examples**

```kex
3.odd?   # => true
4.odd?   # => false
```

### `dividesBy?`

```kex
dividesBy?(n: Integer) -> Bool
```

Returns `true` when the integer divides evenly by `n`.

Zero is divisible by every non-zero integer. Nothing is divisible by zero, not even zero.

**Parameters**

  - `n` — the divisor

**Returns**: `true` when the integer divides evenly by `n`

**Examples**

```kex
10.dividesBy?(5)   # => true
10.dividesBy?(3)   # => false
5.dividesBy?(0)    # => false
```

_FizzBuzz without spelling out the remainder_

```kex
if i.dividesBy?(15)
  IO.printLine("FizzBuzz")
elif i.dividesBy?(3)
  IO.printLine("Fizz")
elif i.dividesBy?(5)
  IO.printLine("Buzz")
end
```

### `abs`

```kex
abs -> Integer
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
sqrt -> Float
```

Returns the square root as a `Float`.

The result is a `Float` even when the root is exact. Round or floor it to get an integer back.

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

The result takes the sign of `n`, unlike the C-style remainder, so `(-1).modulo(3)` is `2`. That makes it the one to use for wrapping an index that may have gone negative.

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

When the loop is about the numbers themselves, `(1..n).each` often reads better.

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

### `downTo`

```kex
downTo(last: Integer) -> Range<Integer>
```

Returns the range from this integer down to `last`, both included, counting by -1. It is empty when `last` is larger.

**Parameters**

  - `last` — the last element

**Returns**: the descending range

**Examples**

```kex
10.downTo(7).items   # => [10, 9, 8, 7]
1.downTo(3).items    # => []
```

_Counting down_

```kex
3.downTo(1).each { |n| IO.printLine(n) }   # prints 3, 2, 1
```

### `floor`

```kex
floor -> Integer
```

Returns the integer unchanged, so code that floors a `Number` works on integers too.

**Returns**: the same integer

**Examples**

```kex
7.floor   # => 7
```

### `ceil`

```kex
ceil -> Integer
```

Returns the integer unchanged. The `Integer` counterpart of `Float.ceil`.

**Returns**: the same integer

**Examples**

```kex
7.ceil   # => 7
```

### `round`

```kex
round -> Integer
```

Returns the integer unchanged. The `Integer` counterpart of `Float.round`.

**Returns**: the same integer

**Examples**

```kex
7.round   # => 7
```

### `pow`

```kex
pow(exponent: Integer) -> Integer
```

Raises the integer to an integer power, exactly. `2.pow(100)` is the whole 31-digit number; `Math.pow` returns a `Float`.

A negative exponent gives the reciprocal truncated toward zero, as `/` does: `0` for any base but `1` and `-1`.

**Parameters**

  - `exponent` — the power to raise to

**Returns**: `this` multiplied by itself `exponent` times

**Examples**

```kex
2.pow(10)    # => 1024
2.pow(100)   # => 1267650600228229401496703205376
(-3).pow(3)  # => -27
```

### `div`

```kex
div(n: Integer) -> Integer
```

Divides and rounds toward negative infinity, the quotient that goes with `modulo`. Plain `/` truncates toward zero, so the two differ when the signs differ. Ruby's `/` on integers behaves like this one.

**Parameters**

  - `n` — the divisor, non-zero

**Returns**: the floored quotient

**Examples**

```kex
7.div(2)      # => 3
(-7).div(2)   # => -4   (-7 / 2 is -3)
```

### `divmod`

```kex
divmod(n: Integer) -> (Integer, Integer)
```

Returns the floored quotient and the `modulo` remainder together, so +q * n + r == this+ always holds.

**Parameters**

  - `n` — the divisor, non-zero

**Returns**: `(this.div(n), this.modulo(n))`

**Examples**

```kex
7.divmod(2)      # => (3, 1)
(-7).divmod(2)   # => (-4, 1)
```

### `gcd`

```kex
gcd(n: Integer) -> Integer
```

Returns the greatest common divisor, never negative. `0.gcd(0)` is `0`.

**Parameters**

  - `n` — the other integer

**Returns**: the largest integer dividing both

**Examples**

```kex
12.gcd(18)    # => 6
(-4).gcd(6)   # => 2
```

### `lcm`

```kex
lcm(n: Integer) -> Integer
```

Returns the least common multiple, never negative. It is `0` when either integer is zero.

**Parameters**

  - `n` — the other integer

**Returns**: the smallest positive integer both divide

**Examples**

```kex
4.lcm(6)   # => 12
```

### `digits`

```kex
digits -> [Integer]
```

Returns the decimal digits of the integer's magnitude, least significant first, as Ruby's `digits` does. `.reverse` gives reading order.

**Returns**: the digits, ones place first

**Examples**

```kex
1234.digits           # => [4, 3, 2, 1]
0.digits              # => [0]
1234.digits.reverse   # => [1, 2, 3, 4]
```

### `zero?`

```kex
zero? -> Bool
```

Returns `true` for zero.

**Examples**

```kex
0.zero?   # => true
```

### `positive?`

```kex
positive? -> Bool
```

Returns `true` when the number is greater than zero.

**Examples**

```kex
0.positive?   # => false
```

### `negative?`

```kex
negative? -> Bool
```

Returns `true` when the number is less than zero.

**Examples**

```kex
0.negative?   # => false
```

### `countTo`

```kex
countTo(limit, block)
```

`times` when compiled: `block` applied to each index from this one up to `limit`, a recursion the specialize-blocks pass copies into the caller with the block in place.

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### Defined in other modules

  - [Algebra](algebra.md#make-integer): [`identity`](algebra.md#integer-identity), [`combine`](algebra.md#integer-combine), [`inverse`](algebra.md#integer-inverse)
  - [Blankable](blankable.md#make-integer): [`blank?`](blankable.md#integer-blank?)
  - [Period](period.md#make-integer): [`month`](period.md#integer-month), [`year`](period.md#integer-year)
  - [Truthyable](truthyable.md#make-integer): [`truthy?`](truthyable.md#integer-truthy?)
  - [Units](units.md#make-integer): [`nanosecond`](units.md#integer-nanosecond), [`microsecond`](units.md#integer-microsecond), [`millisecond`](units.md#integer-millisecond), [`second`](units.md#integer-second), [`minute`](units.md#integer-minute), [`hour`](units.md#integer-hour), [`day`](units.md#integer-day), [`week`](units.md#integer-week), [`timeMeasure`](units.md#integer-timemeasure)
  - [Units.Data](units/data.md#make-integer): [`<`](units/data.md#integer-op-lt), [`>`](units/data.md#integer-op-gt), [`<=`](units/data.md#integer-op-lt-eq), [`>=`](units/data.md#integer-op-gt-eq)

## type `Float`

Implements [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

Double-precision floating-point numbers.

A Kex `Float` is always finite. An operation that would produce `NaN` or `Infinity` raises, so there is no `nan?` to check for.

`Float` and `Integer` compare and sort together; see `Integer`.

```kex
3.7.floor      # => 3
3.7.round      # => 4
(-3.7).toInteger  # => -3   (truncates toward zero)
```

### `abs`

```kex
abs -> Float
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
sqrt -> Float
```

Returns the square root. Raises for a negative float.

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

```kex
0.75.in?(0.0..1.0)   # => true
1.5.in?(0.0..1.0)    # => false
```

### `floor`

```kex
floor -> Integer
```

Returns the largest integer not greater than the float. It rounds toward negative infinity, so for negative values it differs from `toInteger`.

**Returns**: the floor

**Examples**

```kex
3.7.floor      # => 3
3.2.floor      # => 3
(-3.2).floor   # => -4
```

### `ceil`

```kex
ceil -> Integer
```

Returns the smallest integer not less than the float.

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
round -> Integer
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
toInteger -> Integer
```

Drops the fractional part and returns an `Integer`. For negative values this differs from `floor`.

**Returns**: the truncated value

**Examples**

```kex
3.7.toInteger      # => 3
(-3.7).toInteger   # => -3   (floor would give -4)
```

### `zero?`

```kex
zero? -> Bool
```

Returns `true` for zero.

**Examples**

```kex
2.5.zero?   # => false
```

### `positive?`

```kex
positive? -> Bool
```

Returns `true` when the number is greater than zero.

**Examples**

```kex
2.5.positive?   # => true
```

### `negative?`

```kex
negative? -> Bool
```

Returns `true` when the number is less than zero.

**Examples**

```kex
2.5.negative?   # => false
```

### Defined in other modules

  - [Blankable](blankable.md#make-float): [`blank?`](blankable.md#float-blank?)
  - [Truthyable](truthyable.md#make-float): [`truthy?`](truthyable.md#float-truthy?)
  - [Units](units.md#make-float): [`nanosecond`](units.md#float-nanosecond), [`microsecond`](units.md#float-microsecond), [`millisecond`](units.md#float-millisecond), [`second`](units.md#float-second), [`minute`](units.md#float-minute), [`hour`](units.md#float-hour), [`day`](units.md#float-day), [`week`](units.md#float-week), [`timeMeasure`](units.md#float-timemeasure)

## module `Integer`

Reading integers out of text.

`"42".to(Integer)` returns an `Optional`. Use `parse` when the caller needs to know why the text is not a number: its `ParseError` has one case per reason.

### `parse`

```kex
parse(text: String, radix: Integer = …, culture: Culture = …) -> Result<Integer, ParseError<Integer>>
```

Parses `text` as an integer: an optional sign, then digits in `radix`. Group separators must follow `culture`'s grouping; digits with no separator read in every culture.

A number followed by other text is a `Trailing` error carrying the number and the rest, so matching on it reads a number off the front of `"10 USD"`.

**Parameters**

  - `text` — the text to read
  - `radix` — the base, 2 to 36; digits above 9 in either case
  - `culture` — whose group separator to accept

**Returns**: the integer, or why not

**Examples**

```kex
Integer.parse("42")                 # => Ok(42)
Integer.parse("ff", radix: 16)      # => Ok(255)
Integer.parse("10 USD")             # => Error(Trailing(10, " USD"))
Integer.parse("abc")                # => Error(NoDigits(0))
```

_In a culture_

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Integer.parse("1 500", culture: hu)   # => Ok(1500)
Integer.parse("1500", culture: hu)    # => Ok(1500)
Integer.parse("1 50", culture: hu)    # => Error(BadGrouping(2))
```

_Reading a setting with a fallback_

```kex
let port = Integer.parse(raw).or(8080)
```

## module `Float`

Reading floating-point numbers out of text.

### `parse`

```kex
parse(text: String, culture: Culture = …) -> Result<Float, ParseError<Float>>
```

Parses `text` as a float: an optional sign, digits (grouped by `culture`'s rules if separators appear), an optional decimal part after the culture's decimal separator, and an optional exponent (`e3`, `E-2`). A whole number parses too: `"5"` gives `5.0`.

**Parameters**

  - `text` — the text to read
  - `culture` — whose decimal and group separators to accept

**Returns**: the float, or why not

**Examples**

```kex
Float.parse("3.5")       # => Ok(3.5)
Float.parse("1e3")       # => Ok(1000.0)
Float.parse("12.5kg")    # => Error(Trailing(12.5, "kg"))
Float.parse("1e999")     # => Error(OutOfRange)
```

_In a culture_

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Float.parse("1,44", culture: hu)   # => Ok(1.44)
```

### `MAX` (constant)

```kex
MAX : Float
```

The largest finite `Float`.

Kex has no float infinity, so this is the starting value for a running minimum.

**Examples**

```kex
let smallest = readings.reduce(Float.MAX) { |low, x| x < low then x else low }
```



### `MIN` (constant)

```kex
MIN : Float
```

The most negative finite `Float`, `-Float.MAX`. Some languages use MIN for the smallest positive float; Kex does not.



## module `Float32`

The range of a 32-bit float. As for every sized float type, `MIN` is the most negative finite value.

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

Reading a number from text that may hold either an integer or a float, and writing numbers by a digit pattern.

### `parse`

```kex
parse(text: String, culture: Culture = …) -> Result<Number, ParseError<Number>>
```

Parses `text` as an `Integer` or a `Float`, whichever it describes. A fraction or an exponent makes it a `Float`; otherwise the grammar is `Float.parse`'s.

Use it for input such as a config value or a CSV column that may hold either kind.

**Parameters**

  - `text` — the text to read
  - `culture` — whose decimal and group separators to accept

**Returns**: the number, or why not

**Examples**

```kex
Number.parse("42")     # => Ok(42)
Number.parse("3.5")    # => Ok(3.5)
Number.parse("x")      # => Error(NoDigits(0))
```

_In a culture_

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Number.parse("1 500,5", culture: hu)   # => Ok(1500.5)
Number.parse("1 500", culture: hu)     # => Ok(1500)
```

### `format`

```kex
format(parts: [String], values: [Any]) -> NumberFormat
```

Builds a `NumberFormat` from a digit pattern, for `to(String, format)`.

The pattern is checked during compilation, so a bad pattern is a build error.

- `0` is a required digit: `000` pads the integer part to three digits,
  and `.00` always writes two decimals.
- `#` is an optional digit: `#.##` writes at most two decimals and drops
  trailing zeros. Optional digits come before required ones in the
  integer part (`#0`) and after them in the decimals (`.0#`).
- `.` starts the decimals. The value is rounded to as many decimals as
  the pattern allows, with ties away from zero.

The integer part always has at least one digit, so `#.00` writes `0.50`, never `.50`. A value that rounds to zero has no minus sign.

**Parameters**

  - `parts` — the literal pieces of the tagged literal
  - `values` — the interpolated values

**Returns**: the format

**Examples**

```kex
1.5.to(String, Number.format`#.00`)   # => Just("1.50")
1.5.to(String, Number.format`#.##`)   # => Just("1.5")
2.0.to(String, Number.format`#.##`)   # => Just("2")
7.to(String, Number.format`000`)      # => Just("007")
```

### `validateFormat`

```kex
validateFormat(source: String) -> [TaggedValidation.Issue]
```

Checks a `Number.format` pattern during compilation and reports the first character that does not fit.

**Parameters**

  - `source` — the pattern

**Returns**: the problem found, if any

## record `NumberFormat`

A digit pattern such as `"#.00"` for `to(String, format)`; the patterns are described at `Number.format`. Build one with `Number.format`, which checks the pattern during compilation, or with `NumberFormat.parse` for a pattern known only at run time.

**Fields**

  - `pattern` : [String](string.md#make-string)



## module `NumberFormat`

### `parse`

```kex
parse(pattern: String) -> Result<NumberFormat, PatternError>
```

Checks a digit pattern known only at run time and returns it as a `NumberFormat`. `Number.format` describes the patterns.

**Parameters**

  - `pattern` — the pattern

**Returns**: the format, or where the pattern goes wrong

**Examples**

```kex
NumberFormat.parse("#.00")   # => Ok(NumberFormat { pattern: "#.00" })
NumberFormat.parse("#.#0")   # => Error(PatternError { message: "...", position: 3 })
```

### `layout`

```kex
layout(pattern: String) -> Result<(Integer, Integer, Integer), (Integer, String)>
```

Returns what a pattern writes: the fewest integer digits, the fewest decimals and the most decimals. For a bad pattern it returns the index of the first problem and a message.

**Parameters**

  - `pattern` — the pattern

**Returns**: the layout, or the problem

**Examples**

```kex
NumberFormat.layout("#0.0##")   # => Ok((1, 1, 3))
```

## type `Number`

Implements [`Comparable`](comparable.md#trait-comparable).

### `to`

```kex
to(String: Type, format: NumberFormat, culture: Culture) -> String?
```

Writes the number by a digit pattern, described at `Number.format`.

**Parameters**

  - `String` — the target type
  - `format` — the pattern

**Returns**: the text, or `None` when the pattern is not valid

**Examples**

```kex
1234.5.to(String, Number.format`#.00`)    # => Just("1234.50")
(-0.001).to(String, Number.format`#.#`)   # => Just("0")
42.to(String, Number.format`0000.0`)      # => Just("0042.0")
```

### `leadingZeros`

```kex
leadingZeros(text: String, width: Integer) -> String
```

`text` with leading zeros up to `width` characters.

### `trailingZeros`

```kex
trailingZeros(text: String, width: Integer) -> String
```

`text` with exactly `width` characters if it is shorter, or with its trailing zeros dropped down to `width` characters if it is longer.

### From [`Comparable`](comparable.md#trait-comparable)

  - [`max`](comparable.md#comparable-max) — Returns the larger of this value and `other`, or this value when they are equal.
  - [`min`](comparable.md#comparable-min) — Returns the smaller of this value and `other`, or this value when they are equal.
  - [`clamp`](comparable.md#comparable-clamp) — Returns this value limited to `low`..`high`: `low` when it is below, `high` when it is above, and the value itself otherwise.
  - [`<`](comparable.md#comparable-op-lt) — Returns `true` when this value orders before `other`.
  - [`>`](comparable.md#comparable-op-gt) — Returns `true` when this value orders after `other`.
  - [`<=`](comparable.md#comparable-op-lt-eq) — Returns `true` when this value orders before `other` or equal to it.
  - [`>=`](comparable.md#comparable-op-gt-eq) — Returns `true` when this value orders after `other` or equal to it.

### Defined in other modules

  - [Comparable](comparable.md#make-number): [`compare`](comparable.md#number-compare)
