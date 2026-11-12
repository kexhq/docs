---
id: "c53b0c85f523d0b2ec5cc40562f0f7d9bf65079fa854f2d05b71fc7efad0e69f"
title: "Compound values"
path: "/guide/0.4.0/overview/compound-types/"
draft: false
template: "page"
---
Compound values turn primitive values into more practical structures, such as lists, tuples, maps, and sets.

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

Lists could be decomposed into its elements:

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

Just as `|` can help creating a list via prepending to its beginning, it can also get the first element of the list while pattern matching. The `,`  does by element decomposition.

List can also contain other lists or other compound types:

```kex
let original = [2, 3]
let list = [[1], original, [4, 5]]  # [[1], [2, 3], [3, 5]]
```

## Tuples

While lists only contains elements of the same type, tuples can contain multiple types, decomposition works similarly to lists:

```kex
let location = ("Budapest", 47.5, 19.04)  # (String, Float, Float)

let (city, lat, lon) = location
```

If you don't care about a value, just put `_` into those places:

```kex
let location = ("Budapest", 47.5, 19.04)  # (String, Float, Float)

let (_, lat, lon) = location
```

## Maps

Maps in a way also collect different typed elements into a single value. However, they associate values, the following example associates a atoms to integers:

```kex
let scores = {
  alice: 95,
  bob: 72,
  carol: 88
}
# scores : {Atom: Integer}

let aliceScore = scores[:alice] # Integer?
```

The same function demonstrated for lists also work well for maps:

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
> One of the useful properties of maps is that their lookup is relatively quick. While to find a list's 10th element you have to go through all 10, maps work much faster (O(log n) vs O(n)).

Maps are a natural fit for storing structured data like `JSON`  objects. The module `JSON` and its functions `parse` and `stringify` could be used to convert between `JSON` and `Map` .

## Ranges

Ranges are used to represent a range of primitive values:

```kex
let first10 = (1..10)
let alphabet = ('a'..'z')
```

Ranges are always inclusive, meaning that their start end end are always included. The `items` function can be used to convert a range to list:

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

Another usage of ranges is iteration through a fixed set of values:

```kex
main do
  (1..10).map do |i|
    IO.printLine("${i}. Item")
  end
end
```

```output filename="OUTPUT"
1. item
2. item
3. item
4. item
5. item
6. item
7. item
8. item
9. item
10. item
```

See the [standard library](/prelude/) for the full List, Map, Range, Foldable, and Enumerable APIs.
