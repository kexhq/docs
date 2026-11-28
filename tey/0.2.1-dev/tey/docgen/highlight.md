---
package: tey
version: "0.2.1-dev"
source: tey/docgen/highlight.kex
title: Tey.Docgen.Highlight
entities:
  - { kind: module, name: "Tey.Docgen.Highlight" }
---

# Tey.Docgen.Highlight

A small syntax highlighter for Kex source, ported from the kex.run site's highlighter. It is an approximate tokenizer, not the full grammar, and emits `<span class="tok-*">` HTML when the docs are built, so the pages need no JavaScript.

Known gaps, shared with the site: backtick raw strings are not recognised inside interpolation braces, and `and` and `or` are coloured as keywords even where the compiler reads them as identifiers.

## module `Tey.Docgen.Highlight`

### `highlight`

```kex
highlight(source: String) -> String
```

### `lexAll`

```kex
lexAll(cs: [Char], out: [Tok]) -> [Tok]
```

out accumulates newest-first; the final reverse restores source order.

### `nextToken`

```kex
nextToken(cs: [Char], out: [Tok]) -> ([Tok], [Char])
```

### `lexString`

```kex
lexString(cs: [Char], acc: [Tok]) -> ([Tok], [Char])
```

cs starts after the opening quote; acc is newest-first tokens so far.

### `takeStringText`

```kex
takeStringText(cs: [Char], acc: [Char]) -> (String, [Char])
```

Collect literal string text up to (not including) the closing quote, an interpolation opener, or the end of input. Backslash escapes are opaque.

### `balancedBraces`

```kex
balancedBraces(cs: [Char], depth: Integer, acc: [Char]) -> ([Char], [Char])
```

From just after "${", collect the interpolation body up to its matching "}" (which is consumed but not collected). Embedded "..." strings are skipped whole so braces inside them do not count.

### `skipString`

```kex
skipString(cs: [Char]) -> ([Char], [Char])
```

Consume a whole "..." literal starting at the opening quote; returns the consumed characters (both quotes included) and the remainder.

### `skipStringBody`

```kex
skipStringBody(cs: [Char], acc: [Char]) -> ([Char], [Char])
```

### `lexNumber`

```kex
lexNumber(cs: [Char]) -> ([Tok], [Char])
```

### `exponentLength`

```kex
exponentLength(cs: [Char]) -> Integer
```

### `hexDigit?`

```kex
hexDigit?(c: Char) -> Bool
```

### `lexIdentifier`

```kex
lexIdentifier(cs: [Char], out: [Tok]) -> ([Tok], [Char])
```

### `classifyWord`

```kex
classifyWord(word: String, prevDot: Bool, nextCh: Char) -> String
```

### `previousDot?`

```kex
previousDot?(out: [Tok]) -> Bool
```

The most recent token that is not whitespace: out is newest-first, so a plain find walks backwards in time.

### `identChar?`

```kex
identChar?(c: Char) -> Bool
```

### `lexOperator`

```kex
lexOperator(cs: [Char]) -> ([Tok], [Char])
```

### `twoCharOp`

```kex
twoCharOp(cs: [Char]) -> String
```

### `keywords`

```kex
keywords -> [String]
```

Functions rather than module constants: on BEAM, calling a function on a module-level constant fails to dispatch.

### `constants`

```kex
constants -> [String]
```

### `typeNames`

```kex
typeNames -> [String]
```

### `renderTokens`

```kex
renderTokens(toks: [Tok]) -> String
```

### `highlightLinked`

```kex
highlightLinked(source: String, hrefOf: (String -> String)) -> String
```

Highlights `source` as `highlight` does, and links each type name to the page `hrefOf` returns for it. `hrefOf` returns `""` for a name it cannot place, which is then left unlinked.

### `renderLinkedTok`

```kex
renderLinkedTok(t: Tok, hrefOf: (String -> String)) -> String
```

### `renderTok`

```kex
renderTok(t: Tok) -> String
```

### `esc`

```kex
esc(s: String) -> String
```

Escapes `&`, `<`, `>` and `"` for HTML. A copy of `Tey.Docgen.Html.esc`, kept here because Html imports this module.

### `textOf`

```kex
textOf(cs: [Char]) -> String
```

### `startsWithChars?`

```kex
startsWithChars?(cs: [Char], s: String) -> Bool
```

## record `Tok`

**Fields**

  - `cls` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `text` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)


