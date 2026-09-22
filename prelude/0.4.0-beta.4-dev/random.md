---
package: prelude
version: "0.4.0-beta.4-dev"
source: random.kex
title: Random
entities:
  - { kind: module, name: "Random" }
---

# Random

## module `Random`

Random values for simulations, sampling, games, and reproducible tests.

Import with `using Random`. Ordinary calls return a value directly; a `Random.Generator` returns `(value, nextGenerator)`. Reusing the same generator replays the same draw. Pass its returned state to continue.

These generators are not cryptographic; do not use their output for secrets.

## record `Generator`

Immutable state of a deterministic random sequence.

Construct with `Random.seeded` or `Random.fresh`. Each draw returns its value first and the advanced generator second. Equal seeds reproduce equal sequences for the same operations on both backends.

**Fields**

  - `state` : Integer (optional)

## function `seeded`

Starts a deterministic sequence. Any Integer seed is reduced modulo 2^64.


```kex
seeded(seed)
```


## function `fresh`

Starts a generator using fresh host entropy.


```kex
fresh()
```


## module `Random.Generator`

## make `Random.Generator`


#### `integer`

Draws an integer between both endpoints, with the advanced generator. The range must be ascending and contain at most 2^64 integers. A singleton range is valid and still consumes a draw.

```kex
integer(range)
```

**Returns**: `(Integer, Generator)` — drawn integer and advanced state

**Examples**

_A reproducible die roll_

```kex
let (roll, advanced) = Random.seeded(42).integer(1..6)
```

#### `float`

Draws a float from the lower bound inclusive to the upper bound exclusive. Defaults to `0.0..1.0`. Bounds must be finite and strictly ascending.

```kex
float(range)
```

**Returns**: `(Float, Generator)` — drawn float and advanced state

**Examples**

_Initialize a model weight_

```kex
let (weight, advanced) = Random.seeded(42).float(-1.0..1.0)
```

#### `boolean`

Draws a fair Boolean and returns the advanced generator.

```kex
boolean : (Bool, Generator)
```

**Returns**: `(Bool, Generator)` — coin flip and advanced state

#### `chance?`

Draws true with the supplied probability. Consumes one draw even at 0 or 1.

```kex
chance?(probability)
```

**Returns**: `(Bool, Generator)` — outcome and advanced state

#### `choice`

Chooses an input position uniformly. Empty input returns None without a draw.

```kex
choice(items)
```

**Returns**: `(X?, Generator)` — optional value and advanced state

#### `sample`

Selects input positions without replacement, in random order. Duplicate input values may appear more than once in the result. A count larger than the input selects every position; zero consumes no draws.

```kex
sample(items, count)
```

**Returns**: `([X], Generator)` — selected values and advanced state

**Examples**

_Deal five cards reproducibly_

```kex
let (hand, advanced) = Random.seeded(42).sample(cards, count: 5)
```

#### `shuffle`

Returns a random permutation, preserving duplicates and the input itself. Empty input consumes no draws.

```kex
shuffle(items)
```

**Returns**: `([X], Generator)` — permutation and advanced state

## function `integer`

Draws an integer from an inclusive range using fresh entropy.


```kex
integer(range)
```


## function `float`

Draws a float; defaults to [0.0, 1.0). The upper bound is excluded.


```kex
float(range)
```


## function `boolean`

Draws a fair coin flip using fresh entropy.


```kex
boolean()
```


## function `chance?`

Returns true with the supplied probability using fresh entropy.


```kex
chance?(probability)
```


## function `choice`

Chooses a position uniformly, returning None for an empty input.


```kex
choice(items)
```


## function `sample`

Samples positions without replacement; duplicate values remain possible.


```kex
sample(items, count)
```


## function `shuffle`

Returns a random permutation using fresh entropy.


```kex
shuffle(items)
```

