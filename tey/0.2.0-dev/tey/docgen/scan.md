---
package: tey
version: "0.2.0-dev"
source: tey/docgen/scan.kex
title: Tey.Docgen.Scan
entities:
  - { kind: module, name: "Tey.Docgen.Scan" }
---

# Tey.Docgen.Scan

## module `Tey.Docgen.Scan`

Source discovery: walk a package tree, collect .kex files recursively.

`spec/` directories are skipped: specs document the same declarations as their base file, so a second page for them would duplicate every entry.

## function `sourceFiles`


```kex
sourceFiles(sourceDir)
```


## function `subdirectories`


```kex
subdirectories(sourceDir)
```


## function `nested`


```kex
nested(dirs, sourceDir)
```

