---
package: tey
version: "0.2.0-dev"
source: tey/docgen/json.kex
title: Tey.Docgen.Json
entities:
  - { kind: module, name: "Tey.Docgen.Json" }
---

# Tey.Docgen.Json

Model records → JSON artifacts. This is the single boundary where typed records become plain maps (atom keys, JSON-ready values) so JSON.stringify can serialise them: model.json (the full model) and search.json (a flat index for dynamic name/kind/type search on the docs site).

## module `Tey.Docgen.Json`

### `modelJson`

```kex
modelJson(model: PackageModel) -> String
```

### `moduleIndexValue`

```kex
moduleIndexValue(m: Tey.Docgen.Model.ModuleIndexEntry) -> Any
```

### `linkValue`

```kex
linkValue(l: Tey.Docgen.Model.LinkEntry) -> Any
```

### `labelOrPackage`

```kex
labelOrPackage(model: PackageModel) -> String
```

### `pageValue`

```kex
pageValue(page: SourcePage) -> Any
```

### `entityValue`

```kex
entityValue(e: Entity) -> Any
```

### `variantsValue`

```kex
variantsValue(variants: [VariantEntry]?) -> Any
```

### `fieldValue`

```kex
fieldValue(f: FieldEntry) -> Any
```

### `fieldValues`

```kex
fieldValues(fields: [FieldEntry]) -> Any
```

A named helper so the lambda's element type comes from the [FieldEntry] parameter, not from the surrounding map literal's value type.

### `functionValue`

```kex
functionValue(f: FunctionEntry) -> Any
```

### `docValue`

```kex
docValue(doc: Doc) -> Any
```

### `returnsValue`

```kex
returnsValue(doc: Doc) -> Any
```

### `searchJson`

```kex
searchJson(model: PackageModel) -> String
```

### `searchEntries`

```kex
searchEntries(model: PackageModel) -> [SearchEntry]
```

### `pageSearchEntries`

```kex
pageSearchEntries(page: SourcePage) -> [SearchEntry]
```

### `entitySearchEntries`

```kex
entitySearchEntries(e: Entity, page: SourcePage) -> [SearchEntry]
```

### `entityTypes`

```kex
entityTypes(e: Entity) -> [String]
```

The type names an entity is "about" — the search-by-type dimension. For a function that is its signature's types; for a record its field types; for a type its parents and variant fields; for a trait/make the types its methods mention; for a module the union of its children.

### `variantFieldTypes`

```kex
variantFieldTypes(variants: [VariantEntry]?) -> [String]
```

### `childSearchEntries`

```kex
childSearchEntries(e: Entity, page: SourcePage) -> [SearchEntry]
```

### `functionSearchEntry`

```kex
functionSearchEntry(f: FunctionEntry, page: SourcePage, owner: String) -> SearchEntry
```

### `searchValue`

```kex
searchValue(entry: SearchEntry) -> Any
```

### `entitySignatures`

```kex
entitySignatures(e: Entity) -> [String]
```

### `entitySummary`

```kex
entitySummary(e: Entity) -> String
```
