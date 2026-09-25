---
package: prelude
version: "0.4.0-beta.4-dev"
source: bits.kex
title: Bits
entities:
  - { kind: module, name: "Bits" }
---

# Bits

## module `Bits`

Bitwise operations on `Integer`.

```kex
Bits.and(0xff, 0x0f)      # => 15
Bits.shiftLeft(1, 8)      # => 256
Bits.test?(0b1010, 1)     # => true
```

Useful for packing flags into one number, reading a binary format, or working with a protocol that describes its fields in bits.

Integers are arbitrary precision, and a negative one behaves as if it were written in infinite-precision two's complement, so `Bits.not(0)` is `-1` and `Bits.and(-1, 255)` is `255`, with no word size to overflow. Shifts and bit indices count from bit 0 (the least significant bit).

### `and`

```kex
and(a: Integer, b: Integer) -> Integer
```

Bitwise AND of `a` and `b`.

**Parameters**

  - `a` — the first operand
  - `b` — the second operand

**Returns**: the result

**Examples**

```kex
Bits.and(0b1100, 0b1010)   # => 0b1000
Bits.and(0xff, 0x0f)       # => 15
```

_Masking off the low byte of a value_

```kex
Bits.and(value, 0xff)
```

_Testing whether a flag is present in a bitmask_

```kex
Bits.and(flags, READONLY) != 0
```

### `or`

```kex
or(a: Integer, b: Integer) -> Integer
```

Bitwise OR of `a` and `b`.

**Parameters**

  - `a` — the first operand
  - `b` — the second operand

**Returns**: the result

**Examples**

```kex
Bits.or(0b1100, 0b1010)   # => 0b1110
```

_Combining flags into one value_

```kex
Bits.or(Bits.or(READ, WRITE), APPEND)
```

### `xor`

```kex
xor(a: Integer, b: Integer) -> Integer
```

Bitwise exclusive OR of `a` and `b`.

**Parameters**

  - `a` — the first operand
  - `b` — the second operand

**Returns**: the result

**Examples**

```kex
Bits.xor(0b1100, 0b1010)   # => 0b0110
```

_Toggling a set of flags_

```kex
Bits.xor(flags, VERBOSE)
```

### `not`

```kex
not(a: Integer) -> Integer
```

Bitwise complement of `a`. Every integer is signed and unbounded, so this is always +-(a + 1)+ rather than a width-dependent mask.

**Parameters**

  - `a` — the operand

**Returns**: the complement

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

**Parameters**

  - `n` — the value to shift
  - `by` — how many bits to shift by

**Returns**: the shifted value

**Examples**

```kex
Bits.shiftLeft(1, 8)   # => 256
Bits.shiftLeft(3, 2)   # => 12
```

_Building a flag constant for bit n_

```kex
Bits.shiftLeft(1, n)
```

### `shiftRight`

```kex
shiftRight(n: Integer, by: Integer) -> Integer
```

Shifts `n` right by `by` bits, propagating the sign: the result of shifting a negative number stays negative. Raises if `by` is negative.

**Parameters**

  - `n` — the value to shift
  - `by` — how many bits to shift by

**Returns**: the shifted value

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

**Parameters**

  - `n` — the value to inspect
  - `index` — the bit position, counting from 0

**Returns**: `true` when that bit is set

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

**Parameters**

  - `n` — the value to modify
  - `index` — the bit position, counting from 0

**Returns**: the modified value

**Examples**

```kex
Bits.set(0, 3)   # => 8
```

### `clear`

```kex
clear(n: Integer, index: Integer) -> Integer
```

`n` with the bit at `index` cleared. Raises if `index` is negative.

**Parameters**

  - `n` — the value to modify
  - `index` — the bit position, counting from 0

**Returns**: the modified value

**Examples**

```kex
Bits.clear(0b1111, 0)   # => 14
```

### `toggle`

```kex
toggle(n: Integer, index: Integer) -> Integer
```

`n` with the bit at `index` flipped. Raises if `index` is negative.

**Parameters**

  - `n` — the value to modify
  - `index` — the bit position, counting from 0

**Returns**: the modified value

**Examples**

```kex
Bits.toggle(0b1010, 0)   # => 11
```

### `count`

```kex
count(n: Integer) -> Integer
```

Number of set bits in `n` (population count). A negative value has infinitely many under two's complement, so this raises for one.

**Parameters**

  - `n` — the value to measure

**Returns**: the count

**Examples**

```kex
Bits.count(0b1011)   # => 3
Bits.count(255)      # => 8
```

_How many flags are set_

```kex
Bits.count(flags)
```

### `width`

```kex
width(n: Integer) -> Integer
```

Number of bits needed to represent `n`, i.e. the position of its highest set bit plus one. Zero needs none. Raises for a negative value.

**Parameters**

  - `n` — the value to measure

**Returns**: the count

**Examples**

```kex
Bits.width(0)     # => 0
Bits.width(255)   # => 8
Bits.width(256)   # => 9
```
