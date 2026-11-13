---
package: tey
version: "0.2.1-dev"
source: tey/docgen/html.kex
title: Tey.Docgen.Html
entities:
  - { kind: module, name: "Tey.Docgen.Html" }
---

# Tey.Docgen.Html

Model records → static HTML pages, styled after kex.run's docs section (warm honey/cream palette, Fraunces/Plus Jakarta Sans/JetBrains Mono, dark code surface with tok-* syntax classes). The stylesheet lives in Tey.Docgen.Css and is written to assets/style.css by the build driver.

HTML is a sibling renderer of the Markdown one: both walk the typed PackageModel, so nothing here parses Markdown or JSON.

## module `Tey.Docgen.Html`

### `pageHtml` (foul)

```kex
pageHtml(page: SourcePage, model: PackageModel) -> String
```

### `pageBodyHtml` (foul)

```kex
pageBodyHtml(page: SourcePage, model: PackageModel, heading: Bool) -> String
```

A page's content without the chrome — what `pageHtml` wraps in the layout, and what a host site (the fragments output) wraps in its own. `heading` is false when the host renders the title itself.

### `submodulesHtml` (foul)

```kex
submodulesHtml(page: SourcePage, model: PackageModel) -> String
```

A module family spread over several files ("Net" + net/dns.kex, net/http.kex, ...) gets one page per file, and the parent page says nothing about the rest — a reader on "Net" has no reason to believe Net.DNS or Net.Socket are documented at all. This section is the signpost: every descendant page, with the summary its module declares.

### `submoduleItem` (foul)

```kex
submoduleItem(child: SourcePage, page: SourcePage, model: PackageModel) -> String
```

### `preludePage?` (foul)

```kex
preludePage?(page: SourcePage, model: PackageModel) -> Bool
```

### `preludeBodyHtml` (foul)

```kex
preludeBodyHtml(page: SourcePage, model: PackageModel, heading: Bool) -> String
```

The prelude declares nothing, so the generic page renderer leaves it blank. What it HAS is a list of imports and a comment explaining them — which is exactly the page a reader wants: what am I given for free, and where does each of those live.

### `preludeItem` (foul)

```kex
preludeItem(model: PackageModel, fromPath: String, name: String) -> String
```

### `preludeLink` (foul)

```kex
preludeLink(model: PackageModel, fromPath: String, name: String) -> String
```

A `using X` in prelude.kex names a sibling SOURCE FILE, so the page for that file is the exact target. Going through the link index instead would lose half the list: `Map`, `Set` and `Range` are ambiguous as bare names — a module and a type both claim them — and resolve to nothing.

The file is what matches, not the title: `using Test` is test.kex, whose page is titled "Assert", and `using Env` is env.kex, titled "ENV".

### `pageNamed` (foul)

```kex
pageNamed(model: PackageModel, name: String) -> SourcePage?
```

### `pageStem` (foul)

```kex
pageStem(urlPath: String) -> String
```

### `moduleSummary` (foul)

```kex
moduleSummary(model: PackageModel, name: String) -> String
```

### `versionIndexHtml` (foul)

```kex
versionIndexHtml(model: PackageModel) -> String
```

Landing page for <pkg>/<version>/index.html: every module as a card. When the package has a prelude, the cards are split by how a reader REACHES them — visible everywhere, or one `using` away — because that is the first question anyone has about a standard library.

### `versionIndexBodyHtml` (foul)

```kex
versionIndexBodyHtml(model: PackageModel, heading: Bool) -> String
```

### `cardModules` (foul)

```kex
cardModules(model: PackageModel) -> [Tey.Docgen.Model.ModuleIndexEntry]
```

The modules worth a card. `Int8`, `Float32` and friends are modules holding two constants each, declared in number.kex beside Integer and Float: listing them beside `Net` and `FS` made the index read as if the stdlib had a dozen integer libraries. They are on their file's page.

### `constantsOnly?` (foul)

```kex
constantsOnly?(model: PackageModel, m: Tey.Docgen.Model.ModuleIndexEntry) -> Bool
```

### `indexSections` (foul)

```kex
indexSections(model: PackageModel, top: [String]) -> String
```

