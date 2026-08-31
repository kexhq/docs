---
package: prelude
version: "0.4.0-alpha"
source: uri.kex
title: URI
entities:
  - { kind: module, name: "URI" }
---

# URI

## module `URI`

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

  - `source` : String

## record `URL`

An absolute hierarchical URI with an authority component, such as an HTTP URL. Unlike a general `URI`, a `URL` always has a scheme and host, which makes accessors such as `scheme` and `host` total.

**Fields**

  - `source` : String

## record `Host`

A host's display spelling and normalized ASCII/IDNA spelling.

**Fields**

  - `display` : String
  - `ascii` : String

## record `Query`

Ordered URI query entries. `None` distinguishes a bare key from `key=`.

Order and duplicates matter in real APIs: `tag=kex&tag=beam` must not become a map with one value silently discarded.

**Fields**

  - `entries` : [(String, String?)]

## record `Form`

Ordered `application/x-www-form-urlencoded` entries.

This is deliberately separate from `Query`: HTML forms encode spaces as plus signs, while a generic URI query treats a plus as an ordinary ``+.

**Fields**

  - `entries` : [(String, String?)]

## record `URIError`

A typed URI parsing, conversion, or resolution failure.

**Fields**

  - `kind` : [URIErrorKind](#type-urierrorkind)
  - `message` : String
  - `position` : Integer?

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

## function `parse`

Strictly parses an ASCII RFC 3986 URI reference.

Relative references are valid here. Use `URL.parse` when the input must be a complete hierarchical URL with a scheme and authority.


```kex
parse(text) : String -> Result<URI, URIError>
```


## function `fromIRI`

Converts a Unicode IRI to an ASCII URI using IDNA and UTF-8 percent encoding.

Use this for human-entered international addresses. `parse` is intentionally stricter and accepts only an already encoded ASCII URI.


```kex
fromIRI(text) : String -> Result<URI, URIError>
```


## module `URI.URL`

## function `parse`

Parses an absolute hierarchical URL with an authority.

Rejects relative references, opaque URIs, and values without a host, so a caller can use `scheme` and `host` without handling absence.


```kex
parse(text) : String -> Result<URL, URIError>
```


## function `build`

Builds and validates a URL from decoded path segments and a query value.

Pass decoded values, not pre-escaped text. The builder escapes each path segment independently, so a slash inside one value cannot accidentally become another level of the path.


```kex
build : String -> String -> [String] -> Query -> Result<URL, URIError>
```


## module `URI.Query`

## function `from`

Builds a query while preserving order, duplicates, and bare keys.

A `None` value encodes as a bare key; `Just("")` encodes with an equals sign. This preserves the difference between `?debug` and `?debug=`.


```kex
from(entries) : [(String, String?)] -> Query
```


## function `parse`

Parses generic URI query encoding; `` remains a literal plus.


```kex
parse(text) : String -> Result<Query, URIError>
```


## module `URI.Form`

## function `from`

Builds a form value while preserving order and duplicates.


```kex
from(entries) : [(String, String)] -> Form
```


## function `parse`

Parses form encoding where `` represents a space.


```kex
parse(text) : String -> Result<Form, URIError>
```


## make `URI` implements Showable, Inspectable


#### `equivalent?`

Compares normalized representations rather than original spellings.

```kex
equivalent?(other)
```

**Returns**: `Bool` — whether the URIs identify the same normalized reference

**Examples**

_Deduplicating differently spelled links_

```kex
URI.parse("HTTP://example.com/%7Eada").try
  .equivalent?(URI.parse("http://example.com/~ada").try)
```

#### `resolve`

Resolves a URI reference against this absolute base.

```kex
resolve(reference)
```

**Returns**: `Result<URI, URIError>` — the resolved URI, or `NotAbsolute` when

**Examples**

_Following a relative link_

```kex
let base = URI.parse("https://example.com/docs/start").try
base.resolve(URI.parse("../api").try).try.string
# => "https://example.com/api"
```

#### `inspectValue`

Structural inspection is also credential-safe.

```kex
inspectValue(colors)
```

## make `URL` implements Showable, Inspectable


#### `equivalent?`

Compares normalized representations rather than original spellings.

```kex
equivalent?(other)
```

**Returns**: `Bool` — whether the URLs normalize to the same value

#### `resolve`

Resolves a URI reference while preserving the URL invariant.

```kex
resolve(reference)
```

**Returns**: `Result<URL, URIError>` — the resolved absolute URL

**Examples**

_Resolving an API pagination link_

```kex
let next = URL.parse("https://api.example.com/v1/items").try
  .resolve(URI.parse("?page=2").try)
  .try
```

#### `inspectValue`

Structural inspection is also credential-safe.

```kex
inspectValue(colors)
```

## make `Query`



## make `Form`


