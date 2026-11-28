---
package: prelude
version: "0.4.0-rc.4-dev"
source: net/socket.kex
title: Net.Socket
entities:
  - { kind: module, name: "Net.Socket" }
---

# Net.Socket

## module `Net.Socket`

TCP, UDP and Unix-domain sockets, and TLS client connections.

Every socket is owned by a process of its own. Functions that can fail return a `NetError`, and closing a socket twice is harmless. Without a timeout argument, accepting and receiving give up after 30 seconds with a `Timeout` error.

Sockets work on BEAM only. On the tree-walking interpreter every operation returns an `UnsupportedBackend` error unless the capability is replaced with a mock such as `Mock.TCP`.

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

### `connect` (foul)

```kex
connect(endpoint: Endpoint) -> Result<TCPConnection, NetError>
connect(endpoint: Endpoint, options: ConnectOptions) -> Result<TCPConnection, NetError>
```

Connects to a TCP endpoint.

Without options, the connect timeout is 10 seconds; `ConnectOptions` sets it and the socket settings.

**Returns**: the connection, or a `Connect` or `Timeout` error

**Examples**

_Connecting to a line-oriented local service_

```kex
let endpoint = TCP.Endpoint.host("127.0.0.1", Port.from(9000).try)
let connection = TCP.connect(endpoint).try
```

### `connectTo` (foul)

```kex
connectTo(address: String) -> Result<TCPConnection, NetError>
connectTo(address: String, block: (TCPConnection -> A)) -> Result<A, NetError>
```

Connects to a `"host:port"` address with the default options.

It has its own name, not a `connect` overload, because of kexhq/kex#619: mixing overloads by arity and by type breaks call resolution.

**Examples**

_Talking to a local echo server_

```kex
let connection = TCP.connectTo("127.0.0.1:12321").try
```

### `listen` (foul)

```kex
listen(endpoint: Endpoint) -> Result<TCPListener, NetError>
listen(endpoint: Endpoint, options: ListenOptions) -> Result<TCPListener, NetError>
```

Starts listening on an endpoint, which must have a numeric address.

With port 0 the operating system picks a free port.

**Returns**: the listener, or a `Connect` error

**Examples**

_Giving each integration test its own free port_

```kex
let listener = TCP.listen(TCP.Endpoint.loopback(Port.from(0).try)).try
let port = listener.localAddress.try.port
```

### `bind` (foul)

```kex
bind(address: String) -> Result<TCPListener, NetError>
bind(address: String, block: (TCPListener -> A)) -> Result<A, NetError>
```

Starts listening on a `"host:port"` address.

**Examples**

_The socket for an echo server_

```kex
let listener = TCP.bind("127.0.0.1:12321").try
```

### `sendAll` (foul)

```kex
sendAll(connection: TCPConnection, data: Binary) -> Result<Integer, NetError>
```

Sends all of `data` and returns the number of bytes sent.

On failure, `NetError.progress` says how many bytes were sent before the error, so retrying the whole payload could send part of it twice.

**Examples**

_Sending one newline-delimited request_

```kex
connection.sendAll("status\n".to(Binary).try).try
```

### `put` (foul)

```kex
put(connection: TCPConnection, content: Binary) -> Result<Void, NetError>
```

Sends `content` as it is, with nothing added.

**Examples**

_Echoing a received chunk verbatim_

```kex
connection.put(chunk).try
```

### `write` (foul)

```kex
write(connection: TCPConnection, content: Showable) -> Result<Void, NetError>
```

Sends `content` as text, without a newline.

**Examples**

_Sending a prompt without a newline_

```kex
connection.write("name? ").try
```

### `writeLine` (foul)

```kex
writeLine(connection: TCPConnection, content: Showable) -> Result<Void, NetError>
```

Sends `content` as text, followed by a newline.

**Examples**

_Answering a line-oriented peer_

```kex
connection.writeLine("hello").try
```

### `print` (foul)

```kex
print(connection: TCPConnection, content: Showable) -> Void
```

Sends `content` as text, without a newline, and ignores a failure. Use `write` to find out about one.

**Examples**

_Sending a prompt without a newline_

```kex
connection.print("name? ")
```

### `printLine` (foul)

```kex
printLine(connection: TCPConnection, content: Showable) -> Void
```

Sends `content` as text, followed by a newline, and ignores a failure. Use `writeLine` to find out about one.

**Examples**

_Answering a line-oriented peer_

