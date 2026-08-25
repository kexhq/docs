---
package: prelude
version: "0.3.0"
source: filehandle.kex
title: FileHandle
entities:
  - { kind: type, name: "FileHandle" }
  - { kind: make, name: "FileHandle<CanRead, W>" }
  - { kind: make, name: "FileHandle<R, CanWrite>" }
  - { kind: make, name: "FileHandle<R, W>" }
---

# FileHandle

## type `FileHandle<R, W>`



## make `FileHandle<CanRead, W>`



## make `FileHandle<R, CanWrite>`


#### `printLine`

```kex
printLine(content) : String -> Bool
```

#### `print`

```kex
print(content) : String -> Bool
```

#### `writeLine`

```kex
writeLine(content) : String -> Bool
```

#### `write`

```kex
write(content) : String -> Bool
```

## make `FileHandle<R, W>`


