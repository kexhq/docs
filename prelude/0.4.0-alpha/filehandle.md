---
package: prelude
version: "0.4.0-alpha"
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

`ReadFailed` means the source refused the read. `InvalidUtf8` means bytes were read but are not valid UTF-8, and carries the byte offset of the first malformed sequence, relative to that one operation. A failed read consumes the bytes it attempted to read and never substitutes U`FFFD: use `readBytes+ to recover the payload verbatim.



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


#### `getLine`

Reads the next line, without its newline.

```kex
getLine : Result<String?, ReadError>
```

**Returns**: `Result<String?, ReadError>` — the next line, `Ok(None)` at end of

#### `get`

Reads a single character, as a one-character `String`.

Reads one complete Unicode scalar, not one byte.

```kex
get : Result<String?, ReadError>
```

**Returns**: `Result<String?, ReadError>` — the next character, `Ok(None)` at end

#### `readLine`

Reads the next line, without its newline. The same as `getLine`.

```kex
readLine : Result<String?, ReadError>
```

**Returns**: `Result<String?, ReadError>` — the next line, `Ok(None)` at end of

#### `read`

Reads everything remaining, as one `String`.

Draining an exhausted source answers `Ok("")`.

```kex
read : Result<String, ReadError>
```

**Returns**: `Result<String, ReadError>` — the remaining contents, or the failure

#### `readBytes`

Reads everything remaining as raw bytes, without decoding it as text.

The byte counterpart of `read`: it never validates UTF-8, so it recovers the payload of a source that is not text, or one `read` has just rejected. Draining an exhausted source answers `Ok(Binary.fromBytes([]))`.

```kex
readBytes : Result<Binary, ReadError>
```

**Returns**: `Result<Binary, ReadError>` — the remaining bytes, or the failure

#### `eof?`

Returns `true` when the source has reached its end.

```kex
eof? : Bool
```

**Returns**: `Bool` — `true` at end of input

#### `atEnd?`

Returns `true` when the source has reached its end. The same as `eof?`.

```kex
atEnd? : Bool
```

**Returns**: `Bool` — `true` at end of input

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


#### `printLine`

Writes `content` followed by a newline.

```kex
printLine : Showable -> Void
```

**Returns**: `Void`

#### `print`

Writes `content` with no trailing newline.

```kex
print : Showable -> Void
```

**Returns**: `Void`

#### `writeLine`

Writes `content` followed by a newline. The same as `printLine`.

```kex
writeLine : Showable -> Void
```

**Returns**: `Void`

#### `write`

Writes `content` with no trailing newline. The same as `print`.

```kex
write : Showable -> Void
```

**Returns**: `Void`

#### `writeBytes`

Writes `content` as raw bytes, with no trailing newline.

The byte counterpart of `write`: the payload goes to the sink exactly as given. It never renders the value, so a `Binary` reaches the sink as its bytes rather than as the `#Binary<N bytes>` that `Showable` would print.

```kex
writeBytes : Binary -> Void
```

**Returns**: `Void`

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



## make `FileHandle<CanRead, W>` implements [Readable](#trait-readable)


#### `getLine`

Reads the next line from the handle, without its newline.

Answers `None` at end of file, which is what makes it usable as a loop condition. The same operation as `readLine`, under the name `IO.getLine` uses.

```kex
getLine() : Result<String?, ReadError>
```

**Returns**: `String?` — the next line, or `None` at end of file

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

#### `get`

Reads a single character from the handle, as a one-character `String`.

Answers `None` at end of file.

```kex
get() : Result<String?, ReadError>
```

**Returns**: `String?` — the next character, or `None` at end of file

**Examples**

```kex
let firstChar = handle.get.or("")
```

#### `readLine`

Reads the next line from the handle, without its newline. The same as `getLine`, named for reading from a file rather than from a console.

```kex
readLine() : Result<String?, ReadError>
```

**Returns**: `String?` — the next line, or `None` at end of file

**Examples**

