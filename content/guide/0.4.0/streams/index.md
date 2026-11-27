---
id: "guide-0-4-0-beta-4-streams"
title: "Streams and feeds"
description: "Choose between eager collections, reusable laziness, and one-pass input."
path: "/guide/0.4.0/streams/"
draft: false
template: "page"
---
A list stores its elements now. A stream computes elements when you ask for them, while a feed reads them from a source once. This difference matters when you repeat an operation such as `take(1)`.

## Reusable streams

This stream starts at zero and keeps adding one. Filtering it leaves multiples of three:

```kex
let naturals = Stream.Sequence(from: 0) { |n| n + 1 }
let multiples = naturals.filter { |n| n % 3 == 0 }
assert(multiples.take(4) == [0, 3, 6, 9])
assert(multiples.take(4) == [0, 3, 6, 9])
assert(naturals.drop(5).take(3) == [5, 6, 7])
IO.printLine(multiples.take(4))
```

```output filename="OUTPUT"
[0, 3, 6, 9]
```

Both calls to `multiples.take(4)` return `[0, 3, 6, 9]`: the stream can be read again. `map`, `filter`, and `drop` preserve lazy traversal, while `take(n)` makes a finite list. A stream retains produced elements for replay, so repeated traversal does not recompute its prefix.

Bound consumption of an infinite stream. Even `take(1)` cannot finish if a preceding filter never accepts an element. Laziness postpones work; it does not make an impossible search terminate.

## One-shot feeds

A file feed reads input as you request it. This example supplies three lines through a fixture, so you can see how successive reads move forward:

```kex
foul runStreams1() do
  with FS.File = Mock.Files { files: { "events.txt": "one\ntwo\nthree\n" } } do
    let feed = FS.File.feed("events.txt").try
    assert(feed.take(1) == ["one"])
    assert(feed.take(1) == ["two"])
    assert(feed.collect == ["three"])
  end
end
runStreams1()
```

The first `take(1)` gets `"one"`; the second gets `"two"`; `collect` gets only `"three"`. Each operation advances the same source. A mapped or filtered feed also shares that consumption, so two pipelines derived from one feed are not independent copies.

`collect` reads the rest of a feed into memory. Use `toStream` when you need to replay values, knowing it will retain what it reads. Use `Stream.toFeed` when you want one forward pass without keeping the beginning for replay.

Feed operations are exposed as `let` methods; acquiring an external feed is the effectful operation. That API choice does not make consuming a feed repeatable.

## Choosing a representation

| Need | Choose |
| --- | --- |
| Small, reusable data with ordinary transformations | List |
| A bounded numeric interval | Range |
| A computed, reusable lazy sequence | Stream |
| Progressive input consumed once | Feed |

For a file that may be large, avoid reading it all and then turning it into a feed. Obtain the feed at the source, keep the pipeline bounded, and handle acquisition failures rather than silently replacing every failed open with an empty input.
