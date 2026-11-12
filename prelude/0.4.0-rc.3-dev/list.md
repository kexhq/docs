---
package: prelude
version: "0.4.0-rc.3-dev"
source: list.kex
title: List
entities:
  - { kind: type, name: "List" }
  - { kind: make, name: "[Number]" }
  - { kind: make, name: "[[Y]]" }
  - { kind: make, name: "[X]" }
---

# List

## type `List<X>`

An ordered, immutable sequence, written [1, 2, 3].

Lists are the default collection in Kex. Every operation answers with a new list rather than changing the receiver, so a chain of transformations is safe to read from either end.

```kex
let scores = [7, 2, 9, 4]
scores.filter { |n| n > 3 }      # => [7, 9, 4]
scores.sort                      # => [2, 4, 7, 9]
scores.map { |n| n * 10 }.sum    # => 220
```

Anything that might not be there: the first element, an element at an index, a search result: answers with an `Optional`, so an empty list is an ordinary case rather than a crash:

```kex
[].first.or(0)        # => 0
[1, 2].at(9).or(0)    # => 0
```

A list is `Enumerable` and `Foldable`, which is where `map`, `filter`, `find`, `all?` and `reduce` come from.

**Examples**

_Building a report line by line_

```kex
users
  .filter { |u| u.active? }
  .map { |u| "${u.name} <${u.email}>" }
  .join("\n")
```

