---
package: prelude
version: "0.3.0-beta"
source: range.kex
title: Range
entities:
  - { kind: make, name: "Range" }
---

# Range

## type `Range`

Implements `Enumerable`, `Foldable`.

Range — a range computes everything from its two bounds; `items` materializes the elements into a real list when one is needed.

### `reduce`

```kex
reduce(acc, f)
```

Shared primitive for Enumerable and Foldable. Range stays structurally minimal; inherited operations reduce over its materialized items in ascending range order.

### `sum`

Numeric range aggregates are expressed in terms of the Enumerable primitive rather than relying on the walker's historical List fallback.

### `product`



### `contains?`

```kex
contains?(value)
```

Membership is a Range method, not a fallback into the bare String/List native dispatcher.

### `items`

The range's elements as a list.

**Examples**

```kex
(1..3).items      # => [1, 2, 3]
('a'..'c').items  # => ['a', 'b', 'c']
```

### `first`

The list operations, over the materialized items. A range is an ordered collection, so `(1..5).first` and `(1..5).length` are questions it can answer — and on the BEAM backend, where a range IS its item list, they already worked. Only the walker rejected them ("Undefined method: first for Range"), so every one of these was a backend divergence rather than a deliberate restriction.

### `second`



### `third`



### `last`



### `rest`



### `length`



### `count`



### `empty?`



### `max`



### `min`



### `reverse`



### `sort`



```kex
sort(comparator)
```

### `uniq`



### `join`

```kex
join(separator)
```

### `at`

```kex
at(index, fallback)
```

### `take`

```kex
take(n)
```

### `drop`

```kex
drop(n)
```

### `indexOf`

```kex
indexOf(value)
```

### `zip`

```kex
zip(other)
```

### `partition`

```kex
partition(pred)
```

### `push`

```kex
push(value)
```

### `reject`

```kex
reject(pred)
```