### `preludePaths` (foul)

```kex
preludePaths(model: PackageModel) -> [String]
```

The prelude imports FILES, and everything a listed file declares comes with it: `using Time` is what puts `Date`, `Duration` and `Time.Period` in scope, none of which prelude.kex names. So the split is by page, not by module name.

### `preludePath` (foul)

```kex
preludePath(model: PackageModel, name: String) -> [String]
```

### `cardGrid` (foul)

```kex
cardGrid(modules: [Tey.Docgen.Model.ModuleIndexEntry], top: [String]) -> String
```

### `latestVersion` (foul)

```kex
latestVersion(packageName: String, versions: [VersionEntry]) -> VersionEntry?
```

The version a reader gets by default: the highest release by semantic version, never an unreleased `-dev` build while a release exists. versions.json is in BUILD order, newest build first, and tools/build-docs.sh builds the working tree last, so its first entry is usually the -dev build rather than the latest release.

### `versionsNewestFirst` (foul)

```kex
versionsNewestFirst(packageName: String, versions: [VersionEntry]) -> [VersionEntry]
```

One package's versions, highest first by semantic version.

### `packageRedirectHtml` (foul)

```kex
packageRedirectHtml(packageName: String, versions: [VersionEntry]) -> String
```

<pkg>/index.html: straight on to the latest version, so a link to a package lands on its reference rather than on a list of builds. Every other version stays one click away, at versions.html.

### `packageVersionsHtml` (foul)

```kex
packageVersionsHtml(packageName: String, versions: [VersionEntry]) -> String
```

<pkg>/versions.html: the versions of one package, newest first — the page a reader lands on when they want a different release of what they are reading. What the ids MEAN is the package's own story: a library's own releases, the stdlib's Kex releases. The page does not need to know.

### `versionCard` (foul)

```kex
versionCard(v: VersionEntry) -> String
```

### `searchPageHtml` (foul)

```kex
searchPageHtml(model: PackageModel) -> String
```

<pkg>/<version>/search.html: the shareable full-page search. The modal on every page links here with ?q=<term>, so a results page is a URL rather than a state — the page reads the term back from the query string.

### `rootIndexHtml` (foul)

```kex
rootIndexHtml(versions: [VersionEntry]) -> String
```

Site root index.html: one card per PACKAGE (its newest build), not per build — a reader arrives at "the docs" for a thing, and the thing is a package; its versions are one click down. Built from the accumulated versions.json entries, not just this build's model.

### `packageNames` (foul)

```kex
packageNames(versions: [VersionEntry]) -> [String]
```

Package names in first-seen order of their newest entry: versions arrive newest-first from accumulateVersions, so the first entry of each package is that package's newest build.

### `packageCard` (foul)

```kex
packageCard(name: String, versions: [VersionEntry]) -> String
```

### `chrome` (foul)

```kex
chrome(title: String, root: String, script: Bool, nav: String, content: String) -> String
```

What every full page shares: the <head>, and the top bar with the brand on the left and `nav` on the right. `root` is the relative path back to the site root, and `script` says whether the page loads assets/site.js.

### `backLink` (foul)

```kex
backLink(href: String, text: String) -> String
```

### `layout` (foul)

```kex
layout(title: String, current: String, bodyContent: String, model: PackageModel) -> String
```

### `sidebar` (foul)

```kex
sidebar(model: PackageModel, current: String) -> String
```

The sidebar lists one entry per source FILE, nested by module family: a page whose title is a dotted child of another page's title nests under it ("Net.DNS" under "Net", "Net.HTTP.WebSocket" under "Net.HTTP"), so a multi-file module reads as one branch instead of trailing the list in directory-walk order. The active file expands to its top-level declarations so a reader can jump straight to one. The label is the page's title (the module it declares), not the raw file name. The heading is a link: it is the package's name, and the obvious thing to want from it is the list of what the package contains — which is the version index, where the prelude split lives.

### `sidebarEntry` (foul)

```kex
sidebarEntry(page: SourcePage, current: String, vpre: String, pages: [SourcePage]) -> String
```

### `preludeTag` (foul)

```kex
preludeTag(inPrelude: Bool) -> String
```

