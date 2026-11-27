---
package: tey
version: "0.2.1-dev"
source: tey/docgen/index.kex
title: Tey.Docgen.Index
entities:
  - { kind: module, name: "Tey.Docgen.Index" }
---

# Tey.Docgen.Index

The `tey docs build` driver. It scans and extracts the sources into a `PackageModel`, then writes everything derived from it: model.json, search.json, the Markdown pages, and either the HTML site (with its manifests, versions.json, llms.txt, llms-full.txt, robots.txt and sitemap.xml) or, with `--format fragments`, HTML fragments for a host site.

## module `Tey.Docgen.Index`

### `buildCommand` (foul)

```kex
buildCommand(parsed: ParsedOptions) -> Integer
```

### `externalLinks` (foul)

```kex
externalLinks(paths: String) -> [LinkEntry]
```

Returns the names documented by other units, read from the comma-separated model.json files in `paths`, so this unit's signatures and prose can link to them.

The Tey reference uses this to link `String` and `FS.Path` to the standard library. Each model.json names its package and version, and its pages are linked at ../../<package>/<version>/ from this unit's version directory. A file that cannot be read or is not JSON is reported as a warning and skipped.

### `writeUnitIndexFiles` (foul)

```kex
writeUnitIndexFiles(pages: [SourcePage], model: PackageModel, out: String) -> ()
```

Writes this unit's version manifest and the shared versions.json, but none of the site-wide files (landing pages, llms.txt, sitemap), which belong to the host site that embeds the fragments.

### `reportDocDrift` (foul)

```kex
reportDocDrift(pages: [SourcePage]) -> ()
```

Prints a note for each `@return` tag whose type differs from the signature's, such as `min : X?` documented as returning `Number?`.

The page shows the signature's type either way; the note says which comment has fallen behind its code.

### `normalizeType`

```kex
normalizeType(text: String) -> String
```

### `optString`

```kex
optString(value: String?) -> String
```

### `preludeInfo` (foul)

```kex
preludeInfo(source: String) -> (String, [String], String)
```

Returns the prelude of the source tree at `source`: the file name, the modules it makes visible, and its opening comment.

A `prelude.kex` is an opening comment followed by one bare `using <Module>` per line, so reading the lines is enough. Without one the result is `("", [], "")` and the output never mentions a prelude.

### `leadingComment`

```kex
leadingComment(lines: [String]) -> String
```

Returns the comment lines at the top of `lines` with their `#` markers removed, ready for the same parse as any other doc comment.

### `commentBody`

```kex
commentBody(line: String) -> String
```

### `fileHeader`

```kex
fileHeader(lines: [String]) -> String
```

Returns the file's opening comment when a blank line follows it, and `""` otherwise.

A comment that runs straight into a declaration is that declaration's doc, and the page gets no introduction. A `#!` line does not count as a comment.

### `usingName`

```kex
usingName(line: String) -> String
```

Returns the module a `using` line names (`"using List"` gives `"List"`), or `""` for any other line.

### `defaultSource` (foul)

```kex
defaultSource(given: String) -> String
```

Returns `given` when it is not empty, else `"src"` when the current directory has one, else `""`, which the scan reports as having no .kex files.

### `defaultPackage` (foul)

```kex
defaultPackage(given: String) -> String
```

Returns `given` when it is not empty, else the name in the current directory's package.kex, else `""`.

With `""`, `buildCommand` stops with an error and asks for `--package`; it does not invent a name (kexhq/kex#287).

### `defaultVersion` (foul)

```kex
defaultVersion(given: String) -> String
```

Returns `given` when it is not empty, else the version in the current directory's package.kex, else `""`.

Outside a package the caller must pass `--release`: what a version means differs between units, such as a library's releases and the standard library's Kex releases.

### `manifestVersion` (foul)

```kex
manifestVersion -> (String, String)?
```

Returns the name and version from the current directory's package.kex, or `None` when there is none or it does not parse.

### `buildPages` (foul)

```kex
buildPages(files: [String], sourceDir: String) -> [SourcePage]
```

### `buildPagesLoop` (foul)

```kex
buildPagesLoop(files: [String], sourceDir: String, pages: [SourcePage]) -> [SourcePage]
```

### `writePages` (foul)

```kex
writePages(pages: [SourcePage], versionDir: String, model: PackageModel) -> Integer
```

### `writeHtml` (foul)

```kex
writeHtml(pages: [SourcePage], versionDir: String, out: String, model: PackageModel) -> ()
```

Writes the HTML site for one version: a page per source file, the version's index.html and search.html, and the shared assets/style.css and assets/site.js.

### `dirNameOf`

```kex
dirNameOf(urlPath: String) -> String
```

Returns the directory part of a page's URL path: `"kex/ast"` gives `"kex"`, and `"fs"` gives `""`.

### `ensureDirectory` (foul)

```kex
ensureDirectory(path: String) -> ()
```

### `writeIndexFiles` (foul)

```kex
writeIndexFiles(pages: [SourcePage], model: PackageModel, out: String) -> ()
```

### `versionManifestJson`

```kex
versionManifestJson(pages: [SourcePage], model: PackageModel) -> String
```

Returns the manifest.json for one version: its package, version, label, build time and pages.

Page paths are relative to the version directory, `<package>/<version>/`; whoever assembles the site adds the site root.

### `manifestJson`

```kex
manifestJson(pages: [SourcePage]) -> String
```

### `accumulateVersions` (foul)

```kex
accumulateVersions(out: String, model: PackageModel) -> [VersionEntry]
```

Returns the versions.json entries with this build's added.

The output directory is the published site, so other builds' versions are kept: the existing entries are read, this package and version replaces any earlier entry for it, and this build comes first.

### `upsertVersion`

```kex
upsertVersion(current: VersionEntry, existing: [VersionEntry]) -> [VersionEntry]
```

Returns `existing` with any entry for the same package and version removed and `current` put first.

### `readVersionEntries` (foul)

```kex
readVersionEntries(out: String) -> [VersionEntry]
```

### `parseVersionEntry`

```kex
parseVersionEntry(value: Any) -> VersionEntry
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
