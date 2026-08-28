---
package: prelude
version: "0.4.0-alpha"
source: net/socket.kex
title: Net.Socket
entities:
  - { kind: module, name: "Net.Socket" }
---

# Net.Socket

## module `Net.Socket`

## module `Net.Socket.TCP`

Process-owned TCP byte streams and listeners. All blocking operations return typed `NetError` values; close operations are idempotent.

```kex
using Net
using Net.Socket

let listener = TCP.listen(TCP.Endpoint.loopback(Port.from(0).try)).try
let address = listener.localAddress.try
let client = TCP.connect(address).try
client.sendAll("ping".to(Binary).try).try
listener.close
```

## type `Plain`

Marker for an unencrypted stream.



## type `TCPConnection`

An opaque connected TCP stream.



## type `TCPListener`

An opaque TCP listening socket.



## record `Endpoint`

A host name or numeric address paired with a validated port.

**Fields**

  - `host` : String
  - `port` : Net.Port

## module `Net.Socket.TCP.Endpoint`

## function `host`


```kex
host(name, port) : String -> Net.Port -> Endpoint
```


## function `any`


```kex
any(port) : Net.Port -> Endpoint
```


## function `loopback`


```kex
loopback(port) : Net.Port -> Endpoint
```


## function `connect`

Connects to a TCP endpoint with the backend's bounded connect deadline.


```kex
connect(endpoint) : Endpoint -> Result<TCPConnection, NetError>
```


## function `listen`

Binds and starts listening. Port zero selects an ephemeral local port.


```kex
listen(endpoint) : Endpoint -> Result<TCPListener, NetError>
```


## function `sendAll`

Sends every byte or reports the failure and transfer progress.


```kex
sendAll(connection, data)
```


## function `receiveChunk`

Receives one bounded chunk; EOF is reported as `Closed`.


```kex
receiveChunk(connection, limit)
```


## function `receiveExactly`

Receives exactly `count` bytes or returns a typed EOF/timeout failure.


```kex
receiveExactly(connection, count)
```


## function `receiveUntil`

Receives through the first `delimiter` without exceeding `limit` bytes.

The delimiter is included in the returned bytes. An empty delimiter is a `Parse` error; reaching the bound first is a `Limit` error.


```kex
receiveUntil(connection, delimiter, limit)
```


## function `receiveLine`

Receives through a newline without exceeding `limit` bytes.


```kex
receiveLine(connection, limit)
```


## function `shutdownWrite`

Half-closes the write side while leaving reads available.


```kex
shutdownWrite(connection)
```


## function `accept`

Waits for and returns the next connection.


```kex
accept(listener)
```


## function `close`

Idempotently closes a connected stream.


```kex
close(connection)
```


## function `closed?`


```kex
closed?(connection)
```


## function `localAddress`

Returns the bound local endpoint, including an ephemeral assigned port.


```kex
localAddress(connection)
```


## function `peerAddress`

Returns the remote endpoint of a connected stream.


```kex
peerAddress(connection)
```


## module `Net.Socket.UDP`

## type `Socket`

Connectionless datagrams. A receive limit rejects an oversized datagram instead of returning a silently truncated payload.

```kex
let socket = UDP.bind(UDP.Endpoint.loopback(Port.from(0).try)).try
let address = socket.localAddress.try
socket.sendTo(address, "hello".to(Binary).try).try
let packet = socket.receiveFrom(1024).try
socket.close
```

An opaque bound datagram socket.



## record `Endpoint`

A datagram address paired with a validated port.

**Fields**

  - `host` : String
  - `port` : Net.Port

## record `Datagram`

A received datagram and its source endpoint.

