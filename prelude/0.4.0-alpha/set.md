---
package: prelude
version: "0.4.0-alpha"
source: set.kex
title: Set
entities:
  - { kind: record, name: "Set" }
  - { kind: record, name: "UnorderedSet" }
  - { kind: module, name: "Set" }
  - { kind: module, name: "UnorderedSet" }
  - { kind: make, name: "Set<A>" }
  - { kind: make, name: "Set<A>" }
  - { kind: make, name: "UnorderedSet<A>" }
  - { kind: make, name: "UnorderedSet<A>" }
---

# Set

## record `Set<A>`

Sets are immutable collections of distinct elements. Mutation methods (suffixed `!`) return a new set and rebind the receiver variable — they do not modify in place. Membership is structural equality, the same equality `==` and Map keys use, so records and tuples are compared by value. `==` between two sets needs no overload of its own for the same reason: each flavour keeps its backing canonical — sorted and duplicate free, or a map — so comparing the records structurally already IS set equality.

Two flavours, differing only in how they store their elements:

  Set           sorted, so iteration is in ascending element order and the                 elements must be Orderable.   UnorderedSet  hash-backed, so membership does not pay for ordering and                 the elements need only be comparable. Iteration order is                 unspecified — never write a test against it.

Both wrap structures the runtime already has (a list and a map), so no set is opaque: `.items` is always a real list you can hand to anything.

Those two backings are also the ones the BEAM's own set libraries use — a `Set` is laid out exactly like an `ordsets` term and an `UnorderedSet` exactly like a `sets` v2 term — so the operations here can be routed to the native BIFs later without changing what a set IS. What rules out adopting `gb_sets` instead is the other backend: a tree-walk interpreter cannot produce an opaque BEAM term, and a set that only one backend can build is not a set the prelude can offer.

The invariant every Set method preserves: `items` is sorted and duplicate free. Build one with `Set.from` rather than by hand — the record literal does no deduplication. Reading `.items` back is the field itself, so handing a set's elements to list code costs nothing:

  Set.from([3, 1, 2]).items   # => [1, 2, 3]

**Fields**

  - `items` : [A] (optional)

## record `UnorderedSet<A>`

The invariant every UnorderedSet method preserves: `slots` maps each member to `true` and holds nothing else. Its keys ARE the elements.

**Fields**

  - `slots` : {A: Bool} (optional)

## module `Set`

## function `from`

Builds a set from any list, discarding duplicates and sorting what is left. Deduplication goes through a Map rather than `List.uniq`: map keys are unique under exactly the structural equality a set wants, and each element costs one insertion instead of a scan of everything kept so far.


```kex
from(items)
```


## constant `empty`

The empty set. Also the Monoid identity.



## module `UnorderedSet`

## function `from`

Builds an unordered set from any list, discarding duplicates. Nothing is sorted, so this does not require Orderable elements.


```kex
from(items)
```


## constant `empty`

The empty unordered set. Also the Monoid identity.



## make `Set<A>` implements [Enumerable](enumerable.md#trait-enumerable), [Foldable](enumerable.md#trait-foldable), [Monoid](algebra.md#trait-monoid), Showable


#### `reduce`

Enumerable primitive: fold over the elements in ascending order. Collection-producing operations come from Enumerable and traversal queries from Foldable; the set-returning ones are overridden below, because Enumerable's defaults answer with a list.

```kex
reduce(acc, f)
```

#### `combine`

```kex
combine(other)
```

#### `contains?`

Returns `true` if `value` is a member.

```kex
contains?(value) : A -> Bool
```

**Examples**

```kex
  Set.from([1, 2, 3]).contains?(2)   # => true
```

#### `add`

Returns a new set with `value` added. No-op if it is already a member. Use `add!` to rebind the receiver variable.

```kex
add(value) : A -> Set<A>
```

**Examples**

```kex
  Set.from([1, 2]).add(3)   # => Set(1, 2, 3)
```

#### `delete`

Returns a new set without `value`. No-op if it is not a member. Use `delete!` to rebind the receiver variable.

```kex
delete(value) : A -> Set<A>
```

**Examples**

```kex
  Set.from([1, 2, 3]).delete(2)   # => Set(1, 3)
```

#### `union`

Every element of either set.

```kex
union(other) : Set<A> -> Set<A>
```

**Examples**

```kex
  Set.from([1, 2]).union(Set.from([2, 3]))   # => Set(1, 2, 3)
```

#### `intersect`

The elements both sets share.

```kex
intersect(other) : Set<A> -> Set<A>
```

**Examples**

```kex
  Set.from([1, 2, 3]).intersect(Set.from([2, 3, 4]))   # => Set(2, 3)
```

#### `difference`

The elements of this set that `other` does not have.

```kex
difference(other) : Set<A> -> Set<A>
```

**Examples**

```kex
  Set.from([1, 2, 3]).difference(Set.from([2]))   # => Set(1, 3)
```

