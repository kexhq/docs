---
package: prelude
version: "0.4.0-alpha"
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

## trait `Unit`

Numbers that carry a unit.

Writing `5.sec` or `90.minute` gives you a `Measure`: a number, the unit it was written in, and the same quantity in that dimension's base unit. Adding, subtracting and converting all go through the canonical value, so the arithmetic is right regardless of which units the operands were written in, and mixing dimensions is an `Error` rather than a silently wrong number.

```kex
5.sec.to(String)                     # => "5.0 s"
1.5.hour.to(String)                  # => "1.5 h"
(1.hour ` 30.minute).map(~to(String))  # => Ok("1.5 h")
90.minute.convert(Hour)              # => Ok(1.5 h)
```

The time units (`nanosecond` through `week`) are in the prelude. Other dimensions live in opt-in modules under `Units`, and every one of them measures against the same machinery here.

A `Measure` is a measurement, not an elapsed span: `5.sec` describes a quantity, while `Duration` is what `Time` and `Date+ use for a span between two moments.

The trait a unit implements: how it converts to its dimension's base unit, which dimension that is, and how it is written.


#### `factor`

How many base units one of this unit is: `60.0` for a minute, whose base unit is the second.

```kex
factor : Float
```

**Returns**: `Float` — the conversion factor

**Examples**

```kex
Minute.factor   # => 60.0
```

#### `kind`

Which dimension this unit measures, as an atom. Only measures of the same kind can be added or converted between.

```kex
kind : Atom
```

**Returns**: `Atom` — the dimension tag

**Examples**

```kex
Second.kind   # => :time
```

#### `symbol`

How this unit is written when a measure is displayed.

```kex
symbol : String
```

**Returns**: `String` — the unit's symbol

**Examples**

```kex
Minute.symbol   # => "min"
```

## function `measureKind`

The dimension a measure belongs to.


```kex
measureKind(measure)
```


## function `measureSymbol`

The symbol a measure displays with.


```kex
measureSymbol(measure)
```


## function `measureFactor`

The conversion factor of a measure's unit.


```kex
measureFactor(measure)
```


## record `UnitDefinition`

A unit described at run time rather than by a constructor.

Runtime-defined units are used for prefixes and units derived by arithmetic: `s^2` from squaring a duration, a kilo- prefix applied to a base unit.

**Fields**

  - `conversionFactor` : Float
  - `dimension` : Atom
  - `notation` : String

## make `UnitDefinition` implements [Unit](#trait-unit)



## record `Measure`

A quantity with a unit.

A Measure is shared by every unit module. `canonical` stores the value in that dimension's base unit; its Unit controls its display. That split is what makes `1.hour ` 30.minute+ correct and still print in hours.

**Fields**

  - `canonical` : Float
  - `value` : Float
  - `unit` : UnitDefinition

## record `Duration`

An elapsed span of time, in seconds.

Duration is an elapsed span used by Time, Date, and DateTime. A time Measure is deliberately not a Duration: `5.sec` describes a measurement.

**Fields**

  - `seconds` : Float

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

## make `TimeUnit` implements [Unit](#trait-unit)


#### `factor`

```kex
factor(@Nanosecond)
```

#### `symbol`

```kex
symbol(@Nanosecond)
```

## make `Integer`

Time-unit constructors on `Integer`: `5.sec`, `90.minute`, `2.week`.

Each answers a `Measure` whose display unit is the one you named, so `90.minute` prints as minutes even though it is stored as 5400 seconds.


#### `timeMeasure`

```kex
timeMeasure(unit)
```

## make `Float`

The same time-unit constructors on `Float`, for fractional quantities: `1.5.hour`, `0.25.sec`.


#### `timeMeasure`

```kex
timeMeasure(unit)
```

## make `Measure`


#### `to`

```kex
to(String)
```

#### `scale`

Formatting into a target display unit deliberately has NO prelude clause. A unit module (Units.SI, Units.Data, ...) supplies `to(String, in:)` for the units it owns, and reaching one requires importing it. A catch-all here would answer `None` for an un-imported module instead: a silently empty Optional in place of "you need `using Units.SI`".

Multiplies the measure by a plain number, keeping its unit.

The unit is unchanged, so this scales a quantity rather than converting it: three of a two-second interval is six seconds.

```kex
scale(multiplier)
```

**Returns**: `Measure` — the scaled measure

**Examples**

```kex
2.sec.scale(3).to(String)     # => "6.0 s"
1.hour.scale(0.5).to(String)  # => "0.5 h"
```

#### `^`

Raises the measure to a power, recording the derived unit in its notation.

Raising a measure preserves its display unit while applying the power to its canonical value, display value, and conversion factor. The current Unit trait represents a dimension as one Atom, so the dimension remains the base kind; the notation records the derived unit (for example `s^2`).

```kex
^(exponent)
```

**Returns**: `Measure` — the raised measure

**Examples**

```kex
(2.sec ^ 2).to(String)   # => "4.0 s^2"
```

#### `convertTo`

Converts the measure to another unit of the same dimension.

Answers `Error` when the dimensions differ: you cannot express seconds in bytes, and this says so rather than producing a wrong number.

Convert through the Unit trait so units from opt-in modules (SI, Data, and future domains) remain interchangeable with prelude time units.

```kex
convertTo(unit)
```

**Returns**: `Result<Measure, String>` — the converted measure, or why it could not be

**Examples**

```kex
1.day.convertTo(Hour).map { |m| m.to(String) }     # => Ok("24.0 h")
90.minute.convertTo(Hour).map { |m| m.to(String) } # => Ok("1.5 h")
```

#### `convert`

Converts the measure to another time unit. The short spelling of `convertTo`, kept for prelude time measures.

```kex
convert(unit)
```

**Returns**: `Result<Measure, String>` — the converted measure, or why it could not be

**Examples**

```kex
90.minute.convert(Hour).map { |m| m.to(String) }   # => Ok("1.5 h")
```

#### `+`

Adds two measures of the same dimension.

The units need not match: the sum goes through the canonical values, and comes back displayed in the LEFT operand's unit. Adding measures of different dimensions is an `Error`.

```kex
+(other)
```

**Returns**: `Result<Measure, String>` — the sum, or why they could not be added

**Examples**

```kex
(1.hour ` 30.minute).map { |m| m.to(String) }   # => Ok("1.5 h")
(30.minute ` 1.hour).map { |m| m.to(String) }   # => Ok("90.0 min")
```

#### `-`

Subtracts a measure of the same dimension.

Like ```, the result is displayed in the left operand's unit, and mixing dimensions is an `Error+.

```kex
-(other)
```

**Returns**: `Result<Measure, String>` — the difference, or why they could not be subtracted

**Examples**

```kex
(1.hour - 30.minute).map { |m| m.to(String) }   # => Ok("0.5 h")
```

## module `Units`

The time units are prelude-global, because every unit module measures against the same dimensions: `Units.SI` defines `Watt * Hour` with the `Hour` declared above, and future domains do the same. That makes `Hour` correct but not obviously located, so the same constructors are reachable under `Units` too, for call sites that would rather name where a unit comes from. These are aliases, not copies: each binds the identical constructor, so `Units.Hour` and `Hour` match the same patterns and compare equal.

## constant `Nanosecond`



## constant `Microsecond`



## constant `Millisecond`



## constant `Second`



## constant `Minute`



## constant `Hour`



## constant `Day`



## constant `Week`