```kex
connection.printLine("hello")
```

### `readLine` (foul)

```kex
readLine(connection: TCPConnection) -> Result<String?, NetError>
```

Reads the next line as text, without its line ending.

Returns `Ok(None)` at the end of the input, as `FileHandle.readLine` does. A line longer than 64 KiB is a `Limit` error, and one that is not valid UTF-8 is a `Parse` error.

**Examples**

_Echoing one line back to its sender_

```kex
match connection.readLine.try do
  Just(line) => connection.printLine(line)
  None => connection.close
end
```

### `getLine` (foul)

```kex
getLine(connection: TCPConnection) -> String?
```

Reads the next line as text, without its line ending, or returns `None` at the end of the input or on any failure.

Use `readLine` to tell the end of the input from an error.

**Examples**

_Printing one received line_

```kex
IO.printLine(connection.getLine.or("(closed)"))
```

### `receiveChunk` (foul)

```kex
receiveChunk(connection: TCPConnection, limit: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives whatever bytes are available, at most `limit` of them.

The chunk need not be a whole message. When the protocol marks where a message ends, use `receiveExactly`, `receiveUntil` or `receiveLine`. The end of the stream is a `Closed` error.

**Examples**

_Reading up to 16 KiB from a streaming response_

```kex
let chunk = connection.receiveChunk(16 * 1024).try
```

### `receiveExactly` (foul)

```kex
receiveExactly(connection: TCPConnection, count: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives exactly `count` bytes.

Use it once a header has said how long the payload is. The stream ending first is a `Closed` error, and running out of time a `Timeout` error.

**Examples**

_Reading a four-byte frame header_

```kex
let header = connection.receiveExactly(4).try
```

### `receiveUntil` (foul)

```kex
receiveUntil(connection: TCPConnection, delimiter: Binary, limit: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives bytes up to and including the first `delimiter`, reading at most `limit` bytes.

An empty delimiter is a `Parse` error, and reaching `limit` first is a `Limit` error.

**Examples**

_Reading to the end of an HTTP header section_

```kex
connection.receiveUntil("\r\n\r\n".to(Binary).try, 65536).try
```

### `receiveLine` (foul)

```kex
receiveLine(connection: TCPConnection, limit: Integer, timeout: Duration) -> Result<Binary, NetError>
```

Receives bytes up to and including a newline, reading at most `limit` bytes.

The newline is kept. `readLine` returns the line as text instead.

**Examples**

_Reading a response line of at most 8 KiB_

```kex
let line = connection.receiveLine(8192).try.to(String).try.trim
```

### `shutdownWrite` (foul)

```kex
shutdownWrite(connection: TCPConnection) -> Result<Void, NetError>
```

Closes the sending side of the connection, so the peer sees the end of the stream, while receiving still works.

### `accept` (foul)

```kex
accept(listener: TCPListener, timeout: Duration) -> Result<TCPConnection, NetError>
```

Waits for the next incoming connection and returns it.

The timeout covers only this wait. It does not carry over to reads on the connection.

**Examples**

_Accepting one client in a small test server_

```kex
let client = listener.accept(5.second).try
```

### `closed?` (foul)

```kex
closed?(connection: TCPConnection) -> Bool
```

Returns `true` once the connection is closed.

**Returns**: `true` when the connection's owner process has stopped

### `localAddress` (foul)

```kex
localAddress(connection: TCPConnection) -> Result<Endpoint, NetError>
```

Returns the local endpoint, including a port the operating system picked.

### `peerAddress` (foul)

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

Marks a stream as unencrypted.



## type `TCPConnection`

A connected TCP stream.



## type `TCPListener`

A TCP socket listening for connections.



## record `Endpoint`

A host name or numeric address, and a port.

**Fields**

  - `host` : [String](../string.md#make-string)
  - `port` : Net.Port



## record `ConnectOptions`

Options for `TCP.connect`: the connect timeout and socket settings.

A buffer size of 0 leaves the size to the operating system. `noDelay?` turns off Nagle's algorithm, which suits request and response traffic; bulk transfers may do better with it on, sending fewer, larger packets.

**Fields**

  - `connectTimeout` : Duration (optional)
  - `noDelay?` : [Bool](../truthyable.md#make-bool) (optional)
  - `keepAlive?` : [Bool](../truthyable.md#make-bool) (optional)
  - `sendBuffer` : [Integer](../number.md#make-integer) (optional)
  - `receiveBuffer` : [Integer](../number.md#make-integer) (optional)



## record `ListenOptions`

Options for `TCP.listen`: the size of the queue of waiting connections, and socket settings that accepted connections inherit.

`backlog` limits how many connections can wait for `accept`. A buffer size of 0 keeps the operating system's default.

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

Builds an endpoint from a host name or numeric address and a port.

The name is kept as given and looked up only when connecting. To listen, give a numeric address.

**Returns**: the endpoint

**Examples**

_Connecting by hostname_

```kex
TCP.Endpoint.host("cache.internal", Port.from(6379).try)
```

### `any`

```kex
any(port: Net.Port) -> Endpoint
```

Builds an endpoint for listening on every local IPv4 interface (`0.0.0.0`).

Unlike `loopback`, it can make the service reachable from other machines on the network.

**Returns**: the IPv4 wildcard endpoint

**Examples**

_Serving on port 8080_

```kex
TCP.Endpoint.any(Port.from(8080).try)
```

### `loopback`

```kex
loopback(port: Net.Port) -> Endpoint
```

Builds an endpoint on the IPv4 loopback address, `127.0.0.1`, which only this machine can reach.

With port 0 the operating system picks a free port, which suits tests; `localAddress` tells you which one it picked.

**Returns**: the loopback endpoint

**Examples**

_Starting an isolated test listener_

```kex
TCP.Endpoint.loopback(Port.from(0).try)
```

### `parse` (foul)

```kex
parse(address: String) -> Result<Endpoint, NetError>
```

Parses a `"host:port"` address into an endpoint.

Only the port is checked here. An unknown host is reported when it is used, as a `Resolve` error. The port is whatever follows the last colon, so an IPv6 address is written without brackets.

**Returns**: the endpoint, or a `Parse` error

**Examples**

_Connecting without a Port value in hand_

```kex
TCP.connect(TCP.Endpoint.parse("127.0.0.1:9000").try).try
```

## module `Net.Socket.UDP`

### `bind` (foul)

```kex
bind(endpoint: Endpoint) -> Result<Socket, NetError>
bind(endpoint: Endpoint, options: BindOptions) -> Result<Socket, NetError>
```

Opens a datagram socket bound to an endpoint.

With port 0 the operating system picks a free port. Without options, each `receiveFrom` waits up to 30 seconds.

**Examples**

_A local UDP echo test_

```kex
let socket = UDP.bind(UDP.Endpoint.loopback(Port.from(0).try)).try
let endpoint = socket.localAddress.try
```

### `bindTo` (foul)

```kex
bindTo(address: String) -> Result<Socket, NetError>
bindTo(address: String, block: (Socket -> A)) -> Result<A, NetError>
```

Opens a datagram socket bound to a `"host:port"` address.

It has its own name, not a `bind` overload, because of kexhq/kex#619: mixing overloads by arity and by type breaks call resolution.

**Examples**

_Receiving on an ephemeral port_

```kex
let socket = UDP.bindTo("127.0.0.1:0").try
```

### `sendTo` (foul)

```kex
sendTo(socket: Socket, endpoint: Endpoint, data: Binary) -> Result<Integer, NetError>
```

Sends `data` as one datagram and returns the number of bytes sent.

The receiver gets it as one datagram from one `receiveFrom`, if the network delivers it at all.

**Examples**

_Sending a StatsD-style counter_

```kex
socket.sendTo(collector, "orders:1|c".to(Binary).try).try
```

### `receiveFrom` (foul)

```kex
receiveFrom(socket: Socket, limit: Integer) -> Result<Datagram, NetError>
```

Receives one datagram of at most `limit` bytes.

A larger datagram is a `Limit` error; it is never cut short.

**Examples**

_Receiving and replying to one packet_

```kex
let packet = socket.receiveFrom(4096).try
socket.sendTo(packet.source, packet.data).try
```

### `closed?` (foul)

```kex
closed?(socket: Socket) -> Bool
```

Returns `true` once the socket is closed.

**Returns**: `true` when the socket's owner process has stopped

### `localAddress` (foul)

```kex
localAddress(socket: Socket) -> Result<Endpoint, NetError>
```

Returns the local endpoint, including a port the operating system picked.

### `joinMulticast` (foul)

```kex
joinMulticast(socket: Socket, group: Net.IP.Address, interface: Net.IP.Address) -> Result<Void, NetError>
```

Joins an IPv4 multicast group on a local interface.

`group` must be a multicast address, and `interface` the IPv4 address of the local interface.

### `leaveMulticast` (foul)

```kex
leaveMulticast(socket: Socket, group: Net.IP.Address, interface: Net.IP.Address) -> Result<Void, NetError>
```

Leaves a multicast group joined earlier with the same `group` and `interface`.

## type `Socket`

Datagram sockets. Each `sendTo` sends one datagram, and each `receiveFrom` receives one whole datagram or an error.

```kex
let socket = UDP.bind(UDP.Endpoint.loopback(Port.from(0).try)).try
let address = socket.localAddress.try
socket.sendTo(address, "hello".to(Binary).try).try
let packet = socket.receiveFrom(1024).try
socket.close
```

A bound datagram socket.



## record `Endpoint`

A host name or numeric address, and a port.

**Fields**

  - `host` : [String](../string.md#make-string)
  - `port` : Net.Port



## record `Datagram`

A received datagram and the endpoint it came from.

UDP has no connections, so `source` is the only record of who sent it. Send a reply there.

**Fields**

  - `source` : Endpoint
  - `data` : [Binary](../binary.md#type-binary)



## record `BindOptions`

Options for `UDP.bind`.

Broadcast is off unless `broadcast?` is set. `receiveTimeout` applies to each `receiveFrom`, and `multicastTtl` must be a valid IP hop limit.

**Fields**

  - `broadcast?` : [Bool](../truthyable.md#make-bool) (optional)
  - `multicastTtl` : [Integer](../number.md#make-integer) (optional)
  - `multicastLoopback?` : [Bool](../truthyable.md#make-bool) (optional)
  - `receiveTimeout` : Duration (optional)



## module `Net.Socket.UDP.Endpoint`

### `host`

```kex
host(name: String, port: Net.Port) -> Endpoint
```

Builds an endpoint from a host name or numeric address and a port.

**Returns**: the endpoint, with `name` kept as given

**Examples**

_Addressing a local metrics collector_

```kex
UDP.Endpoint.host("metrics.internal", Port.from(8125).try)
```

### `any`

```kex
any(port: Net.Port) -> Endpoint
```

Builds an endpoint for receiving on every local IPv4 interface (`0.0.0.0`).

**Returns**: the IPv4 wildcard endpoint

**Examples**

_Receiving discovery packets on port 9999_

```kex
UDP.Endpoint.any(Port.from(9999).try)
```

### `loopback`

```kex
loopback(port: Net.Port) -> Endpoint
```

Builds an endpoint on the IPv4 loopback address, `127.0.0.1`, which only this machine can reach.

**Returns**: the loopback endpoint

**Examples**

_Allocating a free UDP port for a test_

```kex
UDP.Endpoint.loopback(Port.from(0).try)
```

### `parse` (foul)

```kex
parse(address: String) -> Result<Endpoint, NetError>
```

Parses a `"host:port"` address into an endpoint.

Only the port is checked here. An unknown host is reported when it is used, as a `Resolve` error. The port is whatever follows the last colon, so an IPv6 address is written without brackets.

**Returns**: the endpoint, or a `Parse` error

**Examples**

_Binding without a Port value in hand_

```kex
UDP.bind(UDP.Endpoint.parse("127.0.0.1:9000").try).try
```

## module `Net.Socket.Unix`

### `connect` (foul)

```kex
connect(address: Address) -> Result<UnixConnection, NetError>
connect(address: Address, options: ConnectOptions) -> Result<UnixConnection, NetError>
```

Connects to a Unix-domain listener.

A Unix socket needs no network port, which suits two processes on one machine, such as a command-line tool and its background daemon. Without options, connecting times out after 10 seconds and each receive after 30.

**Examples**

```kex
let daemon = Unix.connect(Unix.Address.path("/tmp/my-app.sock").try).try
```

### `listen` (foul)

```kex
listen(address: Address) -> Result<UnixListener, NetError>
listen(address: Address, options: ListenOptions) -> Result<UnixListener, NetError>
```

Starts listening at a path where nothing exists yet.

Anything already at the path stays, and listening fails. That protects regular files and avoids taking over a socket a running service may still be using.

### `connectTo` (foul)

```kex
connectTo(path: String) -> Result<UnixConnection, NetError>
connectTo(path: String, block: (UnixConnection -> A)) -> Result<A, NetError>
```

Connects to the listener at `path` with the default options.

**Examples**

_Talking to a per-user background service_

```kex
let daemon = Unix.connectTo("/tmp/my-app.sock").try
```

### `bind` (foul)

```kex
bind(path: String) -> Result<UnixListener, NetError>
bind(path: String, block: (UnixListener -> A)) -> Result<A, NetError>
```

Starts listening at `path`.

**Examples**

_A listener for local clients_

```kex
let listener = Unix.bind("/tmp/my-app.sock").try
```

### `sendAll` (foul)

```kex
sendAll(connection: UnixConnection, data: Binary) -> Result<Integer, NetError>
```

Sends all of `data` and returns the number of bytes sent.

### `put` (foul)

```kex
put(connection: UnixConnection, content: Binary) -> Result<Void, NetError>
```

Sends `content` as it is, with nothing added.

**Examples**

_Echoing a received chunk verbatim_

```kex
connection.put(chunk).try
```

### `write` (foul)

```kex
write(connection: UnixConnection, content: Showable) -> Result<Void, NetError>
```

Sends `content` as text, without a newline.

**Examples**

_Sending a prompt without a newline_

```kex
connection.write("name? ").try
```

### `writeLine` (foul)

```kex
writeLine(connection: UnixConnection, content: Showable) -> Result<Void, NetError>
```

Sends `content` as text, followed by a newline.

**Examples**

_Answering a line-oriented peer_

```kex
connection.writeLine("hello").try
```

### `print` (foul)

```kex
print(connection: UnixConnection, content: Showable) -> Void
```

Sends `content` as text, without a newline, and ignores a failure. Use `write` to find out about one.

**Examples**

_Sending a prompt without a newline_

```kex
connection.print("name? ")
```

### `printLine` (foul)

```kex
printLine(connection: UnixConnection, content: Showable) -> Void
```

Sends `content` as text, followed by a newline, and ignores a failure. Use `writeLine` to find out about one.

**Examples**

_Answering a line-oriented peer_

```kex
connection.printLine("hello")
```

### `readLine` (foul)

```kex
readLine(connection: UnixConnection) -> Result<String?, NetError>
```

Reads the next line as text, without its line ending.

Returns `Ok(None)` at the end of the input, as `FileHandle.readLine` does. A line longer than 64 KiB is a `Limit` error, and one that is not valid UTF-8 is a `Parse` error.

**Examples**

_Echoing one line back to its sender_

```kex
match connection.readLine.try do
  Just(line) => connection.printLine(line)
  None => connection.close
end
```

### `getLine` (foul)

```kex
getLine(connection: UnixConnection) -> String?
```

Reads the next line as text, without its line ending, or returns `None` at the end of the input or on any failure.

Use `readLine` to tell the end of the input from an error.

**Examples**

_Printing one received line_

```kex
IO.printLine(connection.getLine.or("(closed)"))
```

### `receiveChunk` (foul)

```kex
receiveChunk(connection: UnixConnection, limit: Integer) -> Result<Binary, NetError>
```

Receives whatever bytes are available, at most `limit` of them. The end of the stream is a `Closed` error.

### `receiveExactly` (foul)

```kex
receiveExactly(connection: UnixConnection, count: Integer) -> Result<Binary, NetError>
```

Receives exactly `count` bytes. The stream ending first is a `Closed` error, and running out of time a `Timeout` error.

### `receiveUntil` (foul)

```kex
receiveUntil(connection: UnixConnection, delimiter: Binary, limit: Integer) -> Result<Binary, NetError>
```

Receives bytes up to and including the first `delimiter`, reading at most `limit` bytes.

**Examples**

_Reading to the next newline_

```kex
connection.receiveUntil("\n".to(Binary).try, 4096).try
```

### `receiveLine` (foul)

```kex
receiveLine(connection: UnixConnection, limit: Integer) -> Result<Binary, NetError>
```

Receives bytes up to and including a newline, reading at most `limit` bytes.

### `shutdownWrite` (foul)

```kex
shutdownWrite(connection: UnixConnection) -> Result<Void, NetError>
```

Closes the sending side of the connection, so the peer sees the end of the stream, while receiving still works.

### `accept` (foul)

```kex
accept(listener: UnixListener) -> Result<UnixConnection, NetError>
```

Waits for the next incoming connection and returns it.

### `closed?` (foul)

```kex
closed?(connection: UnixConnection) -> Bool
```

Returns `true` once the connection is closed.

**Returns**: `true` when the connection's owner process has stopped

## type `UnixConnection`

Unix-domain stream sockets, for talking to another process on the same machine. A listener removes its socket file when closed, and only a file it created.

```kex
let address = Unix.Address.path("/tmp/my-service.sock").try
let listener = Unix.listen(address).try
let client = Unix.connect(address).try
listener.close
```

A connected Unix-domain stream.



## type `UnixListener`

A Unix-domain socket listening for connections.



## record `Address`

The absolute path of a Unix-domain socket. Make one with `Unix.Address.path`.

**Fields**

  - `path` : [String](../string.md#make-string)

### Defined in other modules

  - [Net.IP](../net/ip.md#make-address): [`string`](../net/ip.md#address-string), [`version`](../net/ip.md#address-version), [`loopback?`](../net/ip.md#address-loopback?), [`private?`](../net/ip.md#address-private?), [`unspecified?`](../net/ip.md#address-unspecified?), [`multicast?`](../net/ip.md#address-multicast?)

## record `ConnectOptions`

Options for `Unix.connect`: the connect and receive timeouts.

**Fields**

  - `connectTimeout` : Duration (optional)
  - `receiveTimeout` : Duration (optional)



## record `ListenOptions`

Options for `Unix.listen`: the queue size, whether to remove a leftover socket file, and the accept and receive timeouts.

`removeStale?` removes only a socket file at the path, never a regular file or a directory.

**Fields**

  - `backlog` : [Integer](../number.md#make-integer) (optional)
  - `removeStale?` : [Bool](../truthyable.md#make-bool) (optional)
  - `acceptTimeout` : Duration (optional)
  - `receiveTimeout` : Duration (optional)



## module `Net.Socket.Unix.Address`

### `path`

```kex
path(value: String) -> Result<Address, NetError>
```

Checks that `value` is an absolute path and makes it a socket address.

A relative path is a `Parse` error, so a listener always knows exactly which file to remove.

**Returns**: the address, or a `Parse` error

**Examples**

_Addressing a per-user background service_

```kex
Unix.Address.path("/tmp/my-app.sock").try
```

## module `Net.Socket.TLS`

### `connect` (foul)

```kex
connect(endpoint: Net.Socket.TCP.Endpoint, config: ClientConfig) -> Result<TLSConnection, NetError>
```

Connects to `endpoint` and performs the TLS handshake.

The certificate is checked against `serverName`, which is also sent as SNI. Give the host name from the URL, not an address it resolved to.

**Returns**: the connection, or why it failed

**Examples**

_Opening a verified connection to an HTTPS origin_

```kex
let endpoint = TCP.Endpoint.host("example.com", Port.from(443).try)
let connection = TLS.connect(endpoint, TLS.ClientConfig {
  serverName: "example.com",
  alpn: ["http/1.1"]
}).try
```

### `sendAll` (foul)

```kex
sendAll(connection: TLSConnection, data: Binary) -> Result<Integer, NetError>
```

Encrypts and sends all of `data`, and returns the number of bytes sent.

### `put` (foul)

```kex
put(connection: TLSConnection, content: Binary) -> Result<Void, NetError>
```

Sends `content` as it is, with nothing added.

**Examples**

_Echoing a received chunk verbatim_

```kex
connection.put(chunk).try
```

### `write` (foul)

```kex
write(connection: TLSConnection, content: Showable) -> Result<Void, NetError>
```

Sends `content` as text, without a newline.

**Examples**

_Sending a prompt without a newline_

```kex
connection.write("name? ").try
```

### `writeLine` (foul)

```kex
writeLine(connection: TLSConnection, content: Showable) -> Result<Void, NetError>
```

Sends `content` as text, followed by a newline.

**Examples**

_Answering a line-oriented peer_

```kex
connection.writeLine("hello").try
```

### `print` (foul)

```kex
print(connection: TLSConnection, content: Showable) -> Void
```

Sends `content` as text, without a newline, and ignores a failure. Use `write` to find out about one.

**Examples**

_Sending a prompt without a newline_

```kex
connection.print("name? ")
```

### `printLine` (foul)

```kex
printLine(connection: TLSConnection, content: Showable) -> Void
```

Sends `content` as text, followed by a newline, and ignores a failure. Use `writeLine` to find out about one.

**Examples**

_Answering a line-oriented peer_

```kex
connection.printLine("hello")
```

### `receiveChunk` (foul)

```kex
receiveChunk(connection: TLSConnection, limit: Integer) -> Result<Binary, NetError>
```

Receives and decrypts whatever bytes are available, at most `limit` of them.

### `closed?` (foul)

```kex
closed?(connection: TLSConnection) -> Bool
```

Returns `true` once the connection is closed.

**Returns**: `true` when the connection's owner process has stopped

## type `TLSConnection`

TLS client connections. The server's certificate and host name are checked unless `verify?` is set to `false`.

```kex
let endpoint = TCP.Endpoint.host("example.test", Port.from(443).try)
let tls = TLS.connect(endpoint, TLS.ClientConfig {
  serverName: "example.test"
}).try
tls.close
```

A TLS connection.



## record `ClientConfig`

Options for `TLS.connect`: the server name to check and to send (SNI), whether to verify the certificate, and the ALPN protocols to offer. TLS 1.2 and 1.3 are allowed.

**Fields**

  - `serverName` : [String](../string.md#make-string)
  - `verify?` : [Bool](../truthyable.md#make-bool) (optional)
  - `alpn` : [[String](../string.md#make-string)] (optional)



## type `Net.Socket.TCP.TCPConnection`

Implements [`Closeable`](../file_handle.md#trait-closeable).

### `close` (foul) (from Closeable)

```kex
close -> Void
```

Closes the connection. Closing it again does nothing.



## type `Net.Socket.TCP.TCPListener`

Implements [`Closeable`](../file_handle.md#trait-closeable).

### `close` (foul) (from Closeable)

```kex
close -> Void
```

Closes the listener and frees its port. Closing it again does nothing.



## type `Net.Socket.UDP.Socket`

Implements [`Closeable`](../file_handle.md#trait-closeable).

### `close` (foul) (from Closeable)

```kex
close -> Void
```

Closes the socket. Closing it again does nothing.



## type `Net.Socket.Unix.UnixConnection`

Implements [`Closeable`](../file_handle.md#trait-closeable).

### `close` (foul) (from Closeable)

```kex
close -> Void
```

Closes the connection. Closing it again does nothing.



## type `Net.Socket.Unix.UnixListener`

Implements [`Closeable`](../file_handle.md#trait-closeable).

### `close` (foul) (from Closeable)

```kex
close -> Void
```

Closes the listener and removes its socket file, if this listener created it.



## type `Net.Socket.TLS.TLSConnection`

Implements [`Closeable`](../file_handle.md#trait-closeable).

### `close` (foul) (from Closeable)

```kex
close -> Void
```

Closes the TLS connection. Closing it again does nothing.



## module `Net.Socket.Mock`

Stand-ins for the socket capabilities, for testing how code handles a failure.

They are here, not in `mock.kex`, because only code compiled together with this module can implement its capabilities.



## record `TCP`

A stand-in for the `Net.Socket.TCP` capability.

Every function that would open a connection or listener returns `failure` when it is set, so a test can force a refused connection or a timeout. Otherwise they, and every function on a connection, return a `MockEmpty` error. The mock cannot make a working connection; test that path against a loopback listener (see `spec/net_socket_text_beam.kex`).

```kex
with Net.Socket.TCP = Mock.TCP {} do
  TCP.connectTo("127.0.0.1:9")
end
```

**Fields**

  - `failure` : [NetError](../net.md#record-net-neterror)? (optional)

Implements `Net.Socket.TCP`.

### Functions

#### `connect` (foul)

```kex
connect(endpoint, options)
```

#### `connectTo` (foul)

```kex
connectTo(address, block)
```

#### `listen` (foul)

```kex
listen(endpoint, options)
```

#### `bind` (foul)

```kex
bind(address, block)
```

#### `accept` (foul)

```kex
accept(listener, timeout)
```

#### `sendAll` (foul)

```kex
sendAll(connection, data)
```

#### `put` (foul)

```kex
put(connection, content)
```

#### `write` (foul)

```kex
write(connection, content)
```

#### `writeLine` (foul)

```kex
writeLine(connection, content)
```

#### `print` (foul)

```kex
print(connection, content)
```

#### `printLine` (foul)

```kex
printLine(connection, content)
```

#### `readLine` (foul)

```kex
readLine(connection)
```

#### `getLine` (foul)

```kex
getLine(connection)
```

#### `receiveChunk` (foul)

```kex
receiveChunk(connection, limit, timeout)
```

#### `receiveExactly` (foul)

```kex
receiveExactly(connection, count, timeout)
```

#### `receiveUntil` (foul)

```kex
receiveUntil(connection, delimiter, limit, timeout)
```

#### `receiveLine` (foul)

```kex
receiveLine(connection, limit, timeout)
```

#### `shutdownWrite` (foul)

```kex
shutdownWrite(connection)
```

#### `closed?` (foul)

```kex
closed?(handle)
```

#### `localAddress` (foul)

```kex
localAddress(handle)
```

#### `peerAddress` (foul)

```kex
peerAddress(connection)
```

## record `UDP`

A stand-in for the `Net.Socket.UDP` capability. It fails the same way as `Mock.TCP`: with `failure` when it is set, and with `MockEmpty` otherwise.

```kex
with Net.Socket.UDP = Mock.UDP {} do
  UDP.bindTo("127.0.0.1:0")
end
```

**Fields**

  - `failure` : [NetError](../net.md#record-net-neterror)? (optional)

Implements `Net.Socket.UDP`.

### Functions

#### `bind` (foul)

```kex
bind(endpoint, options)
```

#### `bindTo` (foul)

```kex
bindTo(address, block)
```

#### `sendTo` (foul)

```kex
sendTo(socket, endpoint, data)
```

#### `receiveFrom` (foul)

```kex
receiveFrom(socket, limit)
```

#### `closed?` (foul)

```kex
closed?(socket)
```

#### `localAddress` (foul)

```kex
localAddress(socket)
```

#### `joinMulticast` (foul)

```kex
joinMulticast(socket, group, interface)
```

#### `leaveMulticast` (foul)

```kex
leaveMulticast(socket, group, interface)
```

## record `Unix`

A stand-in for the `Net.Socket.Unix` capability. It fails the same way as `Mock.TCP`: with `failure` when it is set, and with `MockEmpty` otherwise.

```kex
with Net.Socket.Unix = Mock.Unix {} do
  Unix.connectTo("/tmp/app.sock")
end
```

**Fields**

  - `failure` : [NetError](../net.md#record-net-neterror)? (optional)

Implements `Net.Socket.Unix`.

### Functions

#### `connect` (foul)

```kex
connect(address, options)
```

#### `listen` (foul)

```kex
listen(address, options)
```

#### `connectTo` (foul)

```kex
connectTo(path, block)
```

#### `bind` (foul)

```kex
bind(path, block)
```

#### `accept` (foul)

```kex
accept(listener)
```

#### `sendAll` (foul)

```kex
sendAll(connection, data)
```

#### `put` (foul)

```kex
put(connection, content)
```

#### `write` (foul)

```kex
write(connection, content)
```

#### `writeLine` (foul)

```kex
writeLine(connection, content)
```

#### `print` (foul)

```kex
print(connection, content)
```

#### `printLine` (foul)

```kex
printLine(connection, content)
```

#### `readLine` (foul)

```kex
readLine(connection)
```

#### `getLine` (foul)

```kex
getLine(connection)
```

#### `receiveChunk` (foul)

```kex
receiveChunk(connection, limit)
```

#### `receiveExactly` (foul)

```kex
receiveExactly(connection, count)
```

#### `receiveUntil` (foul)

```kex
receiveUntil(connection, delimiter, limit)
```

#### `receiveLine` (foul)

```kex
receiveLine(connection, limit)
```

#### `shutdownWrite` (foul)

```kex
shutdownWrite(connection)
```

#### `closed?` (foul)

```kex
closed?(handle)
```

## record `TLS`

A stand-in for the `Net.Socket.TLS` capability. It fails the same way as `Mock.TCP`: with `failure` when it is set, and with `MockEmpty` otherwise.

```kex
with Net.Socket.TLS = Mock.TLS {} do
  TLS.connect(endpoint, config)
end
```

**Fields**

  - `failure` : [NetError](../net.md#record-net-neterror)? (optional)

Implements `Net.Socket.TLS`.

### Functions

#### `connect` (foul)

```kex
connect(endpoint, config)
```

#### `sendAll` (foul)

```kex
sendAll(connection, data)
```

#### `put` (foul)

```kex
put(connection, content)
```

#### `write` (foul)

```kex
write(connection, content)
```

#### `writeLine` (foul)

```kex
writeLine(connection, content)
```

#### `print` (foul)

```kex
print(connection, content)
```

#### `printLine` (foul)

```kex
printLine(connection, content)
```

#### `receiveChunk` (foul)

```kex
receiveChunk(connection, limit)
```

#### `closed?` (foul)

```kex
closed?(connection)
```
