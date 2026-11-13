---
package: tey
version: "0.2.1-dev"
source: tey/docgen/markdown.kex
title: Tey.Docgen.Markdown
entities:
  - { kind: module, name: "Tey.Docgen.Markdown" }
---

# Tey.Docgen.Markdown

Model records → Markdown pages (LLM-friendly: stable headings, fenced kex signatures, frontmatter with the entity index).

## module `Tey.Docgen.Markdown`

### `pageMarkdown` (foul)

```kex
pageMarkdown(page: SourcePage, model: PackageModel) -> String
```

### `pageFrontmatter` (foul)

```kex
pageFrontmatter(page: SourcePage, model: PackageModel) -> String
```

### `entityFrontmatterLine` (foul)

```kex
entityFrontmatterLine(e: Entity) -> String
```

### `pageBody` (foul)

```kex
pageBody(page: SourcePage, model: PackageModel) -> String
```

### `entitiesMd` (foul)

```kex
entitiesMd(entities: [Entity], page: SourcePage, model: PackageModel) -> String
```

The same layout as the HTML: a type's make blocks on its own page are folded into the type's section.

### `entitySection` (foul)

```kex
entitySection(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `linkMd` (foul)

```kex
linkMd(model: PackageModel, fromPath: String, name: String) -> String
```

Cross-links in Markdown resolve against the same package index the HTML renderer uses — one resolution rule, two renderings. Targets are the .md siblings of this page.

### `hrefMd` (foul)

```kex
hrefMd(fromPath: String, toPath: String, anchor: String) -> String
```

### `linkTypeMd` (foul)

```kex
linkTypeMd(model: PackageModel, fromPath: String, text: String) -> String
```

### `typeSection` (foul)

```kex
typeSection(e: TypeEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `variantBullet` (foul)

```kex
variantBullet(name: String, fields: [String]) -> String
```

### `recordSection` (foul)

```kex
recordSection(e: RecordEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `typeBodyMd` (foul)

```kex
typeBodyMd(name: String, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `implementsMd` (foul)

```kex
implementsMd(name: String, page: SourcePage, model: PackageModel) -> String
```

### `traitLinksMd` (foul)

```kex
traitLinksMd(traits: [String], page: SourcePage, model: PackageModel) -> String
```

### `providedMd` (foul)

```kex
providedMd(name: String, page: SourcePage, model: PackageModel) -> String
```

### `providedFromMd` (foul)

```kex
providedFromMd(written: String, own: [String], page: SourcePage, model: PackageModel) -> String
```

### `elsewhereMd` (foul)

```kex
elsewhereMd(name: String, page: SourcePage, model: PackageModel) -> String
```

### `traitSection` (foul)

```kex
traitSection(e: TraitEntry, page: SourcePage, model: PackageModel) -> String
```

### `makeSection` (foul)

```kex
makeSection(e: MakeEntry, page: SourcePage, model: PackageModel) -> String
```

### `moduleSection` (foul)

```kex
moduleSection(e: ModuleEntry, page: SourcePage, model: PackageModel) -> String
```

### `constantSection` (foul)

```kex
constantSection(e: ConstantEntry) -> String
```

### `functionsMd` (foul)

```kex
functionsMd(functions: [FunctionEntry], owner: String, level: Integer, implements: [String], page: SourcePage, model: PackageModel) -> String
```

One heading per name; overloads listed under it.

### `foulMd` (foul)

```kex
foulMd(isFoul: Bool) -> String
```

Beside the name, as the HTML chip is: purity is part of what a caller has to know before calling.

### `traitTagsMd` (foul)

```kex
traitTagsMd(name: String, implements: [String], page: SourcePage, model: PackageModel) -> String
```

### `overloadMd` (foul)

```kex
overloadMd(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `signatureParts` (foul)

```kex
signatureParts(parts: [String], f: FunctionEntry) -> [String]
```

### `paramParts` (foul)

```kex
paramParts(parts: [String], f: FunctionEntry) -> [String]
```

### `returnParts` (foul)

```kex
returnParts(parts: [String], f: FunctionEntry) -> [String]
```

### `returnLine` (foul)

```kex
returnLine(r: Return) -> String
```

### `exampleParts` (foul)

```kex
exampleParts(parts: [String], doc: Doc) -> [String]
```

### `exampleBlocks` (foul)

```kex
exampleBlocks(examples: [Example]) -> [String]
```

### `exampleBlock` (foul)

```kex
exampleBlock(ex: Example) -> [String]
```

### `entityDocMd` (foul)

```kex
entityDocMd(doc: Doc) -> String
```

### `docBlock` (foul)

```kex
docBlock(doc: Doc) -> String
```

### `typeParamSuffix` (foul)

```kex
typeParamSuffix(typeParams: [String]) -> String
```
