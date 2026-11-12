---
package: tey
version: "0.2.1-dev"
source: tey/docgen/extract.kex
title: Tey.Docgen.Extract
entities:
  - { kind: module, name: "Tey.Docgen.Extract" }
---

# Tey.Docgen.Extract

Kex.AST nodes → the typed entity model (Tey.Docgen.Model).

Declaration bodies interleave TypeAnnotations (`name : type`) with FunctionDefs (`let name(args) ...`); overloads repeat both. Functions are collected per name as PendingFunction records (annotations + parameter lists kept apart), then finalised once the body is fully walked, because pairing an annotation's curried type with a clause's parameter names needs both sides.

## module `Tey.Docgen.Extract`

### `fileEntities` (foul)

```kex
fileEntities(items: [Kex.AST.Node]) -> [Entity]
```

### `pageFor` (foul)

```kex
pageFor(source: String, items: [Kex.AST.Node], header: String) -> SourcePage
```

`header` is the file's opening comment when a blank line separates it from what follows (Index.fileHeader). The AST reader attaches every comment above a declaration to it, blank lines and all, so the first declaration's doc arrives with the file's introduction glued on top — algebra.kex's "Algebraic structures: ..." read as the summary of `Monoid`. The header is cut off that doc here and kept as the page's own intro.

### `detachHeader` (foul)

```kex
detachHeader(items: [Kex.AST.Node], header: String) -> [Kex.AST.Node]
```

The items with the header removed from the first documented one.

### `withoutHeader` (foul)

```kex
withoutHeader(item: Kex.AST.Node, header: String) -> Kex.AST.Node
```

### `docOf` (foul)

```kex
docOf(item: Kex.AST.Node) -> String?
```

### `withDoc` (foul)

```kex
withDoc(item: Kex.AST.Node, doc: String?) -> Kex.AST.Node
```

### `pageTitle` (foul)

```kex
pageTitle(source: String, entities: [Entity]) -> String
```

A page's title is the declaration it is really about — "OptionParser", not the file name's "Optionparser", and "FileHandle", not "Filehandle". Preference order: a single top-level module, then a single top-level type/record/trait, then the file name title-cased.

### `baseSpelling` (foul)

```kex
baseSpelling(name: String) -> String
```

"FileHandle<CanRead, W>" -> "FileHandle", "FS.Path" -> "Path": what the file could plausibly be named after.

### `moduleTitle` (foul)

```kex
moduleTitle(entry: ModuleEntry, stem: String) -> String
```

The title of a file with one top-level module. The file's stem has a say when the module is shared across several files: data/queue.kex declares `module Data` around `module Queue`, and so do set.kex and stack.kex — without the stem, every one of those pages is titled "Data" and the sidebar shows indistinguishable entries. A module whose last segment matches the stem is the page ("dns.kex" -> Net.DNS); else a nested module matching it is ("queue.kex" -> Data.Queue); else the top module stands ("mock.kex" -> Mock, a file about the family).

### `lastSegmentMatches?` (foul)

```kex
lastSegmentMatches?(qualifiedName: String, stem: String) -> Bool
```

### `nestedModuleNamed` (foul)

```kex
nestedModuleNamed(children: [Entity], stem: String) -> String?
```

### `fileStem` (foul)

```kex
fileStem(path: String) -> String
```

"kex/ast" -> "ast".

### `entitiesIn` (foul)

```kex
entitiesIn(body: [Kex.AST.Node], prefix: String) -> [Entity]
```

### `bodyEntities` (foul)

```kex
bodyEntities(body: [Kex.AST.Node], prefix: String, accum: [Pending]) -> [Pending]
```

### `finalize` (foul)

```kex
finalize(accum: [Pending]) -> [Entity]
```

### `mergeMakes` (foul)

```kex
mergeMakes(entities: [Entity]) -> [Entity]
```

Two `make Queue<A>` blocks in one file (one for the collection traits, one for Blankable) are one set of methods to a reader: the later block folds into the first, traits and members appended.

