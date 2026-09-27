---
package: tey
version: "0.2.0"
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

### `entitySection`

```kex
entitySection(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `linkMd`

```kex
linkMd(model: PackageModel, fromPath: String, name: String) -> String
```

Cross-links in Markdown resolve against the same package index the HTML renderer uses — one resolution rule, two renderings. Targets are the .md siblings of this page.

### `linkTypeMd`

```kex
linkTypeMd(model: PackageModel, fromPath: String, text: String) -> String
```

### `typeSection`

```kex
typeSection(e: TypeEntry, page: SourcePage, model: PackageModel) -> String
```

### `variantBullet`

```kex
variantBullet(name: String, fields: [String]) -> String
```

### `recordSection`

```kex
recordSection(e: RecordEntry, page: SourcePage, model: PackageModel) -> String
```

### `traitSection`

```kex
traitSection(e: TraitEntry) -> String
```

### `makeSection`

```kex
makeSection(e: MakeEntry, page: SourcePage, model: PackageModel) -> String
```

### `moduleSection`

```kex
moduleSection(e: ModuleEntry, page: SourcePage, model: PackageModel) -> String
```

### `functionSection`

```kex
functionSection(e: FunctionEntry) -> String
```

### `signatureBlock`

```kex
signatureBlock(f: FunctionEntry) -> String
```

### `constantSection`

```kex
constantSection(e: ConstantEntry) -> String
```

### `renderFunctions`

```kex
renderFunctions(functions: [FunctionEntry]) -> String
```

### `functionBlock`

```kex
functionBlock(f: FunctionEntry) -> String
```

### `signatureParts`

```kex
signatureParts(parts: [String], f: FunctionEntry) -> [String]
```

### `returnParts`

```kex
returnParts(parts: [String], doc: Doc) -> [String]
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

### `docBlock`

```kex
docBlock(doc: Doc) -> String
```

### `typeParamSuffix`

```kex
typeParamSuffix(typeParams: [String]) -> String
```
