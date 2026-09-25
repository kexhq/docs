---
package: prelude
version: "0.4.0-beta.4-dev"
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

  - `entries` : [([String](../string.md#make-string), [String](../string.md#make-string))]

Implements [`Showable`](../kex.md#trait-showable), [`Inspectable`](../kex.md#trait-inspectable).

### Methods

#### `add`

```kex
add(name: String, value: String) -> Result<Headers, NetError>
```

Appends a field, keeping existing fields of the same name.

Repeats are how `Set-Cookie` works: it is not a comma-separated list, so two cookies must be two fields. For replace-semantics, `remove` first.

An invalid name or value is an `Error`, not a silent drop. Rejecting `"a\r\nX: y"` is what stops response splitting, but dropping it quietly left the caller holding a valid `Headers` that simply lacked the field it asked for, and a response with no `Content-Type` invites MIME sniffing. `from` and `parse` already answer with a `Result` for this same input.

**Returns**: the extended fields, or `Parse`

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

```kex
remove(name: String) -> Headers
```

Removes every field matching `name` case-insensitively.

**Examples**

_Stripping hop-by-hop state before forwarding_

```kex
let forwarded = incoming.remove("Connection")
```

#### `get`

```kex
get(name: String) -> String?
```

Returns the first matching field value.

**Examples**

_Selecting a response decoder_

```kex
let contentType = response.headers.get("Content-Type").or("application/octet-stream")
```

#### `getAll`

```kex
getAll(name: String) -> [String]
```

Returns every matching value in insertion order.

**Examples**

_Preserving every Set-Cookie field_

```kex
let cookies = response.headers.getAll("Set-Cookie")
```

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

**Parameters**

  - `name` — the capture name declared in the route

**Returns**: the capture, or `Parse` when absent

**Examples**

_Reading +:id+ from a +/users/:id+ route_

```kex
let id = context.parameter("id").try
```

## record `Context`

Per-request server context.

**Fields**

  - `route` : [RouteContext](#record-net-http-routecontext)



## type `Handler`

A buffered HTTP route handler. Handling a request is effectful: routes may read files, query a database, send messages, or perform other application IO.



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

Use this for a method without a convenience function. Paths may include named or wildcard captures, which the handler reads from `RouteContext`.

**Examples**

_Adding a custom method_

```kex
router.route("PURGE", "/cache/:key", ~purge)
```

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

This keeps policy with the caller: inspect a redirect before following it, and retry only methods and failures your application knows are safe.

**Examples**

_Sending JSON with an idempotency key_

```kex
let headers = Headers.empty
  .add("Content-Type", "application/json").try
  .add("Idempotency-Key", requestId).try
client.request("POST", url, headers, JSON.stringify(order).to(Binary).try)
```

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

Reports current pool occupancy and lifetime request counters.

**Returns**: current pool and lifetime request counters

**Examples**

_Emitting client-pool diagnostics_

```kex
let stats = client.statistics
IO.printLine("HTTP reuse: ${stats.reusedConnections}/${stats.requests}")
```

#### `close`

```kex
close : Result<ClientCloseReport, NetError>
```

Idempotently closes the client and every idle pooled connection.

Further requests fail with `Closed`; a second close is harmless.

## module `Net.HTTP.Headers`

Construction and parsing of validated HTTP header collections.

### `empty` (constant)

```kex
empty : Headers
```

Returns a field collection with no entries.

**Examples**

_Building request headers immutably_

```kex
Headers.empty
  .add("Accept", "application/json").try
  .add("User-Agent", "inventory-sync/1.0").try
```



### `from`

```kex
from(entries: [(String, String)]) -> Result<Headers, NetError>
from(entries: Map<String, String>) -> Result<Headers, NetError>
```

Validates header names and values without folding duplicates.

Duplicate fields stay in their original order. Invalid names and values containing line breaks are rejected instead of creating a malformed or injectable HTTP message.

**Returns**: validated fields, or `Parse`

**Examples**

_Forwarding an explicitly selected set of request headers_

```kex
Headers.from([
  ("Accept", "application/json"),
  ("X-Request-ID", requestId)
]).try
```

### `parse`

```kex
parse(text: String) -> Result<Headers, NetError>
```

Parses CRLF- or LF-separated header fields.

Use this at a protocol boundary when headers arrive as text. Application code normally builds them with `from`, `add`, and `set`.

**Returns**: fields in source order, or `Parse`

**Examples**

_Parsing headers captured from a diagnostic fixture_

```kex
Headers.parse("Content-Type: text/plain\r\nX-Trace: abc\r\n").try
```

## module `Net.HTTP.Status`

Validation for numeric HTTP status codes.

### `from`

```kex
from(code: Integer) -> Result<Status, NetError>
```

Validates an HTTP status code.

**Parameters**

  - `code` — a status in `100..599`

**Returns**: the status, or `Parse`

**Examples**

_Validating a configurable health-check success code_

```kex
let code = ENV.get("HEALTH_STATUS").flatMap { |text| text.to(Integer) }.or(204)
let expected = Status.from(code).try
```

## module `Net.HTTP.Response`

Buffered response constructors for route handlers.

### `binary`

```kex
binary(status: Integer, body: Binary, headers: Headers) -> Response<Binary>
```

Builds a buffered binary response with validated headers.

**Examples**

_Returning a downloaded file without decoding it as text_

```kex
Response.binary(200, archive, Headers.empty.add("Content-Type", "application/zip").try)
```

### `text`

```kex
text(status: Integer, body: String) -> Response<Binary>
```

Builds a UTF-8 text response with an explicit text/plain content type.

**Examples**

_A small health endpoint_

```kex
Response.text(200, "ok")
```

### `empty`

```kex
empty(status: Integer) -> Response<Binary>
```

Builds a response with an empty body.

**Examples**

_A successful DELETE endpoint_

```kex
Response.empty(204)
```

## module `Net.HTTP.Router`

The empty starting point for an immutable route declaration chain.

### `build` (constant)

**Examples**

_+Router.build.get("/health", { |request, context| Response.text(200, "ok") })+_

```kex

```



## module `Net.HTTP.Server`

Starting, observing, and gracefully stopping HTTP servers.

### `start`

```kex
start(endpoint: Net.Socket.TCP.Endpoint, router: Router, options: ServerOptions) -> Result<Running, NetError>
```

Starts a server with conservative defaults and returns immediately.

The returned handle owns the listener and active handlers. Use `start` when the process has other work to do; use `serve` for a foreground server whose main job is handling HTTP.

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

New requests stop being accepted while in-flight handlers get their grace period to finish. The report says how much work completed or was forced down during shutdown.

**Examples**

_Shutting down from an application lifecycle hook_

```kex
let report = Server.stop(server).try
IO.printLine("closed after ${report.completed} requests")
```

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

Returns the bound address, including an operating-system-assigned port.

**Returns**: the bound address

**Examples**

_Publishing the actual address of a test server_

```kex
let endpoint = Server.localAddress(server)
IO.printLine("test server: http://${endpoint.host}:${endpoint.port.string}")
```

## type `Running`

An opaque asynchronous HTTP server handle.



## module `Net.HTTP.Client`

Constructors for explicitly owned, connection-pooling HTTP clients.

### `open`

```kex
open : Result<Client, NetError>
open(options: ClientOptions) -> Result<Client, NetError>
```

Opens an explicit pooled client with conservative defaults.

Reuse one client for related requests so keep-alive connections and DNS work can be reused. Close it when the owning service shuts down.

**Examples**

_Fetching several pages through one connection pool_

```kex
let client = Client.open.try
let first = client.get("https://api.example.com/items?page=1").try
let second = client.get("https://api.example.com/items?page=2").try
client.close.try
```

## module `Net.HTTP.HTTP`

Stateless HTTP convenience calls for scripts and occasional requests.

### `request`

```kex
request : String -> String -> Headers -> Binary -> Result<Response<Binary>, NetError>
```

Sends one stateless buffered request with no redirect or hidden retry.

Each call owns a short-lived client. This is convenient for scripts and occasional requests; use `Client` for a service making repeated calls.

**Examples**

_A one-off authenticated request in a command-line tool_

```kex
let headers = Headers.empty.add("Authorization", "Bearer ${token}").try
HTTP.request("GET", url, headers).try
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
