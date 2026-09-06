---
package: tey
version: "0.2.0-dev"
source: tey/docgen/prose.kex
title: Tey.Docgen.Prose
entities:
  - { kind: module, name: "Tey.Docgen.Prose" }
---

# Tey.Docgen.Prose

## module `Tey.Docgen.Prose`

`tey docs prose`: a tree of Markdown files rendered into the same chrome as the generated reference.

The unit is the same one `build` documents — a named, versioned thing — so the two land side by side in one site and share `versions.json`, the stylesheet and the layout. What differs is only where the pages come from: `build` parses .kex and derives them, `prose` reads .md and renders it.

Nothing here knows what the prose IS. A guide, a book, a package's own handbook are all "long-form pages for a versioned unit"; the naming and the assembly of a site out of several such units belong to whoever runs this, not to docgen.

## function `proseCommand`


```kex
proseCommand(parsed)
```


## record `ProsePage`

A page and the things only its frontmatter knows: where it sorts, the HTML its Markdown became, the description its index entry shows, and the Markdown (minus frontmatter) its raw `.md` rendering serves.

**Fields**

  - `page` : [SourcePage](../../tey/docgen/model.md#record-sourcepage)
  - `order` : Integer
  - `body` : String
  - `description` : String
  - `markdown` : String

## function `readPages`


```kex
readPages(files, source, accum)
```


## function `pageOf`


```kex
pageOf(fileName, text)
```


## function `stripSuffix`


```kex
stripSuffix(name, suffix)
```


## function `writeProse`

Both renderings, from the same parsed page: HTML for readers, Markdown for crawlers, LLMs, and the "Markdown" link every page carries — the same `.md`-next-to-`.html` pairing reference builds write.


```kex
writeProse(pages, versionDir, out, model)
```


## function `writeProseLoop`


```kex
writeProseLoop(pages, index, versionDir, model)
```


## function `proseIndexHtml`

The book's own spine: chapters in author order with their descriptions, not the module grid reference builds get. Deliberately separate from `versionIndexHtml` — `tey docs build` keeps documenting any package, and nothing about a book leaks into it.


```kex
proseIndexHtml(pages, model)
```


## function `chapterItem`


```kex
chapterItem(prose)
```


## function `prevNextHtml`

Chapter footer: the siblings around this one, so the book reads forward as well as sideways. First and last chapters link one way only.


```kex
prevNextHtml(pages, index)
```


## function `prevLink`


```kex
prevLink(pages, index, up)
```


## function `nextLink`


```kex
nextLink(pages, index, up)
```


## function `chapterNav`


```kex
chapterNav(prev, nextHtml)
```