```kex
let header = handle.readLine.or("")
```
_Reading the first three lines_

```kex
let head = (1..3).items.map { |_| handle.readLine.or("") }
```

#### `read`

Reads everything remaining in the file and returns it as one `String`.

Reads from the current position, so calling it after a `readLine` gives the rest of the file rather than the whole of it.

```kex
read() : Result<String, ReadError>
```

**Returns**: `String?` — the remaining contents, or `None`

**Examples**

```kex
let body = handle.read.or("")
```
_Skipping a header line, then taking the rest_

```kex
handle.readLine
let body = handle.read.or("")
```

#### `readBytes`

Reads all remaining bytes from the handle without decoding them.

Unlike `read`, this accepts arbitrary binary data and cannot fail because the input is not valid UTF-8. It starts at the handle's current position.

```kex
readBytes() : Result<Binary, ReadError>
```

**Returns**: `Binary` — the remaining bytes

**Examples**

_Reading a file with an unknown encoding_

```kex
let payload = handle.readBytes.try
```

#### `eof?`

Returns `true` when the handle has reached the end of the file.

```kex
eof?() : Bool
```

**Returns**: `Bool` — `true` at end of file

**Examples**

```kex
handle.eof?   # => false, before anything has been read
```

#### `atEnd?`

Returns `true` when the handle has reached the end of the file. The same as `eof?`, spelled out.

```kex
atEnd?() : Bool
```

**Returns**: `Bool` — `true` at end of file

**Examples**

```kex
if !handle.atEnd?
  IO.printLine(handle.readLine.or(""))
end
```

#### `feed`

Returns the handle's remaining lines as a lazy `Feed`.

Lines are read on demand off the handle's own position, so this is how to look at the start of a very large file, or process one without holding it all in memory. The feed shares the handle's cursor: interleaving `readLine` with it advances one position through one open file.

The feed ends at the last line, so taking more lines than the file has answers just the lines there are.

NOT part of `Readable`: a feed is neither pure nor reusable, so requiring it of every `Readable` would put a foul, one-shot operation on types that have no such cursor to offer. It stays a FileHandle method.

```kex
feed() : Feed<String>?
```

**Returns**: `Feed<String>?` — the lines as a feed, or `None`

**Examples**

_The first ten lines of a large file_

```kex
handle.feed
  .map { |lines| lines.take(10) }
  .or([])
```

## make `FileHandle<R, CanWrite>` implements [Writable](#trait-writable)


#### `writeBytes`

Writes `content` verbatim, without text encoding or a trailing newline.

```kex
writeBytes(content) : Binary -> Void
```

**Returns**: `Void`

**Examples**

_Copying an opaque payload_

```kex
destination.writeBytes(source.readBytes.try)
```

#### `printLine`

Writes `content` followed by a newline.

```kex
printLine(content) : Showable -> Void
```

**Returns**: `Void`

**Examples**

_Writing a report line by line_

```kex
rows.each { |row| handle.printLine(row) }
```

#### `print`

Writes `content` with no trailing newline.

```kex
print(content) : Showable -> Void
```

**Returns**: `Void`

**Examples**

_Building a line from pieces_

```kex
handle.print("name,")
handle.print("age")
handle.printLine("")
```

#### `writeLine`

Writes `content` followed by a newline. The same as `printLine`, named for writing to a file rather than to a console.

```kex
writeLine(content) : Showable -> Void
```

**Returns**: `Void`

**Examples**

```kex
handle.writeLine("done")
```

#### `write`

Writes `content` with no trailing newline. The same as `print`.

```kex
write(content) : Showable -> Void
```

**Returns**: `Void`

**Examples**

_Writing a whole document in one call_

```kex
handle.write(rendered)
```

## make `FileHandle<R, W>`


#### `close`

Closes the handle, flushing anything still buffered.

Close every handle you open. A written file is not guaranteed to be complete on disk until its handle is closed. Passing `FS.File.open` a block closes the handle for you.

```kex
close() : Void
```

**Returns**: `Void`

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
