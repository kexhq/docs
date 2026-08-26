---
package: prelude
version: "0.4.0-alpha"
source: math.kex
title: Math
entities:
  - { kind: module, name: "Math" }
---

# Math

## module `Math`

Mathematical constants and functions.

All trigonometric functions work in radians. Every function here accepts a `Number` — an `Integer` or a `Float` — and the transcendental ones answer with a `Float`.

A Kex `Float` is always finite, so a domain error (`Math.sqrt(-1.0)`) or an overflow (`Math.exp(1000.0)`) raises rather than producing `NaN` or `Infinity` — the same rule the BEAM enforces, where those two values cannot exist at all. There is no non-finite float to test for afterwards.

```kex
Math.sqrt(2.0)              # => 1.4142135623730951
Math.hypot(3.0, 4.0)        # => 5.0
Math.sin(Math.PI / 2.0)     # => 1.0
```

The everyday operations on a single number — `abs`, `floor`, `ceil`, `round`, `sqrt` — are also methods on `Integer` and `Float`, which usually reads better in a chain: `x.abs` over `Math.abs(x)`.

## constant `PI`

The ratio of a circle's circumference to its diameter.



## constant `E`

The base of the natural logarithm.



## function `sqrt`

Returns the square root of `x`. Raises for a negative `x`, which has no real root.


```kex
sqrt(x) : Number -> Float
```


## function `cbrt`

Returns the cube root of `x`. Unlike `sqrt`, negative input is fine — a negative number has a real cube root.


```kex
cbrt(x) : Number -> Float
```


## function `sin`

Returns the sine of `x`, given in radians.


```kex
sin(x) : Number -> Float
```


## function `cos`

Returns the cosine of `x`, given in radians.


```kex
cos(x) : Number -> Float
```


## function `tan`

Returns the tangent of `x`, given in radians.


```kex
tan(x) : Number -> Float
```


## function `asin`

Returns the arc sine of `x` in radians, in the range -π/2 to π/2.


```kex
asin(x) : Number -> Float
```


## function `acos`

Returns the arc cosine of `x` in radians, in the range 0 to π.


```kex
acos(x) : Number -> Float
```


## function `atan`

Returns the arc tangent of `x` in radians, in the range -π/2 to π/2.

Use `atan2` when you have both coordinates of a vector — it can tell the quadrant apart, and this cannot.


```kex
atan(x) : Number -> Float
```


## function `atan2`

Returns the angle of the vector `(x, y)` in radians, from -π to π.

Both signs are taken into account, so the result lands in the correct quadrant — which is why this, not `atan`, is what you want for converting a vector to an angle. Note the argument order: `y` first.


```kex
atan2(y, x) : Number -> Number -> Float
```


## function `sinh`

Returns the hyperbolic sine of `x`.


```kex
sinh(x) : Number -> Float
```


## function `cosh`

Returns the hyperbolic cosine of `x`.


```kex
cosh(x) : Number -> Float
```


## function `tanh`

Returns the hyperbolic tangent of `x`, always between -1 and 1.


```kex
tanh(x) : Number -> Float
```


## function `log`

Returns the natural logarithm of `x` — its logarithm to base `e`. With a second argument, returns the logarithm to that base instead.

Raises for `x` of zero or less, which has no real logarithm.


```kex
log(x) : Number -> Float
log(x) : Number -> Number -> Float
```


## function `log2`

Returns the base-2 logarithm of `x`. The same as `Math.log(x, 2.0)`, and more direct.


```kex
log2(x) : Number -> Float
```


## function `log10`

Returns the base-10 logarithm of `x`.


```kex
log10(x) : Number -> Float
```


## function `exp`

Returns `e` raised to the power `x` — the inverse of `Math.log`.

Raises on overflow, which for a double happens a little past `x` of 709.


```kex
exp(x) : Number -> Float
```


## function `pow`

Returns `x` raised to the power `y`.

The result is always a `Float`, even for whole arguments, so round it when you need an integer back.


```kex
pow(x, y) : Number -> Number -> Float
```


## function `abs`

Returns the magnitude of `x`, discarding its sign. The type is preserved: an `Integer` in gives an `Integer` out.

`x.abs` is the same thing as a method, and usually reads better.


```kex
abs(x) : Number -> Number
```


## function `floor`

Returns the largest integer that is not greater than `x` — rounding toward negative infinity.


```kex
floor(x) : Number -> Integer
```


## function `ceil`

Returns the smallest integer that is not less than `x` — rounding toward positive infinity.


```kex
ceil(x) : Number -> Integer
```


## function `hypot`

Returns the Euclidean distance `sqrt(x*x ` y*y)+, computed so that large values do not overflow on the way.


```kex
hypot(x, y) : Number -> Number -> Float
```

