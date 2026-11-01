---
id: "home"
title: "Welcome to Kex!"
description: "The Kex guide and the reference for its standard library and Tey."
path: "/"
draft: false
template: "home"
---
Welcome to the home of Kex documentation: guides, the language and standard library reference, and docs for built-in programs like the `Tey` package manager.

## What is Kex?

`Kex` is a concise, readable and declarative multiparadigm programming language. Its main focus is functional style, but it offers optional mutability and procedural control structures as well, so users can pragmatically choose what fits best to their problem. It provides static type checking which provides powerful error messages for both humans and machines for rapid interation.

It ships with a compiler, a standard library and built-in tooling, including the `Tey` package manager for managing dependencies, building projects and managing compiler versions. Its default runtime is [Erlang's](https://en.wikipedia.org/wiki/Erlang_(programming_language)) [BEAM virtual machine](https://en.wikipedia.org/wiki/BEAM_(Erlang_virtual_machine)), but it also has a limited [WebAssembly](https://en.wikipedia.org/wiki/WebAssembly)-based interpreter.

### Key features

- **Multiparadigm. **The language is focused mainly on pure functional programming, but it also offers procedural control structures and effectful functions, so users can choose the best fitting solution for their problems.
- **Static type checking.** To help eradicate bugs, improve application optimization and provide meaningful errors.
- **Declarative.** Use declerative style to describe the solution with the least amount of code possible. `Block<T>` type allows the creation of powerful typed [DSLs](https://en.wikipedia.org/wiki/Domain-specific_language) for describing a wide-variety of problems, like routing, query building and so on.
- **Interoperable.** Invoke built-in, battle-tested [OTP](https://en.wikipedia.org/wiki/Open_Telecom_Platform) functions, or bring your own Erlang modules.

## Your first Kex program

<marqraft-code caption="" filename="hello.kex" language="kex">main do
  IO.printLine(&quot;Hello, world!&quot;)
end</marqraft-code>

**Run** it via:

```shell
$ kex hello.kex
Hello, world!
```

Or **build** it via:

```shell
$ kex -c hello.kex
[   0.0s]    Resolving hello.kex
[   0.4s]     Checking 1 module
[   0.5s]     Lowering 1 module
[   0.5s]       Cached 1 unchanged module
[   0.5s]     Finished kex_hello.beam in 0.5s
$ kex kex_hello.beam
Hello, world!
```

You can also use our `Kex` from the browser from our [REPL](https://www.kex.run/repl) or online [playground](https://www.kex.run/playground/).

## Download Kex

Check the current instructions for your system at [https://www.kex.run/install/.](https://www.kex.run/install/)

## Where to go next

New to Kex? Start with the guide. If you already know what you are looking for, jump straight to the reference.

- **[Guide](/guide/0.4.0/)**: learn the language step by step, with examples.
- **Language reference**: the syntax and semantics of Kex in detail.
- **[Standard library](/prelude/)**: the modules, types and functions that ship with Kex.
- **[Tey](/tey/)**: the package manager and build tool, including its commands and options.

## Usage for LLMs

All pages here are available as raw Markdown: just add the `.md` extension to the URL. We also serve an `llms.txt` file that describes how things work for [Large Language Models](https://en.wikipedia.org/wiki/Large_language_model).
