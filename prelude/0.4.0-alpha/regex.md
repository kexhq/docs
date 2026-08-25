---
package: prelude
version: "0.4.0-alpha"
source: regex.kex
title: Regex
entities:
  - { kind: module, name: "Regex" }
---

# Regex

## module `Regex`

## record `Regex`

Regular expressions, backed by PCRE2 in the interpreter and Erlang's `re` on BEAM — the same PCRE pattern language on both.

Opt-in, not prelude: nothing here is in scope until `using Regex`.

  match regex("\\d`") do     Ok(re)   -> IO.printLine("compiled")     Error(e) -> IO.printLine("bad pattern at ${e.position}: ${e.message}")   end

`Regex+ carries only its pattern source. The compiled engine object lives in a runtime cache keyed by that source, deliberately: a compiled pattern bakes in the host's PCRE version and must never be embedded in a distributed artifact, so the source string is the value's identity.

**Fields**

  - `source` : String

## record `RegexError`

`RegexError` describes a pattern that failed to compile. Mirrors `ParseError` — the `position` is a *character* offset into the pattern, not a byte offset, so it agrees across backends on patterns containing non-ASCII.

**Fields**

  - `source` : String
  - `position` : Integer
  - `message` : String

## function `regex`

NOTE: deliberately does NOT `implement: Errorable`, even though the trait exists for exactly this shape. Declaring a `message` method alongside the `message` field makes `e.message` dispatch to the method instead of reading the field, which fails with `undef` on the BEAM backend. `ParseError` — the prelude's equivalent error record — carries a bare `message` field for the same reason; nothing in the tree implements Errorable today.

Compiles a pattern. Returns `Result` because an arbitrary string may not be a valid pattern; the tag form `regex`...`` returns a bare `Regex` instead, since a literal is validated at compile time and cannot fail.


```kex
regex(source) : String -> Result<Regex, RegexError>
regex(source) : [String] -> [Any] -> Regex
```


## function `validateRegex`

Companion validator for the `regex` tag, found by the compiler through the standard `validate<Tag>` naming convention (nothing about regex is special- cased). A raw `` regex`(` `` is a compile error, with the caret pointing at the byte offset PCRE2 reported inside the literal.

Must stay pure: the compiler evaluates it on the tree-walk interpreter at compile time, so marking it `foul` would break builds, not just calls.


```kex
validateRegex(source)
```


## function `re`

`re` is a short alias for `regex` — a second name bound to the same two functions, not a lexer synonym, so every property of `regex` (escaping, backend mapping, error shape) applies to it unchanged.


```kex
re(source)
```


## function `validateRe`

Companion validator for the `re` tag, delegating to validateRegex. The compiler finds it by the same `validate<Tag>` convention.


```kex
validateRe(source)
```


## function `quote`

Escapes every regex metacharacter in `s`, so the result matches `s` literally. Escapes per character rather than wrapping in `\Q...\E`, which a value containing `\E` would break out of.


```kex
quote(s) : String -> String
```


## record `Match`

`Match` is the result of a successful match. It behaves like a map keyed by both group number (`0` is the whole match) and group name (`:year`), but is a named type so it can grow spans and surrounding context later without breaking existing `get` call sites.

A group that did not participate is an absent key, so `get` returns `None` — distinct from a group that matched the empty string, which returns `Just("")`.

**Fields**

  - `captures` : Map<Any, String>

## make `Match`

NOTE: the accessor is `get`, not `get`. A `make` block on a user type that defines a method name the prelude also uses breaks that name's dispatch for every OTHER type on the BEAM backend — with `get` here, merely saying `using Regex` made a plain `someMap.get(k)` fail with function_clause. `get` also matches Python's `m.get(1)` and Java's `matcher.get(1)`. A plain Map's `get` is unaffected: resolution picks a local method by receiver type, name and arity.


#### `get`

Returns the captured text for a group, by number or by name.

```kex
get(key) : Atom | Integer -> String?
get(key) : Atom | Integer -> String -> String
```

**Returns**: `String?`

**Examples**

```kex
  m.get(0)      # whole match
  m.get(1)      # first positional group
  m.get(:year)  # named group
```

## function `matches`

Finds the first occurrence of `re` anywhere in `s`. Unanchored — anchor with `^...$` in the pattern if a whole-string match is wanted.


```kex
matches(s, re) : String -> Regex -> Match?
```


## function `matches?`

Reports whether `re` occurs anywhere in `s`. The boolean form of `matches`, and unanchored for the same reason.


```kex
matches?(s, re) : String -> Regex -> Bool
```


## function `scan`

Every match of `re` in `s`, left to right.

Always returns `[Match]`, whether or not the pattern has capture groups — adding a group to a pattern must not change the type flowing out of `scan`.


```kex
scan(s, re) : String -> Regex -> [Match]
```


## function `replace`

Replaces **every** match of `re` in `s` — this is `gsub`, not `sub`.

The replacement is either a literal String, inserted verbatim with no `$1`/`\1` backreference syntax, or a block receiving the `Match`.


```kex
replace : String -> Regex -> String | (Match) -> String -> String
```


## function `splitLimit`

Splits `s` on `re`, following Ruby's semantics: trailing empty fields are dropped (leading ones are kept), and any capture groups in the pattern are interleaved into the result.

Plain `s.split(re)` needs no function here at all: it resolves to `String.split`, which dispatches to this engine when handed a Regex (in both backends). Only the limit form needs a name, and it deliberately is NOT `split` — this module must not export that name. On BEAM, a module in scope via `using` captures a method name for EVERY receiver, so exporting `split` here would route `"a,b".split(",")` and even the no-argument `"hi".split` through this module and break them.


```kex
splitLimit : String -> Regex -> Integer -> [String]
```

