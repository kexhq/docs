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

These generators are not cryptographic; do not use their output for secrets. `Random.secureBytes` and `Random.token` are, and are what secrets come from.

**Examples**

_Roll a die or initialize a weight_

```kex
using Random
let roll = Random.integer(1..6)
let weight = Random.float(-1.0..1.0)
```

_Reproduce a sequence_

```kex
let generator = Random.seeded(42)
let (first, afterFirst) = generator.integer(1..6)
let (second, afterSecond) = afterFirst.integer(1..6)
```

### `seeded`

```kex
seeded(seed: Integer) -> Generator
```

Starts a deterministic sequence. Any Integer seed is reduced modulo 2^64.

**Parameters**

  - `seed` — reproducible seed, including negative or large values

**Returns**: initial state; no draw has been consumed

### `fresh`

```kex
fresh : Generator
```

Starts a generator using fresh host entropy.

**Returns**: initial state for a sequence that varies between runs

### `integer`

```kex
integer(range: Range<Integer>) -> Integer
```

Draws an integer from an inclusive range using fresh entropy.

**Parameters**

  - `range` — ascending inclusive bounds, span at most 2^64

**Returns**: drawn value

### `float`

```kex
float(range: Range<Float> = …) -> Float
```

Draws a float; defaults to [0.0, 1.0). The upper bound is excluded.

**Parameters**

  - `range` — finite, strictly ascending bounds

**Returns**: drawn value

### `boolean`

```kex
boolean : Bool
```

Draws a fair coin flip using fresh entropy.

**Returns**: true or false with equal probability

### `chance?`

```kex
chance?(probability: Float) -> Bool
```

Returns true with the supplied probability using fresh entropy.

**Parameters**

  - `probability` — probability from 0.0 through 1.0

**Returns**: sampled outcome

### `choice`

```kex
choice(items: [X]) -> X?
```

Chooses a position uniformly, returning None for an empty input.

**Parameters**

  - `items` — values to choose from

**Returns**: chosen value, if any

### `sample`

```kex
sample(items: [X], count: Integer) -> [X]
```

Samples positions without replacement; duplicate values remain possible.

**Parameters**

  - `items` — population
  - `count` — nonnegative count; capped at the input size

**Returns**: values selected in random order

### `shuffle`

```kex
shuffle(items: [X]) -> [X]
```

Returns a random permutation using fresh entropy.

**Parameters**

  - `items` — values to shuffle

**Returns**: shuffled copy

### `secureBytes`

```kex
secureBytes(count: Integer) -> Binary
```

Returns `count` bytes from the operating system's cryptographically secure generator: the source for keys, session tokens and unguessable identifiers, which the generators above must never be used for.

Nothing about it is reproducible, and there is no `Generator` form.

**Parameters**

  - `count` — how many bytes; zero or less gives an empty binary

**Returns**: the random bytes

**Examples**

_A 256-bit key_

```kex
let key = Random.secureBytes(32)
```

### `token`

```kex
token(bytes: Integer = …) -> String
```

Returns an unguessable token: `bytes` secure random bytes, as lowercase hex, so the text is twice as long as `bytes`.

**Parameters**

  - `bytes` — how many random bytes the token carries

**Returns**: the token

**Examples**

_A session identifier_

```kex
let session = Random.token(32)   # => "9f86d081884c7d65..." (64 characters)
```

## record `Generator`

Immutable state of a deterministic random sequence.

Construct with `Random.seeded` or `Random.fresh`. Each draw returns its value first and the advanced generator second. Equal seeds reproduce equal sequences for the same operations on both backends.

**Fields**

  - `state` : [Integer](number.md#make-integer) (optional)



## module `Random.Generator`



## type `Random.Generator`

### `integer`

```kex
integer(range: Range<Integer>) -> (Integer, Generator)
```

Draws an integer between both endpoints, with the advanced generator. The range must be ascending and contain at most 2^64 integers. A singleton range is valid and still consumes a draw.

**Parameters**

  - `range` — inclusive integer bounds

**Returns**: drawn integer and advanced state

**Examples**

_A reproducible die roll_

```kex
let (roll, advanced) = Random.seeded(42).integer(1..6)
```

### `float`

```kex
float(range: Range<Float>) -> (Float, Generator)
```

Draws a float from the lower bound inclusive to the upper bound exclusive. Defaults to `0.0..1.0`. Bounds must be finite and strictly ascending.

**Parameters**

  - `range` — half-open floating-point bounds

**Returns**: drawn float and advanced state

**Examples**

_Initialize a model weight_

```kex
let (weight, advanced) = Random.seeded(42).float(-1.0..1.0)
```

### `boolean`

```kex
boolean : (Bool, Generator)
```

Draws a fair Boolean and returns the advanced generator.

**Returns**: coin flip and advanced state

### `chance?`

```kex
chance?(probability: Float) -> (Bool, Generator)
```

Draws true with the supplied probability. Consumes one draw even at 0 or 1.

**Parameters**

  - `probability` — probability from 0.0 through 1.0

**Returns**: outcome and advanced state

### `choice`

```kex
choice(items: [X]) -> (X?, Generator)
```

Chooses an input position uniformly. Empty input returns None without a draw.

**Parameters**

  - `items` — values to choose from

**Returns**: optional value and advanced state

### `sample`

```kex
sample(items: [X], count: Integer) -> ([X], Generator)
```

Selects input positions without replacement, in random order. Duplicate input values may appear more than once in the result. A count larger than the input selects every position; zero consumes no draws.

**Parameters**

  - `items` — population; unchanged by sampling
  - `count` — nonnegative number of positions to select

**Returns**: selected values and advanced state

**Examples**

_Deal five cards reproducibly_

```kex
let (hand, advanced) = Random.seeded(42).sample(cards, count: 5)
```

### `shuffle`

```kex
shuffle(items: [X]) -> ([X], Generator)
```

Returns a random permutation, preserving duplicates and the input itself. Empty input consumes no draws.

**Parameters**

  - `items` — values to shuffle

**Returns**: permutation and advanced state


