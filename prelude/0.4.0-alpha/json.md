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


```kex
parse(text) : String -> Result<Any, Error>
parse(text) : String -> {Atom: Bool} -> Result<Any, Error>
```


## function `stringify`


```kex
stringify(value) : Any -> String
```

