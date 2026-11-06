---
package: prelude
version: "0.4.0-beta.4-dev"
source: map.kex
title: Map
entities:
  - { kind: type, name: "Map" }
  - { kind: make, name: "Map<K, V>" }
---

# Map

An immutable key-value store, written `{key: value}`.

Keys are compared by structural equality and may be of any type; atom keys get the shorthand `{name: "Ada"}`, string keys are written out in full as `{"name": "Ada"}`. Every method answers with a new map: the `!` forms (`put!`, `delete!`) build a new map and rebind the receiver variable, they do not modify anything in place.

Entries come back in canonical key order, not insertion order, so `keys`, `values`, `entries` and any traversal are stable and comparable across equal maps.

```kex
let config = { host: "localhost", port: 8080 }
config.get(:host).or("0.0.0.0")     # => "localhost"
config.get(:user).or("anonymous")   # => "anonymous"
config.put(:port, 9090)             # => { :host: "localhost", :port: 9090 }
```

A map is `Enumerable` and `Foldable`, and the traversal blocks take the key and value as two parameters:

```kex
config.each { |k, v| IO.printLine("${k} = ${v}") }
config.filter { |k, v| k != :port }   # => { :host: "localhost" }
```

## type `Map<K, V>`

Declared for the same reason list.kex declares `type List<X> = [X]`: it gives the name `Map` a source declaration, so it resolves as a type through the collected interfaces rather than needing to be known to the compiler.

