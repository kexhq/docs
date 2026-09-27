---
package: prelude
version: "0.4.0-alpha.2"
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

### `parse`

```kex
parse(source: String) -> Result<Program, ParseError>
parse(source: String, filename: String) -> Result<Program, ParseError>
```

Parses Kex source text into a structured AST.

Pass `filename` when you have one — it is what appears in every `Location` and in the error message, so diagnostics can point at a real file.

**Parameters**

  - `source` — the Kex source text
  - `filename` — the name to report locations against; optional

**Returns**: the parsed program, or why it failed

**Examples**

```kex
Kex.AST.parse("let double(n: Integer) -> Integer = n * 2\n")
# => Ok(Program { schemaVersion: 2, items: [...] })
Kex.AST.parse("let x =").error?   # => true
```

_Counting a file's top-level items_

```kex
Kex.AST.parse(source, "main.kex").map { |p| p.items.count }
```

### `parseFile`

```kex
parseFile(path: FS.FilePath) -> Result<Program, ParseError>
```

Reads a file and parses it, reporting locations against its path.

A file that cannot be read is an `Error` like one that cannot be parsed.

**Parameters**

  - `path` — the file to read and parse

**Returns**: the parsed program, or why it failed

**Examples**

```kex
match Kex.AST.parseFile("src/main.kex") do
  Ok(program) => IO.printLine("${program.items.count} items")
  Error(e)    => IO.printError(e.message)
end
```

_Parsing every source in a directory_

```kex
FS.Directory.files(dir)
  .or([])
  .filter { |f| FS.Path.extension(f) == ".kex" }
  .map { |f| Kex.AST.parseFile(FS.Path.join(dir, f)) }
```

### `parseType`

```kex
parseType(source: String) -> Result<TypeRef, ParseError>
```

Parses a type expression on its own, without a surrounding program.

Use it to read a type written in data — a signature in a config file, a type named on a command line. `typeRefText` renders the result back.

**Parameters**

  - `source` — the type expression

**Returns**: the parsed type, or why it failed

**Examples**

```kex
Kex.AST.parseType("[Integer]").map { |t| Kex.AST.typeRefText(t) }
# => Ok("[Integer]")
Kex.AST.parseType("Map<String, Integer>").map { |t| Kex.AST.typeRefText(t) }
# => Ok("Map<String, Integer>")
```

### `parseExpression`

```kex
parseExpression(source: String) -> Result<Expression, ParseError>
```

Parses a single expression on its own, without a surrounding program.

This gives you the expression's SHAPE. To evaluate one instead, use `Evaluator.runExpression`.

**Parameters**

  - `source` — the expression text

**Returns**: the parsed expression, or why it failed

**Examples**

```kex
Kex.AST.parseExpression("1 + 2").ok?   # => true
Kex.AST.parseExpression("1 +").ok?     # => false
```

### `typeRefText`

```kex
typeRefText(typeRef: TypeRef) -> String
```

Renders a `TypeRef` back to the way it is written in source.

A list reads as `[Integer]`, a map as `{String: Integer}`, an optional as `String?` — the spelling a reader would recognise, not the constructor tree behind it.

**Parameters**

  - `typeRef` — the parsed type

**Returns**: the type, as source

**Examples**

```kex
Kex.AST.parseType("[Integer]").map { |t| Kex.AST.typeRefText(t) }
# => Ok("[Integer]")
Kex.AST.parseType("String?").map { |t| Kex.AST.typeRefText(t) }
# => Ok("String?")
```

### `patternRefText`

```kex
patternRefText(patternRef: PatternRef) -> String
```

Renders a `PatternRef` back to the way it is written in source.

**Parameters**

  - `patternRef` — the parsed pattern

**Returns**: the pattern, as source

**Examples**

```kex
Kex.AST.patternRefText(WildcardPattern)             # => "_"
Kex.AST.patternRefText(BindPattern("n"))            # => "n"
```

### `patternFieldText`

```kex
patternFieldText(name, _, _) -> String
```

### `referenceText`

```kex
referenceText(reference: TypeRef | PatternRef) -> String
```

Renders either a type or a pattern back to source.

The one call to reach for when a node may carry either — it dispatches to `typeRefText` or `patternRefText` as appropriate.

**Parameters**

  - `reference` — the parsed node

**Returns**: the node, as source

**Examples**

```kex
Kex.AST.referenceText(WildcardPattern)   # => "_"
Kex.AST.referenceText(AnyType)           # => "Any"
```

## record `Location`

Where in a source file something appeared.

Line and column are 1-based, for reporting to a person; the offsets are 0-based byte positions, for slicing the source.

**Fields**

  - `file` : [String](../string.md#make-string)
  - `line` : [Integer](../number.md#make-integer)
  - `column` : [Integer](../number.md#make-integer)
  - `startOffset` : [Integer](../number.md#make-integer)
  - `endOffset` : [Integer](../number.md#make-integer)



## record `Program`

A parsed source file: its schema version, and its top-level items.

**Fields**

  - `schemaVersion` : [Integer](../number.md#make-integer)
  - `items` : [Node]



## record `ParseError`

Why a source file could not be parsed.

**Fields**

  - `message` : [String](../string.md#make-string)
  - `location` : [Location](#record-kex-ast-location)?



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
  - `body` : [Node]
  - `location` : [Location](#record-kex-ast-location)



## record `MakeInfo`

**Fields**

  - `target` : [TypeRef](#type-kex-ast-typeref)
  - `doc` : [String](../string.md#make-string)?
  - `isFinal` : [Bool](../blankable.md#make-bool)
  - `implements` : [[TypeRef](#type-kex-ast-typeref)]
  - `body` : [Node]
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
  - `items` : [Node]
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
  - `items` : [Node]
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


