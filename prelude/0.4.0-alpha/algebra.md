---
package: prelude
version: "0.4.0-alpha"
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

Algebraic structures, ordering, and combining values associatively.

Kex traits do not inherit from one another, so concrete types explicitly implement every structure whose laws they satisfy.

The two most important things that you will meet in everyday code. `Ordering` is what a comparison answers, and it composes. This is how a multi-key sort is written without nested `if`s:

```kex
a.age.compare(b.age).thenBy { a.score.compare(b.score) }
```

`Monoid` is "these two values combine, and there is a neutral one". Numbers, strings and lists all satisfy it, which is what lets `repeat` be written once:

```kex
"ab".repeat(3)   # => "ababab"
[1].repeat(2)    # => [1, 1]
5.repeat(3)      # => 15
```

The result of a comparison: `Less`, `Equal` or `Greater`.

Declared here rather than only inside the interpreter so that `Ordering`, `Less`, `Equal` and `Greater` reach the semantic layer the same way every other stdlib type does (through the collected interfaces) instead of existing solely as native environment bindings the type checker and name resolver cannot see.



**Variants**

  - `Less`
  - `Equal`
  - `Greater`

## trait `Comparable`

Types that have a total order.

Implemented by `Number`, which covers both `Integer` and `Float`.


#### `compare`

Compares this value with `other` and answers `Less`, `Equal` or `Greater`.

`==` stays independent of this: a type may be equatable without being ordered.

A total order: `compare` answers Less, Equal or Greater. `==` stays independent: a type may be Equatable without being ordered.

```kex
compare : This -> Ordering
```

**Returns**: `Ordering` — how this value orders against `other`

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

## make `Number` implements [Comparable](#trait-comparable)

Number carries the implementation, so Integer and Float both inherit it rather than repeating the same three comparisons. Mixed receivers work because `<` and `>` promote across the two (`1.compare(1.0)` is Equal).


#### `compare`

Compares two numbers, across the `Integer`/`Float` boundary.

Mixed receivers work because `<` and `>` promote across the two, so `1.compare(1.0)` is `Equal`.

```kex
compare(other)
```

**Returns**: `Ordering` — how this number orders against `other`

**Examples**

```kex
1.compare(2)      # => Less
1.compare(1.0)    # => Equal
2.5.compare(2)    # => Greater
```

## trait `Monoid`

Types whose values combine associatively and have a neutral element.

Implemented by `Integer` (addition), `String` and `List` (concatenation), `Map` and both `Set` flavours (union), and `Ordering` ("first decision wins").


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

## make `Ordering` implements [Monoid](#trait-monoid)

`Ordering` is a Monoid under "first decision wins", with Equal as identity. That is what makes multi-key comparison compose instead of nesting ifs:

```kex
a.name.compare(b.name).combine(a.age.compare(b.age))
```

`combine` evaluates its argument eagerly, so the later comparison runs even when the earlier one already decided. Use `thenBy` when that matters.


#### `combine`

Returns the first decisive ordering: this one if it is not `Equal`, otherwise `other`.

This is what makes multi-key comparison compose. Note that `other` is evaluated eagerly, so the later comparison runs even when the earlier one has already decided: use `thenBy` when that matters.

```kex
combine(@Equal, other)
```

**Returns**: `Ordering` — the first decisive ordering

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

Returns the opposite ordering: `Less` becomes `Greater`, `Greater` becomes `Less`, and `Equal` stays `Equal`.

The one-word way to turn an ascending comparison into a descending one.

```kex
reverse : Ordering
```

**Returns**: `Ordering` — the reversed ordering

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

Returns this ordering if it is decisive, otherwise the result of calling `tieBreaker`.

The short-circuiting form of `combine`: the block runs only when this comparison is `Equal`, so a tie-breaker costs nothing once the order is already decided. Prefer it whenever the tie-breaker is more than a field read.

```kex
thenBy : Block<Ordering> -> Ordering
```

**Returns**: `Ordering` — the first decisive ordering

**Examples**

```kex
Equal.thenBy { 2.compare(1) }   # => Greater
Less.thenBy { 2.compare(1) }    # => Less
```
_Sorting by age, then by an expensive score_

```kex
a.age.compare(b.age).thenBy { score(a).compare(score(b)) }
```
