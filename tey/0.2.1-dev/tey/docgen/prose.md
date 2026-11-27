---
package: tey
version: "0.2.1-dev"
source: tey/docgen/prose.kex
title: Tey.Docgen.Prose
entities:
  - { kind: module, name: "Tey.Docgen.Prose" }
---

# Tey.Docgen.Prose

`tey docs prose`: renders a tree of Markdown files as a site, with the same layout as the generated reference.

A prose site belongs to a named, versioned unit, as a reference build does, so the two can sit side by side in one site and share `versions.json`, the stylesheet and the layout. `build` derives its pages from `.kex` sources; `prose` renders them from `.md` files.

The command does not care what the prose is: a guide, a book and a package's handbook are all treated the same. Naming the units and putting several of them together into one site is left to the caller.

## module `Tey.Docgen.Prose`

### `proseCommand` (foul)

```kex
proseCommand(parsed: ParsedOptions) -> Integer
```

### `readPages` (foul)

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

### `writeProse` (foul)

```kex
writeProse(pages: [ProsePage], versionDir: String, out: String, model: PackageModel) -> ()
```

Writes each page as HTML and as Markdown side by side, as reference builds do, plus the index page and the shared assets.

### `writeProseLoop` (foul)

```kex
writeProseLoop(pages: [ProsePage], index: Integer, versionDir: String, model: PackageModel) -> ()
```

### `proseIndexHtml`

```kex
proseIndexHtml(pages: [ProsePage], model: PackageModel) -> String
```

Renders the index page: the chapters in the author's order, each with its description. Reference builds use `versionIndexHtml`, a grid of modules, instead; the two are kept separate so book layout never reaches `tey docs build`.

### `chapterItem`

```kex
chapterItem(prose: ProsePage) -> String
```

### `prevNextHtml`

```kex
prevNextHtml(pages: [ProsePage], index: Integer) -> String
```

Renders a chapter's footer: links to the previous and next chapters. The first and last chapters get only one link.

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

One Markdown page, read and rendered: its place in the site, its sort order and description from the frontmatter, its HTML, and the Markdown without frontmatter that is served as its `.md` version.

**Fields**

  - `page` : [SourcePage](../../tey/docgen/model.md#record-tey-docgen-model-sourcepage)
  - `order` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `body` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `description` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `markdown` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)


