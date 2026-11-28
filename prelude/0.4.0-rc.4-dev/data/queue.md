---
package: prelude
version: "0.4.0-rc.4-dev"
source: data/queue.kex
title: Data.Queue
entities:
  - { kind: module, name: "Data" }
---

# Data.Queue

## module `Data`

A first-in-first-out queue.

Nothing here is in scope until `using Data.Queue`.

```kex
using Data.Queue

let q = Queue.from([1, 2, 3])
q.enqueue(4).items    # => [1, 2, 3, 4]
q.peek                # => Just(1)
```

The queue is two lists. `front` holds the elements next in line, and `back` holds the newest ones in reverse. `enqueue` adds to the head of `back`, and `dequeue` takes the head of `front`, reversing `back` into `front` when `front` runs out. Both run in amortized constant time.

`items` gives the elements as a list, front first.

The same elements can be split between `front` and `back` in different ways: `Queue.from([1, 2])` and `Queue.from([1]).enqueue(2)` differ inside. `==` compares `items`, so it calls them equal. Map keys and record patterns compare the fields themselves, so to them the two queues differ.

Updates return a new queue. `enqueue!` and `dequeue!` rebind the variable instead.



## record `Queue<A>`

A first-in-first-out queue: `front` holds the elements next in line, `back` the newest ones in reverse.

Build one with `Queue.from` or `Queue.empty`.

**Fields**

  - `front` : [A] (optional)
  - `back` : [A] (optional)

Implements [`Enumerable<A>`](../enumerable.md#trait-enumerable), [`Foldable<A>`](../enumerable.md#trait-foldable), [`Monoid`](../algebra.md#trait-monoid), [`Showable`](../kex.md#trait-showable), [`Blankable`](../blankable.md#trait-blankable).

### Functions

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: B, f: (B -> A -> B)) -> B
```

Folds the elements from front to back.

The other `Enumerable` and `Foldable` functions are built on this one.

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
identity -> Queue<A>
```

Returns the empty queue, the `Monoid` identity.

**Returns**: the empty queue

#### `combine` (from Monoid)

```kex
combine(other: Queue<A>) -> Queue<A>
```

Joins two queues: this one's elements, then `other`'s.

**Parameters**

  - `other` — the queue to append

**Returns**: this queue's elements, then `other`'s

**Examples**

```kex
Queue.from([1, 2]).combine(Queue.from([3, 4])).items   # => [1, 2, 3, 4]
```

#### `items`

```kex
items -> [A]
```

Returns the elements as a list, front first.

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
dequeue -> (A, Queue<A>)?
```

Returns the front element and the queue without it, wrapped in `Just`, or `None` for an empty queue.

When `front` is empty, this reverses `back` into it, which takes time in proportion to its length. Each element is reversed only once, so the cost evens out to constant time per element.

Use `dequeue!` to rebind the receiver variable.

**Returns**: the front element and the rest, or `None`

**Examples**

```kex
match Queue.from([1, 2, 3]).dequeue do
  Just((head, rest)) => (head, rest.items)   # => (1, [2, 3])
  None => (0, [])
end
Queue.empty.dequeue                          # => None
```

#### `peek`

```kex
peek -> A?
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
count -> Integer
```

Returns the number of elements.

**Returns**: the number of elements

**Examples**

```kex
Queue.from([1, 2, 3]).count   # => 3
```

#### `empty?`

```kex
empty? -> Bool
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

Returns `true` when both queues hold the same elements in the same order, however each splits them between `front` and `back`.

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

Appends the elements of another queue or of a list.

**Parameters**

  - `other` — the elements to append

**Returns**: this queue's elements, then `other`'s

**Examples**

```kex
(Queue.from([1, 2]) + [3, 4]).items            # => [1, 2, 3, 4]
(Queue.from([1, 2]) + Queue.from([3])).items   # => [1, 2, 3]
```

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the queue as `Queue(...)`, front to back.

**Returns**: the rendered queue

**Examples**

```kex
Queue.from([1, 2, 3]).showValue   # => "Queue(1, 2, 3)"
```

#### `blank?` (from Blankable)

```kex
blank? -> Bool
```

Returns `true` when the queue has no elements; the `Blankable` name for `empty?`.

**Returns**: `true` for the empty queue

**Examples**

```kex
Queue.empty.blank?         # => true
Queue.from([1]).blank?     # => false
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

## module `Data.Queue`

Constructors for `Queue`.

### `from`

```kex
from(items: [A]) -> Queue<A>
```

Builds a queue from a list, front first.

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

Returns the empty queue, which is also the `Monoid` identity.

**Examples**

```kex
Queue.empty.empty?   # => true
```


