---
package: tey
version: "0.2.0-dev"
source: tey/docgen/markdown.kex
title: Tey.Docgen.Markdown
entities:
  - { kind: module, name: "Tey.Docgen.Markdown" }
---

# Tey.Docgen.Markdown

## module `Tey.Docgen.Markdown`

Model records → Markdown pages (LLM-friendly: stable headings, fenced kex signatures, frontmatter with the entity index).

## function `pageMarkdown`


```kex
pageMarkdown(page, model)
```


## function `pageFrontmatter`


```kex
pageFrontmatter(page, model)
```


## function `entityFrontmatterLine`


```kex
entityFrontmatterLine(e)
```


## function `pageBody`


```kex
pageBody(page, model)
```


## function `entitySection`

── Entity sections ──────────────────────────────────────────────────────


```kex
entitySection(e, page, model)
```


## function `linkMd`

Cross-links in Markdown resolve against the same package index the HTML renderer uses — one resolution rule, two renderings. Targets are the .md siblings of this page.


```kex
linkMd(model, fromPath, name)
```


## function `linkTypeMd`


```kex
linkTypeMd(model, fromPath, text)
```


## function `typeSection`


```kex
typeSection(e, page, model)
```


## function `variantBullet`


```kex
variantBullet(name, fields)
```


## function `recordSection`


```kex
recordSection(e, page, model)
```


## function `traitSection`


```kex
traitSection(e)
```


## function `makeSection`


```kex
makeSection(e, page, model)
```


## function `moduleSection`


```kex
moduleSection(e, page, model)
```


## function `functionSection`


```kex
functionSection(e)
```


## function `signatureBlock`


```kex
signatureBlock(f)
```


## function `constantSection`


```kex
constantSection(e)
```


## function `renderFunctions`

── Function details (inside traits, makes, modules) ────────────────────


```kex
renderFunctions(functions)
```


## function `functionBlock`


```kex
functionBlock(f)
```


## function `signatureParts`


```kex
signatureParts(parts, f)
```


## function `returnParts`


```kex
returnParts(parts, doc)
```


## function `returnLine`


```kex
returnLine(r)
```


## function `exampleParts`


```kex
exampleParts(parts, doc)
```


## function `exampleBlocks`


```kex
exampleBlocks(examples)
```


## function `exampleBlock`


```kex
exampleBlock(ex)
```


## function `docBlock`

── Shared fragments ─────────────────────────────────────────────────────


```kex
docBlock(doc)
```


## function `typeParamSuffix`


```kex
typeParamSuffix(typeParams)
```

