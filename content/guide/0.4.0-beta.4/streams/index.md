---
id: "guide-0-4-0-beta-4-streams"
title: "Streams and feeds"
description: "Choose between eager collections, reusable laziness, and one-pass input."
path: "/guide/0.4.0-beta.4/streams/"
draft: false
template: "page"
---
A list holds materialized values. A range describes a bounded sequence. A stream computes lazily and can be reused. A feed advances a one-shot cursor. Similar method names do not make these consumption models interchangeable.

## Reusable streams

```kex
let naturals = Stream.Sequence(from: 0) { |n| n + 1 }
let multiples = naturals.filter { |n| n % 3 == 0 }
assert(multiples.take(4) == [0, 3, 6, 9])
assert(multiples.take(4) == [0, 3, 6, 9])
assert(naturals.drop(5).take(3) == [5, 6, 7])
```

`map`, `filter`, and `drop` preserve lazy traversal. `take(n)` materializes a finite list. A stream retains produced elements for replay, so repeated traversal does not recompute its prefix.

Bound consumption of an infinite stream. Even `take(1)` cannot finish if a preceding filter never accepts an element. Laziness postpones work; it does not make an impossible search terminate.

## One-shot feeds

A file feed reads input progressively. This example uses a capability fixture so it runs without creating a file:

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

Each read advances the same source. A second `take` does not restart from the beginning. A mapped or filtered feed still shares consumption of that source, so do not treat two derived pipelines as independent copies.

`collect` drains a feed into memory. `toStream` permits replay by retaining what it reads; `Stream.toFeed` permits forward traversal without keeping the start for replay. Choose based on whether you need replay and how large the input can become.

Feed operations are exposed as `let` methods; acquiring an external feed is the effectful operation. That API choice does not make consuming a feed repeatable.

## Choosing a representation

| Need | Choose |
| --- | --- |
| Small, reusable data with ordinary transformations | List |
| A bounded numeric interval | Range |
| A computed, reusable lazy sequence | Stream |
| Progressive input consumed once | Feed |

For a file that may be large, avoid reading it all and then turning it into a feed. Obtain the feed at the source, keep the pipeline bounded, and handle acquisition failures rather than silently replacing every failed open with an empty input.