Implements [`Monoid`](algebra.md#trait-monoid), [`Blankable`](blankable.md#trait-blankable), [`Enumerable`](enumerable.md#trait-enumerable), [`Foldable`](enumerable.md#trait-foldable), [`Truthyable`](truthyable.md#trait-truthyable).

### Functions

#### `first`

```kex
first -> X?
```

Returns the first element wrapped in `Just`, or `None` if the list is empty.

**Examples**

```kex
[1, 2, 3].first   # => Just(1)
[].first          # => None
```

#### `second`

```kex
second -> X?
```

Returns the second element wrapped in `Just`, or `None` if the list has fewer than two elements.

**Examples**

```kex
[1, 2, 3].second   # => Just(2)
[1].second         # => None
```

#### `third`

```kex
third -> X?
```

Returns the third element wrapped in `Just`, or `None` if the list has fewer than three elements.

**Examples**

```kex
[1, 2, 3].third   # => Just(3)
[1, 2].third      # => None
```

#### `rest`

```kex
rest -> [X]
```

Returns all elements after the first. Returns `[]` for an empty or single-element list.

**Examples**

```kex
[1, 2, 3].rest   # => [2, 3]
[1].rest         # => []
[].rest          # => []
```

#### `last`

```kex
last -> X?
```

Returns the last element wrapped in `Just`, or `None` if the list is empty.

**Examples**

```kex
[1, 2, 3].last   # => Just(3)
[].last          # => None
```

#### `count` (from Foldable)

```kex
count -> Integer
```

Returns the number of elements. When given a predicate, returns the count of elements for which it holds.

**Examples**

```kex
[1, 2, 3].count              # => 3
[1, 2, 3, 4].count(~even?)   # => 2
```

```kex
count(pred: (X -> Bool)) -> Integer
```

Returns how many elements satisfy `pred`.

count(pred) is provided by the Enumerable trait.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the number of matches

**Examples**

```kex
[1, 2, 3, 4].count(~even?)              # => 2
["a", "", "b"].count { |s| s.empty? }   # => 1
```

#### `length`

```kex
length -> Integer
```

Returns the number of elements. The same as `count`, under the name `String` uses.

**Returns**: the number of elements

**Examples**

```kex
[1, 2, 3].length   # => 3
```

#### `empty?`

```kex
empty? -> Bool
```

Returns `true` if the list contains no elements.

**Examples**

```kex
[].empty?      # => true
[1, 2].empty?  # => false
```

#### `find` (from Foldable)

```kex
find(pred: (X -> Bool)) -> X?
```

Returns the first element satisfying the predicate wrapped in `Just`, or `None` if no element matches.

find/any?/all? are provided by the Enumerable trait.

**Examples**

```kex
[1, 2, 3].find { |x| x > 1 }   # => Just(2)
[1, 2, 3].find { |x| x > 9 }   # => None
```

#### `any?` (from Foldable)

```kex
any?(pred: (X -> Bool)) -> Bool
```

Returns `true` if at least one element satisfies the predicate.

**Examples**

```kex
[1, 2, 3].any? { |x| x > 2 }   # => true
[1, 2, 3].any? { |x| x > 9 }   # => false
```

#### `all?` (from Foldable)

```kex
all?(pred: (X -> Bool)) -> Bool
```

Returns `true` if every element satisfies the predicate.

**Examples**

```kex
[1, 2, 3].all? { |x| x > 0 }   # => true
[1, 2, 3].all? { |x| x > 1 }   # => false
```

#### `map` (from Enumerable)

```kex
map(f: (X -> Y)) -> [Y]
```

Transforms each element by applying `f`.

map/filter/each are provided by the Enumerable trait (in terms of reduce).

**Examples**

```kex
[1, 2, 3].map { |x| x * 2 }   # => [2, 4, 6]
```

#### `filter` (from Enumerable)

```kex
filter(pred: (X -> Bool)) -> [X]
```

Returns a new list containing only the elements for which `pred` is `true`.

**Examples**

```kex
[1, 2, 3, 4].filter { |x| x.even? }   # => [2, 4]
```

#### `reject`

```kex
reject(pred: (X -> Bool)) -> [X]
```

Returns a new list with all elements for which `pred` is `true` removed. The inverse of `filter`.

**Examples**

```kex
[1, 2, 3, 4].reject { |x| x.even? }   # => [1, 3]
```

#### `each` (from Foldable)

```kex
each(f: (X -> Void)) -> Void
```

Calls `f` with each element for its side effects. Returns unit.

**Examples**

```kex
[1, 2, 3].each { |x| IO.printLine(x) }
```

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: A, f: (A -> X -> A)) -> A
```

Folds the list from the left, starting with `acc` and combining each element via `f`.

**Parameters**

  - `acc` — initial accumulator value

**Examples**

```kex
[1, 2, 3].reduce(0) { |acc, x| acc + x }   # => 6
[1, 2, 3].reduce(1) { |acc, x| acc * x }   # => 6
```

#### `flatMap` (from Enumerable)

```kex
flatMap(f: (X -> [Y])) -> [Y]
```

Maps each element to a list and concatenates the results.

**Examples**

```kex
[1, 2, 3].flatMap { |n| [n, n * 10] }   # => [1, 10, 2, 20, 3, 30]
```

#### `at`

```kex
at(i: Integer) -> X?
```

Returns the element at position `i` (0-based) wrapped in `Just`, or `None` if the index is out of range.

**Examples**

```kex
[10, 20, 30].at(1)   # => Just(20)
[10, 20, 30].at(9)    # => None
[10, 20, 30].at(-1)   # => Just(30)
```

#### `get`

```kex
get(i: Integer) -> X?
get(i: Integer, default: X) -> X
get(i: Range<Integer>) -> [X]
```

Returns the element at position `i` (0-based), or `None` when the index is out of range. The same as `at` (`get` also accepts a `Range`, which answers a sublist instead).

**Parameters**

  - `i` — the 0-based index

**Returns**: the element, or `None`

**Examples**

```kex
[10, 20, 30].get(1)   # => Just(20)
[10, 20, 30].get(9)    # => None
[10, 20, 30].get(-1)   # => Just(30)
```

#### `contains?`

```kex
contains?(elem: X) -> Bool
```

Returns `true` if `elem` is present in the list.

**Examples**

```kex
[1, 2, 3].contains?(2)   # => true
[1, 2, 3].contains?(9)   # => false
```

#### `indexOf`

```kex
indexOf(elem: X) -> Integer?
```

Returns `true` if the first index at which `elem` appears, wrapped in `Just`, or `None` if the element is not present.

**Examples**

```kex
[10, 20, 30].indexOf(20)   # => Just(1)
[10, 20, 30].indexOf(99)   # => None
```

#### `findIndex`

```kex
findIndex(pred: (X -> Bool)) -> Integer?
```

Returns the index of the first element satisfying `pred`, wrapped in `Just`, or `None` if none does. The predicate counterpart of `indexOf`, which searches by value.

**Examples**

```kex
[10, 25, 30].findIndex { |n| n > 20 }   # => Just(1)
[10, 25, 30].findIndex { |n| n > 99 }   # => None
```

#### `takeWhile`

```kex
takeWhile(pred: (X -> Bool)) -> [X]
```

Returns the longest leading run of elements satisfying `pred`. Stops at the first element that does not, so it is not `filter`: later matches are dropped with everything after the first failure.

**Examples**

```kex
[1, 2, 9, 1].takeWhile { |n| n < 5 }   # => [1, 2]
```

#### `dropWhile`

```kex
dropWhile(pred: (X -> Bool)) -> [X]
```

Returns what is left after `takeWhile`: everything from the first element that does not satisfy `pred` onwards.

**Examples**

```kex
[1, 2, 9, 1].dropWhile { |n| n < 5 }   # => [9, 1]
```

#### `uniq`

```kex
uniq -> [X]
```

Returns a new list with duplicate elements removed, preserving the first occurrence of each element.

**Examples**

```kex
[1, 2, 3, 2, 1].uniq   # => [1, 2, 3]
```

#### `partition`

```kex
partition(pred: (X -> Bool)) -> ([X], [X])
```

Splits the list into two lists: those for which `pred` is `true` (first) and those for which it is `false` (second).

**Examples**

```kex
[1, 2, 3, 4].partition { |n| n.even? }   # => ([2, 4], [1, 3])
```

#### `collect` (from Enumerable)

```kex
collect(f: (X -> Y?)) -> [Y]
```

Maps each element through `f` (which returns an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`. Filter + map fused.

