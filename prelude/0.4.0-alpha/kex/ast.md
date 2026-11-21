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

Parses Kex source code into a structured AST at runtime.

Returns `Result<Program, ParseError>` — the AST includes module definitions, function signatures, type/record definitions, traits, make blocks, and doc-comments extracted from `#` lines.

### `parse`

```kex
parse(source: String) -> Result<Program, ParseError>
parse(source: String, filename: String) -> Result<Program, ParseError>
```

Parses a Kex source string into a structured AST.

### `parseFile`

```kex
parseFile(path: FS.FilePath) -> Result<Program, ParseError>
```

Reads a file and parses it.

### `parseType`

```kex
parseType(source: String) -> Result<TypeRef, ParseError>
```

Parses a type expression string into a TypeRef.

### `parseExpression`

```kex
parseExpression(source: String) -> Result<Expression, ParseError>
```

Parses a single expression string into an Expression AST node.

### `typeRefText`

```kex
typeRefText(_) -> String
```

### `patternRefText`

```kex
patternRefText(_) -> String
```

### `patternFieldText`

```kex
patternFieldText(name, _, _) -> String
```

### `referenceText`

```kex
referenceText(_) -> String
```

## record `Location`

**Fields**

  - `file` : [String](../string.md#make-string)
  - `line` : [Integer](../number.md#make-integer)
  - `column` : [Integer](../number.md#make-integer)
  - `startOffset` : [Integer](../number.md#make-integer)
  - `endOffset` : [Integer](../number.md#make-integer)



## record `Program`

**Fields**

  - `schemaVersion` : [Integer](../number.md#make-integer)
  - `items` : [[Node](#type-kex-ast-node)]



## record `ParseError`

**Fields**

  - `message` : [String](../string.md#make-string)
  - `location` : [Location](#record-kex-ast-location)?



## type `TypeRef`

Structured representation of type expressions.

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

  - `name` : [String](../string.md#make-string)
  - `pattern` : [PatternRef](#type-kex-ast-patternref)?
  - `stringKey` : [Bool](../blankable.md#make-bool)



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

  - `name` : [String](../string.md#make-string)
  - `value` : [Expression](#type-kex-ast-expression)



## record `MatchArm`

**Fields**

  - `patterns` : [[PatternRef](#type-kex-ast-patternref)]
  - `guard` : [Expression](#type-kex-ast-expression)?
  - `body` : [Expression](#type-kex-ast-expression)



## record `LambdaParam`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `type` : [TypeRef](#type-kex-ast-typeref)?



## record `RescueInfo`

**Fields**

  - `arms` : [[MatchArm](#record-kex-ast-matcharm)]
  - `catchAllName` : [String](../string.md#make-string)?
  - `catchAllBody` : [[Expression](#type-kex-ast-expression)]
  - `inlineReturn` : [Expression](#type-kex-ast-expression)?



## record `ElseIf`

**Fields**

  - `condition` : [Expression](#type-kex-ast-expression)
  - `body` : [[Expression](#type-kex-ast-expression)]



## type `MapItem`

**Variants**

  - `MapEntry(Expression, Expression)`
  - `MapSpread(Expression)`



## record `RecordField`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `value` : [Expression](#type-kex-ast-expression)



## type `GeneratedTemplate`

A declaration template whose name (and, for a make block, target) is computed by a `compiled do` expression.

**Variants**

  - `GeneratedNode(Node)`
  - `GeneratedMake(GeneratedMakeInfo)`



## record `GeneratedMakeInfo`

**Fields**

  - `isFinal` : [Bool](../blankable.md#make-bool)
  - `implements` : [[TypeRef](#type-kex-ast-typeref)]
  - `body` : [[CompiledItem](#type-kex-ast-compileditem)]
  - `location` : [Location](#record-kex-ast-location)



## record `MainInfo`

**Fields**

  - `doc` : [String](../string.md#make-string)?
  - `params` : [[ParamInfo](#record-kex-ast-paraminfo)]
  - `body` : [[Expression](#type-kex-ast-expression)]
  - `rescueInfo` : [RescueInfo](#record-kex-ast-rescueinfo)?
  - `location` : [Location](#record-kex-ast-location)



## record `ParamInfo`

**Fields**

  - `name` : [String](../string.md#make-string)?
  - `pattern` : [PatternRef](#type-kex-ast-patternref)?
  - `type` : [TypeRef](#type-kex-ast-typeref)?
  - `hasDefault` : [Bool](../blankable.md#make-bool)



## record `ClauseInfo`

**Fields**

  - `params` : [[ParamInfo](#record-kex-ast-paraminfo)]
  - `body` : [[Expression](#type-kex-ast-expression)]
  - `returnType` : [TypeRef](#type-kex-ast-typeref)?
  - `rescueInfo` : [RescueInfo](#record-kex-ast-rescueinfo)?
  - `hasParamList` : [Bool](../blankable.md#make-bool)



## record `FunctionInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `isFoul` : [Bool](../blankable.md#make-bool)
  - `predicate` : [Bool](../blankable.md#make-bool)
  - `clauses` : [[ClauseInfo](#record-kex-ast-clauseinfo)]
  - `location` : [Location](#record-kex-ast-location)



## record `AnnotationInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `type` : [TypeRef](#type-kex-ast-typeref)
  - `doc` : [String](../string.md#make-string)?
  - `implicitThis` : [Bool](../blankable.md#make-bool)
  - `location` : [Location](#record-kex-ast-location)



## record `VariantInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `fields` : [[TypeRef](#type-kex-ast-typeref)]



## record `TypeInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `parents` : [[TypeRef](#type-kex-ast-typeref)]
  - `variants` : [[VariantInfo](#record-kex-ast-variantinfo)]?
  - `location` : [Location](#record-kex-ast-location)



## record `FieldInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `type` : [TypeRef](#type-kex-ast-typeref)
  - `hasDefault` : [Bool](../blankable.md#make-bool)



## record `RecordInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `fields` : [[FieldInfo](#record-kex-ast-fieldinfo)]
  - `location` : [Location](#record-kex-ast-location)



## record `TraitInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `body` : [[Node](#type-kex-ast-node)]
  - `location` : [Location](#record-kex-ast-location)



## record `MakeInfo`

**Fields**

  - `target` : [TypeRef](#type-kex-ast-typeref)
  - `isFinal` : [Bool](../blankable.md#make-bool)
  - `implements` : [[TypeRef](#type-kex-ast-typeref)]
  - `body` : [[Node](#type-kex-ast-node)]
  - `location` : [Location](#record-kex-ast-location)



## record `PragmaInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `value` : [String](../string.md#make-string)?
  - `location` : [Location](#record-kex-ast-location)



## record `ModuleInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `items` : [[Node](#type-kex-ast-node)]
  - `location` : [Location](#record-kex-ast-location)



## record `ConstantInfo`

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `type` : [TypeRef](#type-kex-ast-typeref)?
  - `location` : [Location](#record-kex-ast-location)



## record `VisibilityInfo`

**Fields**

  - `isPublic` : [Bool](../blankable.md#make-bool)
  - `items` : [[Node](#type-kex-ast-node)]
  - `location` : [Location](#record-kex-ast-location)



## record `UsingInfo`

**Fields**

  - `moduleName` : [String](../string.md#make-string)
  - `alias` : [String](../string.md#make-string)?
  - `onlyNames` : [[String](../string.md#make-string)]
  - `exceptNames` : [[String](../string.md#make-string)]
  - `body` : [[Expression](#type-kex-ast-expression)]
  - `location` : [Location](#record-kex-ast-location)



## record `ExportInfo`

**Fields**

  - `moduleName` : [String](../string.md#make-string)
  - `alias` : [String](../string.md#make-string)?
  - `onlyNames` : [[String](../string.md#make-string)]
  - `exceptNames` : [[String](../string.md#make-string)]
  - `location` : [Location](#record-kex-ast-location)



## type `CompiledItem`

**Variants**

  - `CompiledNode(Node)`
  - `CompiledExpression(Expression)`



## record `CompiledInfo`

**Fields**

  - `items` : [[CompiledItem](#type-kex-ast-compileditem)]
  - `location` : [Location](#record-kex-ast-location)



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



## type `TypeRef | PatternRef`

Source-like conversion through the standard `.to(String)` spelling.

### `to`

```kex
to(_) -> String?
```


