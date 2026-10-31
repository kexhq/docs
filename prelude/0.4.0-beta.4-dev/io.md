---
package: prelude
version: "0.4.0-beta.4-dev"
source: io.kex
title: IO
entities:
  - { kind: module, name: "IO" }
---

# IO

## module `IO`

Console input and output.

`IO` is a capability: every function in it touches the outside world, so it can only be called from `foul` code (or from `main`). Reading a line and printing a line are the two workhorses; `inspect` is the debugging tool that can be dropped into the middle of a chain without changing its value.

```kex
main do
  IO.print("name? ")
  let name = IO.getLine.or("world")
  IO.printLine("hello, ${name.trim}")
end
```

### `printLine`

```kex
printLine(msg: Showable) -> Void
```

Writes `msg` to stdout followed by a newline.

Any `Showable` value is accepted, not just strings: numbers, lists, maps and records print through their own `show` implementation. Called with no argument it prints an empty line.

**Parameters**

  - `msg` — the value to write

**Examples**

_Printing values of different types_

```kex
IO.printLine("hello")        # prints: hello
IO.printLine(42)             # prints: 42
IO.printLine([1, 2, 3])      # prints: [1, 2, 3]
IO.printLine                 # prints an empty line
```

_Interpolation is usually clearer than several arguments_

```kex
let user = "ada"
IO.printLine("logged in as ${user}")   # prints: logged in as ada
```

### `print`

```kex
print(msg: Showable) -> Void
```

Writes `msg` to stdout without a trailing newline.

Use it to build a line from several pieces, or to write a prompt that the cursor should stay on.

**Parameters**

  - `msg` — the value to write

**Examples**

_Building one line from several writes_

```kex
IO.print("hello ")
IO.print("world")
IO.printLine         # stdout: hello world
```

_A prompt the answer is typed next to_

```kex
IO.print("continue? [y/N] ")
let answer = IO.getLine.or("n")
```

### `inspect`

```kex
inspect(val: A) -> A
```

Writes a colored, structured rendering of `val` to stderr and returns `val` unchanged.

Because it returns its argument, `inspect` can be spliced into the middle of a chain to see what is flowing through it, then removed again without touching the surrounding code. It writes to stderr, so it does not disturb a program whose stdout is piped somewhere. The type checker treats it as pure, so it is allowed inside pure functions.

Use `inspected` instead when you want the rendering as a `String` rather than written out.

**Parameters**

  - `val` — any inspectable value

**Returns**: the same value, unchanged

**Examples**

_Watching an intermediate step of a chain_

```kex
[1, 2, 3, 4]
  .map { |n| n * 3 }
  .inspect             # stderr: [3, 6, 9, 12] : [Int]
  .filter(~even?)      # => [6, 12]
```

_The rendering carries the value's type_

```kex
IO.inspect("hi")     # stderr: "hi" : String
IO.inspect((1..4))   # stderr: 1..4 : Range
```

### `getLine`

```kex
getLine : String?
```

Reads one line from stdin, without the trailing newline.

Returns `None` at end of input, which is what makes it usable as a loop condition: the `None` is the end of the stream, not an error.

**Returns**: the line, or `None` at end of input

**Examples**

_Reading an answer with a default_

```kex
let answer = IO.getLine.or("")
```

_Draining stdin line by line_

```kex
foul echoAll -> Void do
  match IO.getLine do
    Just(line) => do
      IO.printLine(line)
      echoAll
    end
    None => ()
  end
end
```

### `get`

```kex
get : String?
```

Reads a single character from stdin.

Returns `None` at end of input. Note that the result is a one-character `String`, not a `Char`.

**Returns**: the character, or `None` at end of input

**Examples**

```kex
let key = IO.get.or("")
IO.printLine("you pressed ${key}")
```

### `printError`

```kex
printError(msg: Showable) -> Void
```

Writes `msg` to stderr followed by a newline.

Diagnostics belong on stderr so that a program's real output can be piped or redirected on its own. Unlike a raised error, this only prints: it does not stop the program.

**Parameters**

  - `msg` — the message to write

**Examples**

_Reporting a problem without exiting_

```kex
IO.printError("config file not found: using defaults")
```

_Keeping stdout clean for the real result_

```kex
IO.printError("scanning ${dir}...")   # progress, on stderr
IO.printLine(results.join("\n"))      # the output, on stdout
```

### `warn`

```kex
warn(msg: Showable) -> Void
```

Writes `msg` to stderr. Identical to `printError`, named for the case where the message is a warning rather than a failure.

**Parameters**

  - `msg` — the warning to write

**Examples**

```kex
IO.warn("ignoring unknown key ${key}")
```

### `warning`

```kex
warning(msg: Showable) -> Void
```

Writes `msg` to stderr. The long spelling of `warn`.

**Parameters**

  - `msg` — the warning to write

**Examples**

```kex
IO.warning("this option is deprecated")
```

### `out` (constant)

```kex
out : FileHandle<CannotRead, CanWrite>
```

The three standard streams, as ordinary handle VALUES.

`IO.printLine(x)` and `IO.out.printLine(x)` are the same call: the convenience spelling stays, and the handle behind it is now something a program can name, pass and substitute. That is what `Mock.IO` cannot do: it is one global switch, so output from one library cannot go to a buffer while another's goes to the terminal, and a library cannot ACCEPT a sink (kexhq/kex#139).

Typestate says what each one permits: writing to `IO.in`, or reading from `IO.out`, is a compile error, exactly as it is for a file opened `Read`.

These three are PURE, so they are not part of the capability interface a stand-in must implement: naming a device performs no effect, writing THROUGH it does, and the handle methods are the `foul` ones. That also draws the seam between the two ways to redirect output: `with IO = ...` replaces the CALLS, so it does not touch a handle obtained here, while `Mock.IO` replaces the DEVICE (a group leader, kexhq/kex#141) and so captures `IO.out.printLine(x)` and `IO.printLine(x)` alike.

**Examples**

_Handing a library somewhere to write_

```kex
foul report(out: Writable, lines: [String]) -> Void do
  lines.each { |line| out.printLine(line) }
end

report(IO.out, results)
report(IO.error, warnings)
report(FS.File.open("report.txt", Write).try, results)
```



### `error` (constant)

```kex
error : FileHandle<CannotRead, CanWrite>
```

Standard error, as a handle. The sink `IO.printError` and `IO.warn` write to, reachable as a value.

**Examples**

```kex
IO.error.printLine("config file not found")
```



### `in` (constant)

```kex
in : FileHandle<CanRead, CannotWrite>
```

Standard input, as a handle. The source `IO.getLine` and `IO.get` read from, reachable as a value.

**Examples**

_Reading from a file or from a pipe, with one function_

```kex
foul firstLine(source: Readable) -> String do
  source.getLine.or("(empty)")
end

firstLine(IO.in)
```


