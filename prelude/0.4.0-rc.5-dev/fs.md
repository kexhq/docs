---
package: prelude
version: "0.4.0-rc.5-dev"
source: fs.kex
title: FS
entities:
  - { kind: module, name: "FS" }
---

# FS

## module `FS`

Files, directories and paths. Bring them into scope with `using FS`.

```kex
using FS

main do
  match FS.File.read("config.txt") do
    Ok(text) => IO.printLine(text.lines.count)
    Error(_) => IO.printError("config.txt is missing")
  end
end
```

It has three parts:

```kex
FS.File        reading, writing, copying and deleting files
FS.Directory   creating, listing and removing directories
FS.Path        path arithmetic, which never touches the filesystem
```

`FS.File` and `FS.Directory` use the real filesystem, so only `foul` code can call them. `FS.File` is a capability: a test can swap it for a fake within a block with `with FS.File = ... do ... end`.

Functions that can fail return a `Result` with a `FileError`, so a missing file is a value to match on. Questions such as `exists?`, `file?` and `directory?` return a `Bool`, and `Directory.home`, which may not be known, returns an `Optional`.

### `permissionMode`

```kex
permissionMode(permissions: [Permission]) -> Integer
```

Returns the POSIX mode `FS.File.changePermission` gives a file.

The owner gets every listed permission, and everyone else gets the same without `Writable`.

**Parameters**

  - `permissions` — everything the file should allow

**Returns**: the permission bits

**Examples**

```kex
FS.permissionMode([FS.Readable, FS.Writable])   # => 420, which is 0o644
```

## type `FilePath`

A filesystem path. It is another name for `String`, so every `String` function works on one; `FS.Path` has the path functions.

**Variants**

  - `String`



## type `FileMode`

How to open a file: `Read` to read it, `Write` to replace it, `Append` to add to its end, `ReadWrite` for both. The mode sets the type of the `FileHandle` you get, and so which functions you can call on it.

**Variants**

  - `Read`
  - `Write`
  - `Append`
  - `ReadWrite`



## type `Permission`

Something a file may allow, for `FS.File.changePermission`.

**Variants**

  - `Readable`
  - `Writable`
  - `Executable`



## type `FileError`

A file operation that failed, with the path or paths it failed on.

Each variant but `InvalidUtf8` names the operation the filesystem refused: opening, reading, writing, creating, deleting, copying from the first path to the second, renaming the first to the second, or changing permissions. `InvalidUtf8` means the file was read but is not valid UTF-8; it carries the byte offset of the first bad sequence.

**Variants**

  - `OpenFailed(FilePath)`
  - `ReadFailed(FilePath)`
  - `WriteFailed(FilePath)`
  - `CreateFailed(FilePath)`
  - `DeleteFailed(FilePath)`
  - `CopyFailed(FilePath, FilePath)`
  - `RenameFailed(FilePath, FilePath)`
  - `ModeFailed(FilePath)`
  - `InvalidUtf8(FilePath, Integer)`



## type `FileKind`

What a path names, as `FS.File.info` reports it.

A regular `:file`, a `:directory`, a `:symlink` (the link itself, not what it points to), or `:other` for devices, sockets and pipes.



## record `FileInfo`

The kind, size and modification time of a path, from `FS.File.info`.

