---
package: prelude
version: "0.4.0-rc.5-dev"
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
  - { kind: make, name: "Measure<Quantity.Length>" }
  - { kind: module, name: "Units" }
---

# Units

Numbers that carry a unit.

`5.second` and `90.minute` are +Measure+s: a number, the unit it was written in, and the same quantity in the base unit of its dimension. Arithmetic and conversion use the base-unit value, so operands can be in different units. The dimension is part of the type, as in `Measure<Quantity.Time>`, so adding a time to a length does not type-check.

```kex
5.second.to(String)                       # => Just("5.0 s")
1.5.hour.to(String)                       # => Just("1.5 h")
(1.hour + 30.minute).to(String)           # => Just("1.5 h")
90.minute.to(String, in: Hour)            # => Just("1.5 h")
```

The time units, `nanosecond` through `week`, are in the prelude. Units for other dimensions are in opt-in modules under `Units`, such as `Units.SI` and `Units.Data`, and use the same `Measure`.

A time measure is a `Duration`, the span type that `Time`, `Date` and `DateTime` take: +Date.today() + 3.day+.

## trait `Unit`

The trait every unit implements: its conversion factor to the base unit of its dimension, the dimension, and its symbol.

Implemented by [`UnitDefinition`](#make-unitdefinition), [`TimeUnit`](#make-timeunit), [`DataUnit`](units/data.md#make-dataunit), [`UnitDefinition`](units/data.md#make-unitdefinition), [`SIPrefix`](units/si.md#make-siprefix), [`SIUnit`](units/si.md#make-siunit), [`UnitDefinition`](units/si.md#make-unitdefinition).

### Required functions

#### `factor`

```kex
factor -> Float
```

Returns how many base units one of this unit is: `60.0` for a minute, since the base unit of time is the second.

**Returns**: the conversion factor

**Examples**

```kex
Minute.factor   # => 60.0
```

#### `kind`

```kex
kind -> Atom
```

Returns the dimension this unit measures, as an atom. Only measures of the same dimension can be added or converted into each other.

**Returns**: the dimension tag

**Examples**

```kex
Second.kind   # => :time
```

#### `symbol`

```kex
symbol -> String
```

Returns the symbol a measure in this unit is shown with.

**Returns**: the unit's symbol

**Examples**

```kex
Minute.symbol   # => "min"
```



## function `measureKind`

```kex
measureKind(measure: Measure<D>) -> Atom
```

Returns the dimension of a measure, as an atom.

**Parameters**

  - `measure` — the measure to inspect

**Returns**: the dimension tag

**Examples**

```kex
measureKind(5.second)   # => :time
```

## function `measureSymbol`

```kex
measureSymbol(measure: Measure<D>) -> String
```

Returns the symbol of a measure's unit.

**Parameters**

  - `measure` — the measure to inspect

**Returns**: the unit's symbol

**Examples**

```kex
measureSymbol(5.minute)   # => "min"
```

## function `measureFactor`

```kex
measureFactor(measure: Measure<D>) -> Float
```

Returns the conversion factor of a measure's unit to its base unit.

**Parameters**

  - `measure` — the measure to inspect

**Returns**: the conversion factor

**Examples**

```kex
measureFactor(5.minute)   # => 60.0
```

## record `UnitDefinition`

A unit described by its fields instead of a constructor.

Every `Measure` stores its unit this way. Prefixed units and units made by arithmetic, such as `m^2` from squaring a length or a kilo- prefix on a base unit, exist only in this form.

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

The dimensions a measure can have, as types: the `D` of `Measure<D>`.

Each unit fixes its dimension: `1.second` is a `Measure<Quantity.Time>` and `1.meter` a `Measure<Quantity.Length>`, so adding, comparing or ordering measures of different dimensions is a type error. These types have no values. Unit arithmetic gives a dimension too: `1.watt * 1.hour` is a `Measure<Quantity.Energy>`, from the products `Units.SI` declares, and a product it does not declare is a type error.



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



## record `Area`

Dimensions derived from others by the products and quotients in `Units.SI`: length over time is speed, speed over time acceleration, force over length pressure, and length squared area.



## record `Speed`



## record `Acceleration`



## record `Pressure`



## record `Measure<D>`

A quantity with a unit, of dimension `D`, one of the `Quantity` types.

Every unit module uses this record. `canonical` holds the value in the dimension's base unit and `unit` decides how it is shown, which is how +1.hour + 30.minute+ comes out right and still prints in hours.

**Fields**

  - `canonical` : [Float](number.md#make-float)
  - `value` : [Float](number.md#make-float)
  - `unit` : [UnitDefinition](#record-unitdefinition)

Implements [`Showable`](kex.md#trait-showable), [`Comparable`](comparable.md#trait-comparable).

### Functions

Equality and ordering of measures by quantity: `1.minute == 60.second` and `1.kilometer == 1000.meter`, whatever units each was written in.

Measures of different dimensions are never equal, and ordering them, as in `1.second < 1.meter`, is a type error. A measure whose dimension is only known at run time, made by unit arithmetic, is compared by its base-unit value alone.

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
scaled -> This
```

Returns the measure in the largest unit in which its size is at least 1.

Time picks from nanoseconds through weeks, data from bytes through terabytes, and SI dimensions from the decimal prefixes nano through giga. Zero is shown in the base unit, and a value smaller than the smallest unit in that unit. Measures of other dimensions keep their unit.

**Examples**

```kex
90.second.scaled.to(String, Number.format`#.#`)   # => Just("1.5 min")
```

```kex
scaled(binary: Bool) -> This
```

Returns the measure in the largest unit in which its size is at least 1, as `scaled` does. With `binary` true, data uses KiB through TiB.

**Parameters**

  - `binary` — whether data uses powers of 1024

**Returns**: the measure in the chosen unit

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the measure as its number and unit symbol, which is what `IO.printLine` and interpolation show. `inspected` and the REPL show the record's fields instead.

**Returns**: the value and the unit's symbol

**Examples**

```kex
"drawn: ${1.volt * 5.ampere}"   # => "drawn: 5.0 W"
```

#### `scale`

```kex
scale(multiplier: Number) -> This
```

Multiplies the measure by a plain number, keeping its unit.

Three times a two-second interval is six seconds, shown in seconds.

**Parameters**

  - `multiplier` — the factor to multiply by

**Returns**: the scaled measure

**Examples**

```kex
2.second.scale(3).to(String)     # => Just("6.0 s")
1.hour.scale(0.5).to(String)  # => Just("0.5 h")
```

#### `raisedUnit`

```kex
raisedUnit(exponent: Integer, dimension: Atom) -> UnitDefinition
```

Returns this measure's unit raised to `exponent`, for `squared` and `cubed`: the factor raised to that power, a notation such as `m^2`, and the given dimension.

**Parameters**

  - `exponent` — the power
  - `dimension` — the resulting dimension (`:area`, `:volume`)

**Returns**: the raised unit

#### `convertTo`

```kex
convertTo(unit: Unit) -> Result<This, String>
```

Converts the measure to another unit of the same dimension.

Units from opt-in modules such as `Units.SI` and `Units.Data` work too. Converting to a unit of another dimension, such as seconds to meters, is an `Error`.

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
convert(unit: TimeUnit) -> Result<This, String>
```

Converts the measure to another time unit; `convertTo` for time units only.

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

The units can differ. The sum is shown in the left operand's unit. Adding measures of different dimensions does not type-check.

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

As with +++, the result is shown in the left operand's unit.

**Parameters**

  - `other` — a measure of the same dimension

**Returns**: the difference, in this measure's unit

**Examples**

```kex
(1.hour - 30.minute).showValue   # => "0.5 h"
```

#### `inOwnUnit`

```kex
inOwnUnit(total: Float) -> This
```

Returns a measure of `total` base units, shown in this measure's unit.

#### `scaledValue`

```kex
scaledValue(canonical: Float, factor: Float) -> Float
```

Divides a canonical value by a unit factor. The conversion is exact in principle (0.000005 W is 5 μW), but neither number is exactly representable in binary, so the quotient can land an ulp or two off (5.000000000000001). Round back to 15 significant digits, comfortably inside a double's ~15.95, so converted measures read the way they were written.

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

Returns `true` when `other` is the same quantity of the same dimension.

**Parameters**

  - `other` — the measure to compare with

**Returns**: `true` when both measure the same amount of the same thing

**Examples**

```kex
1.minute == 60.second   # => true
1.hour == 59.minute     # => false
```

#### `compare` (from Comparable)

```kex
compare(other: Measure<D>) -> Ordering
```

Compares this quantity with `other`, a measure of the same dimension.

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

The ordering operators of `Comparable`, typed to take only a measure of the same dimension.

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

### On `Measure<Quantity.Length>`

Powers of a length that have a dimension: `3.meter ^ 2` is an area and `2.meter ^ 3` a volume, the exponent literal choosing which. Other powers go through `pow` in `Units.Dynamic`, which checks them at run time.

#### `^`

```kex
^(_) -> Measure<Quantity.Area>
```

Returns the length squared, the same as `squared`.

**Examples**

```kex
(3.meter ^ 2).to(String)   # => Just("9.0 m^2")
```

#### `squared`

```kex
squared -> Measure<Quantity.Area>
```

Returns the length squared, which is an area.

**Returns**: the area, displayed as the unit squared

**Examples**

```kex
3.meter.squared.to(String)   # => Just("9.0 m^2")
```

#### `cubed`

```kex
cubed -> Measure<Quantity.Volume>
```

Returns the length cubed, which is a volume and converts to litres.

**Returns**: the volume, displayed as the unit cubed

**Examples**

```kex
2.meter.cubed.canonical   # => 8.0
```

### From [`Comparable`](comparable.md#trait-comparable)

  - [`max`](comparable.md#comparable-max) — Returns the larger of this value and `other`, or this value when they are equal.
  - [`min`](comparable.md#comparable-min) — Returns the smaller of this value and `other`, or this value when they are equal.
  - [`clamp`](comparable.md#comparable-clamp) — Returns this value limited to `low`..`high`: `low` when it is below, `high` when it is above, and the value itself otherwise.

### Defined in other modules

  - [Duration](duration.md#make-measure-quantity-time): [`wholeNanoseconds`](duration.md#measure-quantity-time-wholenanoseconds), [`wholeMicroseconds`](duration.md#measure-quantity-time-wholemicroseconds), [`negated`](duration.md#measure-quantity-time-negated), [`*`](duration.md#measure-quantity-time-op-times), [`/`](duration.md#measure-quantity-time-op-div), [`abs`](duration.md#measure-quantity-time-abs), [`zero?`](duration.md#measure-quantity-time-zero?), [`negative?`](duration.md#measure-quantity-time-negative?), [`positive?`](duration.md#measure-quantity-time-positive?), [`shorterThan?`](duration.md#measure-quantity-time-shorterthan?), [`longerThan?`](duration.md#measure-quantity-time-longerthan?), [`seconds`](duration.md#measure-quantity-time-seconds), [`wholeMilliseconds`](duration.md#measure-quantity-time-wholemilliseconds), [`wholeSeconds`](duration.md#measure-quantity-time-wholeseconds), [`wholeMinutes`](duration.md#measure-quantity-time-wholeminutes), [`wholeHours`](duration.md#measure-quantity-time-wholehours), [`wholeDays`](duration.md#measure-quantity-time-wholedays), [`wholeWeeks`](duration.md#measure-quantity-time-wholeweeks), [`compareTo`](duration.md#measure-quantity-time-compareto), [`iso`](duration.md#measure-quantity-time-iso)
  - [Units.Data](units/data.md#make-measure): [`factor`](units/data.md#measure-factor), [`kind`](units/data.md#measure-kind), [`symbol`](units/data.md#measure-symbol), [`to`](units/data.md#measure-to), [`<`](units/data.md#measure-op-lt), [`>`](units/data.md#measure-op-gt), [`<=`](units/data.md#measure-op-lt-eq), [`>=`](units/data.md#measure-op-gt-eq)
  - [Units.SI](units/si.md#make-measure): [`factor`](units/si.md#measure-factor), [`kind`](units/si.md#measure-kind), [`symbol`](units/si.md#measure-symbol), [`to`](units/si.md#measure-to), [`rescaled`](units/si.md#measure-rescaled), [`prefixScaled`](units/si.md#measure-prefixscaled)
  - [Units.SI](units/si.md#make-measure-quantity-mass): [`*`](units/si.md#measure-quantity-mass-op-times), [`times`](units/si.md#measure-quantity-mass-times)
  - [Units.SI](units/si.md#make-measure-quantity-acceleration): [`*`](units/si.md#measure-quantity-acceleration-op-times), [`times`](units/si.md#measure-quantity-acceleration-times)
  - [Units.SI](units/si.md#make-measure-quantity-force): [`*`](units/si.md#measure-quantity-force-op-times), [`times`](units/si.md#measure-quantity-force-times), [`/`](units/si.md#measure-quantity-force-op-div), [`per`](units/si.md#measure-quantity-force-per)
  - [Units.SI](units/si.md#make-measure-quantity-length): [`*`](units/si.md#measure-quantity-length-op-times), [`times`](units/si.md#measure-quantity-length-times), [`/`](units/si.md#measure-quantity-length-op-div), [`per`](units/si.md#measure-quantity-length-per)
  - [Units.SI](units/si.md#make-measure-quantity-area): [`*`](units/si.md#measure-quantity-area-op-times), [`times`](units/si.md#measure-quantity-area-times)
  - [Units.SI](units/si.md#make-measure-quantity-speed): [`/`](units/si.md#measure-quantity-speed-op-div), [`per`](units/si.md#measure-quantity-speed-per)
  - [Units.SI](units/si.md#make-measure-quantity-voltage): [`*`](units/si.md#measure-quantity-voltage-op-times), [`times`](units/si.md#measure-quantity-voltage-times), [`/`](units/si.md#measure-quantity-voltage-op-div), [`per`](units/si.md#measure-quantity-voltage-per)
  - [Units.SI](units/si.md#make-measure-quantity-current): [`*`](units/si.md#measure-quantity-current-op-times), [`times`](units/si.md#measure-quantity-current-times)
  - [Units.SI](units/si.md#make-measure-quantity-resistance): [`*`](units/si.md#measure-quantity-resistance-op-times), [`times`](units/si.md#measure-quantity-resistance-times)
  - [Units.SI](units/si.md#make-measure-quantity-power): [`*`](units/si.md#measure-quantity-power-op-times), [`times`](units/si.md#measure-quantity-power-times)
  - [Units.SI](units/si.md#make-measure-quantity-time): [`*`](units/si.md#measure-quantity-time-op-times), [`times`](units/si.md#measure-quantity-time-times)
  - [Units.SI](units/si.md#make-measure-quantity-energy): [`/`](units/si.md#measure-quantity-energy-op-div), [`per`](units/si.md#measure-quantity-energy-per)

## type `Duration`

A span of time, which is any measure of time.

`Time`, `Date` and `DateTime` take one: +Date.today() + 3.day+.

**Variants**

  - `Measure(Quantity.Time)`



## type `TimeUnit`

The units of time, from nanoseconds to weeks. The base unit is the second.

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

Time measures from an `Integer`: `5.second`, `90.minute`, `2.week`.

The measure is shown in the unit you named, so `90.minute` prints as minutes, though it holds 5400 seconds as its base value.

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

Returns this many seconds, as a `Measure`. The second is the base unit of time.

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
90.minute.to(String, in: Hour)   # => Just("1.5 h")
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

Time measures from a `Float`, for fractional amounts: `1.5.hour`, `0.25.second`.

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

The time units under the `Units` name. They are also in the prelude.

`Units.Hour` and `Hour` are the same constructor: they match the same patterns and compare equal. The qualified name makes the unit family explicit.

```kex
90.minute.to(String, in: Units.Hour)   # => Just("1.5 h")
```

### `Nanosecond` (constant)



### `Microsecond` (constant)



### `Millisecond` (constant)



### `Second` (constant)



### `Minute` (constant)



### `Hour` (constant)



### `Day` (constant)



### `Week` (constant)


