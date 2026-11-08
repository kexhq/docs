---
package: prelude
version: "0.4.0-rc.3-dev"
source: json.kex
title: JSON
entities:
  - { kind: module, name: "JSON" }
---

# JSON

## module `JSON`

### `parse`

```kex
parse(text: String) -> Result<Any, JSONError>
parse(text: String, options: {Atom: Bool}) -> Result<Any, JSONError>
```

Parses a JSON document, strictly.

The whole text must be one JSON value with nothing after it: trailing input is `TrailingInput`, not a silently ignored tail. Objects come back as maps with string keys, arrays as lists, `null` as `None`.

**Parameters**

  - `text` — the JSON document

**Returns**: the parsed value, or why it failed

**Examples**

```kex
JSON.parse("{\"a\": 1, \"b\": [true, null, 2.5]}")
# => Ok({ "a": 1, "b": [true, None, 2.5] })
JSON.parse("[1, 2")   # => Error(UnexpectedEnd(5))
```

_Reading a config file_

```kex
match JSON.parse(FS.File.read("config.json").or("")) do
  Ok(config) => IO.printLine(config)
  Error(e)   => IO.printError("config.json is not valid JSON: ${e}")
end
```

### `stringify`

```kex
stringify(value: Any) -> String
```

Renders a Kex value as strict JSON text.

Maps become objects, lists become arrays, `None` becomes `null`, and strings are escaped. A map written with atom keys (the usual Kex spelling) renders with those names as strings, so `{ name: "Ada" }` becomes `{"name":"Ada"}`. Object keys come out in canonical key order.

Records become objects of their fields, in declaration order; tuples become arrays; atoms, characters and constructors without a payload (`Monday`) become strings. A constructor that carries a payload, such as `Ok(1)`, has no JSON shape of its own and renders as `null` (`Just(x)` is the exception: it is `x`), as does anything else the encoder does not recognise, so this never raises.

**Parameters**

  - `value` — the value to render

**Returns**: the JSON text

**Examples**

```kex
JSON.stringify({ name: "Ada", n: 1, ok: true })
# => '{"n":1,"name":"Ada","ok":true}'
JSON.stringify([1, 2, 3])
# => "[1,2,3]"
```

_Writing a JSON file_

```kex
FS.File.write("out.json", JSON.stringify(report))
```

_A round trip_

```kex
JSON.parse(JSON.stringify({ "a": 1 }))   # => Ok({ "a": 1 })
```

## type `JSONError`

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


