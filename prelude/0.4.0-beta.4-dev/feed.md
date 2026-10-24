---
package: prelude
version: "0.4.0-beta.4-dev"
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

A feed is what `Stream` is not: reading it CONSUMES it. Where a stream remembers its elements so it can be walked again, a feed keeps nothing, and that is the point: it is how to walk a file, a socket or a device larger than memory, which a stream cannot do while anything still holds its start.

```kex
foul lines = FS.File.feed("huge.log").or(Feed.empty)
lines.each { |line| IO.printLine(line) if line.contains?("ERROR") }
```

`map`, `filter` and `drop` answer a feed over the SAME cursor rather than a second cursor over the same source, so a pipeline is one pass:

```kex
FS.File.feed("app.log").or(Feed.empty)
  .filter { |line| line.contains?("ERROR") }
  .take(10)
```

Taking twice answers two different windows: the first ten, then the ten after them. That is the whole difference from `Stream`, where taking twice answers the same ten. When you want the stream behaviour on a small source, `toStream` asks for it explicitly, at the cost of holding what it reads.

### Methods

Every method below is `let`, not `foul`, though reading a feed plainly is an effect. Two reasons, one principled and one practical.

The effect is already tracked where it enters: a feed over anything outside the program comes from `FS.File.feed` or `handle.feed`, both foul, so a pure function cannot obtain one. What `Feed.Elements` and `Stream.toFeed` build from data in hand mutates only a cursor the caller just made.

And a foul method takes the hidden capability context, which puts it one BEAM arity above the pure `take`/`map`/`filter` every other receiver has. A feed usually arrives with no static type: `FS.File.feed(p).or(Feed.empty)`, or a `Just(f) =>` binding, and such a call has to go through the runtime dispatcher, which is built per arity and so could never reach a method one arity up. Marking these foul made every dynamically-typed feed call fail with "Undefined method: take for Tuple".

#### `pull`

```kex
pull : A?
```

Answers the next element and consumes it, or `None` once the source is spent.

NOT named `next`: that is the loop-continue keyword, and the lexer reads it as one even after a dot, so a call to it silently swallows the rest of the enclosing block.

**Returns**: the next element, or `None`

**Examples**

```kex
let feed = Feed.Elements([1, 2])
feed.pull   # => Just(1)
feed.pull   # => Just(2)
feed.pull   # => None
```

#### `spent?`

```kex
spent? : Bool
```

Whether the source has run out.

`false` does not promise another element: only that the feed has not been told otherwise yet. The source is asked, and may end, on the next read.

**Returns**: `true` once the feed is spent

**Examples**

_Draining a feed a piece at a time_

```kex
let jobs = Feed.Elements(["resize", "index"])
jobs.spent?   # => false
jobs.take(2)
jobs.spent?   # => true
```

#### `take`

```kex
take(n: Integer) -> [A]
```

Returns the next `n` elements as a list, consuming them.

Answers fewer than `n` when the source ends first, and `[]` once it is spent. Unlike `Stream.take`, calling it twice walks forward.

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

Discards the next `n` elements and answers the feed.

There is only ever one cursor, so this hands back the same feed rather than a second one positioned differently.

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

`f` runs as elements are read, and only for those that are. The result draws from the same cursor, so reading it consumes the receiver too.

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
collect : [A]
```

Drains the feed into a list.

This is the operation that gives up constant space, which is why it is named rather than implicit: on a source too large to hold, use `each`.

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
toStream : Stream<A>
```

Returns a `Stream` drawn from the feed.

The stream remembers what it reads, so it can be walked again: at the cost of holding every element forced through it. Worth it for a source small enough to replay; the opposite of what a feed is for otherwise.

**Returns**: a replayable view of the remaining elements

**Examples**

```kex
let lines = FS.File.feed("small.txt").or(Feed.empty).toStream
lines.take(2)   # => ["one", "two"]
lines.take(2)   # => ["one", "two"] : a stream, so the same two
```

## module `Feed`

Constructors for `Feed`.

### `empty` (constant)

```kex
empty : Feed<A>
```

A feed with nothing in it, already spent.

Mostly the `or` half of a failed open: `FS.File.feed(path).or(Feed.empty)` reads nothing rather than stopping the program.

**Examples**

```kex
Feed.empty.take(3)   # => []
```



### `Elements`

```kex
Elements(xs: [A]) -> Feed<A>
```

A feed over a list that is already in hand.

The elements are there, so nothing is saved by feeding them: this is for standing in for a real source, in a test, with something that consumes the way the real one does.

**Parameters**

  - `xs` — the elements to feed

**Returns**: a feed over `xs`

**Examples**

```kex
let feed = Feed.Elements(["one", "two"])
feed.take(1)   # => ["one"]
feed.take(1)   # => ["two"] : the first one is gone
```
