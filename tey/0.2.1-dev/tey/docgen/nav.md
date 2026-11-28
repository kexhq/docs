---
package: tey
version: "0.2.1-dev"
source: tey/docgen/nav.kex
title: Tey.Docgen.Nav
entities:
  - { kind: module, name: "Tey.Docgen.Nav" }
---

# Tey.Docgen.Nav

Navigation and cross-linking: the two indexes every renderer uses, built once from the extracted pages.

```kex
modules: one ModuleIndexEntry per module, for the sidebar
links:   one LinkEntry per linkable name
```

Building them in one place means the HTML, the Markdown and model.json always agree on where a name links to.

## module `Tey.Docgen.Nav`

### `buildModules`

```kex
buildModules(pages: [SourcePage]) -> [ModuleIndexEntry]
```

Returns an entry for every module in the package, in declaration order, with the page it is on. Nested modules get entries of their own.

### `modulesOnPage`

```kex
modulesOnPage(entities: [Entity], urlPath: String) -> [ModuleIndexEntry]
```

### `moduleEntry`

```kex
moduleEntry(entry: ModuleEntry, urlPath: String) -> ModuleIndexEntry
```

### `firstLine`

```kex
firstLine(summary: String) -> String
```

### `parentTitleOf`

```kex
parentTitleOf(pages: [SourcePage], page: SourcePage) -> String?
```

Returns the title of the page that `page` nests under, or `None` for a top-level page.

The parent is found from titles, not paths: "Net.DNS" nests under "Net", and "Net.HTTP.WebSocket" under "Net.HTTP". The longest prefix that has a page wins. When no prefix has a page ("Control" for "Control.Retry"), the page is top-level.

### `parentLoop`

```kex
parentLoop(parts: [String], pages: [SourcePage], page: SourcePage) -> String?
```

### `claimedByAnother?`

```kex
claimedByAnother?(pages: [SourcePage], page: SourcePage, title: String) -> Bool
```

### `topLevelPages`

```kex
topLevelPages(pages: [SourcePage]) -> [SourcePage]
```

Returns the pages with no parent, sorted by title, for the sidebar's top level.

### `childPages`

```kex
childPages(pages: [SourcePage], title: String) -> [SourcePage]
```

Returns the pages nested directly under `title`, sorted by title.

### `descendantPages`

```kex
descendantPages(pages: [SourcePage], page: SourcePage) -> [SourcePage]
```

Returns every page nested under `page` at any depth, sorted by title. A module page lists these as its submodules.

### `sortedByTitle`

```kex
sortedByTitle(pages: [SourcePage]) -> [SourcePage]
```

### `buildLinks`

```kex
buildLinks(pages: [SourcePage]) -> [LinkEntry]
```

Returns the names that can be linked, each with its page and anchor.

A name links only while exactly one place answers to it. A qualified name ("FS.Path") is usually unique; a simple one ("Path") stops linking as soon as two different entities share it, and then only the qualified names link.

### `withTypeHomes`

```kex
withTypeHomes(links: [LinkEntry], types: [Tey.Docgen.Model.TypeFacts]) -> [LinkEntry]
```

Returns `links` plus a link to the home page of each type that make blocks extend and that does not link yet.

A name such as `Integer` is claimed by a module and by several make blocks, so `buildLinks` drops it. In a signature it means the type, which has a home page (`Relations.homePathOf`), so this adds that link. A name that already links keeps its link.

### `linkEntriesOnPage`

```kex
linkEntriesOnPage(entities: [Entity], urlPath: String) -> [LinkEntry]
```

### `memberLinks`

```kex
memberLinks(ownerName: String, owner: String, functions: [Tey.Docgen.Model.FunctionEntry], urlPath: String) -> [LinkEntry]
```

Returns links for the functions of a trait or make block under their owner's name, so prose that writes `List.map` links to that function.

### `linkableNames`

```kex
linkableNames(e: Entity) -> [String]
```

Returns the names an entity can be linked under: its qualified name and its simple name. Functions have none of their own. A make block links under its target's base name, so "Map<K, V>" links as "Map"; a list target such as "[X]" does not link.

### `uniqueTarget?`

```kex
uniqueTarget?(entries: [LinkEntry], candidate: LinkEntry) -> Bool
```

Returns `true` when every entry with `candidate`'s name points at the same page and anchor.

### `differentTarget?`

```kex
differentTarget?(a: LinkEntry, b: LinkEntry) -> Bool
```

### `resolve`

```kex
resolve(links: [LinkEntry], name: String) -> LinkEntry?
```

### `segmentsOf`

```kex
segmentsOf(typeText: String) -> [String]
```

Splits a type reference into identifiers and the separators between them, so a renderer can link the identifiers: "Map<String, FS.Path>" gives ["Map", "<", "String", ", ", "FS.Path", ">"].

### `splitLoop`

```kex
splitLoop(rest: String, ident: String, sep: String, out: [String]) -> [String]
```

`ident` is the identifier being read, `sep` the separator run since it; only one is non-empty at a time, and whichever it is goes out in order.

### `flushIdent`

```kex
flushIdent(ident: String, out: [String]) -> [String]
```

### `flushSep`

```kex
flushSep(sep: String, out: [String]) -> [String]
```

### `isIdentChar?`

```kex
isIdentChar?(ch: String) -> Bool
```

### `hrefFrom`

```kex
hrefFrom(fromPath: String, toPath: String, anchor: String) -> String
```

Returns the relative href from one page of the package to an anchor on another: "#anchor" on the same page, otherwise a path up to the version directory and down to the target.

### `upsToVersionDir`

```kex
upsToVersionDir(urlPath: String) -> String
```

### `ups`

```kex
ups(n: Integer) -> String
```
