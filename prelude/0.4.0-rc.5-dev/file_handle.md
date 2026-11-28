---
package: prelude
version: "0.4.0-rc.5-dev"
source: file_handle.kex
title: FileHandle
entities:
  - { kind: type, name: "ReadError" }
  - { kind: type, name: "WriteError" }
  - { kind: trait, name: "Readable" }
  - { kind: trait, name: "Writable" }
  - { kind: trait, name: "Closeable" }
  - { kind: type, name: "FileHandle" }
  - { kind: type, name: "CanRead" }
  - { kind: type, name: "CannotRead" }
  - { kind: type, name: "CanWrite" }
  - { kind: type, name: "CannotWrite" }
  - { kind: make, name: "FileHandle<CanRead, W>" }
  - { kind: make, name: "FileHandle<R, CanWrite>" }
  - { kind: make, name: "FileHandle<R, W>" }
---

# FileHandle

## type `ReadError`

Why a read failed.

`ReadFailed` means the source refused the read. `InvalidUtf8` means the bytes read are not valid UTF-8; it carries the offset of the first bad byte, counted from the start of that read. A failed text read still consumes the bytes it read, and never replaces bad bytes with U+FFFD. Use `readBytes` when the input may not be text.

**Variants**

  - `ReadFailed`
  - `InvalidUtf8(Integer)`



## type `WriteError`

Why a write failed. Writing to a closed handle, to a full device or to standard input all give `WriteFailed`.

**Variants**

  - `WriteFailed`



## trait `Readable`

A source of bytes and text.

`IO.in` and file handles opened for reading are `Readable`. Take this trait as a parameter type when a function should read from either.

`readLine`, `read` and `readBytes` return a `Result`, so a failed read can be told from the end of the input. `getLine` returns `None` in both cases, which is usually enough for interactive code. `get` returns the next chunk of raw bytes.

```kex
foul firstLine(source: Readable) -> String do
  source.getLine.or("(empty)")
end

firstLine(IO.in)
firstLine(FS.File.open("notes.txt", FS.Read).try)
```

Implemented by [`FileHandle<CanRead, W>`](#make-filehandle-canread).

### Required functions

#### `get`

```kex
get -> Result<Binary?, ReadError>
```

Reads the next chunk of bytes, as much as the source has ready up to its buffer size. Standard input gives one line at a time, newline included.

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

Reads the next line, without its newline. Unlike `readLine`, it returns `None` both at the end of the input and on a failed read.

**Returns**: the next line, or `None` at end of input or on failure

#### `read`

```kex
read -> Result<String, ReadError>
```

Reads everything remaining, as one `String`.

At the end of the input it returns `Ok("")`.

**Returns**: the remaining contents, or the failure

#### `readBytes`

```kex
readBytes -> Result<Binary, ReadError>
```

Reads everything remaining as raw bytes, without decoding it as text.

Bytes already consumed by a failed text read are not returned again. At the end of the input it returns `Ok` with an empty `Binary`.

**Returns**: the remaining bytes, or the failure

#### `eof?`

```kex
eof? -> Bool
```

Returns `true` when the source has reached its end.

**Returns**: `true` at end of input



## trait `Writable`

A destination for bytes and text.

Take a `Writable` parameter to let callers send output to standard output, standard error or a file.

`put`, `write` and `writeLine` return a `Result`, for when a failed write matters. `print` and `printLine` return `Void` and ignore failures. `put` writes raw bytes as they are.

```kex
foul report(out: Writable, lines: [String]) -> Void do
  lines.each { |line| out.printLine(line) }
end

report(IO.out, results)
report(IO.error, warnings)
report(FS.File.open("report.txt", FS.Write).try, results)
```

Implemented by [`FileHandle<R, CanWrite>`](#make-filehandle-canwrite).

### Required functions

#### `put`

```kex
put(content: Binary) -> Result<Void, WriteError>
```

Writes `content` verbatim, with no trailing newline.

The bytes are written as they are, not as the `#Binary<N bytes>` that `write` would print.

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

Anything that holds a resource to release.

File handles, socket connections, listeners and datagram sockets are `Closeable`. Closing something already closed does nothing, so cleanup code need not track what was closed.

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

Releases the resource. Closing twice is harmless.



## type `FileHandle<R, W>`

An open file, obtained from `FS.File.open`.

The two type parameters say what the handle may do: `R` is `CanRead` or `CannotRead`, `W` is `CanWrite` or `CannotWrite`. `FS.File.open` sets them from the mode, so calling `printLine` on a handle opened `Read` is a type error.

```kex
using FS

main do
  match FS.File.open("notes.txt", FS.Read) do
    Ok(handle) => do
      IO.printLine(handle.read.or(""))
      handle.close
    end
    Error(e) => IO.printError("cannot open: ${e}")
  end
end
```

Use a handle to read a large file a line at a time or to make many small writes. When a file fits in memory, `FS.File.read` and `FS.File.write` are shorter and need no closing. Passing `FS.File.open` a block closes the handle for you.

Reading or writing through a handle is `foul`, so a function that does it is `foul` too, even when the handle was passed in as a parameter.

Implements [`Readable`](#trait-readable), [`Writable`](#trait-writable), [`Closeable`](#trait-closeable).

### Functions

#### `seek` (foul)

```kex
seek(offset: Integer) -> Result<Void, ReadError>
```

Moves the handle's position to `offset` bytes from the start of the file.

Reads and writes share one position, so after `seek(0)` a `getLine` reads the first line again and a `print` overwrites from the start.

**Parameters**

  - `offset` — the byte offset to seek to, from the start of the file

**Returns**: `Ok` on success, or why the seek failed

**Examples**

_Reading the first line twice_

```kex
let first = handle.getLine
handle.seek(0)
handle.getLine == first   # => true
```

#### `reset` (foul)

```kex
reset -> Result<Void, ReadError>
```

Moves the handle's position back to the start of the file, as `seek(0)` does.

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

Close every handle you open: a written file may be incomplete on disk until its handle is closed. Passing `FS.File.open` a block closes the handle for you.

**Examples**

```kex
match FS.File.open("out.txt", FS.Write) do
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

Reads one character from the handle, a whole Unicode scalar value rather than one byte, as a one-character `String`.

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

It reads from the current position, so after a `readLine` it returns the rest of the file.

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

Unlike `read`, it cannot fail on invalid UTF-8. It starts at the handle's current position.

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

Lines are read as the feed is consumed, so you can look at the start of a very large file, or process it, without holding it all in memory. The feed shares the handle's position, so mixing `readLine` calls with it reads through the same file. Taking more lines than the file has returns the lines there are.

This is not part of `Readable`, so `IO.in` does not have it.

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

Writes the bytes of `content` as they are, with no trailing newline.

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

## type `CanRead`

The type arguments of `FileHandle` that say what it allows: `FileHandle<CanRead, CannotWrite>` can read and cannot write. These types have no values. They exist so that reading from a write-only handle is a type error.



## type `CannotRead`



## type `CanWrite`



## type `CannotWrite`


