---
package: prelude
version: "0.4.0-rc.4-dev"
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

Parses an RFC 3986 URI reference, which may be relative.

The text must be ASCII, with anything else already percent-encoded; use `URI.fromIRI` for text a person typed. Use `URL.parse` when the input must be a complete URL with a scheme and host.

**Parameters**

  - `text` — an absolute URI or a relative reference

**Returns**: the reference, or what is wrong with it

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

Converts an internationalized address (an IRI) to an ASCII URI.

The host is converted with IDNA, and the rest of the non-ASCII text is percent-encoded as UTF-8. Use it for addresses people type or paste; `parse` rejects non-ASCII text.

**Parameters**

  - `text` — the internationalized address

**Returns**: the converted URI, or why it cannot be converted

**Examples**

```kex
URI.fromIRI("https://münich.example/straße").try.string
# => "https://xn--mnich-kva.example/stra%C3%9Fe"
```

## record `URI`

Parses, builds and resolves URIs and URLs, and encodes query strings and HTML forms.

Parsing follows RFC 3986 strictly and keeps the text as it was written: `string` gives back the exact input. Normalizing is a separate step, done by `normalize` and `equivalent?`.

```kex
using URI

let base = URL.parse("https://example.test/a/").try
let reference = URI.parse("../items?limit=10").try
base.resolve(reference).try.string   # => "https://example.test/items?limit=10"
```

A parsed RFC 3986 URI reference: an absolute URI or a relative one.

Make one with `URI.parse` or `URI.fromIRI`, which check the syntax.

