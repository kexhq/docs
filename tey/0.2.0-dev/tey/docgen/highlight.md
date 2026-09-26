---
package: tey
version: "0.2.0-dev"
source: tey/docgen/highlight.kex
title: Tey.Docgen.Highlight
entities:
  - { kind: module, name: "Tey.Docgen.Highlight" }
---

# Tey.Docgen.Highlight

A small syntax highlighter for Kex source, ported from kex-run-site's src/lib/highlight.ts: a "good enough" tokenizer rather than a full grammar. Emits <span class="tok-*"> HTML at docgen build time, so the docs carry no client-side JavaScript. Runs over [Char] lists; pure recursion, no state.

Fidelity note: backtick raw strings are not tracked inside interpolation braces, and `and`/`or` are colored as keywords even where the compiler treats them as identifiers — same trade-offs as the site version.

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

### `previousIsDot`

```kex
previousIsDot(out: [Tok]) -> Bool
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
keywords : [String]
```

Functions rather than module constants: on BEAM, method calls on a module-level constant fail to dispatch.

### `constants`

```kex
constants : [String]
```

### `typeNames`

```kex
typeNames : [String]
```

### `renderTokens`

```kex
renderTokens(toks: [Tok]) -> String
```

### `highlightLinked`

```kex
highlightLinked(source: String, hrefOf: (String -> String)) -> String
```

The same highlighting, with every type name that `hrefOf` can place wrapped in a link to it — signatures read as code and navigate as a reference. `hrefOf` answers "" for a name it cannot place.

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

Local copy of Tey.Docgen.Html.esc — duplicating four replaces keeps the modules acyclic (Html calls Highlight for code blocks).

### `textOf`

```kex
textOf(cs: [Char]) -> String
```

### `startsWithChars`

```kex
startsWithChars(cs: [Char], s: String) -> Bool
```

## record `Tok`

**Fields**

  - `cls` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `text` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)


