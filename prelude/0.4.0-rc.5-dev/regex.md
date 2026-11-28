---
package: prelude
version: "0.4.0-rc.5-dev"
source: regex.kex
title: Regex
entities:
  - { kind: module, name: "Regex" }
---

# Regex

## module `Regex`

### `regex`

```kex
regex(source: String) -> Result<Regex, RegexError>
regex(parts: [String], values: [Any]) -> Regex
```

Compiles `source` into a `Regex`.

Use it for a pattern built at run time, such as one read from a config file or typed by a user. For a pattern written in the source, the tag form `` regex`\d+` `` is checked at compile time and returns a `Regex` directly.

**Parameters**

  - `source` — the pattern text

**Returns**: the compiled pattern, or why it failed

**Examples**

```kex
regex("\\d+")   # => Ok(Regex.Regex { source: "\d+" })
regex("(")      # => Error(Regex.RegexError { message: "missing closing parenthesis", position: 1, source: "(" })
```

_Compiling a user-supplied filter_

```kex
match regex(pattern) do
  Ok(re)   => lines.filter { |line| line.matches?(re) }
  Error(e) => do
    IO.printError("bad pattern at ${e.position}: ${e.message}")
    []
  end
end
```

### `withOptions`

```kex
withOptions(source: String, options: {Atom: Bool}) -> Result<Regex, RegexError>
```

Compiles `source` with matching options, like Ruby's `Regexp.new(source, options)`.

The options are `ignoreCase` (`/i`), `multiline` (`^` and `$` match at every line), `dotAll` (`.` also matches a newline) and `extended` (whitespace and `#` comments in the pattern are ignored). An option set to `false` is the same as leaving it out, and an unknown one is a `RegexError` at position 0.

The options are added to the pattern as an inline `(?imsx)` prefix, so the resulting `source` shows them. Positions in a compile error still count from the start of `source` as you passed it.

**Parameters**

  - `source` — the pattern text
  - `options` — which options to turn on

**Returns**: the regex, or why it did not compile

**Examples**

```kex
Regex.withOptions("hello", { ignoreCase: true }).map { |re| "HeLLo".matches?(re) }
# => Ok(true)
Regex.withOptions("x", { verbose: true })
# => Error(Regex.RegexError { message: "unknown regex option :verbose", position: 0, source: "x" })
```

### `validateRegex`

```kex
validateRegex(source: String) -> [TaggedValidation.Issue]
```

Checks a `regex` tagged literal at compile time.

The compiler finds it by the `validate<Tag>` naming convention described in `TaggedValidation`. An invalid literal such as `` regex`(` `` is a compile error, with the caret at the offset where the pattern went wrong.

**Parameters**

  - `source` — the literal's pattern text

**Returns**: the problems found, if any

### `re`

```kex
re(source: String) -> Result<Regex, RegexError>
re(parts: [String], values: [Any]) -> Regex
```

A short name for `regex`, in both its call and tag forms.

It behaves exactly like `regex`. Most code uses it as a tag, where the shorter name reads better.

**Parameters**

  - `source` — the pattern text (call form)

**Returns**: the compiled pattern, or why it failed

**Examples**

```kex
re`https?://\S+`   # tag form  -> Regex
re("\\d+")         # call form -> Result<Regex, RegexError>
```

### `validateRe`

```kex
validateRe(source: String) -> [TaggedValidation.Issue]
```

Checks an `re` tagged literal at compile time, as `validateRegex` does.

**Parameters**

  - `source` — the literal's pattern text

**Returns**: the problems found, if any

### `quote`

```kex
quote(s: String) -> String
```

Returns `s` with every regex metacharacter escaped, as a pattern that matches `s` literally.

Use it to search for text that may contain pattern syntax, such as a search term typed by a user or a file name. Each character is escaped on its own, so a `\E` in `s` cannot end the quoting early as it would inside `\Q...\E`.

**Parameters**

  - `s` — the text to escape

**Returns**: a pattern matching `s` literally

**Examples**

```kex
Regex.quote("a.b")   # => "a\.b"
```

_Searching for a literal term supplied by a user_

```kex
match regex(Regex.quote(term)) do
  Ok(needle) => lines.filter { |line| line.matches?(needle) }
  Error(_)   => []
