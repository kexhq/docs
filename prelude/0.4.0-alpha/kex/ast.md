---
package: prelude
version: "0.4.0-alpha"
source: kex/ast.kex
title: Kex.AST
entities:
  - { kind: module, name: "Kex.AST" }
---

# Kex.AST

## module `Kex.AST`

Parses Kex source code into a structured AST, at run time.

Opt-in — nothing here is in scope until `using Kex.AST`.

This is the entry point for tools that read Kex source: linters, formatters, documentation generators, code search. The AST includes module definitions, function signatures, type/record definitions, traits, make blocks, and the doc-comments extracted from `#` lines — which is how the standard library's own documentation is generated.

```kex
using Kex.AST

main do
  match Kex.AST.parseFile("src/main.kex") do
    Ok(program) => IO.printLine("${program.items.count} top-level items")
    Error(e)    => IO.printError(e.message)
  end
end
```

Everything answers a `Result`, so a source file that does not parse is a value you handle rather than an exception.

## record `Location`

Where in a source file something appeared.

Line and column are 1-based, for reporting to a person; the offsets are 0-based byte positions, for slicing the source.

**Fields**

  - `file` : String
  - `line` : Integer
  - `column` : Integer
  - `startOffset` : Integer
  - `endOffset` : Integer

## record `Program`

A parsed source file: its schema version, and its top-level items.

**Fields**

  - `schemaVersion` : Integer
  - `items` : [Node]

## record `ParseError`

Why a source file could not be parsed.

