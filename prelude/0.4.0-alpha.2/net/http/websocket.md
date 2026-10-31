---
package: prelude
version: "0.4.0-alpha.2"
source: net/http/websocket.kex
title: Net.HTTP.WebSocket
entities:
  - { kind: module, name: "Net.HTTP.WebSocket" }
---

# Net.HTTP.WebSocket

## module `Net.HTTP.WebSocket`

High-level RFC 6455 client messages. The runtime handles fragmentation and ping/pong frames; reconnect and heartbeat policies remain application-owned.

```kex
using Net.HTTP.WebSocket

let socket = WebSocket.connect("wss://example.test/events").try
socket.send(Text("hello")).try
let message = socket.receiveMessage.try
socket.close
```



## type `Message`

A complete high-level WebSocket message. Fragmentation and ping/pong control frames are handled by the connection runtime.

**Variants**

  - `Text(String)`
  - `BinaryMessage(Binary)`
  - `CloseMessage(Integer, String)`



## record `ClientOptions`

Client handshake policy and the maximum reassembled message size.

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

_+connection.send(Text("hello")).try+_

```kex

```

#### `receiveMessage`

```kex
receiveMessage : Result<Message, NetError>
```

`receive` is a Kex process keyword, so the public method spells out the operation while preserving the plan's high-level message semantics. Reassembles fragments, validates UTF-8, and automatically answers pings.

**Returns**: the next data or close message

**Examples**

_+connection.receiveMessage.try+_

```kex

```

#### `session`

```kex
session : Session
```

**Returns**: the selected subprotocol, if any

#### `close`

```kex
close : Void
```

Sends a normal close frame and idempotently releases the transport.

#### `closed?`

```kex
closed? : Bool
```

**Returns**: whether the connection owner has stopped

## module `Net.HTTP.WebSocket.WebSocket`

### `connect`

```kex
connect(url: String, options: ClientOptions) -> Result<Connection, NetError>
```

Opens a `ws:` or verified `wss:` connection with default options.

**Parameters**

  - `url` — an absolute WebSocket URL

**Returns**: a connection or typed handshake error

**Examples**

_+WebSocket.connect("wss://example.test/events").try+._

```kex

```
