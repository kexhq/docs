---
id: "guide-0-4-0-beta-4"
title: "Guide"
description: "Learn Kex, from your first program to typed concurrent applications."
path: "/guide/0.4.0-beta.4/"
draft: false
template: "landing"
version: "0.4.0-beta.4"
---
This guide introduces you to Kex version **0.4.0** It starts with a small program and builds toward data modeling, IO, packages, and concurrent services.

You need some familiarity with programming, but no experience with [functional languages](https://en.wikipedia.org/wiki/Functional_programming) or [Erlang](https://en.wikipedia.org/wiki/Erlang_(programming_language)).

> [!IMPORTANT]
> Keep in mind that the language, including its syntax, semantics and standard library are still under active development and can include major changes version to version.
>
> **Currently no compatibility will be attempted before the first planned stable production version Kex 1.0.**

## Start here

1. [Overview](overview/): values, functions, effects, and processes.
2. [Getting started](getting-started/): install a toolchain and run a program.
3. [Syntax and control flow](syntax/): read and write everyday Kex.
4. [Values and collections](values/): choose representations and transform data.
5. [Functions and blocks](functions/): compose behavior with UFCS and closures.

## Coming from another language?

Read [Kex vs Haskell](kex-vs-haskell/), [Kex vs Ruby](kex-vs-ruby/), or [Kex vs Elixir](kex-vs-elixir/) for familiar ideas, important differences, and side-by-side examples.

## Model your application

- [Types](types/): annotations, generics, aliases, and distinct types.
- [Records and methods](records/): structured data and functional updates.
- [Pattern matching](patterns/): destructuring and exhaustive decisions.
- [Traits](traits/): shared contracts and implementations.
- [Optional values and errors](errors/): absence, failure, propagation, and recovery.
- [Effects and local state](effects/): pure functions, `foul`, `var`, and capabilities.
- [Modules](modules/): visibility, imports, and file layout.

## Build useful programs

- [Strings and binary data](strings/): text, characters, regexes, and bytes.
- [Streams and feeds](streams/): reusable lazy sequences and one-pass input.
- [Files and structured data](io/): resource lifetimes, environment, and JSON.
- [Testing](testing/): assertions, fixtures, and reproducible execution.
- [Packages and tooling](packages/): Tey, dependencies, builds, and releases.
- [A complete command-line program](walkthrough/): validate and summarize a text file.

## Go further

- [Processes and tasks](processes/): messages, timeouts, and concurrent work.
- [Typed servers](servers/): state and request protocols with `serving`.
- [Networking](networking/): HTTP, sockets, DNS, and backend boundaries.
- [Time and units](time/): civil dates, durations, and measurements.
- [Blocks and small DSLs](blocks/): typed blocks and collecting builders.
- [Compile-time programming](compiled/): constants, generation, and embedding.
- [Troubleshooting](troubleshooting/): common mistakes and how to investigate them.

## Working with examples

Unless identified as a project file or an excerpt, the Kex blocks on a page form one runnable program in reading order. Save them together in a `.kex` file or use the read-eval-print loop (**REPL**) provided in the `kex` command-line program. Some examples could also be tried in the [online REPL](https://www.kex.run/repl/) or [web-based playground](https://www.kex.run/playground/).

By convention, test files are named  `*.spec.kex`, for instance the file `list.kex` would be tested by its `list.spec.kex` counterpart. Comments and `assert` calls make expected behavior explicit.