#### `symmetricDifference`

The elements in exactly one of the two sets.

```kex
symmetricDifference(other) : Set<A> -> Set<A>
```

**Examples**

```kex
  Set.from([1, 2]).symmetricDifference(Set.from([2, 3]))   # => Set(1, 3)
```

#### `subset?`

Returns `true` if every element of this set is in `other`.

```kex
subset?(other) : Set<A> -> Bool
```

**Examples**

```kex
  Set.from([1, 2]).subset?(Set.from([1, 2, 3]))   # => true
```

#### `superset?`

Returns `true` if this set has every element of `other`.

```kex
superset?(other) : Set<A> -> Bool
```

#### `disjoint?`

Returns `true` if the two sets share no element.

```kex
disjoint?(other) : Set<A> -> Bool
```

**Examples**

```kex
  Set.from([1, 2]).disjoint?(Set.from([3]))   # => true
```

#### `+`

``` unions, with either another set or a plain list — `xs ` [y]` is the everyday way to add one element without naming a method.

```kex
+(other)
```

**Examples**

```kex
  Set.from([1, 2]) ` [3]              # => Set(1, 2, 3)
  Set.from([1]) ` Set.from([2])       # => Set(1, 2)
```

#### `-`

`-` removes, taking either another set or a plain list.

```kex
-(other)
```

**Examples**

```kex
  Set.from([1, 2, 3]) - [2]           # => Set(1, 3)
```

#### `map`

Set overrides the collection-returning HOFs: Enumerable's defaults answer with a list, and mapping a set should give back a set. `map` may collapse elements — `Set.from([1, -1]).map { |x| x.abs }` has one member, not two.

```kex
map(f) : (A -> B) -> Set<B>
```

**Examples**

```kex
  Set.from([1, 2, 3]).map { |x| x * 2 }        # => Set(2, 4, 6)
```

#### `filter`

Returns a new set keeping only the elements `pred` accepts.

```kex
filter(pred) : (A -> Bool) -> Set<A>
```

**Examples**

```kex
  Set.from([1, 2, 3]).filter { |x| x > 1 }   # => Set(2, 3)
```

#### `reject`

Returns a new set without the elements `pred` accepts.

```kex
reject(pred) : (A -> Bool) -> Set<A>
```

## make `Set<A>` implements [Blankable](blankable.md#trait-blankable)



## make `UnorderedSet<A>` implements [Enumerable](enumerable.md#trait-enumerable), [Foldable](enumerable.md#trait-foldable), [Monoid](algebra.md#trait-monoid), Showable


#### `reduce`

Enumerable primitive: fold over the elements. The order is whatever the underlying map hands back — unspecified, and not to be relied on.

```kex
reduce(acc, f)
```

#### `combine`

```kex
combine(other)
```

#### `contains?`

Returns `true` if `value` is a member. This is the operation the flavour exists for: a map lookup, with no ordering to maintain.

```kex
contains?(value) : A -> Bool
```

**Examples**

```kex
  UnorderedSet.from([1, 2, 3]).contains?(2)   # => true
```

#### `add`

Returns a new set with `value` added. Use `add!` to rebind the receiver.

```kex
add(value) : A -> UnorderedSet<A>
```

#### `delete`

Returns a new set without `value`. Use `delete!` to rebind the receiver.

```kex
delete(value) : A -> UnorderedSet<A>
```

#### `union`

Every element of either set.

```kex
union(other) : UnorderedSet<A> -> UnorderedSet<A>
```

#### `intersect`

The elements both sets share.

```kex
intersect(other) : UnorderedSet<A> -> UnorderedSet<A>
```

#### `difference`

The elements of this set that `other` does not have.

```kex
difference(other) : UnorderedSet<A> -> UnorderedSet<A>
```

#### `symmetricDifference`

The elements in exactly one of the two sets.

```kex
symmetricDifference(other) : UnorderedSet<A> -> UnorderedSet<A>
```

#### `subset?`

Returns `true` if every element of this set is in `other`.

```kex
subset?(other) : UnorderedSet<A> -> Bool
```

#### `superset?`

Returns `true` if this set has every element of `other`.

```kex
superset?(other) : UnorderedSet<A> -> Bool
```

#### `disjoint?`

Returns `true` if the two sets share no element.

```kex
disjoint?(other) : UnorderedSet<A> -> Bool
```

#### `+`

`+` unions, with either another set or a plain list.

```kex
+(other)
```

#### `-`

`-` removes, taking either another set or a plain list.

```kex
-(other)
```

#### `map`

The collection-returning HOFs answer with a set, not a list.

```kex
map(f) : (A -> B) -> UnorderedSet<B>
```

#### `filter`

```kex
filter(pred) : (A -> Bool) -> UnorderedSet<A>
```

#### `reject`

```kex
reject(pred) : (A -> Bool) -> UnorderedSet<A>
```

## make `UnorderedSet<A>` implements [Blankable](blankable.md#trait-blankable)


