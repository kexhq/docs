---
id: "guide-0-4-0-beta-4-troubleshooting"
title: "Troubleshooting"
description: "Recognize common mistakes and verify the right boundary."
path: "/guide/0.4.0/troubleshooting/"
draft: false
template: "page"
---
When a guide example fails, first run `kex --version` and read the first diagnostic. This guide targets 0.4.0; an older compiler or a different selected Tey toolchain may reject a valid example. The table below points from common symptoms to the boundary worth checking.

## Common symptoms

| Symptom | What to check |
| --- | --- |
| A pure function cannot call IO | Declare the boundary `foul`, or return data and print it in `main` |
| A callback changes a variable but the outer value is unchanged | BEAM snapshots captures; beta.4 interpreter behavior differs. Keep the loop and accumulator in one scope |
| A method expects a value but receives an optional | Match `Just`/`None`, use a deliberate fallback, or unwrap at a recovery boundary |
| An error disappears behind a default | `.or(...)` discards absence or failure; preserve the result when it matters |
| A match arm fails to parse | Arms use `=>`; return types use `->` |
| A function argument fails to parse | Positional calls use parentheses, even when followed by `do` |
| A mutable call fails | `!` rebinds a receiver and requires `var` |
| A string algorithm produces a list | `map` collects; use `mapChars` for character-to-character text transformation |
| An import is ambiguous | Use `only:`, `except:`, an alias, or a qualified call |
| A package module cannot be found | Run through Tey or supply the correct source roots |
| Networking returns UnsupportedBackend | Run the network IO on BEAM |
| Task await reports “not a task” in the interpreter | Use BEAM for tasks in this beta.4 toolchain |
| A server call times out | Check the process lifetime, slot work, and reply path before increasing the timeout |
| A stream never finishes | Bound consumption and check whether a filter can ever yield a value |

## Reduce the problem

Suppose a program fails after reading a file, parsing a value, and formatting a report. First replace the file read with a literal string. If the failure remains, the problem is in parsing or formatting; if it disappears, inspect the file boundary. Keep reducing until one small program still shows the issue.

Add a type annotation where a value becomes unclear. Run `kex -C file.kex` to see whether the error occurs during analysis or only at runtime. A capability fixture can replace a file or environment input while preserving the call shape.

For portable language code, compare `kex file.kex` and `kex -R file.kex`. For real networking or distribution, BEAM is the relevant runtime. Do not bypass a type error with `--no-check` and then treat a successful run as proof of a correct interface.

After fixing the problem, add a `.spec.kex` case with the input that failed and the result you now expect. A good case would fail with the old behavior. Include boundaries such as malformed input, empty collections, cleanup, and timeouts when they caused the bug.

## Follow the right documentation

Use this guide for language concepts and workflows. Use the [standard-library reference](/prelude/) for exact signatures and the [Tey reference](/tey/) for package commands. Select matching versions of those references where available; a current API page can differ from a pinned compiler.

When reporting an issue, include the compiler version, backend, operating system, minimal program, complete first diagnostic, and the command used to run it. For a package, include the relevant manifest and locked dependency versions. Never include secrets from environment variables, connection strings, or real customer input.
