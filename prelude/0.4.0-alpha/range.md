---
package: prelude
version: "0.4.0-alpha"
source: range.kex
title: Range
entities:
  - { kind: type, name: "Range" }
  - { kind: make, name: "Range" }
---

# Range

## type `Range`

Range — a range computes everything from its two bounds; `items` materializes the elements into a real list when one is needed.



## make `Range` implements [Enumerable](enumerable.md#trait-enumerable), [Foldable](enumerable.md#trait-foldable)


#### `reduce`

Shared primitive for Enumerable and Foldable. Range stays structurally minimal; inherited operations reduce over its materialized items in ascending range order.

```kex
reduce(acc, f)
```

#### `contains?`

Membership is a Range method, not a fallback into the bare String/List native dispatcher.

```kex
contains?(value)
```

#### `sort`

```kex
sort(comparator)
```

#### `join`

```kex
join(separator)
```

#### `at`

```kex
at(index)
```

#### `take`

```kex
take(n)
```

#### `drop`

```kex
drop(n)
```

#### `indexOf`

```kex
indexOf(value)
```

#### `zip`

```kex
zip(other)
```

#### `partition`

```kex
partition(pred)
```

#### `push`

```kex
push(value)
```

#### `reject`

```kex
reject(pred)
```
