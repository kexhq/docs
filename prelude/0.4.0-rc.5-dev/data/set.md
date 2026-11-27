---
package: prelude
version: "0.4.0-rc.5-dev"
source: data/set.kex
title: Data.Set
entities:
  - { kind: module, name: "Data" }
---

# Data.Set

## module `Data`

Immutable collections of distinct elements.

Nothing here is in scope until `using Data.Set`, which brings in both kinds of set:

```kex
using Data.Set
```

Membership uses the same structural equality as `==` and map keys, so records and tuples are compared by value. Updates return a new set. The `!` forms (`add!`, `delete!`) rebind the variable they are called on to the new set.

```kex
let tags = Set.from(["kex", "beam", "kex"])
tags.count                     # => 2
tags.contains?("beam")         # => true
tags.add("erlang").items       # => ["beam", "erlang", "kex"]
```

The two kinds differ in how they store their elements:

```kex
Set           kept sorted, so iteration is in ascending order and the
              elements must be +Comparable+.
UnorderedSet  hash-based, so +contains?+ is a map lookup and the elements
              need only support equality. Iteration order is unspecified,
              so don't write a test that depends on it.
```

Use `Set` when you will read the elements back out, and `UnorderedSet` when the set is mostly asked `contains?`.

Two sets are equal when they have the same elements. `items` returns the elements as a list, in no particular order for an `UnorderedSet`.



## record `Set<A>`

A set whose elements are kept sorted and free of duplicates.

Build one with `Set.from`. A `Set { items: ... }` literal neither sorts nor removes duplicates, and every function here assumes both. `items` is the stored list, so reading it costs nothing.

```kex
Set.from([3, 1, 2]).items   # => [1, 2, 3]
```

**Fields**

  - `items` : [A] (optional)

