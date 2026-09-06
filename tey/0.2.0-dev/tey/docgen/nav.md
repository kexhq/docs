---
package: tey
version: "0.2.0-dev"
source: tey/docgen/nav.kex
title: Tey.Docgen.Nav
entities:
  - { kind: module, name: "Tey.Docgen.Nav" }
---

# Tey.Docgen.Nav

## module `Tey.Docgen.Nav`

Navigation and cross-linking: the two indexes every renderer resolves against, derived once from the extracted pages.

```kex
modules — one ModuleIndexEntry per module (the sidebar's structure)
links   — one LinkEntry per linkable name (the interlink universe)
```

Both are computed here rather than in each renderer so HTML, Markdown and model.json cannot disagree about where a name lands — the same reasoning that keeps the typed model the single source: resolve once, render often.

## function `buildModules`

Every module in the package, in declaration order, pointing at the page it lives on. Nested modules are entries of their own (the sidebar nests them by name).


```kex
buildModules(pages)
```


## function `modulesOnPage`


```kex
modulesOnPage(entities, urlPath)
```


## function `moduleEntry`


```kex
moduleEntry(entry, urlPath)
```


## function `firstLine`


```kex
firstLine(summary)
```


## function `parentTitleOf`

The file tree a module family grows into, rebuilt from titles: a page nests under the page whose title is its dotted prefix, so "Net.DNS" (net/dns.kex) is a child of "Net" (net.kex), and "Net.HTTP.WebSocket" of "Net.HTTP". The longest existing prefix wins; a prefix with no page of its own ("Control" for "Control.Retry") leaves the page at the top level. Titles, not paths, carry the relation — the module names are what a reader scans for.


```kex
parentTitleOf(pages, page)
```


## function `parentLoop`


```kex
parentLoop(parts, pages, page)
```


## function `claimedByAnother?`


```kex
claimedByAnother?(pages, page, title)
```


## function `topLevelPages`

The sidebar's top level: pages nothing parents, alphabetically by title — a reader scans by name, not by directory-walk order.


```kex
topLevelPages(pages)
```


## function `childPages`

The pages nested directly under `title`, alphabetically.


```kex
childPages(pages, title)
```


## function `descendantPages`

Every page in `page`'s family at any depth, alphabetically — what a module page lists as its submodules.


```kex
descendantPages(pages, page)
```


## function `sortedByTitle`


```kex
sortedByTitle(pages)
```


## function `buildLinks`

Linkable names, unique-target-wins: a name links while exactly one (page, anchor) answers it. A qualified name ("FS.Path") is its own name; a simple one ("Path") survives only while nothing else claims it — once two different entities answer "Request", the simple spelling stops linking and only the spelled-out names do.


```kex
buildLinks(pages)
```


## function `linkEntriesOnPage`


```kex
linkEntriesOnPage(entities, urlPath)
```


## function `linkableNames`

A type/reference name links under its qualified name; entities whose qualified name is the bare name (top-level declarations) offer that spelling too. A make's target with type parameters ("[X]", "Map<K, V>") links under the base name before the "<" — the anchor is still the full-target one, matching the section id.


```kex
linkableNames(e)
```


## function `uniqueTarget?`

Whether `candidate`'s name answers to exactly one target: every other entry under the same name must land on the same (page, anchor).


```kex
uniqueTarget?(entries, candidate)
```


## function `differentTarget?`


```kex
differentTarget?(a, b)
```


## function `resolve`


```kex
resolve(links, name)
```


## function `segmentsOf`

Splits a type reference into identifier segments and separator runs, so a renderer can link the identifiers and leave the punctuation alone: "Map<String, FS.Path>" → ["Map", "<", "String", ", ", "FS.Path", ">"].


```kex
segmentsOf(typeText)
```


## function `splitLoop`

`ident` is the identifier being read, `sep` the separator run since it; only one is non-empty at a time, and whichever it is goes out in order.


```kex
splitLoop(rest, ident, sep, out)
```


## function `flushIdent`


```kex
flushIdent(ident, out)
```


## function `flushSep`


```kex
flushSep(sep, out)
```


## function `isIdentChar?`


```kex
isIdentChar?(ch)
```


## function `hrefFrom`

The href from one page of this package to another, with anchor: same page → "#anchor"; else up to the version directory and back down.


```kex
hrefFrom(fromPath, toPath, anchor)
```


## function `upsToVersionDir`


```kex
upsToVersionDir(urlPath)
```


## function `ups`


```kex
ups(n)
```

