---
package: prelude
version: "0.3.1"
source: list.kex
title: List
entities:
  - { kind: type, name: "List" }
  - { kind: make, name: "[Number]" }
  - { kind: make, name: "[X]" }
---

# List

## type `List<X>`



**Variants**

  - _(abstract)_

## make `[Number]`


#### `product`

Maps each element through `f` and multiplies the results.

```kex
product(f) : (X -> Number) -> Number
```

**Returns**: `Number`

**Examples**

```kex
  [[1,2],[3,4]].product { |pair| pair.first.or(1) }   # => 3
```

## make `[X]` implements Enumerable, Foldable


#### `count`

count(pred) is provided by the Enumerable trait.

```kex
count(pred) : (X -> Bool) -> Integer
```

#### `empty?`

Returns `true` if the list contains no elements.

```kex
empty? : Bool
```

**Returns**: `Bool`

**Examples**

```kex
  [].empty?      # => true
  [1, 2].empty?  # => false
```

#### `find`

Returns the first element satisfying the predicate wrapped in `Just`, or `None` if no element matches.

```kex
find(pred) : (X -> Bool) -> X?
```

**Returns**: `X?`

**Examples**

```kex
  [1, 2, 3].find { |x| x > 1 }   # => Just(2)
  [1, 2, 3].find { |x| x > 9 }   # => None
find/any?/all? are provided by the Enumerable trait.
```

#### `any?`

Returns `true` if at least one element satisfies the predicate.

```kex
any?(pred) : (X -> Bool) -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  [1, 2, 3].any? { |x| x > 2 }   # => true
  [1, 2, 3].any? { |x| x > 9 }   # => false
```

#### `all?`

Returns `true` if every element satisfies the predicate.

```kex
all?(pred) : (X -> Bool) -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  [1, 2, 3].all? { |x| x > 0 }   # => true
  [1, 2, 3].all? { |x| x > 1 }   # => false
```

#### `map`

Transforms each element by applying `f`.

```kex
map(f) : (X -> Y) -> [Y]
```

**Returns**: `[Y]`

**Examples**

```kex
  [1, 2, 3].map { |x| x * 2 }   # => [2, 4, 6]
map/filter/each are provided by the Enumerable trait (in terms of reduce).
```

#### `filter`

Returns a new list containing only the elements for which `pred` is `true`.

```kex
filter(pred) : (X -> Bool) -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [1, 2, 3, 4].filter { |x| x.even? }   # => [2, 4]
```

#### `reject`

Returns a new list with all elements for which `pred` is `true` removed. The inverse of `filter`.

```kex
reject(pred) : (X -> Bool) -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [1, 2, 3, 4].reject { |x| x.even? }   # => [1, 3]
```

#### `each`

Calls `f` with each element for its side effects. Returns unit.

```kex
each(f) : (X -> Void) -> Void
```

**Returns**: `Void`

**Examples**

```kex
  [1, 2, 3].each { |x| IO.printLine(x) }
```

#### `reduce`

Folds the list from the left, starting with `acc` and combining each element via `f`.

```kex
reduce(acc, f) : A -> (A -> X -> A) -> A
```

**Returns**: `Acc`

**Examples**

```kex
  [1, 2, 3].reduce(0) { |acc, x| acc + x }   # => 6
  [1, 2, 3].reduce(1) { |acc, x| acc * x }   # => 6
```

#### `flatMap`

Maps each element to a list and concatenates the results.

```kex
flatMap(f) : (X -> [Y]) -> [Y]
```

**Returns**: `[Y]`

**Examples**

```kex
  [1, 2, 3].flatMap { |n| [n, n * 10] }   # => [1, 10, 2, 20, 3, 30]
```

#### `at`

Returns the element at position `i` (0-based) wrapped in `Just`, or `None` if the index is out of range.

```kex
at(i) : Integer -> X?
```

**Returns**: `X?`

**Examples**

```kex
  [10, 20, 30].at(1)   # => Just(20)
  [10, 20, 30].at(9)   # => None
```

#### `get`

```kex
get(i) : Integer -> X?
get(i) : Integer -> X -> X
```

#### `contains?`

Returns `true` if `elem` is present in the list.

