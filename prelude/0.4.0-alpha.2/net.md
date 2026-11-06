---
package: prelude
version: "0.4.0-alpha.2"
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

Use `Port.from` at input boundaries. Port zero requests an ephemeral port where a listening API permits it.

**Fields**

  - `value` : [Integer](number.md#make-integer)

### Methods

#### `string`

```kex
string : String
```

Renders the decimal port without a host or scheme.

**Returns**: decimal port text

## record `SupportValue`

Whether a feature was compiled into this backend and is usable now.

**Fields**

  - `compiled?` : [Bool](blankable.md#make-bool)
  - `usable?` : [Bool](blankable.md#make-bool)



## record `SupportReport`

Granular networking capabilities for the current backend and environment.

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

### `from`

```kex
from(value: Integer) -> Result<Port, NetError>
```

Validates a port number.

**Parameters**

  - `value` — a number in `0..65535`

**Returns**: the validated port, or `Parse`

**Examples**

_+Port.from(443).try+._

```kex

```

## module `Net.Support`

### `current` (constant)

```kex
current : SupportReport
```

Reports compiled and currently usable networking features.

**Examples**

_+Support.current.httpClient.usable?+._

```kex

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

A typed networking failure. `phase` adds optional protocol context and `progress` records bytes transferred before a partial-operation failure.

**Fields**

  - `kind` : [NetErrorKind](#type-net-neterrorkind)
  - `operation` : [NetOperation](#type-net-netoperation)
  - `message` : [String](string.md#make-string)
  - `phase` : [String](string.md#make-string)?
  - `progress` : [Integer](number.md#make-integer)?


