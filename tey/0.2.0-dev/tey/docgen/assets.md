---
package: tey
version: "0.2.0-dev"
source: tey/docgen/assets.kex
title: Tey.Docgen.Assets
entities:
  - { kind: module, name: "Tey.Docgen.Assets" }
---

# Tey.Docgen.Assets

## module `Tey.Docgen.Assets`

Browser-side assets for the docs site: the version switcher and search. Both are progressive enhancements over static HTML — without JavaScript the badge stays a badge and search is absent. Each page carries its package and version in data- attributes, so the script fetches the right index without being regenerated per version.

## function `siteJs`


```kex
siteJs()
```

