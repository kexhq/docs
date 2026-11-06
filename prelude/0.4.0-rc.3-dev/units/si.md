---
package: prelude
version: "0.4.0-rc.3-dev"
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
  IO.printLine(3.kilowatt.to(String))           # prints: 3.0 kW
  IO.printLine(5000.meter.to(String, in: Kilo(Meter)).or("")) # prints: 5.0 km
  IO.printLine((100.meter / 10.second).to(String)) # prints: 10.0 m/s
end
```

Every value is a `Measure` from the prelude, so the arithmetic, conversion and comparison described there apply unchanged. What this module adds is the SI vocabulary (including fused spellings such as `kilometer`), the prefixes as units of their own (`Kilo(Meter)`, for `convertTo` and `to(String, in:)`), and a table of which dimension results from multiplying or dividing two others, so `2.newton * 3.meter` answers in joules and `100.meter / 10.second` in metres per second.

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
5000.meter.to(String)        # => Just("5000.0 m")
5000.meter.to(String, in: Kilo(Meter))   # => Just("5.0 km")
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
500.gram.to(String)   # => Just("500.0 g")
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
300.kelvin.to(String)   # => Just("300.0 K")
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
2.liter.to(String)   # => Just("2.0 L")
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
(2.newton * 3.meter).to(String)   # => Just("6.0 J")
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
100.joule.to(String)   # => Just("100.0 J")
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
3.kilowatt.to(String)                  # => Just("3.0 kW")
1500.watt.to(String, in: Kilo(Watt))   # => Just("1.5 kW")
```

_Power times time is energy_

```kex
(3.kilowatt * 2.hour).to(String)   # => Just("21600000.0 J")
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
12.volt.to(String)   # => Just("12.0 V")
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
(12.volt * 2.ampere).to(String)   # => Just("24.0 W")
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
470.ohm.to(String)   # => Just("470.0 Ω")
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
3.coulomb.to(String)   # => Just("3.0 C")
```

### `per`

```kex
per(measure: Measure, other: Measure) -> Measure
```

Divides one measure by another, naming the resulting dimension.

The spelled-out form of `/`: `100.meter.per(10.second)` and `100.meter / 10.second` are the same call. Metres over seconds is speed, energy over time is power, force over area is pressure: the dimension table decides, and the symbol follows it.

**Parameters**

  - `measure` — the numerator
  - `other` — the denominator

**Returns**: the quotient, in its derived unit

**Examples**

```kex
100.meter.per(10.second).to(String)   # => Just("10.0 m/s")
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
2.newton.times(3.meter).to(String)   # => Just("6.0 J")
(12.volt * 2.ampere).to(String)      # => Just("24.0 W")
```

## type `SIUnit`

The SI units this module names.

Each carries its dimension (`:length`, `:mass`, `:power`, …) and its symbol, which is what a `Measure` built from it displays with.

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

#### `*`

```kex
*(_, _) -> UnitDefinition
```

## type `SIPrefix`

A decimal prefix applied to a unit, which is a unit itself.

`Kilo(Meter)` is the kilometre and `Kilo(Watt * Hour)` the kilowatt-hour. Like any other `Unit`, one can be converted to with `convertTo` or displayed in with `to(String, in:)`. Writing a measure in one is spelled out instead: `5.kilometer`.

```kex
5000.meter.convertTo(Kilo(Meter))       # => Ok(5.0 km)
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

More functions for [`UnitDefinition`](../units.md#record-unitdefinition), added by this module.

Implements [`Unit`](../units.md#trait-unit).

### `factor` (from Unit)



### `kind` (from Unit)



### `symbol` (from Unit)



## extends `Measure`

More functions for [`Measure`](../units.md#record-measure), added by this module.

Displaying a measure in a prefixed unit: the prelude's `to(String, in:)`, for this module's units.

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

### `to`

```kex
to(String: Type, in: SIPrefix, format: NumberFormat) -> String?
```

Renders the measure in a prefixed unit.

Answers `None` when the measure and the target unit are of different dimensions: you cannot express watts in metres, and this says so rather than producing a wrong number.

**Parameters**

  - `String` — the target type
  - `in` — the prefixed unit to display in

**Returns**: the rendered measure, or `None`

**Examples**

```kex
5000.meter.to(String, in: Kilo(Meter))   # => Just("5.0 km")
1500.watt.to(String, in: Kilo(Watt))     # => Just("1.5 kW")
```

_A mismatched dimension answers None_

```kex
1500.watt.to(String, in: Kilo(Meter))   # => None
```

### `rescaled`

```kex
rescaled(factor: Float, kind: Atom, symbol: String) -> Measure?
```

The measure in a unit of `factor`, or None across dimensions.

### `prefixScaled`

```kex
prefixScaled(factor: Float) -> Number
```

Divides the canonical value by a prefix factor. The conversion is exact in principle (0.000005 W is 5 μW) but neither the measured value nor the prefix factor is exactly representable in binary, so the quotient lands an ulp or two off (5.000000000000001). Round back to 15 significant digits, comfortably inside a double's ~15.95, so prefixed measures read the way they were written. The result is always a Float; the annotation says Number because `Integer / Float` infers Integer.

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
