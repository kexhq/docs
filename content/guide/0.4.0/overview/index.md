---
id: "guide-0-4-0-beta-4-overview"
title: "Overview"
description: "The ideas that make Kex programs fit together."
path: "/guide/0.4.0/overview/"
draft: false
template: "page"
---
**Kex** is a [multi-paradigm programming language](https://simple.wikipedia.org/wiki/Multi-paradigm_programming_language), with a primary [focus on pure functional programming](https://en.wikipedia.org/wiki/Purely_functional_programming), with similar syntax to Ruby, running on, but not limited to [BEAM virtual machine](https://en.wikipedia.org/wiki/BEAM_(Erlang_virtual_machine).

### Key philosophy

The guiding principle behind the language was to build something powerful, which has the elegant aesthetics of **Ruby**, static type safety of **Haskell** and the scalable runtime of **Erlang**.

## Keep effects visible

Kex is built 

```kex
let greeting(name: String) -> String = "Hello, ${name}!"
foul greet(name: String) -> Void = IO.printLine(greeting(name))
foul runOverview1() do
  greet("Kex")
end
runOverview1()
```

`let` defines pure functions. A function that performs IO or communicates with another process uses `foul`. The `main` entry point is an effectful boundary, so it can call both.

A useful application structure is a pure core that transforms data, surrounded by a small effectful layer that reads inputs and writes results. It is easy to test the core without a filesystem or network.





## Read calls from left to right

You might have heard of a similar langauge, called Elixir with similar design goals. The main difference between Kex and Elixir is that Elixir has invented the `|>` pipe operator, which is more similar to a the shell

Uniform Function Call Syntax, or UFCS, lets a function's first argument appear before a dot. `double(3)` and `3.double` express the same call when they resolve to that function.

```kex
let double(n: Integer) -> Integer = n * 2
assert(double(3) == 3.double)
assert([1, 2, 3].map(~double).filter { |n| n > 2 } == [4, 6])
```

Methods in `make` blocks add behavior for particular receiver types. The compiler resolves calls using available declarations and types; the dot does not imply a class hierarchy.

## Represent decisions in data

Records group fields. Sum types enumerate alternatives. `Optional<A>` represents absence and `Result<A, E>` represents success or a reported failure. Pattern matching handles those alternatives explicitly.

For concurrent state, a process owns its values and communicates through messages. Typed servers add checked request names and reply types to this model. Learn ordinary values and functions first; concurrency uses the same concepts.

Continue with [Getting started](../getting-started/).
