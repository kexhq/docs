---
package: prelude
version: "0.4.0-alpha-dev"
source: algebra.kex
title: Algebra
entities:
  - { kind: trait, name: "Monoid" }
  - { kind: trait, name: "Group" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "String" }
  - { kind: make, name: "[A]" }
---

# Algebra

## trait `Monoid`

Algebraic structures: combining values associatively.

Kex traits do not inherit from one another, so concrete types explicitly implement every structure whose laws they satisfy.

`Monoid` is "these two values combine, and there is a neutral one". Numbers, strings and lists all satisfy it, which is what lets `repeat` be written once:

```kex
"ab".repeat(3)   # => "ababab"
[1].repeat(2)    # => [1, 1]
5.repeat(3)      # => 15
```

Ordering and comparison (`Ordering`, `Comparable`) live in `comparable.kex`.

Types whose values combine associatively and have a neutral element.

Implemented by `Integer` (addition), `String` and `List` (concatenation), `Map` and both `Set` flavours (union), and `Ordering` ("first decision wins" — declared beside `Ordering` in `comparable.kex`).


#### `identity`

The neutral element: combining it with any value gives that value back.

`combine` must be associative and `identity` neutral on both sides.

```kex
identity : This
```

**Returns**: `This` — the identity

**Examples**

```kex
Integer.identity   # => 0
String.identity    # => ""
```

#### `combine`

Combines this value with `other`.

Must be associative: `a.combine(b).combine(c)` and `a.combine(b.combine(c))` have to agree.

```kex
combine : This -> This
```

**Returns**: `This` — the combined value

**Examples**

```kex
5.combine(3)          # => 8
"ab".combine("cd")    # => "abcd"
[1].combine([2])      # => [1, 2]
```
_Folding a list of values into one_

```kex
parts.reduce(String.identity) { |acc, s| acc.combine(s) }
```

#### `repeat`

Combines this value with itself `n` times.

Repeating zero times gives the identity: `""` for a string, `0` for an integer, `[]` for a list. A negative count is invalid and ends the program.

```kex
repeat(0)
```

**Returns**: `This` — the repeated value

**Examples**

```kex
"ab".repeat(3)   # => "ababab"
[1].repeat(2)    # => [1, 1]
5.repeat(3)      # => 15
"x".repeat(0)    # => ""
```
_Drawing a separator line_

```kex
IO.printLine("-".repeat(40))
```

## trait `Group`

A `Monoid` in which every value has an inverse that combines with it to give the identity.

Implemented by `Integer`, where the inverse is negation.


#### `identity`

The neutral element.

```kex
identity : This
```

**Returns**: `This` — the identity

#### `combine`

Combines this value with `other`.

```kex
combine : This -> This
```

**Returns**: `This` — the combined value

#### `inverse`

The value that combines with this one to give the identity.

```kex
inverse : This
```

**Returns**: `This` — the inverse

**Examples**

```kex
5.inverse             # => -5
5.combine(5.inverse)  # => 0
```

## make `Integer` implements [Monoid](#trait-monoid), [Group](#trait-group)

Implements `Monoid`, `Group` over `Integer` for addition.


#### `combine`

Adds `other` to this integer. Addition is the monoid operation for `Integer`.

```kex
combine(other)
```

**Returns**: `This` — the sum

**Examples**

```kex
5.combine(3)   # => 8
```

## make `String` implements [Monoid](#trait-monoid)

Implements `Monoid` over `String` for concatenation.


#### `combine`

Concatenates `other` onto this string. Concatenation is the monoid operation for `String`.

```kex
combine(other)
```

**Returns**: `This` — the concatenation

**Examples**

```kex
"ab".combine("cd")   # => "abcd"
```

## make `[A]` implements [Monoid](#trait-monoid)

Implements `Monoid` over `List<A>` for concatenation.


#### `combine`

Concatenates `other` onto this list. Concatenation is the monoid operation for `List`.

```kex
combine(other)
```

**Returns**: `This` — the concatenation

**Examples**

```kex
[1].combine([2, 3])   # => [1, 2, 3]
```
_Flattening a list of lists_

```kex
groups.reduce([]) { |acc, g| acc.combine(g) }
```
