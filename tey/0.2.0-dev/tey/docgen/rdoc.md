---
package: tey
version: "0.2.0-dev"
source: tey/docgen/rdoc.kex
title: Tey.Docgen.Rdoc
entities:
  - { kind: module, name: "Tey.Docgen.Rdoc" }
---

# Tey.Docgen.Rdoc

RDoc-style doc-comment text → structured documentation (typed).

A doc comment is free prose followed by directive paragraphs:

```kex
# Sums all elements. Returns +0+ for an empty list.
#
# @param f [X -> Number] maps each element
# @return [Number]
# @example
#   [1, 2].sum   # => 3
```

Inline ``code`` pairs are rewritten to `` `code` ``. The result is a Tey.Docgen.Model.Doc record.

## module `Tey.Docgen.Rdoc`

### `parseDoc`

```kex
parseDoc(text: String) -> Doc?
```

### `parseOrEmpty`

```kex
parseOrEmpty(text: String) -> Doc
```

### `rewriteProseBlocks`

```kex
rewriteProseBlocks(blocks: [[String]]) -> [[String]]
```

``code`` is prose markup, so it is rewritten per prose block — after the split, not before it. Rewriting the whole comment at once paired a `+` operator inside an indented code sample (say `1 + 1`) with the next prose pair (``describe``), turning the operator into a stray backtick and eating the markup. Verbatim blocks and `@example` code are Kex source and are left alone; `@param`/`@return` descriptions are prose and still rewrite. Pairing never crosses a block: each block is rewritten on its own.

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

A ``...`` pair is markup only when it reads as one: content with no space against either delimiter (so `1 + 1` stays an addition), no backtick inside (so converted spans never nest), and a non-identifier character on both sides (so `a+b` stays put even if it ever reaches here).

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

Splits lines into paragraphs (blocks). Prose groups until a blank line; directives are LINE-based, so each `@param`/`@return`/`@example` line begins its own paragraph — consecutive `@param a` / `@param b` lines must not merge into one block, or only the first would be parsed. An `@example`'s indented code lines follow it and stay in its block (they do not open with `@`).

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

RDoc's verbatim marker is indentation: a prose block whose every line is indented is code — or a hand-laid-out table — that the author positioned deliberately. Reflowing it into a paragraph loses both the line breaks and the highlighting, so it is carried through the summary as a fenced block instead, which both renderers turn back into a highlighted `<pre>`.

Leading-space count of a line.

### `verbatim?`

```kex
verbatim?(lines: [String]) -> Bool
```

### `dedent`

```kex
dedent(lines: [String]) -> [String]
```

Strips the common indentation shared by every non-blank line, so a block written at two spaces (or nested deeper) renders flush left.

### `fenceVerbatim`

```kex
fenceVerbatim(lines: [String]) -> String
```

### `mergeVerbatim`

```kex
mergeVerbatim(blocks: [[String]], accum: [[String]]) -> [[String]]
```

A blank line inside a verbatim block ends a paragraph but not the block, so adjacent verbatim blocks are re-joined with the blank line between them.

### `classifyBlocks`

```kex
classifyBlocks(blocks: [[String]], summary: String, params: [Param], returns: Return?, examples: [Example], deprecated: String?) -> Doc?
```

### `parseParam`

```kex
parseParam(lines: [String]) -> Param
```

**Parameters**

  - `name` — description

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

"[...]" prefix → Bracketed. None when the text does not open with a bracketed group.

### `findClosingBracket`

```kex
findClosingBracket(s: String, index: Integer, depth: Integer) -> Integer?
```

## record `Bracketed`

**Fields**

  - `content` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `rest` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)


