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

## function `measureKind`


```kex
measureKind(measure)
```


## function `measureSymbol`


```kex
measureSymbol(measure)
```


## function `measureFactor`


```kex
measureFactor(measure)
```


## record `UnitDefinition`

Runtime-defined units are used for prefixes and units derived by arithmetic.

**Fields**

  - `conversionFactor` : Float
  - `dimension` : Atom
  - `notation` : String

## make `UnitDefinition` implements [Unit](#trait-unit)



## record `Measure`

A Measure is shared by every unit module. `canonical` stores the value in that dimension's base unit; its Unit controls its display.

**Fields**

  - `canonical` : Float
  - `value` : Float
  - `unit` : UnitDefinition

## record `Duration`

Duration is an elapsed span used by Time, Date, and DateTime. A time Measure is deliberately not a Duration: `5.sec` describes a measurement.

**Fields**

  - `seconds` : Float

## type `TimeUnit`



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


#### `timeMeasure`

```kex
timeMeasure(unit)
```

## make `Float`


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

Formatting into a target display unit deliberately has NO prelude clause. A unit module (Units.SI, Units.Data, ...) supplies `to(String, in:)` for the units it owns, and reaching one requires importing it. A catch-all here would answer `None` for an un-imported module instead — a silently empty Optional in place of "you need `using Units.SI`".

```kex
scale(multiplier)
```

#### `^`

Raising a measure preserves its display unit while applying the power to its canonical value, display value, and conversion factor. The current Unit trait represents a dimension as one Atom, so the dimension remains the base kind; the notation records the derived unit (for example `s^2`).

```kex
^(exponent)
```

#### `convertTo`

Convert through the Unit trait so units from opt-in modules (SI, Data, and future domains) remain interchangeable with prelude time units.

```kex
convertTo(unit)
```

#### `convert`

Short time-unit spelling retained for prelude time measures.

```kex
convert(unit)
```

#### `+`

```kex
+(other)
```

#### `-`

```kex
-(other)
```

## module `Units`

The time units are prelude-global, because every unit module measures against the same dimensions — `Units.SI` defines `Watt * Hour` with the `Hour` declared above, and future domains do the same. That makes `Hour` correct but not obviously located, so the same constructors are reachable under `Units` too, for call sites that would rather name where a unit comes from. These are aliases, not copies: each binds the identical constructor, so `Units.Hour` and `Hour` match the same patterns and compare equal.

## constant `Nanosecond`



## constant `Microsecond`



## constant `Millisecond`



## constant `Second`



## constant `Minute`



## constant `Hour`



## constant `Day`



## constant `Week`


