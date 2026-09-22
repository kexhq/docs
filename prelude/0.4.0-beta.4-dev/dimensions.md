---
package: prelude
version: "0.4.0-beta.4-dev"
source: dimensions.kex
title: Dimensions
entities:
  - { kind: module, name: "Dimensions" }
---

# Dimensions

## module `Dimensions`

Dimension algebra, implemented with ordinary Kex maps and integers.

A base dimension is identified by the type of a marker value. Reuse that marker type to share a dimension across modules. Its display name and the marker's field values do not participate in dimensional arithmetic.

Multiplication adds exponents, division subtracts them, and integer powers multiply them. Zero exponents are removed so cancellation is structural.

## record `Dimension`

A normalized map from base identities to integer exponents.

Construct dimensions with `Dimensions.base` and compose them with arithmetic. If importing a map, use `Dimensions.fromPowers` to remove zero exponents. This runtime representation does not itself provide static measure typing.

**Fields**

  - `powers` : {Type: Integer}

## constant `one`

The dimension with no remaining base factors.



## function `base`

Defines a base dimension using the nominal type of a marker value.


```kex
base(marker)
```


## function `fromPowers`

Normalizes a map of base identities and powers.


```kex
fromPowers(powers)
```


## make `Dimension`


#### `dimensionless?`

Whether every base factor has cancelled.

```kex
dimensionless? : Bool
```

**Returns**: `Bool` — true for a dimensionless quantity

#### `exponentOf`

The exponent of the supplied marker's dimension, or zero if absent.

```kex
exponentOf(marker) : A -> Integer
```

**Returns**: `Integer` — the base's exponent

#### `*`

Composes dimensions by adding their base exponents.

```kex
*(other) : Dimension -> Dimension
```

**Returns**: `Dimension` — the normalized product

#### `/`

Composes dimensions by subtracting the denominator's exponents.

```kex
/(other) : Dimension -> Dimension
```

**Returns**: `Dimension` — the normalized quotient

#### `^`

Raises a dimension to an integer power, including zero and negatives.

```kex
^(exponent) : Integer -> Dimension
```

**Returns**: `Dimension` — the normalized powered dimension
