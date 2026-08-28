---
package: prelude
version: "0.4.0-alpha"
source: data/set.kex
title: Data
entities:
  - { kind: module, name: "Data" }
---

# Data

## module `Data`

Immutable collections of distinct elements.

Opt-in — nothing here is in scope until `using Data.Set`, which brings both flavours below into scope at once.

```kex
using Data.Set
```

Membership is decided by structural equality — the same equality `==` and map keys use — so records and tuples are compared by value, not identity. Every method answers with a new set; the `!` forms (`add!`, `delete!`) build a new set and rebind the receiver variable rather than modifying anything in place.

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
              unspecified — never write a test against it.
```

Reach for `Set` when you will read the elements back out, and for `UnorderedSet` when the set exists to answer `contains?` quickly.

`==` between two sets needs no overload of its own: each flavour keeps its backing canonical — sorted and duplicate free, or a map — so comparing the records structurally already IS set equality.

Both wrap structures the runtime already has (a list and a map), so no set is opaque: `.items` is always a real list you can hand to anything.

Those two backings are also the ones the BEAM's own set libraries use — a `Set` is laid out exactly like an `ordsets` term and an `UnorderedSet` exactly like a `sets` v2 term — so the operations here can be routed to the native BIFs later without changing what a set IS. What rules out adopting `gb_sets` instead is the other backend: a tree-walk interpreter cannot produce an opaque BEAM term, and a set that only one backend can build is not a set the prelude can offer.

## record `Set<A>`

A set whose elements are kept sorted and duplicate free.

Build one with `Set.from` rather than by hand — the record literal does no deduplication and no sorting, and every method here relies on both. Reading `items` back is the field itself, so handing a set's elements to list code costs nothing.

```kex
Set.from([3, 1, 2]).items   # => [1, 2, 3]
```

**Fields**

  - `items` : [A] (optional)

## record `UnorderedSet<A>`

A set backed by a map from each member to `true`; its keys ARE the elements.

Build one with `UnorderedSet.from`. Iteration order is whatever the map hands back, so use `items.sort` when you need a stable order.

```kex
UnorderedSet.from([3, 1, 2]).contains?(2)   # => true
```

**Fields**

  - `slots` : {A: Bool} (optional)

## module `Data.Set`

Constructors for the sorted `Set`.

## function `from`

Builds a sorted set from a list, discarding duplicates.

This is the normal way to make a `Set`. Deduplication goes through a map rather than `List.uniq`: map keys are unique under exactly the structural equality a set wants, and each element costs one insertion instead of a scan of everything kept so far.


```kex
from(items)
```


## constant `empty`

The set with no elements. Also the `Monoid` identity, so `s.combine(Set.empty)` is `s`.



## module `Data.UnorderedSet`

Constructors for the hash-backed `UnorderedSet`.

## function `from`

Builds an unordered set from a list, discarding duplicates.

Nothing is sorted, so unlike `Set.from` this does not require the elements to be `Orderable`.


```kex
from(items)
```


## constant `empty`

The unordered set with no elements. Also the `Monoid` identity.



## make `Set<A>` implements [Enumerable](../enumerable.md#trait-enumerable), [Foldable](../enumerable.md#trait-foldable), [Monoid](../algebra.md#trait-monoid), Showable


#### `reduce`

Folds over the elements in ascending order.

This is `Set`'s `Enumerable` primitive; `each`, `find`, `any?` and the rest are built on it. The collection-returning operations are overridden below, because `Enumerable`'s defaults answer with a list.

```kex
reduce(acc, f) : B -> (B -> A -> B) -> B
```

**Returns**: `B` — the final accumulator

**Examples**

```kex
Set.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `combine`

Combines two sets by union. The `Monoid` operation.

```kex
combine(other) : Set<A> -> Set<A>
```

**Returns**: `Set<A>` — every element of either set

**Examples**

_Merging many sets into one_

```kex
[Set.from([1]), Set.from([2]), Set.from([1, 3])]
  .reduce(Set.empty) { |acc, s| acc.combine(s) }
# => Set(1, 2, 3)
```

#### `contains?`

Returns `true` when `value` is a member.

```kex
contains?(value) : A -> Bool
```

**Returns**: `Bool` — `true` when it is present

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

#### `add`

Returns a new set with `value` added. Adding an element that is already a member changes nothing — that is what makes a set a set.

Use `add!` to rebind the receiver variable.

```kex
add(value) : A -> Set<A>
```

**Returns**: `Set<A>` — a set including `value`

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

Returns a new set without `value`. Removing something that is not a member changes nothing.

Use `delete!` to rebind the receiver variable.

```kex
delete(value) : A -> Set<A>
```

**Returns**: `Set<A>` — a set without `value`

**Examples**

```kex
Set.from([1, 2, 3]).delete(2)   # => Set(1, 3)
Set.from([1, 2, 3]).delete(9)   # => Set(1, 2, 3)
```

