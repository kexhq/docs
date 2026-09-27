---
package: prelude
version: "0.3.0"
source: map.kex
title: Map
entities:
  - { kind: type, name: "Map" }
  - { kind: make, name: "Map<K, V>" }
---

# Map

Maps are immutable key-value stores. Mutation methods (suffixed `!`) return a new map and rebind the receiver variable — they do not modify in place. Keys are compared by structural equality.

## type `Map<K, V>`

Declared for the same reason list.kex declares `type List<X> = [X]`: it gives the name `Map` a source declaration, so it resolves as a type through the collected interfaces rather than needing to be known to the compiler.

Implements `Enumerable`, `Foldable`, [`Monoid`](algebra.md#trait-monoid), [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

### Methods

#### `reduce`

```kex
reduce(acc, g)
```

Enumerable primitive: fold over (key, value) pairs in canonical (sorted) order. Collection-producing operations come from Enumerable and traversal queries come from Foldable; their two-arg blocks auto-splat each pair.

#### `identity` (from Monoid)

Maps form a right-biased Monoid under merge.

#### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

#### `get`

```kex
get(key: K) -> V?
get(key: K, default: V) -> V
```

Returns the value for `key` wrapped in `Just`, or `None` if absent. When a `default` is supplied, returns the raw unwrapped value instead.

**Examples**

```kex
m = { name: "Alice", age: 32 }
m.get(:name)         # => Just("Alice")
m.get(:missing, 0)   # => 0
```

#### `put`

```kex
put(k: K, v: V) -> Map<K, V>
```

Returns a new map with `key` mapped to `value`. Use `put!` to rebind the receiver variable.

**Examples**

```kex
m = {}
m.put!(:x, 1)   # => { x: 1 }
```

#### `delete`

```kex
delete(key: K) -> Map<K, V>
```

Returns a new map without `key`. No-op if the key is absent. Use `delete!` to rebind the receiver variable.

**Examples**

```kex
{ a: 1, b: 2 }.delete(:a)   # => { b: 2 }
```

#### `has?`

```kex
has?(key: K) -> Bool
```

Returns `true` if `key` exists in the map.

**Examples**

```kex
{ a: 1 }.has?(:a)   # => true
```

#### `empty?`

```kex
empty? : Bool
```

Returns `true` if the map has no entries.

**Examples**

```kex
{}.empty?   # => true
```

#### `count`

```kex
count : Integer
```

Returns the number of key-value pairs. When given a predicate, counts only matching entries.

**Examples**

```kex
{ a: 1, b: 2 }.count                        # => 2
{ a: 1, b: 2 }.count { |k, v| v > 1 }       # => 1
```

```kex
count : (K -> V -> Bool) -> Integer
```

#### `keys`

```kex
keys : [K]
```

Returns all keys as a list, in insertion order.

**Examples**

```kex
{ a: 1, b: 2 }.keys   # => [:a, :b]
```

#### `values`

```kex
values : [V]
```

Returns all values as a list, in insertion order.

**Examples**

```kex
{ a: 1, b: 2 }.values   # => [1, 2]
```

#### `entries`

```kex
entries : [(K, V)]
```

Returns all key-value pairs as a list of tuples, in insertion order.

**Examples**

```kex
{ a: 1, b: 2 }.entries   # => [(:a, 1), (:b, 2)]
```

#### `each`

```kex
each : (K -> V -> Void) -> Void
```

Calls `f` with each key-value pair for its side effects.

**Examples**

```kex
scores.each { |k, v| IO.printLine("${k}: ${v}") }
```

#### `map`

```kex
map : (K -> V -> R) -> [R]
```

Transforms each entry by calling `f(k, v)`. Returns a list of results.

**Examples**

```kex
{ a: 1, b: 2 }.map { |k, v| "${k}=${v}" }   # => ["a=1", "b=2"]
```

#### `mapValues`

```kex
mapValues(f: (V -> W)) -> Map<K, W>
```

Returns a new map with all values transformed by `f`.

**Examples**

```kex
{ a: 1, b: 2 }.mapValues { |v| v * 10 }   # => { a: 10, b: 20 }
```

#### `mapKeys`

```kex
mapKeys(f: (K -> J)) -> Map<J, V>
```

Returns a new map with all keys transformed by `f`.

**Examples**

```kex
{ a: 1, b: 2 }.mapKeys { |k| k.upperCase }   # => { A: 1, B: 2 }
```

#### `filter`

```kex
filter(pred: (K -> V -> Bool)) -> Map<K, V>
```

Returns a new map keeping only entries for which `pred` returns `true`.

Map overrides the map-returning HOFs (Enumerable's default returns a list).

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.filter { |k, v| v > 1 }   # => { b: 2, c: 3 }
```

#### `reject`

```kex
reject(pred: (K -> V -> Bool)) -> Map<K, V>
```

Returns a new map with all entries for which `pred` returns `true` removed.

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.reject { |k, v| v > 1 }   # => { a: 1 }
```

#### `merge`

```kex
merge(other: Map<K, V>) -> Map<K, V>
```

Returns a new map combining `this` and `other`. On key conflict, `other`'s value wins.

**Examples**

```kex
{ a: 1, b: 2 }.merge({ b: 99, c: 3 })   # => { a: 1, b: 99, c: 3 }
```

#### `any?`

```kex
any? : (K -> V -> Bool) -> Bool
```

Returns `true` if at least one entry satisfies `pred`.

**Examples**

```kex
{ a: 1, b: 2 }.any? { |k, v| v > 1 }   # => true
```

#### `all?`

```kex
all? : (K -> V -> Bool) -> Bool
```

Returns `true` if every entry satisfies `pred`.

**Examples**

```kex
{ a: 1, b: 2 }.all? { |k, v| v > 0 }   # => true
```

#### `find`

```kex
find : (K -> V -> Bool) -> (K, V)?
```

Returns the first entry satisfying `pred` as a tuple wrapped in `Just`, or `None` if no entry matches.

**Examples**

```kex
{ a: 1, b: 2 }.find { |k, v| v > 1 }   # => Just((:b, 2))
```

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### Defined in other modules

  - [Truthyable](truthyable.md#make-map): [`truthy?`](truthyable.md#map-truthy?)
