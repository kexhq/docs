---
package: tey
version: "0.2.0-dev"
source: tey/docgen/scan.kex
title: Tey.Docgen.Scan
entities:
  - { kind: module, name: "Tey.Docgen.Scan" }
---

# Tey.Docgen.Scan

Source discovery: walk a tree and collect the files a build reads.

`spec/` directories are skipped: specs document the same declarations as their base file, so a second page for them would duplicate every entry.

## module `Tey.Docgen.Scan`

### `sourceFiles`

```kex
sourceFiles(sourceDir: String) -> [String]
```

### `proseFiles`

```kex
proseFiles(sourceDir: String) -> [String]
```

The prose half of the same walk: `tey docs prose` reads .md rather than .kex, and wants the same recursion, the same sorting and the same skip.

### `filesWithSuffix`

```kex
filesWithSuffix(sourceDir: String, suffix: String) -> [String]
```

### `subdirectories`

```kex
subdirectories(sourceDir: String) -> [String]
```

### `nested`

```kex
nested(dirs: [String], sourceDir: String, suffix: String) -> [String]
```
