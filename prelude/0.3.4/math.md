---
package: prelude
version: "0.3.4"
source: math.kex
title: Math
entities:
  - { kind: module, name: "Math" }
---

# Math

## module `Math`

The `Math` module provides standard mathematical constants and functions. All trigonometric functions operate in radians. A Kex `Float` is always finite, so a domain error (`Math.sqrt(-1.0)`) or an overflow (`Math.exp(1000.0)`) raises rather than producing `NaN` or `Infinity` — the same rule BEAM enforces, where those two values cannot exist at all.

### `PI` (constant)

Math.PI : Float Ratio of a circle's circumference to its diameter.

**Examples**

```kex
Math.PI   # => 3.141592653589793
```



### `E` (constant)

Math.E : Float Base of the natural logarithm.

**Examples**

```kex
Math.E   # => 2.718281828459045
```



### `sqrt`

```kex
sqrt(x: Number) -> Float
```

Square root of `x`. Raises for negative input, which has no real root.

**Examples**

```kex
Math.sqrt(9.0)    # => 3.0
Math.sqrt(-1.0)   # raises: Math.sqrt: undefined result (NaN)
```

### `cbrt`

```kex
cbrt(x: Number) -> Float
```

Cube root of `x`.

**Examples**

```kex
Math.cbrt(27.0)   # => 3.0
```

### `sin`

```kex
sin(x: Number) -> Float
```

Sine of `x` (radians).

**Examples**

```kex
Math.sin(Math.PI / 2.0)   # => 1.0
```

### `cos`

```kex
cos(x: Number) -> Float
```

Cosine of `x` (radians).

**Examples**

```kex
Math.cos(0.0)   # => 1.0
```

### `tan`

```kex
tan(x: Number) -> Float
```

Tangent of `x` (radians).

**Examples**

```kex
Math.tan(Math.PI / 4.0)   # => 1.0
```

### `asin`

```kex
asin(x: Number) -> Float
```

Inverse sine (arc sine) of `x`, result in radians.

**Parameters**

  - `x` — must be in [-1, 1]

**Examples**

```kex
Math.asin(1.0)   # => 1.5707963267948966
```

### `acos`

```kex
acos(x: Number) -> Float
```

Inverse cosine (arc cosine) of `x`, result in radians.

**Parameters**

  - `x` — must be in [-1, 1]

**Examples**

```kex
Math.acos(1.0)   # => 0.0
```

### `atan`

```kex
atan(x: Number) -> Float
```

Inverse tangent (arc tangent) of `x`, result in radians in (-π/2, π/2).

**Examples**

```kex
Math.atan(1.0)   # => 0.7853981633974483
```

### `atan2`

```kex
atan2(y: Number, x: Number) -> Float
```

Two-argument arc tangent. Returns the angle of vector (`x`, `y`) in (-π, π]. Handles the sign of both arguments to place the result in the correct quadrant.

**Examples**

```kex
Math.atan2(1.0, 1.0)    # => 0.7853981633974483
Math.atan2(1.0, -1.0)   # => 2.356194490192345
```

### `sinh`

```kex
sinh(x: Number) -> Float
```

Hyperbolic sine.

### `cosh`

```kex
cosh(x: Number) -> Float
```

Hyperbolic cosine.

### `tanh`

```kex
tanh(x: Number) -> Float
```

Hyperbolic tangent.

### `log`

```kex
log(x: Number) -> Float
log(x: Number, base: Number) -> Float
```

Natural logarithm of `x` (base e). With two arguments, computes log base `base`.

**Parameters**

  - `base` — (optional)

**Examples**

```kex
Math.log(Math.E)     # => 1.0
Math.log(8.0, 2.0)   # => 3.0
```

### `log2`

```kex
log2(x: Number) -> Float
```

Base-2 logarithm of `x`.

**Examples**

```kex
Math.log2(8.0)   # => 3.0
```

### `log10`

```kex
log10(x: Number) -> Float
```

Base-10 logarithm of `x`.

**Examples**

```kex
Math.log10(1000.0)   # => 3.0
```

### `exp`

```kex
exp(x: Number) -> Float
```

`e` raised to the power `x`.

**Examples**

```kex
Math.exp(1.0)   # => 2.718281828459045
```

### `pow`

```kex
pow(x: Number, y: Number) -> Float
```

`x` raised to the power `y`.

**Examples**

```kex
Math.pow(2.0, 10.0)   # => 1024.0
```

### `abs`

```kex
abs(x: Number) -> Number
```

Absolute value of `x`.

### `floor`

```kex
floor(x: Number) -> Integer
```

Floor of `x` — largest integer not greater than `x`.

### `ceil`

```kex
ceil(x: Number) -> Integer
```

Ceiling of `x` — smallest integer not less than `x`.

### `hypot`

```kex
hypot(x: Number, y: Number) -> Float
```

Euclidean distance — equivalent to +sqrt(x*x + y*y)+ but avoids intermediate overflow for large values.

**Examples**

```kex
Math.hypot(3.0, 4.0)   # => 5.0
```
