---
package: prelude
version: "0.3.1"
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

  - `method` : [String](algebra.md#make-string)
  - `path` : [String](algebra.md#make-string)
  - `queryString` : [String](algebra.md#make-string)
  - `query` : [Map](map.md#type-map)<[String](algebra.md#make-string), [String](algebra.md#make-string)>
  - `headers` : [Map](map.md#type-map)<[String](algebra.md#make-string), [String](algebra.md#make-string)>
  - `body` : [String](algebra.md#make-string)



## record `Response`

**Fields**

  - `status` : [Integer](number.md#make-integer) (optional)
  - `headers` : [Map](map.md#type-map)<[String](algebra.md#make-string), [String](algebra.md#make-string)> (optional)
  - `body` : [String](algebra.md#make-string) (optional)



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

  - `method` : [String](algebra.md#make-string)
  - `path` : [String](algebra.md#make-string)
  - `handler` : [Handler](#type-web-handler)



## record `Server`

**Fields**

  - `port` : [Integer](number.md#make-integer)
  - `routes` : [[Route](#record-web-route)] (optional)

### Methods

#### `mount`

```kex
mount(path: String, handler: Handler) -> Server
```

#### `get`

```kex
get(path: String, handler: Handler) -> Server
```

#### `post`

```kex
post(path: String, handler: Handler) -> Server
```

#### `put`

```kex
put(path: String, handler: Handler) -> Server
```

#### `patch`

```kex
patch(path: String, handler: Handler) -> Server
```

#### `delete`

```kex
delete(path: String, handler: Handler) -> Server
```

#### `start`

```kex
start : Result<Void, String>
```

## module `Web.Server`

### `new`

```kex
new(port: Integer) -> Server
```
