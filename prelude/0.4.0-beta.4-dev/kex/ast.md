---
package: prelude
version: "0.4.0-beta.4-dev"
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

### `parse`

```kex
parse(source: String) -> Result<Program, ParseError>
parse(source: String, filename: String) -> Result<Program, ParseError>
```

Parses Kex source text into a structured AST.

Pass `filename` when you have one: it is what appears in every `Location` and in the error message, so diagnostics can point at a real file.

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

Use it to read a type written in data: a signature in a config file, a type named on a command line. `typeRefText` renders the result back.

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

Every node prints its own tokens and its nested nodes in order, never a slice of the original text, so a rearranged tree prints the rearranged program, its comments moving with it.

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

The source of one child of a node: a token's trivia and text, or a nested node reprinted.

**Parameters**

  - `element` — the child

**Returns**: its source text

### `commentsBefore`

```kex
commentsBefore(parent: SyntaxNode, index: Integer) -> [String]
```

The comments written on their own lines directly above the child at `index`: the ones that belong to it, move with it when a formatter moves it, and hold a `# kex:disable-next-line` meant for it.

A comment at the end of the previous line trails that line instead, and is not included.

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

How many blank lines separate the child at `index` from what precedes it.

Kept as a count, not a flag: a formatter preserves one blank line between declarations and collapses longer runs, which needs to know how many there were.

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

The whole lines between the child at `index` and the code before it, as the trivia of the `Newline` tokens that end them. The newline that ends the previous line of code is not one of them: what sits in front of it trails that code.

**Parameters**

  - `parent` — the node holding the child
  - `index` — the child's position in `parent.children`

**Returns**: the lines, top to bottom, without their newlines

### `typeRefText`

```kex
typeRefText(typeRef: TypeRef) -> String
```

Renders a `TypeRef` back to the way it is written in source.

A list reads as `[Integer]`, a map as `{String: Integer}`, an optional as `String?`: the spelling a reader would recognise, not the constructor tree behind it.

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

The one call to reach for when a node may carry either: it dispatches to `typeRefText` or `patternRefText` as appropriate.

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



## record `SyntaxToken`

One token of a lossless syntax tree, exactly as written.

Where `parse` gives a program's meaning, `parseSyntax` gives its text: nothing is normalised or dropped, so `toSource` reprints the file byte for byte. It is the tree a formatter or a linter works on (kexhq/kex#136).

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
  - `AtomType(String)`
  - `TypeQuery(String, Expression)`
  - `TypeVar(String)`
  - `AnyType`
  - `NoneType`



## type `PatternRef`

Structured representation of patterns.

Pattern nodes describe what a declaration or match arm accepts; they do not contain runtime values. A linter can distinguish a wildcard from a binding, for example, without reparsing source text.

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

