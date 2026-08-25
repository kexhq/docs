---
package: tey
version: "0.2.0-dev"
source: tey/docgen/highlight.kex
title: Tey.Docgen.Highlight
entities:
  - { kind: module, name: "Tey.Docgen.Highlight" }
---

# Tey.Docgen.Highlight

## module `Tey.Docgen.Highlight`

A small syntax highlighter for Kex source, ported from kex-run-site's src/lib/highlight.ts: a "good enough" tokenizer rather than a full grammar. Emits <span class="tok-*"> HTML at docgen build time, so the docs carry no client-side JavaScript. Runs over [Char] lists; pure recursion, no state.

Fidelity note: backtick raw strings are not tracked inside interpolation braces, and `and`/`or` are colored as keywords even where the compiler treats them as identifiers — same trade-offs as the site version.

## record `Tok`

**Fields**

  - `cls` : String
  - `text` : String

## function `highlight`


```kex
highlight(source)
```


## function `lexAll`

── Entry loop ───────────────────────────────────────────────────────────

out accumulates newest-first; the final reverse restores source order.


```kex
lexAll(cs, out)
```


## function `nextToken`


```kex
nextToken(cs, out)
```


## function `lexString`

── Strings (with ${...} interpolation) ─────────────────────────────────

cs starts after the opening quote; acc is newest-first tokens so far.


```kex
lexString(cs, acc)
```


## function `takeStringText`

Collect literal string text up to (not including) the closing quote, an interpolation opener, or the end of input. Backslash escapes are opaque.


```kex
takeStringText(cs, acc)
```


## function `balancedBraces`

From just after "${", collect the interpolation body up to its matching "}" (which is consumed but not collected). Embedded "..." strings are skipped whole so braces inside them do not count.


```kex
balancedBraces(cs, depth, acc)
```


## function `skipString`

Consume a whole "..." literal starting at the opening quote; returns the consumed characters (both quotes included) and the remainder.


```kex
skipString(cs)
```


## function `skipStringBody`


```kex
skipStringBody(cs, acc)
```


## function `lexNumber`

── Numbers ──────────────────────────────────────────────────────────────


```kex
lexNumber(cs)
```


## function `exponentLength`


```kex
exponentLength(cs)
```


## function `hexDigit?`


```kex
hexDigit?(c)
```


## function `lexIdentifier`

── Identifiers and keywords ─────────────────────────────────────────────


```kex
lexIdentifier(cs, out)
```


## function `classifyWord`


```kex
classifyWord(word, prevDot, nextCh)
```


## function `previousIsDot`

The most recent token that is not whitespace: out is newest-first, so a plain find walks backwards in time.


```kex
previousIsDot(out)
```


## function `identChar?`


```kex
identChar?(c)
```


## function `lexOperator`

── Operators and punctuation ────────────────────────────────────────────


```kex
lexOperator(cs)
```


## function `twoCharOp`


```kex
twoCharOp(cs)
```


## function `keywords`

── Word tables ────────────────────────────────────────────────────────── Functions rather than module constants: on BEAM, method calls on a module-level constant fail to dispatch.


```kex
keywords()
```


## function `constants`


```kex
constants()
```


## function `typeNames`


```kex
typeNames()
```


## function `renderTokens`

── Rendering ────────────────────────────────────────────────────────────


```kex
renderTokens(toks)
```


## function `renderTok`


```kex
renderTok(t)
```


## function `esc`

Local copy of Tey.Docgen.Html.esc — duplicating four replaces keeps the modules acyclic (Html calls Highlight for code blocks).


```kex
esc(s)
```


## function `textOf`

── Small helpers ────────────────────────────────────────────────────────


```kex
textOf(cs)
```


## function `startsWithChars`


```kex
startsWithChars(cs, s)
```

