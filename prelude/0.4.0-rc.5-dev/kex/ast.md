---
package: prelude
version: "0.4.0-rc.5-dev"
source: kex/ast.kex
title: Kex.AST
entities:
  - { kind: module, name: "Kex.AST" }
---

# Kex.AST

## module `Kex.AST`

Parses Kex source code into a structured AST, at run time.

Nothing here is in scope until `using Kex.AST`.

Use it to write tools that read Kex source, such as linters, formatters, documentation generators and code search. The AST covers modules, function signatures, types and records, traits, make blocks, and the doc comments attached to them; `tey docs` builds the standard library's reference from it.

```kex
using Kex.AST

main do
  match Kex.AST.parseFile("src/main.kex") do
    Ok(program) => IO.printLine("${program.items.count} top-level items")
    Error(e)    => IO.printError(e.message)
  end
end
```

The parsing functions return a `Result`, with a `ParseError` when the source does not parse.

### `parse`

```kex
parse(source: String) -> Result<Program, ParseError>
parse(source: String, filename: String) -> Result<Program, ParseError>
```

Parses Kex source text into a structured AST.

Pass `filename` when you have one; it is recorded in every `Location`, including the one in a `ParseError`.

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

A file that cannot be read also gives an `Error`, with no location.

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

Use it for a type that arrives as text, such as a signature in a config file or a type named on the command line. `typeRefText` renders the result back.

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

This gives the expression's structure. To evaluate it, use `Evaluator.runExpression`.

**Parameters**

  - `source` — the expression text

**Returns**: the parsed expression, or why it failed

**Examples**

```kex
Kex.AST.parseExpression("1 + 2").ok?   # => true
Kex.AST.parseExpression("1 +").ok?     # => false
```

### `parseSyntax`

```kex
parseSyntax(source: String) -> Result<SyntaxNode, ParseError>
```

Parses Kex source into its lossless syntax tree.

**Parameters**

  - `source` — the Kex source text

**Returns**: the tree rooted at `Program`, or why it failed

**Examples**

```kex
Kex.AST.parseSyntax("let x = 1\n").map { |tree| tree.kind }   # => Ok("Program")
Kex.AST.parseSyntax("let x =").error?                         # => true
```

### `toSource`

```kex
toSource(node: SyntaxNode) -> String
```

Reprints a syntax tree as the source it was parsed from, byte for byte.

Each node prints its own tokens and nested nodes in order; nothing is copied from the original text. A rearranged tree therefore prints the rearranged program, with comments moved along with their code.

**Parameters**

  - `node` — a tree, or any node in one

**Returns**: the source the node covers, trivia included

**Examples**

```kex
let source = "let x = 1   # one\n"
Kex.AST.parseSyntax(source).map { |tree| Kex.AST.toSource(tree) }   # => Ok(source)
```

### `elementSource`

```kex
elementSource(element: SyntaxElement) -> String
```

Returns the source of one child of a node: a token's trivia and text, or a nested node reprinted.

**Parameters**

  - `element` — the child

**Returns**: its source text

### `commentsBefore`

```kex
commentsBefore(parent: SyntaxNode, index: Integer) -> [String]
```

Returns the comments on their own lines directly above the child at `index`. These belong to the child: a formatter moves them with it, and a `# kex:disable-next-line` among them applies to it.

A comment at the end of the previous line belongs to that line and is not included.

**Parameters**

  - `parent` — the node holding the child
  - `index` — the child's position in `parent.children`

**Returns**: the comment lines, top to bottom, each starting with `#`

**Examples**

```kex
let tree = Kex.AST.parseSyntax("let x = 1  # x\n# about y\nlet y = 2\n").try
Kex.AST.commentsBefore(tree, 3)   # => ["# about y"]
```

### `blankLinesBefore`

```kex
blankLinesBefore(parent: SyntaxNode, index: Integer) -> Integer
```

Returns how many blank lines separate the child at `index` from what precedes it.

**Parameters**

  - `parent` — the node holding the child
  - `index` — the child's position in `parent.children`

**Returns**: the number of blank lines directly above the child

**Examples**

```kex
let tree = Kex.AST.parseSyntax("let x = 1\n\n\nlet y = 2\n").try
Kex.AST.blankLinesBefore(tree, 4)   # => 2
```

