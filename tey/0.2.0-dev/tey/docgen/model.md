---
package: tey
version: "0.2.0-dev"
source: tey/docgen/model.kex
title: Tey.Docgen.Model
entities:
  - { kind: module, name: "Tey.Docgen.Model" }
---

# Tey.Docgen.Model

## module `Tey.Docgen.Model`

The canonical documentation model.

Extraction produces these records; Markdown, JSON and the search index are all derived from them. Field names avoid `type` (a keyword after `.`), so every field is dot-accessible; JSON keys are chosen at the emission boundary in Tey.Docgen.Json.

## record `Param`

── Documentation (parsed RDoc) ──────────────────────────────────────────

**Fields**

  - `name` : String
  - `typeName` : String
  - `description` : String

## record `Return`

**Fields**

  - `typeName` : String
  - `description` : String

## record `Example`

**Fields**

  - `caption` : String
  - `code` : String

## record `Doc`

**Fields**

  - `summary` : String
  - `params` : [[Param](#record-param)]
  - `returns` : [Return](#record-return)?
  - `examples` : [[Example](#record-example)]
  - `deprecated` : String?

## function `emptyDoc`


```kex
emptyDoc()
```


## record `VariantEntry`

── Entities ─────────────────────────────────────────────────────────────

**Fields**

  - `name` : String
  - `fields` : [String]

## record `FieldEntry`

**Fields**

  - `name` : String
  - `typeName` : String
  - `hasDefault` : Bool

## record `TypeEntry`

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `typeParams` : [String]
  - `parents` : [String]
  - `variants` : [[VariantEntry](#record-variantentry)]?
  - `doc` : [Doc](#record-doc)
  - `line` : Integer

## record `RecordEntry`

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `typeParams` : [String]
  - `fields` : [[FieldEntry](#record-fieldentry)]
  - `doc` : [Doc](#record-doc)
  - `line` : Integer

## record `TraitEntry`

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `typeParams` : [String]
  - `functions` : [[FunctionEntry](#record-functionentry)]
  - `doc` : [Doc](#record-doc)
  - `line` : Integer

## record `MakeEntry`

**Fields**

  - `target` : String
  - `isFinal` : Bool
  - `implements` : [String]
  - `functions` : [[FunctionEntry](#record-functionentry)]
  - `doc` : [Doc](#record-doc)
  - `line` : Integer

## record `ModuleEntry`

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `children` : [[Entity](#type-entity)]
  - `doc` : [Doc](#record-doc)
  - `line` : Integer

## record `FunctionEntry`

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `signatures` : [String]
  - `clauseCount` : Integer
  - `doc` : [Doc](#record-doc)
  - `line` : Integer
  - `types` : [String] (optional)

## record `ConstantEntry`

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `typeName` : String
  - `doc` : [Doc](#record-doc)
  - `line` : Integer

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

── Pages and packages ───────────────────────────────────────────────────

**Fields**

  - `source` : String
  - `urlPath` : String
  - `title` : String
  - `entities` : [[Entity](#type-entity)]

## record `ModuleIndexEntry`

The navigation unit: one per module in the package, pointing at the page its entities live on. The sidebar and the module index of model.json are built from these — a FILE is where source lives, a MODULE is what a reader navigates by, and the two only coincide by accident.

**Fields**

  - `qualifiedName` : String
  - `summary` : String
  - `urlPath` : String
  - `members` : [[MemberEntry](#record-memberentry)]

## record `MemberEntry`

One documented member of a module, with the anchor its section renders at — the sidebar's expanded list and the JSON index both use these.

**Fields**

  - `name` : String
  - `anchor` : String

## record `LinkEntry`

One row of the cross-link index: a name a type reference elsewhere in the package may mention ("String", "FS.Path") and where it lands. The index is what makes interlinked docs possible without per-renderer guesswork: every renderer resolves names against the same list.

**Fields**

  - `name` : String
  - `urlPath` : String
  - `anchor` : String
  - `kind` : String

## record `PackageModel`

**Fields**

  - `package` : String
  - `version` : String
  - `label` : String
  - `baseUrl` : String
  - `generatedAt` : String
  - `pages` : [[SourcePage](#record-sourcepage)]
  - `modules` : [[ModuleIndexEntry](#record-moduleindexentry)] (optional)
  - `links` : [[LinkEntry](#record-linkentry)] (optional)

## record `SearchEntry`

A flattened search row: one per entity (and per function inside traits, makes and modules), joining name/kind/signature to the page URL. The `types` are the type names the entity is about — the types its signature mentions — so search can answer by name AND by type; `anchor` is the section id a result deep-links to.

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `kind` : String
  - `signatures` : [String]
  - `types` : [String] (optional)
  - `summary` : String
  - `urlPath` : String
  - `anchor` : String (optional)
  - `line` : Integer

## record `VersionEntry`

One row of versions.json. The file accumulates across builds — the output directory IS the site, so each build upserts its (package, id) entry into whatever is already published there.

**Fields**

  - `id` : String
  - `label` : String
  - `generatedAt` : String
  - `package` : String

## function `kindOf`

The kind label used in indexes and JSON for each entity variant.


```kex
kindOf(entity)
```


## function `nameOf`

The primary display name of an entity (a make's is its target type).


```kex
nameOf(entity)
```


## function `qualifiedNameOf`


```kex
qualifiedNameOf(entity)
```


## function `lineOf`


```kex
lineOf(entity)
```


## function `anchorOf`

The anchor id an entity's HTML section renders at. Lives here — not in the HTML renderer — because the cross-link index and the sidebar compute the same ids, and the HTML must match whatever they resolved to.


```kex
anchorOf(entity)
```


## function `anchorNameOf`

A make's anchor is keyed by its full target spelling (type params included), a module's by its qualified name — the section ids are derived from the same texts.


```kex
anchorNameOf(entity)
```


## function `slugOf`


```kex
slugOf(name)
```

