---
package: tey
version: "0.2.1-dev"
source: tey/docgen/extract.kex
title: Tey.Docgen.Extract
entities:
  - { kind: module, name: "Tey.Docgen.Extract" }
---

# Tey.Docgen.Extract

Turns `Kex.AST` nodes into the typed entity model of `Tey.Docgen.Model`.

A declaration body mixes type annotations (`name : type`) with function definitions (`let name(args) ...`), and overloads repeat both. Functions are collected per name as `PendingFunction` records, keeping annotations and parameter lists apart, and finished only after the whole body is read: pairing an annotation's curried type with a clause's parameter names needs both.

## module `Tey.Docgen.Extract`

### `fileEntities`

```kex
fileEntities(items: [Kex.AST.Node]) -> [Entity]
```

### `pageFor`

```kex
pageFor(source: String, items: [Kex.AST.Node], header: String) -> SourcePage
```

Builds the page for one source file.

`header` is the file's opening comment, when a blank line separates it from what follows (`Index.fileHeader`). The AST reader attaches every comment above a declaration to it, blank lines included, so the first declaration's doc starts with the file's introduction. This cuts the header off that doc and keeps it as the page's intro; otherwise algebra.kex's "Algebraic structures: ..." would be the summary of `Monoid`.

### `detachHeader`

```kex
detachHeader(items: [Kex.AST.Node], header: String) -> [Kex.AST.Node]
```

Returns the items with the header removed from the first documented one.

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

Returns a page's title: the name of the declaration the file is about, spelled as the source spells it ("OptionParser", "FileHandle").

The title is a single top-level module if there is one, else a single top-level type, record or trait, else a declaration named like the file, else the file name in PascalCase.

### `namesStem?`

```kex
namesStem?(name: String, stem: String) -> Bool
```

