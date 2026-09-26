---
package: prelude
version: "0.4.0-beta.4-dev"
source: data/set.kex
title: Data.Set
entities:
  - { kind: module, name: "Data" }
---

# Data.Set

## module `Data`

Immutable collections of distinct elements.

Opt-in: nothing here is in scope until `using Data.Set`, which brings both flavours below into scope at once.

```kex
using Data.Set
```

Membership is decided by structural equality: the same equality `==` and map keys use, so records and tuples are compared by value, not identity. Every method answers with a new set; the `!` forms (`add!`, `delete!`) build a new set and rebind the receiver variable rather than modifying anything in place.

```kex
let tags = Set.from(["kex", "beam", "kex"])
tags.count                     # => 2
tags.contains?("beam")         # => true
tags.add("erlang").items       # => ["beam", "erlang", "kex"]
```

There are two flavours, differing only in how they store their elements:

```kex
Set           sorted, so iteration is in ascending element order and the
              elements must be Orderable.
UnorderedSet  hash-backed, so membership does not pay for ordering and
              the elements need only be comparable. Iteration order is
              unspecified: never write a test against it.
```

Reach for `Set` when you will read the elements back out, and for `UnorderedSet` when the set exists to answer `contains?` quickly.

`==` between two sets needs no overload of its own: each flavour keeps its backing canonical (sorted and duplicate free, or a map) so comparing the records structurally already IS set equality.

Both wrap structures the runtime already has (a list and a map), so no set is opaque: `.items` is always a real list you can hand to anything.

Those two backings are also the ones the BEAM's own set libraries use: a `Set` is laid out exactly like an `ordsets` term and an `UnorderedSet` exactly like a `sets` v2 term, so the operations here can be routed to the native BIFs later without changing what a set IS. What rules out adopting `gb_sets` instead is the other backend: a tree-walk interpreter cannot produce an opaque BEAM term, and a set that only one backend can build is not a set the prelude can offer.



## record `Set<A>`

A set whose elements are kept sorted and duplicate free.

Build one with `Set.from` rather than by hand: the record literal does no deduplication and no sorting, and every method here relies on both. Reading `items` back is the field itself, so handing a set's elements to list code costs nothing.

```kex
Set.from([3, 1, 2]).items   # => [1, 2, 3]
```

**Fields**

  - `items` : [A] (optional)

