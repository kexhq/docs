---
package: tey
version: "0.2.0-dev"
source: tey/docgen/extract.kex
title: Tey.Docgen.Extract
entities:
  - { kind: module, name: "Tey.Docgen.Extract" }
---

# Tey.Docgen.Extract

## module `Tey.Docgen.Extract`

Kex.AST nodes → the typed entity model (Tey.Docgen.Model).

Declaration bodies interleave TypeAnnotations (`name : type`) with FunctionDefs (`let name(args) ...`); overloads repeat both. Functions are collected per name as PendingFunction records (annotations + parameter lists kept apart), then finalised once the body is fully walked, because pairing an annotation's curried type with a clause's parameter names needs both sides.

## function `fileEntities`


```kex
fileEntities(items)
```


## function `pageFor`


```kex
pageFor(source, items)
```


## function `pageTitle`

A page's title is the declaration it is really about — "OptionParser", not the file name's "Optionparser", and "FileHandle", not "Filehandle". Preference order: a single top-level module, then a single top-level type/record/trait, then the file name title-cased.


```kex
pageTitle(source, entities)
```


## function `baseSpelling`

"FileHandle<CanRead, W>" -> "FileHandle", "FS.Path" -> "Path": what the file could plausibly be named after.


```kex
baseSpelling(name)
```


## function `moduleTitle`

The title of a file with one top-level module. The file's stem has a say when the module is shared across several files: data/queue.kex declares `module Data` around `module Queue`, and so do set.kex and stack.kex — without the stem, every one of those pages is titled "Data" and the sidebar shows indistinguishable entries. A module whose last segment matches the stem is the page ("dns.kex" -> Net.DNS); else a nested module matching it is ("queue.kex" -> Data.Queue); else the top module stands ("mock.kex" -> Mock, a file about the family).


```kex
moduleTitle(entry, stem)
```


## function `lastSegmentMatches?`


```kex
lastSegmentMatches?(qualifiedName, stem)
```


## function `nestedModuleNamed`


```kex
nestedModuleNamed(children, stem)
```


## function `fileStem`

"kex/ast" -> "ast".


```kex
fileStem(path)
```


## function `entitiesIn`


```kex
entitiesIn(body, prefix)
```


## type `Pending`

Accumulator entries: finished entities or functions still collecting.



**Variants**

  - `Done(Entity)`
  - `PendingFn(PendingFunction)`

## record `PendingFunction`

**Fields**

  - `name` : String
  - `qualifiedName` : String
  - `annotations` : [Kex.AST.AnnotationInfo]
  - `paramLists` : [[String]]
  - `clauseCount` : Integer
  - `doc` : [Doc](../../tey/docgen/model.md#record-doc)
  - `line` : Integer

## function `bodyEntities`


```kex
bodyEntities(body, prefix, accum)
```


## function `finalize`


```kex
finalize(accum)
```


## function `finalizeOne`


```kex
finalizeOne(p)
```


## function `typeEntity`


```kex
typeEntity(info, prefix)
```


## function `variantEntry`

A named helper (rather than an inline lambda) so the element type of `v.fields` comes from VariantInfo, not from VariantEntry's [String].


```kex
variantEntry(v)
```


## function `recordEntity`


```kex
recordEntity(info, prefix)
```


## function `traitEntity`


```kex
traitEntity(info, prefix)
```


## function `makeEntity`


```kex
makeEntity(info)
```


## function `moduleEntity`


```kex
moduleEntity(info, prefix)
```


## function `constantEntity`


```kex
constantEntity(info, prefix)
```


## function `functionEntries`


```kex
functionEntries(body, prefix)
```


## function `noteAnnotation`


```kex
noteAnnotation(accum, info, prefix)
```


## function `addAnnotation`


```kex
addAnnotation(p, info)
```


## function `noteFunction`


```kex
noteFunction(accum, info, prefix)
```


## function `isConstantBinding`

A binding with no parameter list is a constant — unless it is `foul`, in which case it is a zero-argument FUNCTION that Kex auto-calls. `IO.out` is a handle that is always the same one; `IO.getLine` reads a new line every time it is named, and calling that a constant is a lie about both what it does and when it happens.


```kex
isConstantBinding(info)
```


## function `noteConstant`


```kex
noteConstant(accum, info, prefix)
```


## function `constantFromPending`

The annotation arrived first and created a PendingFunction; the binding now replaces it with the constant entry, keeping name/doc/line.


```kex
constantFromPending(p, info, prefix)
```


## function `returnTypeText`


```kex
returnTypeText(info)
```


## function `addClause`


```kex
addClause(p, info, paramNames)
```


## function `findPending`


```kex
findPending(accum, name)
```


## function `indexedFind`


```kex
indexedFind(accum, name, index)
```


## function `finalizeFunction`


```kex
finalizeFunction(fn)
```


## function `functionTypes`

The type names a function is about — every parameter type plus the result type of each annotation, deduplicated. This is what lets search answer "what touches Integer" rather than just "what is called Integer".


```kex
functionTypes(annotations, paramLists)
```


## function `annotationTypes`


```kex
annotationTypes(info, paramLists)
```


## function `signatureTexts`

A function's signature is its EXACT Kex type — `Integer -> Integer -> Integer`, written the way Kex reads it (curried, right-associative) — rather than the flattened clause form. The parameter NAMES ride along before the colon (`and(a, b) : Integer -> Integer -> Integer`) so the names stay visible without flattening the type; an abstract method has no clause, so it shows only `name : Type`. Without an annotation there is no type to show, and the names stand alone.


```kex
signatureTexts(fn)
```


## function `renderSignature`


```kex
renderSignature(info, paramLists)
```


## function `signatureTypeText`

Source-style type text: function arrows chain to the right without the redundant parentheses typeRefText adds, and a function-typed parameter is parenthesized so `(X -> Y) -> Z` stays distinct from `X -> Y -> Z`.


```kex
signatureTypeText(ref)
```


## function `signatureParamText`


```kex
signatureParamText(p)
```


## function `annotationRef`


```kex
annotationRef(info)
```


## function `matchingParamList`


```kex
matchingParamList(ref, paramLists)
```


## function `paramsMatch`


```kex
paramsMatch(ref, names)
```


## function `flattenToArity`

Absorbs single-parameter curried layers while more than one argument remains. `(FilePath) -> (Read) -> R` with arity 2 becomes `(FilePath, Read) -> R`.


```kex
flattenToArity(ref, arity)
```


## function `clauseParamNames`

`type` is a keyword after `.`, so typed-record access goes through pattern matching instead.


```kex
clauseParamNames(clause)
```


## function `paramName`


```kex
paramName(p)
```


## function `annotationTypeOf`


```kex
annotationTypeOf(info)
```


## function `fieldTypeName`


```kex
fieldTypeName(f)
```


## function `typeText`


```kex
typeText(ref)
```


## function `typeTextOpt`


```kex
typeTextOpt(ref)
```


## function `qualify`

Modules may be written fully qualified (`module FS.File do` inside `module FS do`), so a dotted name already carries its prefix — never prepend twice. A short name gets the parent's prefix as usual.


```kex
qualify(prefix, name)
```


## function `stripExt`


```kex
stripExt(name)
```


## function `titleCase`


```kex
titleCase(s)
```

