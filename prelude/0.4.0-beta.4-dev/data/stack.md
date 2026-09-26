---
package: prelude
version: "0.4.0-beta.4-dev"
source: data/stack.kex
title: Data.Stack
entities:
  - { kind: module, name: "Data" }
---

# Data.Stack

## module `Data`

A last-in-first-out stack.

Opt-in: nothing here is in scope until `using Data.Stack`.

```kex
using Data.Stack
```

Elements are stored top first, so `push`, `pop` and `peek` are all list-head operations: none of them pay for the size of the stack. `items` reverses that internal order, so it reads bottom-to-top, the order you would have pushed them in:

```kex
let s = Stack.from([1, 2, 3])
s.peek                # => Just(3)
s.push(4).items       # => [1, 2, 3, 4]
s.pop                 # => Just((3, Stack(1, 2)))
Stack.empty.pop       # => None
```

Every method answers with a new stack rather than changing the receiver. `push!` and `pop!` come free from the `!` rebinding form, the same as `add!`/`delete!` do for `Data.Set`: they build a new stack and rebind the receiver variable rather than modifying anything in place.



## record `Stack<A>`

A stack of elements, held top first.

Build one with `Stack.from` rather than by hand: the record literal takes elements in storage order (top first), which reads backwards from the `items` a caller normally thinks in.

```kex
Stack.from([1, 2, 3]).items   # => [1, 2, 3]
```

**Fields**

  - `elements` : [A] (optional)

Implements [`Enumerable`](../enumerable.md#trait-enumerable), [`Foldable`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds from the top down to the bottom.

This is `Stack`'s `Enumerable`/`Foldable` primitive.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each element

**Returns**: the final accumulator

**Examples**

```kex
Stack.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `identity` (from Monoid)

```kex
identity : Stack<A>
```

The empty stack: the `Monoid` identity.

**Returns**: the empty stack

#### `combine` (from Monoid)

```kex
combine(other: Stack<A>) -> Stack<A>
```

Combines two stacks by pushing the argument's elements on top of this one, top element last.

**Parameters**

  - `other` — the stack to push on top

**Returns**: this stack with `other` stacked above it

**Examples**

```kex
Stack.from([1, 2]).combine(Stack.from([3, 4])).items   # => [1, 2, 3, 4]
```

#### `items`

```kex
items : [A]
```

Returns the elements bottom-to-top: the order you would have pushed them in.

**Returns**: the elements, bottom first

**Examples**

```kex
Stack.from([1, 2, 3]).items   # => [1, 2, 3]
```

#### `push`

```kex
push(value: A) -> Stack<A>
```

Returns a new stack with `value` pushed on top.

Use `push!` to rebind the receiver variable.

**Parameters**

  - `value` — the element to push

**Returns**: a stack with `value` on top

**Examples**

```kex
Stack.from([1, 2]).push(3).items   # => [1, 2, 3]
```

#### `pop`

```kex
pop : (A, Stack<A>)?
```

Returns the top element and the stack without it, wrapped in `Just`, or `None` for an empty stack.

Use `pop!` to rebind the receiver variable.

**Returns**: the top element and the rest, or `None`

**Examples**

```kex
Stack.from([1, 2, 3]).pop   # => Just((3, Stack(1, 2)))
Stack.empty.pop             # => None
```

#### `peek`

```kex
peek : A?
```

Returns the top element wrapped in `Just`, or `None` for an empty stack.

**Returns**: the top element, or `None`

**Examples**

```kex
Stack.from([1, 2, 3]).peek   # => Just(3)
Stack.empty.peek             # => None
```

#### `count` (from Foldable)

```kex
count : Integer
```

Returns the number of elements.

**Returns**: the number of elements

**Examples**

```kex
Stack.from([1, 2, 3]).count   # => 3
```

#### `empty?`

```kex
empty? : Bool
```

Returns `true` when the stack has no elements.

**Returns**: `true` for the empty stack

**Examples**

```kex
Stack.empty.empty?         # => true
Stack.from([1]).empty?     # => false
```

#### `+`

```kex
+(other: Stack<A>) -> Stack<A>
+(other: [A]) -> Stack<A>
```

Pushes another stack's elements, or a plain list's, on top.

The list form reads bottom-to-top, the same as `Stack.from`: the last element of the list ends up on top.

**Parameters**

  - `other` — the elements to push

**Returns**: this stack with `other` pushed above it

**Examples**

```kex
Stack.from([1, 2]) + [3, 4]             # => Stack(1, 2, 3, 4)
Stack.from([1, 2]) + Stack.from([3])    # => Stack(1, 2, 3)
```

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders the stack as `Stack(...)`, bottom-to-top.

**Returns**: the rendered stack

**Examples**

```kex
Stack.from([1, 2, 3]).showValue   # => "Stack(1, 2, 3)"
```

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` when the stack has no elements. The `Blankable` view of `empty?`.

**Returns**: `true` for the empty stack

**Examples**

```kex
Stack.empty.blank?         # => true
Stack.from([1]).blank?     # => false
```

### From [`Enumerable`](../enumerable.md#trait-enumerable)

  - [`map`](../enumerable.md#enumerable-map) — Applies `f` to each item and collects the results into a list.
  - [`mapIndexed`](../enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and collects the results into a list.
  - [`filter`](../enumerable.md#enumerable-filter) — Returns the items for which `pred` answers `true`.
  - [`flatMap`](../enumerable.md#enumerable-flatmap) — Applies `f` to each item, expecting a list back, and concatenates the results into one flat list.
  - [`collect`](../enumerable.md#enumerable-collect) — Applies `f` to each item, expecting an `Optional` back, and returns the values that were present: unwrapped.

### From [`Foldable`](../enumerable.md#trait-foldable)

  - [`each`](../enumerable.md#foldable-each) — Calls `f` with each item, for its side effects.
  - [`eachIndexed`](../enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](../enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`.
  - [`any?`](../enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`.
  - [`find`](../enumerable.md#foldable-find) — Returns the first item satisfying `pred`, or `None` when nothing does.

### From [`Monoid`](../algebra.md#trait-monoid)

  - [`repeat`](../algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Showable`](../kex.md#trait-showable)

  - [`to`](../kex.md#showable-to) — 

## module `Data.Stack`

Constructors for `Stack`.

### `from`

```kex
from(items: [A]) -> Stack<A>
```

Builds a stack from a list, read bottom-to-top: the last element is on top.

**Parameters**

  - `items` — the elements, bottom first

**Returns**: the stack, with `items`'s last element on top

**Examples**

```kex
Stack.from([1, 2, 3]).peek   # => Just(3)
```

### `empty` (constant)

```kex
empty : Stack<A>
```

The stack with no elements. Also the `Monoid` identity.

**Examples**

```kex
Stack.empty.empty?   # => true
```


