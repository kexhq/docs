---
package: prelude
version: "0.4.0-rc.4-dev"
source: math.kex
title: Math
entities:
  - { kind: module, name: "Math" }
---

# Math

## module `Math`

Mathematical constants and functions.

Angles are in radians. Every function takes a `Number`, an `Integer` or a `Float`, and all but `abs`, `floor` and `ceil` return a `Float`.

A Kex `Float` is always finite. A result with no real value (`Math.sqrt(-1.0)`) or one too large for a float (`Math.exp(1000.0)`) raises an error; there is no `NaN` or `Infinity` to check for.

```kex
Math.sqrt(2.0)              # => 1.4142135623730951
Math.hypot(3.0, 4.0)        # => 5.0
Math.sin(Math.PI / 2.0)     # => 1.0
```

`abs`, `floor`, `ceil` and `sqrt` can also be called on the number, which reads better in a chain: `x.abs` rather than `Math.abs(x)`. `round` exists only in that form.

### `PI` (constant)

The ratio of a circle's circumference to its diameter.

**Examples**

```kex
Math.PI   # => 3.141592653589793
```

_The circumference of a circle_

```kex
2.0 * Math.PI * radius
```



### `E` (constant)

The base of the natural logarithm.

**Examples**

```kex
Math.E             # => 2.718281828459045
Math.log(Math.E)   # => 1.0
```



### `sqrt`

```kex
sqrt(x: Number) -> Float
```

Returns the square root of `x`. Raises an error for a negative `x`.

**Parameters**

  - `x` — a non-negative number

**Returns**: the square root

**Examples**

```kex
Math.sqrt(9.0)    # => 3.0
Math.sqrt(2.0)    # => 1.4142135623730951
Math.sqrt(-1.0)   # raises an error
```

_Distance between two points_

```kex
Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
```

### `cbrt`

```kex
cbrt(x: Number) -> Float
```

Returns the cube root of `x`, which may be negative.

**Parameters**

  - `x` — any number

**Returns**: the cube root

**Examples**

```kex
Math.cbrt(27.0)    # => 3.0
Math.cbrt(-8.0)    # => -2.0
```

### `sin`

```kex
sin(x: Number) -> Float
```

Returns the sine of `x`, given in radians.

**Parameters**

  - `x` — the angle in radians

**Returns**: the sine

**Examples**

```kex
Math.sin(0.0)             # => 0.0
Math.sin(Math.PI / 2.0)   # => 1.0
```

_A point on a circle_

```kex
let y = centerY + radius * Math.sin(angle)
```

### `cos`

```kex
cos(x: Number) -> Float
```

Returns the cosine of `x`, given in radians.

**Parameters**

  - `x` — the angle in radians

**Returns**: the cosine

**Examples**

```kex
Math.cos(0.0)        # => 1.0
Math.cos(Math.PI)    # => -1.0
```

### `tan`

```kex
tan(x: Number) -> Float
```

Returns the tangent of `x`, given in radians.

**Parameters**

  - `x` — the angle in radians

**Returns**: the tangent

**Examples**

```kex
Math.tan(0.0)             # => 0.0
Math.tan(Math.PI / 4.0)   # => 0.9999999999999999
```

### `asin`

```kex
asin(x: Number) -> Float
```

Returns the arc sine of `x` in radians, in the range -π/2 to π/2.

**Parameters**

  - `x` — a value in -1..1

**Returns**: the angle in radians

**Examples**

```kex
Math.asin(0.0)   # => 0.0
Math.asin(1.0)   # => 1.5707963267948966
```

### `acos`

```kex
acos(x: Number) -> Float
```

Returns the arc cosine of `x` in radians, in the range 0 to π.

**Parameters**

  - `x` — a value in -1..1

**Returns**: the angle in radians

**Examples**

```kex
Math.acos(1.0)    # => 0.0
Math.acos(0.0)    # => 1.5707963267948966
```

### `atan`

```kex
atan(x: Number) -> Float
```

Returns the arc tangent of `x` in radians, in the range -π/2 to π/2.

To turn a vector into an angle, use `atan2`, which also finds the right quadrant.

**Parameters**

  - `x` — any number

**Returns**: the angle in radians

**Examples**

```kex
Math.atan(0.0)   # => 0.0
Math.atan(1.0)   # => 0.7853981633974483
```

### `atan2`

```kex
atan2(y: Number, x: Number) -> Float
```

Returns the angle of the vector `(x, y)` in radians, from -π to π.

The signs of both components decide the quadrant, which `atan` cannot do. `y` comes first.

**Parameters**

  - `y` — the vertical component
  - `x` — the horizontal component

**Returns**: the angle in radians

**Examples**

```kex
Math.atan2(1.0, 1.0)    # => 0.7853981633974483    (45°)
Math.atan2(1.0, -1.0)   # => 2.356194490192345     (135°)
```

_The bearing from one point to another, in degrees_

```kex
Math.rad2Deg(Math.atan2(y2 - y1, x2 - x1))
```

### `deg2Rad`

```kex
deg2Rad(degrees: Number) -> Float
```

Converts an angle from degrees to radians, the unit the trigonometric functions take.

**Parameters**

  - `degrees` — the angle in degrees

**Returns**: the same angle in radians

**Examples**

```kex
Math.deg2Rad(180)    # => 3.141592653589793
Math.deg2Rad(90.0)   # => 1.5707963267948966
```

_The sine of an angle given in degrees_

```kex
Math.sin(Math.deg2Rad(30.0))
```

### `rad2Deg`

```kex
rad2Deg(radians: Number) -> Float
```

