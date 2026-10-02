---
package: prelude
version: "0.4.0-alpha.2"
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

  - `entries` : [([String](../string.md#make-string), [String](../string.md#make-string))]

Implements [`Showable`](../kex.md#trait-showable), [`Inspectable`](../kex.md#trait-inspectable).

### Methods

#### `add`

```kex
add(name: String, value: String) -> Headers
```

Appends a field without replacing existing fields of the same name.

**Examples**

_+Headers.empty.add("Accept", "text/plain")+_

```kex

```

#### `set`

```kex
set(name: String, value: String) -> Headers
```

Replaces all fields of `name` with one value.

**Examples**

_+headers.set("Content-Type", "application/json")+_

```kex

```

#### `remove`

```kex
remove(name: String) -> Headers
```

Removes every field matching `name` case-insensitively.

#### `get`

```kex
get(name: String) -> String?
```

Returns the first matching field value.

#### `getAll`

```kex
getAll(name: String) -> [String]
```

Returns every matching value in insertion order.

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders fields while replacing authorization and cookie values with `***`.

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Structural inspection uses the same credential-safe rendering.

### From [`Showable`](../kex.md#trait-showable)

  - [`to`](../kex.md#showable-to) — 

## record `Status`

A validated HTTP status code in `100..599`.

**Fields**

  - `code` : [Integer](../number.md#make-integer)

### Methods

#### `informational?`

```kex
informational? : Bool
```

**Returns**: whether the status is in `100..199`

#### `success?`

```kex
success? : Bool
```

**Returns**: whether the status is in `200..299`

#### `redirect?`

```kex
redirect? : Bool
```

**Returns**: whether the status is in `300..399`

#### `clientError?`

```kex
clientError? : Bool
```

**Returns**: whether the status is in `400..499`

#### `serverError?`

```kex
serverError? : Bool
```

**Returns**: whether the status is in `500..599`

## record `Response<B>`

A typed HTTP response envelope whose body representation is explicit.

**Fields**

  - `status` : [Status](#record-net-http-status)
  - `headers` : [Headers](#record-net-http-headers)
  - `body` : B



## record `Request<B>`

A typed HTTP request envelope whose body representation is explicit.

**Fields**

  - `method` : [String](../string.md#make-string)
  - `target` : [URI](../uri.md#record-uri-uri)
  - `headers` : [Headers](#record-net-http-headers)
  - `body` : B



## record `RouteContext`

Route captures decoded after path segmentation.

**Fields**

  - `parameters` : [Map](../map.md#type-map)<[String](../string.md#make-string), [String](../string.md#make-string)> (optional)

### Methods

#### `parameter`

```kex
parameter(name: String) -> Result<String, NetError>
```

Returns one decoded named or wildcard route capture.

**Returns**: the capture, or `Parse` when absent

## record `Context`

Per-request server context.

**Fields**

  - `route` : [RouteContext](#record-net-http-routecontext)



## type `Handler`

A buffered HTTP route handler.



## record `Route`

One declared route; routers preserve declaration order.

**Fields**

  - `method` : [String](../string.md#make-string)
  - `path` : [String](../string.md#make-string)
  - `handler` : [Handler](#type-net-http-handler)



## record `Router`

An immutable, declaration-ordered HTTP router.

**Fields**

  - `routes` : [[Route](#record-net-http-route)] (optional)

### Methods

#### `route`

```kex
route(method: String, path: String, handler: Handler) -> Router
```

Appends a route; earlier matching declarations win.

#### `get`

```kex
get(path: String, handler: Handler) -> Router
```

Appends a GET route. GET also supplies automatic HEAD fallback.

#### `head`

```kex
head(path: String, handler: Handler) -> Router
```

Appends an explicit HEAD route, overriding automatic GET fallback.

#### `options`

```kex
options(path: String, handler: Handler) -> Router
```

Appends an explicit OPTIONS route, overriding generated OPTIONS.

#### `post`

```kex
post(path: String, handler: Handler) -> Router
```

Appends a POST route.

#### `put`

```kex
put(path: String, handler: Handler) -> Router
```

Appends a PUT route.

#### `patch`

```kex
patch(path: String, handler: Handler) -> Router
```

Appends a PATCH route.

#### `delete`

```kex
delete(path: String, handler: Handler) -> Router
```

Appends a DELETE route.

## record `ShutdownReport`

Counts and elapsed time from graceful server shutdown.

**Fields**

  - `completed` : [Integer](../number.md#make-integer)
  - `failed` : [Integer](../number.md#make-integer)
  - `forced` : [Integer](../number.md#make-integer)
  - `elapsedMilliseconds` : [Integer](../number.md#make-integer)



## record `ServerOptions`

Bounded HTTP server resources and default graceful-shutdown duration.

**Fields**

  - `maximumHandlers` : [Integer](../number.md#make-integer) (optional)
  - `backlog` : [Integer](../number.md#make-integer) (optional)
  - `gracefulShutdown` : [Duration](../units.md#record-duration) (optional)



## record `PoolOptions`

HTTP connection-pool bounds and idle lifetime.

**Fields**

  - `perOrigin` : [Integer](../number.md#make-integer) (optional)
  - `total` : [Integer](../number.md#make-integer) (optional)
  - `queuedRequests` : [Integer](../number.md#make-integer) (optional)
  - `idleExpiryMilliseconds` : [Integer](../number.md#make-integer) (optional)



## record `ClientOptions`

Options owned by an explicit HTTP client.

**Fields**

  - `pool` : [PoolOptions](#record-net-http-pooloptions) (optional)



## record `ClientStatistics`

Lifetime request/reuse counters plus current pooled connections.

**Fields**

  - `openConnections` : [Integer](../number.md#make-integer)
  - `requests` : [Integer](../number.md#make-integer)
  - `reusedConnections` : [Integer](../number.md#make-integer)



## record `ClientCloseReport`

Resources released by `Client.close`.

**Fields**

  - `closedConnections` : [Integer](../number.md#make-integer)



## type `Client`

The pooled HTTP client. An opaque handle over the connection pool that owns it; `Client.open` makes one and `client.close` releases it.

### Methods

#### `request`

```kex
request(method: String, url: String, headers: Headers, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a buffered request. Redirects and generic retries are not implicit.

#### `get`

```kex
get(url: String) -> Result<Response<Binary>, NetError>
```

Sends a buffered GET request.

#### `post`

```kex
post(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a buffered binary POST request.

#### `put`

```kex
put(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a buffered binary PUT request.

#### `patch`

```kex
patch(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a buffered binary PATCH request.

#### `delete`

```kex
delete(url: String) -> Result<Response<Binary>, NetError>
```

Sends a DELETE request with an empty body.

#### `head`

```kex
head(url: String) -> Result<Response<Binary>, NetError>
```

Sends a HEAD request; the returned body is empty.

#### `options`

```kex
options(url: String) -> Result<Response<Binary>, NetError>
```

Sends an OPTIONS request.

#### `statistics`

```kex
statistics : ClientStatistics
```

**Returns**: current pool and lifetime request counters

#### `close`

```kex
close : Result<ClientCloseReport, NetError>
```

Idempotently closes the client and every idle pooled connection.

## module `Net.HTTP.Headers`

### `empty` (constant)

```kex
empty : Headers
```



### `from`

```kex
from(entries: [(String, String)]) -> Result<Headers, NetError>
```

Validates header names and values without folding duplicates.

**Returns**: validated fields, or `Parse`

**Examples**

_+Headers.from([("Accept", "application/json")]).try+_

```kex

```

### `parse`

```kex
parse(text: String) -> Result<Headers, NetError>
```

Parses CRLF- or LF-separated header fields.

**Returns**: fields in source order, or `Parse`

## module `Net.HTTP.Status`

### `from`

```kex
from(code: Integer) -> Result<Status, NetError>
```

## module `Net.HTTP.Response`

### `binary`

```kex
binary(status: Integer, body: Binary, headers: Headers) -> Response<Binary>
```

Builds a buffered binary response with validated headers.

**Examples**

_+Response.binary(200, Binary.empty, Headers.empty)+_

```kex

```

### `text`

```kex
text(status: Integer, body: String) -> Response<Binary>
```

Builds a UTF-8 text response with an explicit text/plain content type.

**Examples**

_+Response.text(200, "hello")+_

```kex

```

### `empty`

```kex
empty(status: Integer) -> Response<Binary>
```

Builds a response with an empty body.

## module `Net.HTTP.Router`

### `build` (constant)

**Examples**

_+Router.build.get("/health", { |request, context| Response.text(200, "ok") })+_

```kex

```



## module `Net.HTTP.Server`

### `start`

```kex
start(endpoint: Net.Socket.TCP.Endpoint, router: Router, options: ServerOptions) -> Result<Running, NetError>
```

Starts a server with conservative defaults and returns immediately.

**Examples**

```kex
let router = Router.build.get("/health", do |request, context|
  Response.text(200, "ok")
end)
let endpoint = Net.Socket.TCP.Endpoint.loopback(Net.Port.from(0).try)
let server = Server.start(endpoint, router).try
Server.stop(server).try
```

### `serve`

```kex
serve(endpoint: Net.Socket.TCP.Endpoint, router: Router, options: ServerOptions) -> Result<Void, NetError>
```

Starts with defaults and blocks until the server stops.

### `stop`

```kex
stop(server: Running, grace: Duration) -> Result<ShutdownReport, NetError>
```

Gracefully stops using the duration captured at start.

### `join`

```kex
join(server: Running) -> Result<Void, NetError>
```

Waits until the server owner exits.

### `running?`

```kex
running?(server: Running) -> Bool
```

**Returns**: whether the server owner is alive

### `localAddress`

```kex
localAddress(server: Running) -> Net.Socket.TCP.Endpoint
```

**Returns**: the bound address, including ephemeral port

## type `Running`

An opaque asynchronous HTTP server handle.



## module `Net.HTTP.Client`

### `open`

```kex
open : Result<Client, NetError>
open(options: ClientOptions) -> Result<Client, NetError>
```

Opens an explicit pooled client with conservative defaults.

**Examples**

_+Client.open.try+_

```kex

```

## module `Net.HTTP.HTTP`

### `request`

```kex
request : String -> String -> Headers -> Binary -> Result<Response<Binary>, NetError>
```

Sends one stateless buffered request with no redirect or hidden retry.

**Examples**

_+HTTP.request("GET", "https://example.test/").try+_

```kex

```

### `get`

```kex
get(url: String) -> Result<Response<Binary>, NetError>
```

Sends one stateless buffered GET.

**Examples**

_+HTTP.get("https://example.test/").try+_

```kex

```

### `delete`

```kex
delete(url: String) -> Result<Response<Binary>, NetError>
```

Sends one stateless DELETE with an empty body.

### `head`

```kex
head(url: String) -> Result<Response<Binary>, NetError>
```

Sends one stateless HEAD and returns an empty response body.

### `options`

```kex
options(url: String) -> Result<Response<Binary>, NetError>
```

Sends one stateless OPTIONS request.

### `post`

```kex
post(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends one stateless buffered binary POST.

### `put`

```kex
put(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends one stateless buffered binary PUT.

### `patch`

```kex
patch(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends one stateless buffered binary PATCH.
