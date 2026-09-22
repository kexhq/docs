---
package: prelude
version: "0.4.0-beta.4-dev"
source: range.kex
title: Range
entities:
  - { kind: type, name: "Range" }
  - { kind: make, name: "Range" }
---

# Range

## type `Range`

A span between two bounds, written `(1..10)` or `('a'..'z')`.

A range stores its endpoints on both backends without building a list. Integer and character ranges can be enumerated with both ends included. Float ranges describe continuous bounds, for example `(-1.0..1.0)` for random sampling; they cannot be enumerated without an explicit step.

```kex
(1..5).items          # => [1, 2, 3, 4, 5]
(1..5).sum            # => 15
5.in?(1..10)          # => true
('a'..'e').items      # => ['a', 'b', 'c', 'd', 'e']
```

It is `Enumerable` and `Foldable`, so the traversal methods work directly, and the list operations below answer in list terms. Use `items` when you want a real list to hand to something else.

```kex
(1..10).items.filter(~even?)   # => [2, 4, 6, 8, 10]
(1..3).items.each { |n| IO.printLine(n) }
```



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

#### `sum`

Returns the sum of the range's elements.

```kex
sum : ?
```

**Returns**: `Number` — the sum

**Examples**

```kex
(1..10).sum   # => 55
(1..1).sum    # => 1
```

#### `product`

Returns the product of the range's elements.

```kex
product : ?
```

**Returns**: `Number` — the product

**Examples**

```kex
(1..5).product   # => 120   (five factorial)
```

#### `contains?`

Returns `true` when `value` falls inside the range, endpoints included.

`5.in?(1..10)` says the same thing from the value's side, and often reads better.

```kex
contains?(value) : A -> Bool
```

**Returns**: `Bool` — `true` when the value is in range

**Examples**

```kex
(1..10).contains?(5)    # => true
(1..10).contains?(11)   # => false
```

#### `items`

Returns the range's elements as a list.

This is where a range stops being two numbers and becomes real data, so it is also where a very large range starts to cost something.

```kex
items : [A]
```

**Returns**: `[A]` — the elements, in ascending order

**Examples**

```kex
(1..3).items      # => [1, 2, 3]
('a'..'c').items  # => ['a', 'b', 'c']
```
_Building a lookup table_

```kex
(1..12).items.map { |m| (m, monthName(m)) }
```

#### `first`

Returns the first element, or `None` for an empty range.

The list operations, over the materialized items. A range is an ordered collection, so `(1..5).first` and `(1..5).length` operate on its materialized elements. Floating bounds do not define such a collection.

```kex
first : A?
```

**Returns**: `A?` — the first element, or `None`

**Examples**

```kex
(3..7).first   # => Just(3)
```

#### `second`

Returns the second element, or `None` when the range is shorter than two.

```kex
second : A?
```

**Returns**: `A?` — the second element, or `None`

**Examples**

```kex
(3..7).second   # => Just(4)
```

#### `third`

Returns the third element, or `None` when the range is shorter than three.

```kex
third : A?
```

**Returns**: `A?` — the third element, or `None`

**Examples**

```kex
(3..7).third   # => Just(5)
```

#### `last`

Returns the last element, or `None` for an empty range.

```kex
last : A?
```

**Returns**: `A?` — the last element, or `None`

**Examples**

```kex
(3..7).last   # => Just(7)
```

#### `rest`

Returns every element after the first, as a list.

```kex
rest : [A]
```

**Returns**: `[A]` — the remaining elements

**Examples**

```kex
(1..4).rest   # => [2, 3, 4]
```

#### `length`

Returns how many elements the range has.

```kex
length : Integer
```

**Returns**: `Integer` — the number of elements

**Examples**

```kex
(1..10).length   # => 10
(5..5).length    # => 1
```

#### `count`

Returns how many elements the range has. The same as `length`.

```kex
count : Integer
```

**Returns**: `Integer` — the number of elements

**Examples**

```kex
(1..10).count   # => 10
```

#### `empty?`

Returns `true` when the range has no elements.

```kex
empty? : Bool
```

**Returns**: `Bool` — `true` for an empty range

**Examples**

```kex
(1..3).empty?   # => false
```

