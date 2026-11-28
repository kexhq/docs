---
package: tey
version: "0.2.0-dev"
source: tey/docgen/fragments.kex
title: Tey.Docgen.Fragments
entities:
  - { kind: module, name: "Tey.Docgen.Fragments" }
---

# Tey.Docgen.Fragments

`tey docs build --format fragments`: the reference as page bodies for a host site to frame, instead of a standalone site with docgen's own chrome.

The unit lands where `site` output would (<out>/<package>/<version>/), as

```kex
<page>.html        the page body — no <html>, no header, no sidebar, no h1
<page>.page.json   what the host needs to frame it: title, description,
                   URL path, template, and `data` (package, version,
                   source file, the on-page table of contents)
index.html/.page.json  the unit's landing page (the module cards)
nav.json           the unit's page tree: {title, path, children}
*.md, model.json, search.json, manifest.json  as in `site` output
```

Pages are addressed the way a static host with pretty URLs serves them: `list` is /<package>/<version>/list/. Every relative link the shared renderer produced (`../net.html#module-net`) is rewritten to that form, so a fragment works wherever the host mounts the unit at /<package>/<version>/. Nothing here knows which host that is. Marqraft reads this layout as a mount with "format": "fragments": each unit directory is a version, each sidecar a read-only page, nav.json the version's page tree.

## module `Tey.Docgen.Fragments`

### `write`

```kex
write(pages: [SourcePage], versionDir: String, model: PackageModel) -> Integer
```

### `writePage`

```kex
writePage(page: SourcePage, versionDir: String, model: PackageModel) -> ()
```

### `unitData`

```kex
unitData(model: PackageModel, source: String, toc: [TocEntry]) -> Any
```

Everything a theme might show beside the body: which unit and version this is (the header badge), where the source lives, and the page's sections for an "On this page" list.

### `tocValue`

```kex
tocValue(t: TocEntry) -> Any
```

### `tocHtml`

```kex
tocHtml(toc: [TocEntry]) -> String
```

The rail as markup too, so a theme template can place it without walking JSON: a template language that sees the data as `Any` cannot iterate it. A page with a single section has nothing to navigate.

### `unitRoot`

```kex
unitRoot(model: PackageModel) -> String
```

"/prelude/0.4.0/": where the unit is mounted.

### `pageUrl`

```kex
pageUrl(model: PackageModel, urlPath: String) -> String
```

### `navTree`

```kex
navTree(pages: [SourcePage], model: PackageModel) -> Any
```

The page tree, nested the way the standalone sidebar nests it: a module family (Net, Net.DNS, Net.HTTP) is one branch.

### `navNode`

```kex
navNode(page: SourcePage, pages: [SourcePage], model: PackageModel) -> Any
```

### `tocOf`

```kex
tocOf(entities: [Entity]) -> [TocEntry]
```

The sections a reader can jump to, in page order: each declaration with a section of its own, and those a module declares.

### `tocAt`

```kex
tocAt(entities: [Entity], nested: Bool) -> [TocEntry]
```

### `tocTitle`

```kex
tocTitle(e: Entity) -> String
```

### `descriptionOf`

```kex
descriptionOf(page: SourcePage) -> String
```

One sentence for the page's <meta name="description">: the file's intro, else what its first declaration says, else its title.

### `summaryOf`

```kex
summaryOf(e: Entity) -> String
```

### `absolutize`

```kex
absolutize(html: String, model: PackageModel, urlPath: String) -> String
```

Every relative href in a fragment, rewritten to a site path: from the page at `urlPath`, "../net.html#module-net" is "/prelude/0.4.0/net/#module-net" and "index.html" is "/prelude/0.4.0/". A fragment-only href ("#x"), an absolute one and an external URL stay as they are.

### `sitePath`

```kex
sitePath(href: String, base: [String]) -> String
```

### `normalize`

```kex
normalize(base: [String], rel: [String]) -> [String]
```

## record `TocEntry`

**Fields**

  - `title` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `kind` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `nested` : [Bool](../../../../prelude/0.4.0-beta.4-dev/truthyable.md#make-bool)


