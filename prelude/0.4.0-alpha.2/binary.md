---
package: prelude
version: "0.4.0-alpha.2"
source: binary.kex
title: Binary
entities:
  - { kind: type, name: "Binary" }
  - { kind: module, name: "Binary" }
  - { kind: make, name: "Binary" }
---

# Binary

## type `Binary`

An opaque, immutable sequence of bytes. Binary never implicitly becomes text.

`[Byte]` is the materialized list of bytes; `Binary` is the storage form. A file, an HTTP body, or a digest is a `Binary` — on the BEAM it is a native binary, so slicing it shares storage instead of copying, and none of the operations here ever walks a character list.

```kex
let data = Binary.fromHex("00686900").try
data.length            # => 4
data.at(1)             # => Just(104)
data.take(2).hex       # => "0068"
data.showValue         # => "#Binary<4 bytes>"
```

The type is opaque on purpose: there is no field to reach through, so text operations cannot be run on bytes by accident. Crossing the boundary is always explicit, in both directions, and both directions can fail — text is only some of the byte sequences there are:

```kex
"héllo".to(Binary)               # => Just(#Binary<6 bytes>)
Binary.fromBytes([255]).to(String)   # => None
```

`Showable` and `Inspectable` deliberately render the length alone. Neither ever decodes or interpolates the payload, so printing a binary cannot leak its contents or fail on bytes that are not text. Use `hex`, `base64`, or `to(String)` when you actually want to see it.

Implements [`Showable`](kex.md#trait-showable), [`Inspectable`](kex.md#trait-inspectable).

### Methods

#### `bytes`

```kex
bytes : [Byte]
```

The bytes, as a list.

The explicit, allocating conversion out of binary storage — reach for `length`, `at`, `take`, and `drop` when you do not need the whole list.

**Returns**: every byte, in order

**Examples**

```kex
Binary.fromHex("0068").try.bytes   # => [0, 104]
```

#### `length`

```kex
length : Integer
```

How many bytes it holds.

**Returns**: the byte count

**Examples**

```kex
"héllo".to(Binary).try.length   # => 6
```

#### `empty?`

```kex
empty? : Bool
```

Whether it holds no bytes at all.

**Returns**: `true` when the binary is empty

**Examples**

```kex
Binary.fromBytes([]).empty?   # => true
```

#### `at`

```kex
at(index: Integer) -> Byte?
```

The byte at `index`, counting from zero.

Answers `None` for a negative or out-of-range index, so an index you did not check is something you handle rather than something that stops the program.

**Parameters**

  - `index` — the position to read

**Returns**: the byte, or `None` when the index is outside the binary

**Examples**

```kex
let data = Binary.fromBytes([104, 105])
data.at(0)    # => Just(104)
data.at(2)    # => None
data.at(-1)   # => None
```

#### `take`

```kex
take(count: Integer) -> Binary
```

The first `count` bytes.

Clamped at both ends, like the list operations: a `count` of zero or less answers the empty binary, and an oversized one answers the whole binary.

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

Everything after the first `count` bytes.

Clamped at both ends: a `count` of zero or less answers the whole binary, and an oversized one answers the empty binary. `take(n)` and `drop(n)` therefore always concatenate back to the original.

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
hex : String
```

The bytes as lowercase hexadecimal text, two digits per byte.

**Returns**: the hexadecimal encoding

**Examples**

```kex
Binary.fromBytes([0, 104, 255]).hex   # => "0068ff"
```

#### `base64`

```kex
base64 : String
```

The bytes as standard base64 text (RFC 4648), with canonical padding.

**Returns**: the base64 encoding

**Examples**

```kex
Binary.fromBytes([0, 104, 105, 255]).base64   # => "AGhp/w=="
```

#### `showValue` (from Showable)

```kex
showValue : String
```

The length-only rendering — never the payload.

**Returns**: `#Binary<N bytes>`

**Examples**

```kex
Binary.fromBytes([104, 105]).showValue   # => "#Binary<2 bytes>"
```

#### `inspectValue` (from Inspectable)

```kex
inspectValue(_: Bool) -> String
```

The length-only rendering — never the payload. The same as `showValue`.

**Returns**: `#Binary<N bytes>`

#### `to`

```kex
to(_)
```

Binary's String conversion decodes its payload; it must not inherit the Showable fallback, which would convert the safe length-only rendering.

## module `Binary`

### `empty` (constant)

```kex
empty : Binary
```

The binary holding no bytes.

The same value `Binary.fromBytes([])` builds, under the name the rest of the library uses for a neutral starting value (`Headers.empty`).

**Examples**

```kex
Binary.empty.length   # => 0
```



### `fromBytes`

```kex
fromBytes(values: [Byte]) -> Binary
```

Builds a binary from a list of bytes.

Total: every `Byte` is in `0..255` by construction, so there is no rejection case. `Binary.fromBytes([])` is the empty binary.

**Parameters**

  - `values` — the bytes to store

**Returns**: the bytes, in binary storage

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

Strict, so that decoding is the exact inverse of `hex`: uppercase digits, an odd length, whitespace, a `0x` prefix, and any non-hex character all answer `None` rather than being repaired.

**Parameters**

  - `text` — the hexadecimal text

**Returns**: the bytes, or `None` when the text is not canonical hex

**Examples**

```kex
Binary.fromHex("0068")   # => Just(#Binary<2 bytes>)
Binary.fromHex("0x68")   # => None
Binary.fromHex("AB")     # => None
Binary.fromHex("a")      # => None
```

### `fromBase64`

```kex
fromBase64(text: String) -> Binary?
```

Decodes standard base64 text (RFC 4648).

Strict, so that decoding is the exact inverse of `base64`: the URL-safe alphabet, missing or malformed padding, whitespace, and any other noncanonical encoding all answer `None`.

**Parameters**

  - `text` — the base64 text

**Returns**: the bytes, or `None` when the text is not canonical

**Examples**

```kex
Binary.fromBase64("AGhp/w==")   # => Just(#Binary<4 bytes>)
Binary.fromBase64("AGhp_w==")   # => None
Binary.fromBase64("AGhp/w")     # => None
```
