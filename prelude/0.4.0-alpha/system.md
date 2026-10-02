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

Operations concerning the running Kex system process.

Deliberately NOT a capability, and `OS`/`BITWIDTH` stay pure. Faking the reported OS only exercises a program's branching, not the platform behaviour behind it — the file semantics, path rules and process handling that actually differ are unaffected by the atom. Testing those means running on the platform, which CI does across macOS, Ubuntu and Alpine. `Mock.System` existed for this and had exactly one caller: the spec that tested it (kexhq/kex#143).

### `exit`

```kex
exit(code: Integer) -> Void
```

Terminates the process with the given numeric exit code. The invoking shell receives this code.

**Examples**

_System.exit(1)_

```kex

```

### `OS` (constant)

```kex
OS : OperatingSystem
```

Both backends answer with the same atom for the same machine.

**Examples**

_match System.OS do_

```kex

```

_:windows -> "\\"_

```kex

```

__        -> "/"_

```kex

```

_end_

```kex

```



### `BITWIDTH` (constant)

```kex
BITWIDTH : Integer
```

The machine's pointer width in bits — 64 on anything current, 32 on a small target. Reported by the emulator on BEAM and by the pointer size in the tree walker, so both agree for one machine.



### `macOS?` (constant)

```kex
macOS? : Bool
```



### `linux?` (constant)

```kex
linux? : Bool
```



### `windows?` (constant)

```kex
windows? : Bool
```



### `posix?` (constant)

```kex
posix? : Bool
```

Everything the toolchain runs on except Windows behaves POSIX-ly enough for paths, separators and shell conventions. An unknown system is NOT assumed to be POSIX.



## type `OperatingSystem`

The operating system family the program is running on. A union of atoms rather than an ADT: these are plain tags, and a `match` over them is still exhaustive. Anything unmodelled is `:unknown` — the union is closed, so callers can cover it.



## function `die`

```kex
die : Never
die(message: String) -> Never
```

Terminates the process with a fatal message: `message` goes to stderr behind a "fatal: " prefix and the exit status is 1. This is an abort, not an exception — `trying`/`rescue` cannot catch it, so use it only where there is no recoverable answer (the prelude uses it for a negative `repeat` count). Declared bare, like `assert`: it is always in scope. The result type is `Never`, the bottom type: `die` does not return, so a branch that dies takes the other branch's type (`if b == 0 then die("...") else a end` is an Integer).
