---
package: prelude
version: "0.3.2"
source: bits.kex
title: Bits
entities:
  - { kind: module, name: "Bits" }
---

# Bits

## module `Bits`

The `Bits` module provides bitwise operations on `Integer`.

Integers are arbitrary precision, and a negative one behaves as if it were written in infinite-precision two's complement — so `Bits.not(0)` is `-1` and `Bits.and(-1, 255)` is `255`, with no word size to overflow. Shifts and bit indices count from bit 0 (the least significant bit).

## function `and`

Bitwise AND of `a` and `b`.


```kex
and(a, b) : Integer -> Integer -> Integer
```


## function `or`

Bitwise OR of `a` and `b`.


```kex
or(a, b) : Integer -> Integer -> Integer
```


## function `xor`

Bitwise exclusive OR of `a` and `b`.


```kex
xor(a, b) : Integer -> Integer -> Integer
```


## function `not`

Bitwise complement of `a`. Every integer is signed and unbounded, so this is always `-(a ` 1)+ rather than a width-dependent mask.


```kex
not(a) : Integer -> Integer
```


## function `shiftLeft`

Shifts `n` left by `by` bits. Raises if `by` is negative.


```kex
shiftLeft(n, by) : Integer -> Integer -> Integer
```


## function `shiftRight`

Shifts `n` right by `by` bits, propagating the sign — the result of shifting a negative number stays negative. Raises if `by` is negative.


```kex
shiftRight(n, by) : Integer -> Integer -> Integer
```


## function `test?`

True when the bit at `index` of `n` is set. Raises if `index` is negative.


```kex
test?(n, index) : Integer -> Integer -> Bool
```


## function `set`

`n` with the bit at `index` set. Raises if `index` is negative.


```kex
set(n, index) : Integer -> Integer -> Integer
```


## function `clear`

`n` with the bit at `index` cleared. Raises if `index` is negative.


```kex
clear(n, index) : Integer -> Integer -> Integer
```


## function `toggle`

`n` with the bit at `index` flipped. Raises if `index` is negative.


```kex
toggle(n, index) : Integer -> Integer -> Integer
```


## function `count`

Number of set bits in `n` (population count). A negative value has infinitely many under two's complement, so this raises for one.


```kex
count(n) : Integer -> Integer
```


## function `width`

Number of bits needed to represent `n`, i.e. the position of its highest set bit plus one. Zero needs none. Raises for a negative value.


```kex
width(n) : Integer -> Integer
```