The page's own heading carries it — the sidebar is a list to scan, and a chip on 32 of 41 rows is noise rather than an answer.

### `firstModulesOfPages` (foul)

```kex
firstModulesOfPages(pages: [SourcePage]) -> [String]
```

The modules that OPEN a page — their section sits at the very top, so a card for one links to the page itself rather than to an anchor that lands where the page already starts. A page whose first declaration is a type or record has no such module.

### `moduleCard` (foul)

```kex
moduleCard(m: Tey.Docgen.Model.ModuleIndexEntry, top: Bool) -> String
```

### `entitiesHtml` (foul)

```kex
entitiesHtml(entities: [Entity], page: SourcePage, model: PackageModel) -> String
```

A page's declarations in source order — except that a type's `make` blocks on the same page are pulled into the type's own section, so `List` reads as one thing (the type, then its functions, grouped by the receiver they need) rather than a type followed by three loose "make" sections.

### `sectionEntities` (foul)

```kex
sectionEntities(entities: [Entity]) -> [Entity]
```

The declarations that get a section of their own: everything except the make blocks folded into a type or trait on the same page.

### `declaredTypeNames` (foul)

```kex
declaredTypeNames(entities: [Entity]) -> [String]
```

### `declaredTraitNames` (foul)

```kex
declaredTraitNames(entities: [Entity]) -> [String]
```

A `make <Trait>` beside its trait is the trait's defaults, rendered in the trait's own section (Relations.traitMethods).

### `makesFor` (foul)

```kex
makesFor(entities: [Entity], name: String) -> [MakeEntry]
```

### `entitySection` (foul)

