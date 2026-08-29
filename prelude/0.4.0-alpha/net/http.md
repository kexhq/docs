---
package: prelude
version: "0.4.0-alpha"
source: net/http.kex
title: Net.HTTP
entities:
  - { kind: module, name: "Net.HTTP" }
---

# Net.HTTP

## module `Net.HTTP`

Buffered HTTP clients, responses, and a small declaration-ordered server router. Requests never follow redirects or perform generic retries implicitly.

```kex
using Net.HTTP

let response = HTTP.get("https://example.test/").try
response.status.success?   # => true
```

For connection reuse and statistics, own a client explicitly:

```kex
let client = Client.open.try
let response = client.get("https://example.test/").try
client.close.try
```

## record `Headers`

An insertion-ordered HTTP field collection. Names compare case-insensitively and duplicate fields are preserved.

**Fields**

  - `entries` : [(String, String)]

## record `Status`

A validated HTTP status code in `100..599`.

**Fields**

  - `code` : Integer

## record `Response<B>`

A typed HTTP response envelope whose body representation is explicit.

**Fields**

  - `status` : Status
  - `headers` : Headers
  - `body` : B

## record `Request<B>`

A typed HTTP request envelope whose body representation is explicit.

**Fields**

  - `method` : String
  - `target` : URI
  - `headers` : Headers
  - `body` : B

## record `RouteContext`

Route captures decoded after path segmentation.

**Fields**

  - `parameters` : Map<String, String> (optional)

## record `Context`

Per-request server context.

**Fields**

  - `route` : RouteContext

## type `Handler`

A buffered HTTP route handler.



**Variants**

  - _(abstract)_

## record `Route`

One declared route; routers preserve declaration order.

