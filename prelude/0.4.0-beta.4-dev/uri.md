---
package: prelude
version: "0.4.0-beta.4-dev"
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

Relative references are valid here. Use `URL.parse` when the input must be a complete hierarchical URL with a scheme and authority.

**Parameters**

  - `text` — an absolute URI or relative reference

**Returns**: the reference or a precise syntax error

**Examples**

_Resolving an image link found in a document_

```kex
let reference = URI.parse("../images/logo.svg").try
let absolute = base.resolve(reference).try
```

### `fromIRI`

```kex
fromIRI(text: String) -> Result<URI, URIError>
```

Converts a Unicode IRI to an ASCII URI using IDNA and UTF-8 percent encoding.

Use this for human-entered international addresses. `parse` is intentionally stricter and accepts only an already encoded ASCII URI.

**Parameters**

  - `text` — a Unicode internationalized resource identifier

**Returns**: the converted URI or a conversion error

**Examples**

_Turning a pasted international address into a request URI_

```kex
let target = URI.fromIRI("https://münich.example/straße").try
HTTP.get(target.string)
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

Returns the caller-supplied URI spelling unchanged.

**Returns**: the original URI text

#### `normalize`

```kex
normalize : URI
```

Returns an explicitly normalized RFC 3986 representation.

Parsing never normalizes implicitly: signatures, cache keys, and logs may depend on the exact text received. Ask for normalization where semantic comparison is what you mean.

**Returns**: the normalized URI

#### `equivalent?`

```kex
equivalent?(other: URI) -> Bool
```

Compares normalized representations rather than original spellings.

**Parameters**

  - `other` — the URI to compare

**Returns**: whether the URIs identify the same normalized reference

**Examples**

_Deduplicating differently spelled links_

```kex
URI.parse("HTTP://example.com/%7Eada").try
  .equivalent?(URI.parse("http://example.com/~ada").try)
```

#### `resolve`

```kex
resolve(reference: URI) -> Result<URI, URIError>
```

Resolves a URI reference against this absolute base.

**Parameters**

  - `reference` — the relative or absolute reference

**Returns**: the resolved URI, or `NotAbsolute` when

**Examples**

_Following a relative link_

```kex
let base = URI.parse("https://example.com/docs/start").try
base.resolve(URI.parse("../api").try).try.string
# => "https://example.com/api"
```

#### `scheme`

```kex
scheme : String?
```

Returns the normalized lowercase scheme, when one is present.

**Returns**: the scheme, or `None` for a relative reference

#### `host`

```kex
host : Host?
```

Returns the parsed authority host, when one is present.

**Returns**: the host, or `None` for references without an authority

#### `query`

```kex
query : Query?
```

Returns the parsed query when the reference contains `?`.

`Just(Query { entries: [] })` represents an explicitly empty query; `None` means no question mark was present at all.

**Returns**: the query, including an explicitly empty one

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

An absolute hierarchical URI with an authority component, such as an HTTP URL. Unlike a general `URI`, a `URL` always has a scheme and host, which makes accessors such as `scheme` and `host` total.

**Fields**

  - `source` : [String](string.md#make-string)

Implements [`Showable`](kex.md#trait-showable), [`Inspectable`](kex.md#trait-inspectable).

### Methods

#### `string`

```kex
string : String
```

Returns the caller-supplied URL spelling unchanged.

**Returns**: the original URL text

#### `normalize`

```kex
normalize : URL
```

Returns an explicitly normalized URL without changing this value.

**Returns**: the normalized URL

#### `equivalent?`

```kex
equivalent?(other: URL) -> Bool
```

Compares normalized representations rather than original spellings.

**Parameters**

  - `other` — the URL to compare

**Returns**: whether the URLs normalize to the same value

#### `resolve`

```kex
resolve(reference: URI) -> Result<URL, URIError>
```

Resolves a URI reference while preserving the URL invariant.

**Parameters**

  - `reference` — the relative or absolute reference

**Returns**: the resolved absolute URL

**Examples**

_Resolving an API pagination link_

```kex
let next = URL.parse("https://api.example.com/v1/items").try
  .resolve(URI.parse("?page=2").try)
  .try
