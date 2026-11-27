---
package: tey
version: "0.2.1-dev"
source: tey/docgen/markdown.kex
title: Tey.Docgen.Markdown
entities:
  - { kind: module, name: "Tey.Docgen.Markdown" }
---

# Tey.Docgen.Markdown

Renders documentation pages as Markdown for language models to read: stable headings, fenced Kex signatures, and frontmatter listing the page's entities.

## module `Tey.Docgen.Markdown`

### `pageMarkdown`

```kex
pageMarkdown(page: SourcePage, model: PackageModel) -> String
```

### `pageFrontmatter`

```kex
pageFrontmatter(page: SourcePage, model: PackageModel) -> String
```

### `entityFrontmatterLine`

```kex
entityFrontmatterLine(e: Entity) -> String
```

### `pageBody`

```kex
pageBody(page: SourcePage, model: PackageModel) -> String
```

### `entitiesMd`

```kex
entitiesMd(entities: [Entity], page: SourcePage, model: PackageModel) -> String
```

Lays out the page as the HTML does: a type's make blocks on the same page go into the type's section.

### `entitySection`

```kex
entitySection(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `linkMd`

```kex
linkMd(model: PackageModel, fromPath: String, name: String) -> String
```

Links `name` to its documentation, resolved against the same package index as the HTML pages but pointing at the `.md` pages. A name that does not resolve stays plain text.

### `hrefMd`

```kex
hrefMd(fromPath: String, toPath: String, anchor: String) -> String
```

### `linkTypeMd`

```kex
linkTypeMd(model: PackageModel, fromPath: String, text: String) -> String
```

### `typeSection`

```kex
typeSection(e: TypeEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `variantBullet`

```kex
variantBullet(name: String, fields: [String]) -> String
```

### `recordSection`

```kex
recordSection(e: RecordEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `typeBodyMd`

```kex
typeBodyMd(name: String, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `implementsMd`

```kex
implementsMd(name: String, page: SourcePage, model: PackageModel) -> String
```

### `traitLinksMd`

```kex
traitLinksMd(traits: [String], page: SourcePage, model: PackageModel) -> String
```

### `providedMd`

```kex
providedMd(name: String, page: SourcePage, model: PackageModel) -> String
```

### `providedFromMd`

```kex
providedFromMd(written: String, own: [String], page: SourcePage, model: PackageModel) -> String
```

### `elsewhereMd`

```kex
elsewhereMd(name: String, page: SourcePage, model: PackageModel) -> String
```

### `traitSection`

```kex
traitSection(e: TraitEntry, page: SourcePage, model: PackageModel) -> String
```

### `makeSection`

```kex
makeSection(e: MakeEntry, page: SourcePage, model: PackageModel) -> String
```

### `moduleSection`

```kex
moduleSection(e: ModuleEntry, page: SourcePage, model: PackageModel) -> String
```

### `constantSection`

```kex
constantSection(e: ConstantEntry) -> String
```

### `functionsMd`

```kex
functionsMd(functions: [FunctionEntry], owner: String, level: Integer, implements: [String], page: SourcePage, model: PackageModel) -> String
```

Renders one heading per function name, with its overloads under it.

### `foulMd`

```kex
foulMd(isFoul: Bool) -> String
```

Returns the " (foul)" tag shown beside a function's name, as the HTML page shows a chip.

### `traitTagsMd`

```kex
traitTagsMd(name: String, implements: [String], page: SourcePage, model: PackageModel) -> String
```

### `overloadMd`

```kex
overloadMd(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `signatureParts`

```kex
signatureParts(parts: [String], f: FunctionEntry) -> [String]
```

### `paramParts`

```kex
paramParts(parts: [String], f: FunctionEntry) -> [String]
```

### `returnParts`

```kex
returnParts(parts: [String], f: FunctionEntry) -> [String]
```

### `returnLine`

```kex
returnLine(r: Return) -> String
```

### `exampleParts`

```kex
exampleParts(parts: [String], doc: Doc) -> [String]
```

### `exampleBlocks`

```kex
exampleBlocks(examples: [Example]) -> [String]
```

### `exampleBlock`

```kex
exampleBlock(ex: Example) -> [String]
```

### `entityDocMd`

```kex
entityDocMd(doc: Doc) -> String
```

### `docBlock`

```kex
docBlock(doc: Doc) -> String
```

### `typeParamSuffix`

```kex
typeParamSuffix(typeParams: [String]) -> String
```
