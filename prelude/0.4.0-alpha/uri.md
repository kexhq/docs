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

An absolute hierarchical URI with an authority component.

**Fields**

  - `source` : String

## record `Host`

A host's display spelling and normalized ASCII/IDNA spelling.

**Fields**

  - `display` : String
  - `ascii` : String

## record `Query`

Ordered URI query entries. `None` distinguishes a bare key from `key=`.

**Fields**

  - `entries` : [(String, String?)]

## record `Form`

Ordered `application/x-www-form-urlencoded` entries.

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


```kex
parse(text) : String -> Result<URI, URIError>
```


## function `fromIRI`

Converts a Unicode IRI to an ASCII URI using IDNA and UTF-8 percent encoding.


```kex
fromIRI(text) : String -> Result<URI, URIError>
```


## module `URI.URL`

## function `parse`

Parses an absolute hierarchical URL with an authority.


```kex
parse(text) : String -> Result<URL, URIError>
```


## function `build`

Builds and validates a URL from decoded path segments and a query value.


```kex
build : String -> String -> [String] -> Query -> Result<URL, URIError>
```


## module `URI.Query`

## function `from`

Builds a query while preserving order, duplicates, and bare keys.


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

```kex
equivalent?(other)
```

**Returns**: `Bool` — whether normalized representations are equal

#### `resolve`

Resolves a URI reference against this absolute base.

```kex
resolve(reference)
```

#### `inspectValue`

Structural inspection is also credential-safe.

```kex
inspectValue(colors)
```

## make `URL` implements Showable, Inspectable


#### `equivalent?`

```kex
equivalent?(other)
```

**Returns**: `Bool` — whether normalized representations are equal

#### `resolve`

Resolves a URI reference while preserving the URL invariant.

```kex
resolve(reference)
```

#### `inspectValue`

Structural inspection is also credential-safe.

```kex
inspectValue(colors)
```

## make `Query`



## make `Form`


