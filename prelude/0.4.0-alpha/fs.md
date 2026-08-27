---
package: prelude
version: "0.4.0-alpha"
source: fs.kex
title: FS
entities:
  - { kind: module, name: "FS" }
---

# FS

## module `FS`

The filesystem: reading and writing files, walking directories, and manipulating paths.

`FS` is not in the prelude — start with `using FS`.

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

## function `open`

Opens `path` and returns a `FileHandle` for it.

The mode decides the handle's type, and the type decides what you may do with it: a handle opened `Read` has no `write`, a handle opened `Write` has no `read`. That is checked at compile time, not at run time.

Use the whole-file `read` and `write` below when a file fits in memory and you have no reason to hold it open; reach for a handle when you want to stream through a large file or make many small writes.

Close the handle when you are done with it.


```kex
open(path, mode) : FilePath -> Read -> Result<FileHandle<CanRead, CannotWrite>, FileError>
open(path, mode) : FilePath -> Write -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path, mode) : FilePath -> Append -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path, mode) : FilePath -> ReadWrite -> Result<FileHandle<CanRead, CanWrite>, FileError>
open(path, mode) : FilePath -> Read -> (FileHandle<CanRead, CannotWrite> -> A) -> Result<A, FileError>
open(path, mode) : FilePath -> Write -> (FileHandle<CannotRead, CanWrite> -> A) -> Result<A, FileError>
open(path, mode) : FilePath -> Append -> (FileHandle<CannotRead, CanWrite> -> A) -> Result<A, FileError>
open(path, mode) : FilePath -> ReadWrite -> (FileHandle<CanRead, CanWrite> -> A) -> Result<A, FileError>
```


## function `read`

Reads the whole file and decodes it as UTF-8 text.

Answers `Error(ReadFailed(path))` when the file does not exist or cannot be read, and `Error(InvalidUtf8(path, offset))` when the bytes are not valid UTF-8 — so a missing or non-text file is something you handle rather than something that stops the program. Reach for `FS.File.readBytes` when the contents are not text.


```kex
read(path) : FilePath -> Result<String, FileError>
```


## function `readBytes`

Reads the whole file as raw bytes, without decoding it as text.

The byte counterpart of `FS.File.read`: it never validates UTF-8, so it round trips images, archives, and any other non-text payload losslessly. Answers `Error(ReadFailed(path))` when the file cannot be read.


```kex
readBytes(path) : FilePath -> Result<Binary, FileError>
```


## function `writeBytes`

Writes `content` to `path` as raw bytes, replacing whatever was there.

The byte counterpart of `FS.File.write`: the payload lands on disk exactly as given, with no encoding step. Answers `false` when the write fails.


```kex
writeBytes(path, content) : FilePath -> Binary -> Bool
```


## function `write`

Writes `content` to `path`, replacing whatever was there.

Creates the file if it does not exist. The containing directory must already exist — see `FS.Directory.create`. Answers `false` when the write fails.


```kex
write(path, content) : FilePath -> String -> Bool
```


## function `append`

Adds `content` to the end of `path`, keeping what is already there.

Creates the file if it does not exist, so it is safe to append to a log that has not been started yet.


```kex
append(path, content) : FilePath -> String -> Bool
```


## function `exists?`

Returns `true` when something exists at `path` — a file, a directory, or anything else. Use `file?` or `directory?` when the kind matters.


```kex
exists?(path) : FilePath -> Bool
```


## function `file?`

Returns `true` when `path` exists and is a regular file — not a directory.


```kex
file?(path) : FilePath -> Bool
```


## function `directory?`

Returns `true` when `path` exists and is a directory.


```kex
directory?(path) : FilePath -> Bool
```


## function `delete`

Deletes the file at `path`.

Answers `false` when the file does not exist or cannot be removed. Use `FS.Directory.delete` for a directory.


```kex
delete(path) : FilePath -> Bool
```


