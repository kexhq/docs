---
package: prelude
version: "0.4.0-rc.5-dev"
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

A stream holds the rule for producing its elements, so it can be infinite. Elements are computed only when you ask for them with `take`.

```kex
let naturals = Stream.from(0) { |n| n + 1 }
naturals.take(5)                              # => [0, 1, 2, 3, 4]
naturals.map { |n| n * n }.take(4)            # => [0, 1, 4, 9]
naturals.filter { |n| n.even? }.take(3)       # => [0, 2, 4]
```

`map`, `filter` and `drop` return another stream, so a whole pipeline stays lazy until `take` turns it into a list.

Streams suit generated sequences that you may read more than once. A file or socket can only be read once, so functions that read them return a `Feed`. A feed's `toStream` gives a stream that can be replayed, at the cost of keeping every value read so far, so use it only for small inputs.

### Functions

#### `take`

```kex
take(n: Integer) -> [A]
```

Returns the first `n` elements as a list, computing the stream up to that point. It is how a lazy pipeline ends.

**Parameters**

  - `n` — how many elements to produce

**Returns**: the first `n` elements

**Examples**

```kex
Stream.from(1) { |n| n + 1 }.take(3)   # => [1, 2, 3]
```

_The first ten squares_

```kex
Stream.from(1) { |n| n + 1 }
  .map { |n| n * n }
  .take(10)
```

_Retry delays that double each time_

```kex
let delays = Stream.from(1.second) { |d| d * 2 }
delays.take(4)   # => 1, 2, 4 and 8 seconds, as time measures
```

#### `drop`

```kex
drop(n: Integer) -> Stream<A>
```

Returns a new stream that skips the first `n` elements.

The result is still lazy. Follow it with `take` to get a window from the middle.

**Parameters**

  - `n` — how many elements to skip

**Returns**: the stream, offset by `n`

**Examples**

```kex
Stream.from(0) { |n| n + 1 }.drop(3).take(3)   # => [3, 4, 5]
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
Stream.from(1) { |n| n + 1 }.map { |n| n * n }.take(4)
# => [1, 4, 9, 16]
```

_Formatting as it goes_

```kex
Stream.from(1) { |n| n + 1 }
  .map { |n| "item ${n}" }
  .take(3)
# => ["item 1", "item 2", "item 3"]
```

#### `filter`

```kex
filter(pred: (A -> Bool)) -> Stream<A>
```

Returns a new stream with only the elements `pred` accepts.

Taking `n` filtered elements may mean computing many more elements of the original stream. If `pred` rarely holds, `take` runs for a long time; if it never holds, `take` never returns.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the filtered stream

**Examples**

```kex
let evens = Stream.from(0) { |n| n + 1 }.filter { |n| n.even? }
evens.take(4)   # => [0, 2, 4, 6]
```

_Multiples of three, formatted_

```kex
Stream.from(1) { |n| n + 1 }
  .filter { |n| n.dividesBy?(3) }
  .map { |n| "#${n}" }
  .take(3)
# => ["#3", "#6", "#9"]
```

#### `each`

```kex
each(f: (A -> Void)) -> Void
```

Applies `f` to every element, for its side effects.

It only finishes on a stream that ends, such as a file's lines converted with `Feed.toStream`. On an infinite stream from `Stream.from` it never returns, so bound it with `take` first.

**Parameters**

  - `f` — applied to each element

**Examples**

```kex
Stream.from(1) { |n| n + 1 }
  .map { |n| n * n }
  .toFeed
  .take(3)
  .each { |n| IO.printLine(n) }
```

#### `toFeed`

```kex
toFeed -> Feed<A>
```

Returns a `Feed` that walks this stream once.

A stream keeps every element computed from it for as long as the stream is in scope. A feed lets each element go once it has been read, so use `toFeed` to walk a long stream in constant memory.

**Returns**: a one-shot cursor over the stream

**Examples**

_Summing a long generated sequence without holding it_

```kex
let total = Stream.from(1) { |n| n + 1 }
  .toFeed
  .take(1000000)
  .sum
```

## module `Stream`

Constructors for `Stream`.

### `from`

```kex
from(start: A, step: (A -> A)) -> Stream<A>
```

Builds an infinite stream from a first element and a step function.

The stream is `start`, then `step(start)`, then `step(step(start))`, and so on. Nothing is computed until you take from it.

**Parameters**

  - `start` — the first element
  - `step` — produces the next element from the current one

**Returns**: the generated stream

**Examples**

_Counting up_

```kex
let naturals = Stream.from(0) { |n| n + 1 }
naturals.take(5)   # => [0, 1, 2, 3, 4]
```

_Powers of two_

```kex
let powers = Stream.from(1) { |n| n * 2 }
powers.take(6)     # => [1, 2, 4, 8, 16, 32]
```

_A geometric decay_

```kex
Stream.from(1.0) { |x| x / 2.0 }.take(4)
# => [1.0, 0.5, 0.25, 0.125]
```

### `empty` (constant)

```kex
empty : Stream<A>
```

Returns the stream with no elements.

**Examples**

```kex
Stream.empty.take(3)   # => []
```


