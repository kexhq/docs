---
id: "guide-0-4-0-beta-4-comparisons"
title: "Kex vs X"
description: "A practical starting point for Haskell, Ruby, and Elixir programmers."
path: "/guide/0.4.0-beta.4/comparisons/"
draft: false
template: "page"
---
Kex combines ideas that will feel familiar to programmers from several languages. Familiar syntax does not always imply familiar behavior: a Ruby-looking bang call rebinds a value, a Haskell-looking function needs an explicit capture when passed around, and an Elixir-like process can have a checked message interface.

These comparisons target **Kex 0.4.0-beta.4**. Each uses small examples to explain how to translate an idea, where the semantics differ, and what requires a separate design decision. They are language comparisons, not performance benchmarks or claims that existing packages run unchanged.

- [Kex vs Haskell](../kex-vs-haskell/): purity, evaluation, functions, algebraic data, and type classes.
- [Kex vs Ruby](../kex-vs-ruby/): familiar blocks and chains, different mutation, types, and effects.
- [Kex vs Elixir](../kex-vs-elixir/): immutable data and BEAM processes, with different interfaces for types, effects, and servers.

Read the comparison for the language you know, then follow its links into the guide. The Kex blocks on each comparison page form a runnable program in reading order and are covered by the guide's example checker. Foreign-language blocks are labeled separately; they show equivalent computations rather than text that can be pasted into Kex.
