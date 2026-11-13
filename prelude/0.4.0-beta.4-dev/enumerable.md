---
package: prelude
version: "0.4.0-beta.4-dev"
source: enumerable.kex
title: Enumerable
entities:
  - { kind: trait, name: "Foldable" }
  - { kind: trait, name: "Enumerable" }
---

# Enumerable

## trait `Foldable`

Traversal operations that every foldable collection gets for free.

A type becomes `Foldable` by implementing one method, `reduce`; the rest: `each`, `all?`, `any?`, `find`, `count`: are derived from it. `List`, `String`, `Map`, `Range` and both flavours of `Set` all implement it, so these methods read the same whatever you point them at.

```kex
[1, 2, 3].all? { |n| n > 0 }        # => true
"hello".any?(~digit?)               # => false
{ a: 1, b: 2 }.count { |k, v| v > 1 }   # => 1
```

Blocks are applied via Kex.Intrinsic.Fun.applyItem, which auto-splats a pair item into a two-argument block. That is what lets a `Map` traversal be written `{ |key, value| ... }` even though the fold hands over one tuple.

Implemented by [`[X]`](list.md#make-list), [`Map<K, V>`](map.md#make-map), [`Range`](range.md#make-range), [`String`](string.md#make-string), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack).

### Required methods

#### `reduce`

```kex
reduce(acc: A, f: (A -> T -> A)) -> A
```

Folds the collection from the left. The one operation a `Foldable` type must define; everything else here is written in terms of it.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each item

**Returns**: the final accumulator

**Examples**

```kex
[1, 2, 3].reduce(0) { |sum, n| sum + n }   # => 6
```

### Provided methods

#### `each`

```kex
each(f: (T -> Void)) -> Void
```

Calls `f` with each item, for its side effects.

The loop of last resort, when what you want is a new collection rather than an effect, `map` or `filter` says so more clearly.

**Parameters**

  - `f` — called once per item

**Examples**

```kex
["ada", "grace"].each { |name| IO.printLine(name) }
```

_Over a map, the block takes key and value_

```kex
{ host: "localhost", port: 8080 }.each do |key, value|
  IO.printLine("${key} = ${value}")
end
```

#### `eachIndexed`

```kex
eachIndexed(f: (T -> Integer -> Void)) -> Void
```

Calls `f` with each item and its 0-based position, for its side effects.

The index is the LAST block parameter, so a `Map` entry can be taken either whole (`|entry, i|`) or spread (`|k, v, i|`).

**Parameters**

  - `f` — called with each item and its index

**Examples**

```kex
["a", "b"].eachIndexed { |s, i| IO.printLine("${i}: ${s}") }
# prints: 0: a
#         1: b
```

_Numbering the lines of a file_

```kex
text.lines.eachIndexed { |line, i| IO.printLine("${i + 1}\t${line}") }
```

#### `all?`

```kex
all?(pred: (T -> Bool)) -> Bool
```

Returns `true` when every item satisfies `pred`. An empty collection answers `true`.

**Parameters**

  - `pred` — the test applied to each item

**Returns**: `true` when every item matches

**Examples**

```kex
[2, 4].all? { |n| n.even? }   # => true
[2, 5].all? { |n| n.even? }   # => false
[].all? { |n| n.even? }       # => true
```

_Validating every field of a form_

```kex
fields.all? { |name, value| !value.blank? }
```

#### `any?`

```kex
any?(pred: (T -> Bool)) -> Bool
```

Returns `true` when at least one item satisfies `pred`. An empty collection answers `false`.

**Parameters**

  - `pred` — the test applied to each item

**Returns**: `true` when any item matches

**Examples**

```kex
[1, 2, 3].any? { |n| n > 2 }   # => true
[1, 2, 3].any? { |n| n > 9 }   # => false
```

_Detecting a flag among arguments_

```kex
args.any? { |a| a == "--verbose" }
```

#### `find`

```kex
find(pred: (T -> Bool)) -> T?
```

Returns the first item satisfying `pred`, or `None` when nothing does.

**Parameters**

  - `pred` — the test applied to each item

**Returns**: the first match, or `None`

**Examples**

```kex
[1, 2, 3].find { |n| n > 1 }   # => Just(2)
[1, 2, 3].find { |n| n > 9 }   # => None
```

_Looking a record up by one of its fields_

```kex
users.find { |u| u.email == target }.map { |u| u.name }.or("unknown")
```

#### `count`

```kex
count(pred: (T -> Bool)) -> Integer
```

Returns how many items satisfy `pred`.

**Parameters**

  - `pred` — the test applied to each item

**Returns**: the number of matches

**Examples**

```kex
[1, 2, 3, 4].count { |n| n.even? }   # => 2
```

_How many lines are comments_

```kex
text.lines.count { |line| line.trim.startsWith?("#") }
```



## trait `Enumerable`

Collection-producing operations that every foldable collection gets for free.

Like `Foldable`, a type joins by implementing `reduce` alone. The defaults here answer with a list, because the block may return anything at all; a type that can do better overrides them: `Map.filter` gives back a map, `Set.map` gives back a set, `String.filter` gives back a string.

```kex
[1, 2, 3].map { |n| n * 2 }              # => [2, 4, 6]
"a1b2".filter(~digit?)                   # => "12"
{ a: 1, b: 2 }.filter { |k, v| v > 1 }   # => { :b: 2 }
```

Implemented by [`[X]`](list.md#make-list), [`Map<K, V>`](map.md#make-map), [`Range`](range.md#make-range), [`String`](string.md#make-string), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack).

### Required methods

#### `reduce`

```kex
reduce(acc: A, f: (A -> T -> A)) -> A
```

Folds the collection from the left. The one operation an `Enumerable` type must define.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each item

**Returns**: the final accumulator

**Examples**

```kex
[1, 2, 3].reduce(1) { |product, n| product * n }   # => 6
```

### Provided methods

#### `map`

```kex
map(f: (T -> B)) -> [B]
```

Applies `f` to each item and collects the results into a list.

The single most useful method here: it describes what each item becomes, and leaves the walking of the collection implied.

**Parameters**

  - `f` — applied to each item

**Returns**: the results, in order

**Examples**

```kex
[1, 2, 3].map { |n| n * 2 }        # => [2, 4, 6]
["a", "b"].map(~upperCase)         # => ["A", "B"]
```

_Extracting one field from a list of records_

```kex
users.map { |u| u.email }
```

#### `mapIndexed`

```kex
mapIndexed(f: (T -> Integer -> B)) -> [B]
```

Applies `f` to each item and its 0-based position, and collects the results into a list.

The index is the LAST block parameter: see `eachIndexed`.

**Parameters**

  - `f` — applied to each item and its index

**Returns**: the results, in order

**Examples**

```kex
["a", "b"].mapIndexed { |s, i| "${i}${s}" }   # => ["0a", "1b"]
```

_Building a numbered list_

```kex
items.mapIndexed { |item, i| "${i + 1}. ${item}" }.join("\n")
```

#### `filter`

```kex
filter(pred: (T -> Bool)) -> [T]
```

Returns the items for which `pred` answers `true`.

**Parameters**

  - `pred` — the test applied to each item

**Returns**: the matching items, in order

**Examples**

```kex
[1, 2, 3, 4].filter { |n| n.even? }   # => [2, 4]
```

_Dropping blank lines_

```kex
text.lines.filter { |line| !line.trim.empty? }
```

#### `flatMap`

```kex
flatMap(f: (T -> [B])) -> [B]
```

Applies `f` to each item, expecting a list back, and concatenates the results into one flat list.

Use it when each item expands into zero or more results: `map` would give you a list of lists.

**Parameters**

  - `f` — applied to each item, returning a list

**Returns**: all the results, concatenated

**Examples**

```kex
[[1, 2], [3]].flatMap { |xs| xs }            # => [1, 2, 3]
["a b", "c"].flatMap { |s| s.split(" ") }    # => ["a", "b", "c"]
```

_Every tag used across a list of posts_

```kex
posts.flatMap { |p| p.tags }
```

#### `collect`

```kex
collect(f: (T -> B?)) -> [B]
```

Applies `f` to each item, expecting an `Optional` back, and returns the values that were present: unwrapped.

This is filter and map fused into one pass, which is what you want whenever the test and the transformation are the same operation. Parsing is the classic case: an item either yields a value or it does not.

**Parameters**

  - `f` — applied to each item, returning an optional

**Returns**: the present values, unwrapped, in order

**Examples**

```kex
["1", "x", "3"].collect { |s| s.to(Integer) }   # => [1, 3]
```

_Looking several keys up at once, skipping the missing ones_

```kex
keys.collect { |k| config.get(k) }
```


