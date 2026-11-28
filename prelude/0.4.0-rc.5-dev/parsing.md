---
package: prelude
version: "0.4.0-rc.5-dev"
source: parsing.kex
title: Parsing
entities:
  - { kind: module, name: "Parsing" }
---

# Parsing

## module `Parsing`

Parser combinators, for reading a text format you define yourself.

Nothing here is in scope until `using Parsing`.

An `Input` is an immutable cursor over a string. A parser takes one and returns the value it read with an advanced cursor, or a `ParseError` saying where it stopped. After a failure the caller still has the cursor it started with, so it can try something else from the same place.

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

The building blocks are `char` and `charWhen` for one character, `string` for a literal, `takeWhile` for a run, and `many` / `some` / `choice` for repetition and alternatives. The stdlib's `JSON` parser is built from them.



## type `ParseError`

Why a parser stopped, and at which position.

`Unexpected` carries the text that was found, `"EOF"` at the end of the input. `Expected` carries what the grammar wanted, as `string` reports it. `NoMatch` means no alternative of a `choice` matched.

```kex
Input { input: "abc" }.char('z')      # => Error(Unexpected("a", 0))
Input { input: "abc" }.string("abd")  # => Error(Expected("abd", 0))
```

**Variants**

  - `Unexpected(String, Integer)`
  - `Expected(String, Integer)`
  - `NoMatch(Integer)`

