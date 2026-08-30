---
package: prelude
version: "0.4.0-alpha"
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

A feed is what `Stream` is not: reading it CONSUMES it. Where a stream remembers its elements so it can be walked again, a feed keeps nothing, and that is the point — it is how to walk a file, a socket or a device larger than memory, which a stream cannot do while anything still holds its start.

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

Taking twice answers two different windows — the first ten, then the ten after them. That is the whole difference from `Stream`, where taking twice answers the same ten. When you want the stream behaviour on a small source, `toStream` asks for it explicitly, at the cost of holding what it reads.



## module `Feed`

Constructors for `Feed`.

## constant `empty`

A feed with nothing in it, already spent.

Mostly the `or` half of a failed open: `FS.File.feed(path).or(Feed.empty)` reads nothing rather than stopping the program.



## function `Elements`

A feed over a list that is already in hand.

The elements are there, so nothing is saved by feeding them — this is for standing in for a real source, in a test, with something that consumes the way the real one does.


```kex
Elements(xs) : [A] -> Feed<A>
```


## make `Feed<A>`

Every method below is `let`, not `foul`, though reading a feed plainly is an effect. Two reasons, one principled and one practical.

The effect is already tracked where it enters: a feed over anything outside the program comes from `FS.File.feed` or `handle.feed`, both foul, so a pure function cannot obtain one. What `Feed.Elements` and `Stream.toFeed` build from data in hand mutates only a cursor the caller just made.

And a foul method takes the hidden capability context, which puts it one BEAM arity above the pure `take`/`map`/`filter` every other receiver has. A feed usually arrives with no static type — `FS.File.feed(p).or(Feed.empty)`, or a `Just(f) =>` binding — and such a call has to go through the runtime dispatcher, which is built per arity and so could never reach a method one arity up. Marking these foul made every dynamically-typed feed call fail with "Undefined method: take for Tuple".


#### `take`

Returns the next `n` elements as a list, consuming them.

Answers fewer than `n` when the source ends first, and `[]` once it is spent. Unlike `Stream.take`, calling it twice walks forward.

```kex
take(n) : Integer -> [A]
```

**Returns**: `[A]` — up to `n` elements

**Examples**

_Two windows, not the same one twice_

```kex
let feed = Feed.Elements([1, 2, 3, 4])
feed.take(2)   # => [1, 2]
feed.take(2)   # => [3, 4]
```

#### `drop`

Discards the next `n` elements and answers the feed.

There is only ever one cursor, so this hands back the same feed rather than a second one positioned differently.

```kex
drop(n) : Integer -> Feed<A>
```

**Returns**: `Feed<A>` — the same feed, advanced

**Examples**

```kex
FS.File.feed("log.txt").or(Feed.empty).drop(1).take(3)
```

#### `map`

Returns a feed with `f` applied to each element.

`f` runs as elements are read, and only for those that are. The result draws from the same cursor, so reading it consumes the receiver too.

```kex
map(f) : (A -> B) -> Feed<B>
```

**Returns**: `Feed<B>` — the mapped feed

**Examples**

```kex
FS.File.feed("log.txt").or(Feed.empty).map(~trim).take(5)
```

#### `filter`

Returns a feed of only the elements `pred` accepts.

Reading one element of the result may consume many of the receiver's.

```kex
filter(pred) : (A -> Bool) -> Feed<A>
```

**Returns**: `Feed<A>` — the filtered feed

**Examples**

_The first ten errors in a long log_

```kex
FS.File.feed("app.log").or(Feed.empty)
  .filter { |line| line.contains?("ERROR") }
  .take(10)
```

#### `each`

Applies `f` to every remaining element, draining the feed.

```kex
each(f) : (A -> Void) -> Void
```

**Returns**: `Void`

**Examples**

```kex
FS.File.feed("log.txt").or(Feed.empty).each { |line| IO.printLine(line) }
```
