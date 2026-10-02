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
  - { kind: make, name: "UnorderedSet<A>" }
---

# Set

Sets are immutable collections of distinct elements. Mutation methods (suffixed `!`) return a new set and rebind the receiver variable — they do not modify in place. Membership is structural equality, the same equality `==` and Map keys use, so records and tuples are compared by value. `==` between two sets needs no overload of its own for the same reason: each flavour keeps its backing canonical — sorted and duplicate free, or a map — so comparing the records structurally already IS set equality.

Two flavours, differing only in how they store their elements:

```kex
Set           sorted, so iteration is in ascending element order and the
              elements must be Orderable.
UnorderedSet  hash-backed, so membership does not pay for ordering and
              the elements need only be comparable. Iteration order is
              unspecified — never write a test against it.
```

Both wrap structures the runtime already has (a list and a map), so no set is opaque: `.items` is always a real list you can hand to anything.

Those two backings are also the ones the BEAM's own set libraries use — a `Set` is laid out exactly like an `ordsets` term and an `UnorderedSet` exactly like a `sets` v2 term — so the operations here can be routed to the native BIFs later without changing what a set IS. What rules out adopting `gb_sets` instead is the other backend: a tree-walk interpreter cannot produce an opaque BEAM term, and a set that only one backend can build is not a set the prelude can offer.

## record `Set<A>`

The invariant every Set method preserves: `items` is sorted and duplicate free. Build one with `Set.from` rather than by hand — the record literal does no deduplication. Reading `.items` back is the field itself, so handing a set's elements to list code costs nothing:

```kex
Set.from([3, 1, 2]).items   # => [1, 2, 3]
```

**Fields**

  - `items` : [A] (optional)

