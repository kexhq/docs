---
package: prelude
version: "0.4.0-alpha"
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

  - `value` : Integer

## record `SupportValue`

Whether a feature was compiled into this backend and is usable now.

**Fields**

  - `compiled?` : Bool
  - `usable?` : Bool

## record `SupportReport`

Granular networking capabilities for the current backend and environment.

**Fields**

  - `dns` : [SupportValue](#record-supportvalue)
  - `tcp` : [SupportValue](#record-supportvalue)
  - `udp` : [SupportValue](#record-supportvalue)
  - `unix` : [SupportValue](#record-supportvalue)
  - `tls` : [SupportValue](#record-supportvalue)
  - `httpClient` : [SupportValue](#record-supportvalue)
  - `httpServer` : [SupportValue](#record-supportvalue)
  - `webSocketClient` : [SupportValue](#record-supportvalue)
  - `webSocketServer` : [SupportValue](#record-supportvalue)

## module `Net.Port`

## function `from`

Validates a port number.


```kex
from(value) : Integer -> Result<Port, NetError>
```


## module `Net.Support`

## constant `current`

Reports compiled and currently usable networking features.



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

  - `kind` : [NetErrorKind](#type-neterrorkind)
  - `operation` : [NetOperation](#type-netoperation)
  - `message` : String
  - `phase` : String?
  - `progress` : Integer?

## make `Port`


