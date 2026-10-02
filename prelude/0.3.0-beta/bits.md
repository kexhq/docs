---
package: prelude
version: "0.3.0-beta"
source: bits.kex
title: Bits
entities:
  - { kind: module, name: "Bits" }
---

# Bits

## module `Bits`

The `Bits` module provides bitwise operations on `Integer`.

Integers are arbitrary precision, and a negative one behaves as if it were written in infinite-precision two's complement — so `Bits.not(0)` is `-1` and `Bits.and(-1, 255)` is `255`, with no word size to overflow. Shifts and bit indices count from bit 0 (the least significant bit).

### `and`

```kex
and(a: Integer, b: Integer) -> Integer
```

Bitwise AND of `a` and `b`.

**Examples**

```kex
Bits.and(0b1100, 0b1010)   # => 0b1000
Bits.and(0xff, 0x0f)       # => 15
```

### `or`

```kex
or(a: Integer, b: Integer) -> Integer
```

Bitwise OR of `a` and `b`.

**Examples**

```kex
Bits.or(0b1100, 0b1010)   # => 0b1110
```

### `xor`

```kex
xor(a: Integer, b: Integer) -> Integer
```

Bitwise exclusive OR of `a` and `b`.

**Examples**

```kex
Bits.xor(0b1100, 0b1010)   # => 0b0110
```

### `not`

```kex
not(a: Integer) -> Integer
```

Bitwise complement of `a`. Every integer is signed and unbounded, so this is always +-(a + 1)+ rather than a width-dependent mask.

**Examples**

```kex
Bits.not(0)   # => -1
Bits.not(5)   # => -6
```

### `shiftLeft`

```kex
shiftLeft(n: Integer, by: Integer) -> Integer
```

Shifts `n` left by `by` bits. Raises if `by` is negative.

**Examples**

```kex
Bits.shiftLeft(1, 8)   # => 256
```

### `shiftRight`

```kex
shiftRight(n: Integer, by: Integer) -> Integer
```

Shifts `n` right by `by` bits, propagating the sign — the result of shifting a negative number stays negative. Raises if `by` is negative.

**Examples**

```kex
Bits.shiftRight(256, 8)   # => 1
Bits.shiftRight(-8, 1)    # => -4
```

### `test?`

```kex
test?(n: Integer, index: Integer) -> Bool
```

True when the bit at `index` of `n` is set. Raises if `index` is negative.

**Examples**

```kex
Bits.test?(0b1000, 3)   # => true
Bits.test?(0b1000, 0)   # => false
```

### `set`

```kex
set(n: Integer, index: Integer) -> Integer
```

`n` with the bit at `index` set. Raises if `index` is negative.

**Examples**

```kex
Bits.set(0, 3)   # => 8
```

### `clear`

```kex
clear(n: Integer, index: Integer) -> Integer
```

`n` with the bit at `index` cleared. Raises if `index` is negative.

**Examples**

```kex
Bits.clear(0b1111, 0)   # => 14
```

### `toggle`

```kex
toggle(n: Integer, index: Integer) -> Integer
```

`n` with the bit at `index` flipped. Raises if `index` is negative.

**Examples**

```kex
Bits.toggle(0b1010, 0)   # => 11
```

### `count`

```kex
count(n: Integer) -> Integer
```

Number of set bits in `n` (population count). A negative value has infinitely many under two's complement, so this raises for one.

**Examples**

```kex
Bits.count(0b1011)   # => 3
```

### `width`

```kex
width(n: Integer) -> Integer
```

Number of bits needed to represent `n`, i.e. the position of its highest set bit plus one. Zero needs none. Raises for a negative value.

**Examples**

```kex
Bits.width(0)     # => 0
Bits.width(255)   # => 8
Bits.width(256)   # => 9
```