**Fields**

  - `method` : String
  - `path` : String
  - `handler` : [Handler](#type-handler)

## record `Router`

An immutable, declaration-ordered HTTP router.

**Fields**

  - `routes` : [[Route](#record-route)] (optional)

## record `ShutdownReport`

Counts and elapsed time from graceful server shutdown.

**Fields**

  - `completed` : Integer
  - `failed` : Integer
  - `forced` : Integer
  - `elapsedMilliseconds` : Integer

## record `ServerOptions`

Bounded HTTP server resources and default graceful-shutdown duration.

**Fields**

  - `maximumHandlers` : Integer (optional)
  - `backlog` : Integer (optional)
  - `gracefulShutdown` : Duration (optional)

## record `PoolOptions`

HTTP connection-pool bounds and idle lifetime.

**Fields**

  - `perOrigin` : Integer (optional)
  - `total` : Integer (optional)
  - `queuedRequests` : Integer (optional)
  - `idleExpiryMilliseconds` : Integer (optional)

## record `ClientOptions`

Options owned by an explicit HTTP client.

**Fields**

  - `pool` : [PoolOptions](#record-pooloptions) (optional)

## record `ClientStatistics`

Lifetime request/reuse counters plus current pooled connections.

**Fields**

  - `openConnections` : Integer
  - `requests` : Integer
  - `reusedConnections` : Integer

## record `ClientCloseReport`

Resources released by `Client.close`.

**Fields**

  - `closedConnections` : Integer

## type `Client`

The pooled HTTP client. An opaque handle over the connection pool that owns it; `Client.open` makes one and `client.close` releases it.



## module `Net.HTTP.Headers`

## constant `empty`



## function `from`

Validates header names and values without folding duplicates.


```kex
from(entries) : [(String, String)] -> Result<Headers, NetError>
```


## function `parse`

Parses CRLF- or LF-separated header fields.


```kex
parse(text) : String -> Result<Headers, NetError>
```


## module `Net.HTTP.Status`

## function `from`


```kex
from(code) : Integer -> Result<Status, NetError>
```


## module `Net.HTTP.Response`

## function `binary`

Builds a buffered binary response with validated headers.


```kex
binary(status, body, headers)
```


## function `text`

Builds a UTF-8 text response with an explicit text/plain content type.


```kex
text(status, body)
```


## function `empty`

Builds a response with an empty body.


```kex
empty(status)
```


## module `Net.HTTP.Router`

## constant `build`



## make `Router`


#### `route`

Appends a route; earlier matching declarations win.

```kex
route(method, path, handler)
```

#### `get`

Appends a GET route. GET also supplies automatic HEAD fallback.

```kex
get(path, handler)
```

#### `head`

Appends an explicit HEAD route, overriding automatic GET fallback.

```kex
head(path, handler)
```

#### `options`

Appends an explicit OPTIONS route, overriding generated OPTIONS.

```kex
options(path, handler)
```

#### `post`

Appends a POST route.

```kex
post(path, handler)
```

#### `put`

Appends a PUT route.

```kex
put(path, handler)
```

#### `patch`

Appends a PATCH route.

```kex
patch(path, handler)
```

#### `delete`

Appends a DELETE route.

```kex
delete(path, handler)
```

## module `Net.HTTP.Server`

## type `Running`

An opaque asynchronous HTTP server handle.



## function `start`

Starts a server with conservative defaults and returns immediately.


```kex
start(endpoint, router)
```


## function `serve`

Starts with defaults and blocks until the server stops.


```kex
serve(endpoint, router)
```


## function `stop`

Gracefully stops using the duration captured at start.


```kex
stop(server)
```


## function `join`

Waits until the server owner exits.


```kex
join(server)
```


## function `running?`


```kex
running?(server)
```


## function `localAddress`


```kex
localAddress(server)
```


## module `Net.HTTP.Client`

## function `open`

Opens an explicit pooled client with conservative defaults.


```kex
open() : Result<Client, NetError>
```


## make `Client`


#### `request`

Sends a buffered request. Redirects and generic retries are not implicit.

```kex
request(method, url, headers, body)
```

#### `get`

Sends a buffered GET request.

```kex
get(url)
```

#### `post`

Sends a buffered binary POST request.

```kex
post(url, body)
```

#### `put`

Sends a buffered binary PUT request.

```kex
put(url, body)
```

#### `patch`

Sends a buffered binary PATCH request.

```kex
patch(url, body)
```

#### `delete`

Sends a DELETE request with an empty body.

```kex
delete(url)
```

#### `head`

Sends a HEAD request; the returned body is empty.

```kex
head(url)
```

#### `options`

Sends an OPTIONS request.

```kex
options(url)
```

#### `statistics`

```kex
statistics()
```

**Returns**: `ClientStatistics` — current pool and lifetime request counters

#### `close`

Idempotently closes the client and every idle pooled connection.

```kex
close()
```

## make `Headers` implements Showable, Inspectable


#### `add`

Appends a field without replacing existing fields of the same name.

```kex
add(name, value)
```

**Examples**

_`Headers.empty.add("Accept", "text/plain")`_

```kex

```

#### `set`

Replaces all fields of `name` with one value.

```kex
set(name, value)
```

**Examples**

_`headers.set("Content-Type", "application/json")`_

```kex

```

#### `remove`

Removes every field matching `name` case-insensitively.

```kex
remove(name)
```

#### `get`

Returns the first matching field value.

```kex
get(name)
```

#### `getAll`

Returns every matching value in insertion order.

```kex
getAll(name)
```

#### `inspectValue`

Structural inspection uses the same credential-safe rendering.

```kex
inspectValue(colors)
```

## make `Status`



## make `RouteContext`


#### `parameter`

Returns one decoded named or wildcard route capture.

```kex
parameter(name)
```

**Returns**: `Result<String, NetError>` — the capture, or `Parse` when absent

## module `Net.HTTP.HTTP`

## function `request`

Sends one stateless buffered request with no redirect or hidden retry.


```kex
request : String -> String -> Headers -> Binary -> Result<Response<Binary>, NetError>
```


## function `get`

Sends one stateless buffered GET.


```kex
get(url) : String -> Result<Response<Binary>, NetError>
```


## function `delete`

Sends one stateless DELETE with an empty body.


```kex
delete(url) : String -> Result<Response<Binary>, NetError>
```


## function `head`

Sends one stateless HEAD and returns an empty response body.


```kex
head(url) : String -> Result<Response<Binary>, NetError>
```


## function `options`

Sends one stateless OPTIONS request.


```kex
options(url) : String -> Result<Response<Binary>, NetError>
```


## function `post`

Sends one stateless buffered binary POST.


```kex
post(url, body) : String -> Binary -> Result<Response<Binary>, NetError>
```


## function `put`

Sends one stateless buffered binary PUT.


```kex
put(url, body) : String -> Binary -> Result<Response<Binary>, NetError>
```


## function `patch`

Sends one stateless buffered binary PATCH.


```kex
patch(url, body) : String -> Binary -> Result<Response<Binary>, NetError>
```

