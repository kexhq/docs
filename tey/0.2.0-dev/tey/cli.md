---
package: tey
version: "0.2.0-dev"
source: tey/cli.kex
title: Tey.Cli
entities:
  - { kind: module, name: "Tey.Cli" }
---

# Tey.Cli

## module `Tey.Cli`

## constant `parser`

Options AND commands in one declaration: OptionParser matches the command words, strips them, and hands the handler what is left. Tey keeps no dispatcher of its own, so the help text and what actually runs cannot drift apart — they are read off the same list.

`foul` because the handlers do things.



## constant `cli`

The parser Tey actually runs: the declared commands, plus one for every `command(...)` this package's manifest declares. Registering them here rather than in a fallback is what gets them into `tey help`, into the unknown-command message, and into argument stripping, for free.

A package command can never shadow a built-in: the manifest reader refuses those names outright (Tey.Manifest.reservedCommands). They are listed under their own help heading regardless — "unknown command" should send a reader to package.kex or to Tey, and the two lists are written by different people.



## function `dispatch`

The line is parsed once here to answer the two questions `run` cannot — is this `--version`, and does it name a command Tey already answers — and then handed to `run`, which parses it again and dispatches. A parse ERROR is left to `run` as well: reporting it with the help text is the one policy every tool built on OptionParser shares.


```kex
dispatch(args)
```


## constant `announceToolchain`

Tells the rest of the process which compiler Tey selected.

`Kex.AST` — which is how a `package.kex` is read at all — shells out to the compiler named by `$KEX`, falling back to whatever `kex` PATH happens to hold. Tey is started by `erl`, not by `kex`, so nothing had set that: a manifest was parsed by an unrelated compiler if one was on PATH, and by none at all otherwise — which is why a package's commands silently vanished from `tey help` on a machine where `kex` was installed only inside the Tey home.

An explicit `$KEX` is left alone: someone who set it means it, and that is the documented override the compiler itself honours.


