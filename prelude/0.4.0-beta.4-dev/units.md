---
package: prelude
version: "0.4.0-beta.4-dev"
source: units.kex
title: Units
entities:
  - { kind: trait, name: "Unit" }
  - { kind: function, name: "measureKind" }
  - { kind: function, name: "measureSymbol" }
  - { kind: function, name: "measureFactor" }
  - { kind: record, name: "UnitDefinition" }
  - { kind: make, name: "UnitDefinition" }
  - { kind: record, name: "Measure" }
  - { kind: record, name: "Duration" }
  - { kind: type, name: "TimeUnit" }
  - { kind: make, name: "TimeUnit" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: make, name: "Measure" }
  - { kind: module, name: "Units" }
---

# Units

Numbers that carry a unit.

Writing `5.sec` or `90.minute` gives you a `Measure`: a number, the unit it was written in, and the same quantity in that dimension's base unit. Adding, subtracting and converting all go through the canonical value, so the arithmetic is right regardless of which units the operands were written in, and mixing dimensions is an `Error` rather than a silently wrong number.

```kex
5.sec.to(String)                     # => "5.0 s"
1.5.hour.to(String)                  # => "1.5 h"
(1.hour + 30.minute).map(~to(String))  # => Ok("1.5 h")
90.minute.convert(Hour)              # => Ok(1.5 h)
```

The time units (`nanosecond` through `week`) are in the prelude. Other dimensions live in opt-in modules under `Units`, and every one of them measures against the same machinery here.

A `Measure` is a measurement, not an elapsed span: `5.sec` describes a quantity, while `Duration` is what `Time` and `Date` use for a span between two moments.

## trait `Unit`

The trait a unit implements: how it converts to its dimension's base unit, which dimension that is, and how it is written.