### `sameMakeTarget?` (foul)

```kex
sameMakeTarget?(e: Entity, target: String) -> Bool
```

### `absorbMake` (foul)

```kex
absorbMake(e: Entity, later: MakeEntry) -> Entity
```

### `finalizeOne` (foul)

```kex
finalizeOne(p: Pending) -> Entity
```

### `typeEntity` (foul)

```kex
typeEntity(info: Kex.AST.TypeInfo, prefix: String) -> Entity
```

### `variantEntry` (foul)

```kex
variantEntry(v: Kex.AST.VariantInfo) -> VariantEntry
```

A named helper (rather than an inline lambda) so the element type of `v.fields` comes from VariantInfo, not from VariantEntry's [String].

### `recordEntity` (foul)

```kex
recordEntity(info: Kex.AST.RecordInfo, prefix: String) -> Entity
```

### `traitEntity` (foul)

```kex
traitEntity(info: Kex.AST.TraitInfo, prefix: String) -> Entity
```

### `makeEntity` (foul)

```kex
makeEntity(info: Kex.AST.MakeInfo) -> Entity
```

### `moduleEntity` (foul)

```kex
moduleEntity(info: Kex.AST.ModuleInfo, prefix: String) -> Entity
```

### `constantEntity` (foul)

```kex
constantEntity(info: Kex.AST.ConstantInfo, prefix: String) -> Entity
```

### `functionEntries` (foul)

```kex
functionEntries(body: [Kex.AST.Node], prefix: String, receiverMethods: Bool) -> [FunctionEntry]
```

### `noteAnnotation` (foul)

```kex
noteAnnotation(accum: [Pending], info: Kex.AST.AnnotationInfo, prefix: String) -> [Pending]
```

### `addAnnotation` (foul)

```kex
addAnnotation(p: Pending, info: Kex.AST.AnnotationInfo) -> Pending
```

### `noteFunction` (foul)

```kex
noteFunction(accum: [Pending], info: Kex.AST.FunctionInfo, prefix: String) -> [Pending]
```

### `isConstantBinding` (foul)

```kex
isConstantBinding(info: Kex.AST.FunctionInfo) -> Bool
```

A binding with no parameter list is a constant — unless it is `foul`, in which case it is a zero-argument FUNCTION that Kex auto-calls. `IO.out` is a handle that is always the same one; `IO.getLine` reads a new line every time it is named, and calling that a constant is a lie about both what it does and when it happens.

### `noteConstant` (foul)

```kex
noteConstant(accum: [Pending], info: Kex.AST.FunctionInfo, prefix: String) -> [Pending]
```

### `constantFromPending` (foul)

```kex
constantFromPending(p: Pending, info: Kex.AST.FunctionInfo, prefix: String) -> Pending
```

The annotation arrived first and created a PendingFunction; the binding now replaces it with the constant entry, keeping name/doc/line.

### `returnTypeText` (foul)

```kex
returnTypeText(info: Kex.AST.FunctionInfo) -> String
```

### `addClause` (foul)

```kex
addClause(p: Pending, info: Kex.AST.FunctionInfo, lists: [[ParamSig]]) -> Pending
```

### `findPending` (foul)

```kex
findPending(accum: [Pending], name: String) -> Integer?
```

### `indexedFind` (foul)

```kex
indexedFind(accum: [Pending], name: String, index: Integer) -> Integer?
```

### `finalizeFunction` (foul)

```kex
finalizeFunction(fn: PendingFunction) -> FunctionEntry
```

### `declaredReturn` (foul)

```kex
declaredReturn(fn: PendingFunction) -> String
```

The one return type the source commits to: the annotation's result, or the inline `-> T` of an unannotated clause. What the @return tag says is checked against this (Index.reportDocDrift), never shown instead of it.

### `finalResult` (foul)

```kex
finalResult(ref: Kex.AST.TypeRef) -> Kex.AST.TypeRef
```

What a curried type finally answers: `A -> (A -> T -> A) -> A` is A.

### `docReturnType` (foul)

