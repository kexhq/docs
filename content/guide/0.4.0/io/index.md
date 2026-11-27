---
id: "guide-0-4-0-beta-4-io"
title: "Files and structured data"
description: "Read files safely and keep parsing separate from effects."
path: "/guide/0.4.0/io/"
draft: false
template: "page"
---
Reading a file can fail, so it belongs in a `foul` function. Once you have its contents, pure functions can parse or transform them. The next example counts lines from a file supplied by a test fixture:

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

The fixture supplies two lines, so `countLines("notes.txt")` returns `2`. `FS.File.read` returns a result; `.try` propagates a failed read. An application should handle that failure at a suitable boundary, as the [walkthrough](../walkthrough/) does. A failed read is not an empty file.

## Resource lifetimes and file modes

Opening a file also gives you a resource that must be closed. The block form keeps the handle open only while the block runs:

```kex
foul firstLine(path: String) do
  FS.File.open(path, FS.Read) do |file|
    file.read().try.lines.first
  end
end
```

`firstLine` reads the file and takes the first line. The block form closes the handle afterward, including when the block fails. The outer result reports whether opening and running the block succeeded. If you open a handle manually, make sure every exit path closes it.

File modes affect the handle's available operations. `FS.Read` is readable, `FS.Write` is writable and truncates, `FS.Append` is writable and preserves existing content, and `FS.ReadWrite` exposes both. The checker rejects writing through a read-only handle.

A helper that only needs output can accept `Writable`, allowing it to work with a file or `IO.out`. Standard streams and file handles share these contracts.

## Environment

Environment variables are another outside input. Replace them in a small region when testing:

```kex
foul runIo2() do
  with ENV = Mock.Env { vars: { "GUIDE_MODE": "test" } } do
    assert(ENV.get("GUIDE_MODE", "development") == "test")
    assert(ENV.get("GUIDE_MISSING", "fallback") == "fallback")
  end
end
runIo2()
```

Inside `with`, `ENV.get("GUIDE_MODE", ...)` returns `"test"`, while the missing key uses `"fallback"`. Environment values are strings. Parse and validate a value before passing it into the rest of the application; a default should not hide malformed input.

## JSON

Parsing JSON checks whether text is valid JSON. The next example parses a document, converts it back to text, and rejects broken input:

```kex
using JSON
let document = JSON.parse("{\"name\":\"Kex\",\"active\":true}")
assert(document.ok?)
let encoded = JSON.stringify(document.try)
assert(JSON.parse(encoded).ok?)
assert(JSON.parse("{broken").error?)
```

The first parse succeeds and the parse of `"{broken"` fails. Valid JSON can still contain the wrong fields or values for your program. Validate those before constructing domain records. `JSON.stringify` serializes a JSON value; the JSON reference lists its constructors, accessors, and options.

For untrusted input, also establish a size limit before reading an entire document. A correct parser does not prevent an application from allocating too much memory for an unbounded input.
