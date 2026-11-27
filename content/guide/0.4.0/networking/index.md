---
id: "guide-0-4-0-beta-4-networking"
title: "Networking"
description: "Use bounded HTTP and socket APIs on the BEAM backend."
path: "/guide/0.4.0/networking/"
draft: false
template: "page"
---
The next program starts a local HTTP server, sends it one request, and reads the response. It uses the BEAM backend, which implements real socket, DNS, HTTP, and WebSocket IO. The interpreter can work with pure networking values, but real IO returns `UnsupportedBackend`.

## A local HTTP round trip

This complete example starts a server on a loopback ephemeral port, sends one request, and stops it. It does not depend on an external website.


```kex
using Net.HTTP
using Net.Socket

foul health(request: Request<Binary>, context: Context) -> Response<Binary> = Response.text(200, "ok")

main do
  let router = Router.build.get("/health", ~health)
  let server = Server.start(
    TCP.Endpoint.loopback(Net.Port.from(0).try),
    router
  ).try
  let client = Client.open().try
  let response = client.request("GET", "http://127.0.0.1:${server.localAddress.port.value}/health", Headers.empty, Binary.empty)
  let closed = client.close
  let stopped = server.stop
  assert(closed.ok?)
  assert(stopped.ok?)
  assert(response.ok?)
  assert(response.try.status.code == 200)
  assert(response.try.body.to(String).try == "ok")
end
```

`Net.Port.from(0)` asks the operating system for an available port. The router responds to `GET /health` with `"ok"`. The client connects through the loopback address, and the final assertions check that the response has status 200 and the expected body. The example closes the client and stops the server before those assertions, so a failed check does not leave them running.

## HTTP responses and transport errors

The outer `response` is a result of the network operation. An HTTP 404 or 503 may still arrive inside `Ok(response)`: the exchange worked, but the application returned an error status. Check both levels. Bodies are binary, so convert to text where your application needs text and handle invalid encoding.

The client is buffered HTTP/1.1. It verifies HTTPS, bounds bodies, and does not silently follow redirects or apply generic retries. Use an explicit `Client` when you need owned connection reuse, and close it when its lifetime ends. Streaming bodies, cookie management, and application middleware should not be assumed from the existence of a basic HTTP API.

## Sockets, DNS, and WebSockets

HTTP uses lower-level networking pieces that you can also use directly. These modules cover the common jobs:

| Module | Purpose |
| --- | --- |
| `URI` | Strict URI/URL parsing, resolution, and normalization |
| `Net.IP` | Validated IP address and network values |
| `Net.DNS` | Explicit resolvers and bounded caches |
| `Net.Socket` | TCP, UDP, Unix streams, and TLS client streams |
| `Net.HTTP` | Requests, responses, headers, clients, and routing |
| `Net.HTTP.WebSocket` | WebSocket client connections and server upgrades |

Build addresses and ports with their validating constructors. A TCP read returns available bytes, which need not line up with one complete application message. Choose an exact or line read when your protocol needs that boundary, and put a size limit on it. UDP keeps datagram boundaries and reports oversized input.

WebSocket `receiveMessage()` waits for a message or disconnect. `receiveMessage(timeout: Just(duration))` adds an explicit deadline. Handle timeout separately from closure; neither is an ordinary text message. When importing both HTTP and WebSocket APIs, narrow conflicting names such as `ClientOptions` with selective imports.

## Failure and retry policy

Networking failures use `NetError`. Branch on its stable `kind` and `operation`, and retain diagnostic text for people. Check `Net.Support.current` when backend availability is part of your application logic.

`Control.Retry` supplies explicit retry schedules. Decide which operations are safe to repeat and which failures are temporary before enabling retries. HTTP error statuses need explicit classification because they arrive inside `Ok(response)`. Bound per-request timeouts separately from the cumulative retry delay.

See the networking modules in the [standard-library reference](/prelude/) for precise option fields and supported protocol features.
