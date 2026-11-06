---
package: prelude
version: "0.4.0-rc.3-dev"
source: complex.kex
title: Complex
entities:
  - { kind: module, name: "Complex" }
---

# Complex

## module `Complex`

Complex numbers with real and imaginary components, plus polar conversion.

Components accept `Number` values. Trigonometric angles are in radians.

```kex
using Complex
let z = Rectangular { re: 3, im: 4 }
z.abs   # => 5.0
```

### `ZERO` (constant)

The additive identity, +0 + 0i+.



### `ONE` (constant)

The multiplicative identity, +1 + 0i+.



### `I` (constant)

The imaginary unit, +0 + 1i+.



### `NEG_I` (constant)

The negative imaginary unit, `0 - 1i`.



### `fromPolar`

```kex
fromPolar(radius: Number, theta: Number) -> Rectangular
```

Constructs a complex number from a radius and an angle in radians.

**Parameters**

  - `radius` — distance from the origin
  - `theta` — angle in radians

**Returns**: the rectangular representation

**Examples**

_A quarter turn_

```kex
Complex.fromPolar(2, Math.PI / 2).im   # approximately 2.0
```

### `fromPolarCoordinates`

```kex
fromPolarCoordinates(polar: Polar) -> Rectangular
```

Constructs a complex number from a `Polar` value.

**Parameters**

  - `polar` — radius and angle in radians

**Returns**: the rectangular representation

**Examples**

```kex
Complex.fromPolarCoordinates(Polar { radius: 3, theta: 0 }).re # => 3.0
```

### `conjugateOf`

```kex
conjugateOf(value: Rectangular) -> Rectangular
```

Returns the conjugate of a complex number.

**Parameters**

  - `value` — the number to conjugate

**Returns**: the number with its imaginary sign reversed

**Examples**

```kex
Complex.conjugateOf(Complex.I).im # => -1
```

## record `Rectangular`

A complex number in rectangular form: `re` is the real part and `im` is the imaginary part.

**Fields**

  - `re` : [Number](number.md#make-number)
  - `im` : [Number](number.md#make-number)

Implements [`Showable`](kex.md#trait-showable).

### Functions

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders the number in rectangular form, such as +3+4i+.

**Returns**: the real and signed imaginary components

**Examples**

```kex
(Rectangular { re: 3, im: -4 }).showValue # => "3-4i"
```

#### `+`

```kex
+(other: Rectangular) -> Rectangular
```

Adds two complex numbers component by component.

**Examples**

```kex
(Rectangular { re: 1, im: 2 } + Complex.I).im # => 3
```

#### `-`

```kex
-(other: Rectangular) -> Rectangular
```

Subtracts `other` from this complex number.

**Examples**

```kex
(Rectangular { re: 1, im: 2 } - Complex.I).im # => 1
```

#### `*`

```kex
*(other: Rectangular) -> Rectangular
```

Multiplies two complex numbers.

**Examples**

```kex
(Complex.I * Complex.I).re # => -1
```

#### `/`

```kex
/(other: Rectangular) -> Rectangular
```

Divides by `other` using the complex conjugate formula. The divisor must be non-zero.

**Examples**

```kex
(Complex.I / Complex.I).re # => 1.0
```

#### `conjugate`

```kex
conjugate : Rectangular
```

Returns the complex conjugate, negating the imaginary part.

**Examples**

```kex
let conjugated: Rectangular = Complex.conjugateOf(Complex.I)
conjugated.im # => -1
```

#### `sqrt`

```kex
sqrt : Rectangular
```

Returns the principal square root. The result's argument lies in the right half-plane.

**Examples**

```kex
(Rectangular { re: -1, im: 0 }).sqrt.im # approximately 1.0
```

#### `exp`

```kex
exp : Rectangular
```

Returns e raised to this complex number.

**Examples**

```kex
Complex.ZERO.exp.re # => 1.0
```

#### `log`

```kex
log : Rectangular
```

Returns the principal natural logarithm. Zero has no logarithm.

**Examples**

```kex
Complex.ONE.log.re # => 0.0
```

#### `sin`

```kex
sin : Rectangular
```

Returns the complex sine.

**Examples**

```kex
Complex.ZERO.sin.re # => 0.0
```

#### `cos`

```kex
cos : Rectangular
```

Returns the complex cosine.

**Examples**

```kex
Complex.ZERO.cos.re # => 1.0
```

#### `tan`

```kex
tan : Rectangular
```

Returns the complex tangent.

**Examples**

```kex
Complex.ZERO.tan.re # => 0.0
```

#### `^`

```kex
^(exponent: Number) -> Rectangular
```

Raises this number to a real power using the principal argument.

**Examples**

```kex
(Complex.I ^ 2).re # approximately -1.0
```

#### `absSquared`

```kex
absSquared : Number
```

Returns the square of the magnitude.

**Returns**: real² + imaginary²

**Examples**

```kex
(Rectangular { re: 3, im: 4 }).absSquared # => 25
```

#### `abs`

```kex
abs : Float
```

Returns the magnitude of this complex number.

**Returns**: distance from the origin

**Examples**

```kex
(Rectangular { re: 3, im: 4 }).abs # => 5.0
```

#### `arg`

```kex
arg : Float
```

Returns the argument in radians, in the range chosen by `Math.atan2`.

**Returns**: angle in radians

**Examples**

```kex
Complex.I.arg # => Math.PI / 2.0
```

#### `polar`

```kex
polar : Polar
```

Converts this number to polar coordinates.

**Returns**: magnitude and argument in radians

**Examples**

```kex
(Rectangular { re: 3, im: 4 }).polar.radius # => 5.0
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `Polar`

A complex number in polar form, with a non-negative radius and angle in radians.

**Fields**

  - `radius` : [Number](number.md#make-number)
  - `theta` : [Number](number.md#make-number)

Implements [`Showable`](kex.md#trait-showable).

### Functions

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders the radius and angle in radians.

**Returns**: the polar coordinates

**Examples**

```kex
(Polar { radius: 2, theta: 0 }).showValue # => "(2, 0)"
```

#### `rectangular`

```kex
rectangular : Rectangular
```

Converts these polar coordinates to a complex number.

**Returns**: the rectangular representation

**Examples**

```kex
(Polar { radius: 2, theta: 0 }).rectangular.re # => 2.0
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## module `Complex.Polar`

### `ZERO` (constant)


