---
package: prelude
version: "0.3.4"
source: webserver.kex
title: Web
entities:
  - { kind: module, name: "Web" }
---

# Web

## module `Web`

A small, WEBrick-style web server API. Configuration is immutable: mounting a route returns an updated server, and `start` hands that configuration to the BEAM runtime.

## record `Request`

**Fields**

  - `method` : String
  - `path` : String
  - `queryString` : String
  - `query` : Map<String, String>
  - `headers` : Map<String, String>
  - `body` : String

## record `Response`

**Fields**

  - `status` : Integer (optional)
  - `headers` : Map<String, String> (optional)
  - `body` : String (optional)

## module `Web.Response`

## function `text`


```kex
text(body)
```


## function `textWithStatus`


```kex
textWithStatus(body, status)
```


## function `html`


```kex
html(body)
```


## function `json`


```kex
json(body)
```


## function `redirect`


```kex
redirect(location)
```


## constant `notFound`



## type `Handler`



**Variants**

  - _(abstract)_

## record `Route`

**Fields**

  - `method` : String
  - `path` : String
  - `handler` : [Handler](#type-handler)

## record `Server`

**Fields**

  - `port` : Integer
  - `routes` : [[Route](#record-route)] (optional)

## module `Web.Server`

## function `new`


```kex
new(port)
```


## make `Server`


#### `mount`

```kex
mount(path, handler)
```

#### `get`

```kex
get(path, handler)
```

#### `post`

```kex
post(path, handler)
```

#### `put`

```kex
put(path, handler)
```

#### `patch`

```kex
patch(path, handler)
```

#### `delete`

```kex
delete(path, handler)
```

#### `start`

```kex
start()
```
