---
package: prelude
version: "0.4.0-alpha.2"
source: uri.kex
title: URI
entities:
  - { kind: module, name: "URI" }
---

# URI

## module `URI`

### `parse`

```kex
parse(text: String) -> Result<URI, URIError>
```

Strictly parses an ASCII RFC 3986 URI reference.

**Returns**: the reference or a precise syntax error

**Examples**

_+URI.parse("../images/logo.svg").try+_

```kex

```

### `fromIRI`

```kex
fromIRI(text: String) -> Result<URI, URIError>
```

Converts a Unicode IRI to an ASCII URI using IDNA and UTF-8 percent encoding.

**Returns**: the converted URI or a conversion error

**Examples**

_+URI.fromIRI("https://münich.example/straße").try+_

```kex

```

## record `URI`

Strict RFC 3986 URI values, hierarchical URLs, query strings, and HTML form encoding. Parsing preserves caller spelling; normalization is always explicit.

```kex
using URI

let base = URL.parse("https://example.test/a/").try
let reference = URI.parse("../items?limit=10").try
base.resolve(reference).try.string
```

A parsed RFC 3986 URI reference. Construction is strict; use `parse` rather than building this representation directly. `string` preserves the spelling supplied by the caller, while `normalize` is explicit.

**Fields**

  - `source` : [String](string.md#make-string)

Implements [`Showable`](kex.md#trait-showable), [`Inspectable`](kex.md#trait-inspectable).

### Methods

#### `string`

```kex
string : String
```

**Returns**: the caller-supplied URI spelling

#### `normalize`

```kex
normalize : URI
```

**Returns**: an explicitly normalized RFC 3986 representation

#### `equivalent?`

```kex
equivalent?(other: URI) -> Bool
```

**Returns**: whether normalized representations are equal

#### `resolve`

```kex
resolve(reference: URI) -> Result<URI, URIError>
```

Resolves a URI reference against this absolute base.

#### `scheme`

```kex
scheme : String?
```

**Returns**: the normalized scheme when present

#### `host`

```kex
host : Host?
```

**Returns**: the parsed authority host when present

#### `query`

```kex
query : Query?
```

**Returns**: the parsed query when present, including an empty query

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders with any authority password replaced by `***`.

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Structural inspection is also credential-safe.

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `URL`

An absolute hierarchical URI with an authority component.

**Fields**

  - `source` : [String](string.md#make-string)

Implements [`Showable`](kex.md#trait-showable), [`Inspectable`](kex.md#trait-inspectable).

### Methods

#### `string`

```kex
string : String
```

**Returns**: the caller-supplied URL spelling

#### `normalize`

```kex
normalize : URL
```

**Returns**: an explicitly normalized URL

#### `equivalent?`

```kex
equivalent?(other: URL) -> Bool
```

**Returns**: whether normalized representations are equal

#### `resolve`

```kex
resolve(reference: URI) -> Result<URL, URIError>
```

Resolves a URI reference while preserving the URL invariant.

#### `scheme`

```kex
scheme : String
```

**Returns**: the normalized scheme

#### `host`

```kex
host : Host
```

**Returns**: the authority host

#### `query`

```kex
query : Query?
```

**Returns**: the parsed query when present

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders with any authority password replaced by `***`.

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Structural inspection is also credential-safe.

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `Host`

A host's display spelling and normalized ASCII/IDNA spelling.

**Fields**

  - `display` : [String](string.md#make-string)
  - `ascii` : [String](string.md#make-string)



## record `Query`

Ordered URI query entries. `None` distinguishes a bare key from `key=`.

**Fields**

  - `entries` : [([String](string.md#make-string), [String](string.md#make-string)?)]

### Methods

#### `encode`

```kex
encode : String
```

Encodes according to generic RFC 3986 query rules.

## record `Form`

Ordered `application/x-www-form-urlencoded` entries.

**Fields**

  - `entries` : [([String](string.md#make-string), [String](string.md#make-string)?)]

### Methods

#### `encode`

```kex
encode : String
```

Encodes according to HTML form rules, including space as ++.

## record `URIError`

A typed URI parsing, conversion, or resolution failure.

**Fields**

  - `kind` : [URIErrorKind](#type-uri-urierrorkind)
  - `message` : [String](string.md#make-string)
  - `position` : [Integer](number.md#make-integer)?



## type `URIErrorKind`

Stable URI failure categories.

**Variants**

  - `InvalidSyntax`
  - `InvalidEscape`
  - `InvalidAuthority`
  - `InvalidPort`
  - `NonASCII`
  - `NotAbsolute`
  - `NotHierarchical`
  - `MissingAuthority`
  - `UnsupportedScheme`



## module `URI.URL`

### `parse`

```kex
parse(text: String) -> Result<URL, URIError>
```

Parses an absolute hierarchical URL with an authority.

**Examples**

_+URL.parse("https://example.test/path?q=1").try+_

```kex

```

### `build`

```kex
build : String -> String -> [String] -> Query -> Result<URL, URIError>
```

Builds and validates a URL from decoded path segments and a query value.

## module `URI.Query`

### `from`

```kex
from(entries: [(String, String?)]) -> Query
```

Builds a query while preserving order, duplicates, and bare keys.

### `parse`

```kex
parse(text: String) -> Result<Query, URIError>
```

Parses generic URI query encoding; ++ remains a literal plus.

**Examples**

_+Query.parse("tag=kex&tag=beam&flag").try+_

```kex

```

## module `URI.Form`

### `from`

```kex
from(entries: [(String, String)]) -> Form
```

Builds a form value while preserving order and duplicates.

### `parse`

```kex
parse(text: String) -> Result<Form, URIError>
```

Parses form encoding where ++ represents a space.

**Examples**

_+Form.parse("query=hello+world").try+_

```kex

```
