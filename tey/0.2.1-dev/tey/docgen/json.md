---
package: tey
version: "0.2.1-dev"
source: tey/docgen/json.kex
title: Tey.Docgen.Json
entities:
  - { kind: module, name: "Tey.Docgen.Json" }
---

# Tey.Docgen.Json

Model records → JSON artifacts. This is the single boundary where typed records become plain maps (atom keys, JSON-ready values) so JSON.stringify can serialise them: model.json (the full model) and search.json (a flat index for dynamic name/kind/type search on the docs site).

## module `Tey.Docgen.Json`

### `modelJson` (foul)

```kex
modelJson(model: PackageModel) -> String
```

### `moduleIndexValue` (foul)

```kex
moduleIndexValue(m: Tey.Docgen.Model.ModuleIndexEntry) -> Any
```

### `linkValue` (foul)

```kex
linkValue(l: Tey.Docgen.Model.LinkEntry) -> Any
```

### `labelOrPackage` (foul)

```kex
labelOrPackage(model: PackageModel) -> String
```

### `pageValue` (foul)

```kex
pageValue(page: SourcePage) -> Any
```

### `entityValue` (foul)

```kex
entityValue(e: Entity) -> Any
```

### `variantsValue` (foul)

```kex
variantsValue(variants: [VariantEntry]?) -> Any
```

### `fieldValue` (foul)

```kex
fieldValue(f: FieldEntry) -> Any
```

### `fieldValues` (foul)

```kex
fieldValues(fields: [FieldEntry]) -> Any
```

A named helper so the lambda's element type comes from the [FieldEntry] parameter, not from the surrounding map literal's value type.

### `functionValue` (foul)

```kex
functionValue(f: FunctionEntry) -> Any
```

### `docValue` (foul)

```kex
docValue(doc: Doc) -> Any
```

### `returnsValue` (foul)

```kex
returnsValue(doc: Doc) -> Any
```

### `searchJson` (foul)

```kex
searchJson(model: PackageModel) -> String
```

### `searchEntries` (foul)

```kex
searchEntries(model: PackageModel) -> [SearchEntry]
```

### `pageSearchEntries` (foul)

```kex
pageSearchEntries(page: SourcePage) -> [SearchEntry]
```

### `entitySearchEntries` (foul)

```kex
entitySearchEntries(e: Entity, page: SourcePage) -> [SearchEntry]
```

### `entityTypes` (foul)

```kex
entityTypes(e: Entity) -> [String]
```

The type names an entity is "about" — the search-by-type dimension. For a function that is its signature's types; for a record its field types; for a type its parents and variant fields; for a trait/make the types its methods mention; for a module the union of its children.

### `variantFieldTypes` (foul)

```kex
variantFieldTypes(variants: [VariantEntry]?) -> [String]
```

### `childSearchEntries` (foul)

```kex
childSearchEntries(e: Entity, page: SourcePage) -> [SearchEntry]
```

### `functionSearchEntry` (foul)

```kex
functionSearchEntry(f: FunctionEntry, page: SourcePage, owner: String) -> SearchEntry
```

### `searchValue` (foul)

```kex
searchValue(entry: SearchEntry) -> Any
```

### `entitySignatures` (foul)

```kex
entitySignatures(e: Entity) -> [String]
```

### `entitySummary` (foul)

```kex
entitySummary(e: Entity) -> String
```
