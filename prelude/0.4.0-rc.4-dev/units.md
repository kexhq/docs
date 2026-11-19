---
package: prelude
version: "0.4.0-rc.4-dev"
source: units.kex
title: Units
entities:
  - { kind: trait, name: "Unit" }
  - { kind: function, name: "measureKind" }
  - { kind: function, name: "measureSymbol" }
  - { kind: function, name: "measureFactor" }
  - { kind: record, name: "UnitDefinition" }
  - { kind: make, name: "UnitDefinition" }
  - { kind: module, name: "Quantity" }
  - { kind: record, name: "Measure" }
  - { kind: type, name: "Duration" }
  - { kind: type, name: "TimeUnit" }
  - { kind: make, name: "TimeUnit" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: make, name: "Measure<D>" }
  - { kind: module, name: "Units" }
---

# Units

Numbers that carry a unit.

Writing `5.second` or `90.minute` gives you a `Measure`: a number, the unit it was written in, and the same quantity in that dimension's base unit. Adding, subtracting and converting all go through the canonical value, so the arithmetic is right regardless of which units the operands were written in. The dimension is part of the type (`Measure<Quantity.Time>`), so mixing dimensions does not type-check rather than giving a silently wrong number.

```kex
5.second.to(String)                     # => Just("5.0 s")
1.5.hour.to(String)                  # => Just("1.5 h")
(1.hour + 30.minute).to(String)        # => Just("1.5 h")
90.minute.convert(Hour)              # => Ok(1.5 h)
```

The time units (`nanosecond` through `week`) are in the prelude. Other dimensions live in opt-in modules under `Units`, and every one of them measures against the same machinery here.

A `Measure` is a measurement, not an elapsed span: `5.second` describes a quantity, while `Duration` is what `Time` and `Date` use for a span between two moments.

## trait `Unit`

The trait a unit implements: how it converts to its dimension's base unit, which dimension that is, and how it is written.

