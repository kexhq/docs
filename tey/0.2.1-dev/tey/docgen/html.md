---
package: tey
version: "0.2.1-dev"
source: tey/docgen/html.kex
title: Tey.Docgen.Html
entities:
  - { kind: module, name: "Tey.Docgen.Html" }
---

# Tey.Docgen.Html

Renders the documentation model as static HTML pages, styled after the docs on kex.run. The stylesheet is in `Tey.Docgen.Css`, and the build writes it to assets/style.css.

Like `Tey.Docgen.Markdown`, it walks the typed `PackageModel`, so nothing here parses Markdown or JSON.

## module `Tey.Docgen.Html`

### `pageHtml`

```kex
pageHtml(page: SourcePage, model: PackageModel) -> String
```

### `pageBodyHtml`

```kex
pageBodyHtml(page: SourcePage, model: PackageModel, heading: Bool) -> String
```

Returns a page's content without the surrounding layout. `pageHtml` wraps it in the layout, and a host site using the fragments output wraps it in its own. `heading` is `false` when the host renders the title itself.

### `submodulesHtml`

```kex
submodulesHtml(page: SourcePage, model: PackageModel) -> String
```

Lists the pages nested under this one, each with its module's summary.

A module family spread over several files (net.kex, net/dns.kex, net/http.kex, ...) gets one page per file, and without this list the "Net" page would not show that Net.DNS or Net.Socket exist.

### `submoduleItem`

```kex
submoduleItem(child: SourcePage, page: SourcePage, model: PackageModel) -> String
```

### `preludePage?`

```kex
preludePage?(page: SourcePage, model: PackageModel) -> Bool
```

### `preludeBodyHtml`

```kex
preludeBodyHtml(page: SourcePage, model: PackageModel, heading: Bool) -> String
```

Renders the prelude's page: its comment and the list of files it imports, each linked to its page. The prelude declares nothing, so the usual page renderer would leave it blank.

### `preludeItem`

```kex
preludeItem(model: PackageModel, fromPath: String, name: String) -> String
```

### `preludeLink`

```kex
preludeLink(model: PackageModel, fromPath: String, name: String) -> String
```

Links a `using X` line of prelude.kex to the page of the file it names.

It matches the file, not the link index or the page title: in the index, `Map`, `Set` and `Range` are each claimed by a module and a type, so they would not link, and `using Test` is test.kex, whose page is titled "Assert".

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

Renders <pkg>/<version>/index.html, with a card for every module. When the package has a prelude, the cards are split into the modules it makes visible and those that need a `using`.

### `versionIndexBodyHtml`

```kex
versionIndexBodyHtml(model: PackageModel, heading: Bool) -> String
```

### `cardModules`

```kex
cardModules(model: PackageModel) -> [Tey.Docgen.Model.ModuleIndexEntry]
```

