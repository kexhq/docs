---
package: prelude
version: "0.4.0-alpha"
source: net/http/websocket.kex
title: Net.HTTP.WebSocket
entities:
  - { kind: module, name: "Net.HTTP.WebSocket" }
---

# Net.HTTP.WebSocket

## module `Net.HTTP.WebSocket`

## type `Message`

High-level RFC 6455 client messages. The runtime handles fragmentation and ping/pong frames; reconnect and heartbeat policies remain application-owned.

```kex
using Net.HTTP.WebSocket

let socket = WebSocket.connect("wss://example.test/events").try
socket.send(Text("hello")).try
let message = socket.receiveMessage.try
socket.close
```

A complete high-level WebSocket message. Fragmentation and ping/pong control frames are handled by the connection runtime.



**Variants**

  - `Text(String)`
  - `BinaryMessage(Binary)`
  - `CloseMessage(Integer, String)`

## record `ClientOptions`

Client handshake policy and the maximum reassembled message size.

**Fields**

  - `subprotocols` : [String] (optional)
  - `maximumMessageBytes` : Integer (optional)

## record `Session`

Negotiated handshake information. The subprotocol is `None` when the server selected none.

**Fields**

  - `subprotocol` : String?

## type `Connection`

An opaque RFC 6455 client connection. It does not reconnect automatically.



## module `Net.HTTP.WebSocket.WebSocket`

## function `connect`

Opens a `ws:` or verified `wss:` connection with default options.


```kex
connect(url)
```


## make `Connection`


#### `send`

Sends one masked text, binary, or close message.

```kex
send(message)
```

**Returns**: `Result<Void, NetError>` — success or `Protocol`/`Limit`/`Closed`

**Examples**

_`connection.send(Text("hello")).try`_

```kex

```

#### `receiveMessage`

`receive` is a Kex process keyword, so the public method spells out the operation while preserving the plan's high-level message semantics. Reassembles fragments, validates UTF-8, and automatically answers pings.

```kex
receiveMessage()
```

**Returns**: `Result<Message, NetError>` — the next data or close message

**Examples**

_`connection.receiveMessage.try`_

```kex

```

#### `session`

```kex
session()
```

**Returns**: `Session` — the selected subprotocol, if any

#### `close`

Sends a normal close frame and idempotently releases the transport.

```kex
close()
```

**Returns**: `Void`

#### `closed?`

```kex
closed?()
```

**Returns**: `Bool` — whether the connection owner has stopped
