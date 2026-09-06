---
title: Overview
description: What Kex is, and what it is for.
order: 1
---

Kex is a functional language with Ruby-like syntax, immutability by default,
and an Elixir-style process model.

## Values

Everything is a value, and values are immutable unless you say otherwise:

```kex
let name = "world"
IO.printLine("hello, ${name}")
```

> Immutability is the default, not a mode. `var` opts out of it for one
> binding.

## What you get

- **UFCS** — `xs.map(f)` and `map(xs, f)` are the same call
- **Traits** — behaviour shared across types
  - with defaults
  - and required methods
- **Processes** — isolated, message-passing, supervised

| Feature | Status |
| --- | --- |
| Type checker | on by default |
| BEAM codegen | default backend |

See the [reference](/prelude/) for the standard library.
