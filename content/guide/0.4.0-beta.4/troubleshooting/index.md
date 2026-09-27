---
id: "guide-0-4-0-beta-4-troubleshooting"
title: "Troubleshooting"
description: "Recognize common mistakes and verify the right boundary."
path: "/guide/0.4.0-beta.4/troubleshooting/"
draft: false
template: "page"
---
Start by checking `kex --version` and the first diagnostic. This guide targets 0.4.0-beta.4; an older installed compiler or a different selected Tey toolchain can make valid examples appear invalid.

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

Extract the smallest program that preserves the failure. Replace external input with a literal or capability fixture. Add a type annotation at the boundary where the value becomes unclear. Run `kex -C file.kex` to distinguish analysis errors from runtime behavior.

For portable language code, compare `kex file.kex` and `kex -R file.kex`. For real networking or distribution, BEAM is the relevant runtime. Do not bypass a type error with `--no-check` and then treat a successful run as proof of a correct interface.

Turn a fixed bug into a small `.spec.kex` case that would fail before the fix. Include the input and expected behavior, especially for malformed input, empty collections, cleanup, and timeout paths.

## Follow the right documentation

Use this guide for language concepts and workflows. Use the [standard-library reference](/prelude/) for exact signatures and the [Tey reference](/tey/) for package commands. Select matching versions of those references where available; a current API page can differ from a pinned compiler.

When reporting an issue, include the compiler version, backend, operating system, minimal program, complete first diagnostic, and the command used to run it. For a package, include the relevant manifest and locked dependency versions. Never include secrets from environment variables, connection strings, or real customer input.
