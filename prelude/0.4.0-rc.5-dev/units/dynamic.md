---
package: prelude
version: "0.4.0-rc.5-dev"
source: units/dynamic.kex
title: Units.Dynamic
entities:
  - { kind: module, name: "Units.Dynamic" }
---

# Units.Dynamic

## module `Units.Dynamic`

Quantities whose units are built at run time.

`Measure` (units.kex) checks dimensions at compile time. Here a unit is a value: a scale to its dimension's canonical unit, a `Dimension` and a notation. Arithmetic checks dimensions when it runs and returns a `Result`, with `DimensionMismatch` when they do not agree.

```kex
let meters = unit(1.0, Dimensions.base(Length {}), "m").try
let seconds = unit(1.0, Dimensions.base(Time {}), "s").try
let kilometers = meters.scaled(1000.0, "km").try
let hours = seconds.scaled(3600.0, "h").try
let speed = (measure(36.0, kilometers) / measure(1.0, hours)).try
speed.convertTo((meters / seconds).try).try.value   # => 10.0
speed.convertTo(meters).ok?                         # => false
```

### `unit`

```kex
unit(scale: Float, dimension: Dimension, notation: String) -> Result<DynamicUnit, UnitError>
```

Returns a unit that is `scale` times the canonical unit of `dimension`.

`scale` must be positive and finite; otherwise the result is `InvalidScale`.

### `measure`

```kex
measure(value: Float, unit: DynamicUnit) -> DynamicMeasure
```

Returns `value` of `unit`. The unit is kept for display, and the quantity is stored in the canonical unit.

## record `DynamicUnit`

**Fields**

  - `scale` : [Float](../number.md#make-float)
  - `dimension` : [Dimension](../dimensions.md#record-dimensions-dimension)
  - `notation` : [String](../string.md#make-string)

### Functions

#### `*`

```kex
*(other: DynamicUnit) -> Result<DynamicUnit, UnitError>
```

Returns the product of two units. The notation keeps the grouping, as in `"(m)·(s)"`. The result is `ScaleOverflow` when the scales overflow and `InvalidScale` when they underflow.

#### `/`

```kex
/(other: DynamicUnit) -> Result<DynamicUnit, UnitError>
```

#### `pow`

```kex
pow(exponent: Integer) -> Result<DynamicUnit, UnitError>
```

#### `named`

```kex
named(notation: String) -> DynamicUnit
```

#### `scaled`

```kex
scaled(factor: Float, notation: String) -> Result<DynamicUnit, UnitError>
```

## record `DynamicMeasure`

**Fields**

  - `canonical` : [Float](../number.md#make-float)
  - `unit` : [DynamicUnit](#record-units-dynamic-dynamicunit)

### Functions

#### `value`

```kex
value -> Float
```

Returns the quantity's magnitude in its display unit.

#### `convertTo`

```kex
convertTo(target: DynamicUnit) -> Result<DynamicMeasure, UnitError>
```

#### `+`

```kex
+(other: DynamicMeasure) -> Result<DynamicMeasure, UnitError>
```

#### `-`

```kex
-(other: DynamicMeasure) -> Result<DynamicMeasure, UnitError>
```

#### `*`

```kex
*(other: DynamicMeasure) -> Result<DynamicMeasure, UnitError>
```

#### `/`

```kex
/(other: DynamicMeasure) -> Result<DynamicMeasure, UnitError>
```

#### `pow`

```kex
pow(exponent: Integer) -> Result<DynamicMeasure, UnitError>
```

#### `scale`

```kex
scale(factor: Float) -> DynamicMeasure
```

#### `compareTo`

```kex
compareTo(other: DynamicMeasure) -> Result<Ordering, UnitError>
```

Orders two quantities of the same dimension, whatever their display units. Quantities of different dimensions give `DimensionMismatch`.

#### `scalar`

```kex
scalar -> Result<Float, UnitError>
```

## type `UnitError`

**Variants**

  - `InvalidScale(Float)`
  - `ScaleOverflow`
  - `DimensionMismatch(Dimension, Dimension)`