#### `union`

Returns every element of either set.

```kex
union(other) : Set<A> -> Set<A>
```

**Returns**: `Set<A>` — the union

**Examples**

```kex
Set.from([1, 2]).union(Set.from([2, 3]))   # => Set(1, 2, 3)
```
_Collecting every tag used across posts_

```kex
posts.reduce(Set.empty) { |all, p| all.union(Set.from(p.tags)) }
```

#### `intersect`

Returns the elements both sets have.

```kex
intersect(other) : Set<A> -> Set<A>
```

**Returns**: `Set<A>` — the intersection

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

Returns the elements of this set that `other` does not have.

Order matters: `a.difference(b)` and `b.difference(a)` are different questions. Use `symmetricDifference` when you want both answers.

```kex
difference(other) : Set<A> -> Set<A>
```

**Returns**: `Set<A>` — the elements only this set has

**Examples**

```kex
Set.from([1, 2, 3]).difference(Set.from([2]))   # => Set(1, 3)
```
_Which required fields are still missing_

```kex
required.difference(Set.from(form.keys))
```

#### `symmetricDifference`

Returns the elements in exactly one of the two sets — everything they do not agree on.

```kex
symmetricDifference(other) : Set<A> -> Set<A>
```

**Returns**: `Set<A>` — the symmetric difference

**Examples**

```kex
Set.from([1, 2]).symmetricDifference(Set.from([2, 3]))   # => Set(1, 3)
```
_What changed between two snapshots_

```kex
before.symmetricDifference(after)
```

#### `subset?`

Returns `true` when every element of this set is also in `other`. The empty set is a subset of everything.

```kex
subset?(other) : Set<A> -> Bool
```

**Returns**: `Bool` — `true` when this set is contained in `other`

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

Returns `true` when this set has every element of `other`. The mirror image of `subset?`.

```kex
superset?(other) : Set<A> -> Bool
```

**Returns**: `Bool` — `true` when this set contains all of `other`

**Examples**

```kex
Set.from([1, 2, 3]).superset?(Set.from([1, 2]))   # => true
Set.from([1, 2]).superset?(Set.from([1, 9]))      # => false
```

#### `disjoint?`

Returns `true` when the two sets share no element.

```kex
disjoint?(other) : Set<A> -> Bool
```

**Returns**: `Bool` — `true` when the intersection is empty

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

Unions with another set, or with a plain list.

The list form is the everyday way to add one element without naming a method: `s ` [x]`.

```kex
+(other) : Set<A> -> Set<A>
+(other) : [A] -> Set<A>
```

**Returns**: `Set<A>` — the union

**Examples**

```kex
Set.from([1, 2]) ` [3]           # => Set(1, 2, 3)
Set.from([1]) + Set.from([2])    # => Set(1, 2)
```

#### `-`

Removes another set's elements, or a plain list's.

```kex
-(other) : Set<A> -> Set<A>
-(other) : [A] -> Set<A>
```

**Returns**: `Set<A>` — the difference

**Examples**

```kex
Set.from([1, 2, 3]) - [2]                # => Set(1, 3)
Set.from([1, 2, 3]) - Set.from([2, 3])   # => Set(1)
```

#### `map`

Applies `f` to every element and returns a set of the results.

Mapping a set may collapse elements: if `f` sends two members to the same value, the result has one. That is not a loss of information so much as the point of a set — `Set.from([1, -1]).map(~abs)` has one member.

```kex
map(f) : (A -> B) -> Set<B>
```

**Returns**: `Set<B>` — the distinct results

**Examples**

```kex
Set.from([1, 2, 3]).map { |x| x * 2 }   # => Set(2, 4, 6)
Set.from([1, -1]).map { |x| x.abs }     # => Set(1)
```
_Collecting the distinct extensions in a file list_

```kex
Set.from(paths).map { |p| p.split(".").last.or("") }
```

#### `filter`

Returns a new set with only the elements `pred` accepts.

```kex
filter(pred) : (A -> Bool) -> Set<A>
```

**Returns**: `Set<A>` — the matching elements

**Examples**

```kex
Set.from([1, 2, 3]).filter { |x| x > 1 }   # => Set(2, 3)
```

#### `reject`

Returns a new set without the elements `pred` accepts. The complement of `filter`.

```kex
reject(pred) : (A -> Bool) -> Set<A>
```

**Returns**: `Set<A>` — the elements that failed the predicate

**Examples**

```kex
Set.from([1, 2, 3]).reject { |x| x > 1 }   # => Set(1)
```

## make `Set<A>` implements [Blankable](../blankable.md#trait-blankable)



## make `UnorderedSet<A>` implements [Enumerable](../enumerable.md#trait-enumerable), [Foldable](../enumerable.md#trait-foldable), [Monoid](../algebra.md#trait-monoid), Showable