#### `max`

Returns the largest element, or `None` for an empty range.

```kex
max : A?
```

**Returns**: `A?` — the largest element, or `None`

**Examples**

```kex
(1..10).max   # => Just(10)
```

#### `min`

Returns the smallest element, or `None` for an empty range.

```kex
min : A?
```

**Returns**: `A?` — the smallest element, or `None`

**Examples**

```kex
(1..10).min   # => Just(1)
```

#### `reverse`

Returns the elements as a list, in descending order.

```kex
reverse : [A]
```

**Returns**: `[A]` — the elements, reversed

**Examples**

```kex
(1..4).reverse   # => [4, 3, 2, 1]
```
_Counting down_

```kex
(1..3).reverse.each { |n| IO.printLine(n) }   # prints 3, 2, 1
```

#### `sort`

Returns the elements as a sorted list. A range is already ascending, so this is the identity: it exists so that generic code can call it.

```kex
sort : [A]
```

**Returns**: `[A]` — the elements, sorted

**Examples**

```kex
(1..4).sort   # => [1, 2, 3, 4]
```

#### `sort`

Returns the elements as a list, ordered by `comparator`.

```kex
sort(comparator) : (A -> A -> Bool) -> [A]
```

**Returns**: `[A]` — the sorted elements

**Examples**

```kex
(1..4).sort { |a, b| a > b }   # => [4, 3, 2, 1]
```

#### `uniq`

Returns the elements as a list with duplicates removed. A range has none, so this is the identity: it exists so that generic code can call it.

```kex
uniq : [A]
```

**Returns**: `[A]` — the distinct elements

**Examples**

```kex
(1..3).uniq   # => [1, 2, 3]
```

#### `join`

Renders the elements as text, with `separator` between them.

```kex
join(separator) : String -> String
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
at(index) : Integer -> A?
```

**Returns**: `A?` — the element, or `None`

**Examples**

```kex
(10..20).at(0)   # => Just(10)
(10..20).at(99)  # => None
```

#### `get`

Returns the element at index `index`, counting from 0, or `None` when out of range. The same as `at`, named to match `List` and `Map`.

```kex
get(index) : Integer -> A?
get(index) : Integer -> A -> A
```

**Returns**: `A?` — the element, or `None`

**Examples**

```kex
(10..20).get(0)   # => Just(10)
(10..20).get(99)  # => None
```

#### `take`

Returns the first `n` elements as a list.

```kex
take(n) : Integer -> [A]
```

**Returns**: `[A]` — the leading elements

**Examples**

```kex
(1..10).take(3)   # => [1, 2, 3]
```

#### `drop`

Returns everything after the first `n` elements, as a list.

```kex
drop(n) : Integer -> [A]
```

**Returns**: `[A]` — the remaining elements

**Examples**

```kex
(1..5).drop(3)   # => [4, 5]
```

#### `indexOf`

Returns the position of `value` in the range, or `None` when it is not in it.

```kex
indexOf(value) : A -> Integer?
```

**Returns**: `Integer?` — the 0-based position, or `None`

**Examples**

```kex
('a'..'e').indexOf('c')   # => Just(2)
(10..20).indexOf(12)      # => Just(2)
```

#### `zip`

Pairs each element with the element at the same position in `other`, stopping at the shorter of the two.

```kex
zip(other) : [B] -> [(A, B)]
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
partition(pred) : (A -> Bool) -> ([A], [A])
```

**Returns**: `([A], [A])` — the matching and non-matching elements

**Examples**

```kex
(1..4).partition { |n| n.even? }   # => ([2, 4], [1, 3])
```

#### `push`

Returns the elements as a list with `value` added at the end.

```kex
push(value) : A -> [A]
```

**Returns**: `[A]` — the elements plus `value`

**Examples**

```kex
(1..3).push(4)   # => [1, 2, 3, 4]
```

#### `reject`

Returns the elements that do NOT satisfy `pred`, as a list.

```kex
reject(pred) : (A -> Bool) -> [A]
```

**Returns**: `[A]` — the elements that failed the predicate

**Examples**

```kex
(1..5).reject { |n| n.even? }   # => [1, 3, 5]
```
