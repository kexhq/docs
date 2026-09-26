---
package: tey
version: "0.2.0-dev"
source: tey/docgen/prose.kex
title: Tey.Docgen.Prose
entities:
  - { kind: module, name: "Tey.Docgen.Prose" }
---

# Tey.Docgen.Prose

`tey docs prose`: a tree of Markdown files rendered into the same chrome as the generated reference.

The unit is the same one `build` documents — a named, versioned thing — so the two land side by side in one site and share `versions.json`, the stylesheet and the layout. What differs is only where the pages come from: `build` parses .kex and derives them, `prose` reads .md and renders it.

Nothing here knows what the prose IS. A guide, a book, a package's own handbook are all "long-form pages for a versioned unit"; the naming and the assembly of a site out of several such units belong to whoever runs this, not to docgen.

## module `Tey.Docgen.Prose`

### `proseCommand`

```kex
proseCommand(parsed: OptionParser.ParsedOptions) -> Integer
```

### `readPages`

```kex
readPages(files: [String], source: String, accum: [ProsePage]) -> [ProsePage]
```

### `pageOf`

```kex
pageOf(fileName: String, text: String) -> ProsePage
```

### `stripSuffix`

```kex
stripSuffix(name: String, suffix: String) -> String
```

### `writeProse`

```kex
writeProse(pages: [ProsePage], versionDir: String, out: String, model: PackageModel) -> ()
```

Both renderings, from the same parsed page: HTML for readers, Markdown for crawlers, LLMs, and the "Markdown" link every page carries — the same `.md`-next-to-`.html` pairing reference builds write.

### `writeProseLoop`

```kex
writeProseLoop(pages: [ProsePage], index: Integer, versionDir: String, model: PackageModel) -> ()
```

### `proseIndexHtml`

```kex
proseIndexHtml(pages: [ProsePage], model: PackageModel) -> String
```

The book's own spine: chapters in author order with their descriptions, not the module grid reference builds get. Deliberately separate from `versionIndexHtml` — `tey docs build` keeps documenting any package, and nothing about a book leaks into it.

### `chapterItem`

```kex
chapterItem(prose: ProsePage) -> String
```

### `prevNextHtml`

```kex
prevNextHtml(pages: [ProsePage], index: Integer) -> String
```

Chapter footer: the siblings around this one, so the book reads forward as well as sideways. First and last chapters link one way only.

### `prevLink`

```kex
prevLink(pages: [ProsePage], index: Integer, up: String) -> String
```

### `nextLink`

```kex
nextLink(pages: [ProsePage], index: Integer, up: String) -> String
```

### `chapterNav`

```kex
chapterNav(prev: String, nextHtml: String) -> String
```

## record `ProsePage`

A page and the things only its frontmatter knows: where it sorts, the HTML its Markdown became, the description its index entry shows, and the Markdown (minus frontmatter) its raw `.md` rendering serves.

**Fields**

  - `page` : [SourcePage](../../tey/docgen/model.md#record-tey-docgen-model-sourcepage)
  - `order` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `body` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `description` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `markdown` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)


