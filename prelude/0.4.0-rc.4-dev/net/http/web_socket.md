---
package: prelude
version: "0.4.0-rc.4-dev"
source: net/http/web_socket.kex
title: Net.HTTP.WebSocket
entities:
  - { kind: module, name: "Net.HTTP.WebSocket" }
---

# Net.HTTP.WebSocket

## module `Net.HTTP.WebSocket`

WebSocket (RFC 6455) connections that send and receive whole messages.

A `Connection` reassembles fragmented messages and answers pings itself. It does not reconnect or send heartbeats: what a dropped connection means, such as having to subscribe again or resume from a cursor, is up to your program.

```kex
using Net.HTTP.WebSocket

let socket = WebSocket.connect("wss://example.test/events").try
socket.send(Text("hello")).try
let message = socket.receiveMessage.try
socket.close
```



## type `Message`

One complete WebSocket message.

`CloseMessage` carries the peer's status code and reason. It ends the message stream, whatever the code, and later reads fail with `Closed`.

**Variants**

  - `Text(String)`
  - `BinaryMessage(Binary)`
  - `CloseMessage(Integer, String)`



## record `ClientOptions`

Options for a client connection: the subprotocols to offer and the largest message to accept.

List `subprotocols` in order of preference. `maximumMessageBytes` (16 MiB by default) applies to a whole reassembled message, so many small fragments cannot get around it; a larger incoming message is a `Limit` error. It also caps what `send` accepts.

**Fields**

  - `subprotocols` : [[String](../../string.md#make-string)] (optional)
  - `maximumMessageBytes` : [Integer](../../number.md#make-integer) (optional)



## record `Session`

What the handshake settled. `subprotocol` is `None` when none was chosen.

**Fields**

  - `subprotocol` : [String](../../string.md#make-string)?



## type `Connection`

An open WebSocket connection, on the client or the server side. It does not reconnect on its own.

### Functions

#### `send` (foul)

```kex
send(message: Message) -> Result<Void, NetError>
```

Sends one text, binary or close message.

Text that is not valid UTF-8, a message over the size limit and an invalid close code are `Protocol` errors. Sending on a closed connection is a `Closed` error. On a client connection any failed send also closes the connection.

**Parameters**

  - `message` — the message to send

**Returns**: nothing, or why the message was not sent

**Examples**

_Subscribing after connecting_

```kex
connection.send(Text(JSON.stringify({ action: "subscribe", topic: topic }))).try
```

#### `receiveMessage` (foul)

```kex
receiveMessage(timeout: Duration?) -> Result<Message, NetError>
```

Waits for the next message and returns it, for as long as the peer stays connected.

Fragments are joined and pings answered along the way. Text that is not valid UTF-8 is a `Protocol` error, and a message over the size limit a `Limit` error. The peer's `CloseMessage` is returned once; reads after it fail with `Closed`, as do reads after the connection drops.

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

#### `session` (foul)

```kex
session -> Session
```

Returns what the handshake settled, such as the chosen subprotocol.

**Returns**: the handshake's outcome

**Examples**

_Checking which event format the server chose_

```kex
let protocol = connection.session.subprotocol.or("default")
```

#### `close` (foul)

```kex
close -> Void
```

Sends a normal close frame (code 1000) and closes the connection.

Closing an already closed connection does nothing. To give the peer a different code or a reason, `send` a `CloseMessage` first.

#### `closed?` (foul)

```kex
closed? -> Bool
```

Returns whether the connection is closed.

A server connection counts as closed as soon as either side closes it or the transport fails. A client connection counts as closed once it has finished shutting down.

**Returns**: whether the connection is closed

## record `Handshake`

The subprotocols an incoming upgrade request offers, in the order the client listed them.

**Fields**

  - `subprotocols` : [[String](../../string.md#make-string)] (optional)



## type `Upgrade`

A server's answer to a `Handshake`.

`Accept(handler, headers, subprotocol)` sends the 101 response and then runs `handler` with the server `Connection`; its return value is ignored. The `headers` are added to the 101 response, except `Upgrade`, `Connection`, `Sec-WebSocket-Accept`, `Sec-WebSocket-Protocol` and `Content-Length`, which are dropped. `subprotocol` must be one the client offered, or `None`; choosing any other makes the server answer 500.

`Reject(response)` sends `response` as a plain HTTP response, such as `Response.text(426, "chat.v2 required")` for a client that lacks a subprotocol you need.

**Variants**

  - `Accept((Connection) -> Void, Headers, String?)`
  - `Reject(Response<Binary>)`



## module `Net.HTTP.WebSocket.WebSocket`

Opening client connections and accepting server ones.

### `connect` (foul)

```kex
connect(url: String, options: ClientOptions) -> Result<Connection, NetError>
```

Opens a client connection to a `ws:` or `wss:` URL with default options.

A `wss:` connection verifies the server's certificate. The handshake gives up with a `Timeout` error after about 11 seconds.

**Parameters**

  - `url` — an absolute WebSocket URL

**Returns**: the connection, or why it could not be opened

**Examples**

_Following a live event feed_

```kex
let socket = WebSocket.connect("wss://events.example.com/orders").try
match socket.receiveMessage.try do
  Text(json) => IO.printLine(json)
  _          => IO.printError("unexpected non-text event")
end
```

### `upgrade` (foul)

```kex
upgrade(request: Request<Binary>, decide: (Handshake -> Upgrade)) -> Response<Binary>
```

Answers a WebSocket upgrade request in a `Net.HTTP.Server` route handler.

Return the result from the handler as it is. `decide` is called only for a valid handshake. A request that is not one gets 400 Bad Request (wrong method, a missing or malformed `Sec-WebSocket-Key`), or 426 Upgrade Required when the `Sec-WebSocket-Version` is not 13.

**Parameters**

  - `request` — the request the route handler received
  - `decide` — chooses to accept or reject

**Returns**: the response to return from the handler; the server recognises an accepted upgrade in it

**Examples**

_An authenticated, subprotocol-gated chat route_

```kex
foul socketRoute(request: Request<Binary>, context: Context) -> Response<Binary> = WebSocket.upgrade(request) do |handshake|
  if handshake.subprotocols.contains?("chat.v2")
    let handler : Connection -> Void = { |socket| serveChat(socket) }
    Accept(handler, Headers.empty, Just("chat.v2"))
  else
    Reject(Response.text(426, "chat.v2 required"))
  end
end
let router = Router.build.get("/socket", ~socketRoute)
```
