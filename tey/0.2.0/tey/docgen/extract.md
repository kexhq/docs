---
package: tey
version: "0.2.0"
source: tey/docgen/extract.kex
title: Tey.Docgen.Extract
entities:
  - { kind: module, name: "Tey.Docgen.Extract" }
---

# Tey.Docgen.Extract

Kex.AST nodes → the typed entity model (Tey.Docgen.Model).

Declaration bodies interleave TypeAnnotations (`name : type`) with FunctionDefs (`let name(args) ...`); overloads repeat both. Functions are collected per name as PendingFunction records (annotations + parameter lists kept apart), then finalised once the body is fully walked, because pairing an annotation's curried type with a clause's parameter names needs both sides.

## module `Tey.Docgen.Extract`

### `fileEntities`

```kex
fileEntities(items: [Kex.AST.Node]) -> [Entity]
```

### `pageFor`

```kex
pageFor(source: String, items: [Kex.AST.Node]) -> SourcePage
```

### `pageTitle`

```kex
pageTitle(source: String, entities: [Entity]) -> String
```

A page's title is the declaration it is really about — "OptionParser", not the file name's "Optionparser", and "FileHandle", not "Filehandle". Preference order: a single top-level module, then a single top-level type/record/trait, then the file name title-cased.

### `baseSpelling`

```kex
baseSpelling(name: String) -> String
```

"FileHandle<CanRead, W>" -> "FileHandle", "FS.Path" -> "Path": what the file could plausibly be named after.

### `moduleTitle`

```kex
moduleTitle(entry: ModuleEntry, stem: String) -> String
```

The title of a file with one top-level module. The file's stem has a say when the module is shared across several files: data/queue.kex declares `module Data` around `module Queue`, and so do set.kex and stack.kex — without the stem, every one of those pages is titled "Data" and the sidebar shows indistinguishable entries. A module whose last segment matches the stem is the page ("dns.kex" -> Net.DNS); else a nested module matching it is ("queue.kex" -> Data.Queue); else the top module stands ("mock.kex" -> Mock, a file about the family).

### `lastSegmentMatches?`

```kex
lastSegmentMatches?(qualifiedName: String, stem: String) -> Bool
```

### `nestedModuleNamed`

```kex
nestedModuleNamed(children: [Entity], stem: String) -> String?
```

### `fileStem`

```kex
fileStem(path: String) -> String
```

"kex/ast" -> "ast".

### `entitiesIn`

```kex
entitiesIn(body: [Kex.AST.Node], prefix: String) -> [Entity]
```

### `bodyEntities`

```kex
bodyEntities(body: [Kex.AST.Node], prefix: String, accum: [Pending]) -> [Pending]
```

### `finalize`

```kex
finalize(accum: [Pending]) -> [Entity]
```

### `finalizeOne`

```kex
finalizeOne(p: Pending) -> Entity
```

### `typeEntity`

```kex
typeEntity(info: Kex.AST.TypeInfo, prefix: String) -> Entity
```

### `variantEntry`

```kex
variantEntry(v: Kex.AST.VariantInfo) -> VariantEntry
```

A named helper (rather than an inline lambda) so the element type of `v.fields` comes from VariantInfo, not from VariantEntry's [String].

### `recordEntity`

```kex
recordEntity(info: Kex.AST.RecordInfo, prefix: String) -> Entity
```

### `traitEntity`

```kex
traitEntity(info: Kex.AST.TraitInfo, prefix: String) -> Entity
```

### `makeEntity`

```kex
makeEntity(info: Kex.AST.MakeInfo) -> Entity
```

### `moduleEntity`

```kex
moduleEntity(info: Kex.AST.ModuleInfo, prefix: String) -> Entity
```

### `constantEntity`

```kex
constantEntity(info: Kex.AST.ConstantInfo, prefix: String) -> Entity
```

### `functionEntries`

```kex
functionEntries(body: [Kex.AST.Node], prefix: String) -> [FunctionEntry]
```

### `noteAnnotation`

```kex
noteAnnotation(accum: [Pending], info: Kex.AST.AnnotationInfo, prefix: String) -> [Pending]
```

### `addAnnotation`

```kex
addAnnotation(p: Pending, info: Kex.AST.AnnotationInfo) -> Pending
```

### `noteFunction`

```kex
noteFunction(accum: [Pending], info: Kex.AST.FunctionInfo, prefix: String) -> [Pending]
```

### `isConstantBinding`

```kex
isConstantBinding(info: Kex.AST.FunctionInfo) -> Bool
```

A binding with no parameter list is a constant — unless it is `foul`, in which case it is a zero-argument FUNCTION that Kex auto-calls. `IO.out` is a handle that is always the same one; `IO.getLine` reads a new line every time it is named, and calling that a constant is a lie about both what it does and when it happens.

### `noteConstant`

```kex
noteConstant(accum: [Pending], info: Kex.AST.FunctionInfo, prefix: String) -> [Pending]
```

