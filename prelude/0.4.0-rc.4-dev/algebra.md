---
package: prelude
version: "0.4.0-rc.4-dev"
source: algebra.kex
title: Algebra
entities:
  - { kind: trait, name: "Monoid" }
  - { kind: trait, name: "Group" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "String" }
  - { kind: make, name: "[A]" }
  - { kind: trait, name: "Functor" }
  - { kind: trait, name: "Bindable" }
  - { kind: trait, name: "Monad" }
  - { kind: trait, name: "Applicable" }
  - { kind: function, name: "traverse" }
  - { kind: function, name: "sequence" }
---

# Algebra

Algebraic structures: combining values associatively.

Kex traits do not inherit from one another, so a type lists every structure it implements.

A `Monoid` has an associative `combine` and a neutral `identity`. Integers, strings and lists are all monoids, so one `repeat` serves all three:

```kex
"ab".repeat(3)   # => "ababab"
[1].repeat(2)    # => [1, 1]
5.repeat(3)      # => 15
```

`Ordering` and `Comparable` are in `comparable.kex`.

## trait `Monoid`

Types whose values combine associatively and have a neutral element.

Implemented by `Integer` (addition), `String` and `List` (concatenation), `Map` (merge), `Set` and `UnorderedSet` (union), `Stack`, `Queue`, and `Ordering`, where the first decision that is not `Equal` wins.