**Examples**

```kex
[1, 2, 3, 4].collect { |n| n > 2 then Just(n * 10) else None }   # => [30, 40]
```

#### `take`

```kex
take(n: Integer) -> [X]
```

Returns the first `n` elements.

**Examples**

```kex
[1, 2, 3, 4, 5].take(3)   # => [1, 2, 3]
```

#### `drop`

```kex
drop(n: Integer) -> [X]
```

Drops the first `n` elements.

**Examples**

```kex
[1, 2, 3, 4, 5].drop(2)   # => [3, 4, 5]
```

#### `slice`

```kex
slice(start: Integer, length: Integer) -> [X]
slice(range: Range<Integer>) -> [X]
```

Returns the sublist of `length` elements starting at index `start`, counting from 0.

The window is clamped rather than refused, the way `take` and `drop` already behave: a start past the end answers `[]`, a length running past the end stops at the end, and a negative length answers `[]`. A negative start counts back from the end, as in Ruby: `-1` is the last element, and a start still before the beginning answers `[]`.

**Parameters**

  - `start` — the 0-based index of the first element
  - `length` — how many elements to keep

**Returns**: the elements in that window

**Examples**

```kex
[1, 2, 3, 4].slice(1, 2)    # => [2, 3]
[1, 2, 3].slice(1, 99)      # => [2, 3]
[1, 2, 3].slice(9, 2)       # => []
[1, 2, 3, 4].slice(-2, 2)   # => [3, 4]
```

_Taking a page of rows_

```kex
rows.slice(page * 10, 10)
```

#### `push`

```kex
push(x: X) -> [X]
```

Returns a new list with `x` appended at the end.

**Examples**

```kex
[1, 2].push(3)   # => [1, 2, 3]
```

#### `reverse`

```kex
reverse -> [X]
```

Returns the elements in reverse order.

**Examples**

```kex
[1, 2, 3].reverse   # => [3, 2, 1]
```

#### `zip`

```kex
zip(other: [Y]) -> [(X, Y)]
```

