---
package: prelude
version: "0.4.0-beta.5-dev"
source: units/dynamic.kex
title: Units.Dynamic
entities:
  - { kind: module, name: "Units.Dynamic" }
---

# Units.Dynamic

## module `Units.Dynamic`

Runtime dimensional quantities. Unit dimensions use nominal Type identities, and all arithmetic composes the same normalized exponent maps.

### `unit`

```kex
unit(scale: Float, dimension: Dimension, notation: String) -> Result<DynamicUnit, UnitError>
```

Define a positive, finite scale to the dimension's canonical unit.

### `measure`

```kex
measure(value: Float, unit: DynamicUnit) -> DynamicMeasure
```

Build a quantity in its preferred display unit.

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

Preserve grouping in display expressions as well as dimensions and scale.

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
value : Float
```

Display magnitude is derived, never a second independently stored value.

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

Ordering ignores display preferences but requires compatible dimensions.

#### `scalar`

```kex
scalar : Result<Float, UnitError>
```

## type `UnitError`

**Variants**

  - `InvalidScale(Float)`
  - `ScaleOverflow`
  - `DimensionMismatch(Dimension, Dimension)`


