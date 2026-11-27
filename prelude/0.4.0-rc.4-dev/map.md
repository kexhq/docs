---
package: prelude
version: "0.4.0-rc.4-dev"
source: map.kex
title: Map
entities:
  - { kind: type, name: "Map" }
  - { kind: make, name: "Map<K, V>" }
  - { kind: module, name: "Map" }
---

# Map

An immutable key-value store, written `{key: value}`.

Keys may be of any type and are compared by structural equality. Atom keys have the shorthand `{name: "Ada"}`; other keys are written in full, as in `{"name": "Ada"}`. Every value in a map has the same type.

Updates return a new map. The `!` forms, such as `put!` and `delete!`, rebind the variable to the new map; nothing is modified in place.

Entries come back sorted by key, not in insertion order, so `keys`, `values`, `entries` and every traversal give the same order for equal maps.

```kex
let config = { host: "localhost", port: "8080" }
config.get(:host).or("0.0.0.0")     # => "localhost"
config.get(:user).or("anonymous")   # => "anonymous"
config.put(:port, "9090")           # => { host: "localhost", port: "9090" }
```

Maps implement `Enumerable` and `Foldable`. The blocks given to `each`, `map`, `filter`, `reject`, `find`, `any?`, `all?`, `none?`, `one?`, `count`, `collect` and `into` take the key and the value as two parameters, and `mapIndexed` adds the index as a third. Only `reduce` passes each entry as one `(key, value)` tuple.

```kex
config.each { |k, v| IO.printLine("${k} = ${v}") }
config.filter { |k, v| k != :port }   # => { host: "localhost" }
config.collect { |k, v| k == :port then Just(v) else None }   # => ["8080"]
config.mapIndexed { |k, v, i| "${i}. ${k}" }   # => ["0. :host", "1. :port"]
```

## type `Map<K, V>`

The type of maps from `K` to `V`, usually written `{K: V}`.

Implements [`Enumerable<(K, V)>`](enumerable.md#trait-enumerable), [`Foldable<(K, V)>`](enumerable.md#trait-foldable), [`Monoid`](algebra.md#trait-monoid), [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

### Functions

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: A, g: (A -> (K, V) -> A)) -> A
```

Folds over the map's `(key, value)` pairs in key order.

`Enumerable` builds `map`, `filter`, `find`, `any?` and the rest on it. The block receives the accumulator and one pair, which you destructure to get the key and value.

**Parameters**

  - `acc` — the initial accumulator
  - `g` — combines the accumulator with each pair

**Returns**: the final accumulator

**Examples**

_Summing the values_

```kex
{ a: 1, b: 2 }.reduce(0) do |acc, pair|
  let (key, value) = pair
  acc + value
end
# => 3
```

_Rendering the map as a query string_

```kex
{ "a": 1, "b": 2 }.entries.map { |k, v| "${k}=${v}" }.join("&")   # => "a=1&b=2"
```

#### `identity` (from Monoid)

```kex
identity -> This
```

Returns the empty map, the `Monoid` identity: `m.combine({})` is `m`.

**Returns**: the empty map

**Examples**

```kex
{ a: 1 }.identity   # => {}
```

#### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

Merges two maps, keeping `other`'s value when both have a key. This is the `Monoid` operation, and does the same as `merge`.

**Parameters**

  - `other` — the map to merge in

**Returns**: the combined map

**Examples**

```kex
{ a: 1 }.combine({ b: 2 })   # => { a: 1, b: 2 }
```

_Folding a list of maps into one_

```kex
[{ a: 1 }, { b: 2 }, { a: 9 }].reduce({}) { |acc, m| acc.combine(m) }
# => { a: 9, b: 2 }
```

#### `get`

```kex
get(key: K) -> V?
get(key: K, default: V) -> V
```

Returns the value stored under `key`, or `None` when the key is absent.

When there is a sensible fallback, `get(key, default)` returns the value unwrapped.

**Parameters**

  - `key` — the key to look up

**Returns**: the value, or `None`

**Examples**

```kex
let user = { name: "Alice", age: 32 }
user.get(:name)      # => Just("Alice")
user.get(:missing)   # => None
```

_Chaining through a nested map_

```kex
settings.get(:server).into { |s| s.get(:port) }.or(8080)
```

#### `put`

```kex
put(k: K, v: V) -> Map<K, V>
```

Returns a new map with `k` mapped to `v`, replacing any previous entry for that key.

The original map is unchanged. `put!` rebinds the variable holding the map to the result.

**Parameters**

  - `k` — the key to set
  - `v` — the value to store

**Returns**: a new map including the entry

**Examples**

```kex
{}.put(:x, 1)              # => { x: 1 }
{ x: 1 }.put(:x, 2)        # => { x: 2 }
```

_Rebinding with the +!+ form_

```kex
var totals = {}
totals.put!(:visits, 1)
totals                     # => { visits: 1 }
```

#### `delete`

```kex
delete(key: K) -> Map<K, V>
```

Returns a new map without `key`, or the same map when `key` is not present. `delete!` rebinds the variable instead.

**Parameters**

  - `key` — the key to remove

**Returns**: a new map without that entry

**Examples**

```kex
{ a: 1, b: 2 }.delete(:a)   # => { b: 2 }
{ a: 1 }.delete(:z)         # => { a: 1 }
```

_Stripping a secret before logging_

```kex
IO.printLine(params.delete(:password))
```

#### `has?`

```kex
has?(key: K) -> Bool
```

Returns `true` when `key` has an entry in the map.

Unlike `get` with a default, it tells a missing key apart from a key whose value happens to equal the default.

**Parameters**

  - `key` — the key to test

**Returns**: `true` when the key is present

**Examples**

```kex
{ a: 1 }.has?(:a)   # => true
{ a: 1 }.has?(:z)   # => false
```

_Checking a required setting_

```kex
if !config.has?(:host)
  IO.printError("host is required")
