---
package: prelude
version: "0.4.0-alpha"
source: units/data.kex
title: Units.Data
entities:
  - { kind: module, name: "Units.Data" }
---

# Units.Data

## module `Units.Data`

### `size`

```kex
size(value: Number, unit: DataUnit) -> Measure
```

### `convertTo`

```kex
convertTo(measure: Measure, unit: DataUnit) -> Result<Measure, String>
```

### `to`

```kex
to(measure: Measure, _, in: DataPrefix) -> String?
```

Data prefixes select their standard decimal byte unit.  They are targets for formatting, so `Mega` means MB rather than a prefix applied twice to the measure's existing unit.

### `byteSize`

```kex
byteSize(value: Number) -> Measure
```

### `kilobytes`

```kex
kilobytes(value: Number) -> Measure
```

### `megabytes`

```kex
megabytes(value: Number) -> Measure
```

### `gigabytes`

```kex
gigabytes(value: Number) -> Measure
```

### `terabytes`

```kex
terabytes(value: Number) -> Measure
```

### `kibibytes`

```kex
kibibytes(value: Number) -> Measure
```

### `mebibytes`

```kex
mebibytes(value: Number) -> Measure
```

### `gibibytes`

```kex
gibibytes(value: Number) -> Measure
```

### `tebibytes`

```kex
tebibytes(value: Number) -> Measure
```

## type `DataUnit`

**Variants**

  - `B`
  - `KB`
  - `MB`
  - `GB`
  - `TB`
  - `KiB`
  - `MiB`
  - `GiB`
  - `TiB`

Implements [`Unit`](../units.md#trait-unit).

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

## type `DataPrefix`

**Variants**

  - `Kilo`
  - `Mega`
  - `Giga`



## extends `UnitDefinition`

More methods of [`UnitDefinition`](../units.md#record-unitdefinition), added by this module.

Implements [`Unit`](../units.md#trait-unit).

### `factor` (from Unit)



### `kind` (from Unit)



### `symbol` (from Unit)



## extends `Measure`

More methods of [`Measure`](../units.md#record-measure), added by this module.

### `factor`

```kex
factor : Float
```

### `kind`

```kex
kind : Atom
```

### `symbol`

```kex
symbol : String
```
