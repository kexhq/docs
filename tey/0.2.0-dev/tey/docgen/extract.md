---
package: tey
version: "0.2.0-dev"
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
pageFor(source: String, items: [Kex.AST.Node], header: String) -> SourcePage
```

`header` is the file's opening comment when a blank line separates it from what follows (Index.fileHeader). The AST reader attaches every comment above a declaration to it, blank lines and all, so the first declaration's doc arrives with the file's introduction glued on top — algebra.kex's "Algebraic structures: ..." read as the summary of `Monoid`. The header is cut off that doc here and kept as the page's own intro.

### `detachHeader`

```kex
detachHeader(items: [Kex.AST.Node], header: String) -> [Kex.AST.Node]
```

The items with the header removed from the first documented one.

### `withoutHeader`

```kex
withoutHeader(item: Kex.AST.Node, header: String) -> Kex.AST.Node
```

### `docOf`

```kex
docOf(item: Kex.AST.Node) -> String?
```

### `withDoc`

```kex
withDoc(item: Kex.AST.Node, doc: String?) -> Kex.AST.Node
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

### `mergeMakes`

```kex
mergeMakes(entities: [Entity]) -> [Entity]
```

Two `make Queue<A>` blocks in one file (one for the collection traits, one for Blankable) are one set of methods to a reader: the later block folds into the first, traits and members appended.

### `sameMakeTarget?`

```kex
sameMakeTarget?(e: Entity, target: String) -> Bool
```

### `absorbMake`

```kex
absorbMake(e: Entity, later: MakeEntry) -> Entity
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
functionEntries(body: [Kex.AST.Node], prefix: String, receiverMethods: Bool) -> [FunctionEntry]
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
addClause(p: Pending, info: Kex.AST.FunctionInfo, lists: [[ParamSig]]) -> Pending
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

### `declaredReturn`

```kex
declaredReturn(fn: PendingFunction) -> String
```

The one return type the source commits to: the annotation's result, or the inline `-> T` of an unannotated clause. What the @return tag says is checked against this (Index.reportDocDrift), never shown instead of it.

### `finalResult`

```kex
finalResult(ref: Kex.AST.TypeRef) -> Kex.AST.TypeRef
```

What a curried type finally answers: `A -> (A -> T -> A) -> A` is A.

### `docReturnType`

```kex
docReturnType(doc: Doc) -> String
```

### `functionTypes`

```kex
functionTypes(fn: PendingFunction) -> [String]
```

The type names a function is about — every parameter type plus the result type of each annotation, deduplicated. This is what lets search answer "what touches Integer" rather than just "what is called Integer".

### `annotationTypes`

```kex
annotationTypes(info: Kex.AST.AnnotationInfo, paramLists: [[ParamSig]]) -> [String]
```

### `signatureTexts`

```kex
signatureTexts(fn: PendingFunction) -> [String]
```

A signature names every parameter WITH its type and ends in the result: `and(a: Integer, b: Integer) -> Integer`. The names come from a clause, the types from the annotation (flattened to the clause's arity), from the clause's own inline annotations, or — for a method nobody annotated — from its @param/@return tags. A zero-parameter member reads as the property it looks like at the call site (`sum : Number`). A method with no clause at all (a trait's required method) has only its type, and borrows parameter names from its @param tags when they line up.

### `plainSignature`

```kex
plainSignature(fn: PendingFunction, params: [ParamSig]) -> String
```

A signature built from the clause alone: inline types first, the doc tags as the fallback, bare names when neither says.

### `renderSignature`

```kex
renderSignature(info: Kex.AST.AnnotationInfo, fn: PendingFunction) -> String
```

### `docNamedSignature`

```kex
docNamedSignature(name: String, ref: Kex.AST.TypeRef, doc: Doc) -> String
```

An annotation with no clause to take names from: the @param tags name the parameters when there are exactly as many as the type has.

### `paramText`

```kex
paramText(name: String, typeName: String, hasDefault: Bool) -> String
```

### `parenthesized`

```kex
parenthesized(typeName: String) -> String
```

A function type inside a parameter list reads as the parameter's type only in parentheses: `f: (T -> Void)`, not `f: T -> Void`.

### `displayName`

```kex
displayName(p: ParamSig, index: Integer, doc: Doc) -> String
```

A pattern parameter (`repeat(0)`) shows the name its @param tag gives that position, or `_` — never the literal, which reads as an argument.

### `docParamType`

```kex
docParamType(doc: Doc, name: String) -> String
```

### `bestParams`

```kex
bestParams(lists: [[ParamSig]]) -> [ParamSig]?
```

Of several clauses' parameter lists, the one that names the most parameters — `repeat(n: Integer)` over `repeat(0)` — merged with the types the other clauses of the same arity declare.

### `namedCount`

```kex
namedCount(list: [ParamSig]) -> Integer
```

### `withPeerType`

```kex
withPeerType(p: ParamSig, index: Integer, peers: [[ParamSig]]) -> ParamSig
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
matchingParamList(ref: Kex.AST.TypeRef, paramLists: [[ParamSig]]) -> [ParamSig]?
```

### `matchingParamLists`

```kex
matchingParamLists(ref: Kex.AST.TypeRef, paramLists: [[ParamSig]]) -> [[ParamSig]]
```

### `paramsMatch`

```kex
paramsMatch(ref: Kex.AST.TypeRef, names: [ParamSig]) -> Bool
```

### `flattenToArity`

```kex
flattenToArity(ref: Kex.AST.TypeRef, arity: Integer) -> Kex.AST.TypeRef
```

Absorbs single-parameter curried layers while more than one argument remains. `(FilePath) -> (Read) -> R` with arity 2 becomes `(FilePath, Read) -> R`.

### `clauseParams`

```kex
clauseParams(clause: Kex.AST.ClauseInfo) -> [ParamSig]
```

`type` is a keyword after `.`, so typed-record access goes through pattern matching instead.

### `paramSig`

```kex
paramSig(p: Kex.AST.ParamInfo) -> ParamSig
```

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

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `annotations` : [[Kex.AST.AnnotationInfo](../../../../prelude/0.4.0-beta.4-dev/kex/ast.md#record-kex-ast-annotationinfo)]
  - `paramLists` : [[[ParamSig](#record-tey-docgen-extract-paramsig)]]
  - `clauseCount` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `doc` : [Doc](../../tey/docgen/model.md#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `returnType` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)



## record `ParamSig`

One parameter as a clause declares it. `named` is false for a pattern parameter (`let repeat(0) = ...`), whose spelling is a value, not a name a signature should show.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `named` : [Bool](../../../../prelude/0.4.0-beta.4-dev/truthyable.md#make-bool)
  - `hasDefault` : [Bool](../../../../prelude/0.4.0-beta.4-dev/truthyable.md#make-bool)


