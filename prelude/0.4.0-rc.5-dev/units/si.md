---
package: prelude
version: "0.4.0-rc.5-dev"
source: units/si.kex
title: Units.SI
entities:
  - { kind: module, name: "Units.SI" }
---

# Units.SI

## module `Units.SI`

SI units such as metres, grams, watts and volts, with prefixes and dimensional arithmetic.

Nothing here is in scope until `using Units.SI`.

```kex
using Units.SI

main do
  IO.printLine(3.kilowatt.to(String))           # prints: 3.0 kW
  IO.printLine(5000.meter.to(String, in: Kilo(Meter)).or("")) # prints: 5.0 km
  IO.printLine((100.meter / 10.second).to(String)) # prints: 10.0 m/s
end
```

Every value is a prelude `Measure`, with its arithmetic, conversion and comparison. This module adds the SI unit names, including prefixed ones such as `kilometer`; the prefixes as units (`Kilo(Meter)`) for `convertTo` and `to(String, in:)`; and the dimension of each product and quotient, so `2.newton * 3.meter` is in joules and `100.meter / 10.second` in metres per second.

### `meter`

```kex
meter(value: Number) -> Measure<Quantity.Length>
```

Returns `value` metres as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the length

**Examples**

```kex
5000.meter.to(String)        # => Just("5000.0 m")
5000.meter.to(String, in: Kilo(Meter))   # => Just("5.0 km")
```

### `gram`

```kex
gram(value: Number) -> Measure<Quantity.Mass>
```

Returns `value` grams as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the mass

**Examples**

```kex
500.gram.to(String)   # => Just("500.0 g")
```

### `kelvin`

```kex
kelvin(value: Number) -> Measure<Quantity.Temperature>
```

Returns `value` kelvin as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the temperature

**Examples**

```kex
300.kelvin.to(String)   # => Just("300.0 K")
```

### `liter`

```kex
liter(value: Number) -> Measure<Quantity.Volume>
```

Returns `value` litres as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the volume

**Examples**

```kex
2.liter.to(String)   # => Just("2.0 L")
```

### `newton`

```kex
newton(value: Number) -> Measure<Quantity.Force>
```

Returns `value` newtons as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the force

**Examples**

_Force times distance is energy_

```kex
(2.newton * 3.meter).to(String)   # => Just("6.0 J")
```

### `joule`

```kex
joule(value: Number) -> Measure<Quantity.Energy>
```

Returns `value` joules as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the energy

**Examples**

```kex
100.joule.to(String)   # => Just("100.0 J")
```

### `watt`

```kex
watt(value: Number) -> Measure<Quantity.Power>
```

Returns `value` watts as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the power

**Examples**

```kex
3.kilowatt.to(String)                  # => Just("3.0 kW")
1500.watt.to(String, in: Kilo(Watt))   # => Just("1.5 kW")
```

_Power times time is energy_

```kex
(3.kilowatt * 2.hour).to(String)   # => Just("21600000.0 J")
```

### `volt`

```kex
volt(value: Number) -> Measure<Quantity.Voltage>
```

Returns `value` volts as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the voltage

**Examples**

```kex
12.volt.to(String)   # => Just("12.0 V")
```

### `ampere`

```kex
ampere(value: Number) -> Measure<Quantity.Current>
```

Returns `value` amperes as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the current

**Examples**

_Voltage times current is power_

```kex
(12.volt * 2.ampere).to(String)   # => Just("24.0 W")
```

### `ohm`

```kex
ohm(value: Number) -> Measure<Quantity.Resistance>
```

Returns `value` ohms as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the resistance

**Examples**

```kex
470.ohm.to(String)   # => Just("470.0 Ω")
```

### `coulomb`

```kex
coulomb(value: Number) -> Measure<Quantity.Charge>
```

Returns `value` coulombs as a `Measure`.

**Parameters**

  - `value` — the quantity

**Returns**: the charge

**Examples**

