---
package: prelude
version: "0.4.0-rc.4-dev"
source: range.kex
title: Range
entities:
  - { kind: type, name: "Range" }
  - { kind: trait, name: "Discrete" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Char" }
  - { kind: make, name: "Range<A>" }
---

# Range

## type `Range<A>`

A span between two bounds, written `(1..10)` or `('a'..'z')`.

Both ends are included. A range holds only its endpoints (and a step), so a large one costs nothing until you enumerate it. Integer and character ranges can be enumerated. A Float range such as `(-1.0..1.0)` is a pair of bounds, useful for `contains?` or random sampling, and cannot be enumerated. A range whose lower end is above its upper end is empty, so `(1..count).each` does nothing when `count` is 0.

```kex
(1..5).items          # => [1, 2, 3, 4, 5]
(1..5).sum            # => 15
5.in?(1..10)          # => true
('a'..'e').items      # => ['a', 'b', 'c', 'd', 'e']
```

To count down or by another step, use `by` or `Integer.downTo`:

```kex
(1..10).by(2).items   # => [1, 3, 5, 7, 9]
(10..1).by(-3).items  # => [10, 7, 4, 1]
10.downTo(8).items    # => [10, 9, 8]
(1..4).reverse.items  # => [4, 3, 2, 1]
```

A range of Integers or Chars (a `Discrete` type) is `Enumerable` and `Foldable`, and the list functions below return lists. A Float range has only `contains?`. Use `items` to get the elements as a list.

```kex
(1..10).items.filter(~even?)   # => [2, 4, 6, 8, 10]
(1..3).items.each { |n| IO.printLine(n) }
```

Implements [`Enumerable<A>`](enumerable.md#trait-enumerable), [`Foldable<A>`](enumerable.md#trait-foldable).

### Functions

Functions every range has, Float ranges included.

#### `contains?`

```kex
contains?(value: A) -> Bool
```

Returns `true` when `value` lies between the endpoints, both included.

A range with the default step only compares `value` with the endpoints, so this is cheap for any size of range and works for a `Float` range. A range whose lower end is above its upper end contains nothing. A stepped range contains only the values its step reaches.

**Parameters**

  - `value` — the value to test

**Returns**: `true` when the value is in range

**Examples**

```kex
(1..10).contains?(5)          # => true
(1..10).contains?(11)         # => false
(0.0..1.0).contains?(0.25)    # => true
('a'..'f').contains?('c')     # => true
(1..10).by(3).contains?(7)    # => true
(1..10).by(3).contains?(8)    # => false
```

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds over the range's elements in order.

The `Enumerable` functions are built on it. It builds the list of elements first.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each element

**Returns**: the final accumulator

**Examples**

```kex
(1..4).reduce(0) { |sum, n| sum + n }   # => 10
```

#### `each` (from Foldable)

```kex
each(f: (A -> Void)) -> Void
```

Calls `f` with each element in order, for its side effects.

**Parameters**

  - `f` — called with each element

**Examples**

```kex
(1..3).each { |n| IO.printLine(n) }
```

#### `map` (from Enumerable)

```kex
map(f: (A -> B)) -> [B]
```

Returns a list of `f` applied to each element, in order.

**Parameters**

  - `f` — the transformation

**Returns**: the results, as a list

**Examples**

```kex
(1..3).map { |n| n * n }   # => [1, 4, 9]
```

#### `sum`

Returns the sum of the range's elements.

**Returns**: `Number` — the sum

**Examples**

```kex
(1..10).sum   # => 55
(1..1).sum    # => 1
```

#### `product`

Returns the product of the range's elements.

**Returns**: `Number` — the product

**Examples**

```kex
(1..5).product   # => 120   (five factorial)
```

#### `by`

```kex
by(step: Integer) -> Range<A>
```

Returns the range counted by `step` from its first endpoint towards its last.

A negative step counts down, and a range whose end lies the other way from its start is empty. The last endpoint is included only when the step lands on it.

A step of 0 is a run-time error. `by` on a `Float` range is a type error.

**Parameters**

  - `step` — the distance between consecutive elements

**Returns**: the stepped range

**Examples**

```kex
(1..10).by(2).items      # => [1, 3, 5, 7, 9]
(10..1).by(-1).items     # => [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
(1..10).by(-1).items     # => []
('a'..'g').by(3).items   # => ['a', 'd', 'g']
```

#### `items`

```kex
items -> [A]
```

Returns the range's elements as a list.

This builds the whole list, so it costs memory for a very large range.

**Returns**: the elements, in the range's order

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

```kex
first -> A?
```

Returns the first element, or `None` for an empty range.

**Returns**: the first element, or `None`

**Examples**

```kex
(3..7).first   # => Just(3)
```

#### `second`

```kex
second -> A?
```

Returns the second element, or `None` when the range is shorter than two.

**Returns**: the second element, or `None`

**Examples**

```kex
(3..7).second   # => Just(4)
```

#### `third`

```kex
third -> A?
```

Returns the third element, or `None` when the range is shorter than three.

**Returns**: the third element, or `None`

**Examples**

```kex
(3..7).third   # => Just(5)
```

#### `last`

```kex
last -> A?
```

Returns the last element, or `None` for an empty range.

**Returns**: the last element, or `None`

**Examples**

```kex
(3..7).last   # => Just(7)
```

#### `rest`

```kex
rest -> [A]
```

Returns every element after the first, as a list.

**Returns**: the remaining elements

**Examples**

```kex
(1..4).rest   # => [2, 3, 4]
```

#### `length`

```kex
length -> Integer
```

Returns how many elements the range has.

**Returns**: the number of elements

**Examples**

```kex
(1..10).length   # => 10
(5..5).length    # => 1
```

#### `count` (from Foldable)

```kex
count -> Integer
```

Returns how many elements the range has, as `length` does.

**Returns**: the number of elements

**Examples**

```kex
(1..10).count   # => 10
```

#### `empty?`

```kex
empty? -> Bool
```

Returns `true` when the range has no elements.

**Returns**: `true` for an empty range

**Examples**

```kex
(1..3).empty?   # => false
```

#### `max`

```kex
max -> A?
```

Returns the largest element, or `None` for an empty range.

**Returns**: the largest element, or `None`

**Examples**

```kex
(1..10).max   # => Just(10)
```

#### `min`

```kex
min -> A?
```

Returns the smallest element, or `None` for an empty range.

**Returns**: the smallest element, or `None`

**Examples**

```kex
(1..10).min   # => Just(1)
```

#### `minBy`

```kex
minBy(f: (A -> B)) -> A?
```

Returns the element with the smallest `f` key wrapped in `Just`, or `None` for an empty range. The first of several tying elements wins.

**Parameters**

  - `f` — the key each element is compared by

**Returns**: the element with the smallest key, or `None`

**Examples**

```kex
(1..10).minBy { |n| (n - 4).abs }   # => Just(4)
```

#### `maxBy`

```kex
maxBy(f: (A -> B)) -> A?
```

Returns the element with the largest `f` key wrapped in `Just`, or `None` for an empty range. The first of several tying elements wins.

**Parameters**

  - `f` — the key each element is compared by

**Returns**: the element with the largest key, or `None`

**Examples**

```kex
(1..10).maxBy { |n| n % 7 }   # => Just(6)
```

#### `sortBy`

```kex
sortBy(f: (A -> B)) -> [A]
```

Returns the elements as a list sorted by the key `f` gives each one, smallest key first. The sort is stable: elements with equal keys keep their order.

**Parameters**

  - `f` — the key each element is sorted by

**Returns**: the sorted elements

**Examples**

```kex
(1..6).sortBy { |n| n % 3 }   # => [3, 6, 1, 4, 2, 5]
```

#### `groupBy`

```kex
groupBy(f: (A -> K)) -> {K: [A]}
```

Groups the elements by the key `f` gives each one. Each group keeps its elements in ascending order.

**Parameters**

  - `f` — the key each element is grouped under

**Returns**: each key with the elements that produced it

**Examples**

```kex
(1..6).groupBy { |n| n.even? }   # => { false: [1, 3, 5], true: [2, 4, 6] }
```

#### `reverse`

```kex
reverse -> Range<A>
```

Returns a range of the same elements in the opposite order.

It starts at the last element the step reaches, so `(1..10).by(3).reverse` is `(10..1).by(-3)` and `(1..9).by(3).reverse` is `(7..1).by(-3)`. An empty range stays empty.

**Returns**: the range, reversed

**Examples**

```kex
(1..4).reverse.items   # => [4, 3, 2, 1]
```

_Counting down_

```kex
(1..3).reverse.each { |n| IO.printLine(n) }   # prints 3, 2, 1
```

#### `sort`

```kex
sort -> [A]
```

Returns the elements as a list in ascending order, whatever the step.

**Returns**: the elements, sorted

**Examples**

```kex
(1..4).sort   # => [1, 2, 3, 4]
```

```kex
sort(comparator: (A -> A -> Bool)) -> [A]
```

Returns the elements as a list, ordered by `comparator`.

**Parameters**

  - `comparator` — `true` when the first should come first

**Returns**: the sorted elements

**Examples**

```kex
(1..4).sort { |a, b| a > b }   # => [4, 3, 2, 1]
```

#### `uniq`

```kex
uniq -> [A]
```

Returns the elements as a list with duplicates removed. A range has no duplicates, so this is the same as `items`.

**Returns**: the distinct elements

**Examples**

```kex
(1..3).uniq   # => [1, 2, 3]
```

#### `join`

```kex
join(separator: String) -> String
```

Renders the elements as text, with `separator` between them.

**Parameters**

  - `separator` — placed between elements

**Returns**: the joined text

**Examples**

```kex
(1..4).join(", ")   # => "1, 2, 3, 4"
```

_A comma-separated header_

```kex
"columns: ${(1..3).join(",")}"   # => "columns: 1,2,3"
```

#### `at`

```kex
at(index: Integer) -> A?
```

Returns the element at index `index`, counting from 0, or `None` when out of range.

The index counts positions, not values: `(10..20).at(0)` is `Just(10)`.

**Parameters**

  - `index` — the 0-based position

**Returns**: the element, or `None`

**Examples**

```kex
(10..20).at(0)   # => Just(10)
(10..20).at(99)  # => None
```

#### `get`

```kex
get(index: Integer) -> A?
get(index: Integer, fallback: A) -> A
```

Returns the element at index `index`, counting from 0, or `None` when out of range. The same as `at`, named to match `List` and `Map`.

**Parameters**

  - `index` — the 0-based position

**Returns**: the element, or `None`

**Examples**

```kex
(10..20).get(0)   # => Just(10)
(10..20).get(99)  # => None
```

#### `take`

```kex
take(n: Integer) -> [A]
```

Returns the first `n` elements as a list.

**Parameters**

  - `n` — how many elements to keep

**Returns**: the leading elements

**Examples**

```kex
(1..10).take(3)   # => [1, 2, 3]
```

#### `drop`

```kex
drop(n: Integer) -> [A]
```

Returns everything after the first `n` elements, as a list.

**Parameters**

  - `n` — how many elements to skip

**Returns**: the remaining elements

**Examples**

```kex
(1..5).drop(3)   # => [4, 5]
```

#### `indexOf`

```kex
indexOf(value: A) -> Integer?
```

Returns the position of `value` in the range, or `None` when it is not in it.

**Parameters**

  - `value` — the element to look for

**Returns**: the 0-based position, or `None`

**Examples**

```kex
('a'..'e').indexOf('c')   # => Just(2)
(10..20).indexOf(12)      # => Just(2)
```

#### `zip`

```kex
zip(other: [B]) -> [(A, B)]
```

Pairs each element with the element at the same position in `other`, stopping at the shorter of the two.

**Parameters**

  - `other` — the list to pair with

**Returns**: the pairs, in order

**Examples**

```kex
(1..3).zip(["a", "b", "c"])   # => [(1, "a"), (2, "b"), (3, "c")]
```

_Numbering a list_

```kex
(1..names.count).zip(names)
```

#### `partition`

```kex
partition(pred: (A -> Bool)) -> ([A], [A])
```

Splits the elements into those satisfying `pred` and those that do not.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the matching and non-matching elements

**Examples**

```kex
(1..4).partition { |n| n.even? }   # => ([2, 4], [1, 3])
```

#### `push`

```kex
push(value: A) -> [A]
```

Returns the elements as a list with `value` added at the end.

**Parameters**

  - `value` — the element to add

**Returns**: the elements plus `value`

**Examples**

```kex
(1..3).push(4)   # => [1, 2, 3, 4]
```

#### `reject`

```kex
reject(pred: (A -> Bool)) -> [A]
```

Returns the elements that fail `pred`, as a list.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the elements that failed the predicate

**Examples**

```kex
(1..5).reject { |n| n.even? }   # => [1, 3, 5]
```

#### `countThrough`

```kex
countThrough(at: Integer, last: Integer, f)
```

`f` applied to each integer from `at` through `last`.

#### `countBy`

```kex
countBy(at: Integer, last: Integer, step: Integer, f)
```

`f` applied to each integer from `at` towards `last` by `step`.

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and returns the results as a list.
  - [`filter`](enumerable.md#enumerable-filter) — Returns the items for which `pred` returns `true`.
  - [`into`](enumerable.md#enumerable-into) — Applies `f`, which returns a list, to each item and concatenates the results.
  - [`collect`](enumerable.md#enumerable-collect) — Applies `f`, which returns an `Optional`, to each item and returns the present values, unwrapped.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`, and `true` for an empty collection.
  - [`any?`](enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`, and `false` for an empty collection.
  - [`none?`](enumerable.md#foldable-none?) — Returns `true` when no item satisfies `pred`, the opposite of `any?`.
  - [`one?`](enumerable.md#foldable-one?) — Returns `true` when exactly one item satisfies `pred`.
  - [`find`](enumerable.md#foldable-find) — Returns the first item satisfying `pred`, or `None` when nothing does.

## trait `Discrete`

The element types with a next value, whose ranges can be enumerated: Integer and Char.

A Float range has no next value, so it has `contains?` and none of the traversal functions; `(0.0..1.0).sum` is a type error.

Implemented by [`Integer`](#make-integer), [`Char`](#make-char).



## extends `Integer`

More functions for [`Integer`](number.md#make-integer), added by this module.

Implements [`Discrete`](#trait-discrete).



## extends `Char`

More functions for [`Char`](string.md#make-char), added by this module.

Implements [`Discrete`](#trait-discrete).


