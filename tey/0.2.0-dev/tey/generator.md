---
package: tey
version: "0.2.0-dev"
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

Decodes the child-to-host half of the separately versioned protocol. Plugin stdout is data, never Kex source evaluated in Tey's process.

### `apply`

```kex
apply(operations: [Operation], workspaceRoot: String, force?: Bool) -> Result<Void, String>
```

### `safePath`

```kex
safePath(workspaceRoot: String, path: String) -> Result<String, String>
```

## type `Operation`

**Variants**

  - `WriteFile(String, String)`
  - `DeleteFile(String)`


