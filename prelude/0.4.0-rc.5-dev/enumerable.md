---
package: prelude
version: "0.4.0-rc.5-dev"
source: enumerable.kex
title: Enumerable
entities:
  - { kind: trait, name: "Foldable" }
  - { kind: trait, name: "Enumerable" }
---

# Enumerable

## trait `Foldable<T>`

Traversals that every collection with a `reduce` gets.

A type becomes `Foldable` by implementing `reduce`; `each`, `all?`, `any?`, `find`, `count` and the rest are built on it. `List`, `String`, `Map`, `Range`, `Set` and `UnorderedSet` implement it.

```kex
[1, 2, 3].all? { |n| n > 0 }            # => true
"hello".any?(~digit?)                   # => false
{ a: 1, b: 2 }.count { |k, v| v > 1 }   # => 1
```

When an item is a pair, as a `Map` entry is, a block with two parameters receives its two halves, so a map traversal can be written `{ |key, value| ... }`.

Implemented by [`[X]`](list.md#make-list), [`Map<K, V>`](map.md#make-map), [`Range<A>`](range.md#make-range), [`String`](string.md#make-string), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack).

### Required functions

#### `reduce`

```kex
reduce(acc: A, f: (A -> T -> A)) -> A
```

Folds the collection from the left. Every `Foldable` type must define it; the other functions here are built on it.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each item

**Returns**: the final accumulator

**Examples**

```kex
[1, 2, 3].reduce(0) { |sum, n| sum + n }   # => 6
```

### Provided functions

#### `each`

```kex
each(f: (T -> Void)) -> Void
```

Calls `f` with each item, for its side effects.

To build a new collection, use `map` or `filter`.

**Parameters**

  - `f` — called once per item

**Examples**

```kex
["ada", "grace"].each { |name| IO.printLine(name) }
```

_Over a map, the block takes key and value_

```kex
{ host: "localhost", port: "8080" }.each do |key, value|
  IO.printLine("${key} = ${value}")
end
```

#### `eachIndexed`

```kex
eachIndexed(f: (T -> Integer -> Void)) -> Void
```

Calls `f` with each item and its 0-based position, for its side effects.

The index is the last block parameter, so a `Map` entry can be taken whole (`|entry, i|`) or split (`|k, v, i|`).

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

Returns `true` when every item satisfies `pred`, and `true` for an empty collection.

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

Returns `true` when at least one item satisfies `pred`, and `false` for an empty collection.

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

#### `none?`

```kex
none?(pred: (T -> Bool)) -> Bool
```

Returns `true` when no item satisfies `pred`, the opposite of `any?`. An empty collection gives `true`.

**Parameters**

  - `pred` — the test applied to each item

**Returns**: `true` when nothing matches

**Examples**

```kex
[1, 2, 3].none? { |n| n > 9 }   # => true
[1, 2, 3].none? { |n| n > 2 }   # => false
```

#### `one?`

```kex
one?(pred: (T -> Bool)) -> Bool
```

Returns `true` when exactly one item satisfies `pred`.

**Parameters**

  - `pred` — the test applied to each item

**Returns**: `true` for exactly one match

**Examples**

```kex
[1, 2, 3].one? { |n| n > 2 }   # => true
[1, 2, 3].one? { |n| n > 1 }   # => false
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



## trait `Enumerable<T>`

Functions that build a new collection, for every collection with a `reduce`.

As with `Foldable`, a type only has to implement `reduce`. The functions here return lists, since the block may return anything. Some types override them to keep their own shape: `Map.filter` returns a map, `Set.map` a set, and `String.filter` a string.

```kex
[1, 2, 3].map { |n| n * 2 }              # => [2, 4, 6]
"a1b2".filter(~digit?)                   # => "12"
{ a: 1, b: 2 }.filter { |k, v| v > 1 }   # => { b: 2 }
```

Implemented by [`[X]`](list.md#make-list), [`Map<K, V>`](map.md#make-map), [`Range<A>`](range.md#make-range), [`String`](string.md#make-string), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack).

### Required functions

#### `reduce`

```kex
reduce(acc: A, f: (A -> T -> A)) -> A
```

Folds the collection from the left. Every `Enumerable` type must define it.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each item

**Returns**: the final accumulator

**Examples**

```kex
[1, 2, 3].reduce(1) { |product, n| product * n }   # => 6
```

### Provided functions

#### `map`

```kex
map(f: (T -> B)) -> [B]
```

Applies `f` to each item and returns the results as a list.

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

Applies `f` to each item and its 0-based position, and returns the results as a list.

The index is the last block parameter, as in `eachIndexed`.

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

Returns the items for which `pred` returns `true`.

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

#### `into`

```kex
into(f: (T -> [B])) -> [B]
```

Applies `f`, which returns a list, to each item and concatenates the results.

Use it when each item expands into zero or more results; `map` would give a list of lists.

**Parameters**

  - `f` — applied to each item, returning a list

**Returns**: all the results, concatenated

**Examples**

```kex
[[1, 2], [3]].into { |xs| xs }            # => [1, 2, 3]
["a b", "c"].into { |s| s.split(" ") }    # => ["a", "b", "c"]
```

_Every tag used across a list of posts_

```kex
posts.into { |p| p.tags }
```

#### `collect`

```kex
collect(f: (T -> B?)) -> [B]
```

Applies `f`, which returns an `Optional`, to each item and returns the present values, unwrapped.

It filters and maps in one pass. Use it when the test and the transformation are the same step, as in parsing, where each item either gives a value or does not.

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


