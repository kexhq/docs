---
package: prelude
version: "0.4.0-rc.4-dev"
source: system.kex
title: System
entities:
  - { kind: module, name: "System" }
  - { kind: function, name: "die" }
---

# System

## module `System`

Exiting the program, and finding out what platform it runs on.

```kex
System.OS          # => :macos
System.posix?      # => true
System.exit(1)     # ends the program with status 1
```

### `exit` (foul)

```kex
exit(code: Integer) -> Void
```

Ends the process at once with exit status `code`.

The status goes to whatever started the program: 0 means success, and anything else means failure. Nothing after the call runs, and nothing is cleaned up, so close what needs closing first.

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

For a single yes-or-no question, `macOS?`, `linux?`, `windows?` and `posix?` read better. Use `OS` to branch several ways.

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

The machine's pointer width in bits: 64 on current hardware, 32 on some small targets.

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

Returns `true` when the platform follows POSIX conventions for paths and shells.

That is every supported platform except Windows and WebAssembly. An unknown platform is not assumed to be POSIX.

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

The operating system families a program can run on.

A platform Kex does not recognise is `:unknown`. The set is closed, so a `match` over it can be exhaustive.

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
die -> Never
die(message: String) -> Never
```

Ends the program with a fatal error message.

`message` goes to stderr after a `"fatal: "` prefix, and the exit status is 1. `die` aborts the program; `trying` and `rescue` cannot catch it. Use it where the program has no way to continue, such as a bad argument to `Random.sample`.

Its result type is `Never`, so a branch that dies takes the type of the other branch: `if b == 0 then die("divide by zero") else a end` is an `Integer`.

`die` is declared at the top level, like `assert`, so it is always in scope.

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
