---
package: prelude
version: "0.4.0-beta.4-dev"
source: stream.kex
title: Stream
entities:
  - { kind: type, name: "Stream" }
  - { kind: module, name: "Stream" }
  - { kind: make, name: "Stream<A>" }
---

# Stream

## type `Stream<A>`

A lazy, potentially infinite sequence.

A stream describes how to produce its elements rather than holding them, so an infinite one is an ordinary value. Nothing is computed until you ask for elements with `take`.

```kex
let naturals = Stream.Sequence(from: 0) { |n| n + 1 }
naturals.take(5)                              # => [0, 1, 2, 3, 4]
naturals.map { |n| n * n }.take(4)            # => [0, 1, 4, 9]
naturals.filter { |n| n.even? }.take(3)       # => [0, 2, 4]
```

`map`, `filter` and `drop` all answer with another stream, so a pipeline stays lazy end to end; `take` is what turns it into a list.

Streams are best for generated sequences you may revisit. A file or socket is different: it can only be consumed once, so those APIs return a `Feed`. Convert a small feed with `toStream` only when replaying it is worth keeping every value already read.

### Methods

#### `take`

```kex
take(n: Integer) -> [A]
```

Returns the first `n` elements as a list, computing the stream up to that point.

This is the operation that ends a lazy pipeline and gives you real data.

**Parameters**

  - `n` — how many elements to produce

**Returns**: the first `n` elements

**Examples**

```kex
Stream.Sequence(from: 1) { |n| n + 1 }.take(3)   # => [1, 2, 3]
```

_The first ten squares_

```kex
Stream.Sequence(from: 1) { |n| n + 1 }
  .map { |n| n * n }
  .take(10)
```

_Generating retry delays without building an unbounded list_

```kex
let delays = Stream.Sequence(from: 1.seconds) { |d| d * 2 }
delays.take(4)   # => [1 second, 2 seconds, 4 seconds, 8 seconds]
```

#### `drop`

```kex
drop(n: Integer) -> Stream<A>
```

Returns a new stream that skips the first `n` elements.

Still a stream, so the result stays lazy: pair it with `take` to get a window out of the middle.

**Parameters**

  - `n` — how many elements to skip

**Returns**: the stream, offset by `n`

**Examples**

```kex
Stream.Sequence(from: 0) { |n| n + 1 }.drop(3).take(3)   # => [3, 4, 5]
```

_Paging through a generated sequence_

```kex
let page(n: Integer) = source.drop(n * 20).take(20)
```

#### `map`

```kex
map(f: (A -> B)) -> Stream<B>
```

Returns a new stream with `f` applied to each element.

`f` is not called until elements are taken, and then only for those that are.

**Parameters**

  - `f` — applied to each element

**Returns**: the mapped stream

**Examples**

```kex
Stream.Sequence(from: 1) { |n| n + 1 }.map { |n| n * n }.take(4)
# => [1, 4, 9, 16]
```

_Formatting as it goes_

```kex
Stream.Sequence(from: 1) { |n| n + 1 }
  .map { |n| "item ${n}" }
  .take(3)
# => ["item 1", "item 2", "item 3"]
```

#### `filter`

```kex
filter(pred: (A -> Bool)) -> Stream<A>
```

Returns a new stream with only the elements `pred` accepts.

Producing `n` filtered elements may require walking many more upstream ones, so a predicate that almost never holds makes `take` run for a long time, and one that never holds makes it run forever.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the filtered stream

**Examples**

```kex
let evens = Stream.Sequence(from: 0) { |n| n + 1 }.filter { |n| n.even? }
evens.take(4)   # => [0, 2, 4, 6]
```

_Multiples of three, formatted_

```kex
Stream.Sequence(from: 1) { |n| n + 1 }
  .filter { |n| n.modulo(3) == 0 }
  .map { |n| "#${n}" }
  .take(3)
# => ["#3", "#6", "#9"]
```

#### `each`

```kex
each(f: (A -> Void)) -> Void
```

Applies `f` to every element.

Only ever finishes on a stream that ends: a file's lines converted with `Feed.toStream`, or anything `take` has bounded. On `Stream.Sequence` this runs forever, exactly as writing the same loop by hand would.

**Parameters**

  - `f` — applied to each element

**Examples**

```kex
Stream.Sequence(from: 1) { |n| n + 1 }
  .map { |n| n * n }
  .toFeed
  .take(3)
  .each { |n| IO.printLine(n) }
```

#### `toFeed`

```kex
toFeed : Feed<A>
```

Returns a `Feed` that walks this stream once.

A stream remembers every element forced through it, so walking a long one holds all of it for as long as the stream is in scope. A feed drawn from it walks without holding the start, letting each element go as it passes: the way to consume a long stream in constant space.

**Returns**: a one-shot cursor over the stream

**Examples**

_Summing a long generated sequence without holding it_

```kex
let total = Stream.Sequence(from: 1) { |n| n + 1 }
  .toFeed
  .take(1000000)
  .sum
```

## module `Stream`

Constructors for `Stream`.

### `Sequence`

```kex
Sequence(from: A, step: (A -> A)) -> Stream<A>
```

Builds an infinite stream from a first element and a step function.

The stream is `from`, then `step(from)`, then `step(step(from))`, and so on: nothing is computed until you take from it.

**Parameters**

  - `from` — the first element
  - `step` — produces the next element from the current one

**Returns**: the generated stream

**Examples**

_Counting up_

```kex
let naturals = Stream.Sequence(from: 0) { |n| n + 1 }
naturals.take(5)   # => [0, 1, 2, 3, 4]
```

_Powers of two_

```kex
let powers = Stream.Sequence(from: 1) { |n| n * 2 }
powers.take(6)     # => [1, 2, 4, 8, 16, 32]
```

_A geometric decay_

```kex
Stream.Sequence(from: 1.0) { |x| x / 2.0 }.take(4)
# => [1.0, 0.5, 0.25, 0.125]
```

### `Iterate`

```kex
Iterate(seed: A, step: (A -> A)) -> Stream<A>
```

Builds an infinite stream from a seed and a step function. The same thing as `Sequence`: use whichever reads better where you are.

**Parameters**

  - `seed` — the first element
  - `step` — produces the next element from the current one

**Returns**: the generated stream

**Examples**

```kex
let odds = Stream.Iterate(1) { |n| n + 2 }
odds.take(5)   # => [1, 3, 5, 7, 9]
```

### `empty` (constant)

The stream with no elements.

**Examples**

```kex
Stream.empty.take(3)   # => []
```


