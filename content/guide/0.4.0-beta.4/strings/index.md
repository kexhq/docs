---
id: "guide-0-4-0-beta-4-strings"
title: "Strings and binary data"
description: "Distinguish text, characters, raw literals, regexes, and bytes."
path: "/guide/0.4.0-beta.4/strings/"
draft: false
template: "page"
---
A `String` is UTF-8 text. A `Char` is one character. A `[Char]` is an ordinary list of characters. These are distinct types, even when their contents look similar when printed.

```kex
let text = "Kex"
assert(text.chars == ['K', 'e', 'x'])
assert(['K', 'e', 'x'].join("") == text)
assert('K'.string == "K")
assert("hi".map(&.upperCase) == ['H', 'I'])
assert("hi".mapChars(&.upperCase) == "HI")
```

Use `.chars` when an algorithm needs list semantics and `.mapChars` when transforming text into text. Text length and byte length are different concepts for non-ASCII input; choose byte operations when implementing a wire format or binary file format.

## Interpolation and escaping

```kex
let person = "Ada"
assert("Hello, ${person}!" == "Hello, Ada!")
assert("  Hello  ".trim.lowerCase == "hello")
assert("a,b,c".split(",") == ["a", "b", "c"])
```

Double-quoted strings understand escapes such as `\n`, `\t`, `\\`, and `\"`. Single quotes represent characters, not another string syntax.

Backticks create raw strings: backslashes and `${...}` remain literal. Prefix a backtick string with `$` to enable interpolation while retaining raw backslashes.

```kex
let raw = `a\b ${person}`
let interpolated = $`Hello, ${person}!`
assert(raw.contains?("person"))
assert(interpolated == "Hello, Ada!")
```

Multiline backtick strings can use a closing-line indentation margin. Check intended trailing newlines when embedding templates or fixtures; whitespace is data.

## Tagged literals and regexes

```kex
using Regex
let digits = regex`\d+`
assert("version 42".matches?(digits))
assert(!"no digits".matches?(digits))
```

A tag immediately adjacent to a backtick literal calls a tag function. Raw tagged literals can be checked at compile time by a `validate<Tag>` companion. Interpolating forms pass literal parts and values to the tag, which decides how to combine or escape them. Regex interpolation escapes inserted values so data is not accidentally treated as pattern syntax.

Regex matching uses the backend's regex implementation. Test patterns that depend on advanced features on the backend you deploy.

## Binary boundaries

```kex
let bytes = "hello".to(Binary).try
assert(bytes.to(String).try == "hello")
```

Use `Binary` for bytes and convert deliberately at a text boundary. Arbitrary bytes are not necessarily valid UTF-8; handle a failed conversion when decoding untrusted input. The Binary and Bits APIs cover binary composition and lower-level operations; see their [reference](/prelude/).
