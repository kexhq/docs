---
package: tey
version: "0.2.0"
source: tey/docgen/html.kex
title: Tey.Docgen.Html
entities:
  - { kind: module, name: "Tey.Docgen.Html" }
---

# Tey.Docgen.Html

Model records → static HTML pages, styled after kex.run's docs section (warm honey/cream palette, Fraunces/Plus Jakarta Sans/JetBrains Mono, dark code surface with tok-* syntax classes). The stylesheet lives in Tey.Docgen.Css and is written to assets/style.css by the build driver.

HTML is a sibling renderer of the Markdown one: both walk the typed PackageModel, so nothing here parses Markdown or JSON.

## module `Tey.Docgen.Html`

### `pageHtml`

```kex
pageHtml(page: SourcePage, model: PackageModel) -> String
```

### `submodulesHtml`

```kex
submodulesHtml(page: SourcePage, model: PackageModel) -> String
```

A module family spread over several files ("Net" + net/dns.kex, net/http.kex, ...) gets one page per file, and the parent page says nothing about the rest — a reader on "Net" has no reason to believe Net.DNS or Net.Socket are documented at all. This section is the signpost: every descendant page, with the summary its module declares.

### `submoduleItem`

```kex
submoduleItem(child: SourcePage, page: SourcePage, model: PackageModel) -> String
```

### `preludePage?`

```kex
preludePage?(page: SourcePage, model: PackageModel) -> Bool
```

### `preludePageHtml`

```kex
preludePageHtml(page: SourcePage, model: PackageModel) -> String
```

The prelude declares nothing, so the generic page renderer leaves it blank. What it HAS is a list of imports and a comment explaining them — which is exactly the page a reader wants: what am I given for free, and where does each of those live.

### `preludeItem`

```kex
preludeItem(model: PackageModel, fromPath: String, name: String) -> String
```

### `preludeLink`

```kex
preludeLink(model: PackageModel, fromPath: String, name: String) -> String
```

A `using X` in prelude.kex names a sibling SOURCE FILE, so the page for that file is the exact target. Going through the link index instead would lose half the list: `Map`, `Set` and `Range` are ambiguous as bare names — a module and a type both claim them — and resolve to nothing.

The file is what matches, not the title: `using Test` is test.kex, whose page is titled "Assert", and `using Env` is env.kex, titled "ENV".

### `pageNamed`

```kex
pageNamed(model: PackageModel, name: String) -> SourcePage?
```

### `pageStem`

```kex
pageStem(urlPath: String) -> String
```

### `moduleSummary`

```kex
moduleSummary(model: PackageModel, name: String) -> String
```

### `versionIndexHtml`

```kex
versionIndexHtml(model: PackageModel) -> String
```

Landing page for <pkg>/<version>/index.html: every module as a card. When the package has a prelude, the cards are split by how a reader REACHES them — visible everywhere, or one `using` away — because that is the first question anyone has about a standard library.

### `indexSections`

```kex
indexSections(model: PackageModel, top: [String]) -> String
```

### `preludePaths`

```kex
preludePaths(model: PackageModel) -> [String]
```

The prelude imports FILES, and everything a listed file declares comes with it: `using Time` is what puts `Date`, `Duration` and `Time.Period` in scope, none of which prelude.kex names. So the split is by page, not by module name.

### `preludePath`

```kex
preludePath(model: PackageModel, name: String) -> [String]
```

### `cardGrid`

```kex
cardGrid(modules: [Tey.Docgen.Model.ModuleIndexEntry], top: [String]) -> String
```

### `packageVersionsHtml`

```kex
packageVersionsHtml(packageName: String, versions: [VersionEntry]) -> String
```

<pkg>/index.html: the versions of one package, newest first — the page a reader lands on when they want a different release of what they are reading. What the ids MEAN is the package's own story: a library's own releases, the stdlib's Kex releases. The page does not need to know.

### `versionCard`

```kex
versionCard(v: VersionEntry) -> String
```

### `searchPageHtml`

```kex
searchPageHtml(model: PackageModel) -> String
```

<pkg>/<version>/search.html: the shareable full-page search. The modal on every page links here with ?q=<term>, so a results page is a URL rather than a state — the page reads the term back from the query string.

### `rootIndexHtml`

```kex
rootIndexHtml(versions: [VersionEntry]) -> String
```

Site root index.html: one card per PACKAGE (its newest build), not per build — a reader arrives at "the docs" for a thing, and the thing is a package; its versions are one click down. Built from the accumulated versions.json entries, not just this build's model.

### `packageNames`

```kex
packageNames(versions: [VersionEntry]) -> [String]
```

Package names in first-seen order of their newest entry: versions arrive newest-first from accumulateVersions, so the first entry of each package is that package's newest build.

### `packageCard`

```kex
packageCard(name: String, versions: [VersionEntry]) -> String
```

### `layout`

```kex
layout(title: String, current: String, bodyContent: String, model: PackageModel) -> String
```

### `sidebar`

```kex
sidebar(model: PackageModel, current: String) -> String
```

The sidebar lists one entry per source FILE, nested by module family: a page whose title is a dotted child of another page's title nests under it ("Net.DNS" under "Net", "Net.HTTP.WebSocket" under "Net.HTTP"), so a multi-file module reads as one branch instead of trailing the list in directory-walk order. The active file expands to its top-level declarations so a reader can jump straight to one. The label is the page's title (the module it declares), not the raw file name. The heading is a link: it is the package's name, and the obvious thing to want from it is the list of what the package contains — which is the version index, where the prelude split lives.

