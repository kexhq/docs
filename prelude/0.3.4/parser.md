---
package: prelude
version: "0.3.4"
source: parser.kex
title: Parser
entities:
  - { kind: module, name: "Parser" }
---

# Parser

## module `Parser`

Parses Kex source code into a structured AST at runtime.

Returns `Result<Program, ParseError>` — the AST includes module definitions, function signatures, type/record definitions, traits, make blocks, and doc-comments extracted from `#` lines.

Function bodies are intentionally omitted from the output.

## function `parse`

Parses a Kex source string into a structured AST.


```kex
parse : String -> Result<Program, ParseError>
parse : String -> String -> Result<Program, ParseError>
```


## function `parseFile`

Reads a file and parses it.


```kex
parseFile : FS.FilePath -> Result<Program, ParseError>
```


## function `parseType`

Parses a type expression string into a TypeRef.


```kex
parseType : String -> Result<TypeRef, ParseError>
```


## function `parseExpression`

Parses a single expression string into an Expression AST node.


```kex
parseExpression : String -> Result<Expression, ParseError>
```


## type `TypeRef`

Structured representation of type expressions.



**Variants**

  - `NamedType(String, [TypeRef])`
  - `FunctionType([TypeRef], TypeRef)`
  - `TupleType([TypeRef])`
  - `ListType(TypeRef)`
  - `MapType(TypeRef, TypeRef)`
  - `UnionType([TypeRef])`
  - `NullableType(TypeRef)`
  - `TypeVar(String)`
  - `AnyType`
  - `NoneType`

## make `TypeRef`


#### `toString`

Pretty-prints the type reference to a human-readable string.

```kex
toString : String
```

## type `PatternRef`

Structured representation of patterns.



**Variants**

  - `BindPattern(String)`
  - `LiteralPattern(String)`
  - `ConstructorPattern(String, [PatternRef])`
  - `TuplePattern([PatternRef])`
  - `ListPattern([PatternRef])`
  - `WildcardPattern`
  - `GuardedPattern(PatternRef, String)`

## make `PatternRef`


#### `toString`

Pretty-prints the pattern to a human-readable string.

```kex
toString : String
```

## type `Expression`

Structured representation of expression AST nodes.



**Variants**

  - `LitInt(Int)`
  - `LitFloat(Float)`
  - `LitString(String)`
  - `InterpolatedString([String], [Expression])`
  - `LitBool(Bool)`
  - `LitAtom(Atom)`
  - `LitNone`
  - `Identifier(String)`
  - `BinaryOp(Expression, String, Expression)`
  - `UnaryOp(String, Expression)`
  - `Call(Expression, [Expression])`
  - `TaggedLiteral(String, [String], [Expression])`
  - `MethodCall(Expression, String, [Expression])`
  - `If(Expression, [Expression], [Expression]?)`
  - `Match(Expression, [Expression])`
  - `ListLit([Expression])`
  - `TupleLit([Expression])`
  - `Block([Expression])`
  - `Lambda([String], [Expression])`
  - `Let(String, Expression)`
  - `Var(String, Expression)`
  - `Assign(String, Expression)`
  - `Return(Expression)`
  - `Spread(Expression)`
  - `TrailingIf(Expression, Expression)`
  - `While(Expression, [Expression])`
  - `Loop([Expression])`
  - `RangeLit(Expression, Expression)`
