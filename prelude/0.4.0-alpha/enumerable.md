---
package: prelude
version: "0.4.0-alpha"
source: enumerable.kex
title: Enumerable
entities:
  - { kind: trait, name: "Foldable" }
  - { kind: trait, name: "Enumerable" }
---

# Enumerable

Foldable — traversal operations derived from a left fold.

Blocks are applied via Kex.Intrinsic.Fun.applyItem, which auto-splats a pair item into a two-argument block.

## trait `Foldable`

Implemented by [`[X]`](list.md#make-list), [`Map<K, V>`](map.md#make-map), [`Range`](range.md#make-range), [`Set<A>`](set.md#make-set), [`UnorderedSet<A>`](set.md#make-unorderedset), [`String`](string.md#make-string).

### Required methods

#### `reduce`

```kex
reduce : A -> (A -> T -> A) -> A
```

### Provided methods

#### `each`

```kex
each(f)
```

Applies `f` to each item for its side effects. Returns unit.

#### `eachIndexed`

```kex
eachIndexed(f)
```

Applies `f` to each item together with its 0-based position, for side effects. Returns unit. The index is the LAST block parameter, so a Map entry can be taken either whole (`|entry, i|`) or spread (`|k, v, i|`).

**Examples**

```kex
["a", "b"].eachIndexed { |s, i| IO.printLine("${i}: ${s}") }
```

#### `all?`

```kex
all?(pred)
```

True if every item satisfies `pred`.

#### `any?`

```kex
any?(pred)
```

True if at least one item satisfies `pred`.

#### `find`

```kex
find(pred)
```

The first item satisfying `pred` wrapped in Just, or None.

#### `count`

```kex
count(pred)
```

Counts the items for which `pred` holds.



## trait `Enumerable`

Enumerable — collection-producing operations derived from a left fold.

Implemented by [`[X]`](list.md#make-list), [`Map<K, V>`](map.md#make-map), [`Range`](range.md#make-range), [`Set<A>`](set.md#make-set), [`UnorderedSet<A>`](set.md#make-unorderedset), [`String`](string.md#make-string).

### Required methods

#### `reduce`

```kex
reduce : A -> (A -> T -> A) -> A
```

### Provided methods

#### `map`

```kex
map(f)
```

Transforms each item by applying `f`, collecting the results into a list.

#### `mapIndexed`

```kex
mapIndexed(f)
```

Transforms each item together with its 0-based position, collecting the results into a list. Index is the LAST block parameter — see eachIndexed.

**Examples**

```kex
["a", "b"].mapIndexed { |s, i| "${i}${s}" }   # => ["0a", "1b"]
```

#### `filter`

```kex
filter(pred)
```

Keeps the items for which `pred` holds.

#### `flatMap`

```kex
flatMap(f)
```

Maps each item to a list and concatenates the results.

#### `collect`

```kex
collect(f)
```

Maps each item through `f` (returning an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`. Filter + map fused via an Optional-returning function.