```

#### `scheme`

```kex
scheme : String
```

Returns the normalized lowercase scheme.

**Returns**: the scheme

#### `host`

```kex
host : Host
```

Returns the authority host in display and normalized ASCII forms.

**Returns**: the host

#### `query`

```kex
query : Query?
```

Returns the parsed query when the URL contains `?`.

**Returns**: the query, or `None` when absent

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

Order and duplicates matter in real APIs: `tag=kex&tag=beam` must not become a map with one value silently discarded.

**Fields**

  - `entries` : [([String](string.md#make-string), [String](string.md#make-string)?)]

### Methods

#### `encode`

```kex
encode : String
```

Encodes according to generic RFC 3986 query rules.

**Returns**: encoded query text without a leading question mark

**Examples**

```kex
Query.from([("q", Just("a+b"))]).encode   # => "q=a%2Bb"
```

## record `Form`

Ordered `application/x-www-form-urlencoded` entries.

This is deliberately separate from `Query`: HTML forms encode spaces as plus signs, while a generic URI query treats a plus as an ordinary +++.

**Fields**

  - `entries` : [([String](string.md#make-string), [String](string.md#make-string)?)]

### Methods

#### `encode`

```kex
encode : String
```

Encodes according to HTML form rules, including space as ++.

**Returns**: the `application/x-www-form-urlencoded` body

**Examples**

```kex
Form.from([("query", "hello world")]).encode
# => "query=hello+world"
```

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

Rejects relative references, opaque URIs, and values without a host, so a caller can use `scheme` and `host` without handling absence.

**Parameters**

  - `text` — the complete URL

**Returns**: the URL or a precise syntax error

**Examples**

_Validating a webhook target at configuration time_

```kex
let webhook = URL.parse(ENV.get("WEBHOOK_URL").or("")).try
```

### `build`

```kex
build : String -> String -> [String] -> Query -> Result<URL, URIError>
```

Builds and validates a URL from decoded path segments and a query value.

Pass decoded values, not pre-escaped text. The builder escapes each path segment independently, so a slash inside one value cannot accidentally become another level of the path.

**Parameters**

  - `scheme` — the URL scheme, such as `https`
  - `host` — the Unicode or ASCII hostname
  - `path` — decoded path segments
  - `query` — ordered decoded query entries

**Returns**: the encoded, validated URL

**Examples**

_Building an API URL from an identifier supplied by a user_

```kex
URL.build(
  "https",
  "api.example.com",
  ["users", userName],
  Query.from([("include", Just("profile"))])
).try
```

## module `URI.Query`

### `from`

```kex
from(entries: [(String, String?)]) -> Query
from(entries: Map<String, String?>) -> Query
```

Builds a query while preserving order, duplicates, and bare keys.

A `None` value encodes as a bare key; `Just("")` encodes with an equals sign. This preserves the difference between `?debug` and `?debug=`.

**Parameters**

  - `entries` — decoded key/value pairs

**Returns**: the ordered query

**Examples**

_Adding repeated filters and a bare feature flag_

```kex
Query.from([
  ("tag", Just("kex")),
  ("tag", Just("beam")),
  ("debug", None)
])
```

### `parse`

```kex
parse(text: String) -> Result<Query, URIError>
```

Parses generic URI query encoding; ++ remains a literal plus.

**Parameters**

  - `text` — encoded query text without the leading question mark

**Returns**: decoded entries or an invalid escape

**Examples**

_Reading repeated filters without losing their order_

```kex
let filters = Query.parse("tag=kex&tag=beam&debug").try.entries
```

## module `URI.Form`

### `from`

```kex
from(entries: [(String, String)]) -> Form
from(entries: Map<String, String>) -> Form
```

Builds a form value while preserving order and duplicates.

**Parameters**

  - `entries` — decoded form fields

**Returns**: the ordered form

**Examples**

_Preparing a login request body_

```kex
Form.from([("email", email), ("password", password)]).encode
```

### `parse`

```kex
parse(text: String) -> Result<Form, URIError>
```

Parses form encoding where ++ represents a space.

**Parameters**

  - `text` — an `application/x-www-form-urlencoded` body

**Returns**: decoded fields or an invalid escape

**Examples**

_Reading a search field submitted by a browser_

```kex
Form.parse("query=hello+world").try.entries
```
