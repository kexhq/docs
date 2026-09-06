---
package: tey
version: "0.2.0-dev"
source: tey/docgen/css.kex
title: Tey.Docgen.Css
entities:
  - { kind: module, name: "Tey.Docgen.Css" }
---

# Tey.Docgen.Css

## module `Tey.Docgen.Css`

The docs site stylesheet, ported by hand from kex-run-site's design tokens (src/styles/global.css): the warm honey/cream palette from the kex logo, Plus Jakarta Sans / Fraunces / JetBrains Mono, dark warm code surface with tok-* syntax classes. Plain CSS with custom properties — no Tailwind build, so the output stays host-anywhere static files.

Embedded as a raw backtick literal so the build stays self-contained: Tey.Docgen.Index writes this to <out>/assets/style.css.

## function `siteCss`


```kex
siteCss()
```

