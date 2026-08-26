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

A span between two bounds, written `(1..10)` or `('a'..'z')`.

A range stores only its two endpoints and computes everything else from them, so `(1..1000000)` costs nothing to make. Both ends are included.

  (1..5).items          # => [1, 2, 3, 4, 5]   (1..5).sum            # => 15   5.in?(1..10)          # => true   ('a'..'e').items      # => ['a', 'b', 'c', 'd', 'e']

It is `Enumerable` and `Foldable`, so the traversal methods work directly, and the list operations below answer in list terms. Use `items` when you want a real list to hand to something else.

  (1..10).items.filter(~even?)   # => [2, 4, 6, 8, 10]   (1..3).items.each { |n| IO.printLine(n) }



## make `Range` implements [Enumerable](enumerable.md#trait-enumerable), [Foldable](enumerable.md#trait-foldable)


#### `reduce`

Folds over the range's elements in ascending order.

This is `Range`'s `Enumerable` primitive; the traversal methods are built on it. A range stays structurally minimal, so the fold runs over its materialized items.

```kex
reduce(acc, f)
```

**Returns**: `A` — the final accumulator

**Examples**

```kex
  (1..4).reduce(0) { |sum, n| sum + n }   # => 10
```

#### `contains?`

Returns `true` when `value` falls inside the range, endpoints included.

`5.in?(1..10)` says the same thing from the value's side, and often reads better.

```kex
contains?(value)
```

**Returns**: `Bool` — `true` when the value is in range

**Examples**

```kex
  (1..10).contains?(5)    # => true
  (1..10).contains?(11)   # => false
```

#### `sort`

Returns the elements as a list, ordered by `comparator`.

```kex
sort(comparator)
```

**Returns**: `[A]` — the sorted elements

**Examples**

```kex
  (1..4).sort { |a, b| a > b }   # => [4, 3, 2, 1]
```

#### `join`

Renders the elements as text, with `separator` between them.

```kex
join(separator)
```

**Returns**: `String` — the joined text

**Examples**

```kex
  (1..4).join(", ")   # => "1, 2, 3, 4"
```
_A comma-separated header_

```kex
  "columns: ${(1..3).join(",")}"   # => "columns: 1,2,3"
```

#### `at`

Returns the element at index `index`, counting from 0, or `None` when out of range.

Note that the index counts positions, not values: `(10..20).at(0)` is `Just(10)`.

```kex
at(index)
```

**Returns**: `A?` — the element, or `None`

**Examples**

```kex
  (10..20).at(0)   # => Just(10)
  (10..20).at(99)  # => None
```

#### `take`

Returns the first `n` elements as a list.

```kex
take(n)
```

**Returns**: `[A]` — the leading elements

**Examples**

```kex
  (1..10).take(3)   # => [1, 2, 3]
```

#### `drop`

Returns everything after the first `n` elements, as a list.

```kex
drop(n)
```

**Returns**: `[A]` — the remaining elements

**Examples**

```kex
  (1..5).drop(3)   # => [4, 5]
```

#### `indexOf`

Returns the position of `value` in the range, or `None` when it is not in it.

Note: on a numeric range the argument is currently inferred as a `Char`, so `(10..20).indexOf(12)` does not compile. Use `(10..20).items.indexOf(12)` for numbers.

```kex
indexOf(value)
```

**Returns**: `Integer?` — the 0-based position, or `None`

**Examples**

```kex
  ('a'..'e').indexOf('c')      # => Just(2)
  (10..20).items.indexOf(12)   # => Just(2)
```

#### `zip`

Pairs each element with the element at the same position in `other`, stopping at the shorter of the two.

```kex
zip(other)
```

**Returns**: `[(A, B)]` — the pairs, in order

**Examples**

```kex
  (1..3).zip(["a", "b", "c"])   # => [(1, "a"), (2, "b"), (3, "c")]
```
_Numbering a list_

```kex
  (1..names.count).zip(names)
```

#### `partition`

Splits the elements into those satisfying `pred` and those that do not.

```kex
partition(pred)
```

**Returns**: `([A], [A])` — the matching and non-matching elements

**Examples**

```kex
  (1..4).partition { |n| n.even? }   # => ([2, 4], [1, 3])
```

#### `push`

Returns the elements as a list with `value` added at the end.

```kex
push(value)
```

**Returns**: `[A]` — the elements plus `value`

**Examples**

```kex
  (1..3).push(4)   # => [1, 2, 3, 4]
```

#### `reject`

Returns the elements that do NOT satisfy `pred`, as a list.

```kex
reject(pred)
```

**Returns**: `[A]` — the elements that failed the predicate

**Examples**

```kex
  (1..5).reject { |n| n.even? }   # => [1, 3, 5]
```