```kex
3.coulomb.to(String)   # => Just("3.0 C")
```

## type `SIUnit`

The SI units this module names.

Each has a dimension (`:length`, `:mass`, `:power`, ...) and the symbol a `Measure` in it displays with.

**Variants**

  - `Meter`
  - `Gram`
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

### Functions

#### `factor` (from Unit)

```kex
factor -> Float
```

#### `kind` (from Unit)

```kex
kind -> Atom
```

#### `symbol` (from Unit)

```kex
symbol -> String
```

#### `*`

```kex
* -> UnitDefinition
```

## type `SIPrefix`

A decimal prefix applied to a unit, which makes another unit.

`Kilo(Meter)` is the kilometre and `Kilo(Watt * Hour)` the kilowatt-hour. Use one as the target of `convertTo` or `to(String, in:)`. To write a measure in a prefixed unit, use the prefixed name: `5.kilometer`.

```kex
5000.meter.convertTo(Kilo(Meter)).map(&.showValue)   # => Ok("5.0 km")
1500.watt.to(String, in: Kilo(Watt))    # => Just("1.5 kW")
```

**Variants**

  - `Kilo(Unit)`
  - `Mega(Unit)`
  - `Giga(Unit)`
  - `Milli(Unit)`
  - `Micro(Unit)`
  - `Nano(Unit)`

