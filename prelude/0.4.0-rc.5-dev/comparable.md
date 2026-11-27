---
package: prelude
version: "0.4.0-rc.5-dev"
source: comparable.kex
title: Comparable
entities:
  - { kind: type, name: "Ordering" }
  - { kind: trait, name: "Comparable" }
  - { kind: make, name: "Number" }
  - { kind: make, name: "String" }
  - { kind: make, name: "Ordering" }
---

# Comparable

Comparison: the `Ordering` a comparison returns, and the `Comparable` trait for types with a total order.

Orderings chain, which is how to compare on several keys without nested +if+s:

```kex
a.age.compare(b.age).thenBy { a.score.compare(b.score) }
```

`Ordering` is also a `Monoid` in which the first decisive result wins, so orderings combine with `combine`.

## type `Ordering`

The result of a comparison: `Less`, `Equal` or `Greater`.

**Variants**

  - `Less`
  - `Equal`
  - `Greater`

Implements [`Monoid`](algebra.md#trait-monoid).

### Functions

`Ordering` is a `Monoid` in which the first decisive result wins and `Equal` is the identity, so a comparison on several keys chains:

```kex
a.name.compare(b.name).combine(a.age.compare(b.age))
```

`combine` evaluates its argument even when the first comparison already decided; `thenBy` does not.

#### `identity` (from Monoid)

```kex
identity -> Ordering
```

Returns `Equal`, the identity: an undecided comparison lets the next one decide.

**Returns**: `Equal`

#### `combine` (from Monoid)

```kex
combine(other: Ordering) -> Ordering
```

Returns the first decisive ordering: this one if it is not `Equal`, otherwise `other`.

`other` is always evaluated, even when this ordering already decides. Use `thenBy` when the tie-breaker is expensive.

**Parameters**

  - `other` — the tie-breaking ordering

**Returns**: the first decisive ordering

**Examples**

```kex
Equal.combine(Less)     # => Less
Less.combine(Greater)   # => Less
```

_Sorting by surname, then by first name_

```kex
a.last.compare(b.last).combine(a.first.compare(b.first))
```

#### `reverse`

```kex
reverse -> Ordering
```

Returns the opposite ordering: `Less` becomes `Greater`, `Greater` becomes `Less`, and `Equal` stays `Equal`.

Use it to turn an ascending comparison into a descending one.

**Returns**: the reversed ordering

**Examples**

```kex
Less.reverse      # => Greater
Greater.reverse   # => Less
Equal.reverse     # => Equal
```

_Sorting newest first_

```kex
a.created.compare(b.created).reverse
```

#### `thenBy`

```kex
thenBy(tieBreaker: Block<Ordering>) -> Ordering
```

Returns this ordering if it is decisive, otherwise the result of calling `tieBreaker`.

Unlike `combine`, it runs the block only when this ordering is `Equal`. Prefer it when the tie-breaker is more than a field read.

**Parameters**

  - `tieBreaker` — evaluated only on a tie

**Returns**: the first decisive ordering

**Examples**

```kex
Equal.thenBy { 2.compare(1) }   # => Greater
Less.thenBy { 2.compare(1) }    # => Less
```

_Sorting by age, then by an expensive score_

```kex
a.age.compare(b.age).thenBy { score(a).compare(score(b)) }
```

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

## trait `Comparable`

Types that have a total order.

`Number` (both `Integer` and `Float`), `String` and `Measure` implement it. A type that implements `compare` gets `max`, `min`, `clamp` and the operators `<`, `>`, `<=` and `>=`.

Implemented by [`Number`](#make-number), [`String`](#make-string), [`Version`](kex.md#make-version), [`Measure<D>`](units.md#make-measure).

### Required functions

#### `compare`

```kex
compare(other: This) -> Ordering
```

Compares this value with `other`, returning `Less`, `Equal` or `Greater`.

`==` does not use it, since a type can be equatable without being ordered.

**Parameters**

  - `other` — the value to compare against

**Returns**: how this value orders against `other`

**Examples**

```kex
1.compare(2)     # => Less
2.compare(2)     # => Equal
3.compare(2)     # => Greater
```

_Sorting with an explicit comparison_

```kex
people.sort { |a, b| a.age.compare(b.age) == Less }
```

### Provided functions

#### `max`

```kex
max(other: This) -> This
```

Returns the larger of this value and `other`, or this value when they are equal.

`max(3, 7)` and `3.max(7)` are the same call.

**Parameters**

  - `other` — the value to compare against

**Returns**: the larger of the two

**Examples**

```kex
max(3, 7)             # => 7
1.5.max(2.5)          # => 2.5
"pear".max("apple")   # => "pear"
```

#### `min`

```kex
min(other: This) -> This
```

Returns the smaller of this value and `other`, or this value when they are equal.

**Parameters**

  - `other` — the value to compare against

**Returns**: the smaller of the two

**Examples**

```kex
min(3, 7)             # => 3
"pear".min("apple")   # => "apple"
```

#### `clamp`

```kex
clamp(low: This, high: This) -> This
```

Returns this value limited to `low`..`high`: `low` when it is below, `high` when it is above, and the value itself otherwise.

**Parameters**

  - `low` — the smallest value allowed
  - `high` — the largest value allowed

**Returns**: the value, clamped into `low` to `high`

**Examples**

```kex
15.clamp(0, 10)      # => 10
(-3).clamp(0, 10)    # => 0
0.5.clamp(0.0, 1.0)  # => 0.5
```

#### `<`

```kex
<(other: This) -> Bool
```

Returns `true` when this value orders before `other`.

Defined from `compare`, so a record that implements `Comparable` can use `<`, `>`, `<=` and `>=`.

**Parameters**

  - `other` — the value to compare against

**Returns**: whether this value orders before `other`

**Examples**

_A record ordered by one field_

```kex
record Grade do
  level : Integer
end

make Grade, implement: Comparable do
  let compare(other: Grade) -> Ordering = @level.compare(other.level)
end

Grade { level: 1 } < Grade { level: 2 }   # => true
```

#### `>`

```kex
>(other: This) -> Bool
```

Returns `true` when this value orders after `other`.

**Parameters**

  - `other` — the value to compare against

**Returns**: whether this value orders after `other`

#### `<=`

```kex
<=(other: This) -> Bool
```

Returns `true` when this value orders before `other` or equal to it.

**Parameters**

  - `other` — the value to compare against

**Returns**: whether this value orders before `other` or with it

#### `>=`

```kex
>=(other: This) -> Bool
```

Returns `true` when this value orders after `other` or equal to it.

**Parameters**

  - `other` — the value to compare against

**Returns**: whether this value orders after `other` or with it



## extends `Number`

More functions for [`Number`](number.md#make-number), added by this module.

Implements [`Comparable`](#trait-comparable).

Numbers compare by value, `Integer` and `Float` alike.

### `compare` (from Comparable)

```kex
compare(other: Number) -> Ordering
```

Compares two numbers by value, also across `Integer` and `Float`, so `1.compare(1.0)` is `Equal`.

**Parameters**

  - `other` — the number to compare against

**Returns**: how this number orders against `other`

**Examples**

```kex
1.compare(2)      # => Less
1.compare(1.0)    # => Equal
2.5.compare(2)    # => Greater
```

## extends `String`

More functions for [`String`](string.md#make-string), added by this module.

Implements [`Comparable`](#trait-comparable).

Strings order character by character, by codepoint.

### `compare` (from Comparable)

```kex
compare(other: String) -> Ordering
```

Compares this string with `other` character by character, by codepoint, the order `<` and `>` use.

**Parameters**

  - `other` — the string to compare against

**Returns**: how this string orders against `other`

**Examples**

```kex
"apple".compare("banana")   # => Less
"kex".compare("kex")        # => Equal
"cherry".compare("apple")   # => Greater
```
