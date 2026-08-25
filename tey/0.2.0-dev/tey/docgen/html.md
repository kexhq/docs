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

── Public API ───────────────────────────────────────────────────────────


```kex
pageHtml(page, model)
```


## function `versionIndexHtml`

Landing page for <pkg>/<version>/index.html: every module as a card.


```kex
versionIndexHtml(model)
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

── Layout ───────────────────────────────────────────────────────────────


```kex
layout(title, current, bodyContent, model)
```


## function `sidebar`

The sidebar lists one entry per source FILE, in scan order. The active file expands to its top-level declarations so a reader can jump straight to one. The label is the page's title (the module it declares), not the raw file name.


```kex
sidebar(model, current)
```


## function `sidebarEntry`


```kex
sidebarEntry(page, current, vpre)
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

── Entity sections ──────────────────────────────────────────────────────


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

── Functions inside traits, makes, modules ──────────────────────────────


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

── Doc fragments ────────────────────────────────────────────────────────


```kex
docHtml(doc)
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

── Shared helpers ───────────────────────────────────────────────────────

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

