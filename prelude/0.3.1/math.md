---
package: prelude
version: "0.3.1"
source: math.kex
title: Math
entities:
  - { kind: module, name: "Math" }
---

# Math

## module `Math`

The `Math` module provides standard mathematical constants and functions. All trigonometric functions operate in radians. A Kex `Float` is always finite, so a domain error (`Math.sqrt(-1.0)`) or an overflow (`Math.exp(1000.0)`) raises rather than producing `NaN` or `Infinity` — the same rule BEAM enforces, where those two values cannot exist at all.

## constant `PI`

Math.PI : Float Ratio of a circle's circumference to its diameter.



## constant `E`

Math.E : Float Base of the natural logarithm.



## function `sqrt`

Square root of `x`. Raises for negative input, which has no real root.


```kex
sqrt(x) : Number -> Float
```


## function `cbrt`

Cube root of `x`.


```kex
cbrt(x) : Number -> Float
```


## function `sin`

Sine of `x` (radians).


```kex
sin(x) : Number -> Float
```


## function `cos`

Cosine of `x` (radians).


```kex
cos(x) : Number -> Float
```


## function `tan`

Tangent of `x` (radians).


```kex
tan(x) : Number -> Float
```


## function `asin`

Inverse sine (arc sine) of `x`, result in radians.


```kex
asin(x) : Number -> Float
```


## function `acos`

Inverse cosine (arc cosine) of `x`, result in radians.


```kex
acos(x) : Number -> Float
```


## function `atan`

Inverse tangent (arc tangent) of `x`, result in radians in (-π/2, π/2).


```kex
atan(x) : Number -> Float
```


## function `atan2`

Two-argument arc tangent. Returns the angle of vector (`x`, `y`) in (-π, π]. Handles the sign of both arguments to place the result in the correct quadrant.


```kex
atan2(y, x) : Number -> Number -> Float
```


## function `sinh`

Hyperbolic sine.


```kex
sinh(x) : Number -> Float
```


## function `cosh`

Hyperbolic cosine.


```kex
cosh(x) : Number -> Float
```


## function `tanh`

Hyperbolic tangent.


```kex
tanh(x) : Number -> Float
```


## function `log`

Natural logarithm of `x` (base e). With two arguments, computes log base `base`.


```kex
log(x) : Number -> Float
log(x) : Number -> Number -> Float
```


## function `log2`

Base-2 logarithm of `x`.


```kex
log2(x) : Number -> Float
```


## function `log10`

Base-10 logarithm of `x`.


```kex
log10(x) : Number -> Float
```


## function `exp`

`e` raised to the power `x`.


```kex
exp(x) : Number -> Float
```


## function `pow`

`x` raised to the power `y`.


```kex
pow(x, y) : Number -> Number -> Float
```


## function `abs`

Absolute value of `x`.


```kex
abs(x) : Number -> Number
```


## function `floor`

Floor of `x` — largest integer not greater than `x`.


```kex
floor(x) : Number -> Integer
```


## function `ceil`

Ceiling of `x` — smallest integer not less than `x`.


```kex
ceil(x) : Number -> Integer
```


## function `hypot`

Euclidean distance — equivalent to `sqrt(x*x ` y*y)+ but avoids intermediate overflow for large values.


```kex
hypot(x, y) : Number -> Number -> Float
```

