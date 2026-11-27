---
package: prelude
version: "0.4.0-rc.4-dev"
source: data/stack.kex
title: Data.Stack
entities:
  - { kind: module, name: "Data" }
---

# Data.Stack

## module `Data`

A last-in-first-out stack.

Nothing here is in scope until `using Data.Stack`.

```kex
using Data.Stack
```

`push`, `pop` and `peek` take constant time. `items` lists the elements bottom to top, the order they were pushed in:

```kex
let s = Stack.from([1, 2, 3])
s.peek                                         # => Just(3)
s.push(4).items                                # => [1, 2, 3, 4]
s.pop.map { |top, rest| (top, rest.items) }    # => Just((3, [1, 2]))
Stack.empty.pop                                # => None
```

Every update returns a new stack. `push!` rebinds the variable to the result, as `add!` does for `Data.Set`.



## record `Stack<A>`

A stack of elements.

Build one with `Stack.from`. The record literal takes its elements top first, the reverse of `items`.

```kex
Stack.from([1, 2, 3]).items   # => [1, 2, 3]
```

**Fields**

  - `elements` : [A] (optional)

Implements [`Enumerable<A>`](../enumerable.md#trait-enumerable), [`Foldable<A>`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Functions

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds the elements from bottom to top, the order of `items`. `map`, `each` and the other `Enumerable` functions use the same order.

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
identity -> Stack<A>
```

Returns the empty stack, the `Monoid` identity.

**Returns**: the empty stack

#### `combine` (from Monoid)

```kex
combine(other: Stack<A>) -> Stack<A>
```

Pushes the elements of `other` onto this stack, bottom first, so the top of `other` ends up on top.

**Parameters**

  - `other` — the stack to push on top

**Returns**: this stack with `other` stacked above it

**Examples**

```kex
Stack.from([1, 2]).combine(Stack.from([3, 4])).items   # => [1, 2, 3, 4]
```

#### `items`

```kex
items -> [A]
```

Returns the elements bottom to top, the order they were pushed in.

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

`s.push!(value)` rebinds `s` to the result.

**Parameters**

  - `value` — the element to push

**Returns**: a stack with `value` on top

**Examples**

```kex
Stack.from([1, 2]).push(3).items   # => [1, 2, 3]
```

#### `pop`

```kex
pop -> (A, Stack<A>)?
```

Returns the top element and the stack without it, or `None` for an empty stack.

**Returns**: the top element and the rest, or `None`

**Examples**

```kex
Stack.from([1, 2, 3]).pop.map { |top, rest| (top, rest.items) }
# => Just((3, [1, 2]))
Stack.empty.pop   # => None
```

#### `peek`

```kex
peek -> A?
```

Returns the top element, or `None` for an empty stack.

**Returns**: the top element, or `None`

**Examples**

```kex
Stack.from([1, 2, 3]).peek   # => Just(3)
Stack.empty.peek             # => None
```

#### `count` (from Foldable)

```kex
count -> Integer
```

Returns the number of elements.

**Returns**: the number of elements

**Examples**

```kex
Stack.from([1, 2, 3]).count   # => 3
```

#### `empty?`

```kex
empty? -> Bool
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

Pushes the elements of another stack or of a list onto this one.

A list is read bottom to top, as by `Stack.from`, so its last element ends up on top.

**Parameters**

  - `other` — the elements to push

**Returns**: this stack with `other` pushed above it

**Examples**

```kex
(Stack.from([1, 2]) + [3, 4]).items            # => [1, 2, 3, 4]
(Stack.from([1, 2]) + Stack.from([3])).items   # => [1, 2, 3]
```

#### `showValue` (from Showable)

```kex
showValue -> String
```

Writes the stack as `Stack(...)`, bottom to top.

**Returns**: the rendered stack

**Examples**

```kex
Stack.from([1, 2, 3]).showValue   # => "Stack(1, 2, 3)"
```

#### `blank?` (from Blankable)

```kex
blank? -> Bool
```

Returns `true` when the stack has no elements, like `empty?`.

**Returns**: `true` for the empty stack

**Examples**

```kex
Stack.empty.blank?         # => true
Stack.from([1]).blank?     # => false
```

### From [`Enumerable`](../enumerable.md#trait-enumerable)

  - [`map`](../enumerable.md#enumerable-map) — Applies `f` to each item and returns the results as a list.
  - [`mapIndexed`](../enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and returns the results as a list.
  - [`filter`](../enumerable.md#enumerable-filter) — Returns the items for which `pred` returns `true`.
  - [`into`](../enumerable.md#enumerable-into) — Applies `f`, which returns a list, to each item and concatenates the results.
  - [`collect`](../enumerable.md#enumerable-collect) — Applies `f`, which returns an `Optional`, to each item and returns the present values, unwrapped.

### From [`Foldable`](../enumerable.md#trait-foldable)

  - [`each`](../enumerable.md#foldable-each) — Calls `f` with each item, for its side effects.
  - [`eachIndexed`](../enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](../enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`, and `true` for an empty collection.
  - [`any?`](../enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`, and `false` for an empty collection.
  - [`none?`](../enumerable.md#foldable-none?) — Returns `true` when no item satisfies `pred`, the opposite of `any?`.
  - [`one?`](../enumerable.md#foldable-one?) — Returns `true` when exactly one item satisfies `pred`.
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

Builds a stack from a list read bottom to top, so the last element is on top.

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

Returns an empty stack.

**Examples**

```kex
Stack.empty.empty?   # => true
```


