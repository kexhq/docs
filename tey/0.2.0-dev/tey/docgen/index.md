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


## function `defaultSource`

`src/` when it is standing there, else the flag as given (an empty one is reported by the scan: "no .kex files found in").


```kex
defaultSource(given)
```


## function `defaultPackage`

The manifest's name when the CWD is a package — the identity docgen should not have to be told. Outside one, "prelude": the compiler's own stdlib documenting without a manifest of its own is the original use.


```kex
defaultPackage(given)
```


## function `defaultVersion`

The version of the thing being documented: a package's own release when standing in one, the compiler's release otherwise. What a package's versions ARE differs from the stdlib — its own releases against Kex releases — and the default follows that distinction automatically because the compiler's own package.kex carries the compiler version.


```kex
defaultVersion(given)
```


## function `manifestVersion`

(name, version) of the package.kex in the CWD, if there is a readable one. Both defaults read it; one read, one parse.


```kex
manifestVersion()
```


## function `buildPages`

── Page construction ────────────────────────────────────────────────────


```kex
buildPages(files, sourceDir)
```


## function `buildPagesLoop`


```kex
buildPagesLoop(files, sourceDir, pages)
```


## function `writePages`

── Output files ─────────────────────────────────────────────────────────


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


## function `manifestJson`


```kex
manifestJson(pages)
```


## function `accumulateVersions`

── versions.json (accumulates across builds) ────────────────────────────

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

