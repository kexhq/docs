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

### `one` (constant)

```kex
one : Dimension
```

The dimension with no remaining base factors.



### `base`

```kex
base(marker: A) -> Dimension
```

Defines a base dimension using the nominal type of a marker value.

**Parameters**

  - `marker` — a value of a dedicated marker type

**Returns**: that base dimension, raised to the first power

### `fromPowers`

```kex
fromPowers(powers: {Type: Integer}) -> Dimension
```

Normalizes a map of base identities and powers.

**Parameters**

  - `powers` — the dimension's exponents

**Returns**: the same dimension with zero exponents removed

## record `Dimension`

A normalized map from base identities to integer exponents.

Construct dimensions with `Dimensions.base` and compose them with arithmetic. If importing a map, use `Dimensions.fromPowers` to remove zero exponents. This runtime representation does not itself provide static measure typing.

**Fields**

  - `powers` : {[Type](type.md#record-type): [Integer](number.md#make-integer)}

### Methods

#### `dimensionless?`

```kex
dimensionless? : Bool
```

Whether every base factor has cancelled.

**Returns**: true for a dimensionless quantity

#### `exponentOf`

```kex
exponentOf(marker: A) -> Integer
```

The exponent of the supplied marker's dimension, or zero if absent.

**Parameters**

  - `marker` — a value of the base marker type

**Returns**: the base's exponent

#### `*`

```kex
*(other: Dimension) -> Dimension
```

Composes dimensions by adding their base exponents.

**Parameters**

  - `other` — the other factor

**Returns**: the normalized product

#### `/`

```kex
/(other: Dimension) -> Dimension
```

Composes dimensions by subtracting the denominator's exponents.

**Parameters**

  - `other` — the denominator's dimension

**Returns**: the normalized quotient

#### `^`

```kex
^(exponent: Integer) -> Dimension
```

Raises a dimension to an integer power, including zero and negatives.

**Parameters**

  - `exponent` — the power

**Returns**: the normalized powered dimension
