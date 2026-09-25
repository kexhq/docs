---
package: prelude
version: "0.4.0-beta.4-dev"
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

Ordering and comparison: what a comparison answers, and the types that have a total order.

Kex traits do not inherit from one another, so concrete types explicitly implement every structure whose laws they satisfy.

The two things you meet in everyday code here. `Ordering` is what a comparison answers, and it composes. This is how a multi-key sort is written without nested +if+s:

```kex
a.age.compare(b.age).thenBy { a.score.compare(b.score) }
```

`Ordering` is also a `Monoid` under "first decision wins", which is what makes comparisons chain with `combine`; that conformance is declared here, beside the type it belongs to, rather than in `algebra.kex` with the `Monoid` trait.

## type `Ordering`

The result of a comparison: `Less`, `Equal` or `Greater`.

Declared here rather than only inside the interpreter so that `Ordering`, `Less`, `Equal` and `Greater` reach the semantic layer the same way every other stdlib type does (through the collected interfaces) instead of existing solely as native environment bindings the type checker and name resolver cannot see.

**Variants**

  - `Less`
  - `Equal`
  - `Greater`

Implements [`Monoid`](algebra.md#trait-monoid).

### Methods

`Ordering` is a Monoid under "first decision wins", with Equal as identity. That is what makes multi-key comparison compose instead of nesting ifs:

```kex
a.name.compare(b.name).combine(a.age.compare(b.age))
```

`combine` evaluates its argument eagerly, so the later comparison runs even when the earlier one already decided. Use `thenBy` when that matters.

#### `identity` (from Monoid)

`Equal` is the neutral element, since an undecided comparison lets the next one decide.

**Returns**: `Ordering` — `Equal`

#### `combine` (from Monoid)

```kex
combine(other: Ordering, other: Ordering) -> Ordering
```

Returns the first decisive ordering: this one if it is not `Equal`, otherwise `other`.

This is what makes multi-key comparison compose. Note that `other` is evaluated eagerly, so the later comparison runs even when the earlier one has already decided: use `thenBy` when that matters.

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
reverse : Ordering
```

Returns the opposite ordering: `Less` becomes `Greater`, `Greater` becomes `Less`, and `Equal` stays `Equal`.

The one-word way to turn an ascending comparison into a descending one.

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

The short-circuiting form of `combine`: the block runs only when this comparison is `Equal`, so a tie-breaker costs nothing once the order is already decided. Prefer it whenever the tie-breaker is more than a field read.

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

Implemented by `Number`, which covers both `Integer` and `Float`, and by `String`.

Implemented by [`Number`](#make-number), [`String`](#make-string).

### Required methods

#### `compare`

```kex
compare(other: This) -> Ordering
```

Compares this value with `other` and answers `Less`, `Equal` or `Greater`.

`==` stays independent of this: a type may be equatable without being ordered.

A total order: `compare` answers Less, Equal or Greater. `==` stays independent: a type may be Equatable without being ordered.

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



## extends `Number`

More methods of [`Number`](number.md#), added by this module.

Implements [`Comparable`](#trait-comparable).

Number carries the implementation, so Integer and Float both inherit it rather than repeating the same three comparisons. Mixed receivers work because `<` and `>` promote across the two (`1.compare(1.0)` is Equal).

### `compare` (from Comparable)

```kex
compare(other: Number) -> Ordering
```

Compares two numbers, across the `Integer`/`Float` boundary.

Mixed receivers work because `<` and `>` promote across the two, so `1.compare(1.0)` is `Equal`.

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

More methods of [`String`](string.md#make-string), added by this module.

Implements [`Comparable`](#trait-comparable).

Strings order lexicographically, character by character, by code point — the same order `<` and `>` already give them.

### `compare` (from Comparable)

```kex
compare(other: String) -> Ordering
```

Compares this string with `other` lexicographically, the same order `<` and `>` give strings.

**Parameters**

  - `other` — the string to compare against

**Returns**: how this string orders against `other`

**Examples**

```kex
"apple".compare("banana")   # => Less
"kex".compare("kex")        # => Equal
"cherry".compare("apple")   # => Greater
```