Returns the modules that get a card. Modules holding only constants are left out (`Int8`, `Float32` and the like, which are on number.kex's page), as are modules declared in more than one place.

### `constantsOnly?`

```kex
constantsOnly?(model: PackageModel, m: Tey.Docgen.Model.ModuleIndexEntry) -> Bool
```

### `indexSections`

```kex
indexSections(model: PackageModel, top: [String]) -> String
```

### `preludePaths`

```kex
preludePaths(model: PackageModel) -> [String]
```

Returns the pages of the files the prelude imports.

The prelude imports files, and everything in a file comes with it: `using Time` is what brings `Date`, `Duration` and `Time.Period` into scope, though prelude.kex names none of them. So the split is by page, not by module name.

### `preludePath`

```kex
preludePath(model: PackageModel, name: String) -> [String]
```

### `cardGrid`

```kex
cardGrid(modules: [Tey.Docgen.Model.ModuleIndexEntry], top: [String]) -> String
```

### `latestVersion`

```kex
latestVersion(packageName: String, versions: [VersionEntry]) -> VersionEntry?
```

Returns the version a reader gets by default: the highest release by semantic version, and a `-dev` build only when there is no release.

versions.json is in build order, newest first, and tools/build-docs.sh builds the working tree last, so its first entry is usually the `-dev` build.

### `versionsNewestFirst`

```kex
versionsNewestFirst(packageName: String, versions: [VersionEntry]) -> [VersionEntry]
```

Returns one package's versions, highest semantic version first.

### `packageRedirectHtml`

```kex
packageRedirectHtml(packageName: String, versions: [VersionEntry]) -> String
```

Renders <pkg>/index.html, which redirects to the latest version, or lists the versions when there is no release to pick. The other versions are listed at versions.html.

### `packageVersionsHtml`

```kex
packageVersionsHtml(packageName: String, versions: [VersionEntry]) -> String
```

Renders <pkg>/versions.html, listing one package's versions, newest first. A version id is whatever the package uses: a library's own releases, or the Kex release for the stdlib.

### `versionCard`

```kex
versionCard(v: VersionEntry) -> String
```

### `searchPageHtml`

```kex
searchPageHtml(model: PackageModel) -> String
```

Renders <pkg>/<version>/search.html, the full-page search. The search box on every page links here with `?q=<term>`, so a page of results has a URL that can be shared.

### `rootIndexHtml`

```kex
rootIndexHtml(versions: [VersionEntry]) -> String
```

Renders the site's root index.html, with one card per package for its newest build. It is built from every entry in versions.json, so it lists packages from earlier builds too.

### `packageNames`

```kex
packageNames(versions: [VersionEntry]) -> [String]
```

Returns the package names in the order they first appear. Versions come newest first from `accumulateVersions`, so that is the order of each package's newest build.

### `packageCard`

```kex
packageCard(name: String, versions: [VersionEntry]) -> String
```

### `chrome`

```kex
chrome(title: String, root: String, script: Bool, nav: String, content: String) -> String
```

Wraps `content` in what every full page shares: the `<head>` and the top bar, with the brand on the left and `nav` on the right. `root` is the relative path to the site root, and `script` says whether the page loads assets/site.js.

### `backLink`

```kex
backLink(href: String, text: String) -> String
```

### `layout`

```kex
layout(title: String, current: String, bodyContent: String, model: PackageModel) -> String
```

### `sidebar`

```kex
sidebar(model: PackageModel, current: String) -> String
```

Renders the sidebar: one entry per source file, labelled with the page's title and nested by module family.

A page whose title extends another page's title nests under it ("Net.DNS" under "Net", "Net.HTTP.WebSocket" under "Net.HTTP"), so a module spread over several files reads as one branch. The current page expands to its top-level declarations. The heading is the package name and links to the version index.

### `sidebarEntry`

```kex
sidebarEntry(page: SourcePage, current: String, vpre: String, pages: [SourcePage]) -> String
```

### `preludeTag`

```kex
preludeTag(inPrelude: Bool) -> String
```

Returns the "prelude" tag for a page's heading. The sidebar does not show it, since most rows would carry it.

### `firstModulesOfPages`

```kex
firstModulesOfPages(pages: [SourcePage]) -> [String]
```

Returns the modules that open a page. A card for one links to the page itself rather than to an anchor at its top. A page whose first declaration is a type or record has none.

### `moduleCard`

```kex
moduleCard(m: Tey.Docgen.Model.ModuleIndexEntry, top: Bool) -> String
```

### `entitiesHtml`

```kex
entitiesHtml(entities: [Entity], page: SourcePage, model: PackageModel) -> String
```

Renders a page's declarations in source order, except that make blocks for a type on the same page go into the type's section. `List` then reads as the type followed by its functions, grouped by receiver.

### `sectionEntities`

```kex
sectionEntities(entities: [Entity]) -> [Entity]
```

Returns the declarations that get a section of their own: all but the make blocks folded into a type or trait on the same page.

### `declaredTypeNames`

```kex
declaredTypeNames(entities: [Entity]) -> [String]
```

### `declaredTraitNames`

```kex
declaredTraitNames(entities: [Entity]) -> [String]
```

Returns the names of the traits declared among `entities`. A `make <Trait>` beside its trait holds the trait's defaults and is rendered in the trait's section (`Relations.traitMethods`).

### `makesFor`

```kex
makesFor(entities: [Entity], name: String) -> [MakeEntry]
```

### `entitySection`

```kex
entitySection(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `linker`

```kex
linker(page: SourcePage, model: PackageModel) -> String -> String
```

Returns a function that links a name from this page. Names resolve against the whole package, and hrefs are relative to this page.

### `hrefer`

```kex
hrefer(page: SourcePage, model: PackageModel) -> String -> String
```

Returns a function giving the href for a name from this page, or `""` when it does not resolve. Linked highlighting and linked prose use it.

### `typeSection`

```kex
typeSection(e: TypeEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `variantsHtml`

```kex
variantsHtml(variants: [VariantEntry]?) -> String
```

Renders a type's constructors. An abstract type (`type List<X>`) has none and gets no section.

### `variantItem`

```kex
variantItem(v: VariantEntry) -> String
```

### `recordSection`

```kex
recordSection(e: RecordEntry, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

### `typeBodyHtml`

```kex
typeBodyHtml(name: String, makes: [MakeEntry], page: SourcePage, model: PackageModel) -> String
```

Renders everything about a type beyond its declaration: the traits it implements (from every file), its functions grouped by receiver, the functions those traits provide, and the other modules that add functions to it.

### `companionIndexHtml`

```kex
companionIndexHtml(name: String, page: SourcePage) -> String
```

Lists the functions of the module named like the type, such as `Set.from` and `Set.empty`, at the top of the type's summary. That module's own section comes much further down the page, and its functions are how a reader gets a `Set` in the first place.

### `modulesIn`

```kex
modulesIn(entities: [Entity]) -> [ModuleEntry]
```

### `moduleAndNested`

```kex
moduleAndNested(e: Entity) -> [ModuleEntry]
```

### `receiverOrder`

```kex
receiverOrder(makes: [MakeEntry], name: String) -> [MakeEntry]
```

### `makeGroupTitle`

```kex
makeGroupTitle(m: MakeEntry, base: String) -> String
```

Returns a make group's title: "Functions" for the plain receiver, "On `[Number]`" for a specialised one.

### `makeGroupHtml`

```kex
makeGroupHtml(m: MakeEntry, base: String, page: SourcePage, model: PackageModel) -> String
```

### `indexed?`

```kex
indexed?(functions: [FunctionEntry]) -> Bool
```

Returns `true` when a group has six or more function names and so opens with an index: each name with the first sentence of its doc, linked to its entry. A shorter group needs no index.

### `indexRowsOf`

```kex
indexRowsOf(functions: [FunctionEntry], owner: String) -> [IndexRow]
```

### `indexRowOf`

```kex
indexRowOf(overloads: [FunctionEntry], href: String, name: String) -> IndexRow
```

Builds one index row for a name's overloads, using the first doc summary among them.

### `indexHtml`

```kex
indexHtml(rows: [IndexRow], klass: String) -> String
```

### `makeIndexHtml`

```kex
makeIndexHtml(m: MakeEntry, base: String) -> String
```

### `summaryHtml`

```kex
summaryHtml(lists: String) -> String
```

Wraps the index lists that come before a declaration's full entries: its own members, what its traits provide, and what other modules add.

### `genericReceiver?`

```kex
genericReceiver?(target: String, base: String) -> Bool
```

Returns `true` when `target` is the type itself with type parameters, such as `[X]` or `FileHandle<R, W>`, and not a specialisation such as `[Number]`.

### `implementsHtml`

```kex
implementsHtml(name: String, page: SourcePage, model: PackageModel) -> String
```

Renders every trait the type implements, wherever the make block is: algebra.kex makes `Integer` a `Monoid`, and number.kex's page says so.

### `traitLinks`

```kex
traitLinks(traits: [String], page: SourcePage, model: PackageModel) -> String
```

### `providedHtml`

```kex
providedHtml(name: String, page: SourcePage, model: PackageModel) -> String
```

Renders the trait functions a type gets without defining them: each trait's provided functions, minus any the type defines itself. This is where a reader finds where `List.eachIndexed` comes from.

### `providedFromHtml`

```kex
providedFromHtml(written: String, own: [String], page: SourcePage, model: PackageModel) -> String
```

### `elsewhereHtml`

```kex
elsewhereHtml(name: String, page: SourcePage, model: PackageModel) -> String
```

Renders the other modules that add functions to this type, such as `make Integer` in period.kex, which provides `1.month`.

### `fieldRow`

```kex
fieldRow(f: Tey.Docgen.Model.FieldEntry, link: (String -> String)) -> String
```

### `linkTypeText`

```kex
linkTypeText(link: (String -> String), text: String) -> String
```

Renders type text as code, linking each identifier that resolves and escaping the rest.

### `linkType`

```kex
linkType(links: [LinkEntry], fromPath: String, name: String) -> String
```

Links one type segment when it names something in the package, and otherwise escapes it as plain code.

### `traitSection`

```kex
traitSection(e: TraitEntry, page: SourcePage, model: PackageModel) -> String
```

Renders a trait: the functions an implementor must write, the ones it then gets, and the types that implement it.

### `traitIndexHtml`

```kex
traitIndexHtml(title: String, functions: [FunctionEntry], owner: String) -> String
```

### `implementedByHtml`

```kex
implementedByHtml(e: TraitEntry, page: SourcePage, model: PackageModel) -> String
```

### `makeSection`

```kex
makeSection(e: MakeEntry, page: SourcePage, model: PackageModel) -> String
```

Renders a make block with no type declaration on its page. On the type's home page (string.kex for `String`) it shows everything a type section would; elsewhere it links to the home page.

### `firstMakeOnPage?`

```kex
firstMakeOnPage?(facts: Tey.Docgen.Model.TypeFacts, e: MakeEntry, page: SourcePage) -> Bool
```

### `homeNote`

```kex
homeNote(base: String, facts: Tey.Docgen.Model.TypeFacts?, page: SourcePage, model: PackageModel) -> String
```

### `moduleSection`

```kex
moduleSection(e: ModuleEntry, page: SourcePage, model: PackageModel) -> String
```

Renders a module: its functions and constants under it, like a type's functions, then the types, traits and nested modules it declares as sections of their own.

### `namespaceOnly?`

```kex
namespaceOnly?(e: ModuleEntry, page: SourcePage) -> Bool
```

Returns `true` when the module only names the page's namespace. A file that wraps `Set` in a bare `module Data` is the page "Data.Set"; the outer module's comment is the page's introduction, and it gets no "module Data" heading.

### `memberIndexRows`

```kex
memberIndexRows(members: [Entity], prefix: String) -> [IndexRow]
```

Builds one index row per member name, shown with `prefix` in front.

### `memberIndexRow`

```kex
memberIndexRow(same: [Entity], name: String) -> IndexRow
```

### `foulEntity?`

```kex
foulEntity?(e: Entity) -> Bool
```

### `foulTag`

```kex
foulTag(isFoul: Bool) -> String
```

Returns the "foul" chip shown wherever a foul function is named. A foul function may touch the outside world, and only foul code may call it.

### `summaryOf`

```kex
summaryOf(e: Entity) -> String
```

### `memberEntity?`

```kex
memberEntity?(e: Entity) -> Bool
```

### `moduleMemberHtml`

```kex
moduleMemberHtml(e: Entity, page: SourcePage, model: PackageModel) -> String
```

### `functionSection`

```kex
functionSection(e: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `constantSection`

```kex
constantSection(e: ConstantEntry, page: SourcePage, model: PackageModel) -> String
```

### `functionsHtml`

```kex
functionsHtml(functions: [FunctionEntry], owner: String, level: Integer, implements: [String], page: SourcePage, model: PackageModel) -> String
```

Renders the functions of a trait or make block, one heading per name, so overloads such as `count` and `count(pred)` appear as one function with several signatures. `owner` scopes the anchors, and `implements` lets a function that fulfils a trait say which trait.

### `functionGroupHtml`

```kex
functionGroupHtml(fs: [FunctionEntry], name: String, owner: String, level: Integer, implements: [String], page: SourcePage, model: PackageModel) -> String
```

### `memberHeadHtml`

```kex
memberHeadHtml(heading: String, signature: String, name: String) -> String
```

Renders the head of a member's card: its signature with the heading's chips beside it, in one row, so a long signature scrolls in its own space without running under them. A stylesheet may still float the permalink, which appears only on hover. A member with no type is headed by its name in the same way, so every card has the same shape.

### `traitTag`

```kex
traitTag(name: String, implements: [String], page: SourcePage, model: PackageModel) -> String
```

Returns the "from Enumerable" tag for a member that is the type's own version of a trait function, linked to the trait's entry for it.

### `overloadHtml`

```kex
overloadHtml(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

Renders one overload: its signature, then its prose.

### `overloadBodyHtml`

```kex
overloadBodyHtml(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `signaturesHtml`

```kex
signaturesHtml(f: FunctionEntry, page: SourcePage, model: PackageModel) -> String
```

### `signatureLine`

```kex
signatureLine(html: String) -> String
```

Wraps one signature in an element of its own, so a stylesheet can treat each overload as a unit.

### `namedFirst`

```kex
namedFirst(html: String, name: String) -> String
```

Marks the name that opens a signature as a name. The highlighter alone marks it as a function only when a parameter list follows, so `count : Integer` would come out plain beside `count(pred)`, and a function called `from` or `in` would be coloured as a keyword.

### `permalinkHtml`

```kex
permalinkHtml(anchor: String) -> String
```

Renders the permalink beside a heading: a link to its own anchor, which the page script turns into a "copy this address" control.

### `docHtml`

```kex
docHtml(doc: Doc, page: SourcePage, model: PackageModel) -> String
```

### `entityDocHtml`

```kex
entityDocHtml(doc: Doc, page: SourcePage, model: PackageModel) -> String
```

Renders a declaration's doc: prose, then examples, then any deprecation notice. Types get their examples rendered as functions do.

### `plainDocHtml`

```kex
plainDocHtml(doc: Doc) -> String
```

Renders a doc's prose without links, for text with no page to resolve names against, such as the prelude comment and card summaries.

### `summaryParagraphs`

```kex
summaryParagraphs(summary: String) -> [String]
```

Splits a summary into paragraphs at blank lines, except inside a fenced block, where a blank line belongs to the code.

### `groupParagraphs`

```kex
groupParagraphs(lines: [String], current: [String], accum: [String], fenced: Bool) -> [String]
```

### `paragraphHtml`

```kex
paragraphHtml(p: String, hrefOf: (String -> String)) -> String
```

Renders one summary paragraph as what it is: prose, a fenced block that Rdoc made from an indented block, or a bullet list.

### `bulletLine?`

```kex
bulletLine?(line: String) -> Bool
```

### `bulletListHtml`

```kex
bulletListHtml(lines: [String], hrefOf: (String -> String)) -> String
```

Renders `- item` lines as a list, folding indented continuation lines into the item above.

### `inlineCode`

```kex
inlineCode(text: String) -> String
```

Renders backtick code spans in doc prose, the only inline Markdown it supports. An unmatched backtick stays literal text.

### `linkedInline`

```kex
linkedInline(text: String, hrefOf: (String -> String)) -> String
```

Renders code spans as `inlineCode` does, linking each one that names something documented, such as a type, a trait or `List.map`.

### `linkableCode?`

```kex
linkableCode?(code: String) -> Bool
```

Returns `true` when a code span is a bare name such as `List`, `FS.Path` or `List.map`. A span with spaces or parentheses is an expression and is not linked.

### `firstSentence`

```kex
firstSentence(text: String) -> String
```

### `paramsHtml`

```kex
paramsHtml(f: FunctionEntry, link: (String -> String), page: SourcePage, model: PackageModel) -> String
```

Renders each parameter's description. Its type is shown only when there is no signature above that already gives it.

### `returnsHtml`

```kex
returnsHtml(f: FunctionEntry, link: (String -> String), page: SourcePage, model: PackageModel) -> String
```

Renders the "Returns" line. When there is a signature, which already gives the result type, only the `@return` description is shown, so a tag whose type disagrees cannot contradict it (`min : X?` above "Returns: Number?").

### `examplesHtml`

```kex
examplesHtml(doc: Doc) -> String
```

### `codeBlockHtml`

```kex
codeBlockHtml(source: String) -> String
```

Renders Kex source as a highlighted block with a copy control. The control stays hidden until the page script enables it.

### `deprecatedHtml`

```kex
deprecatedHtml(doc: Doc) -> String
```

### `esc`

```kex
esc(s: String) -> String
```

Escapes text for HTML content and double-quoted attributes.

### `labelOf`

```kex
labelOf(model: PackageModel) -> String
```

### `pageTarget`

```kex
pageTarget(current: String) -> String
```

Returns the page the version switcher tries first in the target version.

### `markdownLink`

```kex
markdownLink(current: String) -> String
```

Returns the footer link to a page's Markdown version, the same file llms.txt points models to. Index pages have none. The `.md` file sits beside the page, so the link is a bare file name.

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

Returns the relative path from a page back to the version directory: "" for "string", "../" for "kex/ast".

### `rootPrefix`

```kex
rootPrefix(urlPath: String) -> String
```

Returns the relative path from a page to the site root, two levels above the version directory (<pkg>/<version>/).

### `ups`

```kex
ups(n: Integer) -> String
```

## record `IndexRow`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `href` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `summary` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `foul?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)


