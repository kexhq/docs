---
package: prelude
version: "0.4.0-alpha"
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

`items` is `@front ` @back.reverse`, so the queue is not opaque: it is always a real list you can hand to anything, the same promise `Data.Set` makes.

Unlike a set, a queue's representation is NOT canonical: `Queue.from([1,2])` and `Queue.from([1]).enqueue(2)` hold the same elements in different `front`/`back` splits, so they are structurally unequal even though they answer the same to every method. `==` is therefore overloaded to compare `items` rather than the record fields directly, but that overload only reaches ordinary `==` calls. Two such queues used as map keys, or matched against each other as record patterns, still compare structurally on both backends, and can disagree with `==`.

Every method answers with a new queue rather than changing the receiver. `enqueue!` and `dequeue!` come free from the `!+ rebinding form.

## record `Queue<A>`

A queue of elements, split into a ready-to-leave `front` and a most-recently-added, reversed `back`.

Build one with `Queue.from` rather than by hand.

**Fields**

  - `front` : [A] (optional)
  - `back` : [A] (optional)

## module `Data.Queue`

Constructors for `Queue`.

## function `from`

Builds a queue from a list, front to back.


```kex
from(items)
```


## constant `empty`

The queue with no elements. Also the `Monoid` identity.



## make `Queue<A>` implements [Enumerable](../enumerable.md#trait-enumerable), [Foldable](../enumerable.md#trait-foldable), [Monoid](../algebra.md#trait-monoid), Showable


#### `reduce`

Folds from front to back.

This is `Queue`'s `Enumerable`/`Foldable` primitive.

```kex
reduce(acc, f) : B -> (B -> A -> B) -> B
```

**Returns**: `B` — the final accumulator

**Examples**

```kex
Queue.from([1, 2, 3]).reduce(0) { |sum, x| sum + x }   # => 6
```

#### `combine`

Combines two queues, this one's elements followed by the argument's.

```kex
combine(other) : Queue<A> -> Queue<A>
```

**Returns**: `Queue<A>` — this queue's elements, then `other`'s

**Examples**

```kex
Queue.from([1, 2]).combine(Queue.from([3, 4])).items   # => [1, 2, 3, 4]
```

#### `enqueue`

Returns a new queue with `value` added at the back.

Use `enqueue!` to rebind the receiver variable.

```kex
enqueue(value) : A -> Queue<A>
```

**Returns**: `Queue<A>` — a queue with `value` at the back

**Examples**

```kex
Queue.from([1, 2]).enqueue(3).items   # => [1, 2, 3]
```

#### `dequeue`

Returns the front element and the queue without it, wrapped in `Just`, or `None` for an empty queue.

Rotates `back` into `front` (reversing it) when `front` has run out: the one case that is not O(1), and only amortized so because each element is reversed at most once over the queue's lifetime.

Use `dequeue!` to rebind the receiver variable.

```kex
dequeue : (A, Queue<A>)?
```

**Returns**: `(A, Queue<A>)?` — the front element and the rest, or `None`

**Examples**

```kex
Queue.from([1, 2, 3]).dequeue   # => Just((1, Queue(2, 3)))
Queue.empty.dequeue             # => None
```

#### `peek`

Returns the front element wrapped in `Just`, or `None` for an empty queue.

```kex
peek : A?
```

**Returns**: `A?` — the front element, or `None`

**Examples**

```kex
Queue.from([1, 2]).peek   # => Just(1)
Queue.empty.peek          # => None
```

#### `==`

Compares two queues by their elements, front to back: NOT by their `front`/`back` split, which is not canonical. See the file header.

```kex
==(other) : Queue<A> -> Bool
```

**Returns**: `Bool` — `true` when both hold the same elements in the same order

**Examples**

```kex
Queue.from([1, 2]) == Queue.from([1]).enqueue(2)   # => true
```

#### `+`

Appends another queue's elements, or a plain list's.

```kex
+(other) : Queue<A> -> Queue<A>
+(other) : [A] -> Queue<A>
```

**Returns**: `Queue<A>` — this queue's elements, then `other`'s

**Examples**

```kex
Queue.from([1, 2]) ` [3, 4]            # => Queue(1, 2, 3, 4)
Queue.from([1, 2]) ` Queue.from([3])   # => Queue(1, 2, 3)
```

## make `Queue<A>` implements [Blankable](../blankable.md#trait-blankable)


