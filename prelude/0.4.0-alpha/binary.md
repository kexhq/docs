---
package: prelude
version: "0.4.0-alpha"
source: binary.kex
title: Binary
entities:
  - { kind: type, name: "Binary" }
  - { kind: module, name: "Binary" }
  - { kind: make, name: "Binary" }
---

# Binary

## type `Binary`

An opaque, immutable sequence of bytes. A `Binary` never implicitly becomes text.

`[Byte]` is the materialized list of bytes, while `Binary` is the storage form. A file, an HTTP body, or a digest is a `Binary`. On the BEAM it is a native binary, so slicing shares storage instead of copying. None of the operations here walks a character list.

```kex
let data = Binary.fromHex("00686900").try
data.length            # => 4
data.at(1)             # => Just(104)
data.take(2).hex       # => "0068"
data.showValue         # => "#Binary<4 bytes>"
```

The type is opaque on purpose: there is no field to reach through, so text operations cannot be run on bytes by accident. Conversions are always explicit in both directions, and both directions can fail. Runtime conversions through `to` always return an `Optional<T>`:

```kex
"árvíz".to(Binary)                  #  => Just(#Binary<7 bytes>) : Binary?
Binary.fromBytes([255]).to(String)  # => None
```

`Showable` and `Inspectable` deliberately render the length alone. Neither ever decodes or interpolates the payload, so printing a binary cannot leak its contents or fail on bytes that are not text. Use `hex`, `base64`, or `to(String)` when you actually want to see it.



## module `Binary`

## constant `empty`

The binary holding no bytes.

Backed by `Binary.fromBytes([])`, this is the natural starting value this library uses, just like (`Headers.empty`).



## function `fromBytes`

Builds a binary from a list of bytes.

Total: every `Byte` is in `0..255` by construction, so there is no rejection case. `Binary.fromBytes([])` is the empty binary.


```kex
fromBytes(values) : [Byte] -> Binary
```


## function `fromHex`

Decodes lowercase hexadecimal text.

Strict, so that decoding is the exact inverse of `hex`: uppercase digits, an odd length, whitespace, a `0x` prefix, and any non-hex character all answer `None` rather than being repaired.


```kex
fromHex(text) : String -> Binary?
```


## function `fromBase64`

Decodes standard base64 text (RFC 4648).

Strict, so that decoding is the exact inverse of `base64`: the URL-safe alphabet, missing or malformed padding, whitespace, and any other noncanonical encoding all answer `None`.


```kex
fromBase64(text) : String -> Binary?
```


## make `Binary` implements Showable, Inspectable


#### `at`

The byte at `index`, counting from zero.

Answers `None` for a negative or out-of-range index, so an index you did not check is something you handle rather than something that stops the program.

```kex
at(index)
```

**Returns**: `Byte?` — the byte, or `None` when the index is outside the binary

**Examples**

```kex
let data = Binary.fromBytes([104, 105])
data.at(0)    # => Just(104)
data.at(2)    # => None
data.at(-1)   # => None
```

#### `take`

The first `count` bytes.

Clamped at both ends, like the list operations: a `count` of zero or less answers the empty binary, and an oversized one answers the whole binary.

```kex
take(count)
```

**Returns**: `Binary` — the leading bytes

**Examples**

```kex
let data = Binary.fromBytes([104, 105])
data.take(1).bytes     # => [104]
data.take(0).bytes     # => []
data.take(999) == data # => true
```

#### `drop`

Everything after the first `count` bytes.

Clamped at both ends: a `count` of zero or less answers the whole binary, and an oversized one answers the empty binary. `take(n)` and `drop(n)` therefore always concatenate back to the original.

```kex
drop(count)
```

**Returns**: `Binary` — the remaining bytes

**Examples**

```kex
let data = Binary.fromBytes([104, 105])
data.drop(1).bytes                    # => [105]
(data.take(1) + data.drop(1)) == data # => true
```

#### `+`

Joins two binaries end to end.

```kex
+(other)
```

**Returns**: `Binary` — the two payloads, in order

**Examples**

```kex
Binary.fromBytes([104]) + Binary.fromBytes([105])   # => #Binary<2 bytes>
```

#### `inspectValue`

The length-only rendering: never the payload. The same as `showValue`.

```kex
inspectValue(_)
```

**Returns**: `String` — `#Binary<N bytes>`

#### `to`

Decodes the payload as UTF-8, or answers `None` when the bytes are not valid text.

This deliberately differs from `showValue`, which reveals only the byte count. Converting asks to inspect the actual payload and therefore makes the possibility of invalid text explicit.

```kex
to(String)
```

**Returns**: `String?` — the decoded text, or `None` for invalid UTF-8

**Examples**

_Decoding a text response while handling a binary one_

```kex
match response.body.to(String) do
  Just(text) => IO.printLine(text)
  None       => IO.printLine("received ${response.body.length} bytes")
end
```
