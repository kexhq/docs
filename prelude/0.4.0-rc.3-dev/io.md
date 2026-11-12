---
package: prelude
version: "0.4.0-rc.3-dev"
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

### `printLine` (foul)

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

### `print` (foul)

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

### `getLine` (foul)

```kex
getLine -> String?
```

Reads one line from stdin, without its line ending.

The same read as `IO.in.getLine`: `None` both at the end of the input and on a failed read, which is what interactive code wants. Use `IO.readLine` when the two need telling apart.

**Returns**: the line, or `None` at end of input or on failure

**Examples**

_Reading an answer with a default_

```kex
let answer = IO.getLine.or("")
```

### `readLine` (foul)

```kex
readLine -> Result<String?, ReadError>
```

Reads one line from stdin, without its line ending, reporting a failure.

The same read as `IO.in.readLine`: `Ok(None)` at end of input, which is what makes it usable as a loop condition, and an `Error` only when the input cannot be read as text.

**Returns**: the line, `Ok(None)` at end of input, or why it could not be read

**Examples**

_Draining stdin line by line_

```kex
foul echoAll -> Void do
  match IO.readLine do
    Ok(Just(line)) => do
      IO.printLine(line)
      echoAll
    end
    Ok(None) => ()
    Error(e) => IO.printError("cannot read stdin: ${e}")
  end
end
```

### `getChar` (foul)

```kex
getChar -> String?
```

Reads a single character from stdin, as `IO.in.getChar` does.

Note that the character is a one-character `String`, not a `Char`.

**Returns**: the character, or `None` at end of input or on failure

**Examples**

```kex
let key = IO.getChar.or("")
IO.printLine("you pressed ${key}")
```

### `printError` (foul)

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

### `out` (constant)

```kex
out : FileHandle<CannotRead, CanWrite>
```

The three standard streams, as ordinary handle VALUES.

`IO.printLine(x)` and `IO.out.printLine(x)` both write to standard output. Pass a handle to a function that accepts a sink to choose where it writes.

Typestate says what each one permits: writing to `IO.in`, or reading from `IO.out`, is a compile error, exactly as it is for a file opened `Read`.

Obtaining a standard-stream handle is pure; reading or writing through it is `foul`. `Mock.IO` captures writes through both `IO.out` and `IO.printLine`. A `with IO = ...` override replaces module calls only.

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

Standard error, as a handle. The sink `IO.printError` writes to, reachable as a value.

**Examples**

```kex
IO.error.printLine("config file not found")
```



### `in` (constant)

```kex
in : FileHandle<CanRead, CannotWrite>
```

Standard input, as a handle. The source `IO.getLine`, `IO.readLine` and `IO.getChar` read from, reachable as a value.

**Examples**

_Reading from a file or from a pipe, with one function_

```kex
foul firstLine(source: Readable) -> String do
  source.getLine.or("(empty)")
end

firstLine(IO.in)
```


