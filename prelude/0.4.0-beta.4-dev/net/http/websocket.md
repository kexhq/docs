---
package: prelude
version: "0.4.0-beta.4-dev"
source: net/http/websocket.kex
title: Net.HTTP.WebSocket
entities:
  - { kind: module, name: "Net.HTTP.WebSocket" }
---

# Net.HTTP.WebSocket

## module `Net.HTTP.WebSocket`

High-level RFC 6455 client messages. The runtime handles fragmentation and ping/pong frames; reconnect and heartbeat policies remain application-owned.

A `Connection` delivers complete messages rather than wire frames. Your code never has to assemble fragments or answer a protocol ping, but it does decide what a dropped connection means: reconnecting may require resubscribing or replaying an application cursor, so the library cannot do that safely for you.

```kex
using Net.HTTP.WebSocket

let socket = WebSocket.connect("wss://example.test/events").try
socket.send(Text("hello")).try
let message = socket.receiveMessage.try
socket.close
```

## type `Message`

A complete high-level WebSocket message. Fragmentation and ping/pong control frames are handled by the connection runtime.

`CloseMessage` carries the peer's status code and reason. Treat it as the end of the message stream even when the code describes a normal shutdown.



**Variants**

  - `Text(String)`
  - `BinaryMessage(Binary)`
  - `CloseMessage(Integer, String)`

## record `ClientOptions`

Client handshake policy and the maximum reassembled message size.

Subprotocols are offered in preference order. The byte limit applies after fragments are reassembled, preventing a peer from bypassing the bound with many individually small frames.

**Fields**

  - `subprotocols` : [String] (optional)
  - `maximumMessageBytes` : Integer (optional)

## record `Session`

Negotiated handshake information. The subprotocol is `None` when the server selected none.

**Fields**

  - `subprotocol` : String?

## type `Connection`

An opaque RFC 6455 connection, client- or server-side. It does not reconnect automatically.



## record `Handshake`

Subprotocols offered by an incoming upgrade request, in the order the peer listed them.

**Fields**

  - `subprotocols` : [String] (optional)

## type `Upgrade`

A server's decision after inspecting a `Handshake`.

`Accept` takes over the connection once the 101 response is sent: `handler` runs with the negotiated server `Connection`, and its return value is discarded. `headers` are added to the 101 response; a name that manages the handshake itself (`Upgrade`, `Connection`, `Sec-WebSocket-Accept`, `Sec-WebSocket-Protocol`) is dropped rather than overridden. `subprotocol` must be one `handshake.subprotocols` actually offered, or `None`.

`Reject` answers with an ordinary buffered response instead, leaving the connection as plain HTTP — a client requesting an unsupported subprotocol might get `Response.text(426, "chat.v2 required")`, for instance.



**Variants**

  - `Accept((Connection) -> Void, Headers, String?)`
  - `Reject(Response<Binary>)`

## module `Net.HTTP.WebSocket.WebSocket`

Constructors for high-level WebSocket connections, client- and server-side.

## function `connect`

Opens a `ws:` or verified `wss:` connection with default options.


```kex
connect(url)
```


## function `upgrade`

Decides whether to accept an incoming `Net.HTTP.Server` upgrade request.

Call from a route handler and return the result directly — it types as an ordinary `Response<Binary>`, and `Net.HTTP.Server` recognizes what it actually is: a request that isn't a syntactically valid WebSocket handshake at all (wrong method, missing `Sec-WebSocket-Key`, unsupported `Sec-WebSocket-Version`) is answered automatically without calling `decide`; a valid one reaches `decide` for an application decision.


```kex
upgrade(request, decide)
```


## make `Connection`


#### `send`

Sends one masked text, binary, or close message.

```kex
send(message)
```

**Returns**: `Result<Void, NetError>` — success or `Protocol`/`Limit`/`Closed`

**Examples**

_Subscribing after connecting_

```kex
connection.send(Text(JSON.stringify({ action: "subscribe", topic: topic }))).try
```

#### `receiveMessage`

`receive` is a Kex process keyword, so the public method spells out the operation while preserving the plan's high-level message semantics. Reassembles fragments, validates UTF-8, and automatically answers pings.

A `CloseMessage` is returned once so the application can inspect the peer's reason. Subsequent reads fail with `Closed`.

```kex
receiveMessage()
```

**Returns**: `Result<Message, NetError>` — the next data or close message

**Examples**

_Processing messages until the server closes the session_

```kex
loop do
  match connection.receiveMessage.try do
    Text(text)                  => handleEvent(text)
    BinaryMessage(data)         => saveSnapshot(data)
    CloseMessage(code, reason)  => break
  end
end
```

#### `session`

Returns handshake details negotiated with the server.

```kex
session()
```

**Returns**: `Session` — the selected subprotocol, if any

**Examples**

_Verifying which compatible event format was selected_

```kex
let protocol = connection.session.subprotocol.or("default")
```

#### `close`

Sends a normal close frame and idempotently releases the transport.

Use an explicit `CloseMessage` with `send` first when the peer needs an application-specific code or reason.

```kex
close()
```

**Returns**: `Void`

#### `closed?`

```kex
closed?()
```

**Returns**: `Bool` — whether the connection owner has stopped
