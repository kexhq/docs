---
package: prelude
version: "0.4.0-alpha"
source: webserver.kex
title: Web
entities:
  - { kind: module, name: "Web" }
---

# Web

## module `Web`

A small, WEBrick-style web server.

You build a server by naming a port and mounting routes on it, then start it. Configuration is immutable: mounting a route returns an updated server, and `start` hands that configuration to the BEAM runtime.

  let hello(request: Web.Request) -> Web.Response do     let name = request.query.get("name", "world")     return Web.Response.text("Hello, ${name}!\n")   end

  main do     let server = Web.Server.build(8080)       .get("/", ~home)       .get("/hello", ~hello)       .post("/echo", ~echo)

    IO.printLine("listening on http://localhost:8080")     if let Error(reason) = server.start()       IO.printLine("server stopped: ${reason}")     end   end

A handler is any function from a `Web.Request` to a `Web.Response`, and the `Web.Response` constructors cover the usual replies — text, HTML, JSON, a redirect, a 404.

The server runs on the BEAM backend: `kex -R yourfile.kex`.

## record `Request`

One incoming HTTP request.

**Fields**

  - `method` : String
  - `path` : String
  - `queryString` : String
  - `query` : Map<String, String>
  - `headers` : Map<String, String>
  - `body` : String

## record `Response`

One outgoing HTTP response.

Build one with the `Web.Response` constructors rather than by hand — they set the status and content type for you.

**Fields**

  - `status` : Integer (optional)
  - `headers` : Map<String, String> (optional)
  - `body` : String (optional)

## module `Web.Response`

Constructors for the usual kinds of reply.

## function `text`

A 200 response carrying plain text.


```kex
text(body)
```


## function `textWithStatus`

A plain-text response with a status you choose.


```kex
textWithStatus(body, status)
```


## function `html`

A 200 response carrying HTML.


```kex
html(body)
```


## function `json`

A 200 response carrying JSON.

Takes the JSON as text, so pair it with `JSON.stringify`.


```kex
json(body)
```


## function `redirect`

A 302 response sending the client to `location`.


```kex
redirect(location)
```


## constant `notFound`

A 404 response with a plain-text body.



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

## make `Web.Server`


#### `mount`

Mounts `handler` at `path` for ANY HTTP method.

Use the method-specific forms below when only one method should be answered.

```kex
mount(path, handler)
```

**Returns**: `Server` — the server, with the route added

**Examples**

```kex
  Web.Server.build(8080).mount("/health", ~health)
```

#### `get`

Mounts `handler` at `path` for GET requests.

```kex
get(path, handler)
```

**Returns**: `Server` — the server, with the route added

**Examples**

```kex
  Web.Server.build(8080)
    .get("/", ~home)
    .get("/hello", ~hello)
```

#### `post`

Mounts `handler` at `path` for POST requests.

```kex
post(path, handler)
```

**Returns**: `Server` — the server, with the route added

**Examples**

```kex
  server.post("/echo", ~echo)
```

#### `put`

Mounts `handler` at `path` for PUT requests.

```kex
put(path, handler)
```

**Returns**: `Server` — the server, with the route added

**Examples**

```kex
  server.put("/items", ~replaceItem)
```

#### `patch`

Mounts `handler` at `path` for PATCH requests.

```kex
patch(path, handler)
```

**Returns**: `Server` — the server, with the route added

**Examples**

```kex
  server.patch("/items", ~updateItem)
```

#### `delete`

Mounts `handler` at `path` for DELETE requests.

```kex
delete(path, handler)
```

**Returns**: `Server` — the server, with the route added

**Examples**

```kex
  server.delete("/items", ~removeItem)
```

#### `start`

Starts listening, and blocks until the server stops.

Answers `Error` with a reason when the server could not start — a port already in use, for instance — or when it stops unexpectedly.

Runs on the BEAM backend: `kex -R yourfile.kex`.

```kex
start()
```

**Returns**: `Result<Void, String>` — why the server stopped

**Examples**

```kex
  IO.printLine("listening on http://localhost:8080")
  if let Error(reason) = server.start()
    IO.printLine("server stopped: ${reason}")
  end
```

## module `Web.Server`

## function `build`


```kex
build(port)
```

