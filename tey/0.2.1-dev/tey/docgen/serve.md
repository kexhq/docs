---
package: tey
version: "0.2.1-dev"
source: tey/docgen/serve.kex
title: Tey.Docgen.Serve
entities:
  - { kind: module, name: "Tey.Docgen.Serve" }
---

# Tey.Docgen.Serve

`tey docs serve`: serves a generated site from its output directory over HTTP on localhost.

## module `Tey.Docgen.Serve`

### `serveCommand` (foul)

```kex
serveCommand(parsed: ParsedOptions) -> Integer
```

### `routesFor`

```kex
routesFor(prefix: String, name: String) -> [String]
```

Returns the URL paths that serve a file. The router matches paths exactly, so an index.html gets three: its own path, its directory, and its directory with a trailing slash. Any other file gets only its own path.

### `collectServeFiles` (foul)

```kex
collectServeFiles(dir: String, prefix: String) -> [ServedFile]
```

### `serveFile` (foul)

```kex
serveFile(filePath: String, _request: Request<Binary>, _context: Context) -> Response<Binary>
```

Serves the file at `filePath`; `~serveFile(path)` is a route handler. The file is read as bytes, so images and fonts are served intact, and the response says `no-cache` because the site is rebuilt in place.

### `contentTypeFor`

```kex
contentTypeFor(path: String) -> String
```

## record `ServedFile`

**Fields**

  - `route` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `path` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)


