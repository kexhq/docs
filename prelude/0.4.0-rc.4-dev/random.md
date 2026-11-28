---
package: prelude
version: "0.4.0-rc.4-dev"
source: random.kex
title: Random
entities:
  - { kind: module, name: "Random" }
---

# Random

## module `Random`

Random numbers, choices and shuffles, for simulations, games and reproducible tests.

Nothing here is in scope until `using Random`. The module functions, such as `Random.integer`, draw from fresh entropy and return the value. For a sequence that can be replayed, start a `Random.Generator` with `Random.seeded`: each of its functions returns `(value, nextGenerator)`, and the next draw is made from `nextGenerator`. Drawing twice from the same generator gives the same value twice.

Invalid arguments, such as a descending range or a probability above 1, end the program with `die`.

None of this is suitable for secrets such as keys or tokens. Use `Random.secureBytes` or `Random.token` for those.

**Examples**

_Rolling a die and picking a weight_

```kex
using Random
let roll = Random.integer(1..6)
let weight = Random.float(-1.0..1.0)
```

_Replaying a sequence_

```kex
let generator = Random.seeded(42)
let (first, afterFirst) = generator.integer(1..6)      # first is 2
let (second, afterSecond) = afterFirst.integer(1..6)   # second is 2
```

### `seeded`

```kex
seeded(seed: Integer) -> Generator
```

Starts a reproducible sequence from `seed`.

Any Integer works, negative or large; it is reduced modulo 2^64.

**Parameters**

  - `seed` — the seed

**Returns**: a generator from which nothing has been drawn yet

**Examples**

```kex
let (roll, advanced) = Random.seeded(42).integer(1..6)   # roll is 2, every time
```

### `fresh` (foul)

```kex
fresh -> Generator
```

Starts a generator from fresh entropy, so the sequence differs between runs.

**Returns**: a generator from which nothing has been drawn yet

### `integer` (foul)

```kex
integer(range: Range<Integer>) -> Integer
```

Draws an integer from `range`, both ends included.

The range must be ascending and hold at most 2^64 integers.

**Parameters**

  - `range` — the bounds, both included

**Returns**: the integer

**Examples**

```kex
let roll = Random.integer(1..6)
```

### `float` (foul)

```kex
float(range: Range<Float> = …) -> Float
```

Draws a float from `range`, which includes its lower bound and excludes its upper one.

The range defaults to `0.0..1.0`. The bounds must be finite and strictly ascending.

**Parameters**

  - `range` — the bounds, upper one excluded

**Returns**: the float

### `boolean` (foul)

```kex
boolean -> Bool
```

Returns `true` or `false` with equal probability.

**Returns**: the result

### `chance?` (foul)

```kex
chance?(probability: Float) -> Bool
```

Returns `true` with the given probability.

**Parameters**

  - `probability` — the probability, from 0.0 to 1.0

**Returns**: the result

**Examples**

```kex
let critical = Random.chance?(0.05)
```

### `choice` (foul)

```kex
choice(items: [X]) -> X?
```

Picks one element of `items`, each position equally likely, or returns `None` for an empty list.

**Parameters**

  - `items` — the values to choose from

**Returns**: the chosen value, or `None`

### `sample` (foul)

```kex
sample(items: [X], count: Integer) -> [X]
```

Picks `count` elements of `items` without replacement, in random order.

Each position is picked at most once, but a repeated value can be picked more than once. A `count` larger than the list returns every element.

**Parameters**

  - `items` — the values to pick from
  - `count` — how many to pick, at least 0

**Returns**: the picked values

### `shuffle` (foul)

```kex
shuffle(items: [X]) -> [X]
```

Returns `items` in random order.

**Parameters**

  - `items` — the values to shuffle

**Returns**: the shuffled list

### `secureBytes` (foul)

```kex
secureBytes(count: Integer) -> Binary
```

Returns `count` bytes from the operating system's cryptographically secure generator.