Implements [`Enumerable`](enumerable.md#trait-enumerable), [`Foldable`](enumerable.md#trait-foldable), [`Monoid`](algebra.md#trait-monoid), [`Showable`](kex.md#trait-showable), [`Blankable`](blankable.md#trait-blankable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc, f)
```

Enumerable primitive: fold over the elements in ascending order. Collection-producing operations come from Enumerable and traversal queries from Foldable; the set-returning ones are overridden below, because Enumerable's defaults answer with a list.

#### `identity` (from Monoid)

Sets form a Monoid under union.

#### `combine` (from Monoid)

```kex
combine(other)
```

#### `contains?`

```kex
contains?(value: A) -> Bool
```

Returns `true` if `value` is a member.

**Examples**

```kex
Set.from([1, 2, 3]).contains?(2)   # => true
```

#### `count` (from Foldable)

```kex
count : Integer
```

The number of distinct elements.

**Examples**

```kex
Set.from([1, 1, 2]).count   # => 2
```

#### `empty?`

```kex
empty? : Bool
```

Returns `true` if the set has no elements.

#### `add`

```kex
add(value: A) -> Set<A>
```

Returns a new set with `value` added. No-op if it is already a member. Use `add!` to rebind the receiver variable.

**Examples**

```kex
Set.from([1, 2]).add(3)   # => Set(1, 2, 3)
```

#### `delete`

```kex
delete(value: A) -> Set<A>
```

Returns a new set without `value`. No-op if it is not a member. Use `delete!` to rebind the receiver variable.

**Examples**

```kex
Set.from([1, 2, 3]).delete(2)   # => Set(1, 3)
```

#### `union`

```kex
union(other: Set<A>) -> Set<A>
```

Every element of either set.

**Examples**

```kex
Set.from([1, 2]).union(Set.from([2, 3]))   # => Set(1, 2, 3)
```

#### `intersect`

```kex
intersect(other: Set<A>) -> Set<A>
```

The elements both sets share.

**Examples**

```kex
Set.from([1, 2, 3]).intersect(Set.from([2, 3, 4]))   # => Set(2, 3)
```

#### `difference`

```kex
difference(other: Set<A>) -> Set<A>
```

The elements of this set that `other` does not have.

**Examples**

```kex
Set.from([1, 2, 3]).difference(Set.from([2]))   # => Set(1, 3)
```

#### `symmetricDifference`

```kex
symmetricDifference(other: Set<A>) -> Set<A>
```

The elements in exactly one of the two sets.

**Examples**

```kex
Set.from([1, 2]).symmetricDifference(Set.from([2, 3]))   # => Set(1, 3)
```

#### `subset?`

```kex
subset?(other: Set<A>) -> Bool
```

Returns `true` if every element of this set is in `other`.

**Examples**

```kex
Set.from([1, 2]).subset?(Set.from([1, 2, 3]))   # => true
```

#### `superset?`

```kex
superset?(other: Set<A>) -> Bool
```

Returns `true` if this set has every element of `other`.

#### `disjoint?`

```kex
disjoint?(other: Set<A>) -> Bool
```

Returns `true` if the two sets share no element.

**Examples**

```kex
Set.from([1, 2]).disjoint?(Set.from([3]))   # => true
```

#### `+`

```kex
+(other: Set<A>) -> Set<A>
```

`+` unions, with either another set or a plain list — `xs + [y]` is the everyday way to add one element without naming a method.

**Examples**

```kex
Set.from([1, 2]) + [3]              # => Set(1, 2, 3)
Set.from([1]) + Set.from([2])       # => Set(1, 2)
```

#### `-`

```kex
-(other: Set<A>) -> Set<A>
```

`-` removes, taking either another set or a plain list.

**Examples**

```kex
Set.from([1, 2, 3]) - [2]           # => Set(1, 3)
```

#### `map` (from Enumerable)

```kex
map(f: (A -> B)) -> Set<B>
```

Set overrides the collection-returning HOFs: Enumerable's defaults answer with a list, and mapping a set should give back a set. `map` may collapse elements — `Set.from([1, -1]).map { |x| x.abs }` has one member, not two.

**Examples**

```kex
Set.from([1, 2, 3]).map { |x| x * 2 }        # => Set(2, 4, 6)
```

#### `filter` (from Enumerable)

```kex
filter(pred: (A -> Bool)) -> Set<A>
```

Returns a new set keeping only the elements `pred` accepts.

**Examples**

```kex
Set.from([1, 2, 3]).filter { |x| x > 1 }   # => Set(2, 3)
```

#### `reject`

```kex
reject(pred: (A -> Bool)) -> Set<A>
```

Returns a new set without the elements `pred` accepts.

#### `showValue` (from Showable)

```kex
showValue : String
```

Sets print as `Set(...)` in element order rather than exposing the record layout behind them.

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Transforms each item together with its 0-based position, collecting the results into a list.
  - [`flatMap`](enumerable.md#enumerable-flatmap) — Maps each item to a list and concatenates the results.
  - [`collect`](enumerable.md#enumerable-collect) — Maps each item through `f` (returning an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`each`](enumerable.md#foldable-each) — Applies `f` to each item for its side effects.
  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Applies `f` to each item together with its 0-based position, for side effects.
  - [`all?`](enumerable.md#foldable-all?) — True if every item satisfies `pred`.
  - [`any?`](enumerable.md#foldable-any?) — True if at least one item satisfies `pred`.
  - [`find`](enumerable.md#foldable-find) — The first item satisfying `pred` wrapped in Just, or None.

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `UnorderedSet<A>`

The invariant every UnorderedSet method preserves: `slots` maps each member to `true` and holds nothing else. Its keys ARE the elements.

**Fields**

  - `slots` : {A: [Bool](blankable.md#make-bool)} (optional)

Implements [`Enumerable`](enumerable.md#trait-enumerable), [`Foldable`](enumerable.md#trait-foldable), [`Monoid`](algebra.md#trait-monoid), [`Showable`](kex.md#trait-showable), [`Blankable`](blankable.md#trait-blankable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc, f)
```

Enumerable primitive: fold over the elements. The order is whatever the underlying map hands back — unspecified, and not to be relied on.

#### `identity` (from Monoid)

Unordered sets form a Monoid under union.

#### `combine` (from Monoid)

```kex
combine(other)
```

#### `contains?`

```kex
contains?(value: A) -> Bool
```

Returns `true` if `value` is a member. This is the operation the flavour exists for: a map lookup, with no ordering to maintain.

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).contains?(2)   # => true
```

#### `count` (from Foldable)

```kex
count : Integer
```

The number of distinct elements.

#### `empty?`

```kex
empty? : Bool
```

Returns `true` if the set has no elements.

#### `items`

```kex
items : [A]
```

The elements as a list, in unspecified order.

**Examples**

```kex
UnorderedSet.from([1, 2, 3]).items.sort   # => [1, 2, 3]
```

#### `add`

```kex
add(value: A) -> UnorderedSet<A>
```

Returns a new set with `value` added. Use `add!` to rebind the receiver.

#### `delete`

```kex
delete(value: A) -> UnorderedSet<A>
```

Returns a new set without `value`. Use `delete!` to rebind the receiver.

#### `union`

```kex
union(other: UnorderedSet<A>) -> UnorderedSet<A>
```

Every element of either set.

#### `intersect`

```kex
intersect(other: UnorderedSet<A>) -> UnorderedSet<A>
```

The elements both sets share.

#### `difference`

```kex
difference(other: UnorderedSet<A>) -> UnorderedSet<A>
```

The elements of this set that `other` does not have.

#### `symmetricDifference`

```kex
symmetricDifference(other: UnorderedSet<A>) -> UnorderedSet<A>
```

The elements in exactly one of the two sets.

#### `subset?`

```kex
subset?(other: UnorderedSet<A>) -> Bool
```

Returns `true` if every element of this set is in `other`.

#### `superset?`

```kex
superset?(other: UnorderedSet<A>) -> Bool
```

Returns `true` if this set has every element of `other`.

#### `disjoint?`

```kex
disjoint?(other: UnorderedSet<A>) -> Bool
```

Returns `true` if the two sets share no element.

#### `+`

```kex
+(other: UnorderedSet<A>) -> UnorderedSet<A>
```

`+` unions, with either another set or a plain list.

#### `-`

```kex
-(other: UnorderedSet<A>) -> UnorderedSet<A>
```

`-` removes, taking either another set or a plain list.

#### `map` (from Enumerable)

```kex
map(f: (A -> B)) -> UnorderedSet<B>
```

The collection-returning HOFs answer with a set, not a list.

#### `filter` (from Enumerable)

```kex
filter(pred: (A -> Bool)) -> UnorderedSet<A>
```

#### `reject`

```kex
reject(pred: (A -> Bool)) -> UnorderedSet<A>
```

#### `showValue` (from Showable)

```kex
showValue : String
```

Printed in sorted order where the elements allow it, so the rendering of a value is not at the mercy of map internals.

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Transforms each item together with its 0-based position, collecting the results into a list.
  - [`flatMap`](enumerable.md#enumerable-flatmap) — Maps each item to a list and concatenates the results.
  - [`collect`](enumerable.md#enumerable-collect) — Maps each item through `f` (returning an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`each`](enumerable.md#foldable-each) — Applies `f` to each item for its side effects.
  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Applies `f` to each item together with its 0-based position, for side effects.
  - [`all?`](enumerable.md#foldable-all?) — True if every item satisfies `pred`.
  - [`any?`](enumerable.md#foldable-any?) — True if at least one item satisfies `pred`.
  - [`find`](enumerable.md#foldable-find) — The first item satisfying `pred` wrapped in Just, or None.

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## module `Set`

### `from`

```kex
from(items: [A]) -> Set<A>
```

Builds a set from any list, discarding duplicates and sorting what is left. Deduplication goes through a Map rather than `List.uniq`: map keys are unique under exactly the structural equality a set wants, and each element costs one insertion instead of a scan of everything kept so far.

**Examples**

```kex
Set.from([3, 1, 2, 3])   # => Set(1, 2, 3)
Set.from("hello".chars)  # => Set('e', 'h', 'l', 'o')
```

### `empty` (constant)

```kex
empty : Set<A>
```

The empty set. Also the Monoid identity.

**Examples**

```kex
Set.empty.empty?   # => true
```



## module `UnorderedSet`

### `from`

```kex
from(items: [A]) -> UnorderedSet<A>
```

Builds an unordered set from any list, discarding duplicates. Nothing is sorted, so this does not require Orderable elements.

**Examples**

```kex
UnorderedSet.from([3, 1, 2, 3]).count   # => 3
```

### `empty` (constant)

```kex
empty : UnorderedSet<A>
```

The empty unordered set. Also the Monoid identity.