### `sidebarEntry`

```kex
sidebarEntry(page: SourcePage, current: String, vpre: String, pages: [SourcePage]) -> String
```

### `preludeTag`

```kex
preludeTag(inPrelude: Bool) -> String
```

The page's own heading carries it — the sidebar is a list to scan, and a chip on 32 of 41 rows is noise rather than an answer.

### `firstModulesOfPages`

```kex
firstModulesOfPages(pages: [SourcePage]) -> [String]
```

The modules that OPEN a page — their section sits at the very top, so a card for one links to the page itself rather than to an anchor that lands where the page already starts. A page whose first declaration is a type or record has no such module.

### `moduleCard`

```kex
moduleCard(m: Tey.Docgen.Model.ModuleIndexEntry, top: Bool) -> String
```

### `entitySection`

```kex
entitySection(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `linker`

```kex
linker(page: SourcePage, model: PackageModel) -> String -> String
```

A reference resolver scoped to one page: links resolve against the whole package index, but the href is relative to the page doing the referring.

### `typeSection`

```kex
typeSection(e: TypeEntry, page: SourcePage, model: PackageModel) -> String
```

### `variantsHtml`

```kex
variantsHtml(variants: [VariantEntry]?) -> String
```

### `variantItem`

```kex
variantItem(v: VariantEntry) -> String
```

### `recordSection`

```kex
recordSection(e: RecordEntry, page: SourcePage, model: PackageModel) -> String
```

### `fieldRow`

```kex
fieldRow(f: Tey.Docgen.Model.FieldEntry, link: (String -> String)) -> String
```

### `linkTypeText`

```kex
linkTypeText(link: (String -> String), text: String) -> String
```

A type text is code with links inside it: split into identifier and punctuation segments, link the identifiers that resolve, escape the rest.

### `linkType`

```kex
linkType(links: [LinkEntry], fromPath: String, name: String) -> String
```

The whole-package resolution one segment goes through: an exact name hit links (display text escaped); anything else is plain escaped code.

### `traitSection`

```kex
traitSection(e: TraitEntry, page: SourcePage, model: PackageModel) -> String
```

### `makeSection`

```kex
makeSection(e: MakeEntry, page: SourcePage, model: PackageModel) -> String
```

### `moduleSection`

```kex
moduleSection(e: ModuleEntry, page: SourcePage, model: PackageModel) -> String
```

### `functionSection`

```kex
functionSection(e: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `constantSection`

```kex
constantSection(e: ConstantEntry) -> String
```

### `functionsHtml`

```kex
functionsHtml(functions: [FunctionEntry], link: (String -> String)) -> String
```

### `functionDetail`

```kex
functionDetail(f: FunctionEntry, link: (String -> String)) -> String
```

### `signaturesHtml`

```kex
signaturesHtml(f: FunctionEntry) -> String
```

### `docHtml`

```kex
docHtml(doc: Doc) -> String
```

### `summaryParagraphs`

```kex
summaryParagraphs(summary: String) -> [String]
```

Paragraphs break on blank lines — except inside a fenced block, where a blank line is part of the code rather than the end of a paragraph.

### `groupParagraphs`

```kex
groupParagraphs(lines: [String], current: [String], accum: [String], fenced: Bool) -> [String]
```

### `paragraphHtml`

```kex
paragraphHtml(p: String) -> String
```

A summary paragraph is either prose or a fenced block that Rdoc produced from an indented (verbatim) block — the latter is highlighted code, not text to reflow.

### `inlineCode`

```kex
inlineCode(text: String) -> String
```

Minimal inline Markdown for doc prose: `code` spans. Splitting on the backtick alternates plain/code segments; an unmatched trailing backtick degrades to literal text rather than swallowing the rest of the page.

### `paramsHtml`

```kex
paramsHtml(doc: Doc, link: (String -> String)) -> String
```

### `returnsHtml`

```kex
returnsHtml(doc: Doc, link: (String -> String)) -> String
```

### `examplesHtml`

```kex
examplesHtml(doc: Doc) -> String
```

### `deprecatedHtml`

```kex
deprecatedHtml(doc: Doc) -> String
```

### `esc`

```kex
esc(s: String) -> String
```

Escape text for HTML (content and double-quoted attributes).

### `labelOf`

```kex
labelOf(model: PackageModel) -> String
```

### `pageTarget`

```kex
pageTarget(current: String) -> String
```

The page the version switcher tries first in the target version.

### `markdownLink`

```kex
markdownLink(current: String) -> String
```

Every page's raw Markdown, next to its HTML: the footer link humans see, and the address llms.txt tells models about. Index pages have none. The target is a bare sibling filename — the page already stands in the directory its `.md` was written to, so no prefix climbing is wanted.

### `slug`

```kex
slug(name: String) -> String
```

### `typeParamSuffix`

```kex
typeParamSuffix(typeParams: [String]) -> String
```

### `versionPrefix`

```kex
versionPrefix(urlPath: String) -> String
```

Relative path from a page's urlPath back to the version directory: "string" → "" (sibling), "kex/ast" → "../".

### `rootPrefix`

```kex
rootPrefix(urlPath: String) -> String
```

From the page to the site root: version dir is <pkg>/<version>/.

### `ups`

```kex
ups(n: Integer) -> String
```
