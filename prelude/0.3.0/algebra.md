---
package: prelude
version: "0.3.0"
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

## type `Ordering`

Algebraic structures.

Kex traits do not inherit from one another, so concrete types explicitly implement every structure whose laws they satisfy.

The result of `Comparable.compare`. Declared here rather than only inside the interpreter so that `Ordering`, `Less`, `Equal` and `Greater` reach the semantic layer the same way every other stdlib type does — through the collected interfaces — instead of existing solely as native environment bindings the type checker and name resolver cannot see.



**Variants**

  - `Less`
  - `Equal`
  - `Greater`

## trait `Comparable`


#### `compare`

A total order: `compare` answers Less, Equal or Greater. `==` stays independent — a type may be Equatable without being ordered.

```kex
compare : This -> Ordering
```

## make `Number` implements [Comparable](#trait-comparable)

Number carries the implementation, so Integer and Float both inherit it rather than repeating the same three comparisons. Mixed receivers work because `<` and `>` promote across the two (`1.compare(1.0)` is Equal).


#### `compare`

```kex
compare(other)
```

## trait `Monoid`


#### `identity`

`combine` must be associative and `identity` neutral on both sides.

```kex
identity : This
```

#### `combine`

```kex
combine : This -> This
```

#### `repeat`

Combines this value with itself `n` times. Repeating zero times returns the monoid identity; a negative repetition count is invalid.

```kex
repeat(n)
```

## trait `Group`


#### `identity`

Combining a value with its inverse must produce `identity`.

```kex
identity : This
```

#### `combine`

```kex
combine : This -> This
```

#### `inverse`

```kex
inverse : This
```

## make `Integer` implements [Monoid](#trait-monoid), [Group](#trait-group)


#### `combine`

```kex
combine(other)
```

## make `String` implements [Monoid](#trait-monoid)


#### `combine`

```kex
combine(other)
```

## make `[A]` implements [Monoid](#trait-monoid)


#### `combine`

```kex
combine(other)
```

## make `Ordering` implements [Monoid](#trait-monoid)

Ordering is a Monoid under "first decision wins", with Equal as identity. That is what makes multi-key comparison compose instead of nesting ifs:

  a.name.compare(b.name).combine(a.age.compare(b.age))

`combine` evaluates its argument eagerly, so the later comparison runs even when the earlier one already decided. Use `thenBy` when that matters.


#### `combine`

```kex
combine(@Equal, other)
```

#### `reverse`

Swaps Less and Greater and fixes Equal — descending order.

```kex
reverse : Ordering
```

#### `thenBy`

Short-circuiting `combine`: the tie-breaker block runs only when this comparison is Equal, so it costs nothing once the order is decided.

  a.name.compare(b.name).thenBy { a.age.compare(b.age) }

```kex
thenBy : Block<Ordering> -> Ordering
```
