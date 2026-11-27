---
id: "guide-0-4-0-beta-4-overview"
title: "Overview"
description: "The ideas that make Kex programs fit together."
path: "/guide/0.4.0/overview/"
draft: false
template: "page"
---
Kex is a programming language with Ruby-like syntax, static types, and an emphasis on pure functions. It can run on the Erlang BEAM virtual machine or through its interpreter. This page introduces the ideas you will use throughout the guide.

## Keep effects visible

Start with a function that builds a greeting, then print it:

```kex
let greeting(name: String) -> String = "Hello, ${name}!"
foul greet(name: String) -> Void = IO.printLine(greeting(name))
foul runOverview1() do
  greet("Kex")
end
runOverview1()
```

```output filename="OUTPUT"
Hello, Kex!
```

`let` defines the pure `greeting` function: the same name produces the same text. `greet` prints that text, so it uses `foul`. The `main` entry point is also an effectful boundary and can call both kinds of function.

A useful application structure is a pure core that transforms data, surrounded by a small effectful layer that reads inputs and writes results. It is easy to test the core without a filesystem or network.

## Read calls from left to right

Kex lets you put a function's first argument before a dot. This is called Uniform Function Call Syntax (UFCS). `double(3)` and `3.double` express the same call when they resolve to that function:

```kex
let double(n: Integer) -> Integer = n * 2
assert(double(3) == 3.double)
assert([1, 2, 3].map(~double).filter { |n| n > 2 } == [4, 6])
```

The second assertion starts with a list, doubles each element, and then keeps values above two. The dot can also call methods defined in `make` blocks. The compiler uses the available declarations and types to resolve the call.

## Represent decisions in data

Records group named fields. Sum types name the possible forms of a value. For example, `Optional<A>` can hold a value or be empty, while `Result<A, E>` holds either a success or an error. A `match` lets you handle each form.

For concurrent state, a process owns its values and communicates through messages. Typed servers add checked request names and reply types to this model. Learn ordinary values and functions first; concurrency uses the same concepts.

Continue with [Getting started](../getting-started/). For a closer look at lists, tuples, and maps, read [Compound values](compound-types/) after the Values chapter.
