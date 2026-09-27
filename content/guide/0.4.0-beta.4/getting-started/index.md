---
id: "guide-0-4-0-beta-4-getting-started"
title: "Getting started"
description: "Install beta.4 and run, check, and explore your first program."
path: "/guide/0.4.0-beta.4/getting-started/"
draft: false
template: "page"
---
Kex ships with Tey, which manages compiler versions, packages, builds, and project commands.

## Install and select the toolchain

With Homebrew:

```sh
brew tap kexhq/tey
brew install kexhq/tey/tey
tey kex list --pre
tey kex install 0.4.0-beta.4
tey kex use 0.4.0-beta.4
kex --version
```

Without Homebrew, the installer is available at `https://kex.run/install.sh`. Download and inspect it before running it, then use the same Tey commands to select this edition's compiler. The `kex` command on your PATH dispatches to the selected toolchain; selecting a version also selects its paired Tey.

## Your first file

Save this as `hello.kex`:

```kex
let greeting(name: String) -> String = "Hello, ${name}!"

main do
  IO.printLine(greeting("world"))
end
```

Run it:

```sh
kex hello.kex
```

It prints `Hello, world!`. Kex checks the program before running it. The default backend compiles through Core Erlang to BEAM. The installed toolchain supplies the runtime needed for ordinary use.

Useful commands while learning:

| Command | Purpose |
| --- | --- |
| `kex -C hello.kex` | Analyze without running the program |
| `kex -R hello.kex` | Run with the tree-walk interpreter |
| `kex -c hello.kex` | Compile to BEAM without running |
| `kex` | Open the BEAM REPL |
| `kex -i` | Open the interpreter REPL |
| `kex --help` | Show supported flags |

`-C` does not execute runtime IO, but compile-time expressions and file embedding still run during analysis.

## Explore in the REPL

Enter expressions such as `1 + 2`, `"hello".upperCase`, or `[1, 2, 3].map { |n| n * 2 }`. The REPL displays results and their types. Use `/help` for commands, `/load hello.kex` to load declarations, `/reload` after editing, and `/exit` to leave.

The REPL allows effects, which makes it convenient for experiments. A function you declare with `let` still has to obey purity rules.

## Editor and project support

The Kex VS Code extension uses `kex --lsp` for diagnostics, completion, and type information. Ensure the editor can find the same `kex` command as your terminal.

Once a single file grows into several modules, use `tey new my-app`, then work through [Packages and tooling](../packages/). For now, continue with [Syntax and control flow](../syntax/).
