---
package: prelude
version: "0.4.0-alpha"
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

### Methods

#### `close`

```kex
close : Void
```

### On `FileHandle<CanRead, W>`

#### `getLine`

```kex
getLine : String?
```

Compatibility names matching IO-style handle operations.

#### `get`

```kex
get : String?
```

#### `readLine`

```kex
readLine : String?
```

#### `read`

```kex
read : String?
```

#### `eof?`

```kex
eof? : Bool
```

#### `atEnd?`

```kex
atEnd? : Bool
```

#### `feed`

```kex
feed : Stream<String>?
```

### On `FileHandle<R, CanWrite>`

#### `printLine`

```kex
printLine(content: String) -> Bool
```

#### `print`

```kex
print(content: String) -> Bool
```

#### `writeLine`

```kex
writeLine(content: String) -> Bool
```

#### `write`

```kex
write(content: String) -> Bool
```
