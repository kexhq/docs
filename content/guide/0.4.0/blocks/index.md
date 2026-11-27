---
id: "guide-0-4-0-beta-4-blocks"
title: "Blocks and small DSLs"
description: "Build readable APIs with ordinary functions and typed blocks."
path: "/guide/0.4.0/blocks/"
draft: false
template: "page"
---
You have already passed blocks to functions such as `map` and `filter`. You can write functions that accept blocks too. The function's parameter type determines what the block produces.

## Last value or collected values

An ordinary block returns its last expression. A `Block<[A]>` parameter collects the body's expressions into a list. The signature gives a block its interpretation:

```kex
lastValue : Block<Integer> -> Integer
let lastValue(block) = block()

collectValues : Block<[Integer]> -> [Integer]
let collectValues(block) = block()

let single = lastValue do
  1
  2
end
let collected = collectValues do
  1
  2
end
assert(single == 2)
assert(collected == [1, 2])
IO.printLine(single)
IO.printLine(collected)
```

```output filename="OUTPUT"
2
[1, 2]
```

`single` is `2`, the last expression in its block. `collected` is `[1, 2]` because `Block<[Integer]>` collects the expressions. A library author should document this distinction: the two blocks look similar, but their parameter types give them different meanings.

## Conditional entries and spread

A collecting block can decide which entries to include and expand an existing list:

```kex
let includeExtra = true
let middle = [2, 3]
let entries = collectValues do
  1
  ...middle
  4 if includeExtra
  5 if false
end
assert(entries == [1, 2, 3, 4])
```

`entries` is `[1, 2, 3, 4]`. `...middle` inserts `2` and `3` separately. The guard after `4` is true, so that value appears; the guard after `5` is false, so that value is omitted. An empty collecting block gives an empty list.

This is useful for builders that collect menu items, validation rules, or document nodes. Keep the builder's operations pure when they only describe data; let a separate effectful boundary render, save, or execute that description.

## Keep the API ordinary

A builder made from blocks is still an ordinary API. Give its output a record or sum type so later code can inspect it, and define what happens for invalid input. A small set of operations with clear arguments is easier to understand than a large set of names that depend on hidden context.

Positional calls still require parentheses. A hypothetical `section("Introduction") do ... end` follows ordinary call syntax; Ruby-style bare positional arguments are not implied by Kex's block syntax.

Scoped `using` blocks can limit builder names to the region that needs them. [Tagged literals](../strings/) are another option when the input is naturally textual, while [compile-time programming](../compiled/) can precompute or generate a builder's static parts. Begin with ordinary runtime functions and add those features only when their behavior is useful and testable.
