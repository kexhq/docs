---
package: prelude
version: "0.4.0-beta.4-dev"
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

### `exit`

```kex
exit(code: Integer) -> Void
```

Ends the process immediately with exit status `code`.

The invoking shell receives the code, so this is how a command-line tool reports success or failure to whatever ran it: 0 means success, anything else means failure.

Nothing after the call runs, and no cleanup happens: close what needs closing first.

**Parameters**

  - `code` — the exit status

**Examples**

_Failing with a message_

```kex
IO.printError("config not found")
System.exit(1)
```

_Reporting a test run's result_

```kex
System.exit(failures.empty? then 0 else 1)
```

### `OS` (constant)

```kex
OS : OperatingSystem
```

The operating system family this program is running on.

Both backends answer with the same atom for the same machine. Prefer the `macOS?` / `linux?` / `windows?` / `posix?` predicates below when you are asking one yes-or-no question; use `OS` when you need to branch several ways.

**Examples**

```kex
System.OS   # => :macos
```

_Choosing a config location per platform_

```kex
match System.OS do
  :macos => "~/Library/Application Support/app"
  :linux => "~/.config/app"
  _      => "."
end
```



### `BITWIDTH` (constant)

```kex
BITWIDTH : Integer
```

The machine's pointer width in bits: 64 on anything current, 32 on a small target.

Reported by the emulator on BEAM and by the pointer size in the tree walker, so both agree for one machine.

**Examples**

```kex
System.BITWIDTH   # => 64
```



### `macOS?` (constant)

```kex
macOS? : Bool
```

Returns `true` when running on macOS.

**Examples**

```kex
let opener = System.macOS? then "open" else "xdg-open"
```



### `linux?` (constant)

```kex
linux? : Bool
```

Returns `true` when running on Linux.

**Examples**

```kex
if System.linux?
  IO.printLine("using /proc")
end
```



### `windows?` (constant)

```kex
windows? : Bool
```

Returns `true` when running on Windows.

**Examples**

```kex
let separator = System.windows? then "\\" else "/"
```



### `posix?` (constant)

```kex
posix? : Bool
```

Returns `true` when the platform follows POSIX conventions for paths, separators and shell behaviour.

Everything the toolchain runs on except Windows behaves POSIX-ly enough for paths, separators and shell conventions. An unknown system is NOT assumed to be POSIX.

**Examples**

```kex
System.posix?   # => true on macOS and Linux
```

_Refusing to guess on an unrecognised platform_

```kex
if !System.posix?
  IO.printError("this tool assumes POSIX paths")
  System.exit(1)
end
```



## type `OperatingSystem`

The operating system families a program may be running on.

A union of atoms rather than an ADT: these are plain tags, and a `match` over them is still exhaustive. Anything unmodelled is `:unknown`: the union is closed, so callers can cover it.

**Examples**

_Branching on the platform_

```kex
match System.OS do
  :windows => "\\"
  :unknown => die("unsupported platform")
  _        => "/"
end
```



## function `die`

```kex
die : Never
die(message: String) -> Never
```

Ends the program with a fatal error message.

`message` goes to stderr behind a `"fatal: "` prefix and the exit status is 1. This is an abort, not an exception, so `trying` / `rescue` cannot catch it. Use it only where there is no recoverable answer. The prelude uses it for a negative `repeat` count, for instance.

Its result type is `Never`, the bottom type: `die` does not return, so a branch that dies takes the other branch's type, and `if b == 0 then die("divide by zero") else a end` is an `Integer`.

`die` is declared bare, like `assert`, so it is always in scope.

**Parameters**

  - `message` — the fatal message; omitted for a generic one

**Returns**: never returns

**Examples**

```kex
die("unreachable state")   # stderr: fatal: unreachable state
```

_Using it in a branch that must produce a value_

```kex
let denominator = if divisor == 0 then die("divide by zero") else divisor end
```
