---
package: prelude
version: "0.4.0-beta.3-dev"
source: random.kex
title: Rng
entities:
  - { kind: record, name: "Rng" }
  - { kind: module, name: "Rng" }
  - { kind: make, name: "Rng" }
  - { kind: module, name: "Random" }
---

# Rng

## record `Rng`

Pseudorandom values: integers, floats, choices, and shuffles.

Opt-in: nothing here is in scope until `using Random`, which brings both the seeded generator and the ambient conveniences into scope at once.

```kex
using Random

main do
  IO.printLine(Random.between(1, 6))
  IO.printLine(Random.shuffle(["a", "b", "c"]))
end
```

Two layers, for two needs. `Rng` is a small deterministic generator with explicit state: the same seed answers the same sequence on every run and on both backends, which is what makes randomized code testable. `Random` is the ambient convenience layer over it: each call draws fresh entropy from the host, so answers differ between runs.

```kex
let rng = Rng.seeded(42)
let (roll, next) = rng.nextBounded(6)   # 0..5, then keep going with next
Random.integer(6)                       # 0..5, fresh entropy, foul
```

The generator is SplitMix64: tiny, fast, and good enough for modelling, games, sampling, shuffling, and randomized tests. It is NOT cryptographic: its state follows directly from its output, so never use it for secrets, tokens, or anything an adversary gets to see. The ambient layer draws its seeds from the host's secure source, but one secure seed does not make the stream that follows secure.

The state of a deterministic generator: one 64-bit word.

A value, not a handle: every step answers a new `Rng` alongside its output, and the old one keeps answering what it always did. Thread the answer forward and the sequence is reproducible from its seed.

```kex
let rng = Rng.seeded(42)
let (a, rng) = rng.nextUint64
let (b, rng) = rng.nextUint64   # same `a` and `b` on every run
```

Build one with `Rng.seeded` rather than by hand: the record literal does no range reduction, and every step here assumes a state inside 0..2^64 - 1.

**Fields**

  - `state` : Integer (optional)

## module `Rng`

Constructors and constants for the deterministic `Rng`. The draws themselves are methods in the `make` block below, so every one answers to Uniform Function Call Syntax: `rng.nextBounded(6)`.

## constant `maxBound`

One past the largest representable state: all arithmetic here is modulo 2^64, keeping the word closed under the mixing below. Also the largest exclusive bound one 64-bit draw can cover directly.

Public because the `make` block below lives outside this module and reaches it by qualification.



## constant `gamma`

The SplitMix64 odd increment: every addition steps the state by a different odd multiple, so even a seed of 0 walks the whole space.



## constant `mixA`

The two xor-shift/multiply mixing constants.



## constant `mixB`



## function `seeded`

Builds a generator from any integer seed.

The seed is reduced modulo 2^64, so negative seeds and huge ones are fine: every integer names a generator, and equal integers name the same one.


```kex
seeded(seed) : Integer -> Rng
```


## make `Rng`

The draws on an `Rng`. Each answers its draw alongside the generator that follows it, so state threads through a chain of calls. All are methods, so Uniform Function Call Syntax reaches every one.


#### `nextBounded`

Draws a uniform integer in 0..bound-1 and the generator that follows.

Uses rejection sampling rather than a bare remainder, so small bounds are not biased toward small answers: draws that would tilt the range are discarded and redrawn. Dies when `bound` is not positive or does not fit in one 64-bit word.

```kex
nextBounded(bound) : Integer -> (Integer, Rng)
```

**Returns**: `(Integer, Rng)` — the draw and the next generator

**Examples**

```kex
let (roll, _) = Rng.seeded(42).nextBounded(6)   # => 0..5
```
_Rolling again with the threaded state_

```kex
var rng = Rng.seeded(42)
let (first, advanced) = rng.nextBounded(6)
rng = advanced
```

#### `shuffle`

Shuffles a list into a new order, answering the generator that follows.

A selection shuffle: each position draws uniformly among the elements not yet placed, so every permutation is equally likely. The input is untouched; shuffling an empty list answers an empty list.

```kex
shuffle(items) : [A] -> ([A], Rng)
```

**Returns**: `([A], Rng)` — the shuffled elements and the next generator

**Examples**

```kex
let (order, _) = Rng.seeded(42).shuffle([1, 2, 3])
```

#### `sample`

Draws `n` distinct elements in random order, with the next generator.

Shuffles and takes the front: uniform over every ordered `n`-subset. Asking for more than the list holds answers the whole list shuffled; asking for none answers an empty list. Dies for a negative `n`.

```kex
sample(items, n) : [A] -> Integer -> ([A], Rng)
```

**Returns**: `([A], Rng)` — the drawn elements and the next generator

**Examples**

```kex
let (hand, _) = Rng.seeded(42).sample([1, 2, 3, 4, 5], 2)
hand.count   # => 2
```

#### `choice`

Draws one element uniformly, or `None` from an empty list.

The only fallible draw here, and the failure carries no information worth an error type: an empty list has no element to give, whatever the seed, so `None` is the whole story.

```kex
choice(items) : [A] -> (A?, Rng)
```

**Returns**: `(A?, Rng)` — the drawn element, if any, and the next generator

**Examples**

```kex
let (pick, _) = Rng.seeded(42).choice(["a", "b", "c"])
["a", "b", "c"].contains?(pick.or(""))   # => true
```

## module `Random`

Ambient randomness: fresh host entropy on every call.

Each function here draws its own seed from the host's secure source and runs the deterministic core above on it, so answers differ between runs the way the clock differs between reads. That is why every one is `foul`: the same call with the same arguments may answer differently.

Reach for `Rng` instead when the answers must repeat: seeded simulation, property tests, anything asserting on a particular draw.

## function `fresh`

Builds a generator from fresh host entropy.

The entry point for hand-threaded flows that still vary between runs: seed once here, then draw purely from the answer.


```kex
fresh()
```


## function `seeded`

Builds a generator from any integer seed. The deterministic entry: the same seed replays the same sequence, which is what tests want.


```kex
seeded(seed) : Integer -> Rng
```


## function `float`

Returns a uniform float in 0.0..1.0. Never answers 1.0 itself.


```kex
float()
```


## function `integer`

Returns a uniform integer in 0..bound-1. Dies unless `bound` is positive and fits in 64 bits.


```kex
integer(bound)
```


## function `between`

Returns a uniform integer in `low`..`high`, endpoints included. Dies unless `low` is below `high` and the span fits in 64 bits.


```kex
between(low, high)
```


## function `boolean`

Returns a fair coin flip.


```kex
boolean()
```


## function `chance?`

Returns `true` with probability `p`: a coin weighted by its argument. Dies unless `p` is inside 0.0..1.0.


```kex
chance?(p)
```


## function `choice`

Returns a uniformly drawn element, or `None` from an empty list.


```kex
choice(items)
```


## function `sample`

Returns `n` distinct elements in random order. Asking for more than the list holds answers the whole list shuffled. Dies for a negative `n`.


```kex
sample(items, n)
```


## function `shuffle`

Returns the elements in a uniformly random order.


```kex
shuffle(items)
```

