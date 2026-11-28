---
package: prelude
version: "0.4.0-alpha"
source: webserver.kex
title: Web
entities:
  - { kind: module, name: "Web" }
---

# Web

A small, WEBrick-style web server API. Configuration is immutable: mounting a route returns an updated server, and `start` hands that configuration to the BEAM runtime.

## module `Web`



## record `Request`

**Fields**

  - `method` : [String](string.md#make-string)
  - `path` : [String](string.md#make-string)
  - `queryString` : [String](string.md#make-string)
  - `query` : [Map](map.md#type-map)<[String](string.md#make-string), [String](string.md#make-string)>
  - `headers` : [Map](map.md#type-map)<[String](string.md#make-string), [String](string.md#make-string)>
  - `body` : [String](string.md#make-string)



## record `Response`

**Fields**

  - `status` : [Integer](number.md#make-integer) (optional)
  - `headers` : [Map](map.md#type-map)<[String](string.md#make-string), [String](string.md#make-string)> (optional)
  - `body` : [String](string.md#make-string) (optional)

Implements `Http`.

### Defined in other modules

  - [Mock](mock.md#make-response): [`canned`](mock.md#response-canned), [`get`](mock.md#response-get), [`post`](mock.md#response-post), [`put`](mock.md#response-put), [`patch`](mock.md#response-patch), [`delete`](mock.md#response-delete), [`head`](mock.md#response-head), [`options`](mock.md#response-options)

## module `Web.Response`

### `text`

```kex
text(body: String) -> Response
```

### `textWithStatus`

```kex
textWithStatus(body: String, status: Integer) -> Response
```

### `html`

```kex
html(body: String) -> Response
```

### `json`

```kex
json(body: String) -> Response
```

### `redirect`

```kex
redirect(location: String) -> Response
```

### `notFound` (constant)

```kex
notFound : Response
```



## type `Handler`



## record `Route`

**Fields**

  - `method` : [String](string.md#make-string)
  - `path` : [String](string.md#make-string)
  - `handler` : [Handler](#type-web-handler)



## record `Server`

**Fields**

  - `port` : [Integer](number.md#make-integer)
  - `routes` : [[Route](#record-web-route)] (optional)

### Defined in other modules

  - [Process](process.md#make-server): [`within`](process.md#server-within), [`link`](process.md#server-link), [`unlink`](process.md#server-unlink), [`monitor`](process.md#server-monitor), [`alive?`](process.md#server-alive?)

## type `Web.Server`

### `mount`

```kex
mount(path: String, handler: Handler) -> Server
```

### `get`

```kex
get(path: String, handler: Handler) -> Server
```

### `post`

```kex
post(path: String, handler: Handler) -> Server
```

### `put`

```kex
put(path: String, handler: Handler) -> Server
```

### `patch`

```kex
patch(path: String, handler: Handler) -> Server
```

### `delete`

```kex
delete(path: String, handler: Handler) -> Server
```

### `start`

```kex
start : Result<Void, String>
```



## module `Web.Server`

### `build`

```kex
build(port: Integer) -> Server
```
