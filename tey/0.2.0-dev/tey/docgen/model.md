---
package: tey
version: "0.2.0-dev"
source: tey/docgen/model.kex
title: Tey.Docgen.Model
entities:
  - { kind: module, name: "Tey.Docgen.Model" }
---

# Tey.Docgen.Model

The canonical documentation model.

Extraction produces these records; Markdown, JSON and the search index are all derived from them. Field names avoid `type` (a keyword after `.`), so every field is dot-accessible; JSON keys are chosen at the emission boundary in Tey.Docgen.Json.

## module `Tey.Docgen.Model`

### `emptyDoc`

```kex
emptyDoc : Doc
```

### `kindOf`

```kex
kindOf(entity: Entity) -> String
```

The kind label used in indexes and JSON for each entity variant.

### `nameOf`

```kex
nameOf(entity: Entity) -> String
```

The primary display name of an entity (a make's is its target type).

### `qualifiedNameOf`

```kex
qualifiedNameOf(entity: Entity) -> String
```

### `lineOf`

```kex
lineOf(entity: Entity) -> Integer
```

### `anchorOf`

```kex
anchorOf(entity: Entity) -> String
```

The anchor id an entity's HTML section renders at. Lives here — not in the HTML renderer — because the cross-link index and the sidebar compute the same ids, and the HTML must match whatever they resolved to.

### `anchorNameOf`

```kex
anchorNameOf(entity: Entity) -> String
```

A make's anchor is keyed by its full target spelling (type params included), a module's by its qualified name — the section ids are derived from the same texts.

### `memberAnchorOf`

```kex
memberAnchorOf(owner: String, name: String) -> String
```

The anchor of a function documented inside a trait or make section: scoped by its owner, because `count` is a member of both `[X]` and `String`, and one page can hold several owners.

### `ownerSlugOf`

```kex
ownerSlugOf(owner: String) -> String
```

An owner spelled as a type: `[X]` -> "list", `[Number]` -> "list-number", `FileHandle<CanRead, W>` -> "filehandle-canread". Type variables (a lone capital, optionally numbered) say nothing about WHICH methods these are, so they are dropped rather than baked into every anchor.

### `typeVariable?`

```kex
typeVariable?(word: String) -> Bool
```

### `wordsOf`

```kex
wordsOf(text: String) -> [String]
```

Identifier-ish runs of a type text: letters, digits, `_`, `?`, `!`.

### `wordSplit`

```kex
wordSplit(rest: String, word: String, out: [String]) -> [String]
```

### `slugOf`

```kex
slugOf(name: String) -> String
```

An id-safe spelling of a name: lower case, every run of punctuation one dash. `?` and `!` survive — they are part of Kex names (`empty?`) and legal in a fragment.

### `operatorSlug`

```kex
operatorSlug(name: String) -> String
```

An operator method has no letters to slug: `+` is "op-plus", `<=>` is "op-lt-eq-gt" — distinct, stable and readable in a URL.

### `operatorCharName`

```kex
operatorCharName(c: Char) -> String
```

### `baseTypeOf`

```kex
baseTypeOf(target: String) -> String
```

"[X]" -> "List", "{K: V}" -> "Map", "FileHandle<R, W>" -> "FileHandle", "Map<K, V>" -> "Map": the type a make block extends, whatever specialisation it spells.

## record `Param`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `description` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `Return`

**Fields**

  - `typeName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `description` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `Example`

**Fields**

  - `caption` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `code` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `Doc`

**Fields**

  - `summary` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `params` : [[Param](#record-tey-docgen-model-param)]
  - `returns` : [Return](#record-tey-docgen-model-return)?
  - `examples` : [[Example](#record-tey-docgen-model-example)]
  - `deprecated` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)?



## record `VariantEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `fields` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]



## record `FieldEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `hasDefault` : [Bool](../../../../prelude/0.4.0-beta.4-dev/truthyable.md#make-bool)



## record `TypeEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `typeParams` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `parents` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `variants` : [[VariantEntry](#record-tey-docgen-model-variantentry)]?
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)