```kex
contains?(elem) : X -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  [1, 2, 3].contains?(2)   # => true
  [1, 2, 3].contains?(9)   # => false
```

#### `indexOf`

Returns `true` if the first index at which `elem` appears, wrapped in `Just`, or `None` if the element is not present.

```kex
indexOf(elem) : X -> Integer?
```

**Returns**: `Integer?`

**Examples**

```kex
  [10, 20, 30].indexOf(20)   # => Just(1)
  [10, 20, 30].indexOf(99)   # => None
```

#### `findIndex`

Returns the index of the first element satisfying `pred`, wrapped in `Just`, or `None` if none does. The predicate counterpart of `indexOf`, which searches by value.

```kex
findIndex(pred) : (X -> Bool) -> Integer?
```

**Returns**: `Integer?`

**Examples**

```kex
  [10, 25, 30].findIndex { |n| n > 20 }   # => Just(1)
  [10, 25, 30].findIndex { |n| n > 99 }   # => None
```

#### `takeWhile`

Returns the longest leading run of elements satisfying `pred`. Stops at the first element that does not, so it is not `filter` — later matches are dropped with everything after the first failure.

```kex
takeWhile : (X -> Bool) -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [1, 2, 9, 1].takeWhile { |n| n < 5 }   # => [1, 2]
```

#### `dropWhile`

Returns what is left after `takeWhile` — everything from the first element that does not satisfy `pred` onwards.

```kex
dropWhile : (X -> Bool) -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [1, 2, 9, 1].dropWhile { |n| n < 5 }   # => [9, 1]
```

#### `partition`

Splits the list into two lists: those for which `pred` is `true` (first) and those for which it is `false` (second).

```kex
partition(pred) : (X -> Bool) -> ([X], [X])
```

**Returns**: `([X], [X])`

**Examples**

```kex
  [1, 2, 3, 4].partition { |n| n.even? }   # => ([2, 4], [1, 3])
```

#### `collect`

Maps each element through `f` (which returns an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`. Filter + map fused.

```kex
collect : (X -> Y?) -> [Y]
```

**Returns**: `[Y]`

**Examples**

```kex
  [1, 2, 3, 4].collect { |n| n > 2 then Just(n * 10) else None }   # => [30, 40]
```

#### `take`

Returns the first `n` elements.

```kex
take(n) : Integer -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [1, 2, 3, 4, 5].take(3)   # => [1, 2, 3]
```

#### `drop`

Drops the first `n` elements.

```kex
drop(n) : Integer -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [1, 2, 3, 4, 5].drop(2)   # => [3, 4, 5]
```

#### `push`

Returns a new list with `x` appended at the end.

```kex
push(x) : X -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [1, 2].push(3)   # => [1, 2, 3]
```

#### `zip`

Pairs each element of this list with the corresponding element of `other`. Stops at the end of the shorter list.

```kex
zip(other) : [Y] -> [(X, Y)]
```

**Returns**: `[(X, Y)]`

**Examples**

```kex
  [1, 2, 3].zip(["a", "b", "c"])   # => [(1, "a"), (2, "b"), (3, "c")]
```

#### `sort`

Returns the elements sorted using a custom comparator. `comp` should return `true` when its first argument should come before its second.

```kex
sort(comp) : (X -> X -> Bool) -> [X]
```

**Returns**: `[X]`

**Examples**

```kex
  [3, 1, 2].sort { |a, b| a > b }   # => [3, 2, 1]
```

#### `min`

Returns the element with the smallest `f` key wrapped in `Just`, or `None` for an empty list.

```kex
min(f) : (X -> Y) -> X?
```

**Returns**: `X?`

**Examples**

```kex
  ["hey", "hi"].min { |s| s.count }   # => Just("hi")
```

#### `max`

Returns the element with the largest `f` key wrapped in `Just`, or `None` for an empty list.

```kex
max(f) : (X -> Y) -> X?
```

**Returns**: `X?`

**Examples**

```kex
  ["hey", "hi"].max { |s| s.count }   # => Just("hey")
```

#### `sum`

Maps each element through `f` and sums the results.

```kex
sum(f) : (X -> Number) -> Number
```

**Returns**: `Number`

**Examples**

```kex
  ["hello", "hi"].sum { |s| s.count }   # => 7
```
