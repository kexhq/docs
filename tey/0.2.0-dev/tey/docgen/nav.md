---
package: tey
version: "0.2.0-dev"
source: tey/docgen/nav.kex
title: Tey.Docgen.Nav
entities:
  - { kind: module, name: "Tey.Docgen.Nav" }
---

# Tey.Docgen.Nav

Navigation and cross-linking: the two indexes every renderer resolves against, derived once from the extracted pages.

```kex
modules — one ModuleIndexEntry per module (the sidebar's structure)
links   — one LinkEntry per linkable name (the interlink universe)
```

Both are computed here rather than in each renderer so HTML, Markdown and model.json cannot disagree about where a name lands — the same reasoning that keeps the typed model the single source: resolve once, render often.

## module `Tey.Docgen.Nav`

### `buildModules`

```kex
buildModules(pages: [SourcePage]) -> [ModuleIndexEntry]
```

Every module in the package, in declaration order, pointing at the page it lives on. Nested modules are entries of their own (the sidebar nests them by name).

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

The file tree a module family grows into, rebuilt from titles: a page nests under the page whose title is its dotted prefix, so "Net.DNS" (net/dns.kex) is a child of "Net" (net.kex), and "Net.HTTP.WebSocket" of "Net.HTTP". The longest existing prefix wins; a prefix with no page of its own ("Control" for "Control.Retry") leaves the page at the top level. Titles, not paths, carry the relation — the module names are what a reader scans for.

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

The sidebar's top level: pages nothing parents, alphabetically by title — a reader scans by name, not by directory-walk order.

### `childPages`

```kex
childPages(pages: [SourcePage], title: String) -> [SourcePage]
```

The pages nested directly under `title`, alphabetically.

### `descendantPages`

```kex
descendantPages(pages: [SourcePage], page: SourcePage) -> [SourcePage]
```

Every page in `page`'s family at any depth, alphabetically — what a module page lists as its submodules.

### `sortedByTitle`

```kex
sortedByTitle(pages: [SourcePage]) -> [SourcePage]
```

### `buildLinks`

```kex
buildLinks(pages: [SourcePage]) -> [LinkEntry]
```

Linkable names, unique-target-wins: a name links while exactly one (page, anchor) answers it. A qualified name ("FS.Path") is its own name; a simple one ("Path") survives only while nothing else claims it — once two different entities answer "Request", the simple spelling stops linking and only the spelled-out names do.

### `withTypeHomes`

```kex
withTypeHomes(links: [LinkEntry], types: [Tey.Docgen.Model.TypeFacts]) -> [LinkEntry]
```

The links, plus a home for every type that make blocks extend. A bare `Integer` is claimed by a module (number parsing) AND by five make blocks, so the uniqueness rule drops it — yet a type name in a signature means the type, and the type has a home page (Relations.homePathOf). Those homes fill in what uniqueness left out; a name that already links keeps its link.

### `linkEntriesOnPage`

```kex
linkEntriesOnPage(entities: [Entity], urlPath: String) -> [LinkEntry]
```

### `memberLinks`

```kex
memberLinks(ownerName: String, owner: String, functions: [Tey.Docgen.Model.FunctionEntry], urlPath: String) -> [LinkEntry]
```

`List.map`, `Enumerable.filter`: members are linkable under their owner's name, so prose that writes `List.map` lands on the method.

### `linkableNames`

```kex
linkableNames(e: Entity) -> [String]
```

A type/reference name links under its qualified name; entities whose qualified name is the bare name (top-level declarations) offer that spelling too. A make's target with type parameters ("[X]", "Map<K, V>") links under the base name before the "<" — the anchor is still the full-target one, matching the section id.

### `uniqueTarget?`

```kex
uniqueTarget?(entries: [LinkEntry], candidate: LinkEntry) -> Bool
```

Whether `candidate`'s name answers to exactly one target: every other entry under the same name must land on the same (page, anchor).

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

Splits a type reference into identifier segments and separator runs, so a renderer can link the identifiers and leave the punctuation alone: "Map<String, FS.Path>" → ["Map", "<", "String", ", ", "FS.Path", ">"].

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

The href from one page of this package to another, with anchor: same page → "#anchor"; else up to the version directory and back down.

### `upsToVersionDir`

```kex
upsToVersionDir(urlPath: String) -> String
```

### `ups`

```kex
ups(n: Integer) -> String
```