`pattern` is `None` for shorthand such as `{ name }`. `stringKey` keeps `{"name": value}` distinct from the atom-key spelling `{ name: value }`.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `pattern` : [PatternRef](#type-kex-ast-patternref)?
  - `stringKey` : [Bool](../truthyable.md#make-bool)



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

Named rescue arms live in `arms`; a catch-all rescue keeps its optional binding and body separately. `inlineReturn` represents the compact rescue form rather than inventing a synthetic block.

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

A declaration template whose name (and, for a make block, target) is computed by a `compiled do` expression.

Tools normally encounter this only while inspecting metaprogramming code. After expansion, generated declarations appear as ordinary +Node+s.

**Variants**

  - `GeneratedNode(Node)`
  - `GeneratedMake(GeneratedMakeInfo)`



## record `GeneratedMakeInfo`

The fixed portion of a generated `make` declaration.

**Fields**

  - `isFinal` : [Bool](../truthyable.md#make-bool)
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

`name` is absent for a destructuring parameter; `pattern` preserves that destructuring shape. `hasDefault` records whether an initializer appeared.

**Fields**

  - `name` : [String](../string.md#make-string)?
  - `pattern` : [PatternRef](#type-kex-ast-patternref)?
  - `type` : [TypeRef](#type-kex-ast-typeref)?
  - `hasDefault` : [Bool](../truthyable.md#make-bool)



## record `ClauseInfo`

One clause of a function, including its patterns and body.

Multi-clause functions place all clauses in one `FunctionInfo`, preserving source order so tooling can reason about which pattern is tried first.

**Fields**

  - `params` : [[ParamInfo](#record-kex-ast-paraminfo)]
  - `body` : [[Expression](#type-kex-ast-expression)]
  - `returnType` : [TypeRef](#type-kex-ast-typeref)?
  - `rescueInfo` : [RescueInfo](#record-kex-ast-rescueinfo)?
  - `hasParamList` : [Bool](../truthyable.md#make-bool)



## record `FunctionInfo`

A named function and all of its pattern-matching clauses.

`doc` contains the normalized `#` comment immediately attached to the declaration. Documentation generators can therefore share the same parsed structure as linters instead of scanning comments independently.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `isFoul` : [Bool](../truthyable.md#make-bool)
  - `predicate` : [Bool](../truthyable.md#make-bool)
  - `clauses` : [[ClauseInfo](#record-kex-ast-clauseinfo)]
  - `location` : [Location](#record-kex-ast-location)



## record `AnnotationInfo`

A standalone function or method type signature.

`implicitThis` distinguishes `:>` methods from module-level `:` functions without making a tool inspect punctuation in the original source.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `type` : [TypeRef](#type-kex-ast-typeref)
  - `doc` : [String](../string.md#make-string)?
  - `implicitThis` : [Bool](../truthyable.md#make-bool)
  - `location` : [Location](#record-kex-ast-location)



## record `VariantInfo`

One constructor of an algebraic data type.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `fields` : [[TypeRef](#type-kex-ast-typeref)]



## record `TypeInfo`

A type alias or algebraic data type declaration.

`variants` is present for an ADT and absent for an alias or abstract type. `parents` preserves declared bounds and inherited type relationships.

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
  - `hasDefault` : [Bool](../truthyable.md#make-bool)



## record `RecordInfo`

A record declaration with fields in source order.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `fields` : [[FieldInfo](#record-kex-ast-fieldinfo)]
  - `location` : [Location](#record-kex-ast-location)



## record `TraitInfo`

A trait declaration and the signatures or default methods in its body.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `typeParams` : [[String](../string.md#make-string)]
  - `body` : [Node]
  - `location` : [Location](#record-kex-ast-location)



## record `MakeInfo`

A `make` implementation block.

`target` is the receiver type, `implements` lists explicit traits, and `body` retains methods and visibility sections in declaration order.

**Fields**

  - `target` : [TypeRef](#type-kex-ast-typeref)
  - `doc` : [String](../string.md#make-string)?
  - `isFinal` : [Bool](../truthyable.md#make-bool)
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

A named constant declaration. The AST reader never evaluates its value.

**Fields**

  - `name` : [String](../string.md#make-string)
  - `doc` : [String](../string.md#make-string)?
  - `type` : [TypeRef](#type-kex-ast-typeref)?
  - `location` : [Location](#record-kex-ast-location)



## record `VisibilityInfo`

A `public` or `private` section and the declarations it contains.

**Fields**

  - `isPublic` : [Bool](../truthyable.md#make-bool)
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

A source tool can match only the declarations it understands and leave the rest alone. The program's `schemaVersion` lets persisted consumers reject a tree whose possible node shapes have changed.

**Examples**

_Listing documented functions in a parsed file_

```kex
program.items.each do |node|
  match node do
    FunctionDef(info) if info.doc.present? => IO.printLine(info.name)
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

Source-like conversion through the standard `to(String)` spelling.

Useful in diagnostics: a tool can interpolate the type or pattern it found without manually dispatching between the two reference families.

**Examples**

_Building a lint message from a parsed annotation_

```kex
let written = reference.to(String).or("unknown")
IO.warn("avoid the broad ${written} annotation")
```

### `to`

```kex
to(_) -> String?
```


