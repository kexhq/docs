---
id: "guide-0-4-0-beta-4-io"
title: "Files and structured data"
description: "Read files safely and keep parsing separate from effects."
path: "/guide/0.4.0-beta.4/io/"
draft: false
template: "page"
---
Keep acquisition and interpretation separate: a foul function obtains text or bytes, and pure functions validate and transform them. This gives tests a small input boundary and makes failures easier to locate.

## Reading files

```kex
foul countLines(path: String) -> Integer do
  FS.File.read(path).try.lines.count
end

foul runIo1() do
  with FS.File = Mock.Files { files: { "notes.txt": "first\nsecond" } } do
    assert(countLines("notes.txt") == 2)
  end
end
runIo1()
```

`FS.File.read` returns a result. Here `.try` propagates a failed read; an application should handle it at a suitable boundary, as the [walkthrough](../walkthrough/) does. A failed read is not equivalent to an empty file.

## Resource lifetimes and file modes

The following helper opens a file for the duration of its block. It is defined here without opening any real file:

```kex
foul firstLine(path: String) do
  FS.File.open(path, FS.Read) do |file|
    file.read().try.lines.first
  end
end
```

The block form manages closure after the block. The outer result represents opening and executing the operation; the block's value is its successful payload. With a manually opened handle, make closure part of every exit path, including failures.

File modes affect the handle's available operations. `FS.Read` is readable, `FS.Write` is writable and truncates, `FS.Append` is writable and preserves existing content, and `FS.ReadWrite` exposes both. The checker rejects writing through a read-only handle.

A helper that only needs output can accept `Writable`, allowing it to work with a file or `IO.out`. Standard streams and file handles share these contracts.

## Environment

```kex
foul runIo2() do
  with ENV = Mock.Env { vars: { "GUIDE_MODE": "test" } } do
    assert(ENV.get("GUIDE_MODE", "development") == "test")
    assert(ENV.get("GUIDE_MISSING", "fallback") == "fallback")
  end
end
runIo2()
```

Environment values are strings. Parse and validate them before passing them to the rest of the application. A default should express an intended configuration, not conceal malformed input.

## JSON

```kex
using JSON
let document = JSON.parse("{\"name\":\"Kex\",\"active\":true}")
assert(document.ok?)
let encoded = JSON.stringify(document.try)
assert(JSON.parse(encoded).ok?)
assert(JSON.parse("{broken").error?)
```

Parsing establishes that input is JSON, not that it satisfies your application's schema. Validate expected fields, alternatives, and ranges before constructing domain records. `JSON.stringify` serializes JSON values; use the JSON reference for constructors, accessors, and parser options.

For untrusted input, also establish a size limit before reading an entire document. A correct parser does not prevent an application from allocating too much memory for an unbounded input.