### `linesBefore`

```kex
linesBefore(parent: SyntaxNode, index: Integer) -> [String]
```

Returns the whole lines between the child at `index` and the code before it, taken from the trivia of the `Newline` tokens that end them. The newline ending the previous line of code is not included, since what sits in front of it belongs to that code.

**Parameters**

  - `parent` — the node holding the child
  - `index` — the child's position in `parent.children`

**Returns**: the lines, top to bottom, without their newlines

### `typeRefText`

```kex
typeRefText(typeRef: TypeRef) -> String
```

Renders a `TypeRef` back to the way it is written in source.

A list reads as `[Integer]`, a map as `{String: Integer}` and an optional as `String?`.

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
patternFieldText(_: PatternField) -> String
patternFieldText(name: String, _: PatternRef?, _: Bool) -> String
```

### `referenceText`

```kex
referenceText(reference: TypeRef | PatternRef) -> String
```

Renders either a type or a pattern back to source.

Use it when a node may hold either kind; it calls `typeRefText` or `patternRefText` as needed.

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

Line and column are 1-based, for messages to a person. The offsets are 0-based byte positions, for slicing the source.

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

Implements [`Errorable`](../errorable.md#trait-errorable).

### Defined in other modules

  - [Errorable](../errorable.md#make-parseerror): [`message`](../errorable.md#parseerror-message)

## record `SyntaxToken`

One token of a lossless syntax tree, exactly as written.

`parseSyntax` keeps everything `parse` drops, such as spacing and comments, so `toSource` reprints the file byte for byte. Use it to build a formatter, or a linter that rewrites code.

**Fields**

  - `kind` : [String](../string.md#make-string)
  - `text` : [String](../string.md#make-string)
  - `trivia` : [String](../string.md#make-string)



## type `SyntaxElement`

One child of a `SyntaxNode`: a token, or a nested node.

**Variants**

  - `TokenElement(SyntaxToken)`
  - `NodeElement(SyntaxNode)`



## record `SyntaxNode`

A declaration, expression, pattern or type, holding its own tokens and nested nodes in source order.

```kex
let tree = Kex.AST.parseSyntax("# the answer\nlet x = 42\n").try
tree.kind                  # => "Program"
Kex.AST.toSource(tree)     # => "# the answer\nlet x = 42\n"
```

**Fields**

  - `kind` : [String](../string.md#make-string)
  - `children` : [[SyntaxElement](#type-kex-ast-syntaxelement)]



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
  - `ParameterBlockType([TypeRef], TypeRef)`
  - `AtomType(String)`
  - `TypeQuery(String, Expression)`
  - `TypeSplice(Expression)`
  - `TypeVar(String)`
  - `AnyType`
  - `NoneType`



## type `PatternRef`

A pattern as it was written in source.

Pattern nodes describe what a function clause or match arm accepts. A linter can tell a wildcard from a binding, for example, without reparsing the text.

**Examples**

_Finding catch-all match arms_

```kex
let catchAll? = Kex.AST.patternRefText(pattern) == "_"
```

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

`pattern` is `None` for shorthand such as `{ name }`. `stringKey?` is `true` for the string-key spelling `{"name": value}` and `false` for the atom-key `{ name: value }`.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `pattern` : [PatternRef](#type-kex-ast-patternref)?
  - `stringKey?` : [Bool](../truthyable.md#make-bool)



## type `Expression`

An expression as it was written in source.

Expressions keep the syntax distinctions tools care about: a call with a receiver is its own node, `var` is distinct from `let`, and a trailing `if` can be told apart from a block `if`. To run an expression, use `Evaluator`.

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
  - `Var(PatternRef, TypeRef?, Expression)`
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

  - `name` : [String](../string.md#make-string)
  - `value` : [Expression](#type-kex-ast-expression)



## record `MatchArm`

One arm of `match`, `receive`, or `rescue`.

Multiple `patterns` are the comma-separated alternatives on the left of the arrow. `guard` is absent when the arm has no `when` condition.

**Fields**

  - `patterns` : [[PatternRef](#type-kex-ast-patternref)]
  - `guard` : [Expression](#type-kex-ast-expression)?
  - `body` : [Expression](#type-kex-ast-expression)



## record `LambdaParam`

One lambda parameter and its optional source annotation.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `type` : [TypeRef](#type-kex-ast-typeref)?



## record `RescueInfo`

The structured recovery clauses attached to a function or expression.

Rescue arms with patterns are in `arms`. A catch-all rescue has its optional binding and its body in separate fields. `inlineReturn` holds the value of the compact `rescue return X` form.

**Fields**

  - `arms` : [[MatchArm](#record-kex-ast-matcharm)]
  - `catchAllName` : [String](../string.md#make-string)?
  - `catchAllBody` : [[Expression](#type-kex-ast-expression)]
  - `inlineReturn` : [Expression](#type-kex-ast-expression)?



## record `ElseIf`

One `elif` branch, in source order.

**Fields**

  - `condition` : [Expression](#type-kex-ast-expression)
  - `body` : [[Expression](#type-kex-ast-expression)]



## type `MapItem`

One entry in a map literal: either a key/value pair or `...spread`.

**Variants**

  - `MapEntry(Expression, Expression)`
  - `MapSpread(Expression)`



## record `RecordField`

One explicitly initialized field in a record literal.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `value` : [Expression](#type-kex-ast-expression)



## type `GeneratedTemplate`

A declaration template whose name, or for a make block its target, is computed by a `compiled do` expression.

It appears only in code that generates declarations. After expansion, the generated declarations are ordinary +Node+s.

**Variants**

  - `GeneratedNode(Node)`
  - `GeneratedMake(GeneratedMakeInfo)`



## record `GeneratedMakeInfo`

The fixed portion of a generated `make` declaration.

**Fields**

  - `final?` : [Bool](../truthyable.md#make-bool)
  - `implements` : [[TypeRef](#type-kex-ast-typeref)]
  - `body` : [[CompiledItem](#type-kex-ast-compileditem)]
  - `location` : [Location](#record-kex-ast-location)



## record `MainInfo`

The program entry point, including documentation and recovery clauses.

**Fields**

  - `doc` : [String](../string.md#make-string)?
  - `params` : [[ParamInfo](#record-kex-ast-paraminfo)]
  - `body` : [[Expression](#type-kex-ast-expression)]
  - `rescueInfo` : [RescueInfo](#record-kex-ast-rescueinfo)?
  - `location` : [Location](#record-kex-ast-location)



## record `ParamInfo`

One declared function parameter.

`name` is `None` for a destructuring parameter, whose shape is in `pattern`. `default?` is `true` when the parameter has a default value.

**Fields**

  - `name` : [String](../string.md#make-string)?
  - `pattern` : [PatternRef](#type-kex-ast-patternref)?
  - `type` : [TypeRef](#type-kex-ast-typeref)?
  - `default?` : [Bool](../truthyable.md#make-bool)



## record `ClauseInfo`

One clause of a function, including its patterns and body.

All clauses of a function are in one `FunctionInfo`, in source order, which is the order their patterns are tried in.

**Fields**

  - `params` : [[ParamInfo](#record-kex-ast-paraminfo)]
  - `body` : [[Expression](#type-kex-ast-expression)]
  - `returnType` : [TypeRef](#type-kex-ast-typeref)?
  - `rescueInfo` : [RescueInfo](#record-kex-ast-rescueinfo)?
  - `paramList?` : [Bool](../truthyable.md#make-bool)



## record `FunctionInfo`

A named function and all of its pattern-matching clauses.

`doc` holds the doc comment directly above the declaration, without its `#` markers, or `None` when there is none.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `foul?` : [Bool](../truthyable.md#make-bool)
  - `predicate?` : [Bool](../truthyable.md#make-bool)
  - `clauses` : [[ClauseInfo](#record-kex-ast-clauseinfo)]
  - `location` : [Location](#record-kex-ast-location)



## record `AnnotationInfo`

A standalone function type signature.

`implicitThis?` is `true` for a receiver signature written with `:>`, and `false` for a module-level signature written with `:`.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `type` : [TypeRef](#type-kex-ast-typeref)
  - `doc` : [String](../string.md#make-string)?
  - `implicitThis?` : [Bool](../truthyable.md#make-bool)
  - `location` : [Location](#record-kex-ast-location)



## record `VariantInfo`

One constructor of an algebraic data type.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `fields` : [[TypeRef](#type-kex-ast-typeref)]



## record `TypeInfo`

A type alias or algebraic data type declaration.

`variants` is set for an algebraic data type and `None` for an alias or an abstract type. `parents` lists the declared bounds and parent types.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `parents` : [[TypeRef](#type-kex-ast-typeref)]
  - `variants` : [[VariantInfo](#record-kex-ast-variantinfo)]?
  - `location` : [Location](#record-kex-ast-location)



## record `FieldInfo`

One field declared by a record type.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `type` : [TypeRef](#type-kex-ast-typeref)
  - `default?` : [Bool](../truthyable.md#make-bool)



## record `RecordInfo`

A record declaration with fields in source order.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `fields` : [[FieldInfo](#record-kex-ast-fieldinfo)]
  - `location` : [Location](#record-kex-ast-location)



## record `TraitInfo`

A trait declaration and the signatures or default functions in its body.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `body` : [Node]
  - `location` : [Location](#record-kex-ast-location)



## record `MakeInfo`

A `make` implementation block.

`target` is the receiver type and `implements` lists the traits named in `implement:`. `body` holds the functions and visibility sections in declaration order.

**Fields**

  - `target` : [TypeRef](#type-kex-ast-typeref)
  - `doc` : [String](../string.md#make-string)?
  - `final?` : [Bool](../truthyable.md#make-bool)
  - `implements` : [[TypeRef](#type-kex-ast-typeref)]
  - `body` : [Node]
  - `location` : [Location](#record-kex-ast-location)



## record `PragmaInfo`

A compiler pragma and its optional value.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `value` : [String](../string.md#make-string)?
  - `location` : [Location](#record-kex-ast-location)



## record `ModuleInfo`

A module and its declarations in source order.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `items` : [Node]
  - `location` : [Location](#record-kex-ast-location)



## record `ConstantInfo`

A named constant declaration. Its value is not evaluated, and is not part of the record.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `type` : [TypeRef](#type-kex-ast-typeref)?
  - `location` : [Location](#record-kex-ast-location)



## record `VisibilityInfo`

A `public` or `private` section and the declarations it contains.

**Fields**

  - `public?` : [Bool](../truthyable.md#make-bool)
  - `items` : [Node]
  - `location` : [Location](#record-kex-ast-location)



## record `UsingInfo`

A `using` import, including aliasing, filters, and an optional scoped body.

**Fields**

  - `moduleName` : [String](../string.md#make-string)
  - `alias` : [String](../string.md#make-string)?
  - `onlyNames` : [[String](../string.md#make-string)]
  - `exceptNames` : [[String](../string.md#make-string)]
  - `body` : [[Expression](#type-kex-ast-expression)]
  - `location` : [Location](#record-kex-ast-location)



## record `ExportInfo`

An `export` declaration and its public-name filters.

**Fields**

  - `moduleName` : [String](../string.md#make-string)
  - `alias` : [String](../string.md#make-string)?
  - `onlyNames` : [[String](../string.md#make-string)]
  - `exceptNames` : [[String](../string.md#make-string)]
  - `location` : [Location](#record-kex-ast-location)



## type `CompiledItem`

One item inside a `compiled do` block before expansion.

**Variants**

  - `CompiledNode(Node)`
  - `CompiledExpression(Expression)`



## record `CompiledInfo`

A compile-time block and its declarations or expressions in source order.

**Fields**

  - `items` : [[CompiledItem](#type-kex-ast-compileditem)]
  - `location` : [Location](#record-kex-ast-location)



## type `Node`

Any top-level or declaration-level AST node.

A tool can match the declarations it cares about and skip the rest with a `_` arm. A tool that stores trees should check the program's `schemaVersion`, which changes when node shapes do.

**Examples**

_Listing documented functions in a parsed file_

```kex
program.items.each do |node|
  match node do
    FunctionDef(info) when info.doc.present? => IO.printLine(info.name)
    _ => ()
  end
end
```

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

Lets `to(String)` render a type or pattern as source, the same text `referenceText` gives.

Use it in diagnostics to show the type or pattern a tool found, whichever kind it is.

**Examples**

_Building a lint message from a parsed annotation_

```kex
let written = reference.to(String).or("unknown")
IO.printError("avoid the broad ${written} annotation")
```

### `to`

```kex
to(String) -> String?
```


