---
package: prelude
version: "0.4.0-rc.5-dev"
source: io.kex
title: IO
entities:
  - { kind: module, name: "IO" }
---

# IO

## module `IO`

Console input and output.

`IO` is a capability: its functions act on the outside world, so only `foul` code and `main` can call them. The exception is `inspect`, which writes a debugging view of a value and returns the value, so it can go in the middle of a chain.

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

Any `Showable` value prints through its `show`, so numbers, lists, maps and records need no conversion. With no argument it prints an empty line.

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

_Interpolating values into the line_

```kex
let user = "ada"
IO.printLine("logged in as ${user}")   # prints: logged in as ada
```

### `print` (foul)

```kex
print(msg: Showable) -> Void
```

Writes `msg` to stdout without a newline.

Use it to build a line from several pieces, or to print a prompt that the answer is typed next to.

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

Writes a colored rendering of `val` and its type to stderr, and returns `val` unchanged.

Since it returns its argument, `inspect` can be put in the middle of a chain to see what passes through, and taken out again later. It writes to stderr, so a program's piped stdout stays clean. The type checker treats it as pure, so pure functions can call it too.

To get the rendering as a `String`, use `inspected`.

**Parameters**

  - `val` — any inspectable value

**Returns**: `val`, unchanged

**Examples**

_Watching an intermediate step of a chain_

```kex
[1, 2, 3, 4]
  .map { |n| n * 3 }
  .inspect             # stderr: [3, 6, 9, 12] : [Integer]
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

Returns `None` at the end of the input and also when the read fails, which is usually what interactive code wants. Use `IO.readLine` to tell the two apart. Same as `IO.in.getLine`.

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

Reads one line from stdin, without its line ending, and reports a failed read as an error.

Returns `Ok(None)` at the end of the input, and an `Error` only when the input cannot be read as text. Same as `IO.in.readLine`.

**Returns**: the line, `Ok(None)` at end of input, or why it could not be read

**Examples**

_Copying stdin to stdout line by line_

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

Reads one character from stdin, as a one-character `String`.

Same as `IO.in.getChar`.

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

Diagnostics go to stderr so that the program's output on stdout can be piped or redirected on its own. It only prints; the program keeps running.

**Parameters**

  - `msg` — the message to write

**Examples**

_Reporting a problem without exiting_

```kex
IO.printError("config file not found: using defaults")
```

_Keeping stdout for the result_

```kex
IO.printError("scanning ${dir}...")   # progress, on stderr
IO.printLine(results.join("\n"))      # the output, on stdout
```

### `out` (constant)

```kex
out : FileHandle<CannotRead, CanWrite>
```

Standard output, as a handle.

`IO.printLine(x)` and `IO.out.printLine(x)` both write to stdout. The handle is for passing to a function that takes a `Writable`, so the caller chooses where it writes. `IO.error` and `IO.in` are the other two standard streams.

The handle types say what each stream allows: writing to `IO.in` or reading from `IO.out` is a compile error, as it is for a file opened `Read`.

Getting a handle is pure; reading or writing through it is `foul`. `Mock.IO` captures writes made through `IO.out` as well as through `IO.printLine`, but a `with IO = ...` override replaces only calls to the `IO` functions.

**Examples**

_Letting the caller choose where a report goes_

```kex
foul report(out: Writable, lines: [String]) -> Void do
  lines.each { |line| out.printLine(line) }
end

report(IO.out, results)
report(IO.error, warnings)
report(FS.File.open("report.txt", FS.Write).try, results)
```



### `error` (constant)

```kex
error : FileHandle<CannotRead, CanWrite>
```

Standard error, as a handle: where `IO.printError` writes.

**Examples**

```kex
IO.error.printLine("config file not found")
```



### `in` (constant)

```kex
in : FileHandle<CanRead, CannotWrite>
```

Standard input, as a handle: where `IO.getLine`, `IO.readLine` and `IO.getChar` read from.

**Examples**

_One function for reading a file or a pipe_

```kex
foul firstLine(source: Readable) -> String do
  source.getLine.or("(empty)")
end

firstLine(IO.in)
```