Implements [`Enumerable`](enumerable.md#trait-enumerable), [`Foldable`](enumerable.md#trait-foldable), [`Monoid`](algebra.md#trait-monoid), [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

### Methods

#### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: A, g: (A -> (K, V) -> A)) -> A
```

Folds over the map's `(key, value)` pairs in canonical key order.

This is `Map`'s `Enumerable` primitive: `map`, `filter`, `find`, `any?` and the rest are built on it. The block receives the accumulator and one pair; destructure the pair to name its halves.

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
{ a: 1, b: 2 }.entries.map { |k, v| "${k}=${v}" }.join("&")
```

#### `identity` (from Monoid)

The empty map: the identity element of the `Monoid` instance, so `m.combine({})` is `m`.

**Returns**: `Map<K, V>` — the empty map

**Examples**

```kex
Map.identity   # => {}
```

#### `combine` (from Monoid)

```kex
combine(other: This) -> This
```

Combines two maps by merging them, with `other`'s values winning on a key conflict. The `Monoid` operation, and the same thing `merge` does.

**Parameters**

  - `other` — the map to merge in

**Returns**: the combined map

**Examples**

```kex
{ a: 1 }.combine({ b: 2 })   # => { :a: 1, :b: 2 }
```

_Folding a list of maps into one_

```kex
[{ a: 1 }, { b: 2 }, { a: 9 }].reduce({}) { |acc, m| acc.combine(m) }
# => { :a: 9, :b: 2 }
```

#### `get`

```kex
get(key: K) -> V?
get(key: K, default: V) -> V
```

Returns the value stored under `key`, or `None` when the key is absent.

Missing keys are an ordinary answer rather than a failure, so a lookup on data you did not produce is safe by default. Use the two-argument form below when you have a sensible fallback.

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
settings.get(:server).flatMap { |s| s.get(:port) }.or(8080)
```

#### `put`

```kex
put(k: K, v: V) -> Map<K, V>
```

Returns a new map with `key` mapped to `value`, replacing any previous entry for that key.

The receiver is untouched. Use `put!` when you want the variable holding the map to be rebound to the result.

**Parameters**

  - `k` — the key to set
  - `v` — the value to store

**Returns**: a new map including the entry

**Examples**

```kex
{}.put(:x, 1)              # => { :x: 1 }
{ x: 1 }.put(:x, 2)        # => { :x: 2 }
```

_Rebinding with the +!+ form_

```kex
var totals = {}
totals.put!(:visits, 1)
totals                     # => { :visits: 1 }
```

#### `delete`

```kex
delete(key: K) -> Map<K, V>
```

Returns a new map without `key`. A key that is not present is not an error: the map comes back unchanged.

Use `delete!` to rebind the receiver variable.

**Parameters**

  - `key` — the key to remove

**Returns**: a new map without that entry

**Examples**

```kex
{ a: 1, b: 2 }.delete(:a)   # => { :b: 2 }
{ a: 1 }.delete(:z)         # => { :a: 1 }
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

Distinguishes a missing key from one whose value is itself empty, which a `get` with a default cannot.

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
empty? : Bool
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
count : Integer
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
keys : [K]
```

Returns the map's keys as a list, in canonical key order.

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
values : [V]
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
entries : [(K, V)]
```

Returns the map's entries as a list of `(key, value)` tuples, in canonical key order.

This is the bridge to the `List` methods a map does not have of its own, and the form the two-parameter blocks elsewhere are splatting from.

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

Applies `f` to each key and value and collects the results into a LIST.

Note the return type: `map` comes from `Enumerable`, whose contract is to produce a list, because `f` may return anything at all. Use `mapValues` or `mapKeys` when you want a map back.

**Parameters**

  - `f` — applied to each entry

**Returns**: the results, in canonical key order

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
{ a: 1, b: 2 }.mapValues { |v| v * 10 }   # => { :a: 10, :b: 20 }
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

If `f` maps two keys onto the same result, one entry wins: the map cannot hold both.

**Parameters**

  - `f` — applied to each key

**Returns**: a map with transformed keys

**Examples**

```kex
{ "a": 1, "b": 2 }.mapKeys { |k| k.upperCase }   # => { A: 1, B: 2 }
```

_Making header lookups case-insensitive_

```kex
headers.mapKeys { |name| name.lowerCase }
```

#### `filter` (from Enumerable)

```kex
filter(pred: (K -> V -> Bool)) -> Map<K, V>
```

Returns a new map with only the entries for which `pred` answers `true`.

Map overrides the map-returning HOFs (Enumerable's default returns a list).

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: the matching entries

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.filter { |k, v| v > 1 }   # => { :b: 2, :c: 3 }
```

_Keeping only the options that were actually set_

```kex
options.filter { |name, value| !value.blank? }
```

#### `reject`

```kex
reject(pred: (K -> V -> Bool)) -> Map<K, V>
```

Returns a new map with the entries for which `pred` answers `true` removed. The complement of `filter`.

**Parameters**

  - `pred` — the test applied to each entry

**Returns**: the entries that failed the predicate

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.reject { |k, v| v > 1 }   # => { :a: 1 }
```

_Dropping internal keys before serialising_

```kex
record.reject { |name, _| name.startsWith?("_") }
```

#### `merge`

```kex
merge(other: Map<K, V>) -> Map<K, V>
```

Returns a new map holding the entries of both. When a key appears in both, `other`'s value wins.

The right-biased rule is what makes this the natural way to apply overrides on top of defaults.

**Parameters**

  - `other` — the map whose values take precedence

**Returns**: the combined map

**Examples**

```kex
{ a: 1, b: 2 }.merge({ b: 99, c: 3 })   # => { :a: 1, :b: 99, :c: 3 }
```

_Layering user settings over defaults_

```kex
defaults.merge(userConfig)
```

#### `any?` (from Foldable)

```kex
any?(pred: (K -> V -> Bool)) -> Bool
```

Returns `true` when at least one entry satisfies `pred`. Stops at the first match.

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

Returns `true` when every entry satisfies `pred`. The empty map answers `true`.

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

Returns the first entry satisfying `pred` as a `(key, value)` tuple, or `None` when nothing matches.

"First" means first in canonical key order.

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

#### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` when the map has no entries. The `Blankable` view of `empty?`, so a map can be tested by the same generic code that tests strings and lists.

**Returns**: `true` for the empty map

**Examples**

```kex
{}.blank?         # => true
{ a: 1 }.blank?   # => false
```

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and collects the results into a list.
  - [`flatMap`](enumerable.md#enumerable-flatmap) — Applies `f` to each item, expecting a list back, and concatenates the results into one flat list.
  - [`collect`](enumerable.md#enumerable-collect) — Applies `f` to each item, expecting an `Optional` back, and returns the values that were present: unwrapped.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### Defined in other modules

  - [Truthyable](truthyable.md#make-map): [`truthy?`](truthyable.md#map-truthy?)
