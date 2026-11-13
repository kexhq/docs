---
package: prelude
version: "0.4.0-alpha"
source: io.kex
title: IO
entities:
  - { kind: module, name: "IO" }
---

# IO

## module `IO`

### `printLine`

```kex
printLine(msg: Showable) -> Void
```

Writes each argument to stdout followed by a newline. Multiple arguments are printed consecutively with no separator.

**Examples**

```kex
IO.printLine("hello")      # prints: hello
IO.printLine("x = ", 42)   # prints: x = 42
```

### `print`

```kex
print(msg: Showable) -> Void
```

Writes each argument to stdout without a trailing newline.

**Examples**

```kex
IO.print("hello ")
IO.print("world")   # stdout: hello world
```

### `inspect`

```kex
inspect(val: A) -> A
```

Pretty-prints a colored inspect representation of `val` to stderr. Returns `val` unchanged so it can be inserted into any pipeline. Treated as pure by the type checker — purity checking ignores this call.

**Examples**

```kex
xs.map(~double).inspect.filter(~even?)   # `inspected` gives the String
```

### `getLine`

```kex
getLine : String?
```

Reads one line from stdin. Returns `None` at end-of-input.

**Examples**

_IO.getLine.or("")_

```kex

```

### `get`

```kex
get : String?
```

Reads a single character from stdin. Returns `None` at end-of-input.

### `printError`

```kex
printError(msg: Showable) -> Void
```

Writes a line to stderr. Does not exit. Use for error messages that should not go to stdout.

**Examples**

_IO.printError("config file not found")_

```kex

```

### `warn`

```kex
warn(msg: Showable) -> Void
```

Alias for `printError` — use when signalling a non-fatal condition.

### `warning`

```kex
warning(msg: Showable) -> Void
```

Alias for `printError` — longer form of `warn`.