Implements [`Enumerable`](../enumerable.md#trait-enumerable), [`Foldable`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds over the elements in ascending order.

This is `Set`'s `Enumerable` primitive; `each`, `find`, `any?` and the rest are built on it. The collection-returning operations are overridden below, because `Enumerable`'s defaults answer with a list.

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
identity : Set<A>
```

The empty set: the `Monoid` identity, since union with nothing changes nothing.

**Returns**: the empty set

#### `combine` (from Monoid)

```kex
combine(other: Set<A>) -> Set<A>
```

Combines two sets by union. The `Monoid` operation.

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
methods.filter { |m| allowed.contains?(m.lowerCase) }
```

#### `count` (from Foldable)

```kex
count : Integer
```

Returns the number of distinct elements. Duplicates in the source list were already discarded, so this is the size of the set, not of what it was built from.

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
empty? : Bool
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

Returns a new set with `value` added. Adding an element that is already a member changes nothing: that is what makes a set a set.

Use `add!` to rebind the receiver variable.

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

Returns a new set without `value`. Removing something that is not a member changes nothing.

Use `delete!` to rebind the receiver variable.

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

Order matters: `a.difference(b)` and `b.difference(a)` are different questions. Use `symmetricDifference` when you want both answers.

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

Returns the elements in exactly one of the two sets: everything they do not agree on.

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

Returns `true` when this set has every element of `other`. The mirror image of `subset?`.

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

Unions with another set, or with a plain list.

The list form is the everyday way to add one element without naming a method: +s + [x]+.

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

Removes another set's elements, or a plain list's.

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

Mapping a set may collapse elements: if `f` sends two members to the same value, the result has one. That is not a loss of information so much as the point of a set: `Set.from([1, -1]).map(~abs)` has one member.

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

Returns a new set without the elements `pred` accepts. The complement of `filter`.

**Parameters**

  - `pred` — the test applied to each element

**Returns**: the elements that failed the predicate

**Examples**

```kex
Set.from([1, 2, 3]).reject { |x| x > 1 }   # => Set(1)
```

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders the set as `Set(...)` in element order, rather than exposing the record layout behind it.

**Returns**: the rendered set

**Examples**

```kex
Set.from([2, 1]).showValue   # => "Set(1, 2)"
```

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` when the set has no elements. The `Blankable` view of `empty?`, so generic code can test a set the same way it tests a string.

**Returns**: `true` for the empty set

**Examples**

```kex
Set.empty.blank?         # => true
Set.from([1]).blank?     # => false
```

### From [`Enumerable`](../enumerable.md#trait-enumerable)

  - [`mapIndexed`](../enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and collects the results into a list.
  - [`flatMap`](../enumerable.md#enumerable-flatmap) — Applies `f` to each item, expecting a list back, and concatenates the results into one flat list.
  - [`collect`](../enumerable.md#enumerable-collect) — Applies `f` to each item, expecting an `Optional` back, and returns the values that were present: unwrapped.

### From [`Foldable`](../enumerable.md#trait-foldable)

  - [`each`](../enumerable.md#foldable-each) — Calls `f` with each item, for its side effects.
  - [`eachIndexed`](../enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](../enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`.
  - [`any?`](../enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`.
  - [`find`](../enumerable.md#foldable-find) — Returns the first item satisfying `pred`, or `None` when nothing does.

### From [`Monoid`](../algebra.md#trait-monoid)

  - [`repeat`](../algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Showable`](../kex.md#trait-showable)

  - [`to`](../kex.md#showable-to) — 

## record `UnorderedSet<A>`

A set backed by a map from each member to `true`; its keys ARE the elements.

Build one with `UnorderedSet.from`. Iteration order is whatever the map hands back, so use `items.sort` when you need a stable order.

```kex
UnorderedSet.from([3, 1, 2]).contains?(2)   # => true
```

**Fields**

  - `slots` : {A: [Bool](../truthyable.md#make-bool)} (optional)

Implements [`Enumerable`](../enumerable.md#trait-enumerable), [`Foldable`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds over the elements.

The order is whatever the underlying map hands back: unspecified, and not to be relied on. Use a `Set` when the order of the fold matters.

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
identity : UnorderedSet<A>
```

The empty unordered set: the `Monoid` identity.

**Returns**: the empty set

#### `combine` (from Monoid)

```kex
combine(other: UnorderedSet<A>) -> UnorderedSet<A>
```

Combines two sets by union. The `Monoid` operation.

**Parameters**

  - `other` — the set to combine with

**Returns**: every element of either set

#### `contains?`

```kex
contains?(value: A) -> Bool
```

Returns `true` when `value` is a member.

This is the operation the flavour exists for: a map lookup, with no ordering to maintain.

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
count : Integer
```

Returns the number of distinct elements.

**Returns**: the number of elements

**Examples**

```kex
UnorderedSet.from([1, 1, 2]).count   # => 2
```

#### `empty?`

```kex
empty? : Bool
```

Returns `true` when the set has no elements.

**Returns**: `true` for the empty set

**Examples**

```kex
UnorderedSet.empty.empty?   # => true
```

#### `items`

```kex
items : [A]
```

Returns the elements as a list, in unspecified order.

Sort the result when the order has to be stable: a test, a rendering, a comparison.

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

Unions with another unordered set, or with a plain list.

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

Removes another unordered set's elements, or a plain list's.

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
showValue : String
```

Renders the set as `UnorderedSet(...)`.

The elements are printed in sorted order where they allow it, so the rendering of a value is not at the mercy of map internals.

**Returns**: the rendered set

**Examples**

```kex
UnorderedSet.from([2, 1]).showValue   # => "UnorderedSet(1, 2)"
```

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` when the set has no elements. The `Blankable` view of `empty?`.

**Returns**: `true` for the empty set

**Examples**

```kex
UnorderedSet.empty.blank?   # => true
```

### From [`Enumerable`](../enumerable.md#trait-enumerable)

  - [`mapIndexed`](../enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and collects the results into a list.
  - [`flatMap`](../enumerable.md#enumerable-flatmap) — Applies `f` to each item, expecting a list back, and concatenates the results into one flat list.
  - [`collect`](../enumerable.md#enumerable-collect) — Applies `f` to each item, expecting an `Optional` back, and returns the values that were present: unwrapped.

### From [`Foldable`](../enumerable.md#trait-foldable)

  - [`each`](../enumerable.md#foldable-each) — Calls `f` with each item, for its side effects.
  - [`eachIndexed`](../enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](../enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`.
  - [`any?`](../enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`.
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

This is the normal way to make a `Set`. Deduplication goes through a map rather than `List.uniq`: map keys are unique under exactly the structural equality a set wants, and each element costs one insertion instead of a scan of everything kept so far.

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

The set with no elements. Also the `Monoid` identity, so `s.combine(Set.empty)` is `s`.

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

Nothing is sorted, so unlike `Set.from` this does not require the elements to be `Orderable`.

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

The unordered set with no elements. Also the `Monoid` identity.

**Examples**

```kex
UnorderedSet.empty.empty?   # => true
```


