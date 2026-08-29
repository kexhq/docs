---
package: prelude
version: "0.4.0-alpha"
source: data/stack.kex
title: Data.Stack
entities:
  - { kind: module, name: "Data" }
---

# Data.Stack

## module `Data`

A last-in-first-out stack.

Opt-in — nothing here is in scope until `using Data.Stack`.

```kex
using Data.Stack
```

Elements are stored top first, so `push`, `pop` and `peek` are all list-head operations — none of them pay for the size of the stack. `items` reverses that internal order, so it reads bottom-to-top, the order you would have pushed them in:

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

Build one with `Stack.from` rather than by hand — the record literal takes elements in storage order (top first), which reads backwards from the `items` a caller normally thinks in.

```kex
Stack.from([1, 2, 3]).items   # => [1, 2, 3]
```

**Fields**

  - `elements` : [A] (optional)

## module `Data.Stack`

Constructors for `Stack`.

## function `from`

Builds a stack from a list, read bottom-to-top: the last element is on top.


```kex
from(items)
```


## constant `empty`

The stack with no elements. Also the `Monoid` identity.



## make `Stack<A>` implements [Enumerable](../enumerable.md#trait-enumerable), [Foldable](../enumerable.md#trait-foldable), [Monoid](../algebra.md#trait-monoid), Showable


#### `reduce`

Folds from the top down to the bottom.

This is `Stack`'s `Enumerable`/`Foldable` primitive.

```kex
reduce(acc, f) : B -> (B -> A -> B) -> B
```

**Returns**: `B` — the final accumulator

**Examples**

```kex
Stack.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `combine`

Combines two stacks by pushing the argument's elements on top of this one, top element last.

```kex
combine(other) : Stack<A> -> Stack<A>
```

**Returns**: `Stack<A>` — this stack with `other` stacked above it

**Examples**

```kex
Stack.from([1, 2]).combine(Stack.from([3, 4])).items   # => [1, 2, 3, 4]
```

#### `push`

Returns a new stack with `value` pushed on top.

Use `push!` to rebind the receiver variable.

```kex
push(value) : A -> Stack<A>
```

**Returns**: `Stack<A>` — a stack with `value` on top

**Examples**

```kex
Stack.from([1, 2]).push(3).items   # => [1, 2, 3]
```

#### `pop`

Returns the top element and the stack without it, wrapped in `Just`, or `None` for an empty stack.

Use `pop!` to rebind the receiver variable.

```kex
pop : (A, Stack<A>)?
```

**Returns**: `(A, Stack<A>)?` — the top element and the rest, or `None`

**Examples**

```kex
Stack.from([1, 2, 3]).pop   # => Just((3, Stack(1, 2)))
Stack.empty.pop             # => None
```

#### `peek`

Returns the top element wrapped in `Just`, or `None` for an empty stack.

```kex
peek : A?
```

**Returns**: `A?` — the top element, or `None`

**Examples**

```kex
Stack.from([1, 2, 3]).peek   # => Just(3)
Stack.empty.peek             # => None
```

#### `+`

Pushes another stack's elements, or a plain list's, on top.

The list form reads bottom-to-top, the same as `Stack.from`: the last element of the list ends up on top.

```kex
+(other) : Stack<A> -> Stack<A>
+(other) : [A] -> Stack<A>
```

**Returns**: `Stack<A>` — this stack with `other` pushed above it

**Examples**

```kex
Stack.from([1, 2]) ` [3, 4]             # => Stack(1, 2, 3, 4)
Stack.from([1, 2]) ` Stack.from([3])    # => Stack(1, 2, 3)
```

## make `Stack<A>` implements [Blankable](../blankable.md#trait-blankable)