Implements [`Enumerable<A>`](../enumerable.md#trait-enumerable), [`Foldable<A>`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Functions

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds over the elements in ascending order.

`each`, `find`, `any?` and the rest of `Enumerable` are built on it. `map`, `filter` and `reject` are defined below to return a `Set`; the other `Enumerable` functions that build a collection return a list.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each element

**Returns**: the final accumulator

**Examples**

```kex
Set.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `identity` (from Monoid)

```kex
identity -> Set<A>
```

Returns the empty set, the `Monoid` identity for union.

**Returns**: the empty set

#### `combine` (from Monoid)

```kex
combine(other: Set<A>) -> Set<A>
```

Returns the union of the two sets. This is the `Monoid` operation.

**Parameters**

  - `other` — the set to combine with

**Returns**: every element of either set

**Examples**

_Merging many sets into one_

```kex
[Set.from([1]), Set.from([2]), Set.from([1, 3])]
  .reduce(Set.empty) { |acc, s| acc.combine(s) }
# => Set(1, 2, 3)
```

#### `contains?`

```kex
contains?(value: A) -> Bool
```

Returns `true` when `value` is a member.

**Parameters**

  - `value` — the element to look for

**Returns**: `true` when it is present

**Examples**

```kex
Set.from([1, 2, 3]).contains?(2)   # => true
Set.from([1, 2, 3]).contains?(9)   # => false
```

_Filtering a list against an allow-list_

```kex
let allowed = Set.from(["get", "post"])
verbs.filter { |v| allowed.contains?(v.lowerCase) }
```

#### `count` (from Foldable)

```kex
count -> Integer
```

Returns the number of elements. Duplicates in the list the set was built from are not counted.

**Returns**: the number of elements

**Examples**

```kex
Set.from([1, 1, 2]).count   # => 2
```

_Counting distinct words_

```kex
Set.from(text.split(" ")).count
```

#### `empty?`

```kex
empty? -> Bool
```

Returns `true` when the set has no elements.

**Returns**: `true` for the empty set

**Examples**

```kex
Set.empty.empty?           # => true
Set.from([1]).empty?       # => false
```

#### `add`

```kex
add(value: A) -> Set<A>
```

Returns a new set with `value` added. Adding an existing member changes nothing.

`add!` rebinds the variable instead.

**Parameters**

  - `value` — the element to add

**Returns**: a set including `value`

**Examples**

```kex
Set.from([1, 2]).add(3)   # => Set(1, 2, 3)
Set.from([1, 2]).add(2)   # => Set(1, 2)
```

_Accumulating as you go_

```kex
var seen = Set.empty
ids.each { |id| seen.add!(id) }
```

#### `delete`

```kex
delete(value: A) -> Set<A>
```

Returns a new set without `value`. Removing a non-member changes nothing.

`delete!` rebinds the variable instead.

**Parameters**

  - `value` — the element to remove

**Returns**: a set without `value`

**Examples**

```kex
Set.from([1, 2, 3]).delete(2)   # => Set(1, 3)
Set.from([1, 2, 3]).delete(9)   # => Set(1, 2, 3)
```

#### `union`

```kex
union(other: Set<A>) -> Set<A>
```

Returns every element of either set.

**Parameters**

  - `other` — the other set

**Returns**: the union

**Examples**

```kex
Set.from([1, 2]).union(Set.from([2, 3]))   # => Set(1, 2, 3)
```

_Collecting every tag used across posts_

```kex
posts.reduce(Set.empty) { |all, p| all.union(Set.from(p.tags)) }
```

#### `intersect`

```kex
intersect(other: Set<A>) -> Set<A>
```

Returns the elements both sets have.

**Parameters**

  - `other` — the other set

**Returns**: the intersection

**Examples**

```kex
Set.from([1, 2, 3]).intersect(Set.from([2, 3, 4]))   # => Set(2, 3)
Set.from([1]).intersect(Set.from([2]))               # => Set()
```

_Which requested permissions the user actually has_

```kex
requested.intersect(granted)
```

#### `difference`

```kex
difference(other: Set<A>) -> Set<A>
```

Returns the elements of this set that `other` does not have.

`a.difference(b)` and `b.difference(a)` differ. `symmetricDifference` gives the elements in either one.

**Parameters**

  - `other` — the set to subtract

**Returns**: the elements only this set has

**Examples**

```kex
Set.from([1, 2, 3]).difference(Set.from([2]))   # => Set(1, 3)
```

_Which required fields are still missing_

```kex
required.difference(Set.from(form.keys))
```

#### `symmetricDifference`

```kex
symmetricDifference(other: Set<A>) -> Set<A>
```

Returns the elements that are in exactly one of the two sets.

**Parameters**

  - `other` — the other set

**Returns**: the symmetric difference

**Examples**

```kex
Set.from([1, 2]).symmetricDifference(Set.from([2, 3]))   # => Set(1, 3)
```

_What changed between two snapshots_

```kex
before.symmetricDifference(after)
```

#### `subset?`

```kex
subset?(other: Set<A>) -> Bool
```

Returns `true` when every element of this set is also in `other`. The empty set is a subset of everything.

**Parameters**

  - `other` — the candidate superset

**Returns**: `true` when this set is contained in `other`

**Examples**

```kex
Set.from([1, 2]).subset?(Set.from([1, 2, 3]))   # => true
Set.from([1, 9]).subset?(Set.from([1, 2, 3]))   # => false
```

_An authorisation check_

```kex
required.subset?(granted)
```

#### `superset?`

```kex
superset?(other: Set<A>) -> Bool
```

Returns `true` when this set has every element of `other`; the reverse of `subset?`.

**Parameters**

  - `other` — the candidate subset

**Returns**: `true` when this set contains all of `other`

**Examples**

```kex
Set.from([1, 2, 3]).superset?(Set.from([1, 2]))   # => true
Set.from([1, 2]).superset?(Set.from([1, 9]))      # => false
```

#### `disjoint?`

```kex
disjoint?(other: Set<A>) -> Bool
```

Returns `true` when the two sets share no element.

**Parameters**

  - `other` — the other set

**Returns**: `true` when the intersection is empty

**Examples**

```kex
Set.from([1, 2]).disjoint?(Set.from([3]))      # => true
Set.from([1, 2]).disjoint?(Set.from([2, 3]))   # => false
```

_Checking that two rulesets cannot both apply_

```kex
allowList.disjoint?(denyList)
```

#### `+`

```kex
+(other: Set<A>) -> Set<A>
+(other: [A]) -> Set<A>
```

Returns the union with another set or with a list.

The list form is a short way to add elements: +s + [x]+.

**Parameters**

  - `other` — the elements to add

**Returns**: the union

**Examples**

```kex
Set.from([1, 2]) + [3]           # => Set(1, 2, 3)
Set.from([1]) + Set.from([2])    # => Set(1, 2)
```

#### `-`

```kex
-(other: Set<A>) -> Set<A>
-(other: [A]) -> Set<A>
```

Returns this set without the elements of another set or of a list.

**Parameters**

  - `other` — the elements to remove

**Returns**: the difference

**Examples**

```kex
Set.from([1, 2, 3]) - [2]                # => Set(1, 3)
Set.from([1, 2, 3]) - Set.from([2, 3])   # => Set(1)
```

#### `map` (from Enumerable)

```kex
map(f: (A -> B)) -> Set<B>
```

Applies `f` to every element and returns a set of the results.

If `f` sends two elements to the same value, the result has it once, so the result can be smaller than the set.

**Parameters**

  - `f` — applied to each element

**Returns**: the distinct results

**Examples**

```kex
Set.from([1, 2, 3]).map { |x| x * 2 }   # => Set(2, 4, 6)
Set.from([1, -1]).map { |x| x.abs }     # => Set(1)
```

_Collecting the distinct extensions in a file list_

```kex
Set.from(paths).map { |p| p.split(".").last.or("") }
```

#### `filter` (from Enumerable)

```kex
filter(pred: (A -> Bool)) -> Set<A>
```

Returns a new set with only the elements `pred` accepts.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the matching elements

**Examples**

```kex
Set.from([1, 2, 3]).filter { |x| x > 1 }   # => Set(2, 3)
```

#### `reject`

```kex
reject(pred: (A -> Bool)) -> Set<A>
```

Returns a new set without the elements `pred` accepts.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the elements that failed the predicate

**Examples**

```kex
Set.from([1, 2, 3]).reject { |x| x > 1 }   # => Set(1)
```

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the set as `Set(...)`, with the elements in order.

**Returns**: the rendered set

**Examples**

```kex
Set.from([2, 1]).showValue   # => "Set(1, 2)"
```

#### `blank?` (from Blankable)

```kex
blank? -> Bool
```

Returns `true` when the set has no elements, as `empty?` does. This makes a set `Blankable`, so code that tests strings with `blank?` can test sets.

**Returns**: `true` for the empty set

**Examples**

```kex
Set.empty.blank?         # => true
Set.from([1]).blank?     # => false
```

### From [`Enumerable`](../enumerable.md#trait-enumerable)

  - [`mapIndexed`](../enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and returns the results as a list.
  - [`into`](../enumerable.md#enumerable-into) — Applies `f`, which returns a list, to each item and concatenates the results.
  - [`collect`](../enumerable.md#enumerable-collect) — Applies `f`, which returns an `Optional`, to each item and returns the present values, unwrapped.

### From [`Foldable`](../enumerable.md#trait-foldable)

  - [`each`](../enumerable.md#foldable-each) — Calls `f` with each item, for its side effects.
  - [`eachIndexed`](../enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](../enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`, and `true` for an empty collection.
  - [`any?`](../enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`, and `false` for an empty collection.
  - [`none?`](../enumerable.md#foldable-none?) — Returns `true` when no item satisfies `pred`, the opposite of `any?`.
  - [`one?`](../enumerable.md#foldable-one?) — Returns `true` when exactly one item satisfies `pred`.
  - [`find`](../enumerable.md#foldable-find) — Returns the first item satisfying `pred`, or `None` when nothing does.

### From [`Monoid`](../algebra.md#trait-monoid)

  - [`repeat`](../algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Showable`](../kex.md#trait-showable)

  - [`to`](../kex.md#showable-to) — 

## record `UnorderedSet<A>`

A set stored as a map from each element to `true`.

Build one with `UnorderedSet.from`. Iteration follows the map's internal order, so use `items.sort` when you need a stable order.

```kex
UnorderedSet.from([3, 1, 2]).contains?(2)   # => true
```

**Fields**

  - `slots` : {A: [Bool](../truthyable.md#make-bool)} (optional)

Implements [`Enumerable<A>`](../enumerable.md#trait-enumerable), [`Foldable<A>`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Functions

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds over the elements in unspecified order.

Use a `Set` when the order of the fold matters.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each element

**Returns**: the final accumulator

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `identity` (from Monoid)

```kex
identity -> UnorderedSet<A>
```

Returns the empty unordered set, the `Monoid` identity for union.

**Returns**: the empty set

#### `combine` (from Monoid)

```kex
combine(other: UnorderedSet<A>) -> UnorderedSet<A>
```

Returns the union of the two sets. This is the `Monoid` operation.

**Parameters**

  - `other` — the set to combine with

**Returns**: every element of either set

#### `contains?`

```kex
contains?(value: A) -> Bool
```

Returns `true` when `value` is a member.

This is a map lookup.

**Parameters**

  - `value` — the element to look for

**Returns**: `true` when it is present

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).contains?(2)   # => true
UnorderedSet.from([1, 2, 3]).contains?(9)   # => false
```

#### `count` (from Foldable)

```kex
count -> Integer
```

Returns the number of distinct elements.

**Returns**: the number of elements

**Examples**

```kex
UnorderedSet.from([1, 1, 2]).count   # => 2
```

#### `empty?`

```kex
empty? -> Bool
```

Returns `true` when the set has no elements.

**Returns**: `true` for the empty set

**Examples**

```kex
UnorderedSet.empty.empty?   # => true
```

#### `items`

```kex
items -> [A]
```

Returns the elements as a list, in unspecified order.

Sort the result when you need a stable order, as in a test.

**Returns**: the elements

**Examples**

```kex
UnorderedSet.from([3, 1, 2]).items.sort   # => [1, 2, 3]
```

#### `add`

```kex
add(value: A) -> UnorderedSet<A>
```

Returns a new set with `value` added. Adding an existing member changes nothing.

Use `add!` to rebind the receiver variable.

**Parameters**

  - `value` — the element to add

**Returns**: a set including `value`

**Examples**

```kex
UnorderedSet.from([1]).add(2).count   # => 2
UnorderedSet.from([1]).add(1).count   # => 1
```

#### `delete`

```kex
delete(value: A) -> UnorderedSet<A>
```

Returns a new set without `value`. Removing a non-member changes nothing.

Use `delete!` to rebind the receiver variable.

**Parameters**

  - `value` — the element to remove

**Returns**: a set without `value`

**Examples**

```kex
UnorderedSet.from([1, 2]).delete(1).count   # => 1
```

#### `union`

```kex
union(other: UnorderedSet<A>) -> UnorderedSet<A>
```

Returns every element of either set.

**Parameters**

  - `other` — the other set

**Returns**: the union

**Examples**

```kex
UnorderedSet.from([1, 2]).union(UnorderedSet.from([2, 3])).count   # => 3
```

#### `intersect`

```kex
intersect(other: UnorderedSet<A>) -> UnorderedSet<A>
```

Returns the elements both sets have.

**Parameters**

  - `other` — the other set

**Returns**: the intersection

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).intersect(UnorderedSet.from([2, 3, 4])).items.sort
# => [2, 3]
```

#### `difference`

```kex
difference(other: UnorderedSet<A>) -> UnorderedSet<A>
```

Returns the elements of this set that `other` does not have.

**Parameters**

  - `other` — the set to subtract

**Returns**: the elements only this set has

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).difference(UnorderedSet.from([2])).items.sort
# => [1, 3]
```

#### `symmetricDifference`

```kex
symmetricDifference(other: UnorderedSet<A>) -> UnorderedSet<A>
```

Returns the elements in exactly one of the two sets.

**Parameters**

  - `other` — the other set

**Returns**: the symmetric difference

**Examples**

```kex
UnorderedSet.from([1, 2]).symmetricDifference(UnorderedSet.from([2, 3])).items.sort
# => [1, 3]
```

#### `subset?`

```kex
subset?(other: UnorderedSet<A>) -> Bool
```

Returns `true` when every element of this set is also in `other`.

**Parameters**

  - `other` — the candidate superset

**Returns**: `true` when this set is contained in `other`

**Examples**

```kex
UnorderedSet.from([1, 2]).subset?(UnorderedSet.from([1, 2, 3]))   # => true
```

#### `superset?`

```kex
superset?(other: UnorderedSet<A>) -> Bool
```

Returns `true` when this set has every element of `other`.

**Parameters**

  - `other` — the candidate subset

**Returns**: `true` when this set contains all of `other`

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).superset?(UnorderedSet.from([1, 2]))   # => true
```

#### `disjoint?`

```kex
disjoint?(other: UnorderedSet<A>) -> Bool
```

Returns `true` when the two sets share no element.

**Parameters**

  - `other` — the other set

**Returns**: `true` when the intersection is empty

**Examples**

```kex
UnorderedSet.from([1, 2]).disjoint?(UnorderedSet.from([3]))   # => true
```

#### `+`

```kex
+(other: UnorderedSet<A>) -> UnorderedSet<A>
+(other: [A]) -> UnorderedSet<A>
```

Returns the union with another unordered set or with a list.

**Parameters**

  - `other` — the elements to add

**Returns**: the union

**Examples**

```kex
(UnorderedSet.from([1, 2]) + [3]).count   # => 3
```

#### `-`

```kex
-(other: UnorderedSet<A>) -> UnorderedSet<A>
-(other: [A]) -> UnorderedSet<A>
```

Returns this set without the elements of another unordered set or of a list.

**Parameters**

  - `other` — the elements to remove

**Returns**: the difference

**Examples**

```kex
(UnorderedSet.from([1, 2, 3]) - [2]).count   # => 2
```

#### `map` (from Enumerable)

```kex
map(f: (A -> B)) -> UnorderedSet<B>
```

Applies `f` to every element and returns an unordered set of the results. Elements that map to the same value collapse into one.

**Parameters**

  - `f` — applied to each element

**Returns**: the distinct results

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).map { |x| x * 2 }.items.sort   # => [2, 4, 6]
```

#### `filter` (from Enumerable)

```kex
filter(pred: (A -> Bool)) -> UnorderedSet<A>
```

Returns a new unordered set with only the elements `pred` accepts.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the matching elements

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).filter { |x| x > 1 }.items.sort   # => [2, 3]
```

#### `reject`

```kex
reject(pred: (A -> Bool)) -> UnorderedSet<A>
```

Returns a new unordered set without the elements `pred` accepts.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the elements that failed the predicate

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).reject { |x| x > 1 }.items   # => [1]
```

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the set as `UnorderedSet(...)`.

The elements are printed sorted, so the same set always prints the same.

**Returns**: the rendered set

**Examples**

```kex
UnorderedSet.from([2, 1]).showValue    # => "UnorderedSet(1, 2)"
UnorderedSet.from([10, 2]).showValue   # => "UnorderedSet(2, 10)"
```

#### `blank?` (from Blankable)

```kex
blank? -> Bool
```

Returns `true` when the set has no elements, as `empty?` does.

**Returns**: `true` for the empty set

**Examples**

```kex
UnorderedSet.empty.blank?   # => true
```

### From [`Enumerable`](../enumerable.md#trait-enumerable)

  - [`mapIndexed`](../enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and returns the results as a list.
  - [`into`](../enumerable.md#enumerable-into) — Applies `f`, which returns a list, to each item and concatenates the results.
  - [`collect`](../enumerable.md#enumerable-collect) — Applies `f`, which returns an `Optional`, to each item and returns the present values, unwrapped.

### From [`Foldable`](../enumerable.md#trait-foldable)

  - [`each`](../enumerable.md#foldable-each) — Calls `f` with each item, for its side effects.
  - [`eachIndexed`](../enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](../enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`, and `true` for an empty collection.
  - [`any?`](../enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`, and `false` for an empty collection.
  - [`none?`](../enumerable.md#foldable-none?) — Returns `true` when no item satisfies `pred`, the opposite of `any?`.
  - [`one?`](../enumerable.md#foldable-one?) — Returns `true` when exactly one item satisfies `pred`.
  - [`find`](../enumerable.md#foldable-find) — Returns the first item satisfying `pred`, or `None` when nothing does.

### From [`Monoid`](../algebra.md#trait-monoid)

  - [`repeat`](../algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Showable`](../kex.md#trait-showable)

  - [`to`](../kex.md#showable-to) — 

## module `Data.Set`

Constructors for the sorted `Set`.

### `from`

```kex
from(items: [A]) -> Set<A>
```

Builds a sorted set from a list, discarding duplicates.

**Parameters**

  - `items` — the elements, in any order and with any duplicates

**Returns**: the distinct elements, sorted

**Examples**

```kex
Set.from([3, 1, 2, 3])    # => Set(1, 2, 3)
Set.from("hello".chars)   # => Set(e, h, l, o)
```

_Removing duplicates from a list_

```kex
Set.from(["b", "a", "b"]).items   # => ["a", "b"]
```

### `empty` (constant)

```kex
empty : Set<A>
```

Returns the empty set, the `Monoid` identity: `s.combine(Set.empty)` is `s`.

**Examples**

```kex
Set.empty.empty?   # => true
Set.empty.add(1)   # => Set(1)
```



## module `Data.UnorderedSet`

Constructors for the hash-backed `UnorderedSet`.

### `from`

```kex
from(items: [A]) -> UnorderedSet<A>
```

Builds an unordered set from a list, discarding duplicates.

Unlike `Set.from`, this does not need the elements to be `Comparable`.

**Parameters**

  - `items` — the elements, in any order and with any duplicates

**Returns**: the distinct elements

**Examples**

```kex
UnorderedSet.from([3, 1, 2, 3]).count   # => 3
```

_A fast membership test over a large list_

```kex
let stopWords = UnorderedSet.from(["the", "a", "of"])
words.reject { |w| stopWords.contains?(w) }
```

### `empty` (constant)

```kex
empty : UnorderedSet<A>
```

Returns the empty unordered set, the `Monoid` identity.

**Examples**

```kex
UnorderedSet.empty.empty?   # => true
```


