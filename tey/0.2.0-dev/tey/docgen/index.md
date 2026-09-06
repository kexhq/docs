---
package: tey
version: "0.2.0-dev"
source: tey/docgen/index.kex
title: Tey.Docgen.Index
entities:
  - { kind: module, name: "Tey.Docgen.Index" }
---

# Tey.Docgen.Index

## module `Tey.Docgen.Index`

The build driver: scan → extract → PackageModel, then emit everything derived from it — model.json, search.json, Markdown pages, manifest, versions, llms.txt/llms-full.txt, robots.txt and sitemap.xml.

## function `buildCommand`


```kex
buildCommand(parsed)
```


## function `optString`


```kex
optString(value)
```


## function `preludeInfo`

A source tree with a `prelude.kex` has a subset that is visible without an import, and the reader wants to know which. The file is declarative by convention — an opening comment, then one bare `using <Module>` per line — so reading it is enough. A package without one gets empties, and nothing in the output mentions a prelude at all.

Returns (the file, the modules it makes visible, its opening comment).


```kex
preludeInfo(source)
```


## function `leadingComment`

The file's opening comment block, `#` markers stripped, ready for the same Rdoc parse every other doc comment goes through.


```kex
leadingComment(lines)
```


## function `commentBody`


```kex
commentBody(line)
```


## function `usingName`

"using List" -> "List"; anything else (a comment, a blank line, an `only:` list) -> "".


```kex
usingName(line)
```


## function `defaultSource`

`src/` when it is standing there, else the flag as given (an empty one is reported by the scan: "no .kex files found in").


```kex
defaultSource(given)
```


## function `defaultPackage`

The manifest's name when the CWD is a package — the identity docgen should not have to be told. Outside one, "": the caller has to say, and buildCommand refuses rather than inventing a name. Docgen used to answer "prelude" here, which meant a build with a swallowed or forgotten --package filed its pages under whatever the CWD's package.kex said (the stdlib was published as "kex" for exactly that reason, kexhq/kex#287).


```kex
defaultPackage(given)
```


## function `defaultVersion`

The version of the thing being documented: a package's own release when standing in one. What a package's versions ARE differs per package — a library's own releases, the stdlib's Kex releases — so outside a package this is the caller's to state (--release) rather than docgen's to guess.


```kex
defaultVersion(given)
```


## function `manifestVersion`

(name, version) of the package.kex in the CWD, if there is a readable one. Both defaults read it; one read, one parse.


```kex
manifestVersion()
```


## function `buildPages`


```kex
buildPages(files, sourceDir)
```


## function `buildPagesLoop`


```kex
buildPagesLoop(files, sourceDir, pages)
```


## function `writePages`


```kex
writePages(pages, versionDir, model)
```


## function `writeHtml`

HTML mirrors the Markdown layout: one page per source file, plus the version landing page, the site-root redirect and the shared stylesheet.


```kex
writeHtml(pages, versionDir, out, model)
```


## function `dirNameOf`

"kex/ast" → "kex"; "fs" → "" (already inside versionDir).


```kex
dirNameOf(urlPath)
```


## function `ensureDirectory`


```kex
ensureDirectory(path)
```


## function `writeIndexFiles`


```kex
writeIndexFiles(pages, model, out)
```


## function `versionManifestJson`

One version's pages, with the package and version they belong to, so a reader of the file needs nothing but the file. Page paths stay relative to the version directory — the URL prefix is `<package>/<version>/`, and whoever assembles the site is the one that knows the site root.


```kex
versionManifestJson(pages, model)
```


## function `manifestJson`


```kex
manifestJson(pages)
```


## function `accumulateVersions`

The output directory is the published site, so a build must not clobber the versions other builds published: read what is there, upsert this (package, version), write the union back, newest first.


```kex
accumulateVersions(out, model)
```


## function `upsertVersion`

This build's entry first, the other packages' and versions' kept: the pure half of accumulate, so the upsert rule itself can be spec'd.


```kex
upsertVersion(current, existing)
```


## function `readVersionEntries`


```kex
readVersionEntries(out)
```


## function `parseVersionEntry`


```kex
parseVersionEntry(v)
```


## function `jsonText`


```kex
jsonText(value)
```


## function `labelOrPackage`


```kex
labelOrPackage(model)
```


## function `versionsJson`


```kex
versionsJson(entries)
```


## function `versionEntryValue`


```kex
versionEntryValue(e)
```


## function `llmsTxt`


```kex
llmsTxt(pages, model)
```


## function `llmsFullTxt`


```kex
llmsFullTxt(pages, model)
```


## function `robotsTxt`


```kex
robotsTxt(baseUrl)
```


## function `sitemapXml`


```kex
sitemapXml(pages, model)
```


## function `normalizeBaseUrl`


```kex
normalizeBaseUrl(url)
```

