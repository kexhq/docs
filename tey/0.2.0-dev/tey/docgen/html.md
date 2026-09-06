---
package: tey
version: "0.2.0-dev"
source: tey/docgen/html.kex
title: Tey.Docgen.Html
entities:
  - { kind: module, name: "Tey.Docgen.Html" }
---

# Tey.Docgen.Html

## module `Tey.Docgen.Html`

Model records → static HTML pages, styled after kex.run's docs section (warm honey/cream palette, Fraunces/Plus Jakarta Sans/JetBrains Mono, dark code surface with tok-* syntax classes). The stylesheet lives in Tey.Docgen.Css and is written to assets/style.css by the build driver.

HTML is a sibling renderer of the Markdown one: both walk the typed PackageModel, so nothing here parses Markdown or JSON.

## function `pageHtml`


```kex
pageHtml(page, model)
```


## function `submodulesHtml`

A module family spread over several files ("Net" + net/dns.kex, net/http.kex, ...) gets one page per file, and the parent page says nothing about the rest — a reader on "Net" has no reason to believe Net.DNS or Net.Socket are documented at all. This section is the signpost: every descendant page, with the summary its module declares.


```kex
submodulesHtml(page, model)
```


## function `submoduleItem`


```kex
submoduleItem(child, page, model)
```


## function `preludePage?`


```kex
preludePage?(page, model)
```


## function `preludePageHtml`

The prelude declares nothing, so the generic page renderer leaves it blank. What it HAS is a list of imports and a comment explaining them — which is exactly the page a reader wants: what am I given for free, and where does each of those live.


```kex
preludePageHtml(page, model)
```


## function `preludeItem`


```kex
preludeItem(model, fromPath, name)
```


## function `preludeLink`

A `using X` in prelude.kex names a sibling SOURCE FILE, so the page for that file is the exact target. Going through the link index instead would lose half the list: `Map`, `Set` and `Range` are ambiguous as bare names — a module and a type both claim them — and resolve to nothing.

The file is what matches, not the title: `using Test` is test.kex, whose page is titled "Assert", and `using Env` is env.kex, titled "ENV".


```kex
preludeLink(model, fromPath, name)
```


## function `pageNamed`


```kex
pageNamed(model, name)
```


## function `pageStem`


```kex
pageStem(urlPath)
```


## function `moduleSummary`


```kex
moduleSummary(model, name)
```


## function `versionIndexHtml`

Landing page for <pkg>/<version>/index.html: every module as a card. When the package has a prelude, the cards are split by how a reader REACHES them — visible everywhere, or one `using` away — because that is the first question anyone has about a standard library.


```kex
versionIndexHtml(model)
```


## function `indexSections`


```kex
indexSections(model, top)
```


## function `preludePaths`

The prelude imports FILES, and everything a listed file declares comes with it: `using Time` is what puts `Date`, `Duration` and `Time.Period` in scope, none of which prelude.kex names. So the split is by page, not by module name.


```kex
preludePaths(model)
```


## function `preludePath`


```kex
preludePath(model, name)
```


## function `cardGrid`


```kex
cardGrid(modules, top)
```


## function `packageVersionsHtml`

<pkg>/index.html: the versions of one package, newest first — the page a reader lands on when they want a different release of what they are reading. What the ids MEAN is the package's own story: a library's own releases, the stdlib's Kex releases. The page does not need to know.


```kex
packageVersionsHtml(packageName, versions)
```


## function `versionCard`


```kex
versionCard(v)
```


## function `searchPageHtml`

<pkg>/<version>/search.html: the shareable full-page search. The modal on every page links here with ?q=<term>, so a results page is a URL rather than a state — the page reads the term back from the query string.


```kex
searchPageHtml(model)
```


## function `rootIndexHtml`

Site root index.html: one card per PACKAGE (its newest build), not per build — a reader arrives at "the docs" for a thing, and the thing is a package; its versions are one click down. Built from the accumulated versions.json entries, not just this build's model.


```kex
rootIndexHtml(versions)
```


## function `packageNames`

Package names in first-seen order of their newest entry: versions arrive newest-first from accumulateVersions, so the first entry of each package is that package's newest build.


```kex
packageNames(versions)
```


## function `packageCard`


```kex
packageCard(name, versions)
```


## function `layout`


```kex
layout(title, current, bodyContent, model)
```


## function `sidebar`

