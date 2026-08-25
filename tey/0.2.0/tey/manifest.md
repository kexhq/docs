---
package: tey
version: "0.2.0"
source: tey/manifest.kex
title: Tey.Manifest
entities:
  - { kind: module, name: "Tey.Manifest" }
---

# Tey.Manifest

## module `Tey.Manifest`

## record `Dependency`

**Fields**

  - `manifestName` : String
  - `manifestGit` : String
  - `manifestSelector` : String
  - `manifestRequested` : String
  - `manifestGroups` : [String] (optional)

## record `Target`

**Fields**

  - `name` : String
  - `entrypoint` : String

## record `Command`

A project-specific command, run as `tey <name>`. Without these every package grows a Makefile or a bin/ script beside package.kex for "the way you run the linter", which the manifest — the one file a newcomer reads — says nothing about.

A name is one word, grouped with a colon: `db:migrate`, `assets:build`.

**Fields**

  - `commandName` : String
  - `commandRun` : String
  - `commandDescription` : String (optional)

## record `Toolchain`

A toolchain package: the compiler executable plus the runtime and standard library it was built with, installed together so the three can never drift apart. Kex's own `package.kex` is the one that declares it — and a reader that did not know the declaration could not run any tey command from the compiler's own checkout, which is where it is most used.

Fields are prefixed like Command's: a bare `compiler` would be read as a method on an unpinned receiver before it is read as a field here.

**Fields**

  - `toolchainName` : String
  - `toolchainCompiler` : String (optional)
  - `toolchainRuntime` : String (optional)
  - `toolchainStdlib` : String (optional)

## record `ManifestPackage`

**Fields**

  - `name` : String
  - `version` : String (optional)
  - `description` : String (optional)
  - `license` : String (optional)
  - `packageKexRequirement` : String (optional)
  - `packageOtpRequirement` : String (optional)
  - `entrypoint` : String (optional)
  - `manifestDependencies` : [Dependency] (optional)
  - `targets` : [[Target](#record-target)] (optional)
  - `commands` : [[Command](#record-command)] (optional)
  - `manifestToolchain` : Toolchain? (optional)

## constant `reservedCommands`

The command names Tey answers itself. A `command(...)` may not take one of them: `tey test` must mean the same thing in every checkout, so a manifest that tries to redefine it is an error at read time rather than a silent shadow. Kept here because the READER is what enforces it, and Tey.Cli cannot be asked: it is built on this module, so reading the list off its declared commands would be a cycle. The two have to be kept in step by hand — one `.command(...)` in Tey.Cli, one name here (the first word is enough: `kex` covers every `kex ...` subcommand).



## function `read`

Reads a `package.kex`.

The compiler parses the manifest. Tey only interprets the resulting Kex AST, so comments, multiline calls, strings, and future grammar fixes cannot drift from the language that actually compiles package.kex.


```kex
read(text)
```

