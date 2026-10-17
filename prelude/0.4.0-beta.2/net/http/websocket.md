---
package: prelude
version: "0.4.0-beta.2"
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

  - `subprotocols` : [[String](../../string.md#make-string)] (optional)
  - `maximumMessageBytes` : [Integer](../../number.md#make-integer) (optional)



## record `Session`

Negotiated handshake information. The subprotocol is `None` when the server selected none.

**Fields**

  - `subprotocol` : [String](../../string.md#make-string)?



## type `Connection`

An opaque RFC 6455 client connection. It does not reconnect automatically.

### Methods

#### `send`

```kex
send(message: Message) -> Result<Void, NetError>
```

Sends one masked text, binary, or close message.

**Returns**: success or `Protocol`/`Limit`/`Closed`

**Examples**

_Subscribing after connecting_

```kex
connection.send(Text(JSON.stringify({ action: "subscribe", topic: topic }))).try
```

#### `receiveMessage`

```kex
receiveMessage : Result<Message, NetError>
```

`receive` is a Kex process keyword, so the public method spells out the operation while preserving the plan's high-level message semantics. Reassembles fragments, validates UTF-8, and automatically answers pings.

A `CloseMessage` is returned once so the application can inspect the peer's reason. Subsequent reads fail with `Closed`.

**Returns**: the next data or close message

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

```kex
session : Session
```

Returns handshake details negotiated with the server.

**Returns**: the selected subprotocol, if any

**Examples**

_Verifying which compatible event format was selected_

```kex
let protocol = connection.session.subprotocol.or("default")
```

#### `close`

```kex
close : Void
```

Sends a normal close frame and idempotently releases the transport.

Use an explicit `CloseMessage` with `send` first when the peer needs an application-specific code or reason.

#### `closed?`

```kex
closed? : Bool
```

**Returns**: whether the connection owner has stopped

## module `Net.HTTP.WebSocket.WebSocket`

Constructors for high-level WebSocket client connections.

### `connect`

```kex
connect(url: String, options: ClientOptions) -> Result<Connection, NetError>
```

Opens a `ws:` or verified `wss:` connection with default options.

**Parameters**

  - `url` — an absolute WebSocket URL

**Returns**: a connection or typed handshake error

**Examples**

_Following a live event feed_

```kex
let socket = WebSocket.connect("wss://events.example.com/orders").try
match socket.receiveMessage.try do
  Text(json) => IO.printLine(json)
  _          => IO.warn("unexpected non-text event")
end
```
