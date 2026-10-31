---
package: prelude
version: "0.4.0-beta.4-dev"
source: data/queue.kex
title: Data.Queue
entities:
  - { kind: module, name: "Data" }
---

# Data.Queue

## module `Data`

A first-in-first-out queue.

Opt-in: nothing here is in scope until `using Data.Queue`.

```kex
using Data.Queue
```

A banker's queue: `front` holds the elements ready to leave, `back` holds what was most recently added, reversed. `enqueue` conses onto `back`; `dequeue` takes `front`'s head, and only rotates `back` (reversing it into `front`) when `front` runs out. Both operations are amortized O(1), versus the O(n) `enqueue` a single-list queue would pay for.

```kex
let q = Queue.from([1, 2, 3])
q.enqueue(4).items    # => [1, 2, 3, 4]
q.dequeue             # => Just((1, Queue(2, 3)))
q.peek                # => Just(1)
```

`items` is +@front + @back.reverse+, so the queue is not opaque: it is always a real list you can hand to anything, the same promise `Data.Set` makes.

Unlike a set, a queue's representation is NOT canonical: `Queue.from([1,2])` and `Queue.from([1]).enqueue(2)` hold the same elements in different `front`/`back` splits, so they are structurally unequal even though they answer the same to every method. `==` is therefore overloaded to compare `items` rather than the record fields directly, but that overload only reaches ordinary `==` calls. Two such queues used as map keys, or matched against each other as record patterns, still compare structurally on both backends, and can disagree with `==`.

Every method answers with a new queue rather than changing the receiver. `enqueue!` and `dequeue!` come free from the `!` rebinding form.



## record `Queue<A>`

A queue of elements, split into a ready-to-leave `front` and a most-recently-added, reversed `back`.

Build one with `Queue.from` rather than by hand.

**Fields**

  - `front` : [A] (optional)
  - `back` : [A] (optional)

Implements [`Enumerable`](../enumerable.md#trait-enumerable), [`Foldable`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds from front to back.

This is `Queue`'s `Enumerable`/`Foldable` primitive.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each element

**Returns**: the final accumulator

**Examples**

```kex
Queue.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `identity` (from Monoid)

```kex
identity : Queue<A>
```

The empty queue: the `Monoid` identity.

**Returns**: the empty queue

#### `combine` (from Monoid)

```kex
combine(other: Queue<A>) -> Queue<A>
```

Combines two queues, this one's elements followed by the argument's.

**Parameters**

  - `other` — the queue to append

**Returns**: this queue's elements, then `other`'s

**Examples**

```kex
Queue.from([1, 2]).combine(Queue.from([3, 4])).items   # => [1, 2, 3, 4]
```

#### `items`

```kex
items : [A]
```

Returns the elements front to back. Never opaque: this is a real list.

**Returns**: the elements, front first

**Examples**

```kex
Queue.from([1, 2]).enqueue(3).items   # => [1, 2, 3]
```

#### `enqueue`

```kex
enqueue(value: A) -> Queue<A>
```

Returns a new queue with `value` added at the back.

Use `enqueue!` to rebind the receiver variable.

**Parameters**

  - `value` — the element to add

**Returns**: a queue with `value` at the back

**Examples**

```kex
Queue.from([1, 2]).enqueue(3).items   # => [1, 2, 3]
```

#### `dequeue`

```kex
dequeue : (A, Queue<A>)?
```

Returns the front element and the queue without it, wrapped in `Just`, or `None` for an empty queue.

Rotates `back` into `front` (reversing it) when `front` has run out: the one case that is not O(1), and only amortized so because each element is reversed at most once over the queue's lifetime.

Use `dequeue!` to rebind the receiver variable.

**Returns**: the front element and the rest, or `None`

**Examples**

```kex
Queue.from([1, 2, 3]).dequeue   # => Just((1, Queue(2, 3)))
Queue.empty.dequeue             # => None
```

#### `peek`

```kex
peek : A?
```

Returns the front element wrapped in `Just`, or `None` for an empty queue.

**Returns**: the front element, or `None`

**Examples**

```kex
Queue.from([1, 2]).peek   # => Just(1)
Queue.empty.peek          # => None
```

#### `count` (from Foldable)

```kex
count : Integer
```

Returns the number of elements.

**Returns**: the number of elements

**Examples**

```kex
Queue.from([1, 2, 3]).count   # => 3
```

#### `empty?`

```kex
empty? : Bool
```

Returns `true` when the queue has no elements.

**Returns**: `true` for the empty queue

**Examples**

```kex
Queue.empty.empty?         # => true
Queue.from([1]).empty?     # => false
```

#### `==`

```kex
==(other: Queue<A>) -> Bool
```

Compares two queues by their elements, front to back: NOT by their `front`/`back` split, which is not canonical. See the file header.

**Parameters**

  - `other` — the queue to compare against

**Returns**: `true` when both hold the same elements in the same order

**Examples**

```kex
Queue.from([1, 2]) == Queue.from([1]).enqueue(2)   # => true
```

#### `+`

```kex
+(other: Queue<A>) -> Queue<A>
+(other: [A]) -> Queue<A>
```

Appends another queue's elements, or a plain list's.

**Parameters**

  - `other` — the elements to append

**Returns**: this queue's elements, then `other`'s

**Examples**

```kex
Queue.from([1, 2]) + [3, 4]            # => Queue(1, 2, 3, 4)
Queue.from([1, 2]) + Queue.from([3])   # => Queue(1, 2, 3)
```

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders the queue as `Queue(...)`, front to back.

**Returns**: the rendered queue

**Examples**

```kex
Queue.from([1, 2, 3]).showValue   # => "Queue(1, 2, 3)"
```

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` when the queue has no elements. The `Blankable` view of `empty?`.

**Returns**: `true` for the empty queue

**Examples**

```kex
Queue.empty.blank?         # => true
Queue.from([1]).blank?     # => false
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

## module `Data.Queue`

Constructors for `Queue`.

### `from`

```kex
from(items: [A]) -> Queue<A>
```

Builds a queue from a list, front to back.

**Parameters**

  - `items` — the elements, front first

**Returns**: the queue, ready to `dequeue` in the same order

**Examples**

```kex
Queue.from([1, 2, 3]).peek   # => Just(1)
```

### `empty` (constant)

```kex
empty : Queue<A>
```

The queue with no elements. Also the `Monoid` identity.

**Examples**

```kex
Queue.empty.empty?   # => true
```


