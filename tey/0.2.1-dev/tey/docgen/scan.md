---
package: tey
version: "0.2.1-dev"
source: tey/docgen/scan.kex
title: Tey.Docgen.Scan
entities:
  - { kind: module, name: "Tey.Docgen.Scan" }
---

# Tey.Docgen.Scan

Finds the files a docs build reads by walking a source tree.

Paths come back relative to the root, sorted within each directory. `spec/` directories and `.spec.kex` files are skipped: specs cover the same declarations as the file they test, so pages for them would repeat every entry.

## module `Tey.Docgen.Scan`

### `sourceFiles` (foul)

```kex
sourceFiles(sourceDir: String) -> [String]
```

### `proseFiles` (foul)

```kex
proseFiles(sourceDir: String) -> [String]
```

Returns the `.md` files under `sourceDir` that `tey docs prose` reads, found by the same walk as the `.kex` sources.

### `filesWithSuffix` (foul)

```kex
filesWithSuffix(sourceDir: String, suffix: String) -> [String]
```

### `subdirectories` (foul)

```kex
subdirectories(sourceDir: String) -> [String]
```

### `nested` (foul)

```kex
nested(dirs: [String], sourceDir: String, suffix: String) -> [String]
```
