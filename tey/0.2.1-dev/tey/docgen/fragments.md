---
package: tey
version: "0.2.1-dev"
source: tey/docgen/fragments.kex
title: Tey.Docgen.Fragments
entities:
  - { kind: module, name: "Tey.Docgen.Fragments" }
---

# Tey.Docgen.Fragments

Writes `tey docs build --format fragments`: the reference as page bodies for a host site to frame, without the header and sidebar of the standalone site.

The unit is written where `site` output would go (`<out>/<package>/<version>/`), as

```kex
<page>.html        the page body, without <html>, header, sidebar or h1
<page>.page.json   what the host needs to frame it: title, description,
                   URL path, template, and `data` (package, version,
                   source file, the on-page table of contents)
index.html/.page.json  the unit's landing page (the module cards)
nav.json           the unit's page tree: {title, path, children}
*.md, model.json, search.json, manifest.json  as in `site` output
```

Pages use the paths a static host with pretty URLs serves: `list` is `/<package>/<version>/list/`. Every relative link from the shared renderer, such as `../net.html#module-net`, is rewritten to that form, so a fragment works on any host that mounts the unit at `/<package>/<version>/`. Marqraft, for one, reads this layout as a mount with `"format": "fragments"`: each unit directory is a version, each sidecar a read-only page, and `nav.json` the version's page tree.

## module `Tey.Docgen.Fragments`

### `write` (foul)

```kex
write(pages: [SourcePage], versionDir: String, model: PackageModel) -> Integer
```

### `writePage` (foul)

```kex
writePage(page: SourcePage, versionDir: String, model: PackageModel) -> ()
```

### `unitData`

```kex
unitData(model: PackageModel, source: String, toc: [TocEntry]) -> Any
```

Returns what a theme may show beside the body: the unit and version (for the header badge), where the source lives, and the page's sections for an "On this page" list.

### `tocValue`

```kex
tocValue(t: TocEntry) -> Any
```

### `tocHtml`

```kex
tocHtml(toc: [TocEntry]) -> String
```

Renders the section list as HTML, so a theme template can place it without walking JSON, which a template language that sees the data as `Any` cannot iterate. A page with only one section gets nothing.

### `tocClass`

```kex
tocClass(t: TocEntry) -> String
```

### `unitRoot`

```kex
unitRoot(model: PackageModel) -> String
```

Returns the path the unit is mounted at, such as `/prelude/0.4.0/`.

### `pageUrl`

```kex
pageUrl(model: PackageModel, urlPath: String) -> String
```

### `navTree`

```kex
navTree(pages: [SourcePage], model: PackageModel) -> Any
```

Returns the page tree, nested as the standalone sidebar nests it: a module family such as Net, Net.DNS and Net.HTTP is one branch.

### `navNode`

```kex
navNode(page: SourcePage, pages: [SourcePage], model: PackageModel) -> Any
```

### `tocOf`

```kex
tocOf(page: SourcePage, model: PackageModel) -> [TocEntry]
```

Returns the sections a reader can jump to, in page order: each declaration with a section of its own, the functions and constants listed under it, and the declarations a module holds. Members are included because a page for one long type, such as `List`, is a single section with fifty functions.

### `tocAt`

```kex
tocAt(entities: [Entity], nested: Bool, page: SourcePage, model: PackageModel) -> [TocEntry]
```

Builds the entries for `entities`. A module that is only the file's namespace has no section, so its declarations go at the top level.

### `MemberKind` (constant)

The `kind` of a section entry for a member, as opposed to a declaration.



### `memberToc`

```kex
memberToc(e: Entity, entities: [Entity], model: PackageModel) -> [TocEntry]
```

Returns the members listed in the section of `e`, under the anchors the renderer gives them. A type's functions come from the make blocks folded into its section.

### `functionToc`

```kex
functionToc(functions: [FunctionEntry], owner: String) -> [TocEntry]
```

### `memberEntry`

```kex
memberEntry(name: String, anchor: String) -> TocEntry
```

### `tocTitle`

```kex
tocTitle(e: Entity) -> String
```

### `descriptionOf`

```kex
descriptionOf(page: SourcePage) -> String
```

Returns one sentence for the page's `<meta name="description">`: from the file's intro, else from its first declaration, else its title.

### `absolutize`

```kex
absolutize(html: String, model: PackageModel, urlPath: String) -> String
```

Rewrites every relative href in `html` to a site path. From the page at `urlPath`, `../net.html#module-net` becomes `/prelude/0.4.0/net/#module-net` and `index.html` becomes `/prelude/0.4.0/`. Fragment-only (`#x`), absolute and external hrefs are left as they are.

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

  - `title` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `kind` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `nested?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool)


