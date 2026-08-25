---
package: prelude
version: "0.3.4"
source: map.kex
title: Map
entities:
  - { kind: type, name: "Map" }
  - { kind: make, name: "Map<K, V>" }
  - { kind: make, name: "Map<K, V>" }
---

# Map

## type `Map<K, V>`

Maps are immutable key-value stores. Mutation methods (suffixed `!`) return a new map and rebind the receiver variable — they do not modify in place. Keys are compared by structural equality.

Declared for the same reason list.kex declares `type List<X> = [X]`: it gives the name `Map` a source declaration, so it resolves as a type through the collected interfaces rather than needing to be known to the compiler.



**Variants**

  - _(abstract)_

## make `Map<K, V>` implements Enumerable, Foldable, [Monoid](algebra.md#trait-monoid)


#### `reduce`

Enumerable primitive: fold over (key, value) pairs in canonical (sorted) order. Collection-producing operations come from Enumerable and traversal queries come from Foldable; their two-arg blocks auto-splat each pair.

```kex
reduce(acc, g)
```

#### `combine`

```kex
combine(other)
```

#### `get`

Returns the value for `key` wrapped in `Just`, or `None` if absent. When a `default` is supplied, returns the raw unwrapped value instead.

```kex
get(key) : K -> V?
get(key) : K -> V -> V
```

**Examples**

```kex
  m = { name: "Alice", age: 32 }
  m.get(:name)         # => Just("Alice")
  m.get(:missing, 0)   # => 0
```

#### `put`

Returns a new map with `key` mapped to `value`. Use `put!` to rebind the receiver variable.

```kex
put(k, v) : K -> V -> Map<K, V>
```

**Examples**

```kex
  m = {}
  m.put!(:x, 1)   # => { x: 1 }
```

#### `delete`

Returns a new map without `key`. No-op if the key is absent. Use `delete!` to rebind the receiver variable.

```kex
delete(key) : K -> Map<K, V>
```

**Examples**

```kex
  { a: 1, b: 2 }.delete(:a)   # => { b: 2 }
```

#### `has?`

Returns `true` if `key` exists in the map.

```kex
has?(key) : K -> Bool
```

**Examples**

```kex
  { a: 1 }.has?(:a)   # => true
```

#### `count`

```kex
count : (K -> V -> Bool) -> Integer
```

#### `each`

Calls `f` with each key-value pair for its side effects.

```kex
each : (K -> V -> Void) -> Void
```

**Examples**

```kex
  scores.each { |k, v| IO.printLine("${k}: ${v}") }
```

#### `map`

Transforms each entry by calling `f(k, v)`. Returns a list of results.

```kex
map : (K -> V -> R) -> [R]
```

**Examples**

```kex
  { a: 1, b: 2 }.map { |k, v| "${k}=${v}" }   # => ["a=1", "b=2"]
```

#### `mapValues`

Returns a new map with all values transformed by `f`.

```kex
mapValues(f) : (V -> W) -> Map<K, W>
```

**Examples**

```kex
  { a: 1, b: 2 }.mapValues { |v| v * 10 }   # => { a: 10, b: 20 }
```

#### `mapKeys`

Returns a new map with all keys transformed by `f`.

```kex
mapKeys(f) : (K -> J) -> Map<J, V>
```

**Examples**

```kex
  { a: 1, b: 2 }.mapKeys { |k| k.upperCase }   # => { A: 1, B: 2 }
```

#### `filter`

Returns a new map keeping only entries for which `pred` returns `true`.

```kex
filter(pred) : (K -> V -> Bool) -> Map<K, V>
```

**Examples**

```kex
  { a: 1, b: 2, c: 3 }.filter { |k, v| v > 1 }   # => { b: 2, c: 3 }
Map overrides the map-returning HOFs (Enumerable's default returns a list).
```

#### `reject`

Returns a new map with all entries for which `pred` returns `true` removed.

```kex
reject(pred) : (K -> V -> Bool) -> Map<K, V>
```

**Examples**

```kex
  { a: 1, b: 2, c: 3 }.reject { |k, v| v > 1 }   # => { a: 1 }
```

#### `merge`

Returns a new map combining `this` and `other`. On key conflict, `other`'s value wins.

```kex
merge(other) : Map<K, V> -> Map<K, V>
```

**Examples**

```kex
  { a: 1, b: 2 }.merge({ b: 99, c: 3 })   # => { a: 1, b: 99, c: 3 }
```

#### `any?`

Returns `true` if at least one entry satisfies `pred`.

```kex
any? : (K -> V -> Bool) -> Bool
```

**Examples**

```kex
  { a: 1, b: 2 }.any? { |k, v| v > 1 }   # => true
```

#### `all?`

Returns `true` if every entry satisfies `pred`.

```kex
all? : (K -> V -> Bool) -> Bool
```

**Examples**

```kex
  { a: 1, b: 2 }.all? { |k, v| v > 0 }   # => true
```

#### `find`

Returns the first entry satisfying `pred` as a tuple wrapped in `Just`, or `None` if no entry matches.

```kex
find : (K -> V -> Bool) -> (K, V)?
```

**Examples**

```kex
  { a: 1, b: 2 }.find { |k, v| v > 1 }   # => Just((:b, 2))
```

## make `Map<K, V>` implements [Blankable](blankable.md#trait-blankable)


