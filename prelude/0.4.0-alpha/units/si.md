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

SI units: metres, grams, watts, volts and the rest, with prefixes and dimensional arithmetic.

Opt-in: nothing here is in scope until `using Units.SI`.

```kex
using Units.SI

main do
  IO.printLine(3.kilo.watt.to(String))          # prints: 3000.0 W
  IO.printLine(5000.meter.kilo.to(String))      # prints: 5.0 km
  IO.printLine((100.meter / 10.sec).to(String)) # prints: 10.0 m/s
end
```

Every value is a `Measure` from the prelude, so the arithmetic, conversion and comparison described there apply unchanged. What this module adds is the SI vocabulary, the prefixes, and a table of which dimension results from multiplying or dividing two others, so `2.newton * 3.meter` answers in joules and `100.meter / 10.sec` in metres per second.

## type `SIUnit`

The SI units this module names.

Each carries its dimension (`:length`, `:mass`, `:power`, …) and its symbol, which is what a `Measure` built from it displays with.



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

A decimal prefix applied to a unit, for display.

A display prefix carries the unit it will display, for example `Kilo(Watt * Hour)`. Pass one to `to(String, in:)` to render a measure at that scale.

```kex
1500.watt.to(String, in: Kilo(Watt))   # => Just("1.5 kW")
```



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

`value` metres, as a `Measure`.


```kex
meter(value)
```


## function `gram`

`value` grams, as a `Measure`.


```kex
gram(value)
```


## function `kilogram`

`value` kilograms, as a `Measure`.


```kex
kilogram(value)
```


## function `kelvin`

`value` kelvin, as a `Measure`.


```kex
kelvin(value)
```


## function `liter`

`value` litres, as a `Measure`.


```kex
liter(value)
```


## function `newton`

`value` newtons, as a `Measure`.


```kex
newton(value)
```


## function `joule`

`value` joules, as a `Measure`.


```kex
joule(value)
```


## function `watt`

`value` watts, as a `Measure`.


```kex
watt(value)
```


## function `volt`

`value` volts, as a `Measure`.


```kex
volt(value)
```


## function `ampere`

`value` amperes, as a `Measure`.


```kex
ampere(value)
```


## function `ohm`

`value` ohms, as a `Measure`.


```kex
ohm(value)
```


## function `coulomb`

`value` coulombs, as a `Measure`.


```kex
coulomb(value)
```


## make `SIUnit`


#### `*`

```kex
*(@Watt, @Hour)
```

## function `to`

Renders a measure as its value followed by its unit symbol.


```kex
to(measure, String)
```


## function `mega`

The same measure, displayed with the mega- prefix.


```kex
mega(measure)
```


## function `giga`

The same measure, displayed with the giga- prefix.


```kex
giga(measure)
```


## function `milli`

The same measure, displayed with the milli- prefix.


```kex
milli(measure)
```


## function `micro`

The same measure, displayed with the micro- prefix.


```kex
micro(measure)
```


## function `nano`

The same measure, displayed with the nano- prefix.


```kex
nano(measure)
```


## function `per`

Divides one measure by another, naming the resulting dimension.

The spelled-out form of `/`: `100.meter.per(10.sec)` and `100.meter / 10.sec` are the same call. Metres over seconds is speed, energy over time is power, force over area is pressure: the dimension table decides, and the symbol follows it.


```kex
per(measure, other) : Measure -> Measure -> Measure
```


## function `times`

Multiplies one measure by another, naming the resulting dimension.

The spelled-out form of `*`. Force times distance is energy, voltage times current is power, power times time is energy.


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
