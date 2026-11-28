---
package: prelude
version: "0.4.0-alpha"
source: http.kex
title: Http
entities:
  - { kind: type, name: "NetworkError" }
  - { kind: record, name: "HttpResponse" }
  - { kind: record, name: "HttpError" }
  - { kind: record, name: "HttpOptions" }
  - { kind: module, name: "Http" }
---

# Http

## type `NetworkError`

**Variants**

  - `ConnectionRefused`
  - `Timeout`
  - `DnsError`
  - `SslError`
  - `NotImplemented`
  - `MockEmpty`
  - `Unknown`



## record `HttpResponse`

**Fields**

  - `status` : [Integer](number.md#make-integer)
  - `body` : [String](string.md#make-string)
  - `headers` : [Map](map.md#type-map)<[String](string.md#make-string), [String](string.md#make-string)>



## record `HttpError`

**Fields**

  - `kind` : [NetworkError](#type-networkerror)
  - `message` : [String](string.md#make-string)



## record `HttpOptions`

**Fields**

  - `headers` : [Map](map.md#type-map)<[String](string.md#make-string), [String](string.md#make-string)> (optional)
  - `timeout` : [Integer](number.md#make-integer) (optional)



## module `Http`

A capability: every member performs a real network request, so a test can replace it for a lexical region with `with Http = ...` rather than mutating global mock state (kexhq/kex#143).

### `get`

```kex
get(url: String) -> Result<HttpResponse, HttpError>
get(url: String, opts: HttpOptions) -> Result<HttpResponse, HttpError>
```

### `post`

```kex
post(url: String, body: String) -> Result<HttpResponse, HttpError>
post(url: String, body: String) -> HttpOptions -> Result<HttpResponse, HttpError>
```

### `put`

```kex
put(url: String, body: String) -> Result<HttpResponse, HttpError>
put(url: String, body: String) -> HttpOptions -> Result<HttpResponse, HttpError>
```

### `patch`

```kex
patch(url: String, body: String) -> Result<HttpResponse, HttpError>
patch(url: String, body: String) -> HttpOptions -> Result<HttpResponse, HttpError>
```

### `delete`

```kex
delete(url: String) -> Result<HttpResponse, HttpError>
delete(url: String, opts: HttpOptions) -> Result<HttpResponse, HttpError>
```

### `head`

```kex
head(url: String) -> Result<HttpResponse, HttpError>
head(url: String, opts: HttpOptions) -> Result<HttpResponse, HttpError>
```

### `options`

```kex
options(url: String) -> Result<HttpResponse, HttpError>
options(url: String, opts: HttpOptions) -> Result<HttpResponse, HttpError>
```