Converts an angle from radians to degrees, the inverse of `deg2Rad`.

**Parameters**

  - `radians` — the angle in radians

**Returns**: the same angle in degrees

**Examples**

```kex
Math.rad2Deg(Math.PI)         # => 180.0
Math.rad2Deg(Math.PI / 2.0)   # => 90.0
```

_The bearing from one point to another, in degrees_

```kex
Math.rad2Deg(Math.atan2(y2 - y1, x2 - x1))
```

### `sinh`

```kex
sinh(x: Number) -> Float
```

Returns the hyperbolic sine of `x`.

**Parameters**

  - `x` — any number

**Returns**: the hyperbolic sine

**Examples**

```kex
Math.sinh(0.0)   # => 0.0
Math.sinh(1.0)   # => 1.1752011936438014
```

### `cosh`

```kex
cosh(x: Number) -> Float
```

Returns the hyperbolic cosine of `x`.

**Parameters**

  - `x` — any number

**Returns**: the hyperbolic cosine

**Examples**

```kex
Math.cosh(0.0)   # => 1.0
Math.cosh(1.0)   # => 1.5430806348152437
```

### `tanh`

```kex
tanh(x: Number) -> Float
```

Returns the hyperbolic tangent of `x`, always between -1 and 1.

**Parameters**

  - `x` — any number

**Returns**: the hyperbolic tangent

**Examples**

```kex
Math.tanh(0.0)   # => 0.0
Math.tanh(1.0)   # => 0.7615941559557649
```

### `log`

```kex
log(x: Number) -> Float
log(x: Number, base: Number) -> Float
```

Returns the natural logarithm of `x`, or with `base` the logarithm to that base.

Raises an error when `x` is zero or negative.

**Parameters**

  - `x` — a positive number
  - `base` — the logarithm base; omitted for base `e`

**Returns**: the logarithm

**Examples**

```kex
Math.log(Math.E)     # => 1.0
Math.log(8.0, 2.0)   # => 3.0
```

_How many digits a number has_

```kex
Math.log10(n.to(Float).or(1.0)).floor + 1
```

### `log2`

```kex
log2(x: Number) -> Float
```

Returns the base-2 logarithm of `x`, like `Math.log(x, 2.0)`.

**Parameters**

  - `x` — a positive number

**Returns**: the base-2 logarithm

**Examples**

```kex
Math.log2(8.0)      # => 3.0
Math.log2(1024.0)   # => 10.0
```

_Bits needed to represent n distinct values_

```kex
Math.log2(n.to(Float).or(1.0)).ceil
```

### `log10`

```kex
log10(x: Number) -> Float
```

Returns the base-10 logarithm of `x`.

**Parameters**

  - `x` — a positive number

**Returns**: the base-10 logarithm

**Examples**

```kex
Math.log10(1000.0)   # => 3.0
Math.log10(1.0)      # => 0.0
```

### `exp`

```kex
exp(x: Number) -> Float
```

Returns `e` raised to the power `x`, the inverse of `Math.log`.

Raises an error when the result is too large for a float, which happens just past `x` of 709.

**Parameters**

  - `x` — the exponent

**Returns**: e to the power x

**Examples**

```kex
Math.exp(0.0)   # => 1.0
Math.exp(1.0)   # => 2.718281828459045
```

_Exponential decay_

```kex
let remaining = initial * Math.exp(-rate * elapsed)
```

### `pow`

```kex
pow(x: Number, y: Number) -> Float
```

Returns `x` raised to the power `y`.

The result is a `Float` even for whole numbers. For an exact integer power use `Integer.pow`: `2.pow(100)` keeps every digit, and `Math.pow(2, 100)` does not.

**Parameters**

  - `x` — the base
  - `y` — the exponent

**Returns**: x to the power y

**Examples**

```kex
Math.pow(2.0, 10.0)        # => 1024.0
Math.pow(2.0, 0.5)         # => 1.4142135623730951
Math.pow(2.0, 10.0).round  # => 1024
```

_Compound growth_

```kex
principal * Math.pow(1.0 + rate, years)
```

### `abs`

```kex
abs(x: Number) -> Number
```

Returns `x` without its sign, as the same type: an `Integer` stays an `Integer`.

`x.abs` does the same.

**Parameters**

  - `x` — any number

**Returns**: the absolute value

**Examples**

```kex
Math.abs(-5)      # => 5
Math.abs(-2.5)    # => 2.5
```

### `floor`

```kex
floor(x: Number) -> Integer
```

Returns `x` rounded down to an integer, toward negative infinity.

**Parameters**

  - `x` — any number

**Returns**: the floor

**Examples**

```kex
Math.floor(3.7)    # => 3
Math.floor(-3.2)   # => -4
```

### `ceil`

```kex
ceil(x: Number) -> Integer
```

Returns `x` rounded up to an integer, toward positive infinity.

**Parameters**

  - `x` — any number

**Returns**: the ceiling

**Examples**

```kex
Math.ceil(3.2)     # => 4
Math.ceil(-3.7)    # => -3
```

### `hypot`

```kex
hypot(x: Number, y: Number) -> Float
```

Returns +sqrt(x*x + y*y)+, without overflowing for large `x` or `y`.

**Parameters**

  - `x` — the first leg
  - `y` — the second leg

**Returns**: the hypotenuse

**Examples**

```kex
Math.hypot(3.0, 4.0)     # => 5.0
Math.hypot(5.0, 12.0)    # => 13.0
```

_The length of a vector_

```kex
Math.hypot(velocity.x, velocity.y)
```
