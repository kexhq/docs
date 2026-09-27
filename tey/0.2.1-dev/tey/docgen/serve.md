---
package: tey
version: "0.2.1-dev"
source: tey/docgen/serve.kex
title: Tey.Docgen.Serve
entities:
  - { kind: module, name: "Tey.Docgen.Serve" }
---

# Tey.Docgen.Serve

Serves a generated output directory over HTTP. Tey runs on the BEAM, so Net.HTTP.Server is available wherever `tey docs -- serve` runs.

## module `Tey.Docgen.Serve`

### `serveCommand`

```kex
serveCommand(parsed: OptionParser.ParsedOptions) -> Integer
```

### `routesFor`

```kex
routesFor(prefix: String, name: String) -> [String]
```

The URL paths a browser would type for this file: an index.html is reached by its directory ("/", "/prelude/0.4.0-alpha/") as much as by its name, and the router matches exactly — so it answers the bare, the slash-terminated, and the named spelling. Every other file answers its own path only.

### `collectServeFiles`

```kex
collectServeFiles(dir: String, prefix: String) -> [ServedFile]
```

### `serveFile`

```kex
serveFile(filePath: String, _request: Request<Binary>, _context: Context) -> Response<Binary>
```

A route handler once `filePath` is applied: `~serveFile(path)`. Reads the file as bytes, not text: the site ships images and fonts beside its HTML, and decoding those as UTF-8 would turn them into a 404.

### `contentTypeFor`

```kex
contentTypeFor(path: String) -> String
```

## record `ServedFile`

**Fields**

  - `route` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `path` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)


