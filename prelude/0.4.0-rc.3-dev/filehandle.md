---
package: prelude
version: "0.4.0-rc.3-dev"
source: filehandle.kex
title: FileHandle
entities:
  - { kind: type, name: "ReadError" }
  - { kind: type, name: "WriteError" }
  - { kind: trait, name: "Readable" }
  - { kind: trait, name: "Writable" }
  - { kind: trait, name: "Closeable" }
  - { kind: type, name: "FileHandle" }
  - { kind: make, name: "FileHandle<CanRead, W>" }
  - { kind: make, name: "FileHandle<R, CanWrite>" }
  - { kind: make, name: "FileHandle<R, W>" }
---

# FileHandle

## type `ReadError`

Why a read failed.

`ReadFailed` means the source refused the read. `InvalidUtf8` means bytes were read but are not valid UTF-8, and carries the byte offset of the first malformed sequence, relative to that one operation. A failed read consumes the bytes it attempted to read and never substitutes U+FFFD: use `readBytes` instead of a text read when you need the original bytes.

**Variants**

  - `ReadFailed`
  - `InvalidUtf8(Integer)`



## type `WriteError`

Why a write failed: the sink refused it. A closed handle, a full device, or standard input all answer `WriteFailed`.

**Variants**

  - `WriteFailed`



## trait `Readable`

`Readable`: a source of bytes and text.

`IO.in` and file handles opened for reading are `Readable`. Accept this trait when your function should work with either source.

Two families read text. The `read` family (`readLine`, `read`, `readBytes`) answers a `Result`, so a failed read can be told apart from the end of the input. The `get` family is the short form: `getLine` answers an `Optional`, `None` both at the end and on a failed read, which is what most interactive code wants. `get` itself is the primitive the rest stand on: the next chunk of raw bytes.

```kex
foul firstLine(source: Readable) -> String do
  source.getLine.or("(empty)")
end

firstLine(IO.in)
firstLine(FS.File.open("notes.txt", Read).try)
```

