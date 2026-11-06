---
package: prelude
version: "0.4.0-alpha.2"
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

### `connect`

```kex
connect(endpoint: Endpoint) -> Result<TCPConnection, NetError>
connect(endpoint: Endpoint, options: ConnectOptions) -> Result<TCPConnection, NetError>
```

Connects to a TCP endpoint with the backend's bounded connect deadline.

**Returns**: a stream or `Connect`/`Timeout`

**Examples**

_+TCP.connect(TCP.Endpoint.host("example.test", Port.from(80).try))+._

```kex

```

### `listen`

```kex
listen(endpoint: Endpoint) -> Result<TCPListener, NetError>
listen(endpoint: Endpoint, options: ListenOptions) -> Result<TCPListener, NetError>
```

Binds and starts listening. Port zero selects an ephemeral local port.

**Returns**: a listener or `Connect`

**Examples**

_+TCP.listen(TCP.Endpoint.loopback(Port.from(0).try))+._

```kex

```

### `sendAll`

```kex
sendAll(connection: TCPConnection, data: Binary) -> Result<Integer, NetError>
```

Sends every byte or reports the failure and transfer progress.

### `receiveChunk`

```kex
receiveChunk(connection: TCPConnection, limit: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives one bounded chunk; EOF is reported as `Closed`.

### `receiveExactly`

```kex
receiveExactly(connection: TCPConnection, count: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives exactly `count` bytes or returns a typed EOF/timeout failure.

### `receiveUntil`

```kex
receiveUntil(connection: TCPConnection, delimiter: Binary, limit: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives through the first `delimiter` without exceeding `limit` bytes.

The delimiter is included in the returned bytes. An empty delimiter is a `Parse` error; reaching the bound first is a `Limit` error.

**Examples**

_+connection.receiveUntil("\r\n\r\n".to(Binary).try, 65536).try+_

```kex

```

### `receiveLine`

```kex
receiveLine(connection: TCPConnection, limit: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives through a newline without exceeding `limit` bytes.

### `shutdownWrite`

```kex
shutdownWrite(connection: TCPConnection) -> Result<Void, NetError>
```

Half-closes the write side while leaving reads available.

### `accept`

```kex
accept(listener: TCPListener, timeout: Duration) -> Result<TCPConnection, NetError>
```

Waits for and returns the next connection.

### `close`

```kex
close(connection: TCPConnection) -> Void
```

Idempotently closes a connected stream.

### `closed?`

```kex
closed?(connection: TCPConnection) -> Bool
```

**Returns**: whether the listener owner has stopped

### `localAddress`

```kex
localAddress(connection: TCPConnection) -> Result<Endpoint, NetError>
```

Returns the bound local endpoint, including an ephemeral assigned port.

### `peerAddress`

```kex
peerAddress(connection: TCPConnection) -> Result<Endpoint, NetError>
```

Returns the remote endpoint of a connected stream.

## type `Plain`

Marker for an unencrypted stream.



## type `TCPConnection`

An opaque connected TCP stream.



## type `TCPListener`

An opaque TCP listening socket.



## record `Endpoint`

A host name or numeric address paired with a validated port.

**Fields**

  - `host` : [String](../string.md#make-string)
  - `port` : Net.Port



## record `ConnectOptions`

**Fields**

  - `connectTimeout` : [Duration](../units.md#record-duration) (optional)
  - `noDelay?` : [Bool](../blankable.md#make-bool) (optional)
  - `keepAlive?` : [Bool](../blankable.md#make-bool) (optional)
  - `sendBuffer` : [Integer](../number.md#make-integer) (optional)
  - `receiveBuffer` : [Integer](../number.md#make-integer) (optional)



## record `ListenOptions`

**Fields**

  - `backlog` : [Integer](../number.md#make-integer) (optional)
  - `reuseAddress?` : [Bool](../blankable.md#make-bool) (optional)
  - `noDelay?` : [Bool](../blankable.md#make-bool) (optional)
  - `keepAlive?` : [Bool](../blankable.md#make-bool) (optional)
  - `sendBuffer` : [Integer](../number.md#make-integer) (optional)
  - `receiveBuffer` : [Integer](../number.md#make-integer) (optional)



## module `Net.Socket.TCP.Endpoint`

### `host`

```kex
host(name: String, port: Net.Port) -> Endpoint
```

### `any`

```kex
any(port: Net.Port) -> Endpoint
```

### `loopback`

```kex
loopback(port: Net.Port) -> Endpoint
```

## module `Net.Socket.UDP`

### `bind`

```kex
bind(endpoint: Endpoint) -> Result<Socket, NetError>
bind(endpoint: Endpoint, options: BindOptions) -> Result<Socket, NetError>
```

Binds a datagram socket. Port zero selects an ephemeral local port.

### `sendTo`

```kex
sendTo(socket: Socket, endpoint: Endpoint, data: Binary) -> Result<Integer, NetError>
```

Sends one complete datagram and returns its byte count.

### `receiveFrom`

```kex
receiveFrom(socket: Socket, limit: Integer) -> Result<Datagram, NetError>
```

Receives one datagram no larger than `limit` bytes.

### `close`

```kex
close(socket: Socket) -> Void
```

Idempotently closes the socket.

### `closed?`

```kex
closed?(socket: Socket) -> Bool
```

**Returns**: whether the socket owner has stopped

### `localAddress`

```kex
localAddress(socket: Socket) -> Result<Endpoint, NetError>
```

Returns the bound endpoint, including an ephemeral assigned port.

### `joinMulticast`

```kex
joinMulticast(socket: Socket, group: Net.IP.Address, interface: Net.IP.Address) -> Result<Void, NetError>
```

Joins an IPv4 multicast group on the selected local interface. The group must be multicast and the interface must be an IPv4 address.

### `leaveMulticast`

```kex
leaveMulticast(socket: Socket, group: Net.IP.Address, interface: Net.IP.Address) -> Result<Void, NetError>
```

Leaves a membership previously joined with the same group and interface.

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

  - `host` : [String](../string.md#make-string)
  - `port` : Net.Port



## record `Datagram`

A received datagram and its source endpoint.

**Fields**

  - `source` : Endpoint
  - `data` : [Binary](../binary.md#type-binary)



## record `BindOptions`

Curated socket policy. Broadcast is opt-in. The receive timeout applies to each `receiveFrom` call; multicast TTL is bounded to the IP hop-limit range.

**Fields**

  - `broadcast?` : [Bool](../blankable.md#make-bool) (optional)
  - `multicastTtl` : [Integer](../number.md#make-integer) (optional)
  - `multicastLoopback?` : [Bool](../blankable.md#make-bool) (optional)
  - `receiveTimeout` : [Duration](../units.md#record-duration) (optional)



## module `Net.Socket.UDP.Endpoint`

### `host`

```kex
host(name: String, port: Net.Port) -> Endpoint
```

### `any`

```kex
any(port: Net.Port) -> Endpoint
```

### `loopback`

```kex
loopback(port: Net.Port) -> Endpoint
```

## module `Net.Socket.Unix`

### `connect`

```kex
connect(address: Address) -> Result<UnixConnection, NetError>
connect(address: Address, options: ConnectOptions) -> Result<UnixConnection, NetError>
```

Connects to a filesystem-domain listener.

### `listen`

```kex
listen(address: Address) -> Result<UnixListener, NetError>
listen(address: Address, options: ListenOptions) -> Result<UnixListener, NetError>
```

Binds a new path; an existing filesystem entry is never removed implicitly.

### `sendAll`

```kex
sendAll(connection: UnixConnection, data: Binary) -> Result<Integer, NetError>
```

Sends every byte and returns the count.

### `receiveChunk`

```kex
receiveChunk(connection: UnixConnection, limit: Integer) -> Result<Binary, NetError>
```

Receives one bounded chunk; EOF is `Closed`.

### `receiveExactly`

```kex
receiveExactly(connection: UnixConnection, count: Integer) -> Result<Binary, NetError>
```

Receives exactly `count` bytes or returns a typed EOF/timeout failure.

### `receiveUntil`

```kex
receiveUntil(connection: UnixConnection, delimiter: Binary, limit: Integer) -> Result<Binary, NetError>
```

Receives through `delimiter`, including it, within an explicit bound.

**Examples**

_+connection.receiveUntil("\n".to(Binary).try, 4096).try+_

```kex

```

### `receiveLine`

```kex
receiveLine(connection: UnixConnection, limit: Integer) -> Result<Binary, NetError>
```

Receives through a newline without exceeding `limit` bytes.

### `shutdownWrite`

```kex
shutdownWrite(connection: UnixConnection) -> Result<Void, NetError>
```

Half-closes the write side while leaving reads available.

### `accept`

```kex
accept(listener: UnixListener) -> Result<UnixConnection, NetError>
```

Waits for and returns the next stream connection.

### `close`

```kex
close(connection: UnixConnection) -> Void
```

Idempotently closes a stream.

### `closed?`

```kex
closed?(connection: UnixConnection) -> Bool
```

**Returns**: whether the listener owner has stopped

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

  - `path` : [String](../string.md#make-string)

### Defined in other modules

  - [Net.IP](../net/ip.md#make-address): [`string`](../net/ip.md#address-string), [`version`](../net/ip.md#address-version), [`loopback?`](../net/ip.md#address-loopback?), [`private?`](../net/ip.md#address-private?), [`unspecified?`](../net/ip.md#address-unspecified?), [`multicast?`](../net/ip.md#address-multicast?)

## record `ConnectOptions`

**Fields**

  - `connectTimeout` : [Duration](../units.md#record-duration) (optional)
  - `receiveTimeout` : [Duration](../units.md#record-duration) (optional)



## record `ListenOptions`

**Fields**

  - `backlog` : [Integer](../number.md#make-integer) (optional)
  - `removeStale?` : [Bool](../blankable.md#make-bool) (optional)
  - `acceptTimeout` : [Duration](../units.md#record-duration) (optional)
  - `receiveTimeout` : [Duration](../units.md#record-duration) (optional)



## module `Net.Socket.Unix.Address`

### `path`

```kex
path(value: String) -> Result<Address, NetError>
```

Validates a nonempty absolute Unix-domain socket path.

**Returns**: the address, or `Parse`

## module `Net.Socket.TLS`

### `connect`

```kex
connect(endpoint: Net.Socket.TCP.Endpoint, config: ClientConfig) -> Result<TLSConnection, NetError>
```

Opens a direct TLS connection with a bounded handshake deadline.

**Returns**: a TLS stream or typed failure

### `sendAll`

```kex
sendAll(connection: TLSConnection, data: Binary) -> Result<Integer, NetError>
```

Sends every plaintext byte through the TLS stream.

### `receiveChunk`

```kex
receiveChunk(connection: TLSConnection, limit: Integer) -> Result<Binary, NetError>
```

Receives one decrypted chunk no larger than `limit`.

### `close`

```kex
close(connection: TLSConnection) -> Void
```

Idempotently closes the TLS stream.

### `closed?`

```kex
closed?(connection: TLSConnection) -> Bool
```

**Returns**: whether the TLS connection owner has stopped

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

  - `serverName` : [String](../string.md#make-string)
  - `verify?` : [Bool](../blankable.md#make-bool) (optional)
  - `alpn` : [[String](../string.md#make-string)] (optional)


