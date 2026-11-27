---
package: prelude
version: "0.4.0-rc.4-dev"
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

Parses a strict JSON document.

The text must be one JSON value; anything after it is a `TrailingInput` error. Objects come back as maps with string keys, arrays as lists, and `null` as `None`.

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

### `fields`

```kex
fields(value: Any) -> {String: Any}
```

Returns the fields of a parsed object, or `{}` for any other value.

`parse` returns `Any`; use this to read it as an object.

**Parameters**

  - `value` — a parsed value

**Returns**: its fields, or `{}` when it is no object

**Examples**

```kex
JSON.fields(JSON.parse("{\"a\": 1}").or({}))["a"]   # => Just(1)
JSON.fields(JSON.parse("[1]").or({}))                # => {}
```

### `items`

```kex
items(value: Any) -> [Any]
```

Returns the elements of a parsed array, or `[]` for any other value.

**Parameters**

  - `value` — a parsed value

**Returns**: its elements, or `[]` when it is no array

**Examples**

```kex
JSON.items(JSON.parse("[1, 2]").or([]))   # => [1, 2]
```

### `stringify`

```kex
stringify(value: Any) -> String
```

Renders a Kex value as strict JSON text.

Maps become objects, lists arrays, `None` `null`, and strings are escaped. Atom keys become strings, so `{ name: "Ada" }` becomes `{"name":"Ada"}`. Object keys come out in the map's key order.

Records become objects with their fields in declaration order, tuples become arrays, and atoms, characters and constructors without a payload (`Monday`) become strings. `Just(x)` renders as `x`. Any other constructor with a payload, such as `Ok(1)`, renders as `null`, as does anything else with no JSON form, so `stringify` never fails.

**Parameters**

  - `value` — the value to render

**Returns**: the JSON text

**Examples**

```kex
JSON.stringify({ name: "Ada", n: 1, ok: true })
# => "{\"n\":1,\"name\":\"Ada\",\"ok\":true}"
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

Why a document could not be parsed. Every variant except `UnknownOption` carries the character position where the parser stopped.

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


