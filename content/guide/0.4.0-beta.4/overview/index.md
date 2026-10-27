---
id: "guide-0-4-0-beta-4-overview"
title: "Overview"
description: "The ideas that make Kex programs fit together."
path: "/guide/0.4.0-beta.4/overview/"
draft: false
template: "page"
---
**Kex** is a [functional language](https://en.wikipedia.org/wiki/Functional_programming) with [Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language))-like syntax and a static type checker. It runs on the [BEAM virtual machine](https://en.wikipedia.org/wiki/BEAM_(Erlang_virtual_machine)) by default and also has a C++-based interpreter.

### Philosophy

The core idea behind the language was to make it powerful and immutable, yet highly readable and easy to extend, which makes building highly scalable BEAM software easy.

Not all algorithms are best suited for functional constructs so 

## Transform values

A function usually describes a transformation. A list operation returns a new list; a record method returns a new record. Existing values stay usable.

```kex
let prices = [10, 20, 30]
let discounted = prices.map { |price| price - 2 }
assert(prices == [10, 20, 30])
assert(discounted == [8, 18, 28])
```

This lets you follow a value through a sequence of steps without tracking who else might change it. `var` allows a local binding to refer to a new value; it does not make aliases into shared mutable objects.

## Read calls from left to right

Uniform Function Call Syntax, or UFCS, lets a function's first argument appear before a dot. `double(3)` and `3.double` express the same call when they resolve to that function.

```kex
let double(n: Integer) -> Integer = n * 2
assert(double(3) == 3.double)
assert([1, 2, 3].map(~double).filter { |n| n > 2 } == [4, 6])
```

Methods in `make` blocks add behavior for particular receiver types. The compiler resolves calls using available declarations and types; the dot does not imply a class hierarchy.

## Keep effects visible

`let` defines pure functions. A function that performs IO or communicates with another process uses `foul`. The `main` entry point is an effectful boundary, so it can call both.

```kex
let greeting(name: String) -> String = "Hello, ${name}!"
foul greet(name: String) -> Void = IO.printLine(greeting(name))
foul runOverview1() do
  greet("Kex")
end
runOverview1()
```

A useful application structure is a pure core that transforms data, surrounded by a small effectful layer that reads inputs and writes results. It is easy to test the core without a filesystem or network.

## Represent decisions in data

Records group fields. Sum types enumerate alternatives. `Optional<A>` represents absence and `Result<A, E>` represents success or a reported failure. Pattern matching handles those alternatives explicitly.

For concurrent state, a process owns its values and communicates through messages. Typed servers add checked request names and reply types to this model. Learn ordinary values and functions first; concurrency uses the same concepts.

Continue with [Getting started](../getting-started/).
