---
package: prelude
version: "0.4.0-alpha"
source: parsing.kex
title: Parsing
entities:
  - { kind: module, name: "Parsing" }
---

# Parsing

## module `Parsing`

Parser combinators for user-defined text formats.

An Input is immutable: successful parsers return the parsed value together with an advanced cursor. Failure leaves the caller free to try an alternative.

## type `ParseError`

`Expected` carries what the grammar WANTED rather than what it found — the difference between "unexpected `d`" and "expected `version(`". It is what `label` and `string` report.



**Variants**

  - `Unexpected(String, Integer)`
  - `Expected(String, Integer)`
  - `NoMatch(Integer)`

## record `Input`

**Fields**

  - `input` : String
  - `pos` : Integer (optional)

## make `Input`


#### `peekAt`

```kex
peekAt(offset)
```

#### `advanceBy`

```kex
advanceBy(count)
```

#### `charWhen`

```kex
charWhen(pred)
```

#### `char`

```kex
char(expected)
```

#### `many`

```kex
many(f)
```

#### `some`

```kex
some(f)
```

#### `string`

An exact literal. A keyword grammar is mostly literals — `version(` is one token to a reader and eight calls to `char` — and matching it here reports the failure at the START of the literal, which is where a person looking at the error expects the caret.

```kex
string(expected)
```

#### `takeWhile`

Every character while `pred` holds, as a String. `many(charWhen(...))` gives a [Char] the caller has to join, and a run of characters is almost always wanted as text. Cannot fail: an empty run is an empty String, which is what makes it safe for the optional parts of a grammar.

```kex
takeWhile(pred)
```

#### `choice`

```kex
choice(alts)
```
