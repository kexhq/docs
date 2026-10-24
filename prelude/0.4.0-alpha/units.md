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

Implemented by [`UnitDefinition`](#make-unitdefinition), [`TimeUnit`](#make-timeunit), [`DataUnit`](units/data.md#make-dataunit), [`UnitDefinition`](units/data.md#make-unitdefinition), [`SIPrefix`](units/si.md#make-siprefix), [`SIUnit`](units/si.md#make-siunit), [`UnitDefinition`](units/si.md#make-unitdefinition).

### Required methods

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
measureKind(measure: Measure) -> Atom
```

## function `measureSymbol`

```kex
measureSymbol(measure: Measure) -> String
```

## function `measureFactor`

```kex
measureFactor(measure: Measure) -> Float
```

## record `UnitDefinition`

Runtime-defined units are used for prefixes and units derived by arithmetic.

**Fields**

  - `conversionFactor` : [Float](number.md#make-float)
  - `dimension` : Atom
  - `notation` : [String](string.md#make-string)

Implements [`Unit`](#trait-unit).

### Methods

#### `factor` (from Unit)



#### `kind` (from Unit)



#### `symbol` (from Unit)



### Defined in other modules

  - [Units.Data](units/data.md#make-unitdefinition): [`factor`](units/data.md#unitdefinition-factor), [`kind`](units/data.md#unitdefinition-kind), [`symbol`](units/data.md#unitdefinition-symbol)
  - [Units.SI](units/si.md#make-unitdefinition): [`factor`](units/si.md#unitdefinition-factor), [`kind`](units/si.md#unitdefinition-kind), [`symbol`](units/si.md#unitdefinition-symbol)

## record `Measure`

A Measure is shared by every unit module. `canonical` stores the value in that dimension's base unit; its Unit controls its display.

**Fields**

  - `canonical` : [Float](number.md#make-float)
  - `value` : [Float](number.md#make-float)
  - `unit` : [UnitDefinition](#record-unitdefinition)

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

#### `scale`

```kex
scale(multiplier: Number) -> Measure
```

Formatting into a target display unit deliberately has NO prelude clause. A unit module (Units.SI, Units.Data, ...) supplies `to(String, in:)` for the units it owns, and reaching one requires importing it. A catch-all here would answer `None` for an un-imported module instead — a silently empty Optional in place of "you need `using Units.SI`".

#### `^`

```kex
^(exponent: Number) -> Measure
```

Raising a measure preserves its display unit while applying the power to its canonical value, display value, and conversion factor. The current Unit trait represents a dimension as one Atom, so the dimension remains the base kind; the notation records the derived unit (for example `s^2`).

#### `convertTo`

```kex
convertTo(unit: Unit) -> Result<Measure, String>
```

Convert through the Unit trait so units from opt-in modules (SI, Data, and future domains) remain interchangeable with prelude time units.

#### `convert`

```kex
convert(unit: TimeUnit) -> Result<Measure, String>
```

Short time-unit spelling retained for prelude time measures.

#### `+`

```kex
+(other: Measure) -> Result<Measure, String>
```

#### `-`

```kex
-(other: Measure) -> Result<Measure, String>
```

### Defined in other modules

  - [Units.Data](units/data.md#make-measure): [`factor`](units/data.md#measure-factor), [`kind`](units/data.md#measure-kind), [`symbol`](units/data.md#measure-symbol)
  - [Units.SI](units/si.md#make-measure): [`factor`](units/si.md#measure-factor), [`kind`](units/si.md#measure-kind), [`symbol`](units/si.md#measure-symbol), [`kilo`](units/si.md#measure-kilo), [`*`](units/si.md#measure-op-times), [`/`](units/si.md#measure-op-div), [`product`](units/si.md#measure-product), [`quotient`](units/si.md#measure-quotient), [`productKind`](units/si.md#measure-productkind), [`quotientKind`](units/si.md#measure-quotientkind), [`productSymbol`](units/si.md#measure-productsymbol), [`quotientSymbol`](units/si.md#measure-quotientsymbol)

## record `Duration`

Duration is an elapsed span used by Time, Date, and DateTime. A time Measure is deliberately not a Duration: `5.sec` describes a measurement.

**Fields**

  - `seconds` : [Float](number.md#make-float)



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

### `nanosecond`

```kex
nanosecond : Measure
```

### `microsecond`

```kex
microsecond : Measure
```

### `millisecond`

```kex
millisecond : Measure
```

### `sec`

```kex
sec : Measure
```

### `minute`

```kex
minute : Measure
```

### `hour`

```kex
hour : Measure
```

### `day`

```kex
day : Measure
```

### `week`

```kex
week : Measure
```

### `timeMeasure`

```kex
timeMeasure(unit: TimeUnit) -> Measure
```

## extends `Float`

More methods of [`Float`](number.md#make-float), added by this module.

### `nanosecond`

```kex
nanosecond : Measure
```

### `microsecond`

```kex
microsecond : Measure
```

### `millisecond`

```kex
millisecond : Measure
```

### `sec`

```kex
sec : Measure
```

### `minute`

```kex
minute : Measure
```

### `hour`

```kex
hour : Measure
```

### `day`

```kex
day : Measure
```

### `week`

```kex
week : Measure
```

### `timeMeasure`

```kex
timeMeasure(unit: TimeUnit) -> Measure
```

## module `Units`

The time units are prelude-global, because every unit module measures against the same dimensions — `Units.SI` defines `Watt * Hour` with the `Hour` declared above, and future domains do the same. That makes `Hour` correct but not obviously located, so the same constructors are reachable under `Units` too, for call sites that would rather name where a unit comes from. These are aliases, not copies: each binds the identical constructor, so `Units.Hour` and `Hour` match the same patterns and compare equal.

### `Nanosecond` (constant)



### `Microsecond` (constant)



### `Millisecond` (constant)



### `Second` (constant)



### `Minute` (constant)



### `Hour` (constant)



### `Day` (constant)



### `Week` (constant)


