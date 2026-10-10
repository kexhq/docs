---
package: prelude
version: "0.3.3"
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

### `parse`

```kex
parse : String -> Result<Program, ParseError>
parse : String -> String -> Result<Program, ParseError>
```

Parses a Kex source string into a structured AST.

### `parseFile`

```kex
parseFile : FS.FilePath -> Result<Program, ParseError>
```

Reads a file and parses it.

### `parseType`

```kex
parseType : String -> Result<TypeRef, ParseError>
```

Parses a type expression string into a TypeRef.

### `parseExpression`

```kex
parseExpression : String -> Result<Expression, ParseError>
```

Parses a single expression string into an Expression AST node.

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

### Methods

#### `toString`

```kex
toString : String
```

Pretty-prints the type reference to a human-readable string.

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

### Methods

#### `toString`

```kex
toString : String
```

Pretty-prints the pattern to a human-readable string.

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