**Fields**

  - `message` : String
  - `location` : [Location](#record-location)?

## function `parse`

Parses Kex source text into a structured AST.

Pass `filename` when you have one — it is what appears in every `Location` and in the error message, so diagnostics can point at a real file.


```kex
parse(source) : String -> Result<Program, ParseError>
parse(source) : String -> String -> Result<Program, ParseError>
```


## function `parseFile`

Reads a file and parses it, reporting locations against its path.

A file that cannot be read is an `Error` like one that cannot be parsed.


```kex
parseFile(path) : FS.FilePath -> Result<Program, ParseError>
```


## function `parseType`

Parses a type expression on its own, without a surrounding program.

Use it to read a type written in data — a signature in a config file, a type named on a command line. `typeRefText` renders the result back.


```kex
parseType(source) : String -> Result<TypeRef, ParseError>
```


## function `parseExpression`

Parses a single expression on its own, without a surrounding program.

This gives you the expression's SHAPE. To evaluate one instead, use `Evaluator.runExpression`.


```kex
parseExpression(source) : String -> Result<Expression, ParseError>
```


## type `TypeRef`

A type as it was written in source.

`typeRefText` renders one back to the source spelling.



**Variants**

  - `NamedType(String, [TypeRef])`
  - `FunctionType([TypeRef], TypeRef)`
  - `TupleType([TypeRef])`
  - `ListType(TypeRef)`
  - `MapType(TypeRef, TypeRef)`
  - `UnionType([TypeRef])`
  - `IntersectionType([TypeRef])`
  - `RecordType([(String, TypeRef)])`
  - `NullableType(TypeRef)`
  - `BlockType(TypeRef)`
  - `AtomType(String)`
  - `TypeQuery(String, Expression)`
  - `TypeVar(String)`
  - `AnyType`
  - `NoneType`

## function `typeRefText`

Renders a `TypeRef` back to the way it is written in source.

A list reads as `[Integer]`, a map as `{String: Integer}`, an optional as `String?` — the spelling a reader would recognise, not the constructor tree behind it.


```kex
typeRefText(NamedType(name, []))
```


## type `PatternRef`

Structured representation of patterns.



**Variants**

  - `BindPattern(String)`
  - `LiteralPattern(String)`
  - `ConstructorPattern(String, [PatternRef])`
  - `TuplePattern([PatternRef])`
  - `ListPattern([PatternRef], PatternRef?)`
  - `RecordPattern(String?, [PatternField])`
  - `RangePattern(PatternRef, PatternRef)`
  - `ThisPattern(PatternRef)`
  - `WildcardPattern`

## record `PatternField`

**Fields**

  - `name` : String
  - `pattern` : [PatternRef](#type-patternref)?
  - `stringKey` : Bool

## function `patternRefText`

Renders a `PatternRef` back to the way it is written in source.


```kex
patternRefText(BindPattern(name))
```


## function `patternFieldText`


```kex
patternFieldText(PatternField { name, pattern, stringKey })
```


## function `referenceText`

Renders either a type or a pattern back to source.

The one call to reach for when a node may carry either — it dispatches to `typeRefText` or `patternRefText` as appropriate.


```kex
referenceText(NamedType(name, args))
```


## type `Expression`

Structured representation of expression AST nodes.



**Variants**

  - `LitInt(Int)`
  - `LitFloat(Float)`
  - `LitChar(Int)`
  - `LitString(String)`
  - `InterpolatedString([String], [Expression])`
  - `LitBool(Bool)`
  - `LitAtom(String)`
  - `LitNone`
  - `Identifier(String)`
  - `This`
  - `BinaryOp(Expression, String, Expression)`
  - `UnaryOp(String, Expression)`
  - `Call(Expression, [Expression], [NamedArgument], Expression?)`
  - `TaggedLiteral(String, [String], [Expression])`
  - `MethodCall(Expression, String, [Expression], [NamedArgument], Expression?, Bool, Bool, TypeRef?)`
  - `If(Expression, PatternRef?, [Expression], [ElseIf], [Expression]?)`
  - `Match(Expression, String?, [MatchArm])`
  - `Receive(String?, [MatchArm], Expression?, Expression?)`
  - `ListLit([Expression], Expression?)`
  - `MapLit([MapItem])`
  - `RecordLit(String, [RecordField])`
  - `TupleLit([Expression])`
  - `Block([Expression])`
  - `Lambda([LambdaParam], [Expression], TypeRef?, RescueInfo?)`
  - `Let(PatternRef, TypeRef?, Expression)`
  - `Var(String, TypeRef?, Expression)`
  - `Assign(String, Expression)`
  - `Return(Expression)`
  - `Break`
  - `Next`
  - `Spawn([Expression])`
  - `Try(Expression)`
  - `Spread(Expression)`
  - `TrailingIf(Expression, Expression)`
  - `ThenElse(Expression, Expression, Expression)`
  - `ShorthandLambda(String, [Expression], Bool)`
  - `CurryPlaceholder`
  - `Curry(String, String?, Bool, [[Expression]])`
  - `Using(String, String?, [String], [String], [Expression])`
  - `With(String, Expression, [Expression])`
  - `GeneratedDeclaration(Expression, GeneratedTemplate)`
  - `ErrorExpression(String)`
  - `Trying([Expression], RescueInfo)`
  - `While(Expression, [Expression])`
  - `Loop([String], [Expression])`
  - `RangeLit(Expression, Expression)`

## record `NamedArgument`

**Fields**

  - `name` : String
  - `value` : [Expression](#type-expression)

## record `MatchArm`

**Fields**

  - `patterns` : [[PatternRef](#type-patternref)]
  - `guard` : [Expression](#type-expression)?
  - `body` : [Expression](#type-expression)

## record `LambdaParam`

**Fields**

  - `name` : String
  - `type` : [TypeRef](#type-typeref)?

## record `RescueInfo`

**Fields**

  - `arms` : [[MatchArm](#record-matcharm)]
  - `catchAllName` : String?
  - `catchAllBody` : [[Expression](#type-expression)]
  - `inlineReturn` : [Expression](#type-expression)?

## record `ElseIf`

**Fields**

  - `condition` : [Expression](#type-expression)
  - `body` : [[Expression](#type-expression)]

## type `MapItem`



**Variants**

  - `MapEntry(Expression, Expression)`
  - `MapSpread(Expression)`

## record `RecordField`

**Fields**

  - `name` : String
  - `value` : [Expression](#type-expression)

## type `GeneratedTemplate`

A declaration template whose name (and, for a make block, target) is computed by a `compiled do` expression.



**Variants**

  - `GeneratedNode(Node)`
  - `GeneratedMake(GeneratedMakeInfo)`

## record `GeneratedMakeInfo`

**Fields**

  - `isFinal` : Bool
  - `implements` : [[TypeRef](#type-typeref)]
  - `body` : [[CompiledItem](#type-compileditem)]
  - `location` : [Location](#record-location)

## record `MainInfo`

**Fields**

  - `doc` : String?
  - `params` : [[ParamInfo](#record-paraminfo)]
  - `body` : [[Expression](#type-expression)]
  - `rescueInfo` : [RescueInfo](#record-rescueinfo)?
  - `location` : [Location](#record-location)

## record `ParamInfo`

**Fields**

  - `name` : String?
  - `pattern` : [PatternRef](#type-patternref)?
  - `type` : [TypeRef](#type-typeref)?
  - `hasDefault` : Bool

## record `ClauseInfo`

**Fields**

  - `params` : [[ParamInfo](#record-paraminfo)]
  - `body` : [[Expression](#type-expression)]
  - `returnType` : [TypeRef](#type-typeref)?
  - `rescueInfo` : [RescueInfo](#record-rescueinfo)?
  - `hasParamList` : Bool

## record `FunctionInfo`

**Fields**

  - `name` : String
  - `doc` : String?
  - `isFoul` : Bool
  - `predicate` : Bool
  - `clauses` : [[ClauseInfo](#record-clauseinfo)]
  - `location` : [Location](#record-location)

## record `AnnotationInfo`

**Fields**

  - `name` : String
  - `type` : [TypeRef](#type-typeref)
  - `doc` : String?
  - `implicitThis` : Bool
  - `location` : [Location](#record-location)

## record `VariantInfo`

**Fields**

  - `name` : String
  - `fields` : [[TypeRef](#type-typeref)]

## record `TypeInfo`

**Fields**

  - `name` : String
  - `doc` : String?
  - `typeParams` : [String]
  - `parents` : [[TypeRef](#type-typeref)]
  - `variants` : [[VariantInfo](#record-variantinfo)]?
  - `location` : [Location](#record-location)

## record `FieldInfo`

**Fields**

  - `name` : String
  - `type` : [TypeRef](#type-typeref)
  - `hasDefault` : Bool

## record `RecordInfo`

**Fields**

  - `name` : String
  - `doc` : String?
  - `typeParams` : [String]
  - `fields` : [[FieldInfo](#record-fieldinfo)]
  - `location` : [Location](#record-location)

## record `TraitInfo`

**Fields**

  - `name` : String
  - `doc` : String?
  - `typeParams` : [String]
  - `body` : [Node]
  - `location` : [Location](#record-location)

## record `MakeInfo`

**Fields**

  - `target` : [TypeRef](#type-typeref)
  - `doc` : String?
  - `isFinal` : Bool
  - `implements` : [[TypeRef](#type-typeref)]
  - `body` : [Node]
  - `location` : [Location](#record-location)

## record `PragmaInfo`

**Fields**

  - `name` : String
  - `value` : String?
  - `location` : [Location](#record-location)

## record `ModuleInfo`

**Fields**

  - `name` : String
  - `doc` : String?
  - `items` : [Node]
  - `location` : [Location](#record-location)

## record `ConstantInfo`

**Fields**

  - `name` : String
  - `doc` : String?
  - `type` : [TypeRef](#type-typeref)?
  - `location` : [Location](#record-location)

## record `VisibilityInfo`

**Fields**

  - `isPublic` : Bool
  - `items` : [Node]
  - `location` : [Location](#record-location)

## record `UsingInfo`

**Fields**

  - `moduleName` : String
  - `alias` : String?
  - `onlyNames` : [String]
  - `exceptNames` : [String]
  - `body` : [[Expression](#type-expression)]
  - `location` : [Location](#record-location)

## record `ExportInfo`

**Fields**

  - `moduleName` : String
  - `alias` : String?
  - `onlyNames` : [String]
  - `exceptNames` : [String]
  - `location` : [Location](#record-location)

## type `CompiledItem`



**Variants**

  - `CompiledNode(Node)`
  - `CompiledExpression(Expression)`

## record `CompiledInfo`

**Fields**

  - `items` : [[CompiledItem](#type-compileditem)]
  - `location` : [Location](#record-location)

## type `Node`



**Variants**

  - `ModuleDef(ModuleInfo)`
  - `FunctionDef(FunctionInfo)`
  - `TypeAnnotation(AnnotationInfo)`
  - `TypeDef(TypeInfo)`
  - `RecordDef(RecordInfo)`
  - `TraitDef(TraitInfo)`
  - `MakeDef(MakeInfo)`
  - `PragmaDef(PragmaInfo)`
  - `ConstantDef(ConstantInfo)`
  - `MainDef(MainInfo)`
  - `Visibility(VisibilityInfo)`
  - `UsingDef(UsingInfo)`
  - `ExportDef(ExportInfo)`
  - `Compiled(CompiledInfo)`

## make `TypeRef | PatternRef`

Source-like conversion through the standard `.to(String)` spelling.


#### `to`

```kex
to(String)
```
