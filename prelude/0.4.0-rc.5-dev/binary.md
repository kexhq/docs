---
package: prelude
version: "0.4.0-rc.5-dev"
source: binary.kex
title: Binary
entities:
  - { kind: type, name: "Binary" }
  - { kind: module, name: "Binary" }
  - { kind: make, name: "Binary" }
---

# Binary

## type `Binary`

An immutable sequence of bytes, such as a file's contents, an HTTP body or a digest.

`Binary` is the compact storage form; `[Byte]` is the same bytes as a list. On BEAM, `take` and `drop` share the original's storage instead of copying it.

```kex
let data = Binary.fromHex("00686900").try
data.length            # => 4
data.at(1)             # => Just(104)
data.take(2).hex       # => "0068"
data.showValue         # => "#Binary<4 bytes>"
```

The type is opaque, so string functions cannot be run on bytes by mistake. Converting to or from text is always explicit, and `to` returns an optional, since the conversion can fail:

```kex
"árvíz".to(Binary)                  # => Just(#Binary<7 bytes>)
Binary.fromBytes([255]).to(String)  # => None
```

Printing a binary shows only its length. It never shows the bytes, so it cannot leak them, and it cannot fail on bytes that are not text. Use `hex`, `base64` or `to(String)` to see the contents.

Implements [`Showable`](kex.md#trait-showable), [`Inspectable`](kex.md#trait-inspectable).

### Functions

#### `bytes`

```kex
bytes -> [Byte]
```

Returns the bytes as a list.

This copies every byte into a new list. `length`, `at`, `take` and `drop` work on the binary directly.

**Returns**: every byte, in order

**Examples**

```kex
Binary.fromHex("0068").try.bytes   # => [0, 104]
```

#### `length`

```kex
length -> Integer
```

Returns the number of bytes.

**Returns**: the byte count

**Examples**

```kex
"héllo".to(Binary).try.length   # => 6
```

#### `count`

```kex
count -> Integer
```

Returns the number of bytes; the same as `length`.

**Returns**: the byte count

**Examples**

```kex
"héllo".to(Binary).try.count   # => 6
```

#### `empty?`

```kex
empty? -> Bool
```

Returns `true` when the binary has no bytes.

**Returns**: `true` when the binary is empty

**Examples**

```kex
Binary.fromBytes([]).empty?   # => true
```

#### `at`

```kex
at(index: Integer) -> Byte?
```

Returns the byte at `index`, counting from zero, or `None` when the index is outside the binary.

A negative index counts back from the end, as on a list: `-1` is the last byte.

**Parameters**

  - `index` — the position to read

**Returns**: the byte, or `None` when the index is outside the binary

**Examples**

```kex
let data = Binary.fromBytes([104, 105])
data.at(0)    # => Just(104)
data.at(2)    # => None
data.at(-1)   # => Just(105)
data.at(-3)   # => None
```

#### `get`

```kex
get(index: Integer) -> Byte?
get(index: Integer, default: Byte) -> Byte
```

Returns the byte at `index`, or `None` when the index is outside the binary; the same as `at`.

**Parameters**

  - `index` — the position to read

**Returns**: the byte, or `None` when the index is outside the binary

**Examples**

```kex
Binary.fromBytes([104, 105]).get(1)   # => Just(105)
Binary.fromBytes([104, 105]).get(9)   # => None
```

#### `take`

```kex
take(count: Integer) -> Binary
```

Returns the first `count` bytes.

A `count` of zero or less gives the empty binary, and one past the end gives the whole binary.

**Parameters**

  - `count` — how many bytes to keep

**Returns**: the leading bytes

**Examples**

```kex
let data = Binary.fromBytes([104, 105])
data.take(1).bytes     # => [104]
data.take(0).bytes     # => []
data.take(999) == data # => true
```

#### `drop`

```kex
drop(count: Integer) -> Binary
```

Returns the bytes after the first `count`.

A `count` of zero or less gives the whole binary, and one past the end gives the empty binary, so +take(n) + drop(n)+ is always the original.

**Parameters**

  - `count` — how many bytes to skip

**Returns**: the remaining bytes

**Examples**

```kex
let data = Binary.fromBytes([104, 105])
data.drop(1).bytes                    # => [105]
(data.take(1) + data.drop(1)) == data # => true
```

#### `+`

```kex
+(other: Binary) -> Binary
```

Joins two binaries end to end.

**Parameters**

  - `other` — the bytes to append

**Returns**: the two payloads, in order

**Examples**

```kex
Binary.fromBytes([104]) + Binary.fromBytes([105])   # => #Binary<2 bytes>
```

#### `hex`

```kex
hex -> String
```

Returns the bytes as lowercase hexadecimal text, two digits per byte.

**Returns**: the hexadecimal encoding

**Examples**

```kex
Binary.fromBytes([0, 104, 255]).hex   # => "0068ff"
```

#### `base64`

```kex
base64 -> String
```

Returns the bytes as standard, padded base64 text (RFC 4648).

**Returns**: the base64 encoding

**Examples**

```kex
Binary.fromBytes([0, 104, 105, 255]).base64   # => "AGhp/w=="
```

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the binary as its length, never its contents.

**Returns**: `#Binary<N bytes>`

**Examples**

```kex
Binary.fromBytes([104, 105]).showValue   # => "#Binary<2 bytes>"
```

#### `inspectValue` (from Inspectable)

```kex
inspectValue(_: Bool) -> String
```

Renders the binary as its length, never its contents; the same as `showValue`.

**Returns**: `#Binary<N bytes>`

#### `to`

```kex
to(String) -> String?
```

Decodes the bytes as UTF-8, or returns `None` when they are not valid UTF-8.

Unlike `showValue`, this exposes the contents.

**Returns**: the decoded text, or `None` for invalid UTF-8

**Examples**

_Printing a response body that may not be text_

```kex
match response.body.to(String) do
  Just(text) => IO.printLine(text)
  None       => IO.printLine("received ${response.body.length} bytes")
end
```

## module `Binary`

### `empty` (constant)

```kex
empty : Binary
```

The binary with no bytes.

**Examples**

```kex
Binary.empty.length   # => 0
```



### `fromBytes`

```kex
fromBytes(values: [Byte]) -> Binary
```

Builds a binary from a list of bytes.

It cannot fail, since every `Byte` is already in `0..255`.

**Parameters**

  - `values` — the bytes to store

**Returns**: the bytes as a binary

**Examples**

```kex
Binary.fromBytes([104, 105])   # => #Binary<2 bytes>
Binary.fromBytes([])           # => #Binary<0 bytes>
```

### `fromHex`

```kex
fromHex(text: String) -> Binary?
```

Decodes lowercase hexadecimal text.

It accepts exactly what `hex` produces. Uppercase digits, an odd length, whitespace, a `0x` prefix or any other character give `None`.

**Parameters**

  - `text` — the hexadecimal text

**Returns**: the bytes, or `None` when the text is not lowercase hex

**Examples**

```kex
Binary.fromHex("0068")   # => Just(#Binary<2 bytes>)
Binary.fromHex("0x68")   # => None
Binary.fromHex("AB")     # => None
Binary.fromHex("a")      # => None
```

_Reading an identifier from the environment_

```kex
let key = ENV.get("CACHE_KEY").into { |text| Binary.fromHex(text) }
let cacheEnabled? = key.present?
```

### `fromBase64`

```kex
fromBase64(text: String) -> Binary?
```

Decodes standard base64 text (RFC 4648).

It accepts exactly what `base64` produces. The URL-safe alphabet, missing or wrong padding, whitespace and any other variant give `None`.

**Parameters**

  - `text` — the base64 text

**Returns**: the bytes, or `None` when the text is not standard, padded base64

**Examples**

```kex
Binary.fromBase64("AGhp/w==")   # => Just(#Binary<4 bytes>)
Binary.fromBase64("AGhp_w==")   # => None
Binary.fromBase64("AGhp/w")     # => None
```

_Loading key material from an environment variable_

```kex
let signingKey = ENV.get("SIGNING_KEY").into { |text| Binary.fromBase64(text) }
```