end
```

#### `empty?`

```kex
empty? -> Bool
```

Returns `true` when the map has no entries.

**Returns**: `true` for the empty map

**Examples**

```kex
{}.empty?         # => true
{ a: 1 }.empty?   # => false
```

#### `count` (from Foldable)

```kex
count -> Integer
```

Returns the number of entries.

**Returns**: the entry count

**Examples**

```kex
{ a: 1, b: 2 }.count   # => 2
{}.count               # => 0
```

```kex
count(pred: (K -> V -> Bool)) -> Integer
```

Returns the number of entries satisfying `pred`.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: how many entries matched

**Examples**

```kex
{ a: 1, b: 2 }.count { |k, v| v > 1 }   # => 1
```

_How many settings are still at their default_

```kex
config.count { |k, v| v == defaults.get(k, v) }
```

#### `keys`

```kex
keys -> [K]
```

Returns the map's keys as a sorted list.

**Returns**: the keys

**Examples**

```kex
{ b: 1, a: 2 }.keys   # => [:a, :b]
```

_Reporting unrecognised options_

```kex
params.keys.reject { |k| known.contains?(k) }
```

#### `values`

```kex
values -> [V]
```

Returns the map's values as a list, ordered by their keys.

**Returns**: the values

**Examples**

```kex
{ a: 1, b: 2 }.values       # => [1, 2]
{ a: 1, b: 2 }.values.sum   # => 3
```

#### `entries`

```kex
entries -> [(K, V)]
```

Returns the map's entries as a list of `(key, value)` tuples, in key order.

Use it to reach the `List` functions that maps do not have, such as `sort`.

**Returns**: the entries

**Examples**

```kex
{ a: 1, b: 2 }.entries   # => [(:a, 1), (:b, 2)]
```

_Sorting entries by value_

```kex
scores.entries.sort { |x, y| x.items.last.or(0) > y.items.last.or(0) }
```

#### `each` (from Foldable)

```kex
each(f: (K -> V -> Void)) -> Void
```

Calls `f` with each key and value, for its side effects.

**Parameters**

  - `f` — called once per entry

**Examples**

```kex
scores.each { |k, v| IO.printLine("${k}: ${v}") }
```

#### `map` (from Enumerable)

```kex
map(f: (K -> V -> R)) -> [R]
```

Applies `f` to each key and value and returns the results as a list.

The result is a list, not a map, since `f` may return anything. To get a map back, use `mapValues` or `mapKeys`.

**Parameters**

  - `f` — applied to each entry

**Returns**: the results, in key order

**Examples**

```kex
{ "a": 1, "b": 2 }.map { |k, v| "${k}=${v}" }   # => ["a=1", "b=2"]
```

_Building a header block_

```kex
headers.map { |name, value| "${name}: ${value}" }.join("\n")
```

#### `mapValues`

```kex
mapValues(f: (V -> W)) -> Map<K, W>
```

Returns a new map with every value replaced by `f(value)`. The keys are left alone.

**Parameters**

  - `f` — applied to each value

**Returns**: a map with the same keys and transformed values

**Examples**

```kex
{ a: 1, b: 2 }.mapValues { |v| v * 10 }   # => { a: 10, b: 20 }
```

_Normalising values read as text_

```kex
raw.mapValues { |s| s.trim.lowerCase }
```

#### `mapKeys`

```kex
mapKeys(f: (K -> J)) -> Map<J, V>
```

Returns a new map with every key replaced by `f(key)`. The values are left alone.

If `f` maps two keys to the same result, the entry whose original key sorts last wins.

**Parameters**

  - `f` — applied to each key

**Returns**: a map with transformed keys

**Examples**

```kex
{ "a": 1, "b": 2 }.mapKeys { |k| k.upperCase }   # => { "A": 1, "B": 2 }
{ "a": 1, "b": 2 }.mapKeys { |k| "x" }           # => { "x": 2 }
```

_Making header lookups case-insensitive_

```kex
headers.mapKeys { |name| name.lowerCase }
```

#### `filter` (from Enumerable)

```kex
filter(pred: (K -> V -> Bool)) -> Map<K, V>
```

Returns a map of the entries for which `pred` returns `true`. Unlike `map`, it returns a map.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: the matching entries

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.filter { |k, v| v > 1 }   # => { b: 2, c: 3 }
```

