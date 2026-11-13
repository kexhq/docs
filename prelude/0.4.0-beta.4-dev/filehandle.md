---
package: prelude
version: "0.4.0-beta.4-dev"
source: filehandle.kex
title: FileHandle
entities:
  - { kind: type, name: "ReadError" }
  - { kind: trait, name: "Readable" }
  - { kind: trait, name: "Writable" }
  - { kind: type, name: "FileHandle" }
  - { kind: make, name: "FileHandle<CanRead, W>" }
  - { kind: make, name: "FileHandle<R, CanWrite>" }
  - { kind: make, name: "FileHandle<R, W>" }
---

# FileHandle

## type `ReadError`

Why a read failed.

`ReadFailed` means the source refused the read. `InvalidUtf8` means bytes were read but are not valid UTF-8, and carries the byte offset of the first malformed sequence, relative to that one operation. A failed read consumes the bytes it attempted to read and never substitutes U+FFFD: use `readBytes` to recover the payload verbatim.

**Variants**

  - `ReadFailed`
  - `InvalidUtf8(Integer)`



## trait `Readable`

`Readable`: a source that yields text.

Named so that anything can be one, not just a file: the vocabulary `FileHandle<CanRead, W>` already carried was an abstraction without a name, so nothing else could implement it and `IO` did not go through it (kexhq/kex#139). `IO.in` is a `Readable`; so is any handle opened for reading.

```kex
foul firstLine(source: Readable) -> String do
  source.getLine.or("(empty)")
end

firstLine(IO.in)
firstLine(FS.File.open("notes.txt", Read).try)
```

Implemented by [`FileHandle<CanRead, W>`](#make-filehandle-canread).

### Required methods

#### `getLine`

```kex
getLine : Result<String?, ReadError>
```

Reads the next line, without its newline.

**Returns**: the next line, `Ok(None)` at end of

#### `get`

```kex
get : Result<String?, ReadError>
```

Reads a single character, as a one-character `String`.

Reads one complete Unicode scalar, not one byte.

**Returns**: the next character, `Ok(None)` at end

#### `readLine`

```kex
readLine : Result<String?, ReadError>
```

Reads the next line, without its newline. The same as `getLine`.

**Returns**: the next line, `Ok(None)` at end of

#### `read`

```kex
read : Result<String, ReadError>
```

Reads everything remaining, as one `String`.

Draining an exhausted source answers `Ok("")`.

**Returns**: the remaining contents, or the failure

#### `readBytes`

```kex
readBytes : Result<Binary, ReadError>
```

Reads everything remaining as raw bytes, without decoding it as text.

The byte counterpart of `read`: it never validates UTF-8, so it recovers the payload of a source that is not text, or one `read` has just rejected. Draining an exhausted source answers `Ok(Binary.fromBytes([]))`.

**Returns**: the remaining bytes, or the failure

#### `eof?`

```kex
eof? : Bool
```

Returns `true` when the source has reached its end.

**Returns**: `true` at end of input

#### `atEnd?`

```kex
atEnd? : Bool
```

Returns `true` when the source has reached its end. The same as `eof?`.

**Returns**: `true` at end of input



## trait `Writable`

`Writable`: a sink that accepts text.

The payoff of naming it is that a sink becomes a VALUE a library can accept, rather than a global switch it can only sit underneath: output from one library can go to a buffer while another's goes to the terminal (kexhq/kex#139).

```kex
foul report(out: Writable, lines: [String]) -> Void do
  lines.each { |line| out.printLine(line) }
end

report(IO.out, results)
report(IO.error, warnings)
report(FS.File.open("report.txt", Write).try, results)
```

Two deliberate choices, both settled in kexhq/kex#139:

- The argument is `Showable`, not `String`. `IO.printLine` always took a   `Showable` while the handle methods took a `String`; the wider one is   right, and it is what makes `IO.printLine(x)` and `IO.out.printLine(x)`   the same call. - The result is `Void`, not `Bool`. A boolean nobody checks is not an error   channel, and `Result<Void, IOError>` on every print is miserable to use.   Erlang's answer is the one taken here: the call says `ok`, and failure   belongs to the device rather than to the call site.

Implemented by [`FileHandle<R, CanWrite>`](#make-filehandle-canwrite).

### Required methods

#### `printLine`

```kex
printLine(content: Showable) -> Void
```

Writes `content` followed by a newline.

**Parameters**

  - `content` — the value to write

#### `print`

```kex
print(content: Showable) -> Void
```

Writes `content` with no trailing newline.

**Parameters**

  - `content` — the value to write

#### `writeLine`

```kex
writeLine(content: Showable) -> Void
```

Writes `content` followed by a newline. The same as `printLine`.

**Parameters**

  - `content` — the value to write

#### `write`

```kex
write(content: Showable) -> Void
```

Writes `content` with no trailing newline. The same as `print`.

**Parameters**

  - `content` — the value to write

#### `writeBytes`

```kex
writeBytes(content: Binary) -> Void
```

Writes `content` as raw bytes, with no trailing newline.

The byte counterpart of `write`: the payload goes to the sink exactly as given. It never renders the value, so a `Binary` reaches the sink as its bytes rather than as the `#Binary<N bytes>` that `Showable` would print.

**Parameters**

  - `content` — the bytes to write



## type `FileHandle<R, W>`

An open file, obtained from `FS.File.open`.

The two type parameters record what the handle is allowed to do: `R` is `CanRead` or `CannotRead`, `W` is `CanWrite` or `CannotWrite`. `FS.File.open` picks them from the mode you pass, so calling `write` on a handle opened `Read` is a compile error rather than a run-time failure.

```kex
using FS

main do
  match FS.File.open("notes.txt", Read) do
    Ok(handle) => do
      IO.printLine(handle.read.or(""))
      handle.close
    end
    Error(e) => IO.printError("cannot open: ${e}")
  end
end
```

Reach for a handle when you want to walk a large file a line at a time, or make many small writes. When a file fits comfortably in memory, `FS.File.read` and `FS.File.write` are shorter and need no closing. To be rid of the closing entirely, pass `FS.File.open` a block.

The handle methods are `foul`: obtaining a handle is not an effect, but reading or writing through one is, so a function that does so is `foul` no matter where the handle came from. Injection makes a thing substitutable, not pure.

Implements [`Readable`](#trait-readable), [`Writable`](#trait-writable).

### Methods

#### `close`

```kex
close : Void
```

Closes the handle, flushing anything still buffered.

Close every handle you open. A written file is not guaranteed to be complete on disk until its handle is closed. Passing `FS.File.open` a block closes the handle for you.

**Examples**

```kex
match FS.File.open("out.txt", Write) do
  Ok(handle) => do
    handle.printLine("hello")
    handle.close
  end
  Error(_) => IO.printError("cannot open out.txt")
end
```

#### `seek`

```kex
seek(offset: Integer) -> Result<Void, ReadError>
```

Moves the handle's cursor to an absolute byte offset from the start of the file. Read and write share one cursor, so this repositions both — a `readLine` right after `seek(0)` starts over from the top, and a `write` right after does too, overwriting from that point.

**Parameters**

  - `offset` — the byte offset to seek to, from the start of

**Returns**: `Ok` on success, or why the seek

**Examples**

_Reading a length-prefixed record, then rewinding past it_

```kex
let length = handle.readLine.or("0").to(Integer).or(0)
let record = handle.readBytes.try
handle.seek(0)
```

#### `reset`

```kex
reset : Result<Void, ReadError>
```

Moves the handle's cursor back to the start of the file — the same as `seek(0)`, for the common case of re-reading a handle from the top.

**Returns**: `Ok` on success, or why the reset

**Examples**

_Reading a file twice_

```kex
let firstPass = handle.read.or("")
handle.reset
let secondPass = handle.read.or("")
```

### On `FileHandle<CanRead, W>`

#### `getLine` (from Readable)

```kex
getLine : Result<String?, ReadError>
```

Reads the next line from the handle, without its newline.

Answers `None` at end of file, which is what makes it usable as a loop condition. The same operation as `readLine`, under the name `IO.getLine` uses.

**Returns**: the next line, or `None` at end of file

**Examples**

_Walking a file line by line_

```kex
foul echo(handle: FileHandle<CanRead, W>) -> Void do
  match handle.getLine do
    Just(line) => do
      IO.printLine(line)
      echo(handle)
    end
    None => ()
  end
end
```

#### `get` (from Readable)

```kex
get : Result<String?, ReadError>
```

Reads a single character from the handle, as a one-character `String`.

Answers `None` at end of file.

**Returns**: the next character, or `None` at end of file

**Examples**

```kex
let firstChar = handle.get.or("")
```

#### `readLine` (from Readable)

```kex
readLine : Result<String?, ReadError>
```

Reads the next line from the handle, without its newline. The same as `getLine`, named for reading from a file rather than from a console.

**Returns**: the next line, or `None` at end of file

**Examples**

```kex
let header = handle.readLine.or("")
```

_Reading the first three lines_

```kex
let head = (1..3).items.map { |_| handle.readLine.or("") }
```

#### `read` (from Readable)

```kex
read : Result<String, ReadError>
```

Reads everything remaining in the file and returns it as one `String`.

Reads from the current position, so calling it after a `readLine` gives the rest of the file rather than the whole of it.

**Returns**: the remaining contents

**Examples**

```kex
let body = handle.read.or("")
```

_Skipping a header line, then taking the rest_

```kex
handle.readLine
let body = handle.read.or("")
```

#### `readBytes` (from Readable)

```kex
readBytes : Result<Binary, ReadError>
```

Reads all remaining bytes from the handle without decoding them.

Unlike `read`, this accepts arbitrary binary data and cannot fail because the input is not valid UTF-8. It starts at the handle's current position.

**Returns**: the remaining bytes

**Examples**

_Reading a file with an unknown encoding_

```kex
let payload = handle.readBytes.try
```

#### `eof?` (from Readable)

```kex
eof? : Bool
```

Returns `true` when the handle has reached the end of the file.

**Returns**: `true` at end of file

**Examples**

```kex
handle.eof?   # => false, before anything has been read
```

#### `atEnd?` (from Readable)

```kex
atEnd? : Bool
```

Returns `true` when the handle has reached the end of the file. The same as `eof?`, spelled out.

**Returns**: `true` at end of file

**Examples**

```kex
if !handle.atEnd?
  IO.printLine(handle.readLine.or(""))
end
```

#### `feed`

```kex
feed : Feed<String>?
```

Returns the handle's remaining lines as a lazy `Feed`.

Lines are read on demand off the handle's own position, so this is how to look at the start of a very large file, or process one without holding it all in memory. The feed shares the handle's cursor: interleaving `readLine` with it advances one position through one open file.

The feed ends at the last line, so taking more lines than the file has answers just the lines there are.

NOT part of `Readable`: a feed is neither pure nor reusable, so requiring it of every `Readable` would put a foul, one-shot operation on types that have no such cursor to offer. It stays a FileHandle method.

**Returns**: the lines as a feed, or `None`

**Examples**

_The first ten lines of a large file_

```kex
handle.feed
  .map { |lines| lines.take(10) }
  .or([])
```

### On `FileHandle<R, CanWrite>`

#### `writeBytes` (from Writable)

```kex
writeBytes(content: Binary) -> Void
```

Writes `content` verbatim, without text encoding or a trailing newline.

**Parameters**

  - `content` — the bytes to write

**Examples**

_Copying an opaque payload_

```kex
destination.writeBytes(source.readBytes.try)
```

#### `printLine` (from Writable)

```kex
printLine(content: Showable) -> Void
```

Writes `content` followed by a newline.

**Parameters**

  - `content` — the value to write

**Examples**

_Writing a report line by line_

```kex
rows.each { |row| handle.printLine(row) }
```

#### `print` (from Writable)

```kex
print(content: Showable) -> Void
```

Writes `content` with no trailing newline.

**Parameters**

  - `content` — the value to write

**Examples**

_Building a line from pieces_

```kex
handle.print("name,")
handle.print("age")
handle.printLine("")
```

#### `writeLine` (from Writable)

```kex
writeLine(content: Showable) -> Void
```

Writes `content` followed by a newline. The same as `printLine`, named for writing to a file rather than to a console.

**Parameters**

  - `content` — the value to write

**Examples**

```kex
handle.writeLine("done")
```

#### `write` (from Writable)

```kex
write(content: Showable) -> Void
```

Writes `content` with no trailing newline. The same as `print`.

**Parameters**

  - `content` — the value to write

**Examples**

_Writing a whole document in one call_

```kex
handle.write(rendered)
```
