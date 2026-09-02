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

A list of pairs rather than a `{String: String}` map, and deliberately so. A map cannot hold the same name twice, and `Set-Cookie` needs exactly that: RFC 6265 does not define it as a comma-separated list, so two cookies must travel as two fields and cannot be joined into one. A map interface would read as the obvious one right up to the first response that sets two cookies, then silently keep one — the same class of quiet data loss this module's `Result`-returning builders exist to avoid.

Order is kept for the same reason. RFC 9110 makes order insignificant BETWEEN different names but significant between fields sharing a name, and a map has no order to keep.

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

A buffered HTTP route handler. Handling a request is effectful: routes may read files, query a database, send messages, or perform other application IO.



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

Construction and parsing of validated HTTP header collections.

## constant `empty`

Returns a field collection with no entries.



## function `from`

Validates header names and values without folding duplicates.

Duplicate fields stay in their original order. Invalid names and values containing line breaks are rejected instead of creating a malformed or injectable HTTP message.


```kex
from(entries) : [(String, String)] -> Result<Headers, NetError>
```


## function `parse`

Parses CRLF- or LF-separated header fields.

Use this at a protocol boundary when headers arrive as text. Application code normally builds them with `from`, `add`, and `set`.


```kex
parse(text) : String -> Result<Headers, NetError>
```


## module `Net.HTTP.Status`

Validation for numeric HTTP status codes.

## function `from`

Validates an HTTP status code.


```kex
from(code) : Integer -> Result<Status, NetError>
```


## module `Net.HTTP.Response`

Buffered response constructors for route handlers.

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

The empty starting point for an immutable route declaration chain.

## constant `build`



## make `Router`


#### `route`

Appends a route; earlier matching declarations win.

Use this for a method without a convenience function. Paths may include named or wildcard captures, which the handler reads from `RouteContext`.

```kex
route(method, path, handler)
```

**Examples**

_Adding a custom method_

```kex
router.route("PURGE", "/cache/:key", ~purge)
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

Starting, observing, and gracefully stopping HTTP servers.

## type `Running`

An opaque asynchronous HTTP server handle.



## function `start`

Starts a server with conservative defaults and returns immediately.

The returned handle owns the listener and active handlers. Use `start` when the process has other work to do; use `serve` for a foreground server whose main job is handling HTTP.


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

New requests stop being accepted while in-flight handlers get their grace period to finish. The report says how much work completed or was forced down during shutdown.


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

Returns the bound address, including an operating-system-assigned port.


```kex
localAddress(server)
```


## module `Net.HTTP.Client`

Constructors for explicitly owned, connection-pooling HTTP clients.

## function `open`

Opens an explicit pooled client with conservative defaults.

Reuse one client for related requests so keep-alive connections and DNS work can be reused. Close it when the owning service shuts down.


```kex
open() : Result<Client, NetError>
open(options) : ClientOptions -> Result<Client, NetError>
```


## make `Client`


#### `request`

Sends a buffered request. Redirects and generic retries are not implicit.

This keeps policy with the caller: inspect a redirect before following it, and retry only methods and failures your application knows are safe.

```kex
request(method, url, headers, body)
```

**Examples**

_Sending JSON with an idempotency key_

```kex
let headers = Headers.empty
  .add("Content-Type", "application/json").try
  .add("Idempotency-Key", requestId).try
client.request("POST", url, headers, JSON.stringify(order).to(Binary).try)
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

Reports current pool occupancy and lifetime request counters.

```kex
statistics()
```

**Returns**: `ClientStatistics` — current pool and lifetime request counters

**Examples**

_Emitting client-pool diagnostics_

```kex
let stats = client.statistics
IO.printLine("HTTP reuse: ${stats.reusedConnections}/${stats.requests}")
```

#### `close`

Idempotently closes the client and every idle pooled connection.

Further requests fail with `Closed`; a second close is harmless.

```kex
close()
```

## make `Headers` implements Showable, Inspectable


#### `add`

Appends a field, keeping existing fields of the same name.

Repeats are how `Set-Cookie` works: it is not a comma-separated list, so two cookies must be two fields. For replace-semantics, `remove` first.

An invalid name or value is an `Error`, not a silent drop. Rejecting `"a\r\nX: y"` is what stops response splitting, but dropping it quietly left the caller holding a valid `Headers` that simply lacked the field it asked for, and a response with no `Content-Type` invites MIME sniffing. `from` and `parse` already answer with a `Result` for this same input.

```kex
add(name, value)
```

**Returns**: `Result<Headers, NetError>` — the extended fields, or `Parse`

**Examples**

_Two cookies on one response_

```kex
Headers.empty
  .add("Set-Cookie", "session=abc; HttpOnly").try
  .add("Set-Cookie", "theme=dark").try
```
_Replacing a field_

```kex
headers.remove("Content-Type").add("Content-Type", "application/json").try
```

#### `remove`

Removes every field matching `name` case-insensitively.

```kex
remove(name)
```

**Examples**

_Stripping hop-by-hop state before forwarding_

```kex
let forwarded = incoming.remove("Connection")
```

#### `get`

Returns the first matching field value.

```kex
get(name)
```

**Examples**

_Selecting a response decoder_

```kex
let contentType = response.headers.get("Content-Type").or("application/octet-stream")
```

#### `getAll`

Returns every matching value in insertion order.

```kex
getAll(name)
```

**Examples**

_Preserving every Set-Cookie field_

```kex
let cookies = response.headers.getAll("Set-Cookie")
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

**Examples**

_Reading `:id` from a `/users/:id` route_

```kex
let id = context.parameter("id").try
```

## module `Net.HTTP.HTTP`

Stateless HTTP convenience calls for scripts and occasional requests.

## function `request`

Sends one stateless buffered request with no redirect or hidden retry.

Each call owns a short-lived client. This is convenient for scripts and occasional requests; use `Client` for a service making repeated calls.


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