Pairs each element of this list with the corresponding element of `other`. Stops at the end of the shorter list.

**Examples**

```kex
[1, 2, 3].zip(["a", "b", "c"])   # => [(1, "a"), (2, "b"), (3, "c")]
```

#### `sort`

```kex
sort -> [X]
```

Returns the elements sorted in ascending natural order.

**Examples**

```kex
[3, 1, 2].sort   # => [1, 2, 3]
```

```kex
sort(comp: (X -> X -> Bool)) -> [X]
```

Returns the elements sorted using a custom comparator. `comp` should return `true` when its first argument should come before its second.

**Examples**

```kex
[3, 1, 2].sort { |a, b| a > b }   # => [3, 2, 1]
```

#### `min`

```kex
min -> X?
```

Returns the smallest element wrapped in `Just`, or `None` for an empty list. Elements compare in the same natural order `sort` uses.

**Returns**: the smallest element, or `None`

**Examples**

```kex
[3, 1, 2].min          # => Just(1)
["pear", "fig"].min    # => Just("fig")
[].min                 # => None
```

#### `max`

```kex
max -> X?
```

Returns the largest element wrapped in `Just`, or `None` for an empty list. Elements compare in the same natural order `sort` uses.

**Returns**: the largest element, or `None`

**Examples**

```kex
[3, 1, 2].max          # => Just(3)
["pear", "fig"].max    # => Just("pear")
```

#### `product`

```kex
product(f: (X -> Number)) -> Number
```

Maps each element through `f` and multiplies the results.

**Examples**

```kex
[[1, 2], [3, 4]].product { |pair| pair.first.or(1) }   # => 3
```

#### `minBy`

```kex
minBy(f: (X -> Y)) -> X?
```

Returns the element with the smallest `f` key wrapped in `Just`, or `None` for an empty list. The first of several tying elements wins.

**Parameters**

  - `f` — the key each element is compared by

**Returns**: the element with the smallest key, or `None`

**Examples**

```kex
["hey", "hi"].minBy { |s| s.count }   # => Just("hi")
[].minBy { |s| s.count }              # => None
```

#### `maxBy`

```kex
maxBy(f: (X -> Y)) -> X?
```

Returns the element with the largest `f` key wrapped in `Just`, or `None` for an empty list. The first of several tying elements wins.

**Parameters**

  - `f` — the key each element is compared by

**Returns**: the element with the largest key, or `None`

**Examples**

```kex
["hey", "hi"].maxBy { |s| s.count }   # => Just("hey")
```

#### `sortBy`

```kex
sortBy(f: (X -> Y)) -> [X]
```

Returns the elements sorted by the key `f` gives each one, smallest key first. The sort is stable: elements with equal keys keep their order.

**Parameters**

  - `f` — the key each element is sorted by

**Returns**: the sorted elements

**Examples**

```kex
["pear", "fig", "apple"].sortBy { |s| s.count }   # => ["fig", "pear", "apple"]
```

_Newest first_

```kex
posts.sortBy { |p| p.published }.reverse
```

#### `groupBy`

```kex
groupBy(f: (X -> K)) -> {K: [X]}
```

Groups the elements by the key `f` gives each one. Each group keeps its elements in their original order.

**Parameters**

  - `f` — the key each element is grouped under

**Returns**: each key with the elements that produced it

**Examples**

```kex
[1, 2, 3, 4].groupBy { |n| n.even? }   # => { false: [1, 3], true: [2, 4] }
```

_Words by their first letter_

```kex
words.groupBy { |w| w.first.or(' ') }
```

#### `tally`

```kex
tally -> {X: Integer}
```

Counts how many times each distinct element occurs.

**Returns**: each distinct element with its count

**Examples**

```kex
["a", "b", "a"].tally   # => { "a": 2, "b": 1 }
```

#### `slices`

```kex
slices(n: Integer) -> [[X]]
```

Splits the list into consecutive pieces of `n` elements; the last piece holds whatever is left over. Ruby calls this `each_slice`.

**Parameters**

  - `n` — the piece size, at least 1

