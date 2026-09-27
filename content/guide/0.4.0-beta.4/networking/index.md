---
id: "guide-0-4-0-beta-4-networking"
title: "Networking"
description: "Use bounded HTTP and socket APIs on the BEAM backend."
path: "/guide/0.4.0-beta.4/networking/"
draft: false
template: "page"
---
Networking modules are opt-in. The BEAM backend implements real socket, DNS, HTTP, and WebSocket IO. The interpreter supports pure networking values and policies, but real IO returns a typed `UnsupportedBackend` error. Run this chapter on BEAM.

## A local HTTP round trip

This complete example starts a server on a loopback ephemeral port, sends one request, and stops it. It does not depend on an external website.

<!-- guide-backend: beam -->
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

Port zero asks the operating system to choose an available port. The example stops the server before inspecting the response, so an assertion does not leave it running. Longer-lived applications should account for cleanup on every failure path.

## HTTP responses and transport errors

An HTTP 404 or 503 is a successful transport exchange with an unsuccessful application status. Check both the outer result and the response status. Bodies are binary; convert to text at the boundary and handle invalid encoding.

The client is buffered HTTP/1.1. It verifies HTTPS, bounds bodies, and does not silently follow redirects or apply generic retries. Use an explicit `Client` when you need owned connection reuse, and close it when its lifetime ends. Streaming bodies, cookie management, and application middleware should not be assumed from the existence of a basic HTTP API.

## Sockets, DNS, and WebSockets

| Module | Purpose |
| --- | --- |
| `URI` | Strict URI/URL parsing, resolution, and normalization |
| `Net.IP` | Validated IP address and network values |
| `Net.DNS` | Explicit resolvers and bounded caches |
| `Net.Socket` | TCP, UDP, Unix streams, and TLS client streams |
| `Net.HTTP` | Requests, responses, headers, clients, and routing |
| `Net.HTTP.WebSocket` | WebSocket client connections and server upgrades |

Validate addresses and ports with their constructors. Socket streams transport bytes, so one read need not equal one application message. Use bounded exact or line reads as appropriate. UDP preserves datagram boundaries and reports oversized input rather than treating truncation as a complete message.

WebSocket `receiveMessage()` waits for a message or disconnect. `receiveMessage(timeout: Just(duration))` adds an explicit deadline. Handle timeout separately from closure; neither is an ordinary text message. When importing both HTTP and WebSocket APIs, narrow conflicting names such as `ClientOptions` with selective imports.

## Failure and retry policy

Networking failures use `NetError`. Branch on its stable `kind` and `operation`, and retain diagnostic text for people. Check `Net.Support.current` when backend availability is part of your application logic.

`Control.Retry` supplies explicit retry schedules. Decide which operations are safe to repeat and which failures are temporary before enabling retries. HTTP error statuses need explicit classification because they arrive inside `Ok(response)`. Bound per-request timeouts separately from the cumulative retry delay.

See the networking modules in the [standard-library reference](/prelude/) for precise option fields and supported protocol features.
