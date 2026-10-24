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

  - `input` : [String](string.md#make-string)
  - `pos` : [Integer](number.md#make-integer) (optional)

### Methods

#### `peek`



#### `peekAt`

```kex
peekAt(offset: Integer) -> Char?
```

#### `atEnd?`



#### `advance`



#### `advanceBy`

```kex
advanceBy(count: Integer) -> Input
```

#### `remaining`



#### `charWhen`

```kex
charWhen(pred: (Char -> Bool)) -> Result<(Char, Input), ParseError>
```

#### `char`

```kex
char(expected: Char) -> Result<(Char, Input), ParseError>
```

#### `whiteSpaces`

```kex
whiteSpaces : Input
```

#### `many`

```kex
many(f: (Input -> Result<(T, Input), ParseError>)) -> ([T], Input)
```

#### `some`

```kex
some(f: (Input -> Result<(T, Input), ParseError>)) -> Result<([T], Input), ParseError>
```

#### `string`

```kex
string(expected: String) -> Result<(String, Input), ParseError>
```

An exact literal. A keyword grammar is mostly literals — `version(` is one token to a reader and eight calls to `char` — and matching it here reports the failure at the START of the literal, which is where a person looking at the error expects the caret.

#### `takeWhile`

```kex
takeWhile(pred: (Char -> Bool)) -> (String, Input)
```

Every character while `pred` holds, as a String. `many(charWhen(...))` gives a [Char] the caller has to join, and a run of characters is almost always wanted as text. Cannot fail: an empty run is an empty String, which is what makes it safe for the optional parts of a grammar.

#### `choice`

```kex
choice(alts: ([(Input) -> Result<(T, Input), ParseError>])) -> Result<(T, Input), ParseError>
```
