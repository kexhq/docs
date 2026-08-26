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

A lazy, potentially infinite sequence.

A stream describes how to produce its elements rather than holding them, so an infinite one is an ordinary value. Nothing is computed until you ask for elements with `take`.

  let naturals = Stream.Sequence(from: 0) { |n| n ` 1 }   naturals.take(5)                              # => [0, 1, 2, 3, 4]   naturals.map { |n| n * n }.take(4)            # => [0, 1, 4, 9]   naturals.filter { |n| n.even? }.take(3)       # => [0, 2, 4]

`map`, `filter` and `drop` all answer with another stream, so a pipeline stays lazy end to end; `take` is what turns it into a list.

`FS.File.feed+ hands back a stream of a file's lines, which is how to walk a file too large to hold in memory.



## module `Stream`

Constructors for `Stream`.

## function `Sequence`

Builds an infinite stream from a first element and a step function.

The stream is `from`, then `step(from)`, then `step(step(from))`, and so on — nothing is computed until you take from it.


```kex
Sequence(from, step)
```


## function `Iterate`

Builds an infinite stream from a seed and a step function. The same thing as `Sequence` — use whichever reads better where you are.


```kex
Iterate(seed, step)
```


## make `Stream<A>`


#### `take`

Returns the first `n` elements as a list, computing the stream up to that point.

This is the operation that ends a lazy pipeline and gives you real data.

```kex
take(n) : Integer -> [A]
```

**Returns**: `[A]` — the first `n` elements

**Examples**

```kex
  Stream.Sequence(from: 1) { |n| n ` 1 }.take(3)   # => [1, 2, 3]
```
_The first ten squares_

```kex
  Stream.Sequence(from: 1) { |n| n ` 1 }
    .map { |n| n * n }
    .take(10)
```

#### `drop`

Returns a new stream that skips the first `n` elements.

Still a stream, so the result stays lazy — pair it with `take` to get a window out of the middle.

```kex
drop(n) : Integer -> Stream<A>
```

**Returns**: `Stream<A>` — the stream, offset by `n`

**Examples**

```kex
  Stream.Sequence(from: 0) { |n| n + 1 }.drop(3).take(3)   # => [3, 4, 5]
```
_Paging through a generated sequence_

```kex
  let page(n: Integer) = source.drop(n * 20).take(20)
```

#### `map`

Returns a new stream with `f` applied to each element.

`f` is not called until elements are taken, and then only for those that are.

```kex
map(f) : (A -> B) -> Stream<B>
```

**Returns**: `Stream<B>` — the mapped stream

**Examples**

```kex
  Stream.Sequence(from: 1) { |n| n ` 1 }.map { |n| n * n }.take(4)
  # => [1, 4, 9, 16]
```
_Formatting as it goes_

```kex
  Stream.Sequence(from: 1) { |n| n ` 1 }
    .map { |n| "item ${n}" }
    .take(3)
  # => ["item 1", "item 2", "item 3"]
```

#### `filter`

Returns a new stream with only the elements `pred` accepts.

Producing `n` filtered elements may require walking many more upstream ones, so a predicate that almost never holds makes `take` run for a long time — and one that never holds makes it run forever.

```kex
filter(pred) : (A -> Bool) -> Stream<A>
```

**Returns**: `Stream<A>` — the filtered stream

**Examples**

```kex
  let evens = Stream.Sequence(from: 0) { |n| n ` 1 }.filter { |n| n.even? }
  evens.take(4)   # => [0, 2, 4, 6]
```
_Multiples of three, formatted_

```kex
  Stream.Sequence(from: 1) { |n| n ` 1 }
    .filter { |n| n.modulo(3) == 0 }
    .map { |n| "#${n}" }
    .take(3)
  # => ["#3", "#6", "#9"]
```
