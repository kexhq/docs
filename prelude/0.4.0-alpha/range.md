---
package: prelude
version: "0.4.0-alpha"
source: range.kex
title: Range
entities:
  - { kind: type, name: "Range" }
  - { kind: make, name: "Range" }
---

# Range

## type `Range`

Range — a range computes everything from its two bounds; `items` materializes the elements into a real list when one is needed.

Implements [`Enumerable`](enumerable.md#trait-enumerable), [`Foldable`](enumerable.md#trait-foldable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc, f)
```

Shared primitive for Enumerable and Foldable. Range stays structurally minimal; inherited operations reduce over its materialized items in ascending range order.

#### `sum`

Numeric range aggregates are expressed in terms of the Enumerable primitive rather than relying on the walker's historical List fallback.

#### `product`



#### `contains?`

```kex
contains?(value)
```

Membership is a Range method, not a fallback into the bare String/List native dispatcher.

#### `items`

The range's elements as a list.

**Examples**

```kex
(1..3).items      # => [1, 2, 3]
('a'..'c').items  # => ['a', 'b', 'c']
```

#### `first`

The list operations, over the materialized items. A range is an ordered collection, so `(1..5).first` and `(1..5).length` are questions it can answer — and on the BEAM backend, where a range IS its item list, they already worked. Only the walker rejected them ("Undefined method: first for Range"), so every one of these was a backend divergence rather than a deliberate restriction.

#### `second`



#### `third`



#### `last`



#### `rest`



#### `length`



#### `count` (from Foldable)



#### `empty?`



#### `max`



#### `min`



#### `reverse`



#### `sort`



```kex
sort(comparator)
```

#### `uniq`



#### `join`

```kex
join(separator)
```

#### `at`

```kex
at(index, fallback)
```

#### `take`

```kex
take(n)
```

#### `drop`

```kex
drop(n)
```

#### `indexOf`

```kex
indexOf(value)
```

#### `zip`

```kex
zip(other)
```

#### `partition`

```kex
partition(pred)
```

#### `push`

```kex
push(value)
```

#### `reject`

```kex
reject(pred)
```

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`map`](enumerable.md#enumerable-map) — Transforms each item by applying `f`, collecting the results into a list.
  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Transforms each item together with its 0-based position, collecting the results into a list.
  - [`filter`](enumerable.md#enumerable-filter) — Keeps the items for which `pred` holds.
  - [`flatMap`](enumerable.md#enumerable-flatmap) — Maps each item to a list and concatenates the results.
  - [`collect`](enumerable.md#enumerable-collect) — Maps each item through `f` (returning an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`each`](enumerable.md#foldable-each) — Applies `f` to each item for its side effects.
  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Applies `f` to each item together with its 0-based position, for side effects.
  - [`all?`](enumerable.md#foldable-all?) — True if every item satisfies `pred`.
  - [`any?`](enumerable.md#foldable-any?) — True if at least one item satisfies `pred`.
  - [`find`](enumerable.md#foldable-find) — The first item satisfying `pred` wrapped in Just, or None.