Implements [`Errorable`](errorable.md#trait-errorable).

### Defined in other modules

  - [Errorable](errorable.md#make-parseerror): [`message`](errorable.md#parseerror-message)

## record `Input`

An immutable cursor over a string: the text and a position in it.

Create one with `Input { input: text }` and pass it to a parser. Every function that consumes input returns a new cursor and leaves this one where it was.

**Fields**

  - `input` : [String](string.md#make-string)
  - `pos` : [Integer](number.md#make-integer) (optional)

### Functions

#### `peek`

Returns the character at the cursor without consuming it, or `None` at the end of the input.

**Returns**: `Char?` — the current character, or `None`

**Examples**

```kex
Input { input: "abc" }.peek           # => Just('a')
Input { input: "abc", pos: 3 }.peek   # => None
```

#### `peekAt`

```kex
peekAt(offset: Integer) -> Char?
```

Returns the character `offset` positions ahead of the cursor, or `None` when that is outside the input. A negative offset looks backwards.

**Parameters**

  - `offset` — how far ahead to look

**Returns**: the character there, or `None`

**Examples**

```kex
Input { input: "abc" }.peekAt(1)   # => Just('b')
Input { input: "abc" }.peekAt(9)   # => None
```

#### `atEnd?`

Returns `true` when the cursor has consumed the whole input. A top-level parser checks it to be sure nothing is left over.

**Returns**: `Bool` — `true` at the end of the input

**Examples**

```kex
Input { input: "abc" }.atEnd?           # => false
Input { input: "abc", pos: 3 }.atEnd?   # => true
```

#### `advance`

Returns a cursor one character further on.

**Returns**: `Input` — the advanced cursor

**Examples**

```kex
Input { input: "abc" }.advance.peek   # => Just('b')
```

#### `advanceBy`

```kex
advanceBy(count: Integer) -> Input
```

Returns a cursor `count` characters further on.

**Parameters**

  - `count` — how far to advance

**Returns**: the advanced cursor

**Examples**

```kex
Input { input: "abc 123" }.advanceBy(4).peek   # => Just('1')
```

#### `remaining`

Returns the text from the cursor to the end of the input, for an error message or for code that does not take an `Input`.

**Returns**: `String` — the unconsumed remainder

**Examples**

```kex
Input { input: "abc 123", pos: 4 }.remaining   # => "123"
```

#### `charWhen`

```kex
charWhen(pred: (Char -> Bool)) -> Result<(Char, Input), ParseError>
```

Reads one character if it satisfies `pred`.

Otherwise returns an `Unexpected` error with the character found, or `"EOF"` at the end of the input.

**Parameters**

  - `pred` — the test the character must pass

**Returns**: the character and cursor, or why not

**Examples**

```kex
Input { input: "abc" }.charWhen(~alpha?)
# => Ok(('a', Parsing.Input { pos: 1, input: "abc" }))
Input { input: "123" }.charWhen(~alpha?)   # => Error(Unexpected("1", 0))
```

_Reading one digit_

```kex
cursor.charWhen(~digit?)
```

#### `char`

```kex
char(expected: Char) -> Result<(Char, Input), ParseError>
```

Reads one specific character.

**Parameters**

  - `expected` — the character that must be next

**Returns**: the character and cursor, or why not

**Examples**

```kex
Input { input: "abc" }.char('a')
# => Ok(('a', Parsing.Input { pos: 1, input: "abc" }))
Input { input: "abc" }.char('z')   # => Error(Unexpected("a", 0))
```

_Consuming a separator_

```kex
let (_, afterComma) = cursor.char(',').try
```

#### `whiteSpaces`

```kex
whiteSpaces -> Input
```

Returns the cursor moved past any whitespace. With no whitespace it stays where it was, so it can go between any two tokens of a grammar.

**Returns**: the cursor, past the whitespace

**Examples**

```kex
Input { input: "abc 123", pos: 3 }.whiteSpaces.peek   # => Just('1')
```

_Skipping space between tokens_

```kex
let (value, rest) = parseValue(cursor.whiteSpaces).try
```

#### `many`

```kex
many(f: (Input -> Result<(T, Input), ParseError>)) -> ([T], Input)
```

Applies `f` as many times as it succeeds and collects the results.

It cannot fail: no match gives an empty list. It also stops when `f` succeeds without consuming anything.

**Parameters**

  - `f` — the parser to repeat

**Returns**: the results, and the cursor after them

**Examples**

```kex
Input { input: "abc 1" }.many { |p| p.charWhen(~alpha?) }
# => (['a', 'b', 'c'], Parsing.Input { pos: 3, input: "abc 1" })
```

_No match is not an error_

```kex
Input { input: "123" }.many { |p| p.charWhen(~alpha?) }
# => ([], Parsing.Input { pos: 0, input: "123" })
```

#### `some`

```kex
some(f: (Input -> Result<(T, Input), ParseError>)) -> Result<([T], Input), ParseError>
```

Applies `f` once, then as many more times as it succeeds.

Unlike `many`, it fails when the first attempt fails. Use it where the grammar needs at least one match.

**Parameters**

  - `f` — the parser to repeat

**Returns**: the results and the cursor, or the first failure

**Examples**

```kex
Input { input: "abc" }.some { |p| p.charWhen(~alpha?) }
# => Ok((['a', 'b', 'c'], Parsing.Input { pos: 3, input: "abc" }))
Input { input: "123" }.some { |p| p.charWhen(~alpha?) }
# => Error(Unexpected("1", 0))
```

#### `string`

```kex
string(expected: String) -> Result<(String, Input), ParseError>
```

Reads an exact literal.

On a mismatch the `Expected` error names the whole literal and points at its start, not at the first character that differs.

**Parameters**

  - `expected` — the literal that must be next

**Returns**: the literal and the cursor, or an `Expected` error

**Examples**

```kex
Input { input: "abc" }.string("abc")
# => Ok(("abc", Parsing.Input { pos: 3, input: "abc" }))
Input { input: "abc" }.string("abd")   # => Error(Expected("abd", 0))
```

_Matching a keyword_

```kex
let (_, rest) = cursor.string("version(").try
```

#### `takeWhile`

```kex
takeWhile(pred: (Char -> Bool)) -> (String, Input)
```

Reads characters while `pred` holds and returns them as a `String`.

It cannot fail: when the first character does not match, the text is empty. `many` with `charWhen` does the same but returns a list of characters.

**Parameters**

  - `pred` — the test each character must pass

**Returns**: the text read, and the cursor after it

**Examples**

```kex
Input { input: "abc 123" }.takeWhile(~alpha?)
# => ("abc", Parsing.Input { pos: 3, input: "abc 123" })
Input { input: "123" }.takeWhile(~alpha?)
# => ("", Parsing.Input { pos: 0, input: "123" })
```

_Reading an identifier_

```kex
let name = cursor.takeWhile { |c| c.alpha? || c == '_' }
```

#### `choice`

```kex
choice(alts: ([(Input) -> Result<(T, Input), ParseError>])) -> Result<(T, Input), ParseError>
```

Tries each parser in `alts` in turn from the same position and returns the first success.

When none matches, it returns `NoMatch` at the starting position.

**Parameters**

  - `alts` — the parsers to try, in order

**Returns**: the first success, or `NoMatch`

**Examples**

```kex
cursor.choice([
  { |p| p.charWhen(~digit?) },
  { |p| p.charWhen(~alpha?) }
])
# => Ok(('x', Parsing.Input { pos: 1, input: "x1" })) for input "x1"
```
