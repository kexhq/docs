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



## type `FilePath`

**Variants**

  - `String`



## type `FileModes`

**Variants**

  - `Read`
  - `Write`
  - `Append`
  - `ReadWrite`



## type `ReadPermission`

**Variants**

  - `CanRead`
  - `CannotRead`



## type `WritePermission`

**Variants**

  - `CanWrite`
  - `CannotWrite`



## type `FileError`

**Variants**

  - `OpenFailed(FilePath)`



## module `FS.File`

A capability: every member reaches the real filesystem, so a test can replace the whole thing for a lexical region with `with FS.File = ...` instead of mutating global mock state (kexhq/kex#143). The boundary is here rather than on `FS`, because `FS.Path` below is pure string work with no implementation to substitute.

### `open`

```kex
open(path: FilePath, mode: Read) -> Result<FileHandle<CanRead, CannotWrite>, FileError>
open(path: FilePath, mode: Write) -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path: FilePath, mode: Append) -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path: FilePath, mode: ReadWrite) -> Result<FileHandle<CanRead, CanWrite>, FileError>
```

### `read`

```kex
read(path: FilePath) -> String?
```

### `write`

```kex
write(path: FilePath, content: String) -> Bool
```

### `append`

```kex
append(path: FilePath, content: String) -> Bool
```

### `exists?`

```kex
exists?(path: FilePath) -> Bool
```

### `file?`

```kex
file?(path: FilePath) -> Bool
```

### `directory?`

```kex
directory?(path: FilePath) -> Bool
```

### `delete`

```kex
delete(path: FilePath) -> Bool
```

### `copy`

```kex
copy(src: FilePath, dst: FilePath) -> Bool
```

### `rename`

```kex
rename(src: FilePath, dst: FilePath) -> Bool
```

### `readLines`

```kex
readLines(path: FilePath) -> [String]?
```

NOT `lines`: FilePath is an alias for String, so a receiver function named `lines` here is indistinguishable from String's own `lines` at every call site, and merely saying `using FS` made `text.lines` ambiguous. `readLines` also says what it does — it reads the file.

### `feed`

```kex
feed(path: FilePath) -> Stream<String>?
```

### `size`

```kex
size(path: FilePath) -> Integer?
```

### `absolute`

```kex
absolute(path: FilePath) -> String?
```

Path manipulation lives in FS.Path — `basename`, `dirname`, `extension` and `join` used to be here too, but a name cannot sit in both modules: FilePath IS String, so two same-named receiver functions on it are indistinguishable at every call site. `absolute` stays because it is not lexical — it asks the process where it is.

## module `FS.Path`

Lexical path algebra: pure string manipulation, no filesystem access, so every answer is the same whether or not the path exists. POSIX separators only for now.

### `separator` (constant)

```kex
separator : String
```



### `join`

```kex
join(a: FilePath, b: FilePath) -> String
join(a: FilePath, b: FilePath) -> FilePath -> String
```

Joins parts with a single separator and normalizes the result, the way Node's path.join and Ruby's File.join do. An absolute part does NOT restart the path (that is Pathname#join's behaviour) — use the part on its own if that is what you mean.

### `joinAll`

```kex
joinAll(parts: [FilePath]) -> String
```

The list form is `joinAll`, not another `join` overload: a list receiver already has `List.join`, and a second one-argument `join` on the same receiver would be indistinguishable from it.

### `normalize`

```kex
normalize(path: FilePath) -> String
```

Resolves `.` and `..` lexically. A leading `..` in a RELATIVE path is kept (there is no way to know what it escapes to); one in an absolute path is dropped, since `/` has no parent.

### `segments`

```kex
segments(path: FilePath) -> [String]
```

The non-empty parts of the normalized path. `/` and `.` have none.

### `absolute?`

```kex
absolute?(path: FilePath) -> Bool
```

### `relative?`

```kex
relative?(path: FilePath) -> Bool
```

### `dirname`

```kex
dirname(path: FilePath) -> String
```

The parent of a path: `/` for a root child, `.` for a bare name.

### `basename`

```kex
basename(path: FilePath) -> String
```

The last segment: `/` for the root itself, `.` for an empty path.

### `extension`

```kex
extension(path: FilePath) -> String
```

The dot-prefixed extension, or "" when there is none. A leading dot is part of the NAME, so `.gitignore` has no extension.

### `stem`

```kex
stem(path: FilePath) -> String
```

The basename without its extension. A name that IS its extension — `.gitignore` — keeps it, because it has none to drop.

### `withExtension`

```kex
withExtension(path: FilePath, wanted: String) -> String
```

Same path with a different extension. The new one may be written with or without its dot; an empty one removes the extension.

### `relativeTo`

```kex
relativeTo(path: FilePath, base: FilePath) -> String
```

`path` expressed relative to `base`, walking up with `..` as needed. Purely lexical, so it answers only when both sides are anchored the same way; a relative path against an absolute base (or the reverse) comes back unchanged.

## module `FS.Directory`

### `exists?`

```kex
exists?(path: FilePath) -> Bool
```

### `directory?`

```kex
directory?(path: FilePath) -> Bool
```

### `file?`

```kex
file?(path: FilePath) -> Bool
```

### `create`

```kex
create(path: FilePath) -> Bool
```

### `delete`

```kex
delete(path: FilePath) -> Bool
```

### `deleteAll`

```kex
deleteAll(path: FilePath) -> Bool
```

### `list`

```kex
list(path: FilePath) -> [String]?
```

### `files`

```kex
files(path: FilePath) -> [String]?
```

### `directories`

```kex
directories(path: FilePath) -> [String]?
```

### `current`

```kex
current : String
```

### `home`

```kex
home : String?
```
