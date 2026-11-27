---
package: prelude
version: "0.4.0-rc.5-dev"
source: dimensions.kex
title: Dimensions
entities:
  - { kind: module, name: "Dimensions" }
---

# Dimensions

## module `Dimensions`

Dimension algebra at run time: a dimension maps base dimensions to integer exponents.

A base dimension is identified by the type of a marker value, so modules that use the same marker type share the dimension. The marker's field values play no part.

Multiplying adds exponents, dividing subtracts them, and raising to an integer power multiplies them. Zero exponents are dropped, so a dimension that cancels out equals `Dimensions.one`.

```kex
using Dimensions

record Distance do
end

record Span do
end

let speed = Dimensions.base(Distance {}) / Dimensions.base(Span {})
speed.exponentOf(Span {})   # => -1
```

### `one` (constant)

```kex
one : Dimension
```

Returns the dimensionless dimension, the identity for `*`.



### `base`

```kex
base(marker: A) -> Dimension
```

Returns the base dimension named by the type of `marker`, to the first power.

**Parameters**

  - `marker` — a value of a dedicated marker type

**Returns**: that base dimension, raised to the first power

### `fromPowers`

```kex
fromPowers(powers: {Type: Integer}) -> Dimension
```

Returns the dimension with the given exponents, dropping any that are zero.

**Parameters**

  - `powers` — the dimension's exponents

**Returns**: the same dimension with zero exponents removed

## record `Dimension`

A dimension: base dimension types mapped to their non-zero exponents.

Build one with `Dimensions.base` and combine with `*`, `/` and `^`. To build one from a map, use `Dimensions.fromPowers`, which drops zero exponents. This is a run-time value; the type checker does not track it.

**Fields**

  - `powers` : {[Type](type.md#record-type): [Integer](number.md#make-integer)}

### Functions

#### `dimensionless?`

```kex
dimensionless? -> Bool
```

Returns `true` when every base dimension has cancelled out.

**Returns**: `true` for a dimensionless quantity

#### `exponentOf`

```kex
exponentOf(marker: A) -> Integer
```

Returns the exponent of the base dimension named by `marker`'s type, or 0 when it is absent.

**Parameters**

  - `marker` — a value of the base marker type

**Returns**: the base's exponent

#### `*`

```kex
*(other: Dimension) -> Dimension
```

Multiplies two dimensions, adding their exponents.

**Parameters**

  - `other` — the other factor

**Returns**: the normalized product

#### `/`

```kex
/(other: Dimension) -> Dimension
```

Divides two dimensions, subtracting `other`'s exponents.

**Parameters**

  - `other` — the denominator's dimension

**Returns**: the normalized quotient

#### `^`

```kex
^(exponent: Integer) -> Dimension
```

Raises the dimension to an integer power, which may be zero or negative.

**Parameters**

  - `exponent` — the power

**Returns**: the normalized powered dimension
