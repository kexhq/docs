---
package: prelude
version: "0.3.4"
source: stream.kex
title: Stream
entities:
  - { kind: module, name: "Stream" }
  - { kind: make, name: "Stream<A>" }
---

# Stream

## module `Stream`

### `Sequence`

```kex
Sequence(from: A, step: (A -> A)) -> Stream<A>
```

Creates an infinite stream starting at `from`, applying `step` to produce each successive element.

**Parameters**

  - `from` — the first element
  - `step` — produces the next element from the current one

**Examples**

```kex
let naturals = Stream.Sequence(from: 0) { |n| n + 1 }
naturals.take(5)   # => [0, 1, 2, 3, 4]

let powers = Stream.Sequence(from: 1) { |n| n * 2 }
powers.take(6)     # => [1, 2, 4, 8, 16, 32]
```

### `Iterate`

```kex
Iterate(seed: A, step) -> Stream<A>
```

Creates an infinite stream seeded with `seed`, applying `f` to each element to produce the next. Equivalent to `Sequence`; use whichever reads more clearly at the call site.

**Examples**

```kex
let odds = Stream.Iterate(1) { |n| n + 2 }
odds.take(5)   # => [1, 3, 5, 7, 9]
```

## type `Stream<A>`

### `take`

```kex
take(n: Integer) -> [A]
```

Returns the first `n` elements as a list. Evaluates the stream up to that point.

**Examples**

```kex
Stream.Sequence(from: 1) { |n| n + 1 }.take(3)   # => [1, 2, 3]
```

### `drop`

```kex
drop(n: Integer) -> Stream<A>
```

Skips the first `n` elements and returns a new stream offset by `n`.

**Examples**

```kex
Stream.Sequence(from: 0) { |n| n + 1 }.drop(3).take(3)   # => [3, 4, 5]
```

### `map`

```kex
map(f: (A -> B)) -> Stream<B>
```

Returns a new stream applying `f` to each element.

**Examples**

```kex
Stream.Sequence(from: 1) { |n| n + 1 }.map { |n| n * n }.take(4)
# => [1, 4, 9, 16]
```

### `filter`

```kex
filter(pred: (A -> Bool)) -> Stream<A>
```

Returns a new stream keeping only elements for which `pred` is `true`. Note: consuming `n` elements may require evaluating many upstream elements.

**Examples**

```kex
let evens = Stream.Sequence(from: 0) { |n| n + 1 }.filter { |n| n.even? }
evens.take(4)   # => [0, 2, 4, 6]
```