Implemented by [`Integer`](#make-integer), [`String`](#make-string), [`[A]`](#make-list), [`Ordering`](comparable.md#make-ordering), [`Map<K, V>`](map.md#make-map), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack).

### Required functions

#### `identity`

```kex
identity -> This
```

Returns the neutral element: combining it with any value, on either side, gives that value back.

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

It must be associative: `a.combine(b).combine(c)` must equal `a.combine(b.combine(c))`.

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

### Provided functions

#### `repeat`

```kex
repeat(n: Integer) -> This
```

Combines this value with itself `n` times.

Zero or a negative `n` gives the identity: `""` for a string, `0` for an integer, `[]` for a list. For strings, this is Ruby's `*`.

**Parameters**

  - `n` — how many copies to combine

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

### Required functions

#### `identity`

```kex
identity -> This
```

Returns the neutral element.

**Returns**: the identity

#### `combine`

```kex
combine(other: This) -> This
```

Combines this value with `other`.

**Parameters**

  - `other` — the value to combine with

**Returns**: the combined value

#### `inverse`

```kex
inverse -> This
```

Returns the value that combines with this one to give the identity.

**Returns**: the inverse

**Examples**

```kex
5.inverse             # => -5
5.combine(5.inverse)  # => 0
```



## extends `Integer`

More functions for [`Integer`](number.md#make-integer), added by this module.

Implements [`Monoid`](#trait-monoid), [`Group`](#trait-group).

Makes `Integer` a `Monoid` and a `Group` under addition.

### `identity` (from Monoid, Group)

```kex
identity -> Integer
```

Returns `0`, the neutral element for addition.

**Returns**: zero

**Examples**

```kex
Integer.identity   # => 0
```

### `combine` (from Monoid, Group)

```kex
combine(other: This) -> This
```

Returns the sum of this integer and `other`.

**Parameters**

  - `other` — the integer to add

**Returns**: the sum

**Examples**

```kex
5.combine(3)   # => 8
```

### `inverse` (from Group)

```kex
inverse -> This
```

Returns this integer negated, its additive inverse.

**Returns**: the negation

**Examples**

```kex
5.inverse    # => -5
(-5).inverse # => 5
```

## extends `String`

More functions for [`String`](string.md#make-string), added by this module.

Implements [`Monoid`](#trait-monoid).

Makes `String` a `Monoid` under concatenation.

### `identity` (from Monoid)

```kex
identity -> String
```

Returns `""`, the neutral element for concatenation.

**Returns**: the empty string

**Examples**

```kex
String.identity   # => ""
```

### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

Returns this string followed by `other`.

**Parameters**

  - `other` — the string to append

**Returns**: the concatenation

**Examples**

```kex
"ab".combine("cd")   # => "abcd"
```

## extends `[A]`

More functions for [`List`](list.md#type-list), added by this module.

Implements [`Monoid`](#trait-monoid).

Makes lists a `Monoid` under concatenation.

### `identity` (from Monoid)

```kex
identity -> This
```

Returns `[]`, the neutral element for concatenation.

**Returns**: the empty list

**Examples**

```kex
[1, 2].identity   # => []
```

### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

Returns this list followed by `other`.

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

## trait `Functor<F>`

Containers whose values can be transformed while the container keeps its shape: a list's elements, an optional's value, a result's success. The trait ranges over the container type, so a function written once works on any of them:

```kex
let bumped(F is Functor => xs: F<Integer>) -> F<Integer> = xs.map { |x| x + 1 }

bumped([1, 2])     # => [2, 3]
bumped(Just(1))    # => Just(2)
bumped(Ok(1))      # => Ok(2)
```

Implemented by `List`, `Optional` and `Result`, where an error is left as it is.

Implemented by [`[X]`](list.md#make-list), [`Optional<X>`](optional.md#make-optional), [`Result<_, E>`](optional.md#make-result-_), [`Validation<_, E>`](optional.md#make-validation-_).

### Required functions

#### `map`

```kex
map(f: F<A>) -> (A -> B) -> F<B>
```

Applies `f` to each value the container holds, keeping its shape.

**Parameters**

  - `f` — the transformation

**Returns**: the container of results



## trait `Bindable<F>`

Containers whose values can each produce another container of the same kind, flattened into one. This is the chaining step of a list, an optional or a result.

```kex
let chained(F is Bindable => xs: F<Integer>, f: Integer -> F<Integer>) -> F<Integer> = xs.into(f)
```

Implemented by `List`, `Optional` and `Result`.

Implemented by [`[X]`](list.md#make-list), [`Optional<X>`](optional.md#make-optional), [`Result<_, E>`](optional.md#make-result-_).

### Required functions

#### `into`

```kex
into(f: F<A>) -> (A -> F<B>) -> F<B>
```

Applies `f` to each value and joins the containers it returns.

**Parameters**

  - `f` — the step

**Returns**: the joined result



## trait `Monad<F>`

A `Bindable` container that can also be made from one plain value with `wrap`. Generic code calls it through the type parameter, as `M.wrap(x)`; for a concrete type, `List.wrap(1)` is `[1]`, `Optional.wrap(1)` is `Just(1)` and `Result.wrap(1)` is `Ok(1)`.

```kex
let incremented(M is Monad => xs: M<Integer>) -> M<Integer> = xs.into { |x| M.wrap(x + 1) }

incremented([1, 2])   # => [2, 3]
incremented(Just(1))  # => Just(2)
```

Implemented by `List`, `Optional` and `Result`, where an error is left as it is.

Implemented by [`[X]`](list.md#make-list), [`Optional<X>`](optional.md#make-optional), [`Result<_, E>`](optional.md#make-result-_).

### Required functions

#### `wrap`

```kex
wrap(value: A) -> F<A>
```

Returns the container holding only `value`.

**Parameters**

  - `value` — the value to hold

**Returns**: the container

#### `into`

```kex
into(f: F<A>) -> (A -> F<B>) -> F<B>
```

Applies `f` to each value and joins the containers it returns.

**Parameters**

  - `f` — the step

**Returns**: the joined result



## trait `Applicable<F>`

Containers whose values can be combined with another container's when neither depends on the other. `with` applies a function to the values of both. A list combines every pair. An `Optional` or a `Result` combines the two values or returns the first failure. A `Validation` combines the values or collects every failure, which suits checking several independent inputs.

```kex
[1, 2].with([10, 20]) { |a, b| a + b }       # => [11, 21, 12, 22]
Just(1).with(Just(2)) { |a, b| a + b }       # => Just(3)
name.checked.with(email.checked) do |n, e|
  Signup { name: n, email: e }               # every failed check, or a Signup
end
```

`traverse` and `sequence` work with any of them.

Implemented by `List`, `Optional`, `Result` and `Validation`.

Implemented by [`[X]`](list.md#make-list), [`Optional<X>`](optional.md#make-optional), [`Result<_, E>`](optional.md#make-result-_), [`Validation<_, E>`](optional.md#make-validation-_).

### Required functions

#### `wrap`

```kex
wrap(value: A) -> F<A>
```

Returns the container holding only `value`.

**Parameters**

  - `value` — the value to hold

**Returns**: the container

#### `with`

```kex
with(other: F<A>, f: F<B>) -> (A -> B -> C) -> F<C>
```

Applies `f` to this container's values and `other`'s.

**Parameters**

  - `other` — the other container
  - `f` — combines one value from each

**Returns**: the results



## function `traverse`

```kex
traverse(xs: [A], f: (A -> F<B>)) -> F<[B]>
```

Applies `f` to every element and gathers the results into one container. If any step fails, the result is a failure: the first one for an `Optional` or `Result`, all of them for a `Validation`.

**Parameters**

  - `xs` — the elements
  - `f` — the step for one element

**Returns**: the results, gathered

**Examples**

```kex
traverse(["1", "2"]) { |s| s.to(Integer) }   # => Just([1, 2])
traverse(["1", "x"]) { |s| s.to(Integer) }   # => None
```

## function `sequence`

```kex
sequence(xs: [F<A>]) -> F<[A]>
```

Turns a list of containers into one container of a list; `traverse` with nothing to apply.

**Parameters**

  - `xs` — the containers

**Returns**: their values, gathered

**Examples**

```kex
sequence([Ok(1), Ok(2)])           # => Ok([1, 2])
sequence([Ok(1), Error("no")])     # => Error("no")
```
