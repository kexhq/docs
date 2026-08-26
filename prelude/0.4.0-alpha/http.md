---
package: prelude
version: "0.4.0-alpha"
source: http.kex
title: Http
entities:
  - { kind: type, name: "NetworkError" }
  - { kind: record, name: "HttpResponse" }
  - { kind: record, name: "HttpError" }
  - { kind: record, name: "HttpOptions" }
  - { kind: module, name: "Http" }
---

# Http

## type `NetworkError`

HTTP client requests.

One function per method — `get`, `post`, `put`, `patch`, `delete`, `head`, `options` — each answering a `Result`, so a network failure is a value you handle rather than an exception.

  main do     match Http.get("https://example.com/api/status") do       Ok(response) => IO.printLine("${response.status}: ${response.body}")       Error(e)     => IO.printError("request failed: ${e.message}")     end   end

An HTTP error status is NOT an `Error`: a 404 is a response the server chose to send, so it arrives as `Ok` with `status: 404`. `Error` means the request never got an answer — refused, timed out, DNS failed.

Every call has a second form taking `HttpOptions`, for headers and timeouts.

Why a request never reached an answer.

Distinct from an HTTP status, which is an answer. `MockEmpty` appears only under `Mock.Http`, when the queued responses have run out.



**Variants**

  - `ConnectionRefused`
  - `Timeout`
  - `DnsError`
  - `SslError`
  - `NotImplemented`
  - `MockEmpty`
  - `Unknown`

## record `HttpResponse`

What the server answered.

**Fields**

  - `status` : Integer
  - `body` : String
  - `headers` : Map<String, String>

## record `HttpError`

Why a request could not be completed.

**Fields**

  - `kind` : [NetworkError](#type-networkerror)
  - `message` : String

## record `HttpOptions`

Per-request settings: headers to send, and how long to wait.

  Http.get(url, HttpOptions {     headers: { "Authorization": "Bearer ${token}" },     timeout: 5000   })

**Fields**

  - `headers` : Map<String, String> (optional)
  - `timeout` : Integer (optional)

## module `Http`

HTTP client requests.

A capability: every member performs a real network request, so a test can replace it for a lexical region with `with Http = ...` rather than mutating global mock state (kexhq/kex#143).

## function `get`

Fetches `url`.

Answers `Ok` whenever the server replied, whatever the status — check `response.status` for that. `Error` means no answer arrived at all.


```kex
get(url) : String -> Result<HttpResponse, HttpError>
get(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `post`

Sends `body` to `url` with the POST method.

The body is sent as given — set `Content-Type` yourself through `opts` when the server needs to know what it is.


```kex
post(url, body) : String -> String -> Result<HttpResponse, HttpError>
post(url, body) : String -> String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `put`

Sends `body` to `url` with the PUT method, replacing the resource there.


```kex
put(url, body) : String -> String -> Result<HttpResponse, HttpError>
put(url, body) : String -> String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `patch`

Sends `body` to `url` with the PATCH method, updating part of the resource there.


```kex
patch(url, body) : String -> String -> Result<HttpResponse, HttpError>
patch(url, body) : String -> String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `delete`

Sends a DELETE request to `url`.


```kex
delete(url) : String -> Result<HttpResponse, HttpError>
delete(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `head`

Fetches `url`'s headers without its body.

The cheap way to ask whether something is there, how big it is, or when it last changed.


```kex
head(url) : String -> Result<HttpResponse, HttpError>
head(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `options`

Asks `url` which methods it supports, with an OPTIONS request.


```kex
options(url) : String -> Result<HttpResponse, HttpError>
options(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```