**Returns**: the pieces, in order; `[]` when `n` is less than 1

**Examples**

```kex
[1, 2, 3, 4, 5].slices(2)   # => [[1, 2], [3, 4], [5]]
```

_Rows of a table, three cells each_

```kex
cells.slices(3).map { |row| row.join(" | ") }
```

#### `windows`

```kex
windows(n: Integer) -> [[X]]
```

Every run of `n` consecutive elements, each overlapping the next by all but one element. Ruby calls this `each_cons`.

**Parameters**

  - `n` — the window size, at least 1

**Returns**: the windows, in order; `[]` when the list is shorter than `n` or `n` is less than 1

**Examples**

```kex
[1, 2, 3, 4].windows(2)   # => [[1, 2], [2, 3], [3, 4]]
```

_Differences between neighbours_

```kex
readings.windows(2).map { |w| w.get(1, 0) - w.get(0, 0) }
```

#### `difference`

```kex
difference(other: [X]) -> [X]
```

The elements of this list that are not in `other`, in this list's order. Duplicates in this list are kept unless `other` removes them.

**Parameters**

  - `other` — the elements to leave out

**Returns**: what remains

**Examples**

```kex
[1, 2, 2, 3].difference([2])   # => [1, 3]
```

#### `intersect`

```kex
intersect(other: [X]) -> [X]
```

The distinct elements present in both lists, in this list's order.

**Parameters**

  - `other` — the list to intersect with

**Returns**: the shared elements, each once

**Examples**

```kex
[1, 2, 2, 3].intersect([3, 2, 5])   # => [2, 3]
```

#### `union`

```kex
union(other: [X]) -> [X]
```

The distinct elements of both lists: this list's first, then the new ones from `other`.

**Parameters**

  - `other` — the list to add

**Returns**: every distinct element, each once

**Examples**

```kex
[1, 2, 2].union([2, 3])   # => [1, 2, 3]
```

#### `sum`

```kex
sum(f: (X -> Number)) -> Number
```

Maps each element through `f` and sums the results.

**Examples**

```kex
["hello", "hi"].sum { |s| s.count }   # => 7
```

#### `join`

```kex
join(sep: String) -> String
join -> String
```

Renders and concatenates the elements, placing `sep` between adjacent values. With no separator, the rendered values are joined directly.

Elements do not have to be strings: each is rendered using the same user-facing conversion used by interpolation and printing.

**Parameters**

  - `sep` — text placed between adjacent elements

**Returns**: the concatenated rendering

**Examples**

```kex
["hello", "world", "kex"].join(", ")   # => "hello, world, kex"
["a", "b", "c"].join                   # => "abc"
[1, 2, 3].join(" + ")                 # => "1 + 2 + 3"
```

### On `[Number]`

#### `sum`

```kex
sum -> Number
```

Sums all elements. Returns `0` for an empty list.

**Examples**

```kex
[1, 2, 3].sum   # => 6
[].sum          # => 0
```

#### `product`

```kex
product -> Number
```

Multiplies all elements. Returns `1` for an empty list.

**Examples**

```kex
[1, 2, 3].product   # => 6
[].product          # => 1
```

### On `[[Y]]`

#### `flatten`

```kex
flatten -> [Y]
```

Flattens exactly one level of nesting.

**Examples**

```kex
[[1, 2], [3, 4]].flatten   # => [1, 2, 3, 4]
```

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and collects the results into a list.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`none?`](enumerable.md#foldable-none?) — Returns `true` when no item satisfies `pred`: the opposite of `any?`.
  - [`one?`](enumerable.md#foldable-one?) — Returns `true` when exactly one item satisfies `pred`.

### Defined in other modules

  - [Algebra](algebra.md#make-list): [`identity`](algebra.md#list-identity), [`combine`](algebra.md#list-combine)
  - [Blankable](blankable.md#make-list): [`blank?`](blankable.md#list-blank?)
  - [Truthyable](truthyable.md#make-list): [`truthy?`](truthyable.md#list-truthy?)
