---
package: tey
version: "0.2.0-dev"
source: tey/docgen/rdoc.kex
title: Tey.Docgen.Rdoc
entities:
  - { kind: module, name: "Tey.Docgen.Rdoc" }
---

# Tey.Docgen.Rdoc

## module `Tey.Docgen.Rdoc`

RDoc-style doc-comment text → structured documentation (typed).

A doc comment is free prose followed by directive paragraphs:

  # Sums all elements. Returns `0` for an empty list.   #   # @param f [X -> Number] maps each element   # @return [Number]   # @example   #   [1, 2].sum   # => 3

Inline ``code`` pairs are rewritten to `` `code` ``. The result is a Tey.Docgen.Model.Doc record.

## record `Bracketed`

**Fields**

  - `content` : String
  - `rest` : String

## function `parseDoc`


```kex
parseDoc(text)
```


## function `parseOrEmpty`


```kex
parseOrEmpty(text)
```


## function `rewritePlusPairs`


```kex
rewritePlusPairs(s, accum)
```


## function `splitParagraphs`

Splits lines into paragraphs (blocks). Prose groups until a blank line; directives are LINE-based, so each `@param`/`@return`/`@example` line begins its own paragraph — consecutive `@param a` / `@param b` lines must not merge into one block, or only the first would be parsed. An `@example`'s indented code lines follow it and stay in its block (they do not open with `@`).


```kex
splitParagraphs(lines, current, accum)
```


## function `classifyBlocks`


```kex
classifyBlocks(blocks, summary, params, returns, examples, deprecated)
```


## function `parseParam`


```kex
parseParam(lines)
```


## function `parseReturn`


```kex
parseReturn(lines)
```


## function `parseExample`


```kex
parseExample(lines)
```


## function `parseBracketed`

"[...]" prefix → Bracketed. None when the text does not open with a bracketed group.


```kex
parseBracketed(s)
```


## function `findClosingBracket`


```kex
findClosingBracket(s, index, depth)
```

