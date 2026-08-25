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

## type `SIPrefix`

A display prefix carries the unit it will display, for example `Kilo(Watt * Hour)`.



**Variants**

  - `Kilo(Unit)`
  - `Mega(Unit)`
  - `Giga(Unit)`
  - `Milli(Unit)`
  - `Micro(Unit)`
  - `Nano(Unit)`

## make `SIPrefix` implements [Unit](../units.md#trait-unit)


#### `factor`

```kex
factor(@Kilo(unit))
```

#### `kind`

```kex
kind(@Kilo(unit))
```

#### `symbol`

```kex
symbol(@Kilo(unit))
```

## make `SIUnit` implements [Unit](../units.md#trait-unit)


#### `kind`

```kex
kind(@Meter)
```

#### `symbol`

```kex
symbol(@Meter)
```

## make `UnitDefinition` implements [Unit](../units.md#trait-unit)



## make `Measure`



## function `meter`


```kex
meter(value)
```


## function `gram`


```kex
gram(value)
```


## function `kilogram`


```kex
kilogram(value)
```


## function `kelvin`


```kex
kelvin(value)
```


## function `liter`


```kex
liter(value)
```


## function `newton`


```kex
newton(value)
```


## function `joule`


```kex
joule(value)
```


## function `watt`


```kex
watt(value)
```


## function `volt`


```kex
volt(value)
```


## function `ampere`


```kex
ampere(value)
```


## function `ohm`


```kex
ohm(value)
```


## function `coulomb`


```kex
coulomb(value)
```


## make `SIUnit`


#### `*`

```kex
*(@Watt, @Hour)
```

## function `to`


```kex
to(measure, String)
```


## function `mega`


```kex
mega(measure)
```


## function `giga`


```kex
giga(measure)
```


## function `milli`


```kex
milli(measure)
```


## function `micro`


```kex
micro(measure)
```


## function `nano`


```kex
nano(measure)
```


## function `per`


```kex
per(measure, other) : Measure -> Measure -> Measure
```


## function `times`


```kex
times(measure, other) : Measure -> Measure -> Measure
```


## make `Measure`

Prefixes work both on an existing measure (`5000.meter.kilo`) and at the beginning of a postfix unit expression (`3.kilo.watt`).



## make `Integer`



## make `Float`



## make `Measure`


#### `*`

```kex
*(other)
```

#### `/`

```kex
/(other)
```

#### `product`

```kex
product(other)
```

#### `quotient`

```kex
quotient(other)
```

#### `productKind`

```kex
productKind(mass, acceleration)
```

#### `quotientKind`

```kex
quotientKind(length, time)
```

#### `productSymbol`

```kex
productSymbol(force, _, _)
```

#### `quotientSymbol`

```kex
quotientSymbol(speed, left, _)
```