_Keeping only the options that were set_

```kex
options.filter { |name, value| !value.blank? }
```

#### `reject`

```kex
reject(pred: (K -> V -> Bool)) -> Map<K, V>
```

Returns a map of the entries for which `pred` returns `false`, the opposite of `filter`.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: the entries that failed the predicate

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.reject { |k, v| v > 1 }   # => { a: 1 }
```

_Dropping internal keys before serialising_

```kex
record.reject { |name, _| name.startsWith?("_") }
```

#### `merge`

```kex
merge(other: Map<K, V>) -> Map<K, V>
```

Returns a new map holding the entries of both. When a key appears in both, `other`'s value wins, which makes it the way to lay overrides on top of defaults.

**Parameters**

  - `other` — the map whose values take precedence

**Returns**: the combined map

**Examples**

```kex
{ a: 1, b: 2 }.merge({ b: 99, c: 3 })   # => { a: 1, b: 99, c: 3 }
```

_Layering user settings over defaults_

```kex
defaults.merge(userConfig)
```

#### `update`

```kex
update(key: K, f: (V -> V)) -> Map<K, V>
update(key: K, default: V, f: (V -> V)) -> Map<K, V>
```

Replaces the value under `key` with `f` applied to it. A missing key stays missing; to start from a value, pass a default as the second argument.

**Parameters**

  - `key` — the key to update
  - `f` — computes the new value from the old

**Returns**: the map with that one value replaced

**Examples**

```kex
{ "a": 1 }.update("a") { |n| n + 1 }   # => { "a": 2 }
{ "a": 1 }.update("b") { |n| n + 1 }   # => { "a": 1 }
```

#### `any?` (from Foldable)

```kex
any?(pred: (K -> V -> Bool)) -> Bool
```

Returns `true` when at least one entry satisfies `pred`.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: `true` when any entry matches

**Examples**

```kex
{ a: 1, b: 2 }.any? { |k, v| v > 1 }   # => true
{ a: 1, b: 2 }.any? { |k, v| v > 9 }   # => false
```

#### `all?` (from Foldable)

```kex
all?(pred: (K -> V -> Bool)) -> Bool
```

Returns `true` when every entry satisfies `pred`, and `true` for the empty map.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: `true` when all entries match

**Examples**

```kex
{ a: 1, b: 2 }.all? { |k, v| v > 0 }   # => true
{ a: 1, b: 2 }.all? { |k, v| v > 1 }   # => false
```

_Validating a form_

```kex
fields.all? { |name, value| !value.blank? }
```

#### `find` (from Foldable)

```kex
find(pred: (K -> V -> Bool)) -> (K, V)?
```

Returns the first entry, in key order, that satisfies `pred` as a `(key, value)` tuple, or `None` when nothing matches.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: the matching entry, or `None`

**Examples**

```kex
{ a: 1, b: 2 }.find { |k, v| v > 1 }   # => Just((:b, 2))
{ a: 1, b: 2 }.find { |k, v| v > 9 }   # => None
```

_Locating a value without knowing its key_

```kex
users.find { |id, user| user.email == target }
```

#### `none?` (from Foldable)

```kex
none?(pred: (K -> V -> Bool)) -> Bool
```

Returns `true` when no entry satisfies `pred`.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: `true` when nothing matches

**Examples**

```kex
{ a: 1, b: 2 }.none? { |k, v| v > 5 }   # => true
```

#### `one?` (from Foldable)

```kex
one?(pred: (K -> V -> Bool)) -> Bool
```

Returns `true` when exactly one entry satisfies `pred`.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: `true` when one entry matches

**Examples**

```kex
{ a: 1, b: 2 }.one? { |k, v| v > 1 }   # => true
```

#### `matching`

```kex
matching(pred: (K -> V -> Bool)) -> [(K, V)]
```

The entries `pred` holds for, as (key, value) pairs.

#### `blank?` (from Blankable)

```kex
blank? -> Bool
```

Returns `true` when the map has no entries. It is `empty?` under the `Blankable` name, so generic code can test maps as it tests strings and lists.

**Returns**: `true` for the empty map

**Examples**

```kex
{}.blank?         # => true
{ a: 1 }.blank?   # => false
```

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and returns the results as a list.
  - [`into`](enumerable.md#enumerable-into) — Applies `f`, which returns a list, to each item and concatenates the results.
  - [`collect`](enumerable.md#enumerable-collect) — Applies `f`, which returns an `Optional`, to each item and returns the present values, unwrapped.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### Defined in other modules

  - [Truthyable](truthyable.md#make-map): [`truthy?`](truthyable.md#map-truthy?)

## module `Map`

### `from`

```kex
from(entries: [(K, V)]) -> Map<K, V>
```

Builds a map from `(key, value)` pairs. A key that appears more than once keeps its last value. Ruby calls this `to_h`.

**Parameters**

  - `entries` — the pairs

**Returns**: the map

**Examples**

```kex
Map.from([("a", 1), ("b", 2)])   # => { "a": 1, "b": 2 }
Map.from(m.entries) == m         # => true
```
