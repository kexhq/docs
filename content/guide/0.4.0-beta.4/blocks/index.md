---
id: "guide-0-4-0-beta-4-blocks"
title: "Blocks and small DSLs"
description: "Build readable APIs with ordinary functions and typed blocks."
path: "/guide/0.4.0-beta.4/blocks/"
draft: false
template: "page"
---
A trailing block is an argument to a function. This lets a library define a readable domain-specific API without adding syntax to the language. The important question is what the function expects the block to produce.

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
```

A library author should document this distinction. Two visually similar `do ... end` blocks may have different result behavior because their receiving functions expect different types.

## Conditional entries and spread

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

A guard can omit an entry. Spread inserts the elements of an existing list rather than inserting that list as one nested value. An empty collecting block gives an empty list.

This is useful for builders that collect menu items, validation rules, or document nodes. Keep the builder's operations pure when they only describe data; let a separate effectful boundary render, save, or execute that description.

## Keep the API ordinary

A DSL still needs types, error handling, and tests. Use records and sum types for its output so later code can inspect and validate the result. Prefer a small vocabulary with explicit arguments to a large collection of implicit context rules.

Positional calls still require parentheses. A hypothetical `section("Introduction") do ... end` follows ordinary call syntax; Ruby-style bare positional arguments are not implied by Kex's block syntax.

Scoped `using` blocks can limit builder names to the region that needs them. [Tagged literals](../strings/) are another option when the input is naturally textual, while [compile-time programming](../compiled/) can precompute or generate a builder's static parts. Begin with ordinary runtime functions and add those features only when their behavior is useful and testable.
