---
package: prelude
version: "0.3.1"
source: algebra.kex
title: Algebra
entities:
  - { kind: type, name: "Ordering" }
  - { kind: trait, name: "Comparable" }
  - { kind: make, name: "Number" }
  - { kind: trait, name: "Monoid" }
  - { kind: trait, name: "Group" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "String" }
  - { kind: make, name: "[A]" }
  - { kind: make, name: "Ordering" }
---

# Algebra

Algebraic structures.

Kex traits do not inherit from one another, so concrete types explicitly implement every structure whose laws they satisfy.

## type `Ordering`

The result of `Comparable.compare`. Declared here rather than only inside the interpreter so that `Ordering`, `Less`, `Equal` and `Greater` reach the semantic layer the same way every other stdlib type does — through the collected interfaces — instead of existing solely as native environment bindings the type checker and name resolver cannot see.

**Variants**

  - `Less`
  - `Equal`
  - `Greater`

Implements [`Monoid`](#trait-monoid).

### Methods

Ordering is a Monoid under "first decision wins", with Equal as identity. That is what makes multi-key comparison compose instead of nesting ifs:

```kex
a.name.compare(b.name).combine(a.age.compare(b.age))
```

`combine` evaluates its argument eagerly, so the later comparison runs even when the earlier one already decided. Use `thenBy` when that matters.

#### `identity` (from Monoid)



#### `combine` (from Monoid)

```kex
combine(_, other: Ordering) -> Ordering
```

#### `reverse`

```kex
reverse : Ordering
```

Swaps Less and Greater and fixes Equal — descending order.

#### `thenBy`

```kex
thenBy : Block<Ordering> -> Ordering
```

Short-circuiting `combine`: the tie-breaker block runs only when this comparison is Equal, so it costs nothing once the order is decided.

```kex
a.name.compare(b.name).thenBy { a.age.compare(b.age) }
```

### From [`Monoid`](#trait-monoid)

  - [`repeat`](#monoid-repeat) — Combines this value with itself `n` times.

## trait `Comparable`

Implemented by [`Number`](#make-number).

### Required methods

#### `compare`

```kex
compare : This -> Ordering
```

A total order: `compare` answers Less, Equal or Greater. `==` stays independent — a type may be Equatable without being ordered.



## extends `Number`

More methods of [`Number`](number.md#), added by this module.

Implements [`Comparable`](#trait-comparable).

Number carries the implementation, so Integer and Float both inherit it rather than repeating the same three comparisons. Mixed receivers work because `<` and `>` promote across the two (`1.compare(1.0)` is Equal).

### `compare` (from Comparable)

```kex
compare(other: Number) -> Ordering
```

## trait `Monoid`

Implemented by [`Integer`](#make-integer), [`String`](#make-string), [`[A]`](#make-list), [`Ordering`](#make-ordering), [`Map<K, V>`](map.md#make-map).

### Required methods

#### `identity`

```kex
identity : This
```

`combine` must be associative and `identity` neutral on both sides.

#### `combine`

```kex
combine : This -> This
```

### Provided methods

#### `repeat`

```kex
repeat(n: Integer) -> This
```

Combines this value with itself `n` times. Repeating zero times returns the monoid identity; a negative repetition count is invalid.



## trait `Group`

Implemented by [`Integer`](#make-integer).

### Required methods

#### `identity`

```kex
identity : This
```

Combining a value with its inverse must produce `identity`.

#### `combine`

```kex
combine : This -> This
```

#### `inverse`

```kex
inverse : This
```



## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

Implements [`Monoid`](#trait-monoid), [`Group`](#trait-group).

### `identity` (from Monoid, Group)



### `combine` (from Monoid, Group)

```kex
combine(other: This) -> This
```

### `inverse` (from Group)

```kex
inverse : This
```

## type `String`

Implements [`Monoid`](#trait-monoid), [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

### `identity` (from Monoid)



### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

### From [`Monoid`](#trait-monoid)

  - [`repeat`](#monoid-repeat) — Combines this value with itself `n` times.

### Defined in other modules

  - [Blankable](blankable.md#make-string): [`blank?`](blankable.md#string-blank?)
  - [Truthyable](truthyable.md#make-string): [`truthy?`](truthyable.md#string-truthy?)

## extends `[A]`

More methods of [`List`](list.md#type-list), added by this module.

Implements [`Monoid`](#trait-monoid).

### `identity` (from Monoid)



### `combine` (from Monoid)

```kex
combine(other: This) -> This
```