### `constantFromPending`

```kex
constantFromPending(p: Pending, info: Kex.AST.FunctionInfo, prefix: String) -> Pending
```

The annotation arrived first and created a PendingFunction; the binding now replaces it with the constant entry, keeping name/doc/line.

### `returnTypeText`

```kex
returnTypeText(info: Kex.AST.FunctionInfo) -> String
```

### `addClause`

```kex
addClause(p: Pending, info: Kex.AST.FunctionInfo, paramNames: [String]) -> Pending
```

### `findPending`

```kex
findPending(accum: [Pending], name: String) -> Integer?
```

### `indexedFind`

```kex
indexedFind(accum: [Pending], name: String, index: Integer) -> Integer?
```

### `finalizeFunction`

```kex
finalizeFunction(fn: PendingFunction) -> FunctionEntry
```

### `functionTypes`

```kex
functionTypes(annotations: [Kex.AST.AnnotationInfo], paramLists: [[String]]) -> [String]
```

The type names a function is about — every parameter type plus the result type of each annotation, deduplicated. This is what lets search answer "what touches Integer" rather than just "what is called Integer".

### `annotationTypes`

```kex
annotationTypes(info: Kex.AST.AnnotationInfo, paramLists: [[String]]) -> [String]
```

### `signatureTexts`

```kex
signatureTexts(fn: PendingFunction) -> [String]
```

A function's signature is its EXACT Kex type — `Integer -> Integer -> Integer`, written the way Kex reads it (curried, right-associative) — rather than the flattened clause form. The parameter NAMES ride along before the colon (`and(a, b) : Integer -> Integer -> Integer`) so the names stay visible without flattening the type; an abstract method has no clause, so it shows only `name : Type`. Without an annotation there is no type to show, and the names stand alone.

### `renderSignature`

```kex
renderSignature(info: Kex.AST.AnnotationInfo, paramLists: [[String]]) -> String
```

### `signatureTypeText`

```kex
signatureTypeText(ref: Kex.AST.TypeRef) -> String
```

Source-style type text: function arrows chain to the right without the redundant parentheses typeRefText adds, and a function-typed parameter is parenthesized so `(X -> Y) -> Z` stays distinct from `X -> Y -> Z`.

### `signatureParamText`

```kex
signatureParamText(p: Kex.AST.TypeRef) -> String
```

### `annotationRef`

```kex
annotationRef(info: Kex.AST.AnnotationInfo) -> Kex.AST.TypeRef
```

### `matchingParamList`

```kex
matchingParamList(ref: Kex.AST.TypeRef, paramLists: [[String]]) -> [String]?
```

### `paramsMatch`

```kex
paramsMatch(ref: Kex.AST.TypeRef, names: [String]) -> Bool
```

### `flattenToArity`

```kex
flattenToArity(ref: Kex.AST.TypeRef, arity: Integer) -> Kex.AST.TypeRef
```

Absorbs single-parameter curried layers while more than one argument remains. `(FilePath) -> (Read) -> R` with arity 2 becomes `(FilePath, Read) -> R`.

### `clauseParamNames`

```kex
clauseParamNames(clause: Kex.AST.ClauseInfo?) -> [String]
```

`type` is a keyword after `.`, so typed-record access goes through pattern matching instead.

### `paramName`

```kex
paramName(p: Kex.AST.ParamInfo) -> String
```

### `annotationTypeOf`

```kex
annotationTypeOf(info: Kex.AST.ConstantInfo) -> String
```

### `fieldTypeName`

```kex
fieldTypeName(f: Kex.AST.FieldInfo) -> String
```

### `typeText`

```kex
typeText(ref: Kex.AST.TypeRef) -> String
```

### `typeTextOpt`

```kex
typeTextOpt(ref: Kex.AST.TypeRef?) -> String
```

### `qualify`

```kex
qualify(prefix: String, name: String) -> String
```

Modules may be written fully qualified (`module FS.File do` inside `module FS do`), so a dotted name already carries its prefix — never prepend twice. A short name gets the parent's prefix as usual.

### `stripExt`

```kex
stripExt(name: String) -> String
```

### `titleCase`

```kex
titleCase(s: String) -> String
```

## type `Pending`

Accumulator entries: finished entities or functions still collecting.

**Variants**

  - `Done(Entity)`
  - `PendingFn(PendingFunction)`



## record `PendingFunction`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.3/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.3/string.md#make-string)
  - `annotations` : [[Kex.AST.AnnotationInfo](../../../../prelude/0.4.0-beta.3/kex/ast.md#record-kex-ast-annotationinfo)]
  - `paramLists` : [[[String](../../../../prelude/0.4.0-beta.3/string.md#make-string)]]
  - `clauseCount` : [Integer](../../../../prelude/0.4.0-beta.3/number.md#make-integer)
  - `doc` : [Doc](../../tey/docgen/model.md#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.3/number.md#make-integer)