end
```

### `matches`

```kex
matches(s: String, re: Regex) -> Match?
```

Finds the first occurrence of `re` in `s` and returns what it matched.

The pattern may match anywhere in the string; anchor it with `^...$` to match the whole string. Returns `None` when the pattern does not occur.

**Parameters**

  - `s` — the text to search
  - `re` — the pattern to look for

**Returns**: the first match, or `None`

**Examples**

```kex
"order #4271".matches(re`#(\d+)`).into { |m| m.get(1) }   # => Just("4271")
"no number here".matches(re`#(\d+)`)                          # => None
```

_Pulling a version out of a line_

```kex
line.matches(re`v(\d+)\.(\d+)`).map { |m| (m.get(1, "0"), m.get(2, "0")) }
```

### `matches?`

```kex
matches?(s: String, re: Regex) -> Bool
```

Returns whether `re` occurs anywhere in `s`.

Like `matches`, the pattern is not anchored.

**Parameters**

  - `s` — the text to search
  - `re` — the pattern to look for

**Returns**: `true` when the pattern occurs

**Examples**

```kex
"hello".matches?(re`^h`)      # => true
"hello".matches?(re`\d`)      # => false
```

_Keeping only the lines that look like assignments_

```kex
lines.filter { |line| line.matches?(re`^\w+\s*=`) }
```

### `scan`

```kex
scan(s: String, re: Regex) -> [Match]
```

Returns every match of `re` in `s`, left to right.

The result is a list of `Match` whether or not the pattern has groups, so adding a group does not change its type. An empty list means nothing matched.

**Parameters**

  - `s` — the text to search
  - `re` — the pattern to look for

**Returns**: every match, in order

**Examples**

```kex
"cat=1, dog=2".scan(re`(\w+)=(\d+)`).map { |m| m.get(1, "") }
# => ["cat", "dog"]
```

_Building a map out of key=value pairs_

```kex
Map.from(
  text.scan(re`(\w+)=(\w+)`).map { |m| (m.get(1, ""), m.get(2, "")) }
)
```

### `replace`

```kex
replace(s: String, re: Regex, replacement: (String | (Match) -> String)) -> String
```

Returns `s` with every match of `re` replaced, like Ruby's `gsub`.

The replacement is a `String`, inserted as it is (`$1` and `\1` have no special meaning), or a block that gets the `Match` and returns the text. Use the block to build the replacement from the captured groups.

**Parameters**

  - `s` — the text to rewrite
  - `re` — the pattern to replace
  - `replacement` — the literal text, or a block

**Returns**: the rewritten text

**Examples**

_A literal replacement_

```kex
"a-b-c".replace(re`-`, "+")   # => "a+b+c"
```

_A replacement computed from the match_

```kex
"2026-7-4".replace(re`(\d+)`) do |m|
  m.get(1, "").length.to(String).or("")
