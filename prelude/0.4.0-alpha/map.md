---
package: prelude
version: "0.4.0-alpha"
source: map.kex
title: Map
entities:
  - { kind: type, name: "Map" }
  - { kind: make, name: "Map<K, V>" }
  - { kind: make, name: "Map<K, V>" }
---

# Map

## type `Map<K, V>`

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

Declared for the same reason list.kex declares `type List<X> = [X]`: it gives the name `Map` a source declaration, so it resolves as a type through the collected interfaces rather than needing to be known to the compiler.



**Variants**

  - _(abstract)_

## make `Map<K, V>` implements [Enumerable](enumerable.md#trait-enumerable), [Foldable](enumerable.md#trait-foldable), [Monoid](algebra.md#trait-monoid)


#### `reduce`

Folds over the map's `(key, value)` pairs in canonical key order.

This is `Map`'s `Enumerable` primitive: `map`, `filter`, `find`, `any?` and the rest are built on it. The block receives the accumulator and one pair; destructure the pair to name its halves.

```kex
reduce(acc, g)
```

**Returns**: `A` — the final accumulator

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

#### `combine`

Combines two maps by merging them, with `other`'s values winning on a key conflict. The `Monoid` operation, and the same thing `merge` does.

```kex
combine(other)
```

**Returns**: `This` — the combined map

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

Returns the value stored under `key`, or `None` when the key is absent.

Missing keys are an ordinary answer rather than a failure, so a lookup on data you did not produce is safe by default. Use the two-argument form below when you have a sensible fallback.

```kex
get(key) : K -> V?
get(key) : K -> V -> V
```

**Returns**: `V?` — the value, or `None`

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

Returns a new map with `key` mapped to `value`, replacing any previous entry for that key.

The receiver is untouched. Use `put!` when you want the variable holding the map to be rebound to the result.

```kex
put(k, v) : K -> V -> Map<K, V>
```

**Returns**: `Map<K, V>` — a new map including the entry

**Examples**

```kex
{}.put(:x, 1)              # => { :x: 1 }
{ x: 1 }.put(:x, 2)        # => { :x: 2 }
```
_Rebinding with the `!` form_

```kex
var totals = {}
totals.put!(:visits, 1)
totals                     # => { :visits: 1 }
```

#### `delete`

Returns a new map without `key`. A key that is not present is not an error: the map comes back unchanged.

Use `delete!` to rebind the receiver variable.

```kex
delete(key) : K -> Map<K, V>
```

**Returns**: `Map<K, V>` — a new map without that entry

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

Returns `true` when `key` has an entry in the map.

Distinguishes a missing key from one whose value is itself empty, which a `get` with a default cannot.

```kex
has?(key) : K -> Bool
```

**Returns**: `Bool` — `true` when the key is present

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

#### `count`

Returns the number of entries satisfying `pred`.

```kex
count : (K -> V -> Bool) -> Integer
```

**Returns**: `Integer` — how many entries matched

**Examples**

```kex
{ a: 1, b: 2 }.count { |k, v| v > 1 }   # => 1
```
_How many settings are still at their default_

```kex
config.count { |k, v| v == defaults.get(k, v) }
```

#### `each`

Calls `f` with each key and value, for its side effects.

```kex
each : (K -> V -> Void) -> Void
```

**Returns**: `Void`

**Examples**

```kex
scores.each { |k, v| IO.printLine("${k}: ${v}") }
```

#### `map`

Applies `f` to each key and value and collects the results into a LIST.

Note the return type: `map` comes from `Enumerable`, whose contract is to produce a list, because `f` may return anything at all. Use `mapValues` or `mapKeys` when you want a map back.

```kex
map : (K -> V -> R) -> [R]
```

**Returns**: `[R]` — the results, in canonical key order

**Examples**

```kex
{ "a": 1, "b": 2 }.map { |k, v| "${k}=${v}" }   # => ["a=1", "b=2"]
```
_Building a header block_

```kex
headers.map { |name, value| "${name}: ${value}" }.join("\n")
```

#### `mapValues`

Returns a new map with every value replaced by `f(value)`. The keys are left alone.

