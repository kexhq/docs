---
package: prelude
version: "0.4.0-rc.5-dev"
source: net.kex
title: Net
entities:
  - { kind: module, name: "Net" }
---

# Net

## module `Net`

Networking values shared by the network modules: ports, a report of which transports this build supports, and the error type they all return.

```kex
using Net

let https = Port.from(443).try
if Support.current.tls.usable? then https.string else "TLS unavailable" end
```



## record `Port`

A TCP or UDP port number, checked to be in `0..65535`.

Build one with `Port.from`. Port zero asks the operating system for a free port where a listening API allows it; after binding, ask the server or socket which port it got.

**Fields**

  - `value` : [Integer](number.md#make-integer)

### Functions

#### `string`

```kex
string -> String
```

Returns the port number as decimal text, with no host or scheme.

**Returns**: the port number, such as `"443"`

**Examples**

_Building an address for display_

```kex
IO.printLine("listening on 127.0.0.1:${port.string}")
```

## record `SupportValue`

Whether a networking feature is built in, and whether it can be used here.

`compiled?` describes the build. `usable?` also takes the running environment into account: a browser build can contain an HTTP client while browser policy still blocks a lower-level transport.

**Fields**

  - `compiled?` : [Bool](truthyable.md#make-bool)
  - `usable?` : [Bool](truthyable.md#make-bool)



## record `SupportReport`

The networking features of the running build, one `SupportValue` each.

Consult it to pick a transport at run time. A program that needs one feature can check that field at startup and stop with a clear message. The tree-walk interpreter (`kex -R`) reports every feature as unavailable.

**Fields**

  - `dns` : [SupportValue](#record-net-supportvalue)
  - `tcp` : [SupportValue](#record-net-supportvalue)
  - `udp` : [SupportValue](#record-net-supportvalue)
  - `unix` : [SupportValue](#record-net-supportvalue)
  - `tls` : [SupportValue](#record-net-supportvalue)
  - `httpClient` : [SupportValue](#record-net-supportvalue)
  - `httpServer` : [SupportValue](#record-net-supportvalue)
  - `webSocketClient` : [SupportValue](#record-net-supportvalue)
  - `webSocketServer` : [SupportValue](#record-net-supportvalue)



## module `Net.Port`

Construction of `Port` values.

### `from`

```kex
from(value: Integer) -> Result<Port, NetError>
```

Returns `value` as a `Port`, or a `Parse` error when it is outside `0..65535`.

**Parameters**

  - `value` — a number in `0..65535`

**Returns**: the port, or a `NetError` of kind `Parse`

**Examples**

_Reading a listen port from the environment_

```kex
let number = ENV.get("PORT").into { |text| text.to(Integer) }.or(8080)
let port = Port.from(number).try
```

## module `Net.Support`

Run-time discovery of the optional network transports and protocols.

### `current` (constant)

```kex
current : SupportReport
```

Returns which networking features this build contains and which are usable now.

**Examples**

_Explaining why an HTTP-dependent command cannot run_

```kex
if !Support.current.httpClient.usable?
  die("this Kex build cannot make HTTP requests here")
end
```



## type `NetOperation`

The subsystem or operation that produced a networking error.

**Variants**

  - `DNS`
  - `TCP`
  - `UDP`
  - `Unix`
  - `TLS`
  - `HTTPClient`
  - `HTTPServer`
  - `WebSocketClient`
  - `WebSocketServer`



## type `NetErrorKind`

The category of a networking failure, the same on every backend.

**Variants**

  - `Parse`
  - `Resolve`
  - `Connect`
  - `Protocol`
  - `Timeout`
  - `Cancelled`
  - `Limit`
  - `Closed`
  - `ReadInProgress`
  - `UnsupportedBackend`
  - `UnsupportedOption`
  - `BrowserRestricted`
  - `OpaqueRedirect`
  - `MockEmpty`
  - `Backend`



## record `NetError`

The error every network module returns.

Branch on `kind`; it does not change between backends. `message` is text for a person and may differ by backend. `phase` names the protocol step that failed, such as a TLS handshake, and `progress` counts the bytes transferred before an operation failed partway.

**Fields**

  - `kind` : [NetErrorKind](#type-net-neterrorkind)
  - `operation` : [NetOperation](#type-net-netoperation)
  - `message` : [String](string.md#make-string)
  - `phase` : [String](string.md#make-string)?
  - `progress` : [Integer](number.md#make-integer)?


