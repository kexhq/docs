---
package: tey
version: "0.2.1-dev"
source: tey/docgen/assets.kex
title: Tey.Docgen.Assets
entities:
  - { kind: module, name: "Tey.Docgen.Assets" }
---

# Tey.Docgen.Assets

The docs site's script, which adds the version switcher and search.

Pages work without it: the version badge stays a plain badge and there is no search box. Each page names its package and version in `data-` attributes, so one script serves every version.

The script is assets/site.js, embedded at compile time.

## module `Tey.Docgen.Assets`

### `siteJs`

```kex
siteJs -> String
```
