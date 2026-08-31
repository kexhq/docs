---
package: prelude
version: "0.4.0-alpha"
source: json.kex
title: JSON
entities:
  - { kind: module, name: "JSON" }
---

# JSON

## module `JSON`

## type `Error`

Why a document could not be parsed. Every variant carries the position in the input where the parser stopped, so a caller can point at the problem.

```kex
JSON.parse("[1, 2")    # => Error(UnexpectedEnd(5))
JSON.parse("// c\n1")  # => Error(UnexpectedCharacter("/", 0))
```



**Variants**

  - `UnexpectedCharacter(String, Integer)`
  - `UnexpectedEnd(Integer)`
  - `InvalidLiteral(String, Integer)`
  - `InvalidNumber(String, Integer)`
  - `InvalidEscape(String, Integer)`
  - `InvalidUnicodeEscape(String, Integer)`
  - `UnterminatedComment(Integer)`
  - `TrailingInput(Integer)`
  - `UnknownOption(Atom)`

## function `parse`

Parses a JSON document, strictly.

The whole text must be one JSON value with nothing after it: trailing input is `TrailingInput`, not a silently ignored tail. Objects come back as maps with atom keys, arrays as lists, `null` as `None`.


```kex
parse(text) : String -> Result<Any, Error>
parse(text) : String -> {Atom: Bool} -> Result<Any, Error>
```


## function `stringify`

Renders a Kex value as strict JSON text.

Maps become objects, lists become arrays, `None` becomes `null`, and strings are escaped. A map written with atom keys (the usual Kex spelling) renders with those names as strings, so `{ name: "Ada" }` becomes `{"name":"Ada"}`. Object keys come out in canonical key order.

Anything the encoder does not recognise renders as `null` rather than failing, so this never raises.


```kex
stringify(value) : Any -> String
```

