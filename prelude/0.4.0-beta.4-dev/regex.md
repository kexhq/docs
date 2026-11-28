---
package: prelude
version: "0.4.0-beta.4-dev"
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

NOTE: deliberately does NOT `implement: Errorable`, even though the trait exists for exactly this shape. Declaring a `message` method alongside the `message` field makes `e.message` dispatch to the method instead of reading the field, which fails with `undef` on the BEAM backend. `ParseError`: the prelude's equivalent error record: carries a bare `message` field for the same reason; nothing in the tree implements Errorable today.

Compiles `source` into a `Regex`.

Answers a `Result` because an arbitrary string may not be a valid pattern. Use this form when the pattern is built at run time: from a config file, from user input. For a pattern you write yourself, the tag form `` regex`\d+` `` is checked at compile time and hands back a bare `Regex`.

**Parameters**

  - `source` — the pattern text

**Returns**: the compiled pattern, or why it failed

**Examples**

```kex
regex("\\d+")   # => Ok(Regex { source: "\\d+" })
regex("(")      # => Error(RegexError { message: "missing closing parenthesis", ... })
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

### `validateRegex`

```kex
validateRegex(source: String) -> [TaggedValidation.Issue]
```

Validates a `regex` tagged literal at compile time.

Found by the compiler through the standard `validate<Tag>` naming convention (nothing about regex is special-cased). A raw `` regex`(` `` is a compile error, with the caret pointing at the byte offset PCRE2 reported inside the literal.

Must stay pure: the compiler evaluates it on the tree-walk interpreter at compile time, so marking it `foul` would break builds, not just calls.

**Parameters**

  - `source` — the literal's pattern text

**Returns**: the problems found, if any

### `re`

```kex
re(parts, values) -> Result<Regex, RegexError>
```

A short alias for `regex`, in both its forms.

A second name bound to the same two functions, not a lexer synonym, so every property of `regex` (escaping, backend mapping, error shape) applies to it unchanged. Most code uses the tag form, where the shorter name reads better.

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

Validates an `re` tagged literal at compile time, delegating to `validateRegex`. The compiler finds it by the same `validate<Tag>` convention.

**Parameters**

  - `source` — the literal's pattern text

**Returns**: the problems found, if any

### `quote`

```kex
quote(s: String) -> String
```

Escapes every regex metacharacter in `s`, so the result matches `s` literally.

This is how to search for text that may itself contain pattern syntax: a search term typed by a user, a filename, a version string. It escapes per character rather than wrapping in `\Q...\E`, which a value containing `\E` would break out of.

**Parameters**

  - `s` — the text to escape

**Returns**: a pattern matching `s` literally

**Examples**

```kex
Regex.quote("a.b")   # => "a\\.b"
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

Unanchored: the pattern may match anywhere in the string. Anchor it with `^...$` when a whole-string match is what you mean. Answers `None` when the pattern does not occur.

**Parameters**

  - `s` — the text to search
  - `re` — the pattern to look for

**Returns**: the first match, or `None`

**Examples**

```kex
"order #4271".matches(re`#(\d+)`).flatMap { |m| m.get(1) }   # => Just("4271")
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

Returns `true` when `re` occurs anywhere in `s`.

The boolean form of `matches`, and unanchored for the same reason. Use it when you only need to know whether the pattern is there.

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

Always answers `[Match]`, whether or not the pattern has capture groups: adding a group to a pattern must not change the type flowing out of `scan`. An empty list means nothing matched.

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
Kex.Intrinsic.Map.fromEntries(
  text.scan(re`(\w+)=(\w+)`).map { |m| (m.get(1, ""), m.get(2, "")) }
)
```

### `replace`

```kex
replace : String -> Regex -> String | (Match) -> String -> String
```

Replaces EVERY match of `re` in `s`: this is `gsub`, not `sub`.

The replacement is either a literal `String`, inserted verbatim with no `$1` / `\1` backreference syntax, or a block receiving the `Match`, which is how a replacement built from what was captured is written.

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

### `splitLimit`

```kex
splitLimit : String -> Regex -> Integer -> [String]
```

Splits `s` on `re`, capping the number of fields.

A positive `limit` caps the field count, leaving the remainder unsplit in the last field; a negative `limit` keeps trailing empty fields instead of dropping them.

Plain `s.split(re)` needs no function here at all: it resolves to `String.split`, which dispatches to this engine when handed a Regex (in both backends), and follows Ruby's semantics: trailing empty fields are dropped, leading ones are kept, and capture groups are interleaved into the result.

Only the limit form needs a name, and it deliberately is NOT `split`: this module must not export that name. On BEAM, a module in scope via `using` captures a method name for EVERY receiver, so exporting `split` here would route `"a,b".split(",")` and even the no-argument `"hi".split` through this module and break them.

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

Regular expressions, backed by PCRE2 in the interpreter and Erlang's `re` on BEAM: the same PCRE pattern language on both.

Opt-in, not prelude: nothing here is in scope until `using Regex`.

There are two ways to write a pattern. The tagged literal is the everyday one: it is checked when your program is compiled, so it cannot fail at run time and gives you a bare `Regex`.

```kex
using Regex

main do
  let line = "order #4271 shipped"
  IO.printLine(line.matches?(re`#\d+`))                     # => true
  IO.printLine(line.matches(re`#(\d+)`).map { |m| m.get(1) })  # => 4271
end
```

The call form takes a pattern built at run time and answers a `Result`, because an arbitrary string may not be a valid pattern:

```kex
match regex(userSupplied) do
  Ok(pattern) => IO.printLine(text.matches?(pattern))
  Error(e)    => IO.printError("bad pattern at ${e.position}: ${e.message}")
end
```

The operations are `matches?` (is it there), `matches` (find the first), `scan` (find them all), `replace`, and `split`.

A compiled regular expression.

`Regex` carries only its pattern source. The compiled engine object lives in a runtime cache keyed by that source, deliberately: a compiled pattern bakes in the host's PCRE version and must never be embedded in a distributed artifact, so the source string is the value's identity.

**Fields**

  - `source` : [String](string.md#make-string)



## record `RegexError`

A pattern that failed to compile.

Mirrors `ParseError`: the `position` is a *character* offset into the pattern, not a byte offset, so it agrees across backends on patterns containing non-ASCII.

```kex
regex("(")
# => Error(RegexError { source: "(", position: 1,
#                       message: "missing closing parenthesis" })
```

**Fields**

  - `source` : [String](string.md#make-string)
  - `position` : [Integer](number.md#make-integer)
  - `message` : [String](string.md#make-string)



## record `Match`

A successful match, and the groups it captured.

It behaves like a map keyed by both group number (`0` is the whole match) and group name (`:year`), but is a named type so it can grow spans and surrounding context later without breaking existing `get` call sites.

A group that did not participate is an absent key, so `get` answers `None`. This differs from a group that matched the empty string, which answers `Just("")`.

**Fields**

  - `captures` : [Map](map.md#type-map)<Any, [String](string.md#make-string)>

### Methods

NOTE: the accessor is `get`, not `get`. A `make` block on a user type that defines a method name the prelude also uses breaks that name's dispatch for every OTHER type on the BEAM backend: with `get` here, merely saying `using Regex` made a plain `someMap.get(k)` fail with function_clause. `get` also matches Python's `m.get(1)` and Java's `matcher.get(1)`. A plain Map's `get` is unaffected: resolution picks a local method by receiver type, name and arity.

#### `get`

```kex
get(key: Atom | Integer) -> String?
get(key: Atom | Integer, default: String) -> String
```

Returns the text captured by a group, by number or by name.

Group `0` is the whole match; `1` is the first parenthesised group. A named group `(?<year>...)` is reached with the atom `:year`. A group that did not participate answers `None`.

**Parameters**

  - `key` — the group number or name

**Returns**: the captured text, or `None`

**Examples**

```kex
let found = "order #4271".matches(re`#(\d+)`)
found.flatMap { |m| m.get(0) }   # => Just("#4271")
found.flatMap { |m| m.get(1) }   # => Just("4271")
```

_Named groups_

```kex
"2026-07-04".matches(re`(?<year>\d{4})-(?<month>\d{2})`)
  .flatMap { |m| m.get(:year) }
# => Just("2026")
```
