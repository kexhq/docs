---
id: "c53b0c85f523d0b2ec5cc40562f0f7d9bf65079fa854f2d05b71fc7efad0e69f"
title: "Compound types"
path: "/guide/0.4.0/overview/compound-types/"
draft: true
template: "page"
---
Compound types turn primitive values into more practical structures, such as lists, tuples, maps, and sets.

## Lists

Are a collection which can be used to store multiple values of the same type together:

```kex
let nums = [1, 2, 3]         # [Integer]
let chars = ['a', 'b', 'c']  # [Char]
let bools = [true, false]    # [Bool]
let strings = ["ABC", "D"]   # [String]
```

As you can see the list iteral is defined within `[]`, individual elements are separated by `,`.

The standard library comes with many handy functions already defined. Later chapters will explain in detail how they work and how to use them, but for now, let's look at how they're used in this simple example for lists:

```kex
main do
  let numbers = [1, 2, 3, 4, 5]

  let evens = numbers.filter { |n| n.even? }
  let squares = evens.map { |n| n * n }
  let sum = squares.sum
  let f = numbers.first
  let last = numbers[4]

  IO.printLine(evens)
  IO.printLine(squares)
  IO.printLine(sum)
  IO.printLine(f)
  IO.printLine(last)
end
```

```output filename="OUTPUT"
[2, 4]
[4, 16]
20
1
5
```

`map` transforms each element, `filter` keeps matching elements, and sum adds the items together.

The operator `|` can be used for prepending an element at the start of the list. The spread operator `...` puts a list into another list, element by element: 

```kex
let original = [2, 3]
let prepended = [1 | original]      # [1, 2, 3]
let expanded = [0, ...original, 4]  # [0, 1, 2, 3, 4]
```

List can also contain other lists or other compound types:

```kex
let original = [2, 3]
let list = [[1], original, [4, 5]]  # [[1], [2, 3], [3, 5]]
```

## Tuples and maps

While lists only contains elements of the same type, tuples al

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
