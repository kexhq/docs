---
package: tey
version: "0.2.1-dev"
source: tey/docgen/json.kex
title: Tey.Docgen.Json
entities:
  - { kind: module, name: "Tey.Docgen.Json" }
---

# Tey.Docgen.Json

Renders the documentation model as JSON: `model.json`, the full model, and `search.json`, a flat index for searching the docs site by name, kind and type.

This is the only place where the typed model records are turned into plain maps with atom keys, ready for `JSON.stringify`.

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

Returns the type names an entity is about, for search by type: a function's signature types, a record's field types, a type's parents and variant fields, the types a trait's or make block's functions mention, and for a module the union of its children's.

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