Returns `true` when `name` is the name a file stem spells, ignoring case and underscores: `file_handle` names `FileHandle` (kexhq/kex#721), and `dns` names `DNS`.

### `baseSpelling`

```kex
baseSpelling(name: String) -> String
```

Returns the part of a name a file could be named after: "FileHandle<CanRead, W>" gives "FileHandle", and "FS.Path" gives "Path".

### `moduleTitle`

```kex
moduleTitle(entry: ModuleEntry, stem: String) -> String
```

Returns the title of a file with one top-level module.

The file name matters when several files share a module: data/queue.kex, set.kex and stack.kex all wrap their module in `module Data`, and titling each page "Data" would make the sidebar entries identical. So the title is the module if its last segment matches the file name ("dns.kex" gives Net.DNS), else a nested module that matches ("queue.kex" gives Data.Queue), else the top module ("mock.kex" gives Mock).

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

Returns the last segment of a path: "kex/ast" gives "ast".

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

Merges make blocks with the same target in one file, appending the later block's traits and functions to the first. Two `make Queue<A>` blocks, one for the collection traits and one for `Blankable`, read as one set of functions.

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

Converts one variant. It is a named function so that the element type of `v.fields` comes from `VariantInfo`, not from `VariantEntry`'s `[String]`.

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

### `constantBinding?`

```kex
constantBinding?(info: Kex.AST.FunctionInfo) -> Bool
```

Returns `true` for a binding with no parameter list that is not `foul`.

A `foul` binding with no parameter list is a zero-argument function that Kex calls each time it is named: `IO.getLine` reads a new line every time, so it is documented as a function. `IO.out`, always the same handle, is a constant.

### `noteConstant`

```kex
noteConstant(accum: [Pending], info: Kex.AST.FunctionInfo, prefix: String) -> [Pending]
```

### `constantFromPending`

```kex
constantFromPending(p: Pending, info: Kex.AST.FunctionInfo, prefix: String) -> Pending
```

Replaces the `PendingFunction` an earlier annotation created with a constant entry, keeping its name, doc and line.

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

Returns the return type the source declares: the annotation's result, or the inline `-> T` of an unannotated clause. The `@return` tag is checked against it (`Index.reportDocDrift`) and never shown in its place.

### `finalResult`

```kex
finalResult(ref: Kex.AST.TypeRef) -> Kex.AST.TypeRef
```

Returns the final result of a curried type: for `A -> (A -> T -> A) -> A` it is `A`.

### `docReturnType`

```kex
docReturnType(doc: Doc) -> String
```

### `functionTypes`

```kex
functionTypes(fn: PendingFunction) -> [String]
```

Returns the type names a function mentions: every parameter type and the result type of each annotation, without duplicates. Search uses them to find every function that takes or returns `Integer`.

### `annotationTypes`

```kex
annotationTypes(info: Kex.AST.AnnotationInfo, paramLists: [[ParamSig]]) -> [String]
```

### `signatureTexts`

```kex
signatureTexts(fn: PendingFunction) -> [String]
```

Returns the signatures shown for a function, one per annotation.

A signature names every parameter with its type and ends in the result: `and(a: Integer, b: Integer) -> Integer`. The names come from a clause. The types come from the annotation (flattened to the clause's arity), from the clause's inline annotations, or, for an unannotated function, from its `@param` and `@return` tags. A function with no parameters is written as its definition is (`let sum -> Number` gives `sum -> Number`); the `name : Type` form is kept for constants. A required trait function has no clause, only a type, and takes its parameter names from its `@param` tags when the counts match.

### `plainSignature`

```kex
plainSignature(fn: PendingFunction, params: [ParamSig]) -> String
```

Builds a signature from the clause alone: inline types first, then the doc tags, and bare names when neither gives a type.

### `renderSignature`

```kex
renderSignature(info: Kex.AST.AnnotationInfo, fn: PendingFunction) -> String
```

### `docNamedSignature`

```kex
docNamedSignature(name: String, ref: Kex.AST.TypeRef, doc: Doc) -> String
```

Builds a signature for an annotation with no clause, naming the parameters from the `@param` tags when there are exactly as many tags as the type has parameters.

### `annotationSigil`

```kex
annotationSigil(info: Kex.AST.AnnotationInfo) -> String
```

Returns the sigil an annotation was written with. A type that cannot be paired with a clause is shown as written, and `:>` is what says the receiver is implied; a plain `:` would describe a function with no receiver.

### `unnamedSignature`

```kex
unnamedSignature(name: String, ref: Kex.AST.TypeRef) -> String
```

Builds a signature with types but no parameter names, such as `combine(This) -> This`, or `lines -> [String]` when there are no parameters.

### `paramText`

```kex
paramText(name: String, typeName: String, optional: Bool) -> String
```

### `parenthesized`

```kex
parenthesized(typeName: String) -> String
```

Wraps a function type in parentheses, so a parameter reads `f: (T -> Void)`.

### `displayName`

```kex
displayName(p: ParamSig, index: Integer, fn: PendingFunction) -> String
```

Returns the name shown for a parameter. A pattern parameter (`repeat(0)`) shows the name its `@param` tag gives that position, or `_`, since the literal would read as an argument.

### `ConversionName` (constant)

The conversion function's name. In `value.to(String)` the argument is the type itself, so that clause's capitalised pattern is shown as written. Anywhere else a capitalised pattern is a constructor being matched (`None`) and is not shown.



### `typeArgument?`

```kex
typeArgument?(pattern: String) -> Bool
```

### `docParamType`

```kex
docParamType(doc: Doc, name: String) -> String
```

### `bestParams`

```kex
bestParams(lists: [[ParamSig]]) -> [ParamSig]?
```

Returns, of several clauses' parameter lists, the one that names the most parameters (`repeat(n: Integer)` over `repeat(0)`), with types filled in from the other clauses of the same arity.

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

Renders a type as source would write it: arrows chain to the right without the extra parentheses `typeRefText` adds, and a function-typed parameter is parenthesized, so `(X -> Y) -> Z` stays distinct from `X -> Y -> Z`.

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

### `paramsMatch?`

```kex
paramsMatch?(ref: Kex.AST.TypeRef, names: [ParamSig]) -> Bool
```

### `flattenToArity`

```kex
flattenToArity(ref: Kex.AST.TypeRef, arity: Integer) -> Kex.AST.TypeRef
```

Merges curried layers until the type takes `arity` arguments: `FilePath -> Read -> Mode -> R` with arity 3 becomes `(FilePath, Read, Mode) -> R`. A type that runs out of layers, or whose next layer would overshoot, is left as it is.

### `clauseParams`

```kex
clauseParams(clause: Kex.AST.ClauseInfo) -> [ParamSig]
```

Returns a clause's parameters, leaving out a receiver pattern: in `let factor(@Nanosecond) = ...` the pattern picks the clause and is not something a caller passes.

### `receiverPattern?`

```kex
receiverPattern?(p: Kex.AST.ParamInfo) -> Bool
```

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

Prefixes `name` with its parent module's name. A module may be written fully qualified (`module FS.File do` inside `module FS do`), so a name that already starts with the prefix is left alone.

### `stripExt`

```kex
stripExt(name: String) -> String
```

## type `Pending`

An accumulator entry: a finished entity, or a function still collecting its clauses.

**Variants**

  - `Done(Entity)`
  - `PendingFn(PendingFunction)`



## record `PendingFunction`

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `qualifiedName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `annotations` : [[Kex.AST.AnnotationInfo](../../../../prelude/0.4.0-rc.5-dev/kex/ast.md#record-kex-ast-annotationinfo)]
  - `paramLists` : [[[ParamSig](#record-tey-docgen-extract-paramsig)]]
  - `clauseCount` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `doc` : [Doc](../../tey/docgen/model.md#record-tey-docgen-model-doc)
  - `line` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `returnType` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `foul?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)



## record `ParamSig`

One parameter as a clause declares it. `named?` is `false` for a pattern parameter (`let repeat(0) = ...`), whose spelling is a value that a signature should not show as a name.

**Fields**

  - `name` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `typeName` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `named?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool)
  - `default?` : [Bool](../../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool)


