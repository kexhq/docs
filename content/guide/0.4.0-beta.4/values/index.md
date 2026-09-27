---
id: "guide-0-4-0-beta-4-values"
title: "Values and collections"
description: "Numbers, lists, tuples, maps, and collection transformations."
path: "/guide/0.4.0-beta.4/values/"
draft: false
template: "page"
---
Choose a value shape based on what the data means. A list holds a variable number of similar items; a tuple groups a fixed number of positions; a record names a fixed set of fields; a map associates keys with values.

## Numbers and small values

Plain integer literals use arbitrary-precision `Integer`. `Int` is a fixed-width alias for `Int64`, so use it when you specifically want that representation. Sized integer types include `Int8` and `UInt64`; `Byte` represents an unsigned byte. Plain floating literals use `Float`.

```kex
let population: Integer = 8_000_000_000
let ratio: Float = 0.25
let enabled: Bool = true
let status = :ready
assert(population + 1 == 8_000_000_001)
assert(ratio * 4.0 == 1.0)
assert(enabled && status == :ready)
```

Floating-point values are finite: an operation that would produce NaN or infinity raises a runtime failure. Use domain checks when dividing or applying operations with restricted inputs. `Integer.parse(text)` returns a `Result`; `text.to(Integer)` uses the optional conversion protocol.

Atoms such as `:ready` are symbolic labels. They differ from strings and from constructors of a declared sum type.

## Lists

```kex
let numbers = [1, 2, 3, 4, 5]
let evens = numbers.filter { |n| n % 2 == 0 }
let squares = evens.map { |n| n * n }
let sum = squares.reduce(0) { |acc, n| acc + n }
assert(squares == [4, 16])
assert(sum == 20)
assert(numbers.count == 5)
assert(numbers.find { |n| n > 3 } == Just(4))
assert(numbers.find { |n| n > 10 } == None)
```

`map` transforms each element, `filter` keeps matching elements, and `reduce` carries an accumulator. `find` answers an optional value because there might be no match. `any?` and `all?` answer predicates; `each` runs a callback for each element when you want effects rather than a new list.

Build new collections without modifying the old ones:

```kex
let original = [2, 3]
let prepended = [1 | original]
let expanded = [0, ...original, 4]
assert(prepended == [1, 2, 3])
assert(expanded == [0, 2, 3, 4])
assert(original == [2, 3])
```

## Tuples and maps

```kex
let location = ("Budapest", 47.5)
let (city, latitude) = location
let counts = { "apples": 3, "pears": 2 }
assert(city == "Budapest")
assert(latitude == 47.5)
assert(counts["apples"] == Just(3))
assert(counts["oranges"] == None)
```

Map lookup is optional. Decide deliberately whether a missing entry means a default, absence, or an error; `.or(0)` is appropriate for a missing count, but can hide missing configuration.

## Ranges and collection costs

```kex
assert((1..4).map { |n| n * 2 } == [2, 4, 6, 8])
assert(["one", "two"].join(", ") == "one, two")
```

Ranges include their endpoints. A range describes iteration compactly, but mapping it produces a collection. Use a [stream](../streams/) for a computed sequence that should stay lazy. A chain of list transformations may allocate intermediate lists; choose clarity first and measure before optimizing.

See the [standard library](/prelude/) for the full List, Map, Range, Foldable, and Enumerable APIs.
