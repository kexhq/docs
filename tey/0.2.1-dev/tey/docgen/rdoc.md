---
package: tey
version: "0.2.1-dev"
source: tey/docgen/rdoc.kex
title: Tey.Docgen.Rdoc
entities:
  - { kind: module, name: "Tey.Docgen.Rdoc" }
---

# Tey.Docgen.Rdoc

Parses the text of an RDoc-style doc comment into a `Tey.Docgen.Model.Doc` record.

A doc comment is prose followed by directive lines:

```kex
# Sums all elements. Returns +0+ for an empty list.
#
# @param f [X -> Number] maps each element
# @return [Number]
# @example
#   [1, 2].sum   # => 3
```

In prose, a word or phrase between two plus signs becomes Markdown inline code.

## module `Tey.Docgen.Rdoc`

### `parseDoc`

```kex
parseDoc(text: String) -> Doc?
```

Parses a doc comment's text, or returns `None` for empty text.

### `parseOrEmpty`

```kex
parseOrEmpty(text: String) -> Doc
```

Parses a doc comment's text, giving an empty `Doc` for empty text.

### `rewriteProseBlocks`

```kex
rewriteProseBlocks(blocks: [[String]]) -> [[String]]
```

Rewrites plus-sign code markup in each prose block separately, leaving verbatim blocks and `@example` code alone. `@param` and `@return` descriptions are prose and are rewritten.

A pair never spans two blocks. Rewriting the whole comment at once would pair the plus sign of an addition in a code sample with the next markup in the prose.

### `rewriteProseBlock`

```kex
rewriteProseBlock(block: [String]) -> [String]
```

### `rewritePlusPairs`

```kex
rewritePlusPairs(s: String, accum: String) -> String
```

### `plusPair?`

```kex
plusPair?(head: String, inner: String, tail: String) -> Bool
```

Returns `true` when a pair of plus signs around `inner` is markup. There must be no space just inside either sign, so an addition with spaces stays as written; no backtick inside, so spans never nest; and no letter or digit just outside, so an addition without spaces stays too.

### `boundaryBefore?`

```kex
boundaryBefore?(head: String) -> Bool
```

### `boundaryAfter?`

```kex
boundaryAfter?(tail: String) -> Bool
```

### `splitParagraphs`

```kex
splitParagraphs(lines: [String], current: [String], accum: [[String]]) -> [[String]]
```

Splits lines into blocks. Prose runs until a blank line. Every line that starts with `@` opens a block of its own, so consecutive `@param` lines stay separate, and the indented lines after a directive (an example's code) belong to it.

### `directiveBlock?`

```kex
directiveBlock?(current: [String]) -> Bool
```

### `indented?`

```kex
indented?(line: String) -> Bool
```

### `indentWidth`

```kex
indentWidth(s: String) -> Integer
```

Returns the number of leading spaces in a line.

### `verbatim?`

```kex
verbatim?(lines: [String]) -> Bool
```

Returns `true` for a verbatim block: one whose every non-blank line is indented by at least two spaces, as RDoc marks code or a hand-laid-out table. Such a block keeps its line breaks and is carried into the summary as a fenced code block.

### `dedent`

```kex
dedent(lines: [String]) -> [String]
```

Removes the indentation shared by every non-blank line, so a block renders flush left.

### `fenceVerbatim`

```kex
fenceVerbatim(lines: [String]) -> String
```

### `mergeVerbatim`

```kex
mergeVerbatim(blocks: [[String]], accum: [[String]]) -> [[String]]
```

Joins adjacent verbatim blocks back together with a blank line between them, since a blank line inside a code sample does not end it.

### `classifyBlocks`

```kex
classifyBlocks(blocks: [[String]], summary: String, params: [Param], returns: Return?, examples: [Example], deprecated: String?) -> Doc?
```

### `directiveBody`

```kex
directiveBody(lines: [String], prefixLength: Integer) -> String
```

### `parseParam`

```kex
parseParam(lines: [String]) -> Param
```

Reads a `@param name [Type] description` directive.

### `parseReturn`

```kex
parseReturn(lines: [String]) -> Return
```

Reads a `@return [Type] description` directive.

### `parseExample`

```kex
parseExample(lines: [String]) -> Example
```

### `parseBracketed`

```kex
parseBracketed(s: String) -> Bracketed?
```

Splits text that opens with a bracketed group, such as `[Integer] the count`, into the group's content and the rest. Returns `None` when the text does not open with one.

### `findClosingBracket`

```kex
findClosingBracket(s: String, index: Integer, depth: Integer) -> Integer?
```

## record `Bracketed`

**Fields**

  - `content` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `rest` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)


