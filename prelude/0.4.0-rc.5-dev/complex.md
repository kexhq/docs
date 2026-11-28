---
package: prelude
version: "0.4.0-rc.5-dev"
source: complex.kex
title: Complex
entities:
  - { kind: module, name: "Complex" }
---

# Complex

## module `Complex`

### `ZERO` (constant)

The additive identity, +0+0i+.



### `ONE` (constant)

The multiplicative identity, +1+0i+.



### `I` (constant)

The imaginary unit, +0+1i+.



### `NEG_I` (constant)

The negative imaginary unit, `0-1i`.



### `from`

```kex
from(re: Number, im: Number) -> Complex
```

Builds a complex number from its rectangular parts.

**Parameters**

  - `re` — the real part
  - `im` — the imaginary part

**Returns**: +re + im·i+

**Examples**

```kex
Complex.from(3, 4).showValue   # => "3+4i"
```

### `fromPolar`

```kex
fromPolar(radius: Number, theta: Number) -> Complex
```

Builds a complex number from its polar parts: a distance from the origin and an angle in radians.

**Parameters**

  - `radius` — distance from the origin
  - `theta` — angle in radians

**Returns**: the same number, held by its rectangular parts

**Examples**

_A quarter turn_

```kex
Complex.fromPolar(2, Math.PI / 2).im   # approximately 2.0
```

## record `Complex`

Complex numbers: one value, readable in rectangular or polar terms.

A `Complex` is a point in the plane. In rectangular terms it has a real part `re` and an imaginary part `im`; in polar terms, a distance from the origin `abs` and an angle `arg`. Both views work on every value, and either can build one. Parts may be any `Number`, and angles are in radians.

```kex
using Complex

let z = Complex.from(3, 4)
z.abs            # => 5.0
z.polar          # => (5.0, 0.9272952180016122)
Complex.fromPolar(2, Math.PI / 2).im   # approximately 2.0
```

A complex number, stored by its real part `re` and imaginary part `im`.

Write one literally as `Complex { re: 3, im: 4 }`, or with `Complex.from` and `Complex.fromPolar`.

**Fields**

  - `re` : [Number](number.md#make-number)
  - `im` : [Number](number.md#make-number)

Implements [`Showable`](kex.md#trait-showable).

### Functions

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the number in rectangular form, such as +3+4i+.

**Returns**: the real and signed imaginary components

**Examples**

```kex
Complex.from(3, -4).showValue   # => "3-4i"
```

#### `rectangular`

```kex
rectangular -> (Number, Number)
```

Returns the real and imaginary parts as a pair.

**Returns**: `(re, im)`

**Examples**

```kex
Complex.from(3, 4).rectangular   # => (3, 4)
```

#### `polar`

```kex
polar -> (Float, Float)
```

Returns the distance from the origin and the angle in radians as a pair.

**Returns**: `(abs, arg)`

**Examples**

```kex
Complex.from(3, 4).polar   # => (5.0, 0.9272952180016122)
```

#### `abs`

```kex
abs -> Float
```

Returns the magnitude, the distance from the origin.

**Returns**: the distance from the origin

**Examples**

```kex
Complex.from(3, 4).abs   # => 5.0
```

#### `absSquared`

```kex
absSquared -> Number
```

Returns the square of the magnitude. It needs no square root, so it stays an `Integer` when both parts are integers.

**Returns**: +re² + im²+

**Examples**

```kex
Complex.from(3, 4).absSquared   # => 25
```

#### `arg`

```kex
arg -> Float
```

Returns the argument, the angle from the positive real axis, in the range of `Math.atan2` (-pi to pi).

**Returns**: the angle in radians

**Examples**

```kex
Complex.I.arg   # => 1.5707963267948966
```

#### `+`

```kex
+(other: Complex) -> Complex
```

Adds two complex numbers part by part.

**Parameters**

  - `other` — the number to add

**Returns**: the sum

**Examples**

```kex
(Complex.from(1, 2) + Complex.I).im   # => 3
```

#### `-`

```kex
-(other: Complex) -> Complex
```

Subtracts `other` from this complex number.

**Parameters**

  - `other` — the number to subtract

**Returns**: the difference

**Examples**

```kex
(Complex.from(1, 2) - Complex.I).im   # => 1
```

#### `*`

```kex
*(other: Complex) -> Complex
```

Multiplies two complex numbers.

**Parameters**

  - `other` — the number to multiply by

**Returns**: the product

**Examples**

```kex
(Complex.I * Complex.I).re   # => -1
```

#### `/`

```kex
/(other: Complex) -> Complex
```

Divides by `other`, which must not be zero.

**Parameters**

  - `other` — the divisor

**Returns**: the quotient, with `Float` parts

**Examples**

```kex
(Complex.I / Complex.I).re   # => 1.0
```

#### `conjugate`

```kex
conjugate -> Complex
```

Returns the complex conjugate: the same number with the imaginary part negated.

**Returns**: the conjugate

**Examples**

```kex
Complex.I.conjugate.im   # => -1
```

#### `sqrt`

```kex
sqrt -> Complex
```

Returns the principal square root, whose real part is never negative.

**Returns**: the square root

**Examples**

```kex
Complex.from(-1, 0).sqrt.im   # approximately 1.0
```

#### `exp`

```kex
exp -> Complex
```

Returns e raised to this complex number.

**Returns**: the exponential

**Examples**

```kex
Complex.ZERO.exp.re   # => 1.0
```

#### `log`

```kex
log -> Complex
```

Returns the principal natural logarithm. Raises an error for zero.

**Returns**: the logarithm

**Examples**

```kex
Complex.ONE.log.re   # => 0.0
```

#### `sin`

```kex
sin -> Complex
```

Returns the complex sine.

**Returns**: the sine

**Examples**

```kex
Complex.ZERO.sin.re   # => 0.0
```

#### `cos`

```kex
cos -> Complex
```

Returns the complex cosine.

**Returns**: the cosine

**Examples**

```kex
Complex.ZERO.cos.re   # => 1.0
```

#### `tan`

```kex
tan -> Complex
```

Returns the complex tangent.

**Returns**: the tangent

**Examples**

```kex
Complex.ZERO.tan.re   # => 0.0
```

#### `^`

```kex
^(exponent: Number) -> Complex
```

Raises this number to a real power, using the principal argument.

**Parameters**

  - `exponent` — the power

**Returns**: the result

**Examples**

```kex
(Complex.I ^ 2).re   # approximately -1.0
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 
