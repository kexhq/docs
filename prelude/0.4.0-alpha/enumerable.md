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

## trait `Foldable`

Foldable — traversal operations derived from a left fold.

Blocks are applied via Kex.Intrinsic.Fun.applyItem, which auto-splats a pair item into a two-argument block.


#### `reduce`

```kex
reduce : A -> (A -> T -> A) -> A
```

#### `each`

Applies `f` to each item for its side effects. Returns unit.

```kex
each(f)
```

#### `eachIndexed`

Applies `f` to each item together with its 0-based position, for side effects. Returns unit. The index is the LAST block parameter, so a Map entry can be taken either whole (`|entry, i|`) or spread (`|k, v, i|`).

```kex
eachIndexed(f)
```

**Examples**

```kex
  ["a", "b"].eachIndexed { |s, i| IO.printLine("${i}: ${s}") }
```

#### `all?`

True if every item satisfies `pred`.

```kex
all?(pred)
```

#### `any?`

True if at least one item satisfies `pred`.

```kex
any?(pred)
```

#### `find`

The first item satisfying `pred` wrapped in Just, or None.

```kex
find(pred)
```

#### `count`

Counts the items for which `pred` holds.

```kex
count(pred)
```

## trait `Enumerable`

Enumerable — collection-producing operations derived from a left fold.


#### `reduce`

```kex
reduce : A -> (A -> T -> A) -> A
```

#### `map`

Transforms each item by applying `f`, collecting the results into a list.

```kex
map(f)
```

#### `mapIndexed`

Transforms each item together with its 0-based position, collecting the results into a list. Index is the LAST block parameter — see eachIndexed.

```kex
mapIndexed(f)
```

**Examples**

```kex
  ["a", "b"].mapIndexed { |s, i| "${i}${s}" }   # => ["0a", "1b"]
```

#### `filter`

Keeps the items for which `pred` holds.

```kex
filter(pred)
```

#### `flatMap`

Maps each item to a list and concatenates the results.

```kex
flatMap(f)
```

#### `collect`

Maps each item through `f` (returning an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`. Filter + map fused via an Optional-returning function.

```kex
collect(f)
```