Implements [`Unit`](../units.md#trait-unit).

### Functions

#### `factor` (from Unit)

```kex
factor -> Float
```

#### `kind` (from Unit)

```kex
kind -> Atom
```

#### `symbol` (from Unit)

```kex
symbol -> String
```

## extends `UnitDefinition`

More functions for [`UnitDefinition`](../units.md#record-unitdefinition), added by this module.

Implements [`Unit`](../units.md#trait-unit).

### `factor` (from Unit)

```kex
factor -> Float
```

### `kind` (from Unit)

```kex
kind -> Atom
```

### `symbol` (from Unit)

```kex
symbol -> String
```

## extends `Measure`

More functions for [`Measure`](../units.md#record-measure), added by this module.

Displays a measure in a prefixed unit, as the prelude's `to(String, in:)` does for other units.

### `factor`

```kex
factor -> Float
```

### `kind`

```kex
kind -> Atom
```

### `symbol`

```kex
symbol -> String
```

### `to`

```kex
to(String: Type, in: SIPrefix, format: NumberFormat) -> String?
```

Renders the measure in a prefixed unit.

Returns `None` when the unit has a different dimension from the measure, such as watts shown in metres.

**Parameters**

  - `String` — the target type
  - `in` — the prefixed unit to display in

**Returns**: the rendered measure, or `None`

**Examples**

```kex
5000.meter.to(String, in: Kilo(Meter))   # => Just("5.0 km")
1500.watt.to(String, in: Kilo(Watt))     # => Just("1.5 kW")
```

_A mismatched dimension gives None_

```kex
1500.watt.to(String, in: Kilo(Meter))   # => None
```

### `rescaled`

```kex
rescaled(factor: Float, kind: Atom, symbol: String) -> This?
```

The measure in a unit of `factor`, or None across dimensions.

### `prefixScaled`

```kex
prefixScaled(factor: Float) -> Float
```

Divides the canonical value by a prefix factor. The conversion is exact in principle (0.000005 W is 5 μW) but neither the measured value nor the prefix factor is exactly representable in binary, so the quotient lands an ulp or two off (5.000000000000001). Round back to 15 significant digits, comfortably inside a double's ~15.95, so prefixed measures read the way they were written.

## extends `Measure<Quantity.Mass>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

Products and quotients of measures, by dimension.

Each is declared with the dimension of its result, so the checker knows that `2.newton * 3.meter` is a `Measure<Quantity.Energy>`. A product with no dimension declared here, such as `2.meter * 3.second`, is a type error. `times` and `per` are the named forms of `*` and `/`. A dimension of your own declares its products the same way, in its own module.

**Examples**

```kex
(2.newton * 3.meter).to(String)         # => Just("6.0 J")
(100.meter / 10.second).to(String)      # => Just("10.0 m/s")
100.meter.per(10.second).to(String)     # => Just("10.0 m/s")
(12.volt * 2.ampere).to(String)         # => Just("24.0 W")
(40.meter * 51.meter).to(String)        # => Just("2040.0 m^2")
(2.meter * (3.meter * 4.meter)).to(String)   # => Just("24.0 m^3")
```

### `*`

```kex
*(other: Measure<Quantity.Acceleration>) -> Measure<Quantity.Force>
```

### `times`

```kex
times(other: Measure<Quantity.Acceleration>) -> Measure<Quantity.Force>
```

## extends `Measure<Quantity.Acceleration>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Mass>) -> Measure<Quantity.Force>
```

### `times`

```kex
times(other: Measure<Quantity.Mass>) -> Measure<Quantity.Force>
```

## extends `Measure<Quantity.Force>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Length>) -> Measure<Quantity.Energy>
```

### `times`

```kex
times(other: Measure<Quantity.Length>) -> Measure<Quantity.Energy>
```

### `/`

```kex
/(other: Measure<Quantity.Length>) -> Measure<Quantity.Pressure>
```

### `per`

```kex
per(other: Measure<Quantity.Length>) -> Measure<Quantity.Pressure>
```

## extends `Measure<Quantity.Length>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Force>) -> Measure<Quantity.Energy>
```

### `times`

```kex
times(other: Measure<Quantity.Force>) -> Measure<Quantity.Energy>
```

### `/`

```kex
/(other: Measure<Quantity.Time>) -> Measure<Quantity.Speed>
```

### `per`

```kex
per(other: Measure<Quantity.Time>) -> Measure<Quantity.Speed>
```

## extends `Measure<Quantity.Area>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Length>) -> Measure<Quantity.Volume>
```

### `times`

```kex
times(other: Measure<Quantity.Length>) -> Measure<Quantity.Volume>
```

## extends `Measure<Quantity.Speed>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `/`

```kex
/(other: Measure<Quantity.Time>) -> Measure<Quantity.Acceleration>
```

### `per`

```kex
per(other: Measure<Quantity.Time>) -> Measure<Quantity.Acceleration>
```

## extends `Measure<Quantity.Voltage>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Current>) -> Measure<Quantity.Power>
```

### `times`

```kex
times(other: Measure<Quantity.Current>) -> Measure<Quantity.Power>
```

### `/`

```kex
/(other: Measure<Quantity.Current>) -> Measure<Quantity.Resistance>
```

### `per`

```kex
per(other: Measure<Quantity.Current>) -> Measure<Quantity.Resistance>
```

## extends `Measure<Quantity.Current>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Voltage>) -> Measure<Quantity.Power>
```

### `times`

```kex
times(other: Measure<Quantity.Voltage>) -> Measure<Quantity.Power>
```

## extends `Measure<Quantity.Resistance>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Current>) -> Measure<Quantity.Voltage>
```

### `times`

```kex
times(other: Measure<Quantity.Current>) -> Measure<Quantity.Voltage>
```

## extends `Measure<Quantity.Power>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Time>) -> Measure<Quantity.Energy>
```

### `times`

```kex
times(other: Measure<Quantity.Time>) -> Measure<Quantity.Energy>
```

## extends `Measure<Quantity.Time>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `*`

```kex
*(other: Measure<Quantity.Power>) -> Measure<Quantity.Energy>
```

### `times`

```kex
times(other: Measure<Quantity.Power>) -> Measure<Quantity.Energy>
```

## extends `Measure<Quantity.Energy>`

More functions for [`Measure`](../units.md#record-measure), added by this module.

### `/`

```kex
/(other: Measure<Quantity.Time>) -> Measure<Quantity.Power>
```

### `per`

```kex
per(other: Measure<Quantity.Time>) -> Measure<Quantity.Power>
```
