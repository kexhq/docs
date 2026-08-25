---
package: tey
version: "0.2.0-dev"
source: tey/docgen/json.kex
title: Tey.Docgen.Json
entities:
  - { kind: module, name: "Tey.Docgen.Json" }
---

# Tey.Docgen.Json

## module `Tey.Docgen.Json`

Model records → JSON artifacts. This is the single boundary where typed records become plain maps (atom keys, JSON-ready values) so JSON.stringify can serialise them: model.json (the full model) and search.json (a flat index for dynamic name/kind/type search on the docs site).

## function `modelJson`

── model.json ───────────────────────────────────────────────────────────


```kex
modelJson(model)
```


## function `moduleIndexValue`


```kex
moduleIndexValue(m)
```


## function `linkValue`


```kex
linkValue(l)
```


## function `labelOrPackage`


```kex
labelOrPackage(model)
```


## function `pageValue`


```kex
pageValue(page)
```


## function `entityValue`


```kex
entityValue(e)
```


## function `variantsValue`


```kex
variantsValue(variants)
```


## function `fieldValue`


```kex
fieldValue(f)
```


## function `fieldValues`

A named helper so the lambda's element type comes from the [FieldEntry] parameter, not from the surrounding map literal's value type.


```kex
fieldValues(fields)
```


## function `functionValue`


```kex
functionValue(f)
```


## function `docValue`


```kex
docValue(doc)
```


## function `returnsValue`


```kex
returnsValue(doc)
```


## function `searchJson`

── search.json ──────────────────────────────────────────────────────────


```kex
searchJson(model)
```


## function `searchEntries`


```kex
searchEntries(model)
```


## function `pageSearchEntries`


```kex
pageSearchEntries(page)
```


## function `entitySearchEntries`


```kex
entitySearchEntries(e, page)
```


## function `entityTypes`

The type names an entity is "about" — the search-by-type dimension. For a function that is its signature's types; for a record its field types; for a type its parents and variant fields; for a trait/make the types its methods mention; for a module the union of its children.


```kex
entityTypes(e)
```


## function `variantFieldTypes`


```kex
variantFieldTypes(variants)
```


## function `childSearchEntries`


```kex
childSearchEntries(e, page)
```


## function `functionSearchEntry`


```kex
functionSearchEntry(f, page)
```


## function `searchValue`


```kex
searchValue(entry)
```


## function `entitySignatures`


```kex
entitySignatures(e)
```


## function `entitySummary`


```kex
entitySummary(e)
```