**Fields**

  - `kind` : [FileKind](#type-fs-filekind)
  - `size` : [Integer](number.md#make-integer)
  - `modified` : [DateTime](date_time.md#record-datetime)



## module `FS.File`

Reading and writing files.

This is a capability, so a test can replace all of it within a block with `with FS.File = ... do ... end` and run file code without touching the disk. `Mock.Files` is a ready-made in-memory replacement.

### `open` (foul)

```kex
open(path: FilePath, mode: FileMode.Read) -> Result<FileHandle<CanRead, CannotWrite>, FileError>
open(path: FilePath, mode: FileMode.Write) -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path: FilePath, mode: FileMode.Append) -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path: FilePath, mode: FileMode.ReadWrite) -> Result<FileHandle<CanRead, CanWrite>, FileError>
open(path: FilePath, mode: FileMode.Read, block: (FileHandle<CanRead, CannotWrite> -> A)) -> Result<A, FileError>
open(path: FilePath, mode: FileMode.Write, block: (FileHandle<CannotRead, CanWrite> -> A)) -> Result<A, FileError>
open(path: FilePath, mode: FileMode.Append, block: (FileHandle<CannotRead, CanWrite> -> A)) -> Result<A, FileError>
open(path: FilePath, mode: FileMode.ReadWrite, block: (FileHandle<CanRead, CanWrite> -> A)) -> Result<A, FileError>
```

Opens `path` and returns a `FileHandle` for it.

The mode sets the handle's type, and the compiler checks its use: a handle opened `Read` has no `write`, and one opened `Write` has no `read`.

When the file fits in memory, the whole-file `read` and `write` are simpler. Use a handle to stream through a large file or to make many small writes, and close it when you are done; the block form of `open` closes it for you.

**Parameters**

  - `path` — the file to open
  - `mode` — `Read`, `Write`, `Append` or `ReadWrite`

**Returns**: the handle, or `OpenFailed`

**Examples**

_Reading a file line by line_

```kex
match FS.File.open("log.txt", FS.Read) do
  Ok(handle) => do
    IO.printLine(handle.getLine.or(""))
    handle.close
  end
  Error(e) => IO.printError("cannot open: ${e}")
end
```

_Writing a report_

```kex
match FS.File.open("report.txt", FS.Write) do
  Ok(handle) => do
    rows.each { |row| handle.printLine(row) }
    handle.close
  end
  Error(_) => IO.printError("cannot write report")
end
```

_A failure names the path_

```kex
FS.File.open("missing/x.txt", FS.Read)   # => Error(OpenFailed("missing/x.txt"))
```

### `read` (foul)

```kex
read(path: FilePath) -> Result<String, FileError>
```

Reads the whole file and decodes it as UTF-8 text.

Returns `Error(ReadFailed(path))` when the file does not exist or cannot be read, and `Error(InvalidUtf8(path, offset))` when it is not valid UTF-8. Use `FS.File.readBytes` for contents that are not text.

**Parameters**

  - `path` — the file to read

**Returns**: the contents, or the failure

**Examples**

```kex
FS.File.read("hello.txt")     # => Ok("hello\n")
FS.File.read("nowhere.txt")   # => Error(ReadFailed("nowhere.txt"))
```

_Reading with a default_

```kex
let config = FS.File.read("app.conf").or("")
```

_Counting words in a file_

```kex
FS.File.read("essay.txt").or("").split(" ").reject(~empty?).count
```

### `readBytes` (foul)

```kex
readBytes(path: FilePath) -> Result<Binary, FileError>
```

Reads the whole file as raw bytes, without decoding it as text.

Use it for images, archives and anything else that is not text. Returns `Error(ReadFailed(path))` when the file cannot be read.

**Parameters**

  - `path` — the file to read

**Returns**: the contents, or the failure

**Examples**

```kex
FS.File.readBytes("logo.png")   # => Ok(#Binary<2048 bytes>)
```

_Hashing a file_

```kex
FS.File.readBytes(path).map { |data| Digest.sha256(data).hex }
```

### `writeBytes` (foul)

```kex
writeBytes(path: FilePath, content: Binary) -> Result<Void, FileError>
```

Writes `content` to `path` as raw bytes, replacing whatever was there.

The bytes are written exactly as given. Returns `Error(WriteFailed(path))` when the write fails.

**Parameters**

  - `path` — the file to write
  - `content` — the bytes to write

**Returns**: `Ok` when the write succeeded, or the failure

**Examples**

```kex
FS.File.writeBytes("out.bin", Binary.fromBytes([0, 255])).ok?   # => true
```

_Copying a file without decoding it_

```kex
FS.File.readBytes(source).into { |data| FS.File.writeBytes(target, data) }
```

### `write` (foul)

```kex
write(path: FilePath, content: String) -> Result<Void, FileError>
```

Writes `content` to `path`, replacing whatever was there.

Creates the file if it does not exist, but not its directory; create that first with `FS.Directory.create`. Returns `Error(WriteFailed(path))` when the write fails.

**Parameters**

  - `path` — the file to write
  - `content` — the text to write

**Returns**: `Ok` when the write succeeded, or the failure

**Examples**

```kex
FS.File.write("out.txt", "hello\n").ok?   # => true
```

_Reporting a failed write_

```kex
if FS.File.write(target, rendered).error?
  IO.printError("could not write ${target}")
end
```

_Writing a list of lines_

```kex
FS.File.write("names.txt", names.join("\n") + "\n")
```

### `append` (foul)

```kex
append(path: FilePath, content: String) -> Result<Void, FileError>
```

Adds `content` to the end of `path`, keeping what is already there.

Creates the file if it does not exist.

**Parameters**

  - `path` — the file to append to
  - `content` — the text to add

**Returns**: `Ok` when the write succeeded, or `WriteFailed`

**Examples**

```kex
FS.File.append("app.log", "started\n")   # => Ok(())
```

_A simple logger_

```kex
foul log(message: String) -> Void do
  FS.File.append("app.log", "${Time.now.to(String).or("")} ${message}\n")
end
```

### `exists?` (foul)

```kex
exists?(path: FilePath) -> Bool
```

Returns whether anything exists at `path`, whether a file, a directory or something else. Use `file?` or `directory?` when the kind matters.

**Parameters**

  - `path` — the path to test

**Returns**: `true` when the path exists

**Examples**

```kex
FS.File.exists?("README.md")   # => true
FS.File.exists?("nowhere")     # => false
```

_Not overwriting an existing file_

```kex
if FS.File.exists?(target)
  IO.printError("${target} already exists")
else
  FS.File.write(target, content)
end
```

### `file?` (foul)

```kex
file?(path: FilePath) -> Bool
```

Returns whether `path` exists and is a regular file.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a regular file

**Examples**

```kex
FS.File.file?("README.md")   # => true
FS.File.file?("src")         # => false
```

### `directory?` (foul)

```kex
directory?(path: FilePath) -> Bool
```

Returns whether `path` exists and is a directory.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a directory

**Examples**

```kex
FS.File.directory?("src")        # => true
FS.File.directory?("README.md")  # => false
```

_Separating files from directories in a listing_

```kex
entries.partition { |e| FS.File.directory?(e) }
```

### `delete` (foul)

```kex
delete(path: FilePath) -> Result<Void, FileError>
```

Deletes the file at `path`.

Returns `DeleteFailed` when the file does not exist or cannot be removed. Use `FS.Directory.delete` for a directory.

**Parameters**

  - `path` — the file to delete

**Returns**: `Ok` when the file was deleted, or `DeleteFailed`

**Examples**

```kex
FS.File.delete("tmp.txt")   # => Ok(())
```

_Cleaning up after a temporary file_

```kex
FS.File.write(tmp, data)
process(tmp)
FS.File.delete(tmp)
```

### `copy` (foul)

```kex
copy(src: FilePath, dst: FilePath) -> Result<Void, FileError>
```

Copies the file at `src` to `dst`, replacing `dst` if it exists.

**Parameters**

  - `src` — the file to copy
  - `dst` — where to copy it

**Returns**: `Ok` when the copy succeeded, or `CopyFailed`

**Examples**

```kex
FS.File.copy("app.conf", "app.conf.bak")   # => Ok(())
```

_Backing a file up before rewriting it_

```kex
FS.File.copy(path, "${path}.bak")
FS.File.write(path, updated)
```

### `rename` (foul)

```kex
rename(src: FilePath, dst: FilePath) -> Result<Void, FileError>
```

Renames or moves the file at `src` to `dst`.

**Parameters**

  - `src` — the current path
  - `dst` — the new path

**Returns**: `Ok` when the rename succeeded, or `RenameFailed`

**Examples**

```kex
FS.File.rename("draft.txt", "final.txt")   # => Ok(())
```

_Writing to a temporary file, then swapping it in_

```kex
FS.File.write("${path}.tmp", content)
FS.File.rename("${path}.tmp", path)
```

### `changePermission` (foul)

```kex
changePermission(path: FilePath, permissions: [Permission]) -> Result<Void, FileError>
```

Sets what may be done with the file at `path`, in a way that works on every system.

The file gets exactly the listed permissions, and loses any left out. The owner gets all of them and everyone else the same without `Writable`: on POSIX that is `0o755` for all three, `0o644` for `[Readable, Writable]` and `0o444` for `[Readable]`. On Windows only `Writable` has an effect, through the read-only attribute.

Use `changeMode` for exact POSIX bits, such as a file only its owner may read.

**Parameters**

  - `path` — the file whose permissions to change
  - `permissions` — everything the file should allow

**Returns**: `Ok` when the permissions were changed, or `ModeFailed`

**Examples**

_Making a file read-only_

```kex
FS.File.changePermission("report.txt", [FS.Readable])   # => Ok(())
```

_Writing a script and running it_

```kex
FS.File.write(script, "#!/bin/sh\necho hello\n")
FS.File.changePermission(script, [FS.Readable, FS.Writable, FS.Executable])
Process.run(script, [])
```

### `changeMode` (foul)

```kex
changeMode(path: FilePath, mode: Integer) -> Result<Void, FileError>
```

Sets the POSIX permission bits of the file at `path` to `mode`, as `chmod` does with a numeric mode.

Write `mode` in octal: `0o600` lets only the owner read and write. The bits are replaced, not added to, and a mode outside `0o0000..0o7777` is a `ModeFailed` error. On Windows only the owner-write bit has an effect. `changePermission` covers the common cases on every system.

**Parameters**

  - `path` — the file whose mode to change
  - `mode` — the permission bits, as for `chmod`

**Returns**: `Ok` when the mode was changed, or `ModeFailed`

**Examples**

```kex
FS.File.changeMode("secrets.txt", 0o600)   # => Ok(())
```

### `readLines` (foul)

```kex
readLines(path: FilePath) -> Result<[String], FileError>
```

Reads the file and returns its lines, without their newlines.

Fails as `FS.File.read` does. A trailing newline does not add an empty last line, so the count matches what an editor shows.

It is not called `lines` because a `FilePath` is a `String`, and that name would clash with `String.lines`.

**Parameters**

  - `path` — the file to read

**Returns**: the lines, or why they could not be read

**Examples**

```kex
FS.File.readLines("names.txt")   # => Ok(["ada", "grace"])
FS.File.readLines("nowhere")     # => Error(ReadFailed("nowhere"))
```

_Ignoring blank lines and comments_

```kex
FS.File.readLines("hosts")
  .or([])
  .map(~trim)
  .reject { |line| line.empty? || line.startsWith?("#") }
```

### `feed` (foul)

```kex
feed(path: FilePath) -> Result<Feed<String>, FileError>
```

Returns the file's lines as a lazy `Feed`, or `ReadFailed` when the file cannot be opened.

The file is read one line at a time from a handle that stays open while the feed is in use, so only the current line is held in memory. Use it for files too large for `readLines`.

Reading from a feed consumes it: taking twice gives the next lines, not the same ones again. Call `toStream` on it when a small file needs to be read more than once. The feed ends at the last line, so taking more lines than the file has returns the lines there are.

```kex
FS.File.feed("two-lines.txt").map { |lines| lines.take(5) }.or([])
# => ["one", "two"]
```

**Parameters**

  - `path` — the file to read

**Returns**: the lines as a feed, or `ReadFailed`

**Examples**

_Peeking at the head of a large file_

```kex
match FS.File.feed("huge.log") do
  Ok(lines) => lines.take(10).each { |line| IO.printLine(line) }
  Error(_)  => IO.printError("cannot read huge.log")
end
```

_The first ten errors in a long log, in one pass_

```kex
FS.File.feed("app.log")
  .map { |lines| lines.filter { |line| line.contains?("ERROR") }.take(10) }
  .or([])
```

### `size` (foul)

```kex
size(path: FilePath) -> Result<Integer, FileError>
```

Returns the file's size in bytes, or `ReadFailed` when it cannot be read.

A file of non-ASCII text has more bytes than characters.

**Parameters**

  - `path` — the file to measure

**Returns**: the size in bytes, or `ReadFailed`

**Examples**

```kex
FS.File.size("hello.txt")   # => Ok(6)
FS.File.size("nowhere")     # => Error(ReadFailed("nowhere"))
```

_Skipping files that are too large_

```kex
paths.filter { |p| FS.File.size(p).or(0) < 1048576 }
```

### `absolute` (foul)

```kex
absolute(path: FilePath) -> Result<String, FileError>
```

Returns `path` made absolute against the current directory, or `ReadFailed` when it cannot be resolved.

It lives here and not in `FS.Path` because it depends on the current directory. Use `canonical` to also resolve `..` and symlinks.

**Parameters**

  - `path` — the path to resolve

**Returns**: the absolute path, or `ReadFailed`

**Examples**

```kex
FS.File.absolute("src/main.kex")   # => Ok("/home/ada/proj/src/main.kex")
```

_Reporting a file unambiguously_

```kex
IO.printError("failed: ${FS.File.absolute(path).or(path)}")
```

### `canonical` (foul)

```kex
canonical(path: FilePath) -> Result<String, FileError>
```

Returns the canonical form of `path`: absolute, with every `.`, `..` and symlink resolved, like `realpath(3)`.

It reads the filesystem, so a path that does not exist or a symlink loop is a `ReadFailed` error. To keep reads and writes inside a directory, check that the canonical path starts with the directory's canonical path; neither `../` nor a symlink can get around that.

**Parameters**

  - `path` — the path to resolve

**Returns**: the canonical path, or `ReadFailed`

**Examples**

```kex
FS.File.canonical("/tmp/../etc")   # => Ok("/etc") on Linux
```

### `symlink?` (foul)

```kex
symlink?(path: FilePath) -> Bool
```

Returns whether `path` is itself a symlink. A link to nothing still counts.

**Parameters**

  - `path` — the path to inspect

**Returns**: `true` for a symlink

**Examples**

```kex
FS.File.symlink?("current")   # => true
```

### `info` (foul)

```kex
info(path: FilePath) -> Result<FileInfo, FileError>
```

Returns the kind, size and modification time of `path` in one call.

It covers what `file?`, `directory?`, `symlink?` and `size` would ask one by one, which suits walking a tree or checking it for changes. A symlink is described as itself, not followed.

**Parameters**

  - `path` — the path to inspect

**Returns**: what the path names, or `ReadFailed` when it cannot be read

**Examples**

```kex
FS.File.info("hello.txt").try.size   # => 6
FS.File.info("src").try.kind         # => :directory
FS.File.info("nowhere")              # => Error(ReadFailed("nowhere"))
```

_Noticing that a file changed_

```kex
let before = FS.File.info(path).try
...
let changed = FS.File.info(path).try != before
```

## module `FS.Path`

Path arithmetic: joining, splitting, normalising and comparing paths.

These functions only look at the text of the path, never the filesystem, so the result is the same whether or not the path exists, and they can be called from code that is not `foul`. Only the POSIX separator `/` is understood.

```kex
FS.Path.join("src", "main.kex")            # => "src/main.kex"
FS.Path.extension("src/main.kex")          # => ".kex"
FS.Path.withExtension("src/main.kex", "beam")   # => "src/main.beam"
```

### `separator` (constant)

```kex
separator : String
```

The path separator, `"/"`.

**Examples**

```kex
FS.Path.separator   # => "/"
```



### `join`

```kex
join(a: FilePath, b: FilePath) -> String
join(a: FilePath, b: FilePath, c: FilePath) -> String
```

Joins two path parts with a single separator and normalises the result.

Repeated separators collapse, so `join("a/", "/b")` is `"a/b"`. An absolute second part does not start the path over, as it would with Ruby's `Pathname#join`.

**Parameters**

  - `a` — the first part
  - `b` — the second part

**Returns**: the joined, normalised path

**Examples**

```kex
FS.Path.join("src", "main.kex")   # => "src/main.kex"
FS.Path.join("a/", "/b")          # => "a/b"
FS.Path.join("a/b", "../c")       # => "a/c"
```

_Building a path under a base directory_

```kex
FS.Path.join(outputDir, FS.Path.basename(source))
```

### `joinAll`

```kex
joinAll(parts: [FilePath]) -> String
```

Joins any number of path parts, skipping empty ones, and normalises the result.

An empty list gives `"."`.

**Parameters**

  - `parts` — the parts to join

**Returns**: the joined, normalised path

**Examples**

```kex
FS.Path.joinAll(["a", "b", "c.txt"])   # => "a/b/c.txt"
FS.Path.joinAll(["a", "", "b"])        # => "a/b"
FS.Path.joinAll([])                    # => "."
```

_Rebuilding a path from its segments_

```kex
FS.Path.joinAll(FS.Path.segments(path).drop(1))
```

### `normalize`

```kex
normalize(path: FilePath) -> String
```

Resolves `.` and `..` in a path, lexically.

It does not look at the disk or follow symlinks. A leading `..` is kept in a relative path and dropped in an absolute one, since `/` has no parent.

**Parameters**

  - `path` — the path to normalise

**Returns**: the normalised path

**Examples**

```kex
FS.Path.normalize("a/./b/../c")   # => "a/c"
FS.Path.normalize("../a")         # => "../a"
FS.Path.normalize("/a/../../b")   # => "/b"
```

_Comparing two paths for equality_

```kex
FS.Path.normalize(a) == FS.Path.normalize(b)
```

### `segments`

```kex
segments(path: FilePath) -> [String]
```

Returns the non-empty parts of the normalised path. The root `/` and the current directory `.` have none.

**Parameters**

  - `path` — the path to split

**Returns**: the segments, outermost first

**Examples**

```kex
FS.Path.segments("/a/b/c")   # => ["a", "b", "c"]
FS.Path.segments("a/./b")    # => ["a", "b"]
FS.Path.segments("/")        # => []
```

_How deep a path is_

```kex
FS.Path.segments(path).count
```

### `absolute?`

```kex
absolute?(path: FilePath) -> Bool
```

Returns whether the path starts at the root.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for an absolute path

**Examples**

```kex
FS.Path.absolute?("/etc/hosts")   # => true
FS.Path.absolute?("src/main")     # => false
```

### `relative?`

```kex
relative?(path: FilePath) -> Bool
```

Returns whether the path does not start at the root, the opposite of `absolute?`.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a relative path

**Examples**

```kex
FS.Path.relative?("src/main")     # => true
FS.Path.relative?("/etc/hosts")   # => false
```

### `dirname`

```kex
dirname(path: FilePath) -> String
```

Returns the path's parent directory.

A child of the root has `"/"` as its parent, and a bare name has `"."`. Like POSIX `dirname`, it does not resolve `..`: `dirname("a/b/..")` is `"a/b"`. Call `normalize` first to resolve it.

**Parameters**

  - `path` — the path to take the parent of

**Returns**: the parent directory

**Examples**

```kex
FS.Path.dirname("/a/b/c.txt")   # => "/a/b"
FS.Path.dirname("/c.txt")       # => "/"
FS.Path.dirname("c.txt")        # => "."
```

_Making sure a file's directory exists before writing_

```kex
FS.Directory.create(FS.Path.dirname(target))
```

### `basename`

```kex
basename(path: FilePath) -> String
```

Returns the last segment of the path, the file or directory name.

The root gives `"/"` and an empty path `""`. Like `dirname`, it does not resolve `..`: `basename("a/b/..")` is `".."`.

**Parameters**

  - `path` — the path to take the name of

**Returns**: the last segment

**Examples**

```kex
FS.Path.basename("/a/b/c.txt")   # => "c.txt"
FS.Path.basename("/a/b")         # => "b"
FS.Path.basename("/")            # => "/"
```

_Listing names rather than paths_

```kex
paths.map { |p| FS.Path.basename(p) }
```

### `extension`

```kex
extension(path: FilePath) -> String
```

Returns the file extension, including its leading dot, or `""` when there is none.

Only the last extension counts, so `"a.tar.gz"` has `".gz"`. A leading dot belongs to the name, so `".gitignore"` has no extension.

**Parameters**

  - `path` — the path to inspect

**Returns**: the extension, or `""`

**Examples**

```kex
FS.Path.extension("src/main.kex")   # => ".kex"
FS.Path.extension("a/b.tar.gz")     # => ".gz"
FS.Path.extension("README")         # => ""
FS.Path.extension(".gitignore")     # => ""
```

_Selecting sources by extension_

```kex
files.filter { |f| FS.Path.extension(f) == ".kex" }
```

### `stem`

```kex
stem(path: FilePath) -> String
```

Returns the basename with its extension removed.

`".gitignore"` stays as it is, since it has no extension.

**Parameters**

  - `path` — the path to inspect

**Returns**: the name without its extension

**Examples**

```kex
FS.Path.stem("src/main.kex")   # => "main"
FS.Path.stem("a/b.tar.gz")     # => "b.tar"
FS.Path.stem(".gitignore")     # => ".gitignore"
```

_Deriving a module name from a filename_

```kex
FS.Path.stem(source).capitalize
```

### `withExtension`

```kex
withExtension(path: FilePath, wanted: String) -> String
```

Returns the path with its extension replaced by `wanted`.

`wanted` may be written with or without its leading dot, and an empty one removes the extension. A path with no file name, such as `"."` or `"/"`, comes back unchanged.

**Parameters**

  - `path` — the path to rewrite
  - `wanted` — the new extension, with or without its dot

**Returns**: the rewritten path

**Examples**

```kex
FS.Path.withExtension("src/main.kex", "beam")    # => "src/main.beam"
FS.Path.withExtension("src/main.kex", ".beam")   # => "src/main.beam"
FS.Path.withExtension("src/main.kex", "")        # => "src/main"
```

_Deriving an output path from a source path_

```kex
FS.Path.withExtension(FS.Path.join(outDir, FS.Path.basename(src)), "o")
```

### `relativeTo`

```kex
relativeTo(path: FilePath, base: FilePath) -> String
```

Returns `path` relative to `base`, going up with `..` as needed.

It works on the text alone, so both must be absolute or both relative; otherwise `path` comes back normalised but otherwise unchanged. A path equal to `base` gives `"."`.

**Parameters**

  - `path` — the path to re-express
  - `base` — the directory to express it against

**Returns**: the relative path

**Examples**

```kex
FS.Path.relativeTo("/a/b/c.txt", "/a/d")   # => "../b/c.txt"
FS.Path.relativeTo("/a/b/c.txt", "/a")     # => "b/c.txt"
FS.Path.relativeTo("/a/b", "/a/b")         # => "."
```

_Printing project-relative paths in a report_

```kex
matches.each { |p| IO.printLine(FS.Path.relativeTo(p, projectRoot)) }
```

## module `FS.Directory`

Creating, listing and removing directories.

Everything here uses the real filesystem, so only `foul` code can call it. Unlike `FS.File`, it is not a capability and cannot be swapped out in a test.

### `exists?` (foul)

```kex
exists?(path: FilePath) -> Bool
```

Returns whether a directory exists at `path`. A file there gives `false`; use `FS.File.exists?` to ask about anything at all.

**Parameters**

  - `path` — the path to test

**Returns**: `true` when `path` is a directory

**Examples**

```kex
FS.Directory.exists?("src")         # => true
FS.Directory.exists?("README.md")   # => false
```

### `directory?` (foul)

```kex
directory?(path: FilePath) -> Bool
```

Returns whether `path` exists and is a directory.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a directory

**Examples**

```kex
FS.Directory.directory?("src")        # => true
FS.Directory.directory?("README.md")  # => false
```

### `file?` (foul)

```kex
file?(path: FilePath) -> Bool
```

Returns whether `path` exists and is a regular file.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a regular file

**Examples**

```kex
FS.Directory.file?("README.md")   # => true
```

### `create` (foul)

```kex
create(path: FilePath) -> Result<Void, FileError>
```

Creates the directory at `path` and any missing parents, as `mkdir -p` does. A directory that already exists is `Ok`.

**Parameters**

  - `path` — the directory to create

**Returns**: `Ok` when the directory is there, or `CreateFailed`

**Examples**

```kex
FS.Directory.create("build")   # => Ok(())
```

_Making sure an output directory is there_

```kex
FS.Directory.create(outDir).try
```

### `delete` (foul)

```kex
delete(path: FilePath) -> Result<Void, FileError>
```

Removes the directory at `path`, which must be empty.

A file or symlink at `path` is left alone and gives `DeleteFailed`, as does a directory that is not empty.

Use `deleteAll` to remove a directory together with its contents.

**Parameters**

  - `path` — the directory to remove

**Returns**: `Ok` when the directory was removed, or `DeleteFailed`

**Examples**

```kex
FS.Directory.delete("empty")   # => Ok(())
```

### `deleteAll` (foul)

```kex
deleteAll(path: FilePath) -> Result<Void, FileError>
```

Removes the directory at `path` and everything in it.

A path that is not a directory, such as a file or a symlink, is left alone and gives `DeleteFailed`. The deletion cannot be undone, so check the path first, especially one that was computed or came from a user.

**Parameters**

  - `path` — the directory tree to remove

**Returns**: `Ok` when the tree was removed, or `DeleteFailed`

**Examples**

```kex
FS.Directory.deleteAll("build")   # => Ok(())
```

_Rebuilding a scratch directory from clean_

```kex
FS.Directory.deleteAll(tmpDir)
FS.Directory.create(tmpDir)
```

### `list` (foul)

```kex
list(path: FilePath) -> Result<[String], FileError>
```

Returns the names of the files and directories directly inside `path`.

They are bare names, not paths, sorted; join each with `path` to open it. Returns `ReadFailed` when the directory cannot be read.

**Parameters**

  - `path` — the directory to list

**Returns**: the entry names, or `ReadFailed`

**Examples**

```kex
FS.Directory.list("src")   # => Ok(["lexer", "main.kex"])
```

_Turning names into usable paths_

```kex
FS.Directory.list(dir).or([]).map { |name| FS.Path.join(dir, name) }
```

### `files` (foul)

```kex
files(path: FilePath) -> Result<[String], FileError>
```

Returns the names of the regular files directly inside `path`.

**Parameters**

  - `path` — the directory to list

**Returns**: the file names, or `ReadFailed`

**Examples**

```kex
FS.Directory.files("src")   # => Ok(["main.kex"])
```

_Every Kex source in a directory_

```kex
FS.Directory.files(dir)
  .or([])
  .filter { |f| FS.Path.extension(f) == ".kex" }
```

### `directories` (foul)

```kex
directories(path: FilePath) -> Result<[String], FileError>
```

Returns the names of the directories directly inside `path`.

**Parameters**

  - `path` — the directory to list

**Returns**: the directory names, or `ReadFailed`

**Examples**

```kex
FS.Directory.directories("src")   # => Ok(["lexer", "parser"])
```

_Walking one level down_

```kex
FS.Directory.directories(root).or([]).each do |name|
  IO.printLine(FS.Path.join(root, name))
end
```

### `current` (foul)

```kex
current -> String
```

Returns the current working directory as an absolute path.

**Returns**: the current directory

**Examples**

```kex
FS.Directory.current   # => "/home/ada/project"
```

_Resolving a relative path by hand_

```kex
FS.Path.join(FS.Directory.current, "build")
```

### `home` (foul)

```kex
home -> String?
```

Returns the current user's home directory, or `None` when it cannot be determined.

**Returns**: the home directory, or `None`

**Examples**

```kex
FS.Directory.home   # => Just("/home/ada")
```

_A per-user config path_

```kex
FS.Path.join(FS.Directory.home.or("."), ".apprc")
```

### `temporary` (foul)

```kex
temporary -> String
```

Returns the directory this system puts temporary files in.

It is `TMPDIR`, `TEMP` or `TMP` from the environment, the first one set, and `/tmp` when none is. The path never ends in a separator.

Other processes share the directory, so pick names that will not collide, or use `createTemporary`, and delete what you create.

**Returns**: the temporary directory

**Examples**

```kex
FS.Directory.temporary   # => "/tmp"
```

_A scratch file that cleans up after itself_

```kex
let scratch = FS.Path.join(FS.Directory.temporary, "report.bin")
FS.File.writeBytes(scratch, payload)
FS.File.delete(scratch)
```

### `createTemporary` (foul)

```kex
createTemporary(prefix: String) -> Result<FilePath, FileError>
```

Creates a fresh, empty directory under `temporary` and returns its path.

The name is `prefix`, a dash and a random suffix, so callers using the same prefix each get their own directory. Nothing removes it for you; call `deleteAll` when you are done.

**Parameters**

  - `prefix` — the start of the directory name, to say whose it is

**Returns**: the new directory, or `CreateFailed`

**Examples**

```kex
FS.Directory.createTemporary("report")   # => Ok("/tmp/report-9f2c41d07ab35e68")
```

_A scratch directory that cleans up after itself_

```kex
let scratch = FS.Directory.createTemporary("build").try
FS.File.write(FS.Path.join(scratch, "out.txt"), text)
FS.Directory.deleteAll(scratch)
```
