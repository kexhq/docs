---
package: prelude
version: "0.4.0-beta.4-dev"
source: fs.kex
title: FS
entities:
  - { kind: module, name: "FS" }
---

# FS

## module `FS`

The filesystem: reading and writing files, walking directories, and manipulating paths.

`FS` is not in the prelude: start with `using FS`.

```kex
using FS

main do
  match FS.File.read("config.txt") do
    Just(text) => IO.printLine(text.lines.count)
    None       => IO.printError("config.txt is missing")
  end
end
```

It is organised in three parts:

```kex
FS.File        reading, writing, copying and deleting files
FS.Directory   creating, listing and removing directories
FS.Path        pure path arithmetic, with no filesystem access at all
```

The first two are capabilities: everything in them touches the real filesystem, so they can only be called from `foul` code, and a test can replace the whole of `FS.File` for a lexical region rather than mutating global state. `FS.Path` is ordinary pure code.

Most read operations answer with an `Optional` and most write operations with a `Bool`, so a missing file or a failed write is an ordinary value you handle rather than an exception you catch.



## type `FilePath`

A filesystem path. An alias for `String`, so every `String` method applies to one; `FS.Path` adds the path-aware operations.

**Variants**

  - `String`



## type `FileModes`

How a file should be opened: `Read` to read it, `Write` to replace it, `Append` to add to its end, `ReadWrite` for both. The mode chosen decides what type the resulting `FileHandle` has, and therefore which operations the compiler will let you call on it.

**Variants**

  - `Read`
  - `Write`
  - `Append`
  - `ReadWrite`



## type `ReadPermission`

Whether a `FileHandle` may be read from. Part of the handle's type rather than a runtime flag, so reading from a write-only handle is a compile error.

**Variants**

  - `CanRead`
  - `CannotRead`



## type `WritePermission`

Whether a `FileHandle` may be written to. Part of the handle's type, so writing to a read-only handle is a compile error.

**Variants**

  - `CanWrite`
  - `CannotWrite`



## type `FileError`

A file operation that failed, carrying the path it failed on.

`OpenFailed` and `ReadFailed` mean the filesystem refused the operation. `InvalidUtf8` means the bytes were read but are not valid UTF-8, and carries the byte offset of the first malformed sequence.

**Variants**

  - `OpenFailed(FilePath)`
  - `ReadFailed(FilePath)`
  - `InvalidUtf8(FilePath, Integer)`



## module `FS.File`

Reading and writing files.

