---
package: prelude
version: "0.4.0-alpha"
source: stream.kex
title: Stream
entities:
  - { kind: type, name: "Stream" }
  - { kind: module, name: "Stream" }
  - { kind: make, name: "Stream<A>" }
---

# Stream

## type `Stream<A>`



## module `Stream`

## function `Sequence`

Creates an infinite stream starting at `from`, applying `step` to produce each successive element.

  let powers = Stream.Sequence(from: 1) { |n| n * 2 }   powers.take(6)     # => [1, 2, 4, 8, 16, 32]


```kex
Sequence(from, step)
```


## function `Iterate`

Creates an infinite stream seeded with `seed`, applying `f` to each element to produce the next. Equivalent to `Sequence`; use whichever reads more clearly at the call site.


```kex
Iterate(seed, step)
```


## make `Stream<A>`


#### `take`

Returns the first `n` elements as a list. Evaluates the stream up to that point.

```kex
take(n) : Integer -> [A]
```

**Returns**: `[A]`

**Examples**

```kex
  Stream.Sequence(from: 1) { |n| n + 1 }.take(3)   # => [1, 2, 3]
```

#### `drop`

Skips the first `n` elements and returns a new stream offset by `n`.

```kex
drop(n) : Integer -> Stream<A>
```

**Returns**: `Stream<A>`

**Examples**

```kex
  Stream.Sequence(from: 0) { |n| n + 1 }.drop(3).take(3)   # => [3, 4, 5]
```

#### `map`

Returns a new stream applying `f` to each element.

```kex
map(f) : (A -> B) -> Stream<B>
```

**Returns**: `Stream<B>`

**Examples**

```kex
  Stream.Sequence(from: 1) { |n| n + 1 }.map { |n| n * n }.take(4)
  # => [1, 4, 9, 16]
```

#### `filter`

Returns a new stream keeping only elements for which `pred` is `true`. Note: consuming `n` elements may require evaluating many upstream elements.

```kex
filter(pred) : (A -> Bool) -> Stream<A>
```

**Returns**: `Stream<A>`

**Examples**

```kex
  let evens = Stream.Sequence(from: 0) { |n| n + 1 }.filter { |n| n.even? }
  evens.take(4)   # => [0, 2, 4, 6]
```
