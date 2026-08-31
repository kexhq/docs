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

Opt-in: nothing here is in scope until `using Kex.AST`.

This is the entry point for tools that read Kex source: linters, formatters, documentation generators, code search. The AST includes module definitions, function signatures, type/record definitions, traits, make blocks, and the doc-comments extracted from `#` lines, which is how the standard library's own documentation is generated.

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

Pass `filename` when you have one: it is what appears in every `Location` and in the error message, so diagnostics can point at a real file.


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

Use it to read a type written in data: a signature in a config file, a type named on a command line. `typeRefText` renders the result back.


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

A list reads as `[Integer]`, a map as `{String: Integer}`, an optional as `String?`: the spelling a reader would recognise, not the constructor tree behind it.


```kex
typeRefText(NamedType(name, []))
```


## type `PatternRef`

Structured representation of patterns.

Pattern nodes describe what a declaration or match arm accepts; they do not contain runtime values. A linter can distinguish a wildcard from a binding, for example, without reparsing source text.



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

One field inside a record or map-shaped pattern.

`pattern` is `None` for shorthand such as `{ name }`. `stringKey` keeps `{"name": value}` distinct from the atom-key spelling `{ name: value }`.

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

The one call to reach for when a node may carry either: it dispatches to `typeRefText` or `patternRefText` as appropriate.


```kex
referenceText(NamedType(name, args))
```


## type `Expression`

Structured representation of expression AST nodes.

Expressions retain syntax-level distinctions that matter to tools: a method call is not flattened into a generic call, `var` is distinct from `let`, and a trailing `if` remains recognizable. Walk these constructors when writing a linter or code search; use `Evaluator` when the goal is to execute an expression rather than inspect it.



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

One `name: value` argument at a call site.