```kex
docReturnType(doc: Doc) -> String
```

### `functionTypes` (foul)

```kex
functionTypes(fn: PendingFunction) -> [String]
```

The type names a function is about — every parameter type plus the result type of each annotation, deduplicated. This is what lets search answer "what touches Integer" rather than just "what is called Integer".

### `annotationTypes` (foul)

```kex
annotationTypes(info: Kex.AST.AnnotationInfo, paramLists: [[ParamSig]]) -> [String]
```

### `signatureTexts` (foul)

```kex
signatureTexts(fn: PendingFunction) -> [String]
```

A signature names every parameter WITH its type and ends in the result: `and(a: Integer, b: Integer) -> Integer`. The names come from a clause, the types from the annotation (flattened to the clause's arity), from the clause's own inline annotations, or — for a method nobody annotated — from its @param/@return tags. A zero-parameter function is still a function, written the way its definition is (`let sum -> Number`): `sum -> Number`. The `name : Type` form is left to constants. A method with no clause at all (a trait's required method) has only its type, and borrows parameter names from its @param tags when they line up.

### `plainSignature` (foul)

```kex
plainSignature(fn: PendingFunction, params: [ParamSig]) -> String
```

A signature built from the clause alone: inline types first, the doc tags as the fallback, bare names when neither says.

### `renderSignature` (foul)

```kex
renderSignature(info: Kex.AST.AnnotationInfo, fn: PendingFunction) -> String
```

### `docNamedSignature` (foul)

```kex
docNamedSignature(name: String, ref: Kex.AST.TypeRef, doc: Doc) -> String
```

An annotation with no clause to take names from: the @param tags name the parameters when there are exactly as many as the type has.

### `annotationSigil` (foul)

```kex
annotationSigil(info: Kex.AST.AnnotationInfo) -> String
```

A type that cannot be paired with a clause is shown as the source wrote it, sigil included: `:>` is what says the receiver is implied, and a plain `:` in its place would describe a function that takes no receiver.

### `unnamedSignature` (foul)

```kex
unnamedSignature(name: String, ref: Kex.AST.TypeRef) -> String
```

A function with nothing to name its parameters by still reads as a function: `combine(This) -> This`, and with none to take, `lines -> [String]`.

### `paramText` (foul)

```kex
paramText(name: String, typeName: String, hasDefault: Bool) -> String
```

### `parenthesized` (foul)

```kex
parenthesized(typeName: String) -> String
```

A function type inside a parameter list reads as the parameter's type only in parentheses: `f: (T -> Void)`, not `f: T -> Void`.

### `displayName` (foul)

```kex
displayName(p: ParamSig, index: Integer, fn: PendingFunction) -> String
```

A pattern parameter (`repeat(0)`) shows the name its @param tag gives that position, or `_` — never the literal, which reads as an argument.

### `ConversionName` (constant)

The conversion protocol: `value.to(String)` names the type to convert to. That argument is the type itself, so the pattern in the clause is what a caller writes and is shown as written. Anywhere else a capitalised pattern is a constructor being matched (`None`), not something to pass.



### `typeArgument?` (foul)

```kex
typeArgument?(pattern: String) -> Bool
```

### `docParamType` (foul)

```kex
docParamType(doc: Doc, name: String) -> String
```

### `bestParams` (foul)

```kex
bestParams(lists: [[ParamSig]]) -> [ParamSig]?
```

Of several clauses' parameter lists, the one that names the most parameters — `repeat(n: Integer)` over `repeat(0)` — merged with the types the other clauses of the same arity declare.

### `namedCount` (foul)

```kex
namedCount(list: [ParamSig]) -> Integer
```

### `withPeerType` (foul)

```kex
withPeerType(p: ParamSig, index: Integer, peers: [[ParamSig]]) -> ParamSig
```

### `signatureTypeText` (foul)

```kex
signatureTypeText(ref: Kex.AST.TypeRef) -> String
```

Source-style type text: function arrows chain to the right without the redundant parentheses typeRefText adds, and a function-typed parameter is parenthesized so `(X -> Y) -> Z` stays distinct from `X -> Y -> Z`.

### `signatureParamText` (foul)

```kex
signatureParamText(p: Kex.AST.TypeRef) -> String
```

### `annotationRef` (foul)

```kex
annotationRef(info: Kex.AST.AnnotationInfo) -> Kex.AST.TypeRef
```

### `matchingParamList` (foul)

```kex
matchingParamList(ref: Kex.AST.TypeRef, paramLists: [[ParamSig]]) -> [ParamSig]?
```

### `matchingParamLists` (foul)

```kex
matchingParamLists(ref: Kex.AST.TypeRef, paramLists: [[ParamSig]]) -> [[ParamSig]]
```

### `paramsMatch` (foul)

```kex
paramsMatch(ref: Kex.AST.TypeRef, names: [ParamSig]) -> Bool
```

### `flattenToArity` (foul)

```kex
flattenToArity(ref: Kex.AST.TypeRef, arity: Integer) -> Kex.AST.TypeRef
```

Absorbs curried layers until the type takes `arity` arguments: `FilePath -> Read -> Mode -> R` with arity 3 becomes `(FilePath, Read, Mode) -> R`. A type that runs out of layers first, or whose next layer would overshoot, is left where it stands.

### `clauseParams` (foul)

```kex
clauseParams(clause: Kex.AST.ClauseInfo) -> [ParamSig]
```

`type` is a keyword after `.`, so typed-record access goes through pattern matching instead.

`let factor(@Nanosecond) = ...` matches on the receiver: the pattern picks the clause and is not something a caller passes.

### `receiverPattern?` (foul)

```kex
receiverPattern?(p: Kex.AST.ParamInfo) -> Bool
```

### `paramSig` (foul)

```kex
paramSig(p: Kex.AST.ParamInfo) -> ParamSig
```

### `paramName` (foul)

```kex
paramName(p: Kex.AST.ParamInfo) -> String
```

### `annotationTypeOf` (foul)

```kex
annotationTypeOf(info: Kex.AST.ConstantInfo) -> String
```

### `fieldTypeName` (foul)

```kex
fieldTypeName(f: Kex.AST.FieldInfo) -> String
```

### `typeText` (foul)

```kex
typeText(ref: Kex.AST.TypeRef) -> String
```

### `typeTextOpt` (foul)

```kex
typeTextOpt(ref: Kex.AST.TypeRef?) -> String
```

### `qualify` (foul)

```kex
qualify(prefix: String, name: String) -> String
```

Modules may be written fully qualified (`module FS.File do` inside `module FS do`), so a dotted name already carries its prefix — never prepend twice. A short name gets the parent's prefix as usual.

### `stripExt` (foul)

```kex
stripExt(name: String) -> String
```

### `titleCase` (foul)

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

  - `name` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string)
  - `annotations` : [[Kex.AST.AnnotationInfo](../../../../prelude/0.4.0-rc.3-dev/kex/ast.md#record-kex-ast-annotationinfo)]
  - `paramLists` : [[[ParamSig](#record-tey-docgen-extract-paramsig)]]
  - `clauseCount` : [Integer](../../../../prelude/0.4.0-rc.3-dev/number.md#make-integer)
  - `doc` : [Doc](../../tey/docgen/model.md#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.3-dev/number.md#make-integer)
  - `returnType` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string) (optional)
  - `isFoul` : [Bool](../../../../prelude/0.4.0-rc.3-dev/truthyable.md#make-bool) (optional)



## record `ParamSig`

One parameter as a clause declares it. `named` is false for a pattern parameter (`let repeat(0) = ...`), whose spelling is a value, not a name a signature should show.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-rc.3-dev/string.md#make-string)
  - `named` : [Bool](../../../../prelude/0.4.0-rc.3-dev/truthyable.md#make-bool)
  - `hasDefault` : [Bool](../../../../prelude/0.4.0-rc.3-dev/truthyable.md#make-bool)