## function `copy`

Copies the file at `src` to `dst`, replacing `dst` if it exists.


```kex
copy(src, dst) : FilePath -> FilePath -> Bool
```


## function `rename`

Renames — or moves — the file at `src` to `dst`.


```kex
rename(src, dst) : FilePath -> FilePath -> Bool
```


## function `readLines`

Reads the file and returns its lines, without their newlines.

Answers `None` when the file cannot be read. A trailing newline does not produce a final empty line, so the count is the number of lines you would see in an editor.

NOT `lines`: FilePath is an alias for String, so a receiver function named `lines` here is indistinguishable from String's own `lines` at every call site, and merely saying `using FS` made `text.lines` ambiguous. `readLines` also says what it does — it reads the file.


```kex
readLines(path) : FilePath -> [String]?
```


## function `feed`

Returns a lazy `Stream` of the file's lines, or `None` when it cannot be read.

Unlike `readLines`, the file is consumed on demand, so this is the way to look at the first few lines of a very large file — or to process one without holding it all in memory.

The stream ends at the last line, so asking for more lines than the file has answers just the lines there are — unlike `Stream.Sequence`, which is deliberately infinite.

```kex
FS.File.feed("two-lines.txt").map { |lines| lines.take(5) }.or([])
# => ["one", "two"]
```


```kex
feed(path) : FilePath -> Stream<String>?
```


## function `size`

Returns the file's size in bytes, or `None` when it cannot be read.

Bytes, not characters — a file of non-ASCII text has more bytes than it has characters.


```kex
size(path) : FilePath -> Integer?
```


## function `absolute`

Resolves `path` against the process's current directory and returns the absolute form, or `None` when it cannot be resolved.

This is the one path operation that is not in `FS.Path`, because it is not lexical: it asks the process where it is.

Path manipulation lives in FS.Path — `basename`, `dirname`, `extension` and `join` used to be here too, but a name cannot sit in both modules: FilePath IS String, so two same-named receiver functions on it are indistinguishable at every call site. `absolute` stays because it is not lexical — it asks the process where it is.


```kex
absolute(path) : FilePath -> String?
```


## module `FS.Path`

Path arithmetic: joining, splitting, normalising and comparing paths.

Everything here is pure string manipulation with no filesystem access, so the answer is the same whether or not the path exists — which also means these functions can be called from ordinary pure code, unlike `FS.File`. POSIX separators only for now.

```kex
FS.Path.join("src", "main.kex")            # => "src/main.kex"
FS.Path.extension("src/main.kex")          # => ".kex"
FS.Path.withExtension("src/main.kex", "beam")   # => "src/main.beam"
```

## constant `separator`

The path separator, `"/"`.



## function `join`

Joins two path parts with a single separator and normalises the result.

Repeated separators collapse, so `join("a/", "/b")` is `"a/b"` and not `"a//b"`. An absolute second part does NOT restart the path, the way Ruby's `Pathname#join` would — use that part on its own if that is what you mean.


```kex
join(a, b) : FilePath -> FilePath -> String
join(a, b) : FilePath -> FilePath -> FilePath -> String
```


## function `joinAll`

Joins any number of path parts, skipping empty ones, and normalises the result. An empty list gives `"."`.

The list form is `joinAll`, not another `join` overload: a list receiver already has `List.join`, and a second one-argument `join` on the same receiver would be indistinguishable from it.


```kex
joinAll(parts) : [FilePath] -> String
```


## function `normalize`

Resolves `.` and `..` in a path, lexically.

Because it is lexical it never follows a symlink and never touches the disk. A leading `..` in a RELATIVE path is kept — there is no way to know what it escapes to — while one in an absolute path is dropped, since `/` has no parent.


```kex
normalize(path) : FilePath -> String
```


## function `segments`

Returns the non-empty parts of the normalised path. The root `/` and the current directory `.` have none.


```kex
segments(path) : FilePath -> [String]
```