end
# => "4-1-1"
```

_Redacting numbers in a log line_

```kex
line.replace(re`\d`, "x")
```

### `replaceFirst`

```kex
replaceFirst(s: String, re: Regex, replacement: (String | (Match) -> String)) -> String
```

Returns `s` with only the first match of `re` replaced, like Ruby's `sub`.

The replacement works as for `replace`.

**Parameters**

  - `s` — the text to rewrite
  - `re` — the pattern to replace
  - `replacement` — the new text, or how to compute it

**Returns**: the text with its first match replaced, or unchanged

**Examples**

```kex
"a1b22c".replaceFirst(re`\d+`, "#")   # => "a#b22c"
"abc".replaceFirst(re`\d`, "#")       # => "abc"
```

### `splitLimit`

```kex
splitLimit(s: String, re: Regex, limit: Integer) -> [String]
```

Splits `s` on `re`, with a limit on the fields.

A positive `limit` is the most fields to return, and the last one holds the rest of the string unsplit. A negative `limit` keeps trailing empty fields, which are dropped otherwise.

Without a limit, use `s.split(re)`. It follows Ruby: trailing empty fields are dropped, leading ones kept, and the text of capture groups is included between the fields.

**Parameters**

  - `s` — the text to split
  - `re` — the separator pattern
  - `limit` — the field cap; negative keeps trailing empty fields

**Returns**: the fields

**Examples**

_Plain splitting needs no limit_

```kex
"a, b ,c".split(re`\s*,\s*`)   # => ["a", "b", "c"]
```

_Splitting off just the first field_

```kex
Regex.splitLimit("a,b,c", re`,`, 2)    # => ["a", "b,c"]
```

_Keeping the trailing empty fields_

```kex
Regex.splitLimit("a,b,,", re`,`, -1)   # => ["a", "b", "", ""]
```

## record `Regex`

Regular expressions in PCRE syntax. Bring them into scope with `using Regex`.

There are two ways to write a pattern. The usual one is the tagged literal `` re`...` ``, which is checked when the program is compiled and gives a `Regex` directly.

```kex
using Regex

main do
  let line = "order #4271 shipped"
  IO.printLine(line.matches?(re`#\d+`))                     # => true
  IO.printLine(line.matches(re`#(\d+)`).into { |m| m.get(1) }.or(""))  # => 4271
end
```

The call form `regex(source)` takes a pattern built at run time and returns a `Result`, since the string may not be a valid pattern:

```kex
match regex(userSupplied) do
  Ok(pattern) => IO.printLine(text.matches?(pattern))
  Error(e)    => IO.printError("bad pattern at ${e.position}: ${e.message}")
end
```

The operations are `matches?` (is it there), `matches` (the first match), `scan` (every match), `replace`, `replaceFirst`, `split` and `splitLimit`.

A compiled regular expression.

Create one with a `re` tagged literal or `regex(source)`.

```kex
let digits = re`[0-9]+`
"item 42".matches(digits).into { |m| m.get(0) }   # => Just("42")
```

**Fields**

  - `source` : [String](string.md#make-string)

Implements [`Showable`](kex.md#trait-showable).

### Functions

#### `showValue` (from Showable)

```kex
showValue -> String
```

Returns the regex written as a `re` literal, which is what interpolation shows.

**Returns**: the pattern as a `re` literal

**Examples**

```kex
"${re`\d+`}"   # => "re`\d+`"
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `RegexError`

A pattern that failed to compile.

`position` counts characters, not bytes, from the start of the pattern.

```kex
regex("(")
# => Error(Regex.RegexError { message: "missing closing parenthesis",
#                             position: 1, source: "(" })
```

**Fields**

  - `source` : [String](string.md#make-string)
  - `position` : [Integer](number.md#make-integer)
  - `message` : [String](string.md#make-string)



## record `Match`

A successful match, and the groups it captured.

Read groups with `get`, by number (`0` is the whole match) or by name (`:year`).

A group that took no part in the match is missing, so `get` returns `None`. A group that matched the empty string returns `Just("")`.

**Fields**

  - `captures` : [Map](map.md#type-map)<Any, [String](string.md#make-string)>
  - `offset` : [Integer](number.md#make-integer)

### Functions

#### `get`

```kex
get(key: Atom | Integer) -> String?
get(key: Atom | Integer, default: String) -> String
```

Returns the text captured by a group, by number or by name.

Group `0` is the whole match; `1` is the first parenthesised group. A named group `(?<year>...)` is read with the atom `:year`. A group that took no part in the match returns `None`.

**Parameters**

  - `key` — the group number or name

**Returns**: the captured text, or `None`

**Examples**

```kex
let found = "order #4271".matches(re`#(\d+)`)
found.into { |m| m.get(0) }   # => Just("#4271")
found.into { |m| m.get(1) }   # => Just("4271")
```

_Named groups_

```kex
"2026-07-04".matches(re`(?<year>\d{4})-(?<month>\d{2})`)
  .into { |m| m.get(:year) }
# => Just("2026")
```