**Fields**

  - `source` : [Endpoint](#record-endpoint)
  - `data` : Binary

## module `Net.Socket.UDP.Endpoint`

## function `host`


```kex
host(name, port) : String -> Net.Port -> Endpoint
```


## function `any`


```kex
any(port) : Net.Port -> Endpoint
```


## function `loopback`


```kex
loopback(port) : Net.Port -> Endpoint
```


## function `bind`

Binds a datagram socket. Port zero selects an ephemeral local port.


```kex
bind(endpoint) : Endpoint -> Result<Socket, NetError>
```


## function `sendTo`

Sends one complete datagram and returns its byte count.


```kex
sendTo(socket, endpoint, data)
```


## function `receiveFrom`

Receives one datagram no larger than `limit` bytes.


```kex
receiveFrom(socket, limit)
```


## function `close`

Idempotently closes the socket.


```kex
close(socket)
```


## function `closed?`


```kex
closed?(socket)
```


## function `localAddress`

Returns the bound endpoint, including an ephemeral assigned port.


```kex
localAddress(socket)
```


## module `Net.Socket.Unix`

## type `UnixConnection`

Filesystem-domain streams for local IPC. The listener owns and removes only the socket path it successfully created.

```kex
let address = Unix.Address.path("/tmp/my-service.sock").try
let listener = Unix.listen(address).try
let client = Unix.connect(address).try
listener.close
```

An opaque connected filesystem-domain byte stream.



## type `UnixListener`

An opaque filesystem-domain stream listener.



## record `Address`

A validated absolute filesystem socket path.

**Fields**

  - `path` : String

## module `Net.Socket.Unix.Address`

## function `path`

Validates a nonempty absolute Unix-domain socket path.


```kex
path(value) : String -> Result<Address, NetError>
```


## function `connect`

Connects to a filesystem-domain listener.


```kex
connect(address) : Address -> Result<UnixConnection, NetError>
```


## function `listen`

Binds a new path; an existing filesystem entry is never removed implicitly.


```kex
listen(address) : Address -> Result<UnixListener, NetError>
```


## function `sendAll`

Sends every byte and returns the count.


```kex
sendAll(connection, data)
```


## function `receiveChunk`

Receives one bounded chunk; EOF is `Closed`.


```kex
receiveChunk(connection, limit)
```


## function `receiveExactly`

Receives exactly `count` bytes or returns a typed EOF/timeout failure.


```kex
receiveExactly(connection, count)
```


## function `receiveUntil`

Receives through `delimiter`, including it, within an explicit bound.


```kex
receiveUntil(connection, delimiter, limit)
```


## function `receiveLine`

Receives through a newline without exceeding `limit` bytes.


```kex
receiveLine(connection, limit)
```


## function `shutdownWrite`

Half-closes the write side while leaving reads available.


```kex
shutdownWrite(connection)
```


## function `accept`

Waits for and returns the next stream connection.


```kex
accept(listener)
```


## function `close`

Idempotently closes a stream.


```kex
close(connection)
```


## function `closed?`


```kex
closed?(connection)
```


## module `Net.Socket.TLS`

## type `TLSConnection`

TLS client streams. Certificate and hostname verification are enabled by default; disabling verification must be an explicit configuration choice.

```kex
let endpoint = TCP.Endpoint.host("example.test", Port.from(443).try)
let tls = TLS.connect(endpoint, TLS.ClientConfig {
  serverName: "example.test"
}).try
tls.close
```

An opaque verified or explicitly unverified TLS byte stream.



## record `ClientConfig`

Client handshake policy. TLS 1.2/1.3 are enabled; verification defaults on.

**Fields**

  - `serverName` : String
  - `verify?` : Bool (optional)
  - `alpn` : [String] (optional)

## function `connect`

Opens a direct TLS connection with a bounded handshake deadline.


```kex
connect(endpoint, config) : Net.Socket.TCP.Endpoint -> ClientConfig -> Result<TLSConnection, NetError>
```


## function `sendAll`

Sends every plaintext byte through the TLS stream.


```kex
sendAll(connection, data)
```


## function `receiveChunk`

Receives one decrypted chunk no larger than `limit`.


```kex
receiveChunk(connection, limit)
```


## function `close`

Idempotently closes the TLS stream.


```kex
close(connection)
```


## function `closed?`


```kex
closed?(connection)
```

