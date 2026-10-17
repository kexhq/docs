---
package: tey
version: "0.2.0-dev"
source: tey/docgen/markdown.kex
title: Tey.Docgen.Markdown
entities:
  - { kind: module, name: "Tey.Docgen.Markdown" }
---

# Tey.Docgen.Markdown

Model records → Markdown pages (LLM-friendly: stable headings, fenced kex signatures, frontmatter with the entity index).

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

The same layout as the HTML: a type's make blocks on its own page are folded into the type's section.

### `entitySection`

```kex
entitySection(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `linkMd`

```kex
linkMd(model: PackageModel, fromPath: String, name: String) -> String
```

Cross-links in Markdown resolve against the same package index the HTML renderer uses — one resolution rule, two renderings. Targets are the .md siblings of this page.

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

One heading per name; overloads listed under it.

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
