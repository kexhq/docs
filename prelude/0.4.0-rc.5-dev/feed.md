---
package: prelude
version: "0.4.0-rc.5-dev"
source: feed.kex
title: Feed
entities:
  - { kind: type, name: "Feed" }
  - { kind: module, name: "Feed" }
  - { kind: make, name: "Feed<A>" }
---

# Feed

## type `Feed<A>`

A one-shot sequence over a source that can only be read once.

Reading a feed consumes it. A `Stream` remembers its elements so it can be walked again; a feed keeps nothing, so it can walk a file, a socket or a device larger than memory.

```kex
let lines = FS.File.feed("huge.log").or(Feed.empty)
lines.each { |line| IO.printLine(line) if line.contains?("ERROR") }
```

`map`, `filter` and `drop` return a feed that reads from the same source as the original, so a pipeline makes one pass:

```kex
FS.File.feed("app.log").or(Feed.empty)
  .filter { |line| line.contains?("ERROR") }
  .take(10)
```

Calling `take(10)` twice returns the first ten elements and then the next ten. On a `Stream` it would return the same ten both times. To get that behaviour from a small source, call `toStream`, which keeps what it reads.

### Functions

Reading a feed consumes it; open a new one to read the same data again. Opening a file-backed feed is `foul`, and so is `pull`.

#### `pull` (foul)

```kex
pull -> A?
```

Returns the next element and consumes it, or `None` once the source is spent.

**Returns**: the next element, or `None`

**Examples**

```kex
let feed = Feed.Elements([1, 2])
feed.pull   # => Just(1)
feed.pull   # => Just(2)
feed.pull   # => None
```

#### `spent?` (foul)

```kex
spent? -> Bool
```

Returns `true` once a read has found the source empty.

`false` does not promise another element: the feed only learns that the source has ended when a read finds nothing.

**Returns**: `true` once the feed is spent

**Examples**

_Draining a feed a piece at a time_

```kex
let jobs = Feed.Elements(["resize", "index"])
jobs.spent?   # => false
jobs.take(2)  # => ["resize", "index"]
jobs.spent?   # => false
jobs.pull     # => None
jobs.spent?   # => true
```

#### `take`

```kex
take(n: Integer) -> [A]
```

Returns the next `n` elements as a list, consuming them.

Returns fewer than `n` when the source ends first, and `[]` once it is spent. Unlike `Stream.take`, a second call returns the elements after the first.

**Parameters**

  - `n` — how many elements to consume

**Returns**: up to `n` elements

**Examples**

_Two windows, not the same one twice_

```kex
let feed = Feed.Elements([1, 2, 3, 4])
feed.take(2)   # => [1, 2]
feed.take(2)   # => [3, 4]
```

#### `drop`

```kex
drop(n: Integer) -> Feed<A>
```

Discards the next `n` elements and returns the same feed.

**Parameters**

  - `n` — how many elements to discard

**Returns**: the same feed, advanced

**Examples**

```kex
FS.File.feed("log.txt").or(Feed.empty).drop(1).take(3)
```

#### `map`

```kex
map(f: (A -> B)) -> Feed<B>
```

Returns a feed with `f` applied to each element.

`f` runs on each element as it is read. The result reads from the same source, so reading it consumes the original feed too.

**Parameters**

  - `f` — applied to each element

**Returns**: the mapped feed

**Examples**

```kex
FS.File.feed("log.txt").or(Feed.empty).map(~trim).take(5)
```

#### `filter`

```kex
filter(pred: (A -> Bool)) -> Feed<A>
```

Returns a feed of only the elements `pred` accepts.

Reading one element of the result may consume many of the receiver's.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the filtered feed

**Examples**

_The first ten errors in a long log_

```kex
FS.File.feed("app.log").or(Feed.empty)
  .filter { |line| line.contains?("ERROR") }
  .take(10)
```

#### `each`

```kex
each(f: (A -> Void)) -> Void
```

Applies `f` to every remaining element, draining the feed.

**Parameters**

  - `f` — applied to each element

**Examples**

```kex
FS.File.feed("log.txt").or(Feed.empty).each { |line| IO.printLine(line) }
```

#### `collect`

```kex
collect -> [A]
```

Reads the rest of the feed into a list.

The whole rest of the source is held in memory. For a source too large to hold, use `each`.

**Returns**: every remaining element

**Examples**

```kex
FS.File.feed("short.txt").or(Feed.empty).collect
```

_Loading a small configuration file for repeated passes_

```kex
let rules = FS.File.feed("rules.txt")
  .or(Feed.empty)
  .map(~trim)
  .filter(~present?)
  .collect
```

#### `toStream`

```kex
toStream -> Stream<A>
```

Returns a `Stream` drawn from the feed.

The stream keeps every element it reads, so it can be walked again. Use it only for a source small enough to hold.

**Returns**: the remaining elements, as a stream

**Examples**

```kex
let lines = FS.File.feed("small.txt").or(Feed.empty).toStream
lines.take(2)   # => ["one", "two"]
lines.take(2)   # => ["one", "two"]
```

## module `Feed`

Constructors for `Feed`.

### `empty` (constant)

```kex
empty : Feed<A>
```

Returns a feed with nothing in it, whose first `pull` returns `None`.

It is mostly used as the fallback for a failed open: `FS.File.feed(path).or(Feed.empty)` then reads nothing.

**Examples**

```kex
Feed.empty.take(3)   # => []
```



### `Elements`

```kex
Elements(xs: [A]) -> Feed<A>
```

Returns a feed over the elements of a list.

Use it in tests, to stand in for a real source with something that is consumed the same way.

**Parameters**

  - `xs` — the elements to feed

**Returns**: a feed over `xs`

**Examples**

```kex
let feed = Feed.Elements(["one", "two"])
feed.take(1)   # => ["one"]
feed.take(1)   # => ["two"]
```
