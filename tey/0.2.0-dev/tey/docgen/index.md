---
package: tey
version: "0.2.0-dev"
source: tey/docgen/index.kex
title: Tey.Docgen.Index
entities:
  - { kind: module, name: "Tey.Docgen.Index" }
---

# Tey.Docgen.Index

The build driver: scan → extract → PackageModel, then emit everything derived from it — model.json, search.json, Markdown pages, manifest, versions, llms.txt/llms-full.txt, robots.txt and sitemap.xml.

## module `Tey.Docgen.Index`

### `buildCommand`

```kex
buildCommand(parsed: OptionParser.ParsedOptions) -> Integer
```

### `externalLinks`

```kex
externalLinks(paths: String) -> [LinkEntry]
```

Names another unit documents, so this one's signatures and prose can link to them: the Tey reference links `String` and `FS.Path` into the standard library's. Each model.json says which unit it is; its pages sit at ../../<package>/<version>/ from this unit's version directory. A file that cannot be read is reported and skipped — links are an extra.

### `writeUnitIndexFiles`

```kex
writeUnitIndexFiles(pages: [SourcePage], model: PackageModel, out: String) -> ()
```

The unit's own index files — its manifest and the shared versions.json — without the site-level ones (landing pages, llms.txt, sitemap), which a host site that frames fragments owns.

### `reportDocDrift`

```kex
reportDocDrift(pages: [SourcePage]) -> ()
```

A @return tag that names a different type than the signature declares is a doc comment that has drifted from its code (`min : X?` documented as returning `Number?`). The page shows the signature's type; this says where the tag disagrees so the comment can be fixed.

### `normalizeType`

```kex
normalizeType(text: String) -> String
```

### `optString`

```kex
optString(value: String?) -> String
```

### `preludeInfo`

```kex
preludeInfo(source: String) -> (String, [String], String)
```

A source tree with a `prelude.kex` has a subset that is visible without an import, and the reader wants to know which. The file is declarative by convention — an opening comment, then one bare `using <Module>` per line — so reading it is enough. A package without one gets empties, and nothing in the output mentions a prelude at all.

Returns (the file, the modules it makes visible, its opening comment).

### `leadingComment`

```kex
leadingComment(lines: [String]) -> String
```

The file's opening comment block, `#` markers stripped, ready for the same Rdoc parse every other doc comment goes through.

### `commentBody`

```kex
commentBody(line: String) -> String
```

### `fileHeader`

```kex
fileHeader(lines: [String]) -> String
```

The file's opening comment, when it is its own block: a blank line after it, not a declaration. A comment that runs straight into a declaration is that declaration's doc, and the page gets no intro.

### `usingName`

```kex
usingName(line: String) -> String
```

"using List" -> "List"; anything else (a comment, a blank line, an `only:` list) -> "".

### `defaultSource`

```kex
defaultSource(given: String) -> String
```

`src/` when it is standing there, else the flag as given (an empty one is reported by the scan: "no .kex files found in").

### `defaultPackage`

```kex
defaultPackage(given: String) -> String
```

The manifest's name when the CWD is a package — the identity docgen should not have to be told. Outside one, "": the caller has to say, and buildCommand refuses rather than inventing a name. Docgen used to answer "prelude" here, which meant a build with a swallowed or forgotten --package filed its pages under whatever the CWD's package.kex said (the stdlib was published as "kex" for exactly that reason, kexhq/kex#287).

### `defaultVersion`

```kex
defaultVersion(given: String) -> String
```

The version of the thing being documented: a package's own release when standing in one. What a package's versions ARE differs per package — a library's own releases, the stdlib's Kex releases — so outside a package this is the caller's to state (--release) rather than docgen's to guess.

### `manifestVersion`

```kex
manifestVersion : (String, String)?
```

(name, version) of the package.kex in the CWD, if there is a readable one. Both defaults read it; one read, one parse.

### `buildPages`

```kex
buildPages(files: [String], sourceDir: String) -> [SourcePage]
```

### `buildPagesLoop`

```kex
buildPagesLoop(files: [String], sourceDir: String, pages: [SourcePage]) -> [SourcePage]
```

### `writePages`

```kex
writePages(pages: [SourcePage], versionDir: String, model: PackageModel) -> Integer
```

### `writeHtml`

```kex
writeHtml(pages: [SourcePage], versionDir: String, out: String, model: PackageModel) -> ()
```

HTML mirrors the Markdown layout: one page per source file, plus the version landing page, the site-root redirect and the shared stylesheet.

### `dirNameOf`

```kex
dirNameOf(urlPath: String) -> String
```

"kex/ast" → "kex"; "fs" → "" (already inside versionDir).

### `ensureDirectory`

```kex
ensureDirectory(path: String) -> ()
```

### `writeIndexFiles`

```kex
writeIndexFiles(pages: [SourcePage], model: PackageModel, out: String) -> ()
```

### `versionManifestJson`

```kex
versionManifestJson(pages: [SourcePage], model: PackageModel) -> String
```

One version's pages, with the package and version they belong to, so a reader of the file needs nothing but the file. Page paths stay relative to the version directory — the URL prefix is `<package>/<version>/`, and whoever assembles the site is the one that knows the site root.

### `manifestJson`

```kex
manifestJson(pages: [SourcePage]) -> String
```

### `accumulateVersions`

```kex
accumulateVersions(out: String, model: PackageModel) -> [VersionEntry]
```

The output directory is the published site, so a build must not clobber the versions other builds published: read what is there, upsert this (package, version), write the union back, newest first.

### `upsertVersion`

```kex
upsertVersion(current: VersionEntry, existing: [VersionEntry]) -> [VersionEntry]
```

This build's entry first, the other packages' and versions' kept: the pure half of accumulate, so the upsert rule itself can be spec'd.

### `readVersionEntries`

```kex
readVersionEntries(out: String) -> [VersionEntry]
```

### `parseVersionEntry`

```kex
parseVersionEntry(v: Any) -> VersionEntry
```

### `jsonText`

```kex
jsonText(value: Any?) -> String
```

### `labelOrPackage`

```kex
labelOrPackage(model: PackageModel) -> String
```

### `versionsJson`

```kex
versionsJson(entries: [VersionEntry]) -> String
```

### `versionEntryValue`

```kex
versionEntryValue(e: VersionEntry) -> Any
```

### `llmsTxt`

```kex
llmsTxt(pages: [SourcePage], model: PackageModel) -> String
```

### `llmsFullTxt`

```kex
llmsFullTxt(pages: [SourcePage], model: PackageModel) -> String
```

### `robotsTxt`

```kex
robotsTxt(baseUrl: String) -> String
```

### `sitemapXml`

```kex
sitemapXml(pages: [SourcePage], model: PackageModel) -> String
```

### `normalizeBaseUrl`

```kex
normalizeBaseUrl(url: String) -> String
```
