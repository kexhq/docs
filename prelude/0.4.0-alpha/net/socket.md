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

## module `Net.Socket.TCP`

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

## record `ConnectOptions`

Connection deadlines and operating-system socket policy.

Buffer values of zero leave sizing to the operating system. `noDelay?` disables Nagle's algorithm, which is usually right for request/response traffic; bulk-transfer protocols may prefer fewer, larger packets.

**Fields**

  - `connectTimeout` : Duration (optional)
  - `noDelay?` : Bool (optional)
  - `keepAlive?` : Bool (optional)
  - `sendBuffer` : Integer (optional)
  - `receiveBuffer` : Integer (optional)

## record `ListenOptions`

Listener queue and policy inherited by accepted connections.

`backlog` bounds connections waiting for `accept`. Buffer values of zero keep the platform defaults rather than requesting a particular byte size.

**Fields**

  - `backlog` : Integer (optional)
  - `reuseAddress?` : Bool (optional)
  - `noDelay?` : Bool (optional)
  - `keepAlive?` : Bool (optional)
  - `sendBuffer` : Integer (optional)
  - `receiveBuffer` : Integer (optional)

## module `Net.Socket.TCP.Endpoint`

## function `host`

Pairs a hostname or numeric address with a port.

Resolution happens when connecting, so this preserves `name` exactly as supplied rather than validating it as an `IP.Address`.


```kex
host(name, port) : String -> Net.Port -> Endpoint
```


## function `any`

Builds an IPv4 wildcard endpoint for listening on every local interface.

Be deliberate with this in development: unlike `loopback`, it may expose the service to other machines on the network.


```kex
any(port) : Net.Port -> Endpoint
```


## function `loopback`

Builds an IPv4 loopback endpoint reachable only from this machine.

Port zero lets the operating system choose a free port, which is useful for tests; ask `localAddress` which port was assigned after listening.


```kex
loopback(port) : Net.Port -> Endpoint
```


## function `connect`

Connects to a TCP endpoint with the backend's bounded connect deadline.


```kex
connect(endpoint) : Endpoint -> Result<TCPConnection, NetError>
connect(endpoint) : Endpoint -> ConnectOptions -> Result<TCPConnection, NetError>
```


## function `listen`

Binds and starts listening. Port zero selects an ephemeral local port.


```kex
listen(endpoint) : Endpoint -> Result<TCPListener, NetError>
listen(endpoint) : Endpoint -> ListenOptions -> Result<TCPListener, NetError>
```


## function `sendAll`

Sends every byte, retrying partial operating-system writes internally.

On failure, `NetError.progress` records how many bytes were accepted before the error. Do not blindly retry the whole payload when progress is present.


```kex
sendAll(connection, data)
```


## function `receiveChunk`

Receives up to `limit` bytes; EOF is reported as `Closed`.

A successful result is one available chunk, not necessarily a complete application message. Use `receiveExactly`, `receiveUntil`, or `receiveLine` when the protocol supplies a boundary.


```kex
receiveChunk(connection, limit)
```


## function `receiveExactly`

Receives exactly `count` bytes or returns a typed EOF/timeout failure.

Useful after a protocol header has declared the payload length.


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

The newline remains in the returned binary. Decode and trim only after a complete bounded line has been received.


```kex
receiveLine(connection, limit)
```


## function `shutdownWrite`

Half-closes the write side while leaving reads available.


```kex
shutdownWrite(connection)
```


## function `accept`

Waits for and returns the next connection accepted by the listener.

A timeout applies to this wait only; it does not become a read timeout on the returned connection.


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

Reply to `source` rather than the socket's local address: UDP has no connection that remembers which peer sent the packet.

**Fields**

  - `source` : [Endpoint](#record-endpoint)
  - `data` : Binary

## record `BindOptions`

Curated socket policy. Broadcast is opt-in. The receive timeout applies to each `receiveFrom` call; multicast TTL is bounded to the IP hop-limit range.

**Fields**

  - `broadcast?` : Bool (optional)
  - `multicastTtl` : Integer (optional)
  - `multicastLoopback?` : Bool (optional)
  - `receiveTimeout` : Duration (optional)

## module `Net.Socket.UDP.Endpoint`

## function `host`

Pairs a hostname or numeric address with a UDP port.


```kex
host(name, port) : String -> Net.Port -> Endpoint
```


## function `any`

Builds an IPv4 wildcard endpoint for receiving on every local interface.


```kex
any(port) : Net.Port -> Endpoint
```


## function `loopback`

Builds an IPv4 loopback endpoint reachable only from this machine.


```kex
loopback(port) : Net.Port -> Endpoint
```


## function `bind`

Binds a datagram socket. Port zero selects an ephemeral local port.


```kex
bind(endpoint) : Endpoint -> Result<Socket, NetError>
bind(endpoint) : Endpoint -> BindOptions -> Result<Socket, NetError>
```


## function `sendTo`

Sends one complete datagram and returns its byte count.

Datagram boundaries are preserved: one `sendTo` corresponds to one `receiveFrom`, unless the packet is lost by the network.


```kex
sendTo(socket, endpoint, data)
```


## function `receiveFrom`

Receives one datagram no larger than `limit` bytes.

Oversized packets fail with `Limit` instead of being silently truncated, so a caller never mistakes a prefix for a complete message.


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


## function `joinMulticast`

Joins an IPv4 multicast group on the selected local interface. The group must be multicast and the interface must be an IPv4 address.


```kex
joinMulticast(socket, group, interface)
```


## function `leaveMulticast`

Leaves a membership previously joined with the same group and interface.


```kex
leaveMulticast(socket, group, interface)
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

## record `ConnectOptions`

Connection and read deadlines for a local IPC client.

**Fields**

  - `connectTimeout` : Duration (optional)
  - `receiveTimeout` : Duration (optional)

## record `ListenOptions`

Listener queue, stale-socket policy, and per-operation deadlines.

`removeStale?` removes only a filesystem socket, never a regular file or directory that happens to occupy the requested path.

**Fields**

  - `backlog` : Integer (optional)
  - `removeStale?` : Bool (optional)
  - `acceptTimeout` : Duration (optional)
  - `receiveTimeout` : Duration (optional)

## module `Net.Socket.Unix.Address`

## function `path`

Validates a nonempty absolute Unix-domain socket path.

Relative paths are rejected so ownership and cleanup always refer to one unambiguous filesystem entry.


```kex
path(value) : String -> Result<Address, NetError>
```


## function `connect`

Connects to a filesystem-domain listener.

Unix sockets avoid opening a network port and are a good fit for two processes on the same machine, such as a CLI and its background daemon.


```kex
connect(address) : Address -> Result<UnixConnection, NetError>
connect(address) : Address -> ConnectOptions -> Result<UnixConnection, NetError>
```


## function `listen`

Binds a new path; an existing filesystem entry is never removed implicitly.

This conservative default protects regular files and also avoids taking over a socket that may still belong to a running service.


```kex
listen(address) : Address -> Result<UnixListener, NetError>
listen(address) : Address -> ListenOptions -> Result<UnixListener, NetError>
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

`serverName` drives both certificate hostname verification and SNI. Pass the DNS name from the URL, not an address it happened to resolve to.


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

