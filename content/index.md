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

Kex is a simple, readable and productive programming language. It offers a small set of well-chosen concepts that fit together cleanly, so you can spend your time solving problems instead of fighting the language. It ships with a compiler, a standard library and built-in tooling, including the `Tey` package manager for managing dependencies and building projects.

### Key ideas

- **Approachable.** A compact syntax and consistent rules make Kex easy to learn and easy to read.
- **Practical.** The standard library covers common tasks out of the box, so you can build useful programs quickly.
- **Batteries included.** Package management, building and project setup are part of the toolchain rather than an afterthought.

## A taste of Kex

<marqraft-code language="kex" filename="hello.kex" caption="">main do
  IO.printLine(&quot;hello, world&quot;)
end</marqraft-code>

## Where to go next

New to Kex? Start with the guide. If you already know what you are looking for, jump straight to the reference.

- **[Guide](/guide/0.4.0-beta.4/)**: learn the language step by step, with examples.
- **Language reference**: the syntax and semantics of Kex in detail.
- **[Standard library](/prelude/)**: the modules, types and functions that ship with Kex.
- **[Tey](/tey/)**: the package manager and build tool, including its commands and options.

## Usage for LLMs

All pages here are available as raw Markdown: just add the `.md` extension to the URL. We also serve an `llms.txt` file that describes how things work for [Large Language Models](https://en.wikipedia.org/wiki/Large_language_model).