**Fields**

  - `source` : [String](string.md#make-string)

Implements [`Showable`](kex.md#trait-showable), [`Inspectable`](kex.md#trait-inspectable).

### Functions

#### `string`

```kex
string -> String
```

Returns the URI exactly as it was parsed.

**Returns**: the URI text

#### `normalize`

```kex
normalize -> URI
```

Returns the URI in RFC 3986 normal form.

The scheme and host are lowercased, needless percent escapes are decoded, and `.` and `..` path segments are resolved. Parsing never does this by itself, because signatures, cache keys and logs may depend on the exact text.

**Returns**: the normalized URI

**Examples**

```kex
URI.parse("HTTP://example.com/%7Eada").try.normalize.string
# => "http://example.com/~ada"
```

#### `equivalent?`

```kex
equivalent?(other: URI) -> Bool
```

Returns `true` when the two URIs are the same after normalizing.

`==` compares the text as written.

**Parameters**

  - `other` — the URI to compare

**Returns**: `true` when both normalize to the same URI

**Examples**

_Spotting the same link spelled two ways_

```kex
URI.parse("HTTP://example.com/%7Eada").try
  .equivalent?(URI.parse("http://example.com/~ada").try)
# => true
```

#### `resolve`

```kex
resolve(reference: URI) -> Result<URI, URIError>
```

Resolves `reference` against this URI, as a browser resolves a link against the page it is on.

**Parameters**

  - `reference` — the relative or absolute reference

**Returns**: the resolved URI, or a `NotAbsolute` error when this URI is relative and cannot serve as a base

**Examples**

_Following a relative link_

```kex
let base = URI.parse("https://example.com/docs/start").try
base.resolve(URI.parse("../api").try).try.string
# => "https://example.com/api"
```

#### `scheme`

```kex
scheme -> String?
```

Returns the scheme in lowercase, or `None` for a relative reference.

**Returns**: the scheme, or `None`

#### `host`

```kex
host -> Host?
```

Returns the host, or `None` when the URI has none.

**Returns**: the host, or `None`

#### `query`

```kex
query -> Query?
```

Returns the query, or `None` when the URI has no `?`.

A URI ending in a bare `?` has a query with no entries, which is not the same as `None`.

**Returns**: the query, or `None`

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the URI with any password in it replaced by `***`.

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Renders the URI with any password in it replaced by `***`, as `showValue` does.

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `URL`

An absolute URI with a host, such as an HTTP URL.

Every `URL` has a scheme and a host, so `scheme` and `host` return them directly, where the `URI` versions return optionals. Make one with `URL.parse` or `URL.build`.

**Fields**

  - `source` : [String](string.md#make-string)

Implements [`Showable`](kex.md#trait-showable), [`Inspectable`](kex.md#trait-inspectable).

### Functions

#### `string`

```kex
string -> String
```

Returns the URL exactly as it was parsed.

**Returns**: the URL text

#### `normalize`

```kex
normalize -> URL
```

Returns the URL in RFC 3986 normal form.

**Returns**: the normalized URL

**Examples**

```kex
URL.parse("HTTPS://Example.COM/a/../b").try.normalize.string
# => "https://example.com/b"
```

#### `equivalent?`

```kex
equivalent?(other: URL) -> Bool
```

Returns `true` when the two URLs are the same after normalizing.

**Parameters**

  - `other` — the URL to compare

**Returns**: `true` when both normalize to the same URL

#### `resolve`

```kex
resolve(reference: URI) -> Result<URL, URIError>
```

Resolves `reference` against this URL.

The result must still be a URL, so a reference without a host, such as `mailto:ada@example.com`, is a `MissingAuthority` error.

**Parameters**

  - `reference` — the relative or absolute reference

**Returns**: the resolved URL

**Examples**

_Following an API's pagination link_

```kex
URL.parse("https://api.example.com/v1/items").try
  .resolve(URI.parse("?page=2").try)
  .try.string
# => "https://api.example.com/v1/items?page=2"
```

#### `scheme`

```kex
scheme -> String
```

Returns the scheme in lowercase.

**Returns**: the scheme

#### `host`

```kex
host -> Host
```

Returns the host.

**Returns**: the host

#### `query`

```kex
query -> Query?
```

Returns the query, or `None` when the URL has no `?`.

**Returns**: the query, or `None`

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the URL with any password in it replaced by `***`.

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Renders the URL with any password in it replaced by `***`, as `showValue` does.

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `Host`

A URI's host as written, in `display`, and in lowercase ASCII (IDNA) form, in `ascii`.

**Fields**

  - `display` : [String](string.md#make-string)
  - `ascii` : [String](string.md#make-string)



## record `Query`

The entries of a URI query string, in order.

Order and repeated keys are kept, since APIs rely on them: `tag=kex&tag=beam` has two entries. A value of `None` is a bare key, as in `?debug`; `Just("")` is a key with an empty value, as in `?debug=`.

**Fields**

  - `entries` : [([String](string.md#make-string), [String](string.md#make-string)?)]

### Functions

#### `encode`

```kex
encode -> String
```

Encodes the query by RFC 3986 rules, percent-encoding a +++ in a value.

**Returns**: the encoded query, without a leading `?`

**Examples**

```kex
Query.from([("q", Just("a+b"))]).encode   # => "q=a%2Bb"
```

## record `Form`

The fields of an `application/x-www-form-urlencoded` body, in order.

Forms encode a space as +++. In a `Query`, +++ is a literal plus sign.

**Fields**

  - `entries` : [([String](string.md#make-string), [String](string.md#make-string)?)]

### Functions

#### `encode`

```kex
encode -> String
```

Encodes the form by HTML form rules, which write a space as +++.

**Returns**: the `application/x-www-form-urlencoded` body

**Examples**

```kex
Form.from([("query", "hello world")]).encode
# => "query=hello+world"
```

## record `URIError`

The error returned when a URI cannot be parsed, converted or resolved: its `kind`, and a message for a person to read.

**Fields**

  - `kind` : [URIErrorKind](#type-uri-urierrorkind)
  - `message` : [String](string.md#make-string)
  - `position` : [Integer](number.md#make-integer)?



## type `URIErrorKind`

What kind of problem a `URIError` reports.

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

Parses an absolute URL with a scheme and host.

A relative reference is a `NotAbsolute` error, and a URI without a host, such as `mailto:ada@example.com`, is `MissingAuthority`.

**Parameters**

  - `text` — the complete URL

**Returns**: the URL, or what is wrong with it

**Examples**

_Checking a webhook URL from the configuration_

```kex
let webhook = URL.parse(ENV.get("WEBHOOK_URL").or("")).try
```

### `build`

```kex
build(scheme: String, host: String, path: [String], query: Query) -> Result<URL, URIError>
```

Builds a URL from a scheme, a host, path segments and a query.

Pass the path segments and query values unencoded. Each segment is encoded on its own, so a `/` inside a value stays part of that segment. The scheme and host are lowercased. The host must be ASCII: an international name has to be given in its `xn--` form.

**Parameters**

  - `scheme` — the URL scheme, such as `https`
  - `host` — the host name, in ASCII
  - `path` — the path segments, unencoded
  - `query` — the query entries, unencoded

**Returns**: the URL, or why it is invalid

**Examples**

_Building an API URL from a name a user supplied_

```kex
URL.build("https", "api.example.com", ["users", "a/b c"],
  Query.from([("include", Just("profile"))])).try.string
# => "https://api.example.com/users/a%2Fb%20c?include=profile"
```

## module `URI.Query`

### `from`

```kex
from(entries: [(String, String?)]) -> Query
from(entries: Map<String, String?>) -> Query
```

Builds a query from a list of entries, keeping their order, repeated keys and bare keys.

A `None` value is encoded as a bare key, and `Just("")` as a key with an equals sign, so `?debug` and `?debug=` stay different.

**Parameters**

  - `entries` — the keys and values, unencoded

**Returns**: the query

**Examples**

_Repeated filters and a bare flag_

```kex
Query.from([
  ("tag", Just("kex")),
  ("tag", Just("beam")),
  ("debug", None)
]).encode
# => "tag=kex&tag=beam&debug"
```

### `parse`

```kex
parse(text: String) -> Result<Query, URIError>
```

Parses a query string, decoding percent escapes.

A +++ stays a plus sign; use `Form.parse` for form bodies, where it means a space.

**Parameters**

  - `text` — the query, without the leading `?`

**Returns**: the entries, or an `InvalidEscape` error

**Examples**

```kex
Query.parse("tag=kex&tag=beam&debug").try.entries
# => [("tag", Just("kex")), ("tag", Just("beam")), ("debug", None)]
```

## module `URI.Form`

### `from`

```kex
from(entries: [(String, String)]) -> Form
from(entries: Map<String, String>) -> Form
```

Builds a form from a list of fields, keeping their order and repeated names.

**Parameters**

  - `entries` — the field names and values, unencoded

**Returns**: the form

**Examples**

_Preparing a login request body_

```kex
Form.from([("email", email), ("password", password)]).encode
```

### `parse`

```kex
parse(text: String) -> Result<Form, URIError>
```

Parses an `application/x-www-form-urlencoded` body, where +++ means a space.

**Parameters**

  - `text` — the encoded body

**Returns**: the fields, or an `InvalidEscape` error

**Examples**

_Reading a search field a browser submitted_

```kex
Form.parse("query=hello+world").try.entries
# => [("query", Just("hello world"))]
```