#### `reduce`

Folds over the elements.

The order is whatever the underlying map hands back — unspecified, and not to be relied on. Use a `Set` when the order of the fold matters.

```kex
reduce(acc, f) : B -> (B -> A -> B) -> B
```

**Returns**: `B` — the final accumulator

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `combine`

Combines two sets by union. The `Monoid` operation.

```kex
combine(other) : UnorderedSet<A> -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — every element of either set

#### `contains?`

Returns `true` when `value` is a member.

This is the operation the flavour exists for: a map lookup, with no ordering to maintain.

```kex
contains?(value) : A -> Bool
```

**Returns**: `Bool` — `true` when it is present

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).contains?(2)   # => true
UnorderedSet.from([1, 2, 3]).contains?(9)   # => false
```

#### `add`

Returns a new set with `value` added. Adding an existing member changes nothing.

Use `add!` to rebind the receiver variable.

```kex
add(value) : A -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — a set including `value`

**Examples**

```kex
UnorderedSet.from([1]).add(2).count   # => 2
UnorderedSet.from([1]).add(1).count   # => 1
```

#### `delete`

Returns a new set without `value`. Removing a non-member changes nothing.

Use `delete!` to rebind the receiver variable.

```kex
delete(value) : A -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — a set without `value`

**Examples**

```kex
UnorderedSet.from([1, 2]).delete(1).count   # => 1
```

#### `union`

Returns every element of either set.

```kex
union(other) : UnorderedSet<A> -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the union

**Examples**

```kex
UnorderedSet.from([1, 2]).union(UnorderedSet.from([2, 3])).count   # => 3
```

#### `intersect`

Returns the elements both sets have.

```kex
intersect(other) : UnorderedSet<A> -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the intersection

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).intersect(UnorderedSet.from([2, 3, 4])).items.sort
# => [2, 3]
```

#### `difference`

Returns the elements of this set that `other` does not have.

```kex
difference(other) : UnorderedSet<A> -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the elements only this set has

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).difference(UnorderedSet.from([2])).items.sort
# => [1, 3]
```

#### `symmetricDifference`

Returns the elements in exactly one of the two sets.

```kex
symmetricDifference(other) : UnorderedSet<A> -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the symmetric difference

**Examples**

```kex
UnorderedSet.from([1, 2]).symmetricDifference(UnorderedSet.from([2, 3])).items.sort
# => [1, 3]
```

#### `subset?`

Returns `true` when every element of this set is also in `other`.

```kex
subset?(other) : UnorderedSet<A> -> Bool
```

**Returns**: `Bool` — `true` when this set is contained in `other`

**Examples**

```kex
UnorderedSet.from([1, 2]).subset?(UnorderedSet.from([1, 2, 3]))   # => true
```

#### `superset?`

Returns `true` when this set has every element of `other`.

```kex
superset?(other) : UnorderedSet<A> -> Bool
```

**Returns**: `Bool` — `true` when this set contains all of `other`

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).superset?(UnorderedSet.from([1, 2]))   # => true
```

#### `disjoint?`

Returns `true` when the two sets share no element.

```kex
disjoint?(other) : UnorderedSet<A> -> Bool
```

**Returns**: `Bool` — `true` when the intersection is empty

**Examples**

```kex
UnorderedSet.from([1, 2]).disjoint?(UnorderedSet.from([3]))   # => true
```

#### `+`

Unions with another unordered set, or with a plain list.

```kex
+(other) : UnorderedSet<A> -> UnorderedSet<A>
+(other) : [A] -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the union

**Examples**

```kex
(UnorderedSet.from([1, 2]) + [3]).count   # => 3
```

#### `-`

Removes another unordered set's elements, or a plain list's.

```kex
-(other) : UnorderedSet<A> -> UnorderedSet<A>
-(other) : [A] -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the difference

**Examples**

```kex
(UnorderedSet.from([1, 2, 3]) - [2]).count   # => 2
```

#### `map`

Applies `f` to every element and returns an unordered set of the results. Elements that map to the same value collapse into one.

```kex
map(f) : (A -> B) -> UnorderedSet<B>
```

**Returns**: `UnorderedSet<B>` — the distinct results

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).map { |x| x * 2 }.items.sort   # => [2, 4, 6]
```

#### `filter`

Returns a new unordered set with only the elements `pred` accepts.

```kex
filter(pred) : (A -> Bool) -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the matching elements

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).filter { |x| x > 1 }.items.sort   # => [2, 3]
```

#### `reject`

Returns a new unordered set without the elements `pred` accepts.

```kex
reject(pred) : (A -> Bool) -> UnorderedSet<A>
```

**Returns**: `UnorderedSet<A>` — the elements that failed the predicate

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).reject { |x| x > 1 }.items   # => [1]
```

## make `UnorderedSet<A>` implements [Blankable](../blankable.md#trait-blankable)