A capability: every member reaches the real filesystem, so a test can replace the whole thing for a lexical region with `with FS.File = ...` instead of mutating global mock state (kexhq/kex#143). The boundary is here rather than on `FS`, because `FS.Path` below is pure string work with no implementation to substitute.

### `open`

```kex
open(path: FilePath, mode: Read) -> Result<FileHandle<CanRead, CannotWrite>, FileError>
open(path: FilePath, mode: Write) -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path: FilePath, mode: Append) -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path: FilePath, mode: ReadWrite) -> Result<FileHandle<CanRead, CanWrite>, FileError>
open(path: FilePath, mode: Read) -> (FileHandle<CanRead, CannotWrite> -> A) -> Result<A, FileError>
open(path: FilePath, mode: Write) -> (FileHandle<CannotRead, CanWrite> -> A) -> Result<A, FileError>
open(path: FilePath, mode: Append) -> (FileHandle<CannotRead, CanWrite> -> A) -> Result<A, FileError>
open(path: FilePath, mode: ReadWrite) -> (FileHandle<CanRead, CanWrite> -> A) -> Result<A, FileError>
```

Opens `path` and returns a `FileHandle` for it.

The mode decides the handle's type, and the type decides what you may do with it: a handle opened `Read` has no `write`, a handle opened `Write` has no `read`. That is checked at compile time, not at run time.

Use the whole-file `read` and `write` below when a file fits in memory and you have no reason to hold it open; reach for a handle when you want to stream through a large file or make many small writes.

Close the handle when you are done with it.

**Parameters**

  - `path` — the file to open
  - `mode` — `Read`, `Write`, `Append` or `ReadWrite`

**Returns**: the handle, or `OpenFailed`

**Examples**

_Reading a file line by line_

```kex
match FS.File.open("log.txt", Read) do
  Ok(handle) => do
    IO.printLine(handle.readLine.or(""))
    handle.close
  end
  Error(e) => IO.printError("cannot open: ${e}")
end
```

_Writing a report_

```kex
match FS.File.open("report.txt", Write) do
  Ok(handle) => do
    rows.each { |row| handle.printLine(row) }
    handle.close
  end
  Error(_) => IO.printError("cannot write report")
end
```

_A failure names the path_

```kex
FS.File.open("missing/x.txt", Read)   # => Error(OpenFailed("missing/x.txt"))
```

### `read`

```kex
read(path: FilePath) -> Result<String, FileError>
```

Reads the whole file and decodes it as UTF-8 text.

Answers `Error(ReadFailed(path))` when the file does not exist or cannot be read, and `Error(InvalidUtf8(path, offset))` when the bytes are not valid UTF-8, so a missing or non-text file is something you handle rather than something that stops the program. Reach for `FS.File.readBytes` when the contents are not text.

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

### `readBytes`

```kex
readBytes(path: FilePath) -> Result<Binary, FileError>
```

Reads the whole file as raw bytes, without decoding it as text.

The byte counterpart of `FS.File.read`: it never validates UTF-8, so it round trips images, archives, and any other non-text payload losslessly. Answers `Error(ReadFailed(path))` when the file cannot be read.

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

### `writeBytes`

```kex
writeBytes(path: FilePath, content: Binary) -> Bool
```

Writes `content` to `path` as raw bytes, replacing whatever was there.

The byte counterpart of `FS.File.write`: the payload lands on disk exactly as given, with no encoding step. Answers `false` when the write fails.

**Parameters**

  - `path` — the file to write
  - `content` — the bytes to write

**Returns**: `true` when the write succeeded

**Examples**

```kex
FS.File.writeBytes("out.bin", Binary.fromBytes([0, 255]))   # => true
```

_Copying a file without decoding it_

```kex
FS.File.readBytes(source).map { |data| FS.File.writeBytes(target, data) }
```

### `write`

```kex
write(path: FilePath, content: String) -> Bool
```

Writes `content` to `path`, replacing whatever was there.

Creates the file if it does not exist. The containing directory must already exist: see `FS.Directory.create`. Answers `false` when the write fails.

**Parameters**

  - `path` — the file to write
  - `content` — the text to write

**Returns**: `true` when the write succeeded

**Examples**

```kex
FS.File.write("out.txt", "hello\n")   # => true
```

_Reporting a failed write_

```kex
if !FS.File.write(target, rendered)
  IO.printError("could not write ${target}")
end
```

_Writing a list of lines_

```kex
FS.File.write("names.txt", names.join("\n") + "\n")
```

### `append`

```kex
append(path: FilePath, content: String) -> Bool
```

Adds `content` to the end of `path`, keeping what is already there.

Creates the file if it does not exist, so it is safe to append to a log that has not been started yet.

**Parameters**

  - `path` — the file to append to
  - `content` — the text to add

**Returns**: `true` when the write succeeded

**Examples**

```kex
FS.File.append("app.log", "started\n")   # => true
```

_A simple logger_

```kex
foul log(message: String) -> Void do
  FS.File.append("app.log", "${Time.now.to(String).or("")} ${message}\n")
end
```

### `exists?`

```kex
exists?(path: FilePath) -> Bool
```

Returns `true` when something exists at `path`: a file, a directory, or anything else. Use `file?` or `directory?` when the kind matters.

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

### `file?`

```kex
file?(path: FilePath) -> Bool
```

Returns `true` when `path` exists and is a regular file: not a directory.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a regular file

**Examples**

```kex
FS.File.file?("README.md")   # => true
FS.File.file?("src")         # => false
```

### `directory?`

```kex
directory?(path: FilePath) -> Bool
```

Returns `true` when `path` exists and is a directory.

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

### `delete`

```kex
delete(path: FilePath) -> Bool
```

Deletes the file at `path`.

Answers `false` when the file does not exist or cannot be removed. Use `FS.Directory.delete` for a directory.

**Parameters**

  - `path` — the file to delete

**Returns**: `true` when the file was deleted

**Examples**

```kex
FS.File.delete("tmp.txt")   # => true
```

_Cleaning up after a temporary file_

```kex
FS.File.write(tmp, data)
process(tmp)
FS.File.delete(tmp)
```

### `copy`

```kex
copy(src: FilePath, dst: FilePath) -> Bool
```

Copies the file at `src` to `dst`, replacing `dst` if it exists.

**Parameters**

  - `src` — the file to copy
  - `dst` — where to copy it

**Returns**: `true` when the copy succeeded

**Examples**

```kex
FS.File.copy("app.conf", "app.conf.bak")   # => true
```

_Backing a file up before rewriting it_

```kex
FS.File.copy(path, "${path}.bak")
FS.File.write(path, updated)
```

### `rename`

```kex
rename(src: FilePath, dst: FilePath) -> Bool
```

Renames (or moves) the file at `src` to `dst`.

**Parameters**

  - `src` — the current path
  - `dst` — the new path

**Returns**: `true` when the rename succeeded

**Examples**

```kex
FS.File.rename("draft.txt", "final.txt")   # => true
```

_Writing to a temporary file, then swapping it in_

```kex
FS.File.write("${path}.tmp", content)
FS.File.rename("${path}.tmp", path)
```

### `readLines`

```kex
readLines(path: FilePath) -> [String]?
```

Reads the file and returns its lines, without their newlines.

Answers `None` when the file cannot be read. A trailing newline does not produce a final empty line, so the count is the number of lines you would see in an editor.

NOT `lines`: FilePath is an alias for String, so a receiver function named `lines` here is indistinguishable from String's own `lines` at every call site, and merely saying `using FS` made `text.lines` ambiguous. `readLines` also says what it does: it reads the file.

**Parameters**

  - `path` — the file to read

**Returns**: the lines, or `None`

**Examples**

```kex
FS.File.readLines("names.txt")   # => Just(["ada", "grace"])
FS.File.readLines("nowhere")     # => None
```

_Ignoring blank lines and comments_

```kex
FS.File.readLines("hosts")
  .or([])
  .map(~trim)
  .reject { |line| line.empty? || line.startsWith?("#") }
```

### `feed`

```kex
feed(path: FilePath) -> Feed<String>?
```

Returns a lazy `Feed` of the file's lines, or `None` when it cannot be read.

Unlike `readLines`, the file is read a line at a time off a handle held open for the feed's lifetime, so this is the way to walk a file too large to hold in memory: nothing but the current line is retained.

A `Feed` rather than a `Stream` because that is what a file honestly is: reading consumes, and there is no rewinding. Taking twice walks forward rather than answering the same lines again. On a file small enough to replay, `toStream` buys that back.

The feed ends at the last line, so asking for more lines than the file has answers just the lines there are: unlike `Stream.Sequence`, which is deliberately infinite.

```kex
FS.File.feed("two-lines.txt").map { |lines| lines.take(5) }.or([])
# => ["one", "two"]
```

**Parameters**

  - `path` — the file to read

**Returns**: the lines as a feed, or `None`

**Examples**

_Peeking at the head of a large file_

```kex
match FS.File.feed("huge.log") do
  Just(lines) => lines.take(10).each { |line| IO.printLine(line) }
  None        => IO.printError("cannot read huge.log")
end
```

_The first ten errors in a long log, in one pass_

```kex
FS.File.feed("app.log")
  .map { |lines| lines.filter { |line| line.contains?("ERROR") }.take(10) }
  .or([])
```

### `size`

```kex
size(path: FilePath) -> Integer?
```

Returns the file's size in bytes, or `None` when it cannot be read.

Bytes, not characters: a file of non-ASCII text has more bytes than it has characters.

**Parameters**

  - `path` — the file to measure

**Returns**: the size in bytes, or `None`

**Examples**

```kex
FS.File.size("hello.txt")   # => Just(6)
FS.File.size("nowhere")     # => None
```

_Skipping files that are too large_

```kex
paths.filter { |p| FS.File.size(p).or(0) < 1048576 }
```

### `absolute`

```kex
absolute(path: FilePath) -> String?
```

Resolves `path` against the process's current directory and returns the absolute form, or `None` when it cannot be resolved.

This is the one path operation that is not in `FS.Path`, because it is not lexical: it asks the process where it is.

Path manipulation lives in FS.Path: `basename`, `dirname`, `extension` and `join` used to be here too, but a name cannot sit in both modules: FilePath IS String, so two same-named receiver functions on it are indistinguishable at every call site. `absolute` stays because it is not lexical: it asks the process where it is.

**Parameters**

  - `path` — the path to resolve

**Returns**: the absolute path, or `None`

**Examples**

```kex
FS.File.absolute("src/main.kex")   # => Just("/home/ada/proj/src/main.kex")
```

_Reporting a file unambiguously_

```kex
IO.printError("failed: ${FS.File.absolute(path).or(path)}")
```

### `canonical`

```kex
canonical(path: FilePath) -> Result<String, FileError>
```

The canonical form of `path`: absolute, with every `.`, `..` and symlink resolved, like `realpath(3)`.

Unlike `absolute` this reads the filesystem, so a path that does not exist (or a symlink loop) is an error. Use it to keep reads and writes inside a directory: compare the real path's prefix, and neither `../` nor a symlink can escape.

**Parameters**

  - `path` — the path to resolve

**Returns**: the canonical path, or `ReadFailed`

**Examples**

```kex
FS.File.canonical("/tmp/../etc")   # => Ok("/private/etc") on macOS
```

### `symlink?`

```kex
symlink?(path: FilePath) -> Bool
```

Whether `path` is itself a symlink, without following it. A dangling link is still a symlink.

**Parameters**

  - `path` — the path to inspect

**Returns**: `true` for a symlink

**Examples**

```kex
FS.File.symlink?("current")   # => true
```

## module `FS.Path`

Path arithmetic: joining, splitting, normalising and comparing paths.

Everything here is pure string manipulation with no filesystem access, so the answer is the same whether or not the path exists, which also means these functions can be called from ordinary pure code, unlike `FS.File`. POSIX separators only for now.

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
join(a: FilePath, b: FilePath) -> FilePath -> String
```

Joins two path parts with a single separator and normalises the result.

Repeated separators collapse, so `join("a/", "/b")` is `"a/b"` and not `"a//b"`. An absolute second part does NOT restart the path, the way Ruby's `Pathname#join` would: use that part on its own if that is what you mean.

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

Joins any number of path parts, skipping empty ones, and normalises the result. An empty list gives `"."`.

The list form is `joinAll`, not another `join` overload: a list receiver already has `List.join`, and a second one-argument `join` on the same receiver would be indistinguishable from it.

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

Because it is lexical it never follows a symlink and never touches the disk. A leading `..` in a RELATIVE path is kept: there is no way to know what it escapes to, while one in an absolute path is dropped, since `/` has no parent.

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

Returns `true` when the path starts at the root.

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

Returns `true` when the path does not start at the root. The opposite of `absolute?`.

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

A child of the root has `"/"` as its parent; a bare name has `"."`, the current directory.

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

Returns the last segment of the path: the file or directory name.

The root itself answers `"/"`, and an empty path answers `"."`.

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

Only the last extension counts, so `"a.tar.gz"` has `".gz"`. A leading dot is part of the NAME rather than an extension, so `".gitignore"` has none.

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

A name that IS its extension (`".gitignore"`) keeps it, because it has none to drop.

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

The new extension may be written with or without its leading dot; an empty one removes the extension entirely.

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

Expresses `path` relative to `base`, walking up with `..` as needed.

Purely lexical, so it answers only when both sides are anchored the same way; a relative path against an absolute base, or the reverse, comes back unchanged. A path that IS the base answers `"."`.

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

Like `FS.File`, everything here reaches the real filesystem and so is `foul`. Listings answer with an `Optional`, so a directory that cannot be read is a value you handle rather than an exception.

### `exists?`

```kex
exists?(path: FilePath) -> Bool
```

Returns `true` when something exists at `path`.

**Parameters**

  - `path` — the path to test

**Returns**: `true` when the path exists

**Examples**

```kex
FS.Directory.exists?("src")   # => true
```

### `directory?`

```kex
directory?(path: FilePath) -> Bool
```

Returns `true` when `path` exists and is a directory.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a directory

**Examples**

```kex
FS.Directory.directory?("src")        # => true
FS.Directory.directory?("README.md")  # => false
```

### `file?`

```kex
file?(path: FilePath) -> Bool
```

Returns `true` when `path` exists and is a regular file.

**Parameters**

  - `path` — the path to test

**Returns**: `true` for a regular file

**Examples**

```kex
FS.Directory.file?("README.md")   # => true
```

### `create`

```kex
create(path: FilePath) -> Bool
```

Creates the directory at `path`.

**Parameters**

  - `path` — the directory to create

**Returns**: `true` when the directory was created

**Examples**

```kex
FS.Directory.create("build")   # => true
```

_Making sure an output directory is there_

```kex
FS.Directory.create(outDir) if !FS.Directory.exists?(outDir)
```

### `delete`

```kex
delete(path: FilePath) -> Bool
```

Removes the directory at `path`, which must be empty.

Use `deleteAll` to remove a directory together with its contents.

**Parameters**

  - `path` — the directory to remove

**Returns**: `true` when the directory was removed

**Examples**

```kex
FS.Directory.delete("empty")   # => true
```

### `deleteAll`

```kex
deleteAll(path: FilePath) -> Bool
```

Removes the directory at `path` and everything inside it, recursively.

This deletes data and cannot be undone: check the path before calling it, particularly when it was computed or came from user input.

**Parameters**

  - `path` — the directory tree to remove

**Returns**: `true` when the tree was removed

**Examples**

```kex
FS.Directory.deleteAll("build")   # => true
```

_Rebuilding a scratch directory from clean_

```kex
FS.Directory.deleteAll(tmpDir)
FS.Directory.create(tmpDir)
```

### `list`

```kex
list(path: FilePath) -> [String]?
```

Lists the names in `path`: both files and directories, one level deep.

The results are bare names, not paths; join them with `path` to get something you can open. Answers `None` when the directory cannot be read.

**Parameters**

  - `path` — the directory to list

**Returns**: the entry names, or `None`

**Examples**

```kex
FS.Directory.list("src")   # => Just(["main.kex", "lexer"])
```

_Turning names into usable paths_

```kex
FS.Directory.list(dir).or([]).map { |name| FS.Path.join(dir, name) }
```

### `files`

```kex
files(path: FilePath) -> [String]?
```

Lists only the regular files in `path`, one level deep.

**Parameters**

  - `path` — the directory to list

**Returns**: the file names, or `None`

**Examples**

```kex
FS.Directory.files("src")   # => Just(["main.kex"])
```

_Every Kex source in a directory_

```kex
FS.Directory.files(dir)
  .or([])
  .filter { |f| FS.Path.extension(f) == ".kex" }
```

### `directories`

```kex
directories(path: FilePath) -> [String]?
```

Lists only the subdirectories of `path`, one level deep.

**Parameters**

  - `path` — the directory to list

**Returns**: the directory names, or `None`

**Examples**

```kex
FS.Directory.directories("src")   # => Just(["lexer", "parser"])
```

_Walking one level down_

```kex
FS.Directory.directories(root).or([]).each do |name|
  IO.printLine(FS.Path.join(root, name))
end
```

### `current`

```kex
current : String
```

Returns the process's current working directory, as an absolute path.

**Returns**: the current directory

**Examples**

```kex
FS.Directory.current   # => "/home/ada/project"
```

_Resolving a relative path by hand_

```kex
FS.Path.join(FS.Directory.current, "build")
```

### `home`

```kex
home : String?
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

### `temporary`

```kex
temporary : String
```

Returns the directory this system puts temporary files in.

Total, unlike `home`: it answers `TMPDIR` when the environment sets one (`TEMP` or `TMP` on Windows) and falls back to `/tmp`, so there is always somewhere to write. The path never ends in a separator, so it composes with `FS.Path.join` directly.

The directory is shared with every other process on the machine, so pick a name unlikely to collide and delete it when you are done.

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