```kex
mapValues(f) : (V -> W) -> Map<K, W>
```

**Returns**: `Map<K, W>` — a map with the same keys and transformed values

**Examples**

```kex
{ a: 1, b: 2 }.mapValues { |v| v * 10 }   # => { :a: 10, :b: 20 }
```
_Normalising values read as text_

```kex
raw.mapValues { |s| s.trim.lowerCase }
```

#### `mapKeys`

Returns a new map with every key replaced by `f(key)`. The values are left alone.

If `f` maps two keys onto the same result, one entry wins: the map cannot hold both.

```kex
mapKeys(f) : (K -> J) -> Map<J, V>
```

**Returns**: `Map<J, V>` — a map with transformed keys

**Examples**

```kex
{ "a": 1, "b": 2 }.mapKeys { |k| k.upperCase }   # => { A: 1, B: 2 }
```
_Making header lookups case-insensitive_

```kex
headers.mapKeys { |name| name.lowerCase }
```

#### `filter`

Returns a new map with only the entries for which `pred` answers `true`.

Map overrides the map-returning HOFs (Enumerable's default returns a list).

```kex
filter(pred) : (K -> V -> Bool) -> Map<K, V>
```

**Returns**: `Map<K, V>` — the matching entries

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.filter { |k, v| v > 1 }   # => { :b: 2, :c: 3 }
```
_Keeping only the options that were actually set_

```kex
options.filter { |name, value| !value.blank? }
```

#### `reject`

Returns a new map with the entries for which `pred` answers `true` removed. The complement of `filter`.

```kex
reject(pred) : (K -> V -> Bool) -> Map<K, V>
```

**Returns**: `Map<K, V>` — the entries that failed the predicate

**Examples**

```kex
{ a: 1, b: 2, c: 3 }.reject { |k, v| v > 1 }   # => { :a: 1 }
```
_Dropping internal keys before serialising_

```kex
record.reject { |name, _| name.startsWith?("_") }
```

#### `merge`

Returns a new map holding the entries of both. When a key appears in both, `other`'s value wins.

The right-biased rule is what makes this the natural way to apply overrides on top of defaults.

```kex
merge(other) : Map<K, V> -> Map<K, V>
```

**Returns**: `Map<K, V>` — the combined map

**Examples**

```kex
{ a: 1, b: 2 }.merge({ b: 99, c: 3 })   # => { :a: 1, :b: 99, :c: 3 }
```
_Layering user settings over defaults_

```kex
defaults.merge(userConfig)
```

#### `any?`

Returns `true` when at least one entry satisfies `pred`. Stops at the first match.

```kex
any? : (K -> V -> Bool) -> Bool
```

**Returns**: `Bool` — `true` when any entry matches

**Examples**

```kex
{ a: 1, b: 2 }.any? { |k, v| v > 1 }   # => true
{ a: 1, b: 2 }.any? { |k, v| v > 9 }   # => false
```

#### `all?`

Returns `true` when every entry satisfies `pred`. The empty map answers `true`.

```kex
all? : (K -> V -> Bool) -> Bool
```

**Returns**: `Bool` — `true` when all entries match

**Examples**

```kex
{ a: 1, b: 2 }.all? { |k, v| v > 0 }   # => true
{ a: 1, b: 2 }.all? { |k, v| v > 1 }   # => false
```
_Validating a form_

```kex
fields.all? { |name, value| !value.blank? }
```

#### `find`

Returns the first entry satisfying `pred` as a `(key, value)` tuple, or `None` when nothing matches.

"First" means first in canonical key order.

```kex
find : (K -> V -> Bool) -> (K, V)?
```

**Returns**: `(K, V)?` — the matching entry, or `None`

**Examples**

```kex
{ a: 1, b: 2 }.find { |k, v| v > 1 }   # => Just((:b, 2))
{ a: 1, b: 2 }.find { |k, v| v > 9 }   # => None
```
_Locating a value without knowing its key_

```kex
users.find { |id, user| user.email == target }
```

## make `Map<K, V>` implements [Blankable](blankable.md#trait-blankable)


