---
id: "guide-0-4-0-beta-4-strings"
title: "Strings and binary data"
description: "Distinguish text, characters, raw literals, regexes, and bytes."
path: "/guide/0.4.0/strings/"
draft: false
template: "page"
---
The [Values chapter](../values/) introduced strings and characters. Here you will use their operations and see where text becomes binary data. Start by turning a string into characters and back:

```kex
let text = "Kex"
assert(text.chars == ['K', 'e', 'x'])
assert(['K', 'e', 'x'].join("") == text)
assert('K'.string == "K")
assert("hi".map(&.upperCase) == ['H', 'I'])
assert("hi".mapChars(&.upperCase) == "HI")
IO.printLine("hi".mapChars(&.upperCase))
```

```output filename="OUTPUT"
HI
```

`"Kex".chars` produces `['K', 'e', 'x']`, and `join("")` makes the string again. A `String` is UTF-8 text, a `Char` is one character, and `[Char]` is a list. Use `.chars` when you need list operations and `.mapChars` when the result should remain a string. For non-ASCII input, text length and byte length can differ.

## Interpolation and escaping

Use `${...}` to put a value into a string. The same example also shows trimming and splitting text:

```kex
let person = "Ada"
assert("Hello, ${person}!" == "Hello, Ada!")
assert("  Hello  ".trim.lowerCase == "hello")
assert("a,b,c".split(",") == ["a", "b", "c"])
```

The first assertion builds `"Hello, Ada!"`. `trim.lowerCase` turns `"  Hello  "` into `"hello"`, while `split(",")` makes a list of three strings. Double-quoted strings understand escapes such as `\n`, `\t`, `\\`, and `\"`. Single quotes make a `Char`, not another kind of string.

Backticks make raw strings. A backslash and `${...}` stay as written until you add a `$` before the opening backtick:

```kex
let raw = `a\b ${person}`
let interpolated = $`Hello, ${person}!`
assert(raw.contains?("person"))
assert(interpolated == "Hello, Ada!")
```

The `raw` string still contains the characters in `${person}`, while `interpolated` contains `Ada`. Backtick strings can also span multiple lines. Their closing indentation affects the text, so check whitespace when embedding a template or fixture.

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
