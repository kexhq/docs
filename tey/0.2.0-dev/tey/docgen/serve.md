---
package: tey
version: "0.2.0-dev"
source: tey/docgen/serve.kex
title: Tey.Docgen.Serve
entities:
  - { kind: module, name: "Tey.Docgen.Serve" }
---

# Tey.Docgen.Serve

## module `Tey.Docgen.Serve`

Serves a generated output directory over HTTP. Tey runs on the BEAM, so Web.Server is available wherever `tey docs -- serve` runs.

## record `ServedFile`

**Fields**

  - `route` : String
  - `path` : String

## function `serveCommand`


```kex
serveCommand(parsed)
```


## function `routesFor`

The URL paths a browser would type for this file: an index.html is reached by its directory ("/", "/prelude/0.4.0-alpha/") as much as by its name, and the router matches exactly — so it answers the bare, the slash-terminated, and the named spelling. Every other file answers its own path only.


```kex
routesFor(prefix, name)
```


## function `collectServeFiles`


```kex
collectServeFiles(dir, prefix)
```


## function `serveFile`


```kex
serveFile(req, filePath)
```


## function `contentTypeFor`


```kex
contentTypeFor(path)
```


## function `fileHandler`


```kex
fileHandler(filePath)
```

