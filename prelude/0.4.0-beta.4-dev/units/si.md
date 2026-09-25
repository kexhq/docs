---
package: prelude
version: "0.4.0-beta.4-dev"
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

### `meter`

```kex
meter(value: Number) -> Measure
```

`value` metres, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the length

**Examples**

```kex
5000.meter.to(String)        # => "5000.0 m"
5000.meter.kilo.to(String)   # => "5.0 km"
```

### `gram`

```kex
gram(value: Number) -> Measure
```

`value` grams, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the mass

**Examples**

```kex
500.gram.to(String)   # => "500.0 g"
```

### `kilogram`

```kex
kilogram(value: Number) -> Measure
```

`value` kilograms, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the mass

**Examples**

```kex
1.kilogram.to(String)   # => "1.0 kg"
```

### `kelvin`

```kex
kelvin(value: Number) -> Measure
```

`value` kelvin, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the temperature

**Examples**

```kex
300.kelvin.to(String)   # => "300.0 K"
```

### `liter`

```kex
liter(value: Number) -> Measure
```

`value` litres, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the volume

**Examples**

```kex
2.liter.to(String)   # => "2.0 L"
```

### `newton`

```kex
newton(value: Number) -> Measure
```

`value` newtons, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the force

**Examples**

_Force times distance is energy_

```kex
(2.newton * 3.meter).to(String)   # => "6.0 J"
```

### `joule`

```kex
joule(value: Number) -> Measure
```

`value` joules, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the energy

**Examples**

```kex
100.joule.to(String)   # => "100.0 J"
```

### `watt`

```kex
watt(value: Number) -> Measure
```

`value` watts, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the power

**Examples**

```kex
3.kilo.watt.to(String)                 # => "3000.0 W"
1500.watt.to(String, in: Kilo(Watt))   # => Just("1.5 kW")
```

_Power times time is energy_

```kex
(3.kilo.watt * 2.hour).to(String)   # => "21600000.0 J"
```

### `volt`

```kex
volt(value: Number) -> Measure
```

`value` volts, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the voltage

**Examples**

```kex
12.volt.to(String)   # => "12.0 V"
```

### `ampere`

```kex
ampere(value: Number) -> Measure
```

`value` amperes, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the current

**Examples**

_Voltage times current is power_

```kex
(12.volt * 2.ampere).to(String)   # => "24.0 W"
```

### `ohm`

```kex
ohm(value: Number) -> Measure
```

`value` ohms, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the resistance

**Examples**

```kex
470.ohm.to(String)   # => "470.0 Ω"
```

### `coulomb`

```kex
coulomb(value: Number) -> Measure
```

`value` coulombs, as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the charge

**Examples**

```kex
3.coulomb.to(String)   # => "3.0 C"
```

### `to`

```kex
to(measure: Measure, _, in: SIPrefix) -> String
```

Renders a measure as its value followed by its unit symbol.

**Parameters**

  - `String` — the target type

**Returns**: the rendered measure

**Examples**

```kex
5000.meter.to(String)   # => "5000.0 m"
12.volt.to(String)      # => "12.0 V"
```

### `mega`

```kex
mega(measure: Measure) -> Measure
```

The same measure, displayed with the mega- prefix.

**Parameters**

  - `measure` — the measure to rescale for display

**Returns**: the same quantity, displayed in mega-units

**Examples**

```kex
5000000.watt.mega.to(String)   # => "5.0 MW"
```

### `giga`

```kex
giga(measure: Measure) -> Measure
```

The same measure, displayed with the giga- prefix.

**Parameters**

  - `measure` — the measure to rescale for display

**Returns**: the same quantity, displayed in giga-units

### `milli`

```kex
milli(measure: Measure) -> Measure
```

The same measure, displayed with the milli- prefix.

**Parameters**

  - `measure` — the measure to rescale for display

**Returns**: the same quantity, displayed in milli-units

**Examples**

```kex
0.5.watt.milli.to(String)   # => "500.0 mW"
```

### `micro`

```kex
micro(measure: Measure) -> Measure
```

The same measure, displayed with the micro- prefix.

**Parameters**

  - `measure` — the measure to rescale for display

**Returns**: the same quantity, displayed in micro-units

### `nano`

```kex
nano(measure: Measure) -> Measure
```

The same measure, displayed with the nano- prefix.

**Parameters**

  - `measure` — the measure to rescale for display

**Returns**: the same quantity, displayed in nano-units

### `per`

```kex
per(measure: Measure, other: Measure) -> Measure
```

Divides one measure by another, naming the resulting dimension.

The spelled-out form of `/`: `100.meter.per(10.sec)` and `100.meter / 10.sec` are the same call. Metres over seconds is speed, energy over time is power, force over area is pressure: the dimension table decides, and the symbol follows it.

**Parameters**

  - `measure` — the numerator
  - `other` — the denominator

**Returns**: the quotient, in its derived unit

**Examples**

```kex
100.meter.per(10.sec).to(String)   # => "10.0 m/s"
```

### `times`

```kex
times(measure: Measure, other: Measure) -> Measure
```

Multiplies one measure by another, naming the resulting dimension.

The spelled-out form of `*`. Force times distance is energy, voltage times current is power, power times time is energy.

**Parameters**

  - `measure` — the first factor
  - `other` — the second factor

**Returns**: the product, in its derived unit

**Examples**

```kex
2.newton.times(3.meter).to(String)   # => "6.0 J"
(12.volt * 2.ampere).to(String)      # => "24.0 W"
```

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

The same measure, displayed with the kilo- prefix.

**Returns**: the same quantity, displayed in kilo-units

**Examples**

```kex
5000.meter.kilo.to(String)   # => "5.0 km"
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
