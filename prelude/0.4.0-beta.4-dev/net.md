---
package: prelude
version: "0.4.0-beta.4-dev"
source: net.kex
title: Net
entities:
  - { kind: module, name: "Net" }
---

# Net

## module `Net`

Shared networking values, capability discovery, and typed failures.

```kex
using Net

let https = Port.from(443).try
if Support.current.tls.usable? then https.string else "TLS unavailable" end
```



## record `Port`

A validated TCP or UDP port number in `0..65535`.

Use `Port.from` at input boundaries. Port zero requests an ephemeral port where a listening API permits it; after binding, ask the server or socket for the concrete port the operating system chose.

**Fields**

  - `value` : [Integer](number.md#make-integer)

### Methods

#### `string`

```kex
string : String
```

Renders the decimal port without a host or scheme.

**Returns**: decimal port text

**Examples**

_Building an address for display_

```kex
IO.printLine("listening on 127.0.0.1:${port.string}")
```

## record `SupportValue`

Whether a feature was compiled into this backend and is usable now.

`compiled?` describes the build; `usable?` also accounts for the environment it is running in. A browser build may contain an HTTP client, for example, while browser policy still prevents a particular lower-level capability.

**Fields**

  - `compiled?` : [Bool](truthyable.md#make-bool)
  - `usable?` : [Bool](truthyable.md#make-bool)



## record `SupportReport`

Granular networking capabilities for the current backend and environment.

Read this before choosing a transport dynamically. Applications that require one capability can instead check that single field during startup and fail with a useful message.

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

Validated `Port` construction.

### `from`

```kex
from(value: Integer) -> Result<Port, NetError>
```

Validates a port number.

**Parameters**

  - `value` — a number in `0..65535`

**Returns**: the validated port, or `Parse`

**Examples**

_Reading a listen port from the environment_

```kex
let number = ENV.get("PORT").flatMap { |text| text.to(Integer) }.or(8080)
let port = Port.from(number).try
```

## module `Net.Support`

Runtime discovery for optional network transports and protocols.

### `current` (constant)

```kex
current : SupportReport
```

Reports compiled and currently usable networking features.

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

Stable, backend-independent networking failure categories.

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

A typed networking failure shared by every network module.

`kind` is the stable category to branch on. `message` is for a person, while `phase` adds protocol context such as a TLS handshake and `progress` records bytes transferred before a partial-operation failure. Keeping those roles separate lets programs recover without matching backend-specific prose.

**Fields**

  - `kind` : [NetErrorKind](#type-net-neterrorkind)
  - `operation` : [NetOperation](#type-net-netoperation)
  - `message` : [String](string.md#make-string)
  - `phase` : [String](string.md#make-string)?
  - `progress` : [Integer](number.md#make-integer)?