**Fields**

  - `name` : String
  - `value` : [Expression](#type-expression)

## record `MatchArm`

One arm of `match`, `receive`, or `rescue`.

Multiple `patterns` are the comma-separated alternatives on the left of the arrow. `guard` is absent when the arm has no `when` condition.

**Fields**

  - `patterns` : [[PatternRef](#type-patternref)]
  - `guard` : [Expression](#type-expression)?
  - `body` : [Expression](#type-expression)

## record `LambdaParam`

One lambda parameter and its optional source annotation.

**Fields**

  - `name` : String
  - `type` : [TypeRef](#type-typeref)?

## record `RescueInfo`

The structured recovery clauses attached to a function or expression.

Named rescue arms live in `arms`; a catch-all rescue keeps its optional binding and body separately. `inlineReturn` represents the compact rescue form rather than inventing a synthetic block.

**Fields**

  - `arms` : [[MatchArm](#record-matcharm)]
  - `catchAllName` : String?
  - `catchAllBody` : [[Expression](#type-expression)]
  - `inlineReturn` : [Expression](#type-expression)?

## record `ElseIf`

One `elif` branch, in source order.

**Fields**

  - `condition` : [Expression](#type-expression)
  - `body` : [[Expression](#type-expression)]

## type `MapItem`

One entry in a map literal: either a key/value pair or `...spread`.



**Variants**

  - `MapEntry(Expression, Expression)`
  - `MapSpread(Expression)`

## record `RecordField`

One explicitly initialized field in a record literal.

**Fields**

  - `name` : String
  - `value` : [Expression](#type-expression)

## type `GeneratedTemplate`

A declaration template whose name (and, for a make block, target) is computed by a `compiled do` expression.

Tools normally encounter this only while inspecting metaprogramming code. After expansion, generated declarations appear as ordinary `Node`s.



**Variants**

  - `GeneratedNode(Node)`
  - `GeneratedMake(GeneratedMakeInfo)`

## record `GeneratedMakeInfo`

The fixed portion of a generated `make` declaration.

**Fields**

  - `isFinal` : Bool
  - `implements` : [[TypeRef](#type-typeref)]
  - `body` : [[CompiledItem](#type-compileditem)]
  - `location` : [Location](#record-location)

## record `MainInfo`

The program entry point, including documentation and recovery clauses.

**Fields**

  - `doc` : String?
  - `params` : [[ParamInfo](#record-paraminfo)]
  - `body` : [[Expression](#type-expression)]
  - `rescueInfo` : [RescueInfo](#record-rescueinfo)?
  - `location` : [Location](#record-location)

## record `ParamInfo`

One declared function parameter.

`name` is absent for a destructuring parameter; `pattern` preserves that destructuring shape. `hasDefault` records whether an initializer appeared.

**Fields**

  - `name` : String?
  - `pattern` : [PatternRef](#type-patternref)?
  - `type` : [TypeRef](#type-typeref)?
  - `hasDefault` : Bool

## record `ClauseInfo`

One clause of a function, including its patterns and body.

Multi-clause functions place all clauses in one `FunctionInfo`, preserving source order so tooling can reason about which pattern is tried first.

**Fields**

  - `params` : [[ParamInfo](#record-paraminfo)]
  - `body` : [[Expression](#type-expression)]
  - `returnType` : [TypeRef](#type-typeref)?
  - `rescueInfo` : [RescueInfo](#record-rescueinfo)?
  - `hasParamList` : Bool

## record `FunctionInfo`

A named function and all of its pattern-matching clauses.

`doc` contains the normalized `#` comment immediately attached to the declaration. Documentation generators can therefore share the same parsed structure as linters instead of scanning comments independently.

**Fields**

  - `name` : String
  - `doc` : String?
  - `isFoul` : Bool
  - `predicate` : Bool
  - `clauses` : [[ClauseInfo](#record-clauseinfo)]
  - `location` : [Location](#record-location)

## record `AnnotationInfo`

A standalone function or method type signature.

`implicitThis` distinguishes `:>` methods from module-level `:` functions without making a tool inspect punctuation in the original source.

**Fields**

  - `name` : String
  - `type` : [TypeRef](#type-typeref)
  - `doc` : String?
  - `implicitThis` : Bool
  - `location` : [Location](#record-location)

## record `VariantInfo`

One constructor of an algebraic data type.

**Fields**

  - `name` : String
  - `fields` : [[TypeRef](#type-typeref)]

## record `TypeInfo`

A type alias or algebraic data type declaration.

`variants` is present for an ADT and absent for an alias or abstract type. `parents` preserves declared bounds and inherited type relationships.

**Fields**

  - `name` : String
  - `doc` : String?
  - `typeParams` : [String]
  - `parents` : [[TypeRef](#type-typeref)]
  - `variants` : [[VariantInfo](#record-variantinfo)]?
  - `location` : [Location](#record-location)

## record `FieldInfo`

One field declared by a record type.

**Fields**

  - `name` : String
  - `type` : [TypeRef](#type-typeref)
  - `hasDefault` : Bool

## record `RecordInfo`

A record declaration with fields in source order.

**Fields**

  - `name` : String
  - `doc` : String?
  - `typeParams` : [String]
  - `fields` : [[FieldInfo](#record-fieldinfo)]
  - `location` : [Location](#record-location)

## record `TraitInfo`

A trait declaration and the signatures or default methods in its body.

**Fields**

  - `name` : String
  - `doc` : String?
  - `typeParams` : [String]
  - `body` : [Node]
  - `location` : [Location](#record-location)

## record `MakeInfo`

A `make` implementation block.

`target` is the receiver type, `implements` lists explicit traits, and `body` retains methods and visibility sections in declaration order.

**Fields**

  - `target` : [TypeRef](#type-typeref)
  - `doc` : String?
  - `isFinal` : Bool
  - `implements` : [[TypeRef](#type-typeref)]
  - `body` : [Node]
  - `location` : [Location](#record-location)

## record `PragmaInfo`

A compiler pragma and its optional value.

**Fields**

  - `name` : String
  - `value` : String?
  - `location` : [Location](#record-location)

## record `ModuleInfo`

A module and its declarations in source order.

**Fields**

  - `name` : String
  - `doc` : String?
  - `items` : [Node]
  - `location` : [Location](#record-location)

## record `ConstantInfo`

A named constant declaration. The AST reader never evaluates its value.

**Fields**

  - `name` : String
  - `doc` : String?
  - `type` : [TypeRef](#type-typeref)?
  - `location` : [Location](#record-location)

## record `VisibilityInfo`

A `public` or `private` section and the declarations it contains.

**Fields**

  - `isPublic` : Bool
  - `items` : [Node]
  - `location` : [Location](#record-location)

## record `UsingInfo`

A `using` import, including aliasing, filters, and an optional scoped body.

**Fields**

  - `moduleName` : String
  - `alias` : String?
  - `onlyNames` : [String]
  - `exceptNames` : [String]
  - `body` : [[Expression](#type-expression)]
  - `location` : [Location](#record-location)

## record `ExportInfo`

An `export` declaration and its public-name filters.

**Fields**

  - `moduleName` : String
  - `alias` : String?
  - `onlyNames` : [String]
  - `exceptNames` : [String]
  - `location` : [Location](#record-location)

## type `CompiledItem`

One item inside a `compiled do` block before expansion.



**Variants**

  - `CompiledNode(Node)`
  - `CompiledExpression(Expression)`

## record `CompiledInfo`

A compile-time block and its declarations or expressions in source order.

**Fields**

  - `items` : [[CompiledItem](#type-compileditem)]
  - `location` : [Location](#record-location)

## type `Node`

Any top-level or declaration-level AST node.

A source tool can match only the declarations it understands and leave the rest alone. The program's `schemaVersion` lets persisted consumers reject a tree whose possible node shapes have changed.



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

Source-like conversion through the standard `to(String)` spelling.

Useful in diagnostics: a tool can interpolate the type or pattern it found without manually dispatching between the two reference families.


#### `to`

```kex
to(String)
```
