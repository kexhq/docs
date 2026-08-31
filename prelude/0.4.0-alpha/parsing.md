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

Parser combinators, for reading a text format you define yourself.

Opt-in: nothing here is in scope until `using Parsing`.

An `Input` is an immutable cursor over a string. A parser takes one and answers either the value it read together with an advanced cursor, or a `ParseError` saying where it gave up. Because the cursor is immutable, a failed attempt costs nothing: the caller still holds the position it started from and can try something else.

```kex
using Parsing

main do
  let cursor = Input { input: "abc 123" }
  let word = cursor.takeWhile(~alpha?)
  let (text, rest) = word
  IO.printLine(text)              # prints: abc
  IO.printLine(rest.pos)          # prints: 3
end
```

The building blocks are `char` and `charWhen` for one character, `string` for a literal, `takeWhile` for a run, and `many` / `some` / `choice` for repetition and alternatives. `JSON` in this same stdlib is written with them.

## type `ParseError`

Why a parser gave up, and at which position.

`Expected` carries what the grammar WANTED rather than what it found: the difference between "unexpected `d`" and "expected `version(`". It is what `label` and `string` report.

```kex
Input { input: "abc" }.char('z')      # => Error(Unexpected("a", 0))
Input { input: "abc" }.string("abd")  # => Error(Expected("abd", 0))
```



**Variants**

  - `Unexpected(String, Integer)`
  - `Expected(String, Integer)`
  - `NoMatch(Integer)`

## record `Input`

An immutable cursor over a string: the text, and where in it you are.

Create one with `Input { input: text }` and pass it to a parser. Every operation that consumes input answers a NEW cursor rather than moving this one, which is what makes backtracking free.

**Fields**

  - `input` : String
  - `pos` : Integer (optional)

## make `Input`


#### `peekAt`

The character `offset` positions ahead of the cursor, or `None` when that is outside the input.

The lookahead a grammar needs when one character is not enough to decide. A negative offset looks backwards.

```kex
peekAt(offset)
```

**Returns**: `Char?` — the character there, or `None`

**Examples**

```kex
Input { input: "abc" }.peekAt(1)   # => Just('b')
Input { input: "abc" }.peekAt(9)   # => None
```

#### `advanceBy`

A cursor `count` characters further on.

```kex
advanceBy(count)
```

**Returns**: `Input` — the advanced cursor

**Examples**

```kex
Input { input: "abc 123" }.advanceBy(4).peek   # => Just('1')
```

#### `charWhen`

Reads one character, if it satisfies `pred`.

Answers the character and the advanced cursor, or an `Unexpected` error naming what was there instead: `"EOF"` at the end of the input.

```kex
charWhen(pred)
```

**Returns**: `Result<(Char, Input), ParseError>` — the character and cursor, or why not

**Examples**

```kex
Input { input: "abc" }.charWhen(~alpha?)   # => Ok(('a', cursor at 1))
Input { input: "123" }.charWhen(~alpha?)   # => Error(Unexpected("1", 0))
```
_Reading one digit_

```kex
cursor.charWhen(~digit?)
```

#### `char`

Reads one specific character.

```kex
char(expected)
```

**Returns**: `Result<(Char, Input), ParseError>` — the character and cursor, or why not

**Examples**

```kex
Input { input: "abc" }.char('a')   # => Ok(('a', cursor at 1))
Input { input: "abc" }.char('z')   # => Error(Unexpected("a", 0))
```
_Consuming a separator_

```kex
let (_, afterComma) = cursor.char(',').try
```

#### `many`

Applies `f` as many times as it succeeds, collecting the results.

Cannot fail: zero matches is an empty list, which is what makes it right for the optional parts of a grammar. A parser that succeeds without consuming anything stops the loop rather than spinning forever.

```kex
many(f)
```

**Returns**: `([T], Input)` — the results, and the cursor after them

**Examples**

```kex
Input { input: "abc 1" }.many { |p| p.charWhen(~alpha?) }
# => (['a', 'b', 'c'], cursor at 3)
```
_Zero matches is not an error_

```kex
Input { input: "123" }.many { |p| p.charWhen(~alpha?) }
# => ([], cursor at 0)
```

#### `some`

Applies `f` at least once, then as many more times as it succeeds.

The one-or-more counterpart of `many`: the first failure IS a failure, so use it where the grammar requires something to be there.

```kex
some(f)
```

**Returns**: `([T], Input)` — the results and the cursor, or the first failure

**Examples**

```kex
Input { input: "abc" }.some { |p| p.charWhen(~alpha?) }
# => Ok((['a', 'b', 'c'], cursor at 3))
Input { input: "123" }.some { |p| p.charWhen(~alpha?) }
# => Error(Unexpected("1", 0))
```

#### `string`

Reads an exact literal.

A keyword grammar is mostly literals: `version(` is one token to a reader and eight calls to `char`, and matching it here reports the failure at the START of the literal, which is where a person looking at the error expects the caret.

```kex
string(expected)
```

**Returns**: `(String, Input)` — the literal and the cursor, or an `Expected` error

**Examples**

```kex
Input { input: "abc" }.string("abc")   # => Ok(("abc", cursor at 3))
Input { input: "abc" }.string("abd")   # => Error(Expected("abd", 0))
```
_Matching a keyword_

```kex
let (_, rest) = cursor.string("version(").try
```

#### `takeWhile`

Reads every character while `pred` holds, as a `String`.

`many(charWhen(...))` gives a [Char] the caller has to join, and a run of characters is almost always wanted as text. Cannot fail: an empty run is an empty String, which is what makes it safe for the optional parts of a grammar.

```kex
takeWhile(pred)
```

**Returns**: `(String, Input)` — the text read, and the cursor after it

**Examples**

```kex
Input { input: "abc 123" }.takeWhile(~alpha?)   # => ("abc", cursor at 3)
Input { input: "123" }.takeWhile(~alpha?)       # => ("", cursor at 0)
```
_Reading an identifier_

```kex
let name = cursor.takeWhile { |c| c.alpha? || c == '_' }
```

#### `choice`

Tries each parser in `alts` in turn, and answers the first that succeeds.

This is alternation: how a grammar says "a value is a string, or a number, or an object". Because the cursor is immutable, a failed alternative costs nothing. When none of them match, the answer is `NoMatch` at the position they all started from.

```kex
choice(alts)
```

**Returns**: `(T, Input)` — the first success, or `NoMatch`

**Examples**

```kex
cursor.choice([
  { |p| p.charWhen(~digit?) },
  { |p| p.charWhen(~alpha?) }
])
```
