---
package: tey
version: "0.2.1-dev"
source: tey/docgen/model.kex
title: Tey.Docgen.Model
entities:
  - { kind: module, name: "Tey.Docgen.Model" }
---

# Tey.Docgen.Model

The records `tey docs` extracts from source, from which the Markdown, the JSON and the search index are all produced.

No field is called `type`, because `type` after a dot is read as a keyword. The JSON key names are chosen in `Tey.Docgen.Json`.

## module `Tey.Docgen.Model`

### `emptyDoc`

```kex
emptyDoc -> Doc
```

### `kindOf`

```kex
kindOf(entity: Entity) -> String
```

Returns the kind label an entity has in indexes and JSON, such as `"record"` or `"make"`.

### `nameOf`

```kex
nameOf(entity: Entity) -> String
```

Returns an entity's display name; a make's is its target type.

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

Returns the id of an entity's HTML section.

It is here, not in the HTML renderer, because the cross-link index and the sidebar need the same ids.

### `anchorNameOf`

```kex
anchorNameOf(entity: Entity) -> String
```

Returns the text an entity's anchor is made from: a make's full target, type parameters included, or otherwise the qualified name.

### `memberAnchorOf`

```kex
memberAnchorOf(owner: String, name: String) -> String
```

Returns the anchor of a function documented inside a trait or make section. It includes the owner, because one page can hold several owners with a `count`, such as `[X]` and `String`.

### `ownerSlugOf`

```kex
ownerSlugOf(owner: String) -> String
```

Returns the slug of an owner type: `[X]` gives "list", `[Number]` gives "list-number" and `FileHandle<CanRead, W>` gives "filehandle-canread". Type variables (a capital letter, optionally followed by a digit) are dropped.

### `typeVariable?`

```kex
typeVariable?(word: String) -> Bool
```

### `wordsOf`

```kex
wordsOf(text: String) -> [String]
```

Returns the runs of letters, digits, `_`, `?` and `!` in a type's text.

### `wordSplit`

```kex
wordSplit(rest: String, word: String, out: [String]) -> [String]
```

### `slugOf`

```kex
slugOf(name: String) -> String
```

Returns a name spelled for an HTML id: lower case, with each run of punctuation turned into one dash. `?` and `!` are kept, as in `empty?`.

### `operatorSlug`

```kex
operatorSlug(name: String) -> String
```

Returns the slug of an operator, which has no letters of its own: `<=>` gives "op-lt-eq-gt" and a plus sign "op-plus".

### `operatorCharName`

```kex
operatorCharName(c: Char) -> String
```

### `baseTypeOf`

```kex
baseTypeOf(target: String) -> String
```

Returns the type a make block extends, without its type arguments: "[X]" gives "List", "{K: V}" and "Map<K, V>" give "Map", and "FileHandle<R, W>" gives "FileHandle".

## record `Param`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `description` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `Return`

**Fields**

  - `typeName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `description` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `Example`

**Fields**

  - `caption` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `code` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `Doc`

**Fields**

  - `summary` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `params` : [[Param](#record-tey-docgen-model-param)]
  - `returns` : [Return](#record-tey-docgen-model-return)?
  - `examples` : [[Example](#record-tey-docgen-model-example)]
  - `deprecated` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)?



## record `VariantEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `fields` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]



## record `FieldEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `default?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool)



## record `TypeEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `typeParams` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `parents` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `variants` : [[VariantEntry](#record-tey-docgen-model-variantentry)]?
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)



## record `RecordEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `typeParams` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `fields` : [[FieldEntry](#record-tey-docgen-model-fieldentry)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)



## record `TraitEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `typeParams` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `functions` : [[FunctionEntry](#record-tey-docgen-model-functionentry)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)



## record `MakeEntry`

**Fields**

  - `target` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `final?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool)
  - `implements` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `functions` : [[FunctionEntry](#record-tey-docgen-model-functionentry)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)



## record `ModuleEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `children` : [[Entity](#type-tey-docgen-model-entity)]
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)



## record `FunctionEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `signatures` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `clauseCount` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `types` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `returnType` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `foul?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)



## record `ConstantEntry`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `doc` : [Doc](#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)



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

  - `source` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `title` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `entities` : [[Entity](#type-tey-docgen-model-entity)]
  - `intro` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)



## record `Extension`

One `make` block as seen from the type it extends: where it is, the names it adds and the traits it declares.

A type's functions can be spread over many files (there is a `make Integer` in number.kex, period.kex, units.kex and others), and these rows gather them on the type's page.

**Fields**

  - `target` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `pageTitle` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `implements` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `names` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]



## record `TypeFacts`

Everything the package says about one type, across files.

`homePath` is the type's main page: the one declaring it, or for a builtin such as Integer or String the one named after it.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `homePath` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `homeAnchor` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `extensions` : [[Extension](#record-tey-docgen-model-extension)]
  - `traits` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]



## record `TraitFacts`

A trait seen from the outside: where it is documented and which make blocks implement it.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `implementors` : [[Extension](#record-tey-docgen-model-extension)]



## record `ModuleIndexEntry`

One module of the package and the page its entities are on.

The sidebar and the module index of model.json are built from these. Readers navigate by module, and a module need not match a file.

**Fields**

  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `summary` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `members` : [[MemberEntry](#record-tey-docgen-model-memberentry)]



## record `MemberEntry`

One documented member of a module and the anchor of its section, for the sidebar and the JSON index.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `LinkEntry`

One row of the cross-link index: a name that a type reference may mention, such as "String" or "FS.Path", and where it links to. Every renderer resolves names against this one list.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `kind` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `PackageModel`

Everything extracted from one package: its pages, modules, links and cross-file relations.

**Fields**

  - `package` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `version` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `label` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `baseUrl` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `generatedAt` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `pages` : [[SourcePage](#record-tey-docgen-model-sourcepage)]
  - `modules` : [[ModuleIndexEntry](#record-tey-docgen-model-moduleindexentry)] (optional)
  - `links` : [[LinkEntry](#record-tey-docgen-model-linkentry)] (optional)
  - `preludeModules` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `preludeSource` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `preludeDoc` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `types` : [[TypeFacts](#record-tey-docgen-model-typefacts)] (optional)
  - `traits` : [[TraitFacts](#record-tey-docgen-model-traitfacts)] (optional)



## record `SearchEntry`

One row of the search index, for an entity or for a function inside a trait, make or module.

`types` are the type names its signature mentions, so a search can match by type as well as by name. `anchor` is the section a result links to.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `kind` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `signatures` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)]
  - `types` : [[String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `summary` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `urlPath` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `anchor` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)



## record `VersionEntry`

One row of versions.json. Each build adds or replaces its own `(package, id)` row in the file already in the output directory, so the file lists every version built there.

**Fields**

  - `id` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `label` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `generatedAt` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `package` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)


