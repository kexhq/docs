---
id: "c53b0c85f523d0b2ec5cc40562f0f7d9bf65079fa854f2d05b71fc7efad0e69f"
title: "Compound values"
path: "/guide/0.4.0/overview/compound-types/"
draft: false
template: "page"
---
The [Values chapter](../../values/) introduced individual numbers, strings, and booleans. Lists, tuples, maps, and ranges let you group or generate values. Start with a list of values of one type:

## Lists

A list holds several values of the same type:

```kex
let nums = [1, 2, 3]         # [Integer]
let chars = ['a', 'b', 'c']  # [Char]
let bools = [true, false]    # [Bool]
let strings = ["ABC", "D"]   # [String]
```

Write a list between `[` and `]`, with commas between its elements.

The standard library provides functions for working with lists. This example keeps even numbers, squares them, and adds the squares:

```kex
main do
  let numbers = [1, 2, 3, 4, 5]

  let evens = numbers.filter { |n| n.even? } # => [2, 4]
  let squares = evens.map { |n| n * n }      # => [4, 16]
  let sum = squares.sum                      # => 20
  let f = numbers.first                      # => 1
  let last = numbers[4]                      # => Just(5)

  IO.printLine(evens)
  IO.printLine(squares)
  IO.printLine(sum)
  IO.printLine(f)
  IO.printLine(last) # printLine won't display Just, Ok
end
```

```output filename="OUTPUT"
[2, 4]
[4, 16]
20
1
5
```

`filter` keeps the even elements, `map` squares them, and `sum` adds the squares. Indexing with `[4]` finds the fifth element because positions start at zero.

Use `|` to put one element at the start of a list. The spread operator `...` inserts every element of one list into another:

```kex
let original = [2, 3]
let prepended = [1 | original]      # [1, 2, 3]
let expanded = [0, ...original, 4]  # [0, 1, 2, 3, 4]
```

You can take a list apart with a pattern:

```kex
main do
  let list = [10, 20, 30, 40]   # [Integer]
  let [first | rest]    = list  # first : Integer, rest : [Integer]
  let [f, s, t | other] = list  # f, s, t : Integer, other : [Integer]

  IO.printLine(first)
  IO.printLine(rest)
  IO.printLine(f)
  IO.printLine(s)
  IO.printLine(t)
  IO.printLine(other)
end
```

```output filename="OUTPUT"
10
[20, 30, 40]
10
20
30
[40]
```

In a pattern, `|` separates the first element from the rest. Commas bind individual elements in order.

Lists can also contain other lists:

```kex
let original = [2, 3]
let list = [[1], original, [4, 5]]  # [[1], [2, 3], [4, 5]]
```

## Tuples

A tuple can hold values of different types. You can take it apart with a pattern similar to a list pattern:

```kex
let location = ("Budapest", 47.5, 19.04)  # (String, Float, Float)

let (city, lat, lon) = location
```

Use `_` for a value you do not need:

```kex
let location = ("Budapest", 47.5, 19.04)  # (String, Float, Float)

let (_, lat, lon) = location
```

## Maps

A map associates keys with values. This one maps atom keys to integer scores:

```kex
let scores = {
  alice: 95,
  bob: 72,
  carol: 88
}
# scores : {Atom: Integer}

let aliceScore = scores[:alice] # Integer?
```

You can filter and transform map entries too:

```kex
main do
  let scores = {
    alice: 95,
    bob: 72,
    carol: 88
  }
  
  let carolScore = scores[:carol]
  let evensScores = scores.filter { |n, s| s.even? }
  let justScores = scores.map { |_, s| s }

  IO.printLine(carolScore)  
  IO.printLine(evensScores)
  IO.printLine(justScores)
  IO.printLine(justScores.sum / justScores.count)
end
```

```output filename="OUTPUT"
88
{ bob: 72, carol: 88 }
[95, 72, 88]
85
```

> [!NOTE]
> Maps are useful when you want to look up a value by key. A list is better when its position and order matter.

Maps can represent structured data such as JSON objects. The `JSON` module provides `parse` and `stringify` for converting between JSON text and Kex values.

## Ranges

A range describes values between two endpoints:

```kex
let first10 = (1..10)
let alphabet = ('a'..'z')
```

These ranges include both endpoints. The `items` function converts a range to a list:

```kex
main do
  let first10 = (1..10)
  let alphabet = ('a'..'z')

  IO.printLine(first10.items)
  IO.printLine(alphabet.items)
end
```

```output filename="OUTPUT"
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z]
```

You can also iterate through a range without creating a new list:

```kex
main do
  (1..10).map do |i|
    IO.printLine("${i}. Item")
  end
end
```

```output filename="OUTPUT"
1. Item
2. Item
3. Item
4. Item
5. Item
6. Item
7. Item
8. Item
9. Item
10. Item
```

See the [standard library](/prelude/) for the full List, Map, Range, Foldable, and Enumerable APIs.