Implemented by [`UnitDefinition`](#make-unitdefinition), [`TimeUnit`](#make-timeunit), [`DataUnit`](units/data.md#make-dataunit), [`UnitDefinition`](units/data.md#make-unitdefinition), [`SIPrefix`](units/si.md#make-siprefix), [`SIUnit`](units/si.md#make-siunit), [`UnitDefinition`](units/si.md#make-unitdefinition).

### Required methods

#### `factor`

```kex
factor : Float
```

How many base units one of this unit is: `60.0` for a minute, whose base unit is the second.

**Returns**: the conversion factor

**Examples**

```kex
Minute.factor   # => 60.0
```

#### `kind`

```kex
kind : Atom
```

Which dimension this unit measures, as an atom. Only measures of the same kind can be added or converted between.

**Returns**: the dimension tag

**Examples**

```kex
Second.kind   # => :time
```

#### `symbol`

```kex
symbol : String
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
measureKind(5.sec)   # => :time
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

### Methods

#### `factor` (from Unit)

How many base units one of this unit is.

**Returns**: `Float` — the conversion factor

#### `kind` (from Unit)

Which dimension this unit measures.

**Returns**: `Atom` — the dimension tag

#### `symbol` (from Unit)

How the unit is written.

**Returns**: `String` — the unit's symbol

### Defined in other modules

  - [Units.Data](units/data.md#make-unitdefinition): [`factor`](units/data.md#unitdefinition-factor), [`kind`](units/data.md#unitdefinition-kind), [`symbol`](units/data.md#unitdefinition-symbol)
  - [Units.SI](units/si.md#make-unitdefinition): [`factor`](units/si.md#unitdefinition-factor), [`kind`](units/si.md#unitdefinition-kind), [`symbol`](units/si.md#unitdefinition-symbol)

## record `Measure`

A quantity with a unit.

A Measure is shared by every unit module. `canonical` stores the value in that dimension's base unit; its Unit controls its display. That split is what makes +1.hour + 30.minute+ correct and still print in hours.

**Fields**

  - `canonical` : [Float](number.md#make-float)
  - `value` : [Float](number.md#make-float)
  - `unit` : [UnitDefinition](#record-unitdefinition)

Implements [`Showable`](kex.md#trait-showable).

### Methods

#### `factor`

```kex
factor : Float
```

#### `kind`

```kex
kind : Atom
```

#### `symbol`

```kex
symbol : String
```

#### `to`

```kex
to(_) -> String
```

#### `showValue` (from Showable)

```kex
showValue : String
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

Formatting into a target display unit deliberately has NO prelude clause. A unit module (Units.SI, Units.Data, ...) supplies `to(String, in:)` for the units it owns, and reaching one requires importing it. A catch-all here would answer `None` for an un-imported module instead: a silently empty Optional in place of "you need `using Units.SI`".

Multiplies the measure by a plain number, keeping its unit.

The unit is unchanged, so this scales a quantity rather than converting it: three of a two-second interval is six seconds.

**Parameters**

  - `multiplier` — the factor to multiply by

**Returns**: the scaled measure

**Examples**

```kex
2.sec.scale(3).to(String)     # => "6.0 s"
1.hour.scale(0.5).to(String)  # => "0.5 h"
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
(2.sec ^ 2).to(String)   # => "4.0 s^2"
```

#### `convertTo`

```kex
convertTo(unit: Unit) -> Result<Measure, String>
```

Converts the measure to another unit of the same dimension.

Answers `Error` when the dimensions differ: you cannot express seconds in bytes, and this says so rather than producing a wrong number.

Convert through the Unit trait so units from opt-in modules (SI, Data, and future domains) remain interchangeable with prelude time units.

**Parameters**

  - `unit` — the unit to convert to

**Returns**: the converted measure, or why it could not be

**Examples**

```kex
1.day.convertTo(Hour).map { |m| m.to(String) }     # => Ok("24.0 h")
90.minute.convertTo(Hour).map { |m| m.to(String) } # => Ok("1.5 h")
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
90.minute.convert(Hour).map { |m| m.to(String) }   # => Ok("1.5 h")
```

#### `+`

```kex
+(other: Measure) -> Result<Measure, String>
```

Adds two measures of the same dimension.

The units need not match: the sum goes through the canonical values, and comes back displayed in the LEFT operand's unit. Adding measures of different dimensions is an `Error`.

**Parameters**

  - `other` — the measure to add

**Returns**: the sum, or why they could not be added

**Examples**

```kex
(1.hour + 30.minute).map { |m| m.to(String) }   # => Ok("1.5 h")
(30.minute + 1.hour).map { |m| m.to(String) }   # => Ok("90.0 min")
```

#### `-`

```kex
-(other: Measure) -> Result<Measure, String>
```

Subtracts a measure of the same dimension.

Like +++, the result is displayed in the left operand's unit, and mixing dimensions is an `Error`.

**Parameters**

  - `other` — the measure to subtract

**Returns**: the difference, or why they could not be subtracted

**Examples**

```kex
(1.hour - 30.minute).map { |m| m.to(String) }   # => Ok("0.5 h")
```

### Defined in other modules

  - [Units.Data](units/data.md#make-measure): [`factor`](units/data.md#measure-factor), [`kind`](units/data.md#measure-kind), [`symbol`](units/data.md#measure-symbol)
  - [Units.SI](units/si.md#make-measure): [`factor`](units/si.md#measure-factor), [`kind`](units/si.md#measure-kind), [`symbol`](units/si.md#measure-symbol), [`kilo`](units/si.md#measure-kilo), [`*`](units/si.md#measure-op-times), [`/`](units/si.md#measure-op-div), [`product`](units/si.md#measure-product), [`quotient`](units/si.md#measure-quotient), [`productKind`](units/si.md#measure-productkind), [`quotientKind`](units/si.md#measure-quotientkind), [`productSymbol`](units/si.md#measure-productsymbol), [`quotientSymbol`](units/si.md#measure-quotientsymbol)

## record `Duration`

An elapsed span of time, in seconds.

Duration is an elapsed span used by Time, Date, and DateTime. A time Measure is deliberately not a Duration: `5.sec` describes a measurement.

**Fields**

  - `seconds` : [Float](number.md#make-float)

### Defined in other modules

  - [Time](time.md#make-duration): [`+`](time.md#duration-op-plus), [`-`](time.md#duration-op-minus), [`negated`](time.md#duration-negated), [`*`](time.md#duration-op-times), [`/`](time.md#duration-op-div), [`abs`](time.md#duration-abs), [`zero?`](time.md#duration-zero?), [`negative?`](time.md#duration-negative?), [`positive?`](time.md#duration-positive?), [`shorterThan?`](time.md#duration-shorterthan?), [`longerThan?`](time.md#duration-longerthan?), [`wholeMilliseconds`](time.md#duration-wholemilliseconds), [`wholeSeconds`](time.md#duration-wholeseconds), [`wholeMinutes`](time.md#duration-wholeminutes), [`wholeHours`](time.md#duration-wholehours), [`wholeDays`](time.md#duration-wholedays), [`wholeWeeks`](time.md#duration-wholeweeks), [`compareTo`](time.md#duration-compareto)

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

### Methods

#### `factor` (from Unit)

```kex
factor(_)
```

#### `kind` (from Unit)



#### `symbol` (from Unit)

```kex
symbol(_)
```

## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

Time-unit constructors on `Integer`: `5.sec`, `90.minute`, `2.week`.

Each answers a `Measure` whose display unit is the one you named, so `90.minute` prints as minutes even though it is stored as 5400 seconds.

### `nanosecond`

```kex
nanosecond : Measure
```

This many nanoseconds, as a `Measure`.

**Returns**: the quantity, displayed in nanoseconds

**Examples**

```kex
100.nanosecond.to(String)   # => "100.0 ns"
```

### `microsecond`

```kex
microsecond : Measure
```

This many microseconds, as a `Measure`.

**Returns**: the quantity, displayed in microseconds

**Examples**

```kex
250.microsecond.to(String)   # => "250.0 μs"
```

### `millisecond`

```kex
millisecond : Measure
```

This many milliseconds, as a `Measure`.

**Returns**: the quantity, displayed in milliseconds

**Examples**

```kex
500.millisecond.to(String)   # => "500.0 ms"
```

### `sec`

```kex
sec : Measure
```

This many seconds, as a `Measure`. Seconds are the base unit of time, so this is the one everything else converts through.

**Returns**: the quantity, displayed in seconds

**Examples**

```kex
5.sec.to(String)   # => "5.0 s"
```

### `minute`

```kex
minute : Measure
```

This many minutes, as a `Measure`.

**Returns**: the quantity, displayed in minutes

**Examples**

```kex
90.minute.convert(Hour)   # => Ok(1.5 h)
```

### `hour`

```kex
hour : Measure
```

This many hours, as a `Measure`.

**Returns**: the quantity, displayed in hours

**Examples**

```kex
(1.hour + 30.minute).map { |m| m.to(String) }   # => Ok("1.5 h")
```

### `day`

```kex
day : Measure
```

This many days, as a `Measure`.

**Returns**: the quantity, displayed in days

**Examples**

```kex
1.day.convertTo(Hour).map { |m| m.to(String) }   # => Ok("24.0 h")
```

### `week`

```kex
week : Measure
```

This many weeks, as a `Measure`.

**Returns**: the quantity, displayed in weeks

**Examples**

```kex
2.week.to(String)   # => "2.0 wk"
```

### `timeMeasure`

```kex
timeMeasure(unit: TimeUnit) -> Measure
```

## extends `Float`

More methods of [`Float`](number.md#make-float), added by this module.

The same time-unit constructors on `Float`, for fractional quantities: `1.5.hour`, `0.25.sec`.

### `nanosecond`

```kex
nanosecond : Measure
```

This many nanoseconds, as a `Measure`.

**Returns**: the quantity, displayed in nanoseconds

### `microsecond`

```kex
microsecond : Measure
```

This many microseconds, as a `Measure`.

**Returns**: the quantity, displayed in microseconds

### `millisecond`

```kex
millisecond : Measure
```

This many milliseconds, as a `Measure`.

**Returns**: the quantity, displayed in milliseconds

**Examples**

```kex
2.5.millisecond.to(String)   # => "2.5 ms"
```

### `sec`

```kex
sec : Measure
```

This many seconds, as a `Measure`.

**Returns**: the quantity, displayed in seconds

**Examples**

```kex
0.25.sec.to(String)   # => "0.25 s"
```

### `minute`

```kex
minute : Measure
```

This many minutes, as a `Measure`.

**Returns**: the quantity, displayed in minutes

### `hour`

```kex
hour : Measure
```

This many hours, as a `Measure`.

**Returns**: the quantity, displayed in hours

**Examples**

```kex
1.5.hour.to(String)   # => "1.5 h"
```

### `day`

```kex
day : Measure
```

This many days, as a `Measure`.

**Returns**: the quantity, displayed in days

### `week`

```kex
week : Measure
```

This many weeks, as a `Measure`.

**Returns**: the quantity, displayed in weeks

### `timeMeasure`

```kex
timeMeasure(unit: TimeUnit) -> Measure
```

## module `Units`

The time units are prelude-global, because every unit module measures against the same dimensions: `Units.SI` defines `Watt * Hour` with the `Hour` declared above, and future domains do the same. That makes `Hour` correct but not obviously located, so the same constructors are reachable under `Units` too, for call sites that would rather name where a unit comes from. These are aliases, not copies: each binds the identical constructor, so `Units.Hour` and `Hour` match the same patterns and compare equal.

### `Nanosecond` (constant)



### `Microsecond` (constant)



### `Millisecond` (constant)



### `Second` (constant)



### `Minute` (constant)



### `Hour` (constant)



### `Day` (constant)



### `Week` (constant)