Implemented by [`FileHandle<CanRead, W>`](#make-filehandle-canread).

### Required functions

#### `get`

```kex
get -> Result<Binary?, ReadError>
```

Reads the next chunk of bytes: whatever the source has ready, up to its buffer size. Standard input answers one line at a time, newline included.

**Returns**: the next chunk, `Ok(None)` at end of input, or the failure

#### `readLine`

```kex
readLine -> Result<String?, ReadError>
```

Reads the next line, without its newline.

**Returns**: the next line, `Ok(None)` at end of input, or the failure

#### `getLine`

```kex
getLine -> String?
```

Reads the next line, without its newline: `readLine` for when the end of the input and a failed read mean the same thing.

**Returns**: the next line, or `None` at end of input or on failure

#### `read`

```kex
read -> Result<String, ReadError>
```

Reads everything remaining, as one `String`.

Draining an exhausted source answers `Ok("")`.

**Returns**: the remaining contents, or the failure

#### `readBytes`

```kex
readBytes -> Result<Binary, ReadError>
```

Reads everything remaining as raw bytes, without decoding it as text.

The byte counterpart of `read`: it returns the remaining bytes without validating UTF-8. Bytes consumed by a failed text read are not returned by a subsequent `readBytes` call. Draining an exhausted source answers `Ok(Binary.fromBytes([]))`.

**Returns**: the remaining bytes, or the failure

#### `eof?`

```kex
eof? -> Bool
```

Returns `true` when the source has reached its end.

**Returns**: `true` at end of input



## trait `Writable`

`Writable`: a sink for bytes and text.

Accept a `Writable` parameter to let callers choose standard output, standard error, or a file as the destination.

Two families write text. The `write` family (`put`, `write`, `writeLine`) answers a `Result`, for when a failed write matters. The `print` family (`print`, `printLine`) answers `Void`, for output where there is nothing useful to do about a failure. `put` is the primitive the rest stand on: raw bytes, verbatim.

```kex
foul report(out: Writable, lines: [String]) -> Void do
  lines.each { |line| out.printLine(line) }
end

report(IO.out, results)
report(IO.error, warnings)
report(FS.File.open("report.txt", Write).try, results)
```

Implemented by [`FileHandle<R, CanWrite>`](#make-filehandle-canwrite).

### Required functions

#### `put`

```kex
put(content: Binary) -> Result<Void, WriteError>
```

Writes `content` verbatim, with no trailing newline.

It never renders the value, so a `Binary` reaches the sink as its bytes rather than as the `#Binary<N bytes>` that `Showable` would print.

**Parameters**

  - `content` — the bytes to write

**Returns**: `Ok`, or why the write failed

#### `write`

```kex
write(content: Showable) -> Result<Void, WriteError>
```

Writes `content` with no trailing newline.

**Parameters**

  - `content` — the value to write

**Returns**: `Ok`, or why the write failed

#### `writeLine`

```kex
writeLine(content: Showable) -> Result<Void, WriteError>
```

Writes `content` followed by a newline.

**Parameters**

  - `content` — the value to write

**Returns**: `Ok`, or why the write failed

#### `print`

```kex
print(content: Showable) -> Void
```

Writes `content` with no trailing newline, ignoring a failure. Use `write` when a failure matters.

**Parameters**

  - `content` — the value to write

#### `printLine`

```kex
printLine(content: Showable) -> Void
```

Writes `content` followed by a newline, ignoring a failure. Use `writeLine` when a failure matters.

**Parameters**

  - `content` — the value to write



## trait `Closeable`

`Closeable`: anything that holds a releasable resource.

File handles, socket connections, listeners, and datagram sockets are all `Closeable`. Closing is idempotent everywhere, so a shared cleanup path never has to track who closed what.

```kex
foul shutdown(first: Closeable, second: Closeable) -> Void do
  first.close
  second.close
end

shutdown(handle, listener)
```

Implemented by [`FileHandle<R, W>`](#make-filehandle), [`Net.Socket.TCP.TCPConnection`](net/socket.md#make-net-socket-tcp-tcpconnection), [`Net.Socket.TCP.TCPListener`](net/socket.md#make-net-socket-tcp-tcplistener), [`Net.Socket.UDP.Socket`](net/socket.md#make-net-socket-udp-socket), [`Net.Socket.Unix.UnixConnection`](net/socket.md#make-net-socket-unix-unixconnection), [`Net.Socket.Unix.UnixListener`](net/socket.md#make-net-socket-unix-unixlistener), [`Net.Socket.TLS.TLSConnection`](net/socket.md#make-net-socket-tls-tlsconnection).

### Required functions

#### `close`

```kex
close -> Void
```

Releases the underlying resource. Idempotent: closing twice is fine.



## type `FileHandle<R, W>`

An open file, obtained from `FS.File.open`.

The two type parameters record what the handle is allowed to do: `R` is `CanRead` or `CannotRead`, `W` is `CanWrite` or `CannotWrite`. `FS.File.open` picks them from the mode you pass, so calling `printLine` on a handle opened `Read` is a compile error rather than a run-time failure.

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

The handle functions are `foul`: obtaining a handle is not an effect, but reading or writing through one is, so a function that does so is `foul` no matter where the handle came from. Injection makes a thing substitutable, not pure.

Implements [`Readable`](#trait-readable), [`Writable`](#trait-writable), [`Closeable`](#trait-closeable).

### Functions

#### `seek` (foul)

```kex
seek(offset: Integer) -> Result<Void, ReadError>
```

Moves the handle's cursor to an absolute byte offset from the start of the file. Read and write share one cursor, so this repositions both — a `getLine` right after `seek(0)` starts over from the top, and a `print` right after does too, overwriting from that point.

**Parameters**

  - `offset` — the byte offset to seek to, from the start of the file

**Returns**: `Ok` on success, or why the seek failed

**Examples**

_Reading a length-prefixed record, then rewinding past it_

```kex
let length = handle.getLine.or("0").to(Integer).or(0)
let record = handle.readBytes.try
handle.seek(0)
```

#### `reset` (foul)

```kex
reset -> Result<Void, ReadError>
```

Moves the handle's cursor back to the start of the file — the same as `seek(0)`, for the common case of re-reading a handle from the top.

**Returns**: `Ok` on success, or why the reset failed

**Examples**

_Reading a file twice_

```kex
let firstPass = handle.read.or("")
handle.reset
let secondPass = handle.read.or("")
```

#### `close` (foul) (from Closeable)

```kex
close -> Void
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

### On `FileHandle<CanRead, W>`

#### `get` (foul) (from Readable)

```kex
get -> Result<Binary?, ReadError>
```

Reads the next chunk of bytes from the handle, up to 64 KiB.

**Returns**: the next chunk, or `None` at end of file

**Examples**

_Copying a file a chunk at a time_

```kex
foul copy(source: FileHandle<CanRead, W>, target: FileHandle<R, CanWrite>) -> Void do
  match source.get do
    Ok(Just(chunk)) => do
      target.put(chunk)
      copy(source, target)
    end
    _ => ()
  end
end
```

#### `readLine` (foul) (from Readable)

```kex
readLine -> Result<String?, ReadError>
```

Reads the next line from the handle, without its newline.

**Returns**: the next line, `Ok(None)` at end of file, or the failure

**Examples**

_Walking a file line by line_

```kex
foul echo(handle: FileHandle<CanRead, W>) -> Void do
  match handle.readLine do
    Ok(Just(line)) => do
      IO.printLine(line)
      echo(handle)
    end
    Ok(None) => ()
    Error(e) => IO.printError("read failed: ${e}")
  end
end
```

#### `getLine` (foul) (from Readable)

```kex
getLine -> String?
```

Reads the next line from the handle, without its newline.

**Returns**: the next line, or `None` at end of file or on failure

**Examples**

```kex
let header = handle.getLine.or("")
```

#### `getChar` (foul)

```kex
getChar -> String?
```

Reads a single character from the handle, as a one-character `String`: one complete Unicode scalar, not one byte.

**Returns**: the next character, or `None` at end of file or on failure

**Examples**

```kex
let firstChar = handle.getChar.or("")
```

#### `read` (foul) (from Readable)

```kex
read -> Result<String, ReadError>
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
handle.getLine
let body = handle.read.or("")
```

#### `readBytes` (foul) (from Readable)

```kex
readBytes -> Result<Binary, ReadError>
```

Reads all remaining bytes from the handle without decoding them.

Unlike `read`, this accepts arbitrary binary data and cannot fail because the input is not valid UTF-8. It starts at the handle's current position.

**Returns**: the remaining bytes

**Examples**

_Reading a file with an unknown encoding_

```kex
let payload = handle.readBytes.try
```

#### `eof?` (foul) (from Readable)

```kex
eof? -> Bool
```

Returns `true` when the handle has reached the end of the file.

**Returns**: `true` at end of file

**Examples**

```kex
handle.eof?   # => false, before anything has been read
```

#### `feed` (foul)

```kex
feed -> Result<Feed<String>, ReadError>
```

Returns the handle's remaining lines as a lazy `Feed`.

Lines are read on demand off the handle's own position, so this is how to look at the start of a very large file, or process one without holding it all in memory. The feed shares the handle's cursor: interleaving `readLine` with it advances one position through one open file.

The feed ends at the last line, so taking more lines than the file has answers just the lines there are.

NOT part of `Readable`: a feed is neither pure nor reusable, so requiring it of every `Readable` would put a foul, one-shot operation on types that have no such cursor to offer. It stays a FileHandle function.

**Returns**: the lines as a feed, or `ReadFailed` for a handle that cannot be read line by line

**Examples**

_The first ten lines of a large file_

```kex
handle.feed
  .map { |lines| lines.take(10) }
  .or([])
```

### On `FileHandle<R, CanWrite>`

#### `put` (foul) (from Writable)

```kex
put(content: Binary) -> Result<Void, WriteError>
```

Writes `content` verbatim, without text encoding or a trailing newline.

**Parameters**

  - `content` — the bytes to write

**Returns**: `Ok`, or why the write failed

**Examples**

_Copying an opaque payload_

```kex
destination.put(source.readBytes.try)
```

#### `write` (foul) (from Writable)

```kex
write(content: Showable) -> Result<Void, WriteError>
```

Writes `content` with no trailing newline.

**Parameters**

  - `content` — the value to write

**Returns**: `Ok`, or why the write failed

**Examples**

```kex
handle.write("total: ${total}").try
```

#### `writeLine` (foul) (from Writable)

```kex
writeLine(content: Showable) -> Result<Void, WriteError>
```

Writes `content` followed by a newline.

**Parameters**

  - `content` — the value to write

**Returns**: `Ok`, or why the write failed

**Examples**

_Stopping at the first failed write_

```kex
rows.each { |row| handle.writeLine(row).try }
```

#### `printLine` (foul) (from Writable)

```kex
printLine(content: Showable) -> Void
```

Writes `content` followed by a newline, ignoring a failure.

**Parameters**

  - `content` — the value to write

**Examples**

_Writing a report line by line_

```kex
rows.each { |row| handle.printLine(row) }
```

#### `print` (foul) (from Writable)

```kex
print(content: Showable) -> Void
```

Writes `content` with no trailing newline, ignoring a failure.

**Parameters**

  - `content` — the value to write

**Examples**

_Building a line from pieces_

```kex
handle.print("name,")
handle.print("age")
handle.printLine("")
```
