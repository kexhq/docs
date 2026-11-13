---
package: prelude
version: "0.4.0-beta.4-dev"
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

Algebraic structures: combining values associatively.

Kex traits do not inherit from one another, so concrete types explicitly implement every structure whose laws they satisfy.

`Monoid` is "these two values combine, and there is a neutral one". Numbers, strings and lists all satisfy it, which is what lets `repeat` be written once:

```kex
"ab".repeat(3)   # => "ababab"
[1].repeat(2)    # => [1, 1]
5.repeat(3)      # => 15
```

Ordering and comparison (`Ordering`, `Comparable`) live in `comparable.kex`.

## trait `Monoid`

Types whose values combine associatively and have a neutral element.

Implemented by `Integer` (addition), `String` and `List` (concatenation), `Map` and both `Set` flavours (union), and `Ordering` ("first decision wins" — declared beside `Ordering` in `comparable.kex`).

Implemented by [`Integer`](#make-integer), [`String`](#make-string), [`[A]`](#make-list), [`Ordering`](comparable.md#make-ordering), [`Map<K, V>`](map.md#make-map), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack).

### Required methods

#### `identity`

```kex
identity : This
```

The neutral element: combining it with any value gives that value back.

`combine` must be associative and `identity` neutral on both sides.

**Returns**: the identity

**Examples**

```kex
Integer.identity   # => 0
String.identity    # => ""
```

#### `combine`

```kex
combine(other: This) -> This
```

Combines this value with `other`.

Must be associative: `a.combine(b).combine(c)` and `a.combine(b.combine(c))` have to agree.

**Parameters**

  - `other` — the value to combine with

**Returns**: the combined value

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

### Provided methods

#### `repeat`

```kex
repeat(n: Integer) -> This
```

Combines this value with itself `n` times.

Repeating zero times gives the identity: `""` for a string, `0` for an integer, `[]` for a list. A negative count is invalid and ends the program.

**Parameters**

  - `n` — how many copies to combine; must not be negative

**Returns**: the repeated value

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

Implemented by [`Integer`](#make-integer).

### Required methods

#### `identity`

```kex
identity : This
```

The neutral element.

**Returns**: the identity

#### `combine`

```kex
combine : This -> This
```

Combines this value with `other`.

**Returns**: the combined value

#### `inverse`

```kex
inverse : This
```

The value that combines with this one to give the identity.

**Returns**: the inverse

**Examples**

```kex
5.inverse             # => -5
5.combine(5.inverse)  # => 0
```



## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

Implements [`Monoid`](#trait-monoid), [`Group`](#trait-group).

Implements `Monoid`, `Group` over `Integer` for addition.

### `identity` (from Monoid, Group)

`0`: the neutral element for addition.

**Returns**: `Integer` — zero

**Examples**

```kex
Integer.identity   # => 0
```

### `combine` (from Monoid, Group)

```kex
combine(other: This) -> This
```

Adds `other` to this integer. Addition is the monoid operation for `Integer`.

**Parameters**

  - `other` — the integer to add

**Returns**: the sum

**Examples**

```kex
5.combine(3)   # => 8
```

### `inverse` (from Group)

```kex
inverse : This
```

The additive inverse: this integer negated.

**Returns**: the negation

**Examples**

```kex
5.inverse    # => -5
(-5).inverse # => 5
```

## extends `String`

More methods of [`String`](string.md#make-string), added by this module.

Implements [`Monoid`](#trait-monoid).

Implements `Monoid` over `String` for concatenation.

### `identity` (from Monoid)

`""`: the neutral element for concatenation.

**Returns**: `String` — the empty string

**Examples**

```kex
String.identity   # => ""
```

### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

Concatenates `other` onto this string. Concatenation is the monoid operation for `String`.

**Parameters**

  - `other` — the string to append

**Returns**: the concatenation

**Examples**

```kex
"ab".combine("cd")   # => "abcd"
```

## extends `[A]`

More methods of [`List`](list.md#type-list), added by this module.

Implements [`Monoid`](#trait-monoid).

Implements `Monoid` over `List<A>` for concatenation.

### `identity` (from Monoid)

`[]`: the neutral element for concatenation.

**Returns**: `[A]` — the empty list

**Examples**

```kex
[1].combine(List.identity)   # => [1]
```

### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

Concatenates `other` onto this list. Concatenation is the monoid operation for `List`.

**Parameters**

  - `other` — the list to append

**Returns**: the concatenation

**Examples**

```kex
[1].combine([2, 3])   # => [1, 2, 3]
```

_Flattening a list of lists_

```kex
groups.reduce([]) { |acc, g| acc.combine(g) }
```