## record `RecordEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `typeParams` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `fields` : [[FieldEntry](#record-tey-docgen-model-fieldentry)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)



## record `TraitEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `typeParams` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `functions` : [[FunctionEntry](#record-tey-docgen-model-functionentry)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)



## record `MakeEntry`

**Fields**

  - `target` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `isFinal` : [Bool](../../../../prelude/0.4.0-beta.4-dev/truthyable.md#make-bool)
  - `implements` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `functions` : [[FunctionEntry](#record-tey-docgen-model-functionentry)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)



## record `ModuleEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `children` : [[Entity](#type-tey-docgen-model-entity)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)



## record `FunctionEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `signatures` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `clauseCount` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `types` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)
  - `returnType` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)



## record `ConstantEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)



## type `Entity`

**Variants**

  - `TypeDecl(TypeEntry)`
  - `RecordDecl(RecordEntry)`
  - `TraitDecl(TraitEntry)`
  - `MakeDecl(MakeEntry)`
  - `ModuleDecl(ModuleEntry)`
  - `FuncDecl(FunctionEntry)`
  - `ConstDecl(ConstantEntry)`



## record `SourcePage`

**Fields**

  - `source` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `title` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `entities` : [[Entity](#type-tey-docgen-model-entity)]
  - `intro` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)



## record `Extension`

One `make` block seen from the type it extends: where it is, what it adds, and which traits it declares. A type's methods are spread over many files (`make Integer` lives in number.kex, time.kex, units.kex and algebra.kex), and these rows are what put them back together.

**Fields**

  - `target` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `pageTitle` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `implements` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `names` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]



## record `TypeFacts`

Everything the package says about one type, across files. `homePath` is the page a reader should land on for the type — the one declaring it, or the one named after it for builtins such as Integer and String.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `homePath` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `homeAnchor` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `extensions` : [[Extension](#record-tey-docgen-model-extension)]
  - `traits` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]



## record `TraitFacts`

A trait seen from the outside: where it is documented and which make blocks implement it.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `implementors` : [[Extension](#record-tey-docgen-model-extension)]



## record `ModuleIndexEntry`

The navigation unit: one per module in the package, pointing at the page its entities live on. The sidebar and the module index of model.json are built from these — a FILE is where source lives, a MODULE is what a reader navigates by, and the two only coincide by accident.

**Fields**

  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `summary` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `members` : [[MemberEntry](#record-tey-docgen-model-memberentry)]



## record `MemberEntry`

One documented member of a module, with the anchor its section renders at — the sidebar's expanded list and the JSON index both use these.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `LinkEntry`

One row of the cross-link index: a name a type reference elsewhere in the package may mention ("String", "FS.Path") and where it lands. The index is what makes interlinked docs possible without per-renderer guesswork: every renderer resolves names against the same list.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `kind` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `PackageModel`

**Fields**

  - `package` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `version` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `label` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `baseUrl` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `generatedAt` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `pages` : [[SourcePage](#record-tey-docgen-model-sourcepage)]
  - `modules` : [[ModuleIndexEntry](#record-tey-docgen-model-moduleindexentry)] (optional)
  - `links` : [[LinkEntry](#record-tey-docgen-model-linkentry)] (optional)
  - `preludeModules` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)
  - `preludeSource` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `preludeDoc` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `types` : [[TypeFacts](#record-tey-docgen-model-typefacts)] (optional)
  - `traits` : [[TraitFacts](#record-tey-docgen-model-traitfacts)] (optional)



## record `SearchEntry`

A flattened search row: one per entity (and per function inside traits, makes and modules), joining name/kind/signature to the page URL. The `types` are the type names the entity is about — the types its signature mentions — so search can answer by name AND by type; `anchor` is the section id a result deep-links to.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `kind` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `signatures` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)]
  - `types` : [[String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)
  - `summary` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)



## record `VersionEntry`

One row of versions.json. The file accumulates across builds — the output directory IS the site, so each build upserts its (package, id) entry into whatever is already published there.

**Fields**

  - `id` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `label` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `generatedAt` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `package` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)


