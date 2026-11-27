---
package: prelude
version: "0.4.0-rc.4-dev"
source: net/http.kex
title: Net.HTTP
entities:
  - { kind: module, name: "Net.HTTP" }
---

# Net.HTTP

## module `Net.HTTP`

Buffered HTTP clients and responses, and a small server whose router tries routes in the order they were declared. Requests never follow redirects or retry on their own.

```kex
using Net.HTTP

let response = HTTP.get("https://example.test/").try
response.status.success?   # => true
```

To reuse connections and read statistics, open a client:

```kex
let client = Client.open.try
let response = client.get("https://example.test/").try
client.close.try
```



## record `Headers`

HTTP header fields in insertion order. Names compare case-insensitively, and a name may appear more than once.

Headers are a list of pairs, not a map, because some fields must repeat: two cookies are two `Set-Cookie` fields and cannot be joined into one (RFC 6265). The order of fields sharing a name is significant (RFC 9110), so it is kept too.

**Fields**

  - `entries` : [([String](../string.md#make-string), [String](../string.md#make-string))]

Implements [`Showable`](../kex.md#trait-showable), [`Inspectable`](../kex.md#trait-inspectable).

### Functions

#### `add`

```kex
add(name: String, value: String) -> Result<Headers, NetError>
```

Appends a field, keeping existing fields of the same name.

Adding a name that is already there gives a second field, which is how two `Set-Cookie` fields are sent. To replace a field, `remove` it first.

An invalid name, or a value with a line break such as `"a\r\nX: y"`, is a `Parse` error, which stops header injection.

**Parameters**

  - `name` — the field name
  - `value` — the field value

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

Removes every field named `name`, ignoring case.

**Parameters**

  - `name` — the field name

**Examples**

_Stripping hop-by-hop state before forwarding_

```kex
let forwarded = incoming.remove("Connection")
```

#### `get`

```kex
get(name: String) -> String?
```

Returns the value of the first field named `name`, ignoring case, or `None`.

**Parameters**

  - `name` — the field name

**Examples**

_Selecting a response decoder_

```kex
let contentType = response.headers.get("Content-Type").or("application/octet-stream")
```

#### `getAll`

```kex
getAll(name: String) -> [String]
```

Returns the values of every field named `name`, in insertion order.

**Parameters**

  - `name` — the field name

**Examples**

_Preserving every Set-Cookie field_

```kex
let cookies = response.headers.getAll("Set-Cookie")
```

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the fields, with authorization and cookie values shown as `***`.

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Renders the fields as `showValue` does, with credentials hidden.

### From [`Showable`](../kex.md#trait-showable)

  - [`to`](../kex.md#showable-to) — 

## record `Status`

A validated HTTP status code in `100..599`.

**Fields**

  - `code` : [Integer](../number.md#make-integer)

### Functions

#### `informational?`

```kex
informational? -> Bool
```

Returns `true` for a `1xx` status.

**Returns**: whether the status is in `100..199`

#### `success?`

```kex
success? -> Bool
```

Returns `true` for a `2xx` status.

**Returns**: whether the status is in `200..299`

#### `redirect?`

```kex
redirect? -> Bool
```

Returns `true` for a `3xx` status.

**Returns**: whether the status is in `300..399`

#### `clientError?`

```kex
clientError? -> Bool
```

Returns `true` for a `4xx` status.

**Returns**: whether the status is in `400..499`

#### `serverError?`

```kex
serverError? -> Bool
```

Returns `true` for a `5xx` status.

**Returns**: whether the status is in `500..599`

## record `Response<B>`

An HTTP response: status, headers and a body of type `B`.

**Fields**

  - `status` : [Status](#record-net-http-status)
  - `headers` : [Headers](#record-net-http-headers)
  - `body` : B



## record `Request<B>`

An HTTP request: method, target, headers and a body of type `B`.

**Fields**

  - `method` : [String](../string.md#make-string)
  - `target` : [URI](../uri.md#record-uri-uri)
  - `headers` : [Headers](#record-net-http-headers)
  - `body` : B



## record `RouteContext`

The named and wildcard captures of the matched route, already decoded.

**Fields**

  - `parameters` : [Map](../map.md#type-map)<[String](../string.md#make-string), [String](../string.md#make-string)> (optional)

### Functions

#### `parameter`

```kex
parameter(name: String) -> Result<String, NetError>
```

Returns the decoded value of a named or wildcard route capture.

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

A route handler: a `foul` function from a `Request<Binary>` and its `Context` to a `Response<Binary>`. Being `foul`, it may read files, query a database or send messages.



## record `Route`

One declared route.

**Fields**

  - `method` : [String](../string.md#make-string)
  - `path` : [String](../string.md#make-string)
  - `handler` : [Handler](#type-net-http-handler)
  - `maximumBodyBytes` : [Integer](../number.md#make-integer)? (optional)



## record `Router`

An HTTP router. The first declared route that matches a request handles it.

**Fields**

  - `routes` : [[Route](#record-net-http-route)] (optional)

### Functions

#### `route`

```kex
route(method: String, path: String, handler: Handler, maximumBodyBytes: Integer) -> Router
```

Adds a route for any HTTP method. Routes declared earlier win.

Use it for a method that has no function of its own. Paths may include named or wildcard captures, which the handler reads from `RouteContext`.

**Examples**

_Adding a custom method_

```kex
router.route("PURGE", "/cache/:key", ~purge)
```

#### `get`

```kex
get(path: String, handler: Handler, maximumBodyBytes: Integer) -> Router
```

Adds a GET route, which also answers HEAD requests unless a HEAD route is declared.

#### `head`

```kex
head(path: String, handler: Handler) -> Router
```

Adds a HEAD route, used in place of the GET route's automatic HEAD answer.

#### `options`

```kex
options(path: String, handler: Handler) -> Router
```

Adds an OPTIONS route, used in place of the generated OPTIONS answer.

#### `post`

```kex
post(path: String, handler: Handler, maximumBodyBytes: Integer) -> Router
```

Adds a POST route.

#### `put`

```kex
put(path: String, handler: Handler, maximumBodyBytes: Integer) -> Router
```

Adds a PUT route.

#### `patch`

```kex
patch(path: String, handler: Handler, maximumBodyBytes: Integer) -> Router
```

Adds a PATCH route.

#### `delete`

```kex
delete(path: String, handler: Handler) -> Router
```

Adds a DELETE route.

#### `limited`

```kex
limited(method: String, path: String, handler: Handler, maximumBodyBytes: Integer?) -> Router
```

## record `ShutdownReport`

What a graceful server shutdown did: requests completed, failed and forced down, and how long it took.

**Fields**

  - `completed` : [Integer](../number.md#make-integer)
  - `failed` : [Integer](../number.md#make-integer)
  - `forced` : [Integer](../number.md#make-integer)
  - `elapsedMilliseconds` : [Integer](../number.md#make-integer)



## record `ServerOptions`

Server limits: concurrent handlers, the accept backlog, the default grace period on shutdown, and the request body limit.

**Fields**

  - `maximumHandlers` : [Integer](../number.md#make-integer) (optional)
  - `backlog` : [Integer](../number.md#make-integer) (optional)
  - `gracefulShutdown` : Duration (optional)
  - `maximumBodyBytes` : [Integer](../number.md#make-integer) (optional)



## record `RequestOptions`

How long one client request may take, and how large a response it accepts.

A request over a size limit is a `Limit` error, and one over a time limit a `Timeout`.

**Examples**

_A link preview: a short deadline and a small answer_

```kex
RequestOptions { timeout: 2.second, maximumBodyBytes: 262144 }
```

**Fields**

  - `connectTimeout` : Duration (optional)
  - `timeout` : Duration (optional)
  - `maximumBodyBytes` : [Integer](../number.md#make-integer) (optional)
  - `maximumHeaderBytes` : [Integer](../number.md#make-integer) (optional)



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
  - `request` : [RequestOptions](#record-net-http-requestoptions) (optional)



## record `ClientStatistics`

A client's open pooled connections, and how many requests it has made and how many reused a connection.

**Fields**

  - `openConnections` : [Integer](../number.md#make-integer)
  - `requests` : [Integer](../number.md#make-integer)
  - `reusedConnections` : [Integer](../number.md#make-integer)



## record `ClientCloseReport`

Resources released by `Client.close`.

**Fields**

  - `closedConnections` : [Integer](../number.md#make-integer)



## type `Client`

An HTTP client with its own connection pool. `Client.open` makes one and `close` releases it.

### Functions

#### `request` (foul)

```kex
request(method: String, url: String, headers: Headers, body: Binary, options: RequestOptions) -> Result<Response<Binary>, NetError>
```

Sends a request and reads the whole response.

Redirects are not followed and failures are not retried; a redirect comes back as a `3xx` response for you to act on.

**Examples**

_Sending JSON with an idempotency key_

```kex
let headers = Headers.empty
  .add("Content-Type", "application/json").try
  .add("Idempotency-Key", requestId).try
client.request("POST", url, headers, JSON.stringify(order).to(Binary).try)
```

#### `get` (foul)

```kex
get(url: String) -> Result<Response<Binary>, NetError>
```

Sends a GET request.

#### `post` (foul)

```kex
post(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a POST request with a binary body.

#### `put` (foul)

```kex
put(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a PUT request with a binary body.

#### `patch` (foul)

```kex
patch(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a PATCH request with a binary body.

#### `delete` (foul)

```kex
delete(url: String) -> Result<Response<Binary>, NetError>
```

Sends a DELETE request with an empty body.

#### `head` (foul)

```kex
head(url: String) -> Result<Response<Binary>, NetError>
```

Sends a HEAD request; the returned body is empty.

#### `options` (foul)

```kex
options(url: String) -> Result<Response<Binary>, NetError>
```

Sends an OPTIONS request.

#### `statistics` (foul)

```kex
statistics -> ClientStatistics
```

Returns the client's open connections and request counts.

**Returns**: current pool and lifetime request counters

**Examples**

_Emitting client-pool diagnostics_

```kex
let stats = client.statistics
IO.printLine("HTTP reuse: ${stats.reusedConnections}/${stats.requests}")
```

#### `close` (foul)

```kex
close -> Result<ClientCloseReport, NetError>
```

Closes the client and its idle pooled connections.

Later requests fail with `Closed`. Closing twice is not an error.

## module `Net.HTTP.Headers`

Builds and parses validated `Headers`.

### `empty` (constant)

```kex
empty : Headers
```

Returns a field collection with no entries.

**Examples**

_Building request headers_

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

Builds headers from name-value pairs, validating each one.

Repeated names stay as separate fields, in order. An invalid name, or a value containing a line break, is a `Parse` error, so a value cannot inject extra header lines.

**Parameters**

  - `entries` — the fields, in order

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

Use it when headers arrive as text. To build headers in code, use `from` and `add`.

**Parameters**

  - `text` — the header block

**Returns**: fields in source order, or `Parse`

**Examples**

_Parsing headers captured from a diagnostic fixture_

```kex
Headers.parse("Content-Type: text/plain\r\nX-Trace: abc\r\n").try
```

## module `Net.HTTP.Status`

Builds a validated `Status` from a number.

### `from`

```kex
from(code: Integer) -> Result<Status, NetError>
```

Returns the status for `code`, or a `Parse` error outside `100..599`.

**Parameters**

  - `code` — a status in `100..599`

**Returns**: the status, or `Parse`

**Examples**

_Validating a configurable health-check success code_

```kex
let code = ENV.get("HEALTH_STATUS").into { |text| text.to(Integer) }.or(204)
let expected = Status.from(code).try
```

## module `Net.HTTP.Response`

Builds the responses a route handler returns.

### `binary` (foul)

```kex
binary(status: Integer, body: Binary, headers: Headers) -> Response<Binary>
```

Builds a response with a binary body and the given headers.

**Examples**

_Returning a downloaded file without decoding it as text_

```kex
Response.binary(200, archive, Headers.empty.add("Content-Type", "application/zip").try)
```

### `text` (foul)

```kex
text(status: Integer, body: String) -> Response<Binary>
```

Builds a UTF-8 text response with a `text/plain` content type.

**Examples**

_A small health endpoint_

```kex
Response.text(200, "ok")
```

### `empty` (foul)

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

Starts a route declaration chain.

### `build` (constant)

```kex
build : Router
```

Returns a router with no routes, to declare routes on.

**Examples**

_Build a health endpoint_

```kex
Router.build.get("/health", do |request, context|
  Response.text(200, "ok")
end)
```



## module `Net.HTTP.Server`

Starts, watches and stops HTTP servers.

### `start` (foul)

```kex
start(endpoint: Net.Socket.TCP.Endpoint, router: Router, options: ServerOptions) -> Result<Running, NetError>
```

Starts a server with the default `ServerOptions` and returns at once.

The handle owns the listener and the running handlers. Use `start` when the process has other work to do, and `serve` when serving HTTP is all it does.

**Examples**

```kex
let router = Router.build.get("/health", do |request, context|
  Response.text(200, "ok")
end)
let endpoint = Net.Socket.TCP.Endpoint.loopback(Net.Port.from(0).try)
let server = Server.start(endpoint, router).try
Server.stop(server).try
```

### `serve` (foul)

```kex
serve(endpoint: Net.Socket.TCP.Endpoint, router: Router, options: ServerOptions) -> Result<Void, NetError>
```

Starts a server with the default options and blocks until it stops.

### `stop` (foul)

```kex
stop(server: Running, grace: Duration) -> Result<ShutdownReport, NetError>
```

Stops the server gracefully, with the grace period from its `ServerOptions`.

The server stops accepting requests, and handlers already running get the grace period to finish. The report counts what completed and what was forced down.

**Examples**

_Shutting down from an application lifecycle hook_

```kex
let report = Server.stop(server).try
IO.printLine("closed after ${report.completed} requests")
```

### `join` (foul)

```kex
join(server: Running) -> Result<Void, NetError>
```

Waits until the server stops.

### `running?` (foul)

```kex
running?(server: Running) -> Bool
```

Returns `true` while the server is running.

**Returns**: whether the server is still running

### `localAddress` (foul)

```kex
localAddress(server: Running) -> Net.Socket.TCP.Endpoint
```

Returns the address the server is bound to, with the actual port when the operating system picked it.

**Returns**: the bound address

**Examples**

_Publishing the actual address of a test server_

```kex
let endpoint = Server.localAddress(server)
IO.printLine("test server: http://${endpoint.host}:${endpoint.port.string}")
```

## type `Running`

A handle to a server running in the background.



## module `Net.HTTP.Client`

Opens HTTP clients.

### `open` (foul)

```kex
open -> Result<Client, NetError>
open(options: ClientOptions) -> Result<Client, NetError>
```

Opens a client with the default `ClientOptions`.

Send related requests through one client so they reuse its connections, and close it when the service shuts down.

**Examples**

_Fetching several pages through one connection pool_

```kex
let client = Client.open.try
let first = client.get("https://api.example.com/items?page=1").try
let second = client.get("https://api.example.com/items?page=2").try
client.close.try
```

## module `Net.HTTP.HTTP`

One-off HTTP requests, each through its own short-lived client. Use `Client` for a service that makes repeated calls.

### `request`

```kex
request(method: String, url: String, headers: Headers = …, body: Binary = …) -> Result<Response<Binary>, NetError>
request(method: String, url: String, headers: Headers, body: Binary, options: RequestOptions) -> Result<Response<Binary>, NetError>
```

Sends a request and reads the whole response, without following redirects or retrying.

Each call opens and closes its own client, which suits scripts and occasional requests. A service making repeated calls should use `Client`.

**Parameters**

  - `method` — the HTTP method, such as `"GET"`
  - `url` — the URL to request
  - `headers` — the request headers, empty by default
  - `body` — the request body, empty by default

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

Sends a one-off GET request.

**Examples**

```kex
HTTP.get("https://example.test/").try
```

### `delete`

```kex
delete(url: String) -> Result<Response<Binary>, NetError>
```

Sends a one-off DELETE request with an empty body.

### `head`

```kex
head(url: String) -> Result<Response<Binary>, NetError>
```

Sends a one-off HEAD request; the response body is empty.

### `options`

```kex
options(url: String) -> Result<Response<Binary>, NetError>
```

Sends a one-off OPTIONS request.

### `post`

```kex
post(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a one-off POST request with a binary body.

### `put`

```kex
put(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a one-off PUT request with a binary body.

### `patch`

```kex
patch(url: String, body: Binary) -> Result<Response<Binary>, NetError>
```

Sends a one-off PATCH request with a binary body.
