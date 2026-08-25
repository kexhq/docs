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

## function `open`


```kex
open(path, mode) : FilePath -> Read -> Result<FileHandle<CanRead, CannotWrite>, FileError>
open(path, mode) : FilePath -> Write -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path, mode) : FilePath -> Append -> Result<FileHandle<CannotRead, CanWrite>, FileError>
open(path, mode) : FilePath -> ReadWrite -> Result<FileHandle<CanRead, CanWrite>, FileError>
```


## function `read`


```kex
read(path) : FilePath -> String?
```


## function `write`


```kex
write(path, content) : FilePath -> String -> Bool
```


## function `append`


```kex
append(path, content) : FilePath -> String -> Bool
```


## function `exists?`


```kex
exists?(path) : FilePath -> Bool
```


## function `file?`


```kex
file?(path) : FilePath -> Bool
```


## function `directory?`


```kex
directory?(path) : FilePath -> Bool
```


## function `delete`


```kex
delete(path) : FilePath -> Bool
```


## function `copy`


```kex
copy(src, dst) : FilePath -> FilePath -> Bool
```


## function `rename`


```kex
rename(src, dst) : FilePath -> FilePath -> Bool
```


## function `readLines`

NOT `lines`: FilePath is an alias for String, so a receiver function named `lines` here is indistinguishable from String's own `lines` at every call site, and merely saying `using FS` made `text.lines` ambiguous. `readLines` also says what it does — it reads the file.


```kex
readLines(path) : FilePath -> [String]?
```


## function `feed`


```kex
feed(path) : FilePath -> Stream<String>?
```


## function `size`


```kex
size(path) : FilePath -> Integer?
```


## function `absolute`

Path manipulation lives in FS.Path — `basename`, `dirname`, `extension` and `join` used to be here too, but a name cannot sit in both modules: FilePath IS String, so two same-named receiver functions on it are indistinguishable at every call site. `absolute` stays because it is not lexical — it asks the process where it is.


```kex
absolute(path) : FilePath -> String?
```


## module `FS.Path`

Lexical path algebra: pure string manipulation, no filesystem access, so every answer is the same whether or not the path exists. POSIX separators only for now.

## constant `separator`



## function `join`

Joins parts with a single separator and normalizes the result, the way Node's path.join and Ruby's File.join do. An absolute part does NOT restart the path (that is Pathname#join's behaviour) — use the part on its own if that is what you mean.


```kex
join(a, b) : FilePath -> FilePath -> String
join(a, b) : FilePath -> FilePath -> FilePath -> String
```


## function `joinAll`

The list form is `joinAll`, not another `join` overload: a list receiver already has `List.join`, and a second one-argument `join` on the same receiver would be indistinguishable from it.


```kex
joinAll(parts) : [FilePath] -> String
```


## function `normalize`

Resolves `.` and `..` lexically. A leading `..` in a RELATIVE path is kept (there is no way to know what it escapes to); one in an absolute path is dropped, since `/` has no parent.


```kex
normalize(path) : FilePath -> String
```


## function `segments`

The non-empty parts of the normalized path. `/` and `.` have none.


```kex
segments(path) : FilePath -> [String]
```


## function `absolute?`


```kex
absolute?(path) : FilePath -> Bool
```


## function `relative?`


```kex
relative?(path) : FilePath -> Bool
```


## function `dirname`

The parent of a path: `/` for a root child, `.` for a bare name.


```kex
dirname(path) : FilePath -> String
```


## function `basename`

The last segment: `/` for the root itself, `.` for an empty path.


```kex
basename(path) : FilePath -> String
```


## function `extension`

The dot-prefixed extension, or "" when there is none. A leading dot is part of the NAME, so `.gitignore` has no extension.


```kex
extension(path) : FilePath -> String
```


## function `stem`

The basename without its extension. A name that IS its extension — `.gitignore` — keeps it, because it has none to drop.


```kex
stem(path) : FilePath -> String
```


## function `withExtension`

Same path with a different extension. The new one may be written with or without its dot; an empty one removes the extension.


```kex
withExtension(path, wanted) : FilePath -> String -> String
```


## function `relativeTo`

`path` expressed relative to `base`, walking up with `..` as needed. Purely lexical, so it answers only when both sides are anchored the same way; a relative path against an absolute base (or the reverse) comes back unchanged.


```kex
relativeTo(path, base) : FilePath -> FilePath -> String
```


## module `FS.Directory`

## function `exists?`


```kex
exists?(path) : FilePath -> Bool
```


## function `directory?`


```kex
directory?(path) : FilePath -> Bool
```


## function `file?`


```kex
file?(path) : FilePath -> Bool
```


## function `create`


```kex
create(path) : FilePath -> Bool
```


## function `delete`


```kex
delete(path) : FilePath -> Bool
```


## function `deleteAll`


```kex
deleteAll(path) : FilePath -> Bool
```


## function `list`


```kex
list(path) : FilePath -> [String]?
```


## function `files`


```kex
files(path) : FilePath -> [String]?
```


## function `directories`


```kex
directories(path) : FilePath -> [String]?
```


## constant `current`



## constant `home`


