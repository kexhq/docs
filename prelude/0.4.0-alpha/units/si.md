---
package: prelude
version: "0.4.0-alpha"
source: units/si.kex
title: Units.SI
entities:
  - { kind: module, name: "Units.SI" }
---

# Units.SI

## module `Units.SI`

### `meter`

```kex
meter(value: Number) -> Measure
```

### `gram`

```kex
gram(value: Number) -> Measure
```

### `kilogram`

```kex
kilogram(value: Number) -> Measure
```

### `kelvin`

```kex
kelvin(value: Number) -> Measure
```

### `liter`

```kex
liter(value: Number) -> Measure
```

### `newton`

```kex
newton(value: Number) -> Measure
```

### `joule`

```kex
joule(value: Number) -> Measure
```

### `watt`

```kex
watt(value: Number) -> Measure
```

### `volt`

```kex
volt(value: Number) -> Measure
```

### `ampere`

```kex
ampere(value: Number) -> Measure
```

### `ohm`

```kex
ohm(value: Number) -> Measure
```

### `coulomb`

```kex
coulomb(value: Number) -> Measure
```

### `to`

```kex
to(measure: Measure, _, in: SIPrefix) -> String
```

### `mega`

```kex
mega(measure: Measure) -> Measure
```

### `giga`

```kex
giga(measure: Measure) -> Measure
```

### `milli`

```kex
milli(measure: Measure) -> Measure
```

### `micro`

```kex
micro(measure: Measure) -> Measure
```

### `nano`

```kex
nano(measure: Measure) -> Measure
```

### `per`

```kex
per(measure: Measure, other: Measure) -> Measure
```

### `times`

```kex
times(measure: Measure, other: Measure) -> Measure
```

## type `SIUnit`

**Variants**

  - `Meter`
  - `Gram`
  - `Kilogram`
  - `Kelvin`
  - `Liter`
  - `Newton`
  - `Joule`
  - `Watt`
  - `Volt`
  - `Ampere`
  - `Ohm`
  - `Coulomb`

Implements [`Unit`](../units.md#trait-unit).

### Methods

#### `factor` (from Unit)



#### `kind` (from Unit)

```kex
kind(_)
```

#### `symbol` (from Unit)

```kex
symbol(_)
```

#### `*`

```kex
*(_, _) -> UnitDefinition
```

## type `SIPrefix`

A display prefix carries the unit it will display, for example `Kilo(Watt * Hour)`.

**Variants**

  - `Kilo(Unit)`
  - `Mega(Unit)`
  - `Giga(Unit)`
  - `Milli(Unit)`
  - `Micro(Unit)`
  - `Nano(Unit)`

Implements [`Unit`](../units.md#trait-unit).

### Methods

#### `factor` (from Unit)

```kex
factor(_)
```

#### `kind` (from Unit)

```kex
kind(_)
```

#### `symbol` (from Unit)

```kex
symbol(_)
```

## extends `UnitDefinition`

More methods of [`UnitDefinition`](../units.md#record-unitdefinition), added by this module.

Implements [`Unit`](../units.md#trait-unit).

### `factor` (from Unit)



### `kind` (from Unit)



### `symbol` (from Unit)



## extends `Measure`

More methods of [`Measure`](../units.md#record-measure), added by this module.

Prefixes work both on an existing measure (`5000.meter.kilo`) and at the beginning of a postfix unit expression (`3.kilo.watt`).

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

### `kilo`

```kex
kilo : Measure
```

### `*`

```kex
*(other: Measure) -> Measure
```

### `/`

```kex
/(other: Measure) -> Measure
```

### `product`

```kex
product(other) -> Measure
```

### `quotient`

```kex
quotient(other) -> Measure
```

### `productKind`

```kex
productKind(left, _)
```

### `quotientKind`

```kex
quotientKind(left, _)
```

### `productSymbol`

```kex
productSymbol(_, left, right)
```

### `quotientSymbol`

```kex
quotientSymbol(_, left, right)
```

## extends `Integer`

More methods of [`Integer`](../number.md#make-integer), added by this module.

### `kilo`

```kex
kilo : Float
```

## extends `Float`

More methods of [`Float`](../number.md#make-float), added by this module.

### `kilo`

```kex
kilo : Float
```
