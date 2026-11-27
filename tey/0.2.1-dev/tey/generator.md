---
package: tey
version: "0.2.1-dev"
source: tey/generator.kex
title: Tey.Generator
entities:
  - { kind: module, name: "Tey.Generator" }
---

# Tey.Generator

## module `Tey.Generator`

### `decode`

```kex
decode(text: String) -> Result<[Operation], String>
```

Decodes the operations a generator plugin printed to stdout, in version 1 of the generator protocol (JSON). The output is only read as data, never run as Kex code.

### `apply` (foul)

```kex
apply(operations: [Operation], workspaceRoot: String, force?: Bool) -> Result<Void, String>
```

Carries out `operations` in order under `workspaceRoot`, printing each one. Overwriting or deleting an existing file asks for confirmation unless `force?` is true. Stops at the first operation that fails.

### `safePath` (foul)

```kex
safePath(workspaceRoot: String, path: String) -> Result<String, String>
```

Returns the full path for a generator's relative `path`, or an error when the path is absolute, contains `..`, or leads out of the workspace through a symlink.

## type `Operation`

A change a generator plugin asks for: write a file with the given content, or delete a file. Paths are relative to the workspace.

**Variants**

  - `WriteFile(String, String)`
  - `DeleteFile(String)`


