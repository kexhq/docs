---
package: prelude
version: "0.4.0-rc.5-dev"
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

Reach for these to pack flags into one number or to read a binary format or protocol that defines its fields in bits.

Integers have no fixed width. A negative one acts as an infinitely long two's complement number, so `Bits.not(0)` is `-1` and `Bits.and(-1, 255)` is `255`, and nothing overflows. Bit positions count from 0, the least significant bit, and a negative position raises an error.

### `and`

```kex
and(a: Integer, b: Integer) -> Integer
```

Returns the bitwise AND of `a` and `b`.

**Parameters**

  - `a` — the first operand
  - `b` — the second operand

**Returns**: the bits set in both

**Examples**

```kex
Bits.and(0b1100, 0b1010)   # => 8
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

Returns the bitwise OR of `a` and `b`.

**Parameters**

  - `a` — the first operand
  - `b` — the second operand

**Returns**: the bits set in either

**Examples**

```kex
Bits.or(0b1100, 0b1010)   # => 14
```

_Combining flags into one value_

```kex
Bits.or(Bits.or(READ, WRITE), APPEND)
```

### `xor`

```kex
xor(a: Integer, b: Integer) -> Integer
```

Returns the bitwise exclusive OR of `a` and `b`.

**Parameters**

  - `a` — the first operand
  - `b` — the second operand

**Returns**: the bits set in exactly one of them

**Examples**

```kex
Bits.xor(0b1100, 0b1010)   # => 6
```

_Toggling a set of flags_

```kex
Bits.xor(flags, VERBOSE)
```

### `not`

```kex
not(a: Integer) -> Integer
```

Returns the bitwise complement of `a`, which is always +-(a + 1)+.

Integers have no fixed width, so there is no mask of 8, 32 or 64 bits; use `Bits.xor(a, 0xff)` to flip only the low byte.

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

Returns `n` shifted left by `by` bits. Raises an error if `by` is negative.

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

Returns `n` shifted right by `by` bits, keeping its sign.

A negative number stays negative, so `Bits.shiftRight(-1, 5)` is `-1`. Raises an error if `by` is negative.

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

Returns whether the bit at `index` of `n` is set. Raises an error if `index` is negative.

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

Returns `n` with the bit at `index` set. Raises an error if `index` is negative.

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

Returns `n` with the bit at `index` cleared. Raises an error if `index` is negative.

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

Returns `n` with the bit at `index` flipped. Raises an error if `index` is negative.

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

Returns the number of set bits in `n`, its population count.

A negative number has infinitely many set bits, so it raises an error.

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

Returns the number of bits needed to write `n`: the position of its highest set bit plus one.

`Bits.width(0)` is `0`. A negative number raises an error.

**Parameters**

  - `n` — the value to measure

**Returns**: the count

**Examples**

```kex
Bits.width(0)     # => 0
Bits.width(255)   # => 8
Bits.width(256)   # => 9
```