```kex
entitySection(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `linker` (foul)

```kex
linker(page: SourcePage, model: PackageModel) -> String -> String
```

A reference resolver scoped to one page: links resolve against the whole package index, but the href is relative to the page doing the referring.

### `hrefer` (foul)

```kex
hrefer(page: SourcePage, model: PackageModel) -> String -> String
```

The bare href for a name, or "" — what linked highlighting and linked prose both need.

### `typeSection` (foul)

```kex
typeSection(e: TypeEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `variantsHtml` (foul)

```kex
variantsHtml(variants: [VariantEntry]?) -> String
```

Only real constructors: an abstract type (`type List<X>`) has none, and a "Variants: (abstract)" heading told the reader nothing.

### `variantItem` (foul)

```kex
variantItem(v: VariantEntry) -> String
```

### `recordSection` (foul)

```kex
recordSection(e: RecordEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `typeBodyHtml` (foul)

```kex
typeBodyHtml(name: String, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

Everything about a type beyond its declaration: the traits it implements (from every file), its functions grouped by receiver, the functions it gets from those traits for free, and the other modules that add functions to it.

### `companionIndexHtml` (foul)

```kex
companionIndexHtml(name: String, page: SourcePage) -> String
```

`Set.from` and `Set.empty` belong to the module that shares the type's name, which is a section of its own further down the page — after every function of every type the file declares. They are how a reader gets a `Set` in the first place, so the type's summary lists them first.

### `modulesIn` (foul)

```kex
modulesIn(entities: [Entity]) -> [ModuleEntry]
```

### `moduleAndNested` (foul)

```kex
moduleAndNested(e: Entity) -> [ModuleEntry]
```

### `receiverOrder` (foul)

```kex
receiverOrder(makes: [MakeEntry], name: String) -> [MakeEntry]
```

### `makeGroupTitle` (foul)

```kex
makeGroupTitle(m: MakeEntry, base: String) -> String
```

"Functions" for the plain receiver, "On `[Number]`" for a specialised one.

### `makeGroupHtml` (foul)

```kex
makeGroupHtml(m: MakeEntry, base: String, page: SourcePage, model: PackageModel) -> String
```

### `indexed?` (foul)

```kex
indexed?(functions: [FunctionEntry]) -> Bool
```

A long member list is read twice: first to find out what there is, then to learn one function. Fifty full entries answer only the second, a screen at a time, so a group this long opens with its index — every name with the first sentence of its doc, linked to the entry below. A short group is its own index.

### `indexRowsOf` (foul)

```kex
indexRowsOf(functions: [FunctionEntry], owner: String) -> [IndexRow]
```

### `indexRowOf` (foul)

```kex
indexRowOf(overloads: [FunctionEntry], href: String, name: String) -> IndexRow
```

Overloads share a row; the first of them with something to say says it.

### `indexHtml` (foul)

```kex
indexHtml(rows: [IndexRow], klass: String) -> String
```

### `makeIndexHtml` (foul)

```kex
makeIndexHtml(m: MakeEntry, base: String) -> String
```

### `summaryHtml` (foul)

```kex
summaryHtml(lists: String) -> String
```

Everything a declaration offers before any of it in full: its own members, what its traits give it, what other modules add.

### `genericReceiver?` (foul)

```kex
genericReceiver?(target: String, base: String) -> Bool
```

`[X]` and `FileHandle<R, W>` are the type itself; `[Number]` is not.

### `implementsHtml` (foul)

```kex
implementsHtml(name: String, page: SourcePage, model: PackageModel) -> String
```

Every trait the type implements, wherever the implementing make block lives — algebra.kex is what makes Integer a Monoid, and number.kex's reader should still learn that.

### `traitLinks` (foul)

```kex
traitLinks(traits: [String], page: SourcePage, model: PackageModel) -> String
```

### `providedHtml` (foul)

```kex
providedHtml(name: String, page: SourcePage, model: PackageModel) -> String
```

The trait functions a type gets without writing them: a trait's provided functions, minus any the type defines itself somewhere. This is the answer to "where does `List.eachIndexed` come from?".

### `providedFromHtml` (foul)

```kex
providedFromHtml(written: String, own: [String], page: SourcePage, model: PackageModel) -> String
```

### `elsewhereHtml` (foul)

```kex
elsewhereHtml(name: String, page: SourcePage, model: PackageModel) -> String
```

Other modules that add functions to this type: `make Integer` in time.kex is where `5.seconds` comes from.

### `fieldRow` (foul)

```kex
fieldRow(f: Tey.Docgen.Model.FieldEntry, link: (String -> String)) -> String
```

### `linkTypeText` (foul)

```kex
linkTypeText(link: (String -> String), text: String) -> String
```

A type text is code with links inside it: split into identifier and punctuation segments, link the identifiers that resolve, escape the rest.

### `linkType` (foul)

```kex
linkType(links: [LinkEntry], fromPath: String, name: String) -> String
```

The whole-package resolution one segment goes through: an exact name hit links (display text escaped); anything else is plain escaped code.

### `traitSection` (foul)

```kex
traitSection(e: TraitEntry, page: SourcePage, model: PackageModel) -> String
```

A trait: what an implementor must write, what it then gets for free, and who implements it.

### `traitIndexHtml` (foul)

```kex
traitIndexHtml(title: String, functions: [FunctionEntry], owner: String) -> String
```

### `implementedByHtml` (foul)

```kex
implementedByHtml(e: TraitEntry, page: SourcePage, model: PackageModel) -> String
```

### `makeSection` (foul)

```kex
makeSection(e: MakeEntry, page: SourcePage, model: PackageModel) -> String
```

A make block with no type declaration on its page. On the type's home page (string.kex for String) it carries everything the type section would; elsewhere it points home.

### `firstMakeOnPage?` (foul)

```kex
firstMakeOnPage?(facts: Tey.Docgen.Model.TypeFacts, e: MakeEntry, page: SourcePage) -> Bool
```

### `homeNote` (foul)

```kex
homeNote(base: String, facts: Tey.Docgen.Model.TypeFacts?, page: SourcePage, model: PackageModel) -> String
```

### `moduleSection` (foul)

```kex
moduleSection(e: ModuleEntry, page: SourcePage, model: PackageModel) -> String
```

A module's own functions and constants are its API, listed under it (h3) like a type's functions. Types, traits and nested modules it declares stand as sections of their own after that.

### `namespaceOnly?` (foul)

```kex
namespaceOnly?(e: ModuleEntry, page: SourcePage) -> Bool
```

A file that opens with a bare `module Data` and declares `Set` inside it is the page "Data.Set": the outer module is only the namespace the file lives in. Its comment is the page's introduction, and a "module Data" heading over it names something the page is not about.

### `memberIndexRows` (foul)

```kex
memberIndexRows(members: [Entity], prefix: String) -> [IndexRow]
```

One row per member name, shown with `prefix` in front of it.

### `memberIndexRow` (foul)

```kex
memberIndexRow(same: [Entity], name: String) -> IndexRow
```

### `foulEntity?` (foul)

```kex
foulEntity?(e: Entity) -> Bool
```

### `foulTag` (foul)

```kex
foulTag(isFoul: Bool) -> String
```

Purity is half of what a Kex signature says: a foul function may touch the outside world, and only foul code may call it. The chip says so wherever the function is named.

### `summaryOf` (foul)

```kex
summaryOf(e: Entity) -> String
```

### `memberEntity?` (foul)

```kex
memberEntity?(e: Entity) -> Bool
```

### `moduleMemberHtml` (foul)

```kex
moduleMemberHtml(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `functionSection` (foul)

```kex
functionSection(e: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `constantSection` (foul)

```kex
constantSection(e: ConstantEntry, page: SourcePage, model: PackageModel) -> String
```

### `functionsHtml` (foul)

```kex
functionsHtml(functions: [FunctionEntry], owner: String, level: Integer, implements: [String], page: SourcePage, model: PackageModel) -> String
```

Members of a trait or make block, one heading per NAME: overloads (`count` and `count(pred)`) are one function with several signatures, not two unrelated entries. `owner` scopes the anchors; `implements` lets a member that fulfils a trait function say which trait.

### `functionGroupHtml` (foul)

```kex
functionGroupHtml(fs: [FunctionEntry], name: String, owner: String, level: Integer, implements: [String], page: SourcePage, model: PackageModel) -> String
```

### `memberHeadHtml` (foul)

```kex
memberHeadHtml(heading: String, signature: String, name: String) -> String
```

The head of a member's card: its signature, with the heading's chips beside it. They share a row rather than one lying over the other, so a long signature scrolls in the room it has instead of running under them. (The permalink is the exception a stylesheet may make: shown only under the pointer, it can sit in the corner and take no room.) A member the source gives no type — an untyped constant, a function nobody annotated — is headed the same way by its name alone, so every card on a page has the same shape.

### `traitTag` (foul)

```kex
traitTag(name: String, implements: [String], page: SourcePage, model: PackageModel) -> String
```

"from Enumerable": this member is the type's own version of a function the trait declares, linked to the trait's description of it.

### `overloadHtml` (foul)

```kex
overloadHtml(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

One overload: its signature first (what you call), then the prose.

### `overloadBodyHtml` (foul)

```kex
overloadBodyHtml(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `signaturesHtml` (foul)

```kex
signaturesHtml(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `signatureLine` (foul)

```kex
signatureLine(html: String) -> String
```

Each signature is an element of its own, one per line, so a stylesheet can treat an overload as a unit.

### `namedFirst` (foul)

```kex
namedFirst(html: String, name: String) -> String
```

A signature opens with the name of what it declares, and the highlighter does not know that: it marks the name as a function only where a parameter list follows (`count : Integer` came out plain beside `count(pred)`), and a function called `from` or `in` as the keyword it is spelled like. Here the opening name is always marked as the name.

### `permalinkHtml` (foul)

```kex
permalinkHtml(anchor: String) -> String
```

The address of a declaration or member, as a control beside its heading: a plain link to its own anchor, which the page script turns into "copy this address".

### `docHtml` (foul)

```kex
docHtml(doc: Doc, page: SourcePage, model: PackageModel) -> String
```

### `entityDocHtml` (foul)

```kex
entityDocHtml(doc: Doc, page: SourcePage, model: PackageModel) -> String
```

A declaration's doc: prose, then its examples and any deprecation — a type's @example is as much a part of it as a function's.

### `plainDocHtml` (foul)

```kex
plainDocHtml(doc: Doc) -> String
```

Unlinked: for prose with no page to resolve against (the prelude comment, card summaries).

### `summaryParagraphs` (foul)

```kex
summaryParagraphs(summary: String) -> [String]
```

Paragraphs break on blank lines — except inside a fenced block, where a blank line is part of the code rather than the end of a paragraph.

### `groupParagraphs` (foul)

```kex
groupParagraphs(lines: [String], current: [String], accum: [String], fenced: Bool) -> [String]
```

### `paragraphHtml` (foul)

```kex
paragraphHtml(p: String, hrefOf: (String -> String)) -> String
```

A summary paragraph is prose, a fenced block that Rdoc produced from an indented (verbatim) block, or a bullet list — each rendered as what it is rather than reflowed into one paragraph.

### `bulletLine?` (foul)

```kex
bulletLine?(line: String) -> Bool
```

### `bulletListHtml` (foul)

```kex
bulletListHtml(lines: [String], hrefOf: (String -> String)) -> String
```

`- item` lines, with indented continuation lines folded into the item above them.

### `inlineCode` (foul)

```kex
inlineCode(text: String) -> String
```

Minimal inline Markdown for doc prose: `code` spans. Splitting on the backtick alternates plain/code segments; an unmatched trailing backtick degrades to literal text rather than swallowing the rest of the page.

### `linkedInline` (foul)

```kex
linkedInline(text: String, hrefOf: (String -> String)) -> String
```

The same, with a code span that names something documented — a type, a trait, `List.map` — linked to it.

### `linkableCode?` (foul)

```kex
linkableCode?(code: String) -> Bool
```

Only a bare name is a reference: `List`, `FS.Path`, `List.map`. A code span with spaces or parentheses is an expression, not a name.

### `firstSentence` (foul)

```kex
firstSentence(text: String) -> String
```

### `paramsHtml` (foul)

```kex
paramsHtml(f: FunctionEntry, link: (String -> String), page: SourcePage, model: PackageModel) -> String
```

Each parameter's meaning. Its type is in the signature right above, so it is repeated here only when there is no signature to read it from.

### `returnsHtml` (foul)

```kex
returnsHtml(f: FunctionEntry, link: (String -> String), page: SourcePage, model: PackageModel) -> String
```

The signature already states the result type, so when there is one "Returns" says only what the value MEANS. A @return tag whose type disagrees would otherwise put two answers side by side (`min : X?` above "Returns: Number?").

### `examplesHtml` (foul)

```kex
examplesHtml(doc: Doc) -> String
```

### `codeBlockHtml` (foul)

```kex
codeBlockHtml(source: String) -> String
```

Kex source as a highlighted block, with the control that copies it. The control is inert markup until the page script enables it, so it stays hidden where there is no script to act on it.

### `deprecatedHtml` (foul)

```kex
deprecatedHtml(doc: Doc) -> String
```

### `esc` (foul)

```kex
esc(s: String) -> String
```

Escape text for HTML (content and double-quoted attributes).

### `labelOf` (foul)

```kex
labelOf(model: PackageModel) -> String
```

### `pageTarget` (foul)

```kex
pageTarget(current: String) -> String
```

The page the version switcher tries first in the target version.

### `markdownLink` (foul)

```kex
markdownLink(current: String) -> String
```

Every page's raw Markdown, next to its HTML: the footer link humans see, and the address llms.txt tells models about. Index pages have none. The target is a bare sibling filename — the page already stands in the directory its `.md` was written to, so no prefix climbing is wanted.

### `slug` (foul)

```kex
slug(name: String) -> String
```

### `typeParamSuffix` (foul)

```kex
typeParamSuffix(typeParams: [String]) -> String
```

### `versionPrefix` (foul)

```kex
versionPrefix(urlPath: String) -> String
```

Relative path from a page's urlPath back to the version directory: "string" → "" (sibling), "kex/ast" → "../".

### `rootPrefix` (foul)

```kex
rootPrefix(urlPath: String) -> String
```

From the page to the site root: version dir is <pkg>/<version>/.

### `ups` (foul)

```kex
ups(n: Integer) -> String
```

## record `IndexRow`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string)
  - `href` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string)
  - `summary` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string)
  - `isFoul` : [Bool](../../../../prelude/0.4.0-rc.3-dev/truthyable.md#make-bool) (optional)