The sidebar lists one entry per source FILE, nested by module family: a page whose title is a dotted child of another page's title nests under it ("Net.DNS" under "Net", "Net.HTTP.WebSocket" under "Net.HTTP"), so a multi-file module reads as one branch instead of trailing the list in directory-walk order. The active file expands to its top-level declarations so a reader can jump straight to one. The label is the page's title (the module it declares), not the raw file name. The heading is a link: it is the package's name, and the obvious thing to want from it is the list of what the package contains — which is the version index, where the prelude split lives.


```kex
sidebar(model, current)
```


## function `sidebarEntry`


```kex
sidebarEntry(page, current, vpre, pages)
```


## function `preludeTag`

The page's own heading carries it — the sidebar is a list to scan, and a chip on 32 of 41 rows is noise rather than an answer.


```kex
preludeTag(inPrelude)
```


## function `firstModulesOfPages`

The modules that OPEN a page — their section sits at the very top, so a card for one links to the page itself rather than to an anchor that lands where the page already starts. A page whose first declaration is a type or record has no such module.


```kex
firstModulesOfPages(pages)
```


## function `moduleCard`


```kex
moduleCard(m, top)
```


## function `entitySection`


```kex
entitySection(e, page, model)
```


## function `linker`

A reference resolver scoped to one page: links resolve against the whole package index, but the href is relative to the page doing the referring.


```kex
linker(page, model)
```


## function `typeSection`


```kex
typeSection(e, page, model)
```


## function `variantsHtml`


```kex
variantsHtml(variants)
```


## function `variantItem`


```kex
variantItem(v)
```


## function `recordSection`


```kex
recordSection(e, page, model)
```


## function `fieldRow`


```kex
fieldRow(f, link)
```


## function `linkTypeText`

A type text is code with links inside it: split into identifier and punctuation segments, link the identifiers that resolve, escape the rest.


```kex
linkTypeText(link, text)
```


## function `linkType`

The whole-package resolution one segment goes through: an exact name hit links (display text escaped); anything else is plain escaped code.


```kex
linkType(links, fromPath, name)
```


## function `traitSection`


```kex
traitSection(e, page, model)
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
functionSection(e, page, model)
```


## function `constantSection`


```kex
constantSection(e)
```


## function `functionsHtml`


```kex
functionsHtml(functions, link)
```


## function `functionDetail`


```kex
functionDetail(f, link)
```


## function `signaturesHtml`


```kex
signaturesHtml(f)
```


## function `docHtml`


```kex
docHtml(doc)
```


## function `summaryParagraphs`

Paragraphs break on blank lines — except inside a fenced block, where a blank line is part of the code rather than the end of a paragraph.


```kex
summaryParagraphs(summary)
```


## function `groupParagraphs`


```kex
groupParagraphs(lines, current, accum, fenced)
```


## function `paragraphHtml`

A summary paragraph is either prose or a fenced block that Rdoc produced from an indented (verbatim) block — the latter is highlighted code, not text to reflow.


```kex
paragraphHtml(p)
```


## function `inlineCode`

Minimal inline Markdown for doc prose: `code` spans. Splitting on the backtick alternates plain/code segments; an unmatched trailing backtick degrades to literal text rather than swallowing the rest of the page.


```kex
inlineCode(text)
```


## function `paramsHtml`


```kex
paramsHtml(doc, link)
```


## function `returnsHtml`


```kex
returnsHtml(doc, link)
```


## function `examplesHtml`


```kex
examplesHtml(doc)
```


## function `deprecatedHtml`


```kex
deprecatedHtml(doc)
```


## function `esc`

Escape text for HTML (content and double-quoted attributes).


```kex
esc(s)
```


## function `labelOf`


```kex
labelOf(model)
```


## function `pageTarget`

The page the version switcher tries first in the target version.


```kex
pageTarget(current)
```


## function `markdownLink`

Every page's raw Markdown, next to its HTML: the footer link humans see, and the address llms.txt tells models about. Index pages have none. The target is a bare sibling filename — the page already stands in the directory its `.md` was written to, so no prefix climbing is wanted.


```kex
markdownLink(current)
```


## function `slug`


```kex
slug(name)
```


## function `typeParamSuffix`


```kex
typeParamSuffix(typeParams)
```


## function `versionPrefix`

Relative path from a page's urlPath back to the version directory: "string" → "" (sibling), "kex/ast" → "../".


```kex
versionPrefix(urlPath)
```


## function `rootPrefix`

From the page to the site root: version dir is <pkg>/<version>/.


```kex
rootPrefix(urlPath)
```


## function `ups`


```kex
ups(n)
```

