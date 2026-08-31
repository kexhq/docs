---
package: prelude
version: "0.4.0-alpha"
source: system.kex
title: System
entities:
  - { kind: module, name: "System" }
  - { kind: function, name: "die" }
---

# System

## module `System`

The running process and the machine under it: exiting, and asking what platform this is.

```kex
System.OS          # => :macos
System.posix?      # => true
System.exit(1)     # ends the program with status 1
```

Deliberately NOT a capability, and `OS`/`BITWIDTH` stay pure. Faking the reported OS only exercises a program's branching, not the platform behaviour behind it: the file semantics, path rules and process handling that actually differ are unaffected by the atom. Testing those means running on the platform, which CI does across macOS, Ubuntu and Alpine. `Mock.System` existed for this and had exactly one caller: the spec that tested it (kexhq/kex#143).

## type `OperatingSystem`

The operating system families a program may be running on.

A union of atoms rather than an ADT: these are plain tags, and a `match` over them is still exhaustive. Anything unmodelled is `:unknown`: the union is closed, so callers can cover it.



**Variants**

  - _(abstract)_
  - _(abstract)_
  - _(abstract)_
  - _(abstract)_
  - _(abstract)_
  - _(abstract)_
  - _(abstract)_
  - _(abstract)_

## function `exit`

Ends the process immediately with exit status `code`.

The invoking shell receives the code, so this is how a command-line tool reports success or failure to whatever ran it: 0 means success, anything else means failure.

Nothing after the call runs, and no cleanup happens: close what needs closing first.


```kex
exit(code) : Integer -> Void
```


## constant `OS`

The operating system family this program is running on.

Both backends answer with the same atom for the same machine. Prefer the `macOS?` / `linux?` / `windows?` / `posix?` predicates below when you are asking one yes-or-no question; use `OS` when you need to branch several ways.



## constant `BITWIDTH`

The machine's pointer width in bits: 64 on anything current, 32 on a small target.

Reported by the emulator on BEAM and by the pointer size in the tree walker, so both agree for one machine.



## constant `macOS?`

Returns `true` when running on macOS.



## constant `linux?`

Returns `true` when running on Linux.



## constant `windows?`

Returns `true` when running on Windows.



## constant `posix?`

Returns `true` when the platform follows POSIX conventions for paths, separators and shell behaviour.

Everything the toolchain runs on except Windows behaves POSIX-ly enough for paths, separators and shell conventions. An unknown system is NOT assumed to be POSIX.



## function `die`

Ends the program with a fatal error message.

`message` goes to stderr behind a `"fatal: "` prefix and the exit status is 1. This is an abort, not an exception, so `trying` / `rescue` cannot catch it. Use it only where there is no recoverable answer. The prelude uses it for a negative `repeat` count, for instance.

Its result type is `Never`, the bottom type: `die` does not return, so a branch that dies takes the other branch's type, and `if b == 0 then die("divide by zero") else a end` is an `Integer`.

`die` is declared bare, like `assert`, so it is always in scope.


```kex
die() : Never
die(message) : String -> Never
```