Implemented by [`UnitDefinition`](#make-unitdefinition), [`TimeUnit`](#make-timeunit), [`DataUnit`](units/data.md#make-dataunit), [`UnitDefinition`](units/data.md#make-unitdefinition), [`SIPrefix`](units/si.md#make-siprefix), [`SIUnit`](units/si.md#make-siunit), [`UnitDefinition`](units/si.md#make-unitdefinition).

### Required functions

#### `factor`

```kex
factor -> Float
```

How many base units one of this unit is: `60.0` for a minute, whose base unit is the second.

**Returns**: the conversion factor

**Examples**

```kex
Minute.factor   # => 60.0
```

#### `kind`

```kex
kind -> Atom
```

Which dimension this unit measures, as an atom. Only measures of the same kind can be added or converted between.

**Returns**: the dimension tag

**Examples**

```kex
Second.kind   # => :time
```

#### `symbol`

```kex
symbol -> String
```

How this unit is written when a measure is displayed.

**Returns**: the unit's symbol

**Examples**

```kex
Minute.symbol   # => "min"
```



## function `measureKind`

```kex
measureKind(measure: Measure) -> Atom
```

The dimension a measure belongs to.

**Parameters**

  - `measure` — the measure to inspect

**Returns**: the dimension tag

**Examples**

```kex
measureKind(5.second)   # => :time
```

## function `measureSymbol`

```kex
measureSymbol(measure: Measure) -> String
```

The symbol a measure displays with.

**Parameters**

  - `measure` — the measure to inspect

**Returns**: the unit's symbol

**Examples**

```kex
measureSymbol(5.minute)   # => "min"
```

## function `measureFactor`

```kex
measureFactor(measure: Measure) -> Float
```

The conversion factor of a measure's unit.

**Parameters**

  - `measure` — the measure to inspect

**Returns**: the conversion factor

**Examples**

```kex
measureFactor(5.minute)   # => 60.0
```

## record `UnitDefinition`

A unit described at run time rather than by a constructor.

Runtime-defined units are used for prefixes and units derived by arithmetic: `s^2` from squaring a duration, a kilo- prefix applied to a base unit.

**Fields**

  - `conversionFactor` : [Float](number.md#make-float)
  - `dimension` : [Atom](atom.md#make-atom)
  - `notation` : [String](string.md#make-string)

Implements [`Unit`](#trait-unit).

### Functions

#### `factor` (from Unit)

```kex
factor -> Float
```

How many base units one of this unit is.

**Returns**: the conversion factor

#### `kind` (from Unit)

```kex
kind -> Atom
```

Which dimension this unit measures.

**Returns**: the dimension tag

#### `symbol` (from Unit)

```kex
symbol -> String
```

How the unit is written.

**Returns**: the unit's symbol

### Defined in other modules

  - [Units.Data](units/data.md#make-unitdefinition): [`factor`](units/data.md#unitdefinition-factor), [`kind`](units/data.md#unitdefinition-kind), [`symbol`](units/data.md#unitdefinition-symbol)
  - [Units.SI](units/si.md#make-unitdefinition): [`factor`](units/si.md#unitdefinition-factor), [`kind`](units/si.md#unitdefinition-kind), [`symbol`](units/si.md#unitdefinition-symbol)

## module `Quantity`

What a measure measures, as a type: the `D` of `Measure<D>`. Every unit's constructor says its dimension (`1.second` is a `Measure<Quantity.Time>`, `1.meter` a `Measure<Quantity.Length>`), so adding, comparing or ordering measures of different dimensions is a type error. These types have no values; they only tell measures apart. A measure made by unit arithmetic (`1.watt * 1.hour`) is a plain `Measure`: its dimension is known only when it runs.



## record `Time`

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Defined in other modules

  - [DateFormat](date_format.md#make-time): [`to`](date_format.md#time-to)
  - [Time](time.md#make-time): [`inspectValue`](time.md#time-inspectvalue), [`showValue`](time.md#time-showvalue), [`secondsSinceMidnight`](time.md#time-secondssincemidnight), [`before?`](time.md#time-before?), [`after?`](time.md#time-after?), [`+`](time.md#time-op-plus), [`-`](time.md#time-op-minus), [`addSeconds`](time.md#time-addseconds), [`addMinutes`](time.md#time-addminutes), [`addHours`](time.md#time-addhours), [`until`](time.md#time-until), [`iso`](time.md#time-iso), [`compareTo`](time.md#time-compareto)

## record `Data`



## record `Length`



## record `Mass`



## record `Volume`



## record `Temperature`



## record `Force`



## record `Energy`



## record `Power`



## record `Voltage`



## record `Current`



## record `Resistance`



## record `Charge`



## record `Measure<D>`

A quantity with a unit, of dimension `D` (a `Quantity` type).

A Measure is shared by every unit module. `canonical` stores the value in that dimension's base unit; its Unit controls its display. That split is what makes +1.hour + 30.minute+ correct and still print in hours.

**Fields**

  - `canonical` : [Float](number.md#make-float)
  - `value` : [Float](number.md#make-float)
  - `unit` : [UnitDefinition](#record-unitdefinition)

Implements [`Showable`](kex.md#trait-showable), [`Comparable`](comparable.md#trait-comparable).

### Functions

A measure is its quantity: `1.minute == 60.second`, `1.kilometer == 1000.meter`. Equality and ordering compare the canonical value, in the dimension's base unit, whatever unit each was written in. Measures of different dimensions are never equal, and ordering them is a type error (`1.second < 1.meter`). A measure whose dimension is known only at run time (one made by unit arithmetic) is compared by its canonical value alone.

#### `factor`

```kex
factor -> Float
```

#### `kind`

```kex
kind -> Atom
```

#### `symbol`

```kex
symbol -> String
```

#### `to`

```kex
to(String: Type, in: TimeUnit, format: NumberFormat) -> String?
```

Renders the measure in its own unit.

**Parameters**

  - `String` — the target type

**Returns**: the rendered measure

**Examples**

```kex
90.second.to(String)   # => Just("90.0 s")
```

#### `scaled`

```kex
scaled -> Measure
```

Chooses the largest unit whose absolute value is at least one. Time uses nanoseconds through weeks; data uses bytes through terabytes (`binary: true` selects KiB through TiB). SI dimensions use decimal prefixes. Zero uses the family's base unit; smaller values use its smallest unit. Other dimensions keep their current unit.

**Examples**

```kex
90.second.scaled.to(String, Number.format`#.#`)   # => Just("1.5 min")
```

```kex
scaled(binary: Bool) -> Measure
```

As `scaled`, using binary scales for data when `binary` is true.

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the measure as its value and unit, so `IO.printLine` and interpolation show `5.0 W` rather than the record's fields. Inspecting it (the REPL's echo, `inspected`) still shows the record itself.

**Returns**: the value and the unit's symbol

**Examples**

```kex
"drawn: ${1.volt * 5.ampere}"   # => "drawn: 5.0 W"
```

#### `scale`

```kex
scale(multiplier: Number) -> Measure
```

Multiplies the measure by a plain number, keeping its unit.

The unit is unchanged, so this scales a quantity rather than converting it: three of a two-second interval is six seconds.

**Parameters**

  - `multiplier` — the factor to multiply by

**Returns**: the scaled measure

**Examples**

```kex
2.second.scale(3).to(String)     # => Just("6.0 s")
1.hour.scale(0.5).to(String)  # => Just("0.5 h")
```

#### `^`

```kex
^(exponent: Number) -> Measure
```

Raises the measure to a power, recording the derived unit in its notation.

Raising a measure preserves its display unit while applying the power to its canonical value, display value, and conversion factor. The current Unit trait represents a dimension as one Atom, so the dimension remains the base kind; the notation records the derived unit (for example `s^2`).

**Parameters**

  - `exponent` — the power to raise to

**Returns**: the raised measure

**Examples**

```kex
(2.second ^ 2).to(String)   # => Just("4.0 s^2")
```

#### `convertTo`

```kex
convertTo(unit: Unit) -> Result<Measure, String>
```

Converts the measure to another unit of the same dimension.

Answers `Error` when the dimensions differ: you cannot express seconds in bytes, and this says so rather than producing a wrong number.

Units from opt-in modules such as `Units.SI` and `Units.Data` can be used here too, provided their dimension matches.

**Parameters**

  - `unit` — the unit to convert to

**Returns**: the converted measure, or why it could not be

**Examples**

```kex
1.day.convertTo(Hour).map { |m| m.showValue }     # => Ok("24.0 h")
90.minute.convertTo(Hour).map { |m| m.showValue } # => Ok("1.5 h")
```

#### `convert`

```kex
convert(unit: TimeUnit) -> Result<Measure, String>
```

Converts the measure to another time unit. The short spelling of `convertTo`, kept for prelude time measures.

**Parameters**

  - `unit` — the time unit to convert to

**Returns**: the converted measure, or why it could not be

**Examples**

```kex
90.minute.convert(Hour).map { |m| m.showValue }   # => Ok("1.5 h")
```

#### `+`

```kex
+(other: Measure<D>) -> Measure<D>
```

Adds two measures of the same dimension.

The units need not match: the sum goes through the canonical values, and comes back displayed in the LEFT operand's unit. The dimension is the type's (`Measure<D>`), so adding measures of different dimensions does not type-check.

**Parameters**

  - `other` — a measure of the same dimension

**Returns**: the sum, in this measure's unit

**Examples**

```kex
(1.hour + 30.minute).showValue   # => "1.5 h"
(30.minute + 1.hour).showValue   # => "90.0 min"
```

#### `-`

```kex
-(other: Measure<D>) -> Measure<D>
```

Subtracts a measure of the same dimension.

Like +++, the result is displayed in the left operand's unit.

**Parameters**

  - `other` — a measure of the same dimension

**Returns**: the difference, in this measure's unit

**Examples**

```kex
(1.hour - 30.minute).showValue   # => "0.5 h"
```

#### `inOwnUnit`

```kex
inOwnUnit(total: Float) -> Measure<D>
```

The canonical quantity `total`, displayed in this measure's unit.

#### `scaledValue`

```kex
scaledValue(canonical: Float, factor: Float) -> Number
```

Divides a canonical value by a unit factor. The conversion is exact in principle (0.000005 W is 5 μW), but neither number is exactly representable in binary, so the quotient can land an ulp or two off (5.000000000000001). Round back to 15 significant digits, comfortably inside a double's ~15.95, so converted measures read the way they were written. The annotation says Number because `Integer / Float` infers Integer; the result is always a Float.

#### `scaledMeasureBase`

```kex
scaledMeasureBase(unit: UnitDefinition) -> UnitDefinition
```

#### `scaledMeasureFamily`

```kex
scaledMeasureFamily(base: UnitDefinition, binary: Bool) -> [UnitDefinition]
```

#### `==`

```kex
==(other: Measure<D>) -> Bool
```

Whether `other` is the same quantity of the same dimension.

**Parameters**

  - `other` — the measure to compare with

**Returns**: true when both measure the same amount of the same thing

**Examples**

```kex
1.minute == 60.second   # => true
1.hour == 59.minute     # => false
```

#### `compare` (from Comparable)

```kex
compare(other: Measure<D>) -> Ordering
```

How this quantity orders against `other`, of the same dimension.

**Parameters**

  - `other` — a measure of the same dimension

**Returns**: `Less`, `Equal` or `Greater`

**Examples**

```kex
90.second.compare(1.minute)   # => Greater
1.minute < 1.hour             # => true
```

#### `<` (from Comparable)

```kex
<(other: Measure<D>) -> Bool
```

Ordering, as `Comparable` defines it, for measures of one dimension: the trait's own operators take any value, so these say `Measure<D>`.

#### `>` (from Comparable)

```kex
>(other: Measure<D>) -> Bool
```

#### `<=` (from Comparable)

```kex
<=(other: Measure<D>) -> Bool
```

#### `>=` (from Comparable)

```kex
>=(other: Measure<D>) -> Bool
```

### From [`Comparable`](comparable.md#trait-comparable)

  - [`max`](comparable.md#comparable-max) — What every ordered type gets from `compare` alone.
  - [`min`](comparable.md#comparable-min) — Returns the smaller of this value and `other`; this value when they are equal.
  - [`clamp`](comparable.md#comparable-clamp) — Returns this value limited to the range `low` to `high`: `low` when it is below, `high` when it is above, and itself otherwise.

### Defined in other modules

  - [Duration](duration.md#make-measure-quantity-time): [`wholeNanoseconds`](duration.md#measure-quantity-time-wholenanoseconds), [`wholeMicroseconds`](duration.md#measure-quantity-time-wholemicroseconds), [`negated`](duration.md#measure-quantity-time-negated), [`*`](duration.md#measure-quantity-time-op-times), [`/`](duration.md#measure-quantity-time-op-div), [`abs`](duration.md#measure-quantity-time-abs), [`zero?`](duration.md#measure-quantity-time-zero?), [`negative?`](duration.md#measure-quantity-time-negative?), [`positive?`](duration.md#measure-quantity-time-positive?), [`shorterThan?`](duration.md#measure-quantity-time-shorterthan?), [`longerThan?`](duration.md#measure-quantity-time-longerthan?), [`seconds`](duration.md#measure-quantity-time-seconds), [`wholeMilliseconds`](duration.md#measure-quantity-time-wholemilliseconds), [`wholeSeconds`](duration.md#measure-quantity-time-wholeseconds), [`wholeMinutes`](duration.md#measure-quantity-time-wholeminutes), [`wholeHours`](duration.md#measure-quantity-time-wholehours), [`wholeDays`](duration.md#measure-quantity-time-wholedays), [`wholeWeeks`](duration.md#measure-quantity-time-wholeweeks), [`compareTo`](duration.md#measure-quantity-time-compareto), [`iso`](duration.md#measure-quantity-time-iso)
  - [Units.Data](units/data.md#make-measure): [`factor`](units/data.md#measure-factor), [`kind`](units/data.md#measure-kind), [`symbol`](units/data.md#measure-symbol), [`to`](units/data.md#measure-to), [`<`](units/data.md#measure-op-lt), [`>`](units/data.md#measure-op-gt), [`<=`](units/data.md#measure-op-lt-eq), [`>=`](units/data.md#measure-op-gt-eq)
  - [Units.SI](units/si.md#make-measure): [`factor`](units/si.md#measure-factor), [`kind`](units/si.md#measure-kind), [`symbol`](units/si.md#measure-symbol), [`to`](units/si.md#measure-to), [`rescaled`](units/si.md#measure-rescaled), [`prefixScaled`](units/si.md#measure-prefixscaled), [`*`](units/si.md#measure-op-times), [`/`](units/si.md#measure-op-div), [`product`](units/si.md#measure-product), [`quotient`](units/si.md#measure-quotient), [`productKind`](units/si.md#measure-productkind), [`quotientKind`](units/si.md#measure-quotientkind), [`productSymbol`](units/si.md#measure-productsymbol), [`quotientSymbol`](units/si.md#measure-quotientsymbol)

## type `Duration`

An elapsed span of time: a measure of time. `5.second` is a Duration, and Time, Date and DateTime take one: +Date.today + 3.day+.

**Variants**

  - `Measure(Quantity.Time)`



## type `TimeUnit`

The time units, from nanoseconds to weeks. The base unit is the second.

**Variants**

  - `Nanosecond`
  - `Microsecond`
  - `Millisecond`
  - `Second`
  - `Minute`
  - `Hour`
  - `Day`
  - `Week`

Implements [`Unit`](#trait-unit).

### Functions

#### `factor` (from Unit)

```kex
factor -> Float
```

#### `kind` (from Unit)

```kex
kind -> Atom
```

#### `symbol` (from Unit)

```kex
symbol -> String
```

## extends `Integer`

More functions for [`Integer`](number.md#make-integer), added by this module.

Time-unit constructors on `Integer`: `5.second`, `90.minute`, `2.week`.

Each answers a `Measure` whose display unit is the one you named, so `90.minute` prints as minutes even though it is stored as 5400 seconds.

### `nanosecond`

```kex
nanosecond -> Measure<Quantity.Time>
```

This many nanoseconds, as a `Measure`.

**Returns**: the quantity, displayed in nanoseconds

**Examples**

```kex
100.nanosecond.to(String)   # => Just("100.0 ns")
```

### `microsecond`

```kex
microsecond -> Measure<Quantity.Time>
```

This many microseconds, as a `Measure`.

**Returns**: the quantity, displayed in microseconds

**Examples**

```kex
250.microsecond.to(String)   # => Just("250.0 μs")
```

### `millisecond`

```kex
millisecond -> Measure<Quantity.Time>
```

This many milliseconds, as a `Measure`.

**Returns**: the quantity, displayed in milliseconds

**Examples**

```kex
500.millisecond.to(String)   # => Just("500.0 ms")
```

### `second`

```kex
second -> Measure<Quantity.Time>
```

This many seconds, as a `Measure`. Seconds are the base unit of time, so this is the one everything else converts through.

**Returns**: the quantity, displayed in seconds

**Examples**

```kex
5.second.to(String)   # => Just("5.0 s")
```

### `minute`

```kex
minute -> Measure<Quantity.Time>
```

This many minutes, as a `Measure`.

**Returns**: the quantity, displayed in minutes

**Examples**

```kex
90.minute.convert(Hour)   # => Ok(1.5 h)
```

### `hour`

```kex
hour -> Measure<Quantity.Time>
```

This many hours, as a `Measure`.

**Returns**: the quantity, displayed in hours

**Examples**

```kex
(1.hour + 30.minute).showValue   # => "1.5 h"
```

### `day`

```kex
day -> Measure<Quantity.Time>
```

This many days, as a `Measure`.

**Returns**: the quantity, displayed in days

**Examples**

```kex
1.day.convertTo(Hour).map { |m| m.showValue }   # => Ok("24.0 h")
```

### `week`

```kex
week -> Measure<Quantity.Time>
```

This many weeks, as a `Measure`.

**Returns**: the quantity, displayed in weeks

**Examples**

```kex
2.week.to(String)   # => Just("2.0 wk")
```

### `timeMeasure`

```kex
timeMeasure(unit: TimeUnit) -> Measure<Quantity.Time>
```

## extends `Float`

More functions for [`Float`](number.md#make-float), added by this module.

The same time-unit constructors on `Float`, for fractional quantities: `1.5.hour`, `0.25.second`.

### `nanosecond`

```kex
nanosecond -> Measure<Quantity.Time>
```

This many nanoseconds, as a `Measure`.

**Returns**: the quantity, displayed in nanoseconds

### `microsecond`

```kex
microsecond -> Measure<Quantity.Time>
```

This many microseconds, as a `Measure`.

**Returns**: the quantity, displayed in microseconds

### `millisecond`

```kex
millisecond -> Measure<Quantity.Time>
```

This many milliseconds, as a `Measure`.

**Returns**: the quantity, displayed in milliseconds

**Examples**

```kex
2.5.millisecond.to(String)   # => Just("2.5 ms")
```

### `second`

```kex
second -> Measure<Quantity.Time>
```

This many seconds, as a `Measure`.

**Returns**: the quantity, displayed in seconds

**Examples**

```kex
0.25.second.to(String)   # => Just("0.25 s")
```

### `minute`

```kex
minute -> Measure<Quantity.Time>
```

This many minutes, as a `Measure`.

**Returns**: the quantity, displayed in minutes

### `hour`

```kex
hour -> Measure<Quantity.Time>
```

This many hours, as a `Measure`.

**Returns**: the quantity, displayed in hours

**Examples**

```kex
1.5.hour.to(String)   # => Just("1.5 h")
```

### `day`

```kex
day -> Measure<Quantity.Time>
```

This many days, as a `Measure`.

**Returns**: the quantity, displayed in days

### `week`

```kex
week -> Measure<Quantity.Time>
```

This many weeks, as a `Measure`.

**Returns**: the quantity, displayed in weeks

### `timeMeasure`

```kex
timeMeasure(unit: TimeUnit) -> Measure<Quantity.Time>
```

## module `Units`

Time-unit constructors, also available directly from the prelude.

`Units.Hour` and `Hour` name the same constructor: they match the same patterns and compare equal. Use the qualified spelling to make the unit family explicit.

```kex
90.minute.convert(Units.Hour)   # => Ok(1.5 h)
```

### `Nanosecond` (constant)



### `Microsecond` (constant)



### `Millisecond` (constant)



### `Second` (constant)



### `Minute` (constant)



### `Hour` (constant)



### `Day` (constant)



### `Week` (constant)