Use it for keys, session tokens and identifiers that must not be guessable; the other functions in this module are not fit for that. The bytes cannot be reproduced, and there is no `Generator` version.

**Parameters**

  - `count` — how many bytes; 0 or less gives an empty binary

**Returns**: the random bytes

**Examples**

_A 256-bit key_

```kex
let key = Random.secureBytes(32)
```

### `token` (foul)

```kex
token(bytes: Integer = …) -> String
```

Returns `bytes` secure random bytes as lowercase hex, a string twice as long as `bytes`.

**Parameters**

  - `bytes` — how many random bytes; 32 if omitted

**Returns**: the token

**Examples**

_A session identifier_

```kex
Random.token(32)   # => "9f86d081884c7d65..." (64 characters)
```

## record `Generator`

The state of a reproducible random sequence.

Start one with `Random.seeded` or `Random.fresh`. Each draw returns the value and the advanced generator. The same seed gives the same sequence for the same calls, on the walker and on BEAM.

**Fields**

  - `state` : [Integer](number.md#make-integer) (optional)



## module `Random.Generator`



## type `Random.Generator`

### `integer`

```kex
integer(range: Range<Integer>) -> (Integer, Generator)
```

Draws an integer from `range`, both ends included.

The range must be ascending and hold at most 2^64 integers. A range of one integer is allowed and still advances the generator.

**Parameters**

  - `range` — the bounds, both included

**Returns**: the integer and the advanced generator

**Examples**

_A reproducible die roll_

```kex
let (roll, advanced) = Random.seeded(42).integer(1..6)   # roll is 2
```

### `float`

```kex
float(range: Range<Float>) -> (Float, Generator)
```

Draws a float from `range`, which includes its lower bound and excludes its upper one.

Without an argument the range is `0.0..1.0`. The bounds must be finite and strictly ascending.

**Parameters**

  - `range` — the bounds, upper one excluded

**Returns**: the float and the advanced generator

**Examples**

_Initializing a model weight_

```kex
let (weight, advanced) = Random.seeded(42).float(-1.0..1.0)
```

### `boolean`

```kex
boolean -> (Bool, Generator)
```

Draws `true` or `false` with equal probability.

**Returns**: the result and the advanced generator

### `chance?`

```kex
chance?(probability: Float) -> (Bool, Generator)
```

Draws `true` with the given probability.

Even a probability of 0 or 1 advances the generator.

**Parameters**

  - `probability` — the probability, from 0.0 to 1.0

**Returns**: the result and the advanced generator

### `choice`

```kex
choice(items: [X]) -> (X?, Generator)
```

Picks one element of `items`, each position equally likely.

For an empty list it returns `None` and the generator unchanged.

**Parameters**

  - `items` — the values to choose from

**Returns**: the chosen value, and the advanced generator

### `sample`

```kex
sample(items: [X], count: Integer) -> ([X], Generator)
```

Picks `count` elements of `items` without replacement, in random order.

Each position is picked at most once, but a value that occurs several times in `items` can occur several times in the result. A `count` larger than the list returns every element, shuffled. A `count` of 0 returns `[]` and leaves the generator unchanged; a negative one ends the program.

**Parameters**

  - `items` — the values to pick from
  - `count` — how many to pick, at least 0

**Returns**: the picked values and the advanced generator

**Examples**

_Dealing five cards reproducibly_

```kex
let (hand, advanced) = Random.seeded(42).sample(cards, count: 5)
```

### `shuffle`

```kex
shuffle(items: [X]) -> ([X], Generator)
```

Returns `items` in random order.

An empty list leaves the generator unchanged.

**Parameters**

  - `items` — the values to shuffle

**Returns**: the shuffled list and the advanced generator

**Examples**

```kex
let (deck, advanced) = Random.seeded(42).shuffle([1, 2, 3, 4])   # deck is [2, 3, 1, 4]
```


