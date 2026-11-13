---
package: prelude
version: "0.4.0-beta.4-dev"
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

_Connecting to a line-oriented local service_

```kex
let endpoint = TCP.Endpoint.host("127.0.0.1", Port.from(9000).try)
let connection = TCP.connect(endpoint).try
```

### `listen`

```kex
listen(endpoint: Endpoint) -> Result<TCPListener, NetError>
listen(endpoint: Endpoint, options: ListenOptions) -> Result<TCPListener, NetError>
```

Binds and starts listening. Port zero selects an ephemeral local port.

**Returns**: a listener or `Connect`

**Examples**

_Giving each integration test its own free port_

```kex
let listener = TCP.listen(TCP.Endpoint.loopback(Port.from(0).try)).try
let port = listener.localAddress.try.port
```

### `sendAll`

```kex
sendAll(connection: TCPConnection, data: Binary) -> Result<Integer, NetError>
```

Sends every byte, retrying partial operating-system writes internally.

On failure, `NetError.progress` records how many bytes were accepted before the error. Do not blindly retry the whole payload when progress is present.

**Examples**

_Sending one newline-delimited request_

```kex
connection.sendAll("status\n".to(Binary).try).try
```

### `receiveChunk`

```kex
receiveChunk(connection: TCPConnection, limit: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives up to `limit` bytes; EOF is reported as `Closed`.

A successful result is one available chunk, not necessarily a complete application message. Use `receiveExactly`, `receiveUntil`, or `receiveLine` when the protocol supplies a boundary.

**Examples**

_Reading up to 16 KiB from a streaming response_

```kex
let chunk = connection.receiveChunk(16 * 1024).try
```

### `receiveExactly`

```kex
receiveExactly(connection: TCPConnection, count: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives exactly `count` bytes or returns a typed EOF/timeout failure.

Useful after a protocol header has declared the payload length.

**Examples**

_Reading a four-byte frame header_

```kex
let header = connection.receiveExactly(4).try
```

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

The newline remains in the returned binary. Decode and trim only after a complete bounded line has been received.

**Examples**

_Reading a response line with a defensive 8 KiB limit_

```kex
let line = connection.receiveLine(8192).try.to(String).try.trim
```

### `shutdownWrite`

```kex
shutdownWrite(connection: TCPConnection) -> Result<Void, NetError>
```

Half-closes the write side while leaving reads available.

### `accept`

```kex
accept(listener: TCPListener, timeout: Duration) -> Result<TCPConnection, NetError>
```

Waits for and returns the next connection accepted by the listener.

A timeout applies to this wait only; it does not become a read timeout on the returned connection.

**Examples**

_Accepting one client in a small test server_

```kex
let client = listener.accept(5.seconds).try
```

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

**Examples**

_Recording the peer in an access log_

```kex
let peer = connection.peerAddress.try
IO.printLine("accepted ${peer.host}:${peer.port.string}")
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

  - `host` : [String](../string.md#make-string)
  - `port` : Net.Port



## record `ConnectOptions`

Connection deadlines and operating-system socket policy.

Buffer values of zero leave sizing to the operating system. `noDelay?` disables Nagle's algorithm, which is usually right for request/response traffic; bulk-transfer protocols may prefer fewer, larger packets.

**Fields**

  - `connectTimeout` : [Duration](../units.md#record-duration) (optional)
  - `noDelay?` : [Bool](../truthyable.md#make-bool) (optional)
  - `keepAlive?` : [Bool](../truthyable.md#make-bool) (optional)
  - `sendBuffer` : [Integer](../number.md#make-integer) (optional)
  - `receiveBuffer` : [Integer](../number.md#make-integer) (optional)



## record `ListenOptions`

Listener queue and policy inherited by accepted connections.

`backlog` bounds connections waiting for `accept`. Buffer values of zero keep the platform defaults rather than requesting a particular byte size.

**Fields**

  - `backlog` : [Integer](../number.md#make-integer) (optional)
  - `reuseAddress?` : [Bool](../truthyable.md#make-bool) (optional)
  - `noDelay?` : [Bool](../truthyable.md#make-bool) (optional)
  - `keepAlive?` : [Bool](../truthyable.md#make-bool) (optional)
  - `sendBuffer` : [Integer](../number.md#make-integer) (optional)
  - `receiveBuffer` : [Integer](../number.md#make-integer) (optional)



## module `Net.Socket.TCP.Endpoint`

### `host`

```kex
host(name: String, port: Net.Port) -> Endpoint
```

Pairs a hostname or numeric address with a port.

Resolution happens when connecting, so this preserves `name` exactly as supplied rather than validating it as an `IP.Address`.

**Returns**: the remote or listening endpoint

**Examples**

_Connecting by hostname_

```kex
TCP.Endpoint.host("cache.internal", Port.from(6379).try)
```

### `any`

```kex
any(port: Net.Port) -> Endpoint
```

Builds an IPv4 wildcard endpoint for listening on every local interface.

Be deliberate with this in development: unlike `loopback`, it may expose the service to other machines on the network.

**Returns**: an IPv4 wildcard listening endpoint

**Examples**

_Exposing a production service on port 8080_

```kex
TCP.Endpoint.any(Port.from(8080).try)
```

### `loopback`

```kex
loopback(port: Net.Port) -> Endpoint
```

Builds an IPv4 loopback endpoint reachable only from this machine.

Port zero lets the operating system choose a free port, which is useful for tests; ask `localAddress` which port was assigned after listening.

**Returns**: an IPv4 loopback endpoint

**Examples**

_Starting an isolated test listener_

```kex
TCP.Endpoint.loopback(Port.from(0).try)
```

## module `Net.Socket.UDP`

### `bind`

```kex
bind(endpoint: Endpoint) -> Result<Socket, NetError>
bind(endpoint: Endpoint, options: BindOptions) -> Result<Socket, NetError>
```

Binds a datagram socket. Port zero selects an ephemeral local port.

**Examples**

_A local UDP echo test_

```kex
let socket = UDP.bind(UDP.Endpoint.loopback(Port.from(0).try)).try
let endpoint = socket.localAddress.try
```

### `sendTo`

```kex
sendTo(socket: Socket, endpoint: Endpoint, data: Binary) -> Result<Integer, NetError>
```

Sends one complete datagram and returns its byte count.

Datagram boundaries are preserved: one `sendTo` corresponds to one `receiveFrom`, unless the packet is lost by the network.

**Examples**

_Sending a StatsD-style counter_

```kex
socket.sendTo(collector, "orders:1|c".to(Binary).try).try
```

### `receiveFrom`

```kex
receiveFrom(socket: Socket, limit: Integer) -> Result<Datagram, NetError>
```

Receives one datagram no larger than `limit` bytes.

Oversized packets fail with `Limit` instead of being silently truncated, so a caller never mistakes a prefix for a complete message.

**Examples**

_Receiving and replying to one packet_

```kex
let packet = socket.receiveFrom(4096).try
socket.sendTo(packet.source, packet.data).try
```

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

Reply to `source` rather than the socket's local address: UDP has no connection that remembers which peer sent the packet.

**Fields**

  - `source` : Endpoint
  - `data` : [Binary](../binary.md#type-binary)



## record `BindOptions`

Curated socket policy. Broadcast is opt-in. The receive timeout applies to each `receiveFrom` call; multicast TTL is bounded to the IP hop-limit range.

**Fields**

  - `broadcast?` : [Bool](../truthyable.md#make-bool) (optional)
  - `multicastTtl` : [Integer](../number.md#make-integer) (optional)
  - `multicastLoopback?` : [Bool](../truthyable.md#make-bool) (optional)
  - `receiveTimeout` : [Duration](../units.md#record-duration) (optional)



## module `Net.Socket.UDP.Endpoint`

### `host`

```kex
host(name: String, port: Net.Port) -> Endpoint
```

Pairs a hostname or numeric address with a UDP port.

**Returns**: an endpoint using `name` exactly as supplied

**Examples**

_Addressing a local metrics collector_

```kex
UDP.Endpoint.host("metrics.internal", Port.from(8125).try)
```

### `any`

```kex
any(port: Net.Port) -> Endpoint
```

Builds an IPv4 wildcard endpoint for receiving on every local interface.

**Returns**: an IPv4 wildcard endpoint

**Examples**

_Receiving discovery packets on port 9999_

```kex
UDP.Endpoint.any(Port.from(9999).try)
```

### `loopback`

```kex
loopback(port: Net.Port) -> Endpoint
```

Builds an IPv4 loopback endpoint reachable only from this machine.

**Returns**: an IPv4 loopback endpoint

**Examples**

_Allocating a free UDP port for a test_

```kex
UDP.Endpoint.loopback(Port.from(0).try)
```

## module `Net.Socket.Unix`

### `connect`

```kex
connect(address: Address) -> Result<UnixConnection, NetError>
connect(address: Address, options: ConnectOptions) -> Result<UnixConnection, NetError>
```

Connects to a filesystem-domain listener.

Unix sockets avoid opening a network port and are a good fit for two processes on the same machine, such as a CLI and its background daemon.

**Examples**

```kex
let daemon = Unix.connect(Unix.Address.path("/tmp/my-app.sock").try).try
```

### `listen`

```kex
listen(address: Address) -> Result<UnixListener, NetError>
listen(address: Address, options: ListenOptions) -> Result<UnixListener, NetError>
```

Binds a new path; an existing filesystem entry is never removed implicitly.

This conservative default protects regular files and also avoids taking over a socket that may still belong to a running service.

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

Connection and read deadlines for a local IPC client.

**Fields**

  - `connectTimeout` : [Duration](../units.md#record-duration) (optional)
  - `receiveTimeout` : [Duration](../units.md#record-duration) (optional)



## record `ListenOptions`

Listener queue, stale-socket policy, and per-operation deadlines.

`removeStale?` removes only a filesystem socket, never a regular file or directory that happens to occupy the requested path.

**Fields**

  - `backlog` : [Integer](../number.md#make-integer) (optional)
  - `removeStale?` : [Bool](../truthyable.md#make-bool) (optional)
  - `acceptTimeout` : [Duration](../units.md#record-duration) (optional)
  - `receiveTimeout` : [Duration](../units.md#record-duration) (optional)



## module `Net.Socket.Unix.Address`

### `path`

```kex
path(value: String) -> Result<Address, NetError>
```

Validates a nonempty absolute Unix-domain socket path.

Relative paths are rejected so ownership and cleanup always refer to one unambiguous filesystem entry.

**Returns**: the address, or `Parse`

**Examples**

_Addressing a per-user background service_

```kex
Unix.Address.path("/tmp/my-app.sock").try
```

## module `Net.Socket.TLS`

### `connect`

```kex
connect(endpoint: Net.Socket.TCP.Endpoint, config: ClientConfig) -> Result<TLSConnection, NetError>
```

Opens a direct TLS connection with a bounded handshake deadline.

`serverName` drives both certificate hostname verification and SNI. Pass the DNS name from the URL, not an address it happened to resolve to.

**Returns**: a TLS stream or typed failure

**Examples**

_Opening a verified connection to an HTTPS origin_

```kex
let endpoint = TCP.Endpoint.host("example.com", Port.from(443).try)
let connection = TLS.connect(endpoint, TLS.ClientConfig {
  serverName: "example.com",
  alpn: ["http/1.1"]
}).try
```

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
  - `verify?` : [Bool](../truthyable.md#make-bool) (optional)
  - `alpn` : [[String](../string.md#make-string)] (optional)