## function `absolute?`

Returns `true` when the path starts at the root.


```kex
absolute?(path) : FilePath -> Bool
```


## function `relative?`

Returns `true` when the path does not start at the root. The opposite of `absolute?`.


```kex
relative?(path) : FilePath -> Bool
```


## function `dirname`

Returns the path's parent directory.

A child of the root has `"/"` as its parent; a bare name has `"."`, the current directory.


```kex
dirname(path) : FilePath -> String
```


## function `basename`

Returns the last segment of the path — the file or directory name.

The root itself answers `"/"`, and an empty path answers `"."`.


```kex
basename(path) : FilePath -> String
```


## function `extension`

Returns the file extension, including its leading dot, or `""` when there is none.

Only the last extension counts, so `"a.tar.gz"` has `".gz"`. A leading dot is part of the NAME rather than an extension, so `".gitignore"` has none.


```kex
extension(path) : FilePath -> String
```


## function `stem`

Returns the basename with its extension removed.

A name that IS its extension — `".gitignore"` — keeps it, because it has none to drop.


```kex
stem(path) : FilePath -> String
```


## function `withExtension`

Returns the path with its extension replaced by `wanted`.

The new extension may be written with or without its leading dot; an empty one removes the extension entirely.


```kex
withExtension(path, wanted) : FilePath -> String -> String
```


## function `relativeTo`

Expresses `path` relative to `base`, walking up with `..` as needed.

Purely lexical, so it answers only when both sides are anchored the same way; a relative path against an absolute base, or the reverse, comes back unchanged. A path that IS the base answers `"."`.


```kex
relativeTo(path, base) : FilePath -> FilePath -> String
```


## module `FS.Directory`

Creating, listing and removing directories.

Like `FS.File`, everything here reaches the real filesystem and so is `foul`. Listings answer with an `Optional`, so a directory that cannot be read is a value you handle rather than an exception.

## function `exists?`

Returns `true` when something exists at `path`.


```kex
exists?(path) : FilePath -> Bool
```


## function `directory?`

Returns `true` when `path` exists and is a directory.


```kex
directory?(path) : FilePath -> Bool
```


## function `file?`

Returns `true` when `path` exists and is a regular file.


```kex
file?(path) : FilePath -> Bool
```


## function `create`

Creates the directory at `path`.


```kex
create(path) : FilePath -> Bool
```


## function `delete`

Removes the directory at `path`, which must be empty.

Use `deleteAll` to remove a directory together with its contents.


```kex
delete(path) : FilePath -> Bool
```


## function `deleteAll`

Removes the directory at `path` and everything inside it, recursively.

This deletes data and cannot be undone — check the path before calling it, particularly when it was computed or came from user input.


```kex
deleteAll(path) : FilePath -> Bool
```


## function `list`

Lists the names in `path` — both files and directories, one level deep.

The results are bare names, not paths; join them with `path` to get something you can open. Answers `None` when the directory cannot be read.


```kex
list(path) : FilePath -> [String]?
```


## function `files`

Lists only the regular files in `path`, one level deep.


```kex
files(path) : FilePath -> [String]?
```


## function `directories`

Lists only the subdirectories of `path`, one level deep.


```kex
directories(path) : FilePath -> [String]?
```


## function `current`

Returns the process's current working directory, as an absolute path.


```kex
current() : String
```


## function `home`

Returns the current user's home directory, or `None` when it cannot be determined.


```kex
home() : String?
```


## function `temporary`

Returns the directory this system puts temporary files in.

Total, unlike `home`: it answers `TMPDIR` when the environment sets one (`TEMP` or `TMP` on Windows) and falls back to `/tmp`, so there is always somewhere to write. The path never ends in a separator, so it composes with `FS.Path.join` directly.

The directory is shared with every other process on the machine, so pick a name unlikely to collide and delete it when you are done.


```kex
temporary() : String
```

