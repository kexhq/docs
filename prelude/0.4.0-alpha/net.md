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

Use `Port.from` at input boundaries. Port zero requests an ephemeral port where a listening API permits it; after binding, ask the server or socket for the concrete port the operating system chose.

**Fields**

  - `value` : Integer

## record `SupportValue`

Whether a feature was compiled into this backend and is usable now.

`compiled?` describes the build; `usable?` also accounts for the environment it is running in. A browser build may contain an HTTP client, for example, while browser policy still prevents a particular lower-level capability.

**Fields**

  - `compiled?` : Bool
  - `usable?` : Bool

## record `SupportReport`

Granular networking capabilities for the current backend and environment.

Read this before choosing a transport dynamically. Applications that require one capability can instead check that single field during startup and fail with a useful message.

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

Validated `Port` construction.

## function `from`

Validates a port number.


```kex
from(value) : Integer -> Result<Port, NetError>
```


## module `Net.Support`

Runtime discovery for optional network transports and protocols.

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

A typed networking failure shared by every network module.

`kind` is the stable category to branch on. `message` is for a person, while `phase` adds protocol context such as a TLS handshake and `progress` records bytes transferred before a partial-operation failure. Keeping those roles separate lets programs recover without matching backend-specific prose.

**Fields**

  - `kind` : [NetErrorKind](#type-neterrorkind)
  - `operation` : [NetOperation](#type-netoperation)
  - `message` : String
  - `phase` : String?
  - `progress` : Integer?

## make `Port`


