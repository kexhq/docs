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



**Variants**

  - `ConnectionRefused`
  - `Timeout`
  - `DnsError`
  - `SslError`
  - `NotImplemented`
  - `MockEmpty`
  - `Unknown`

## record `HttpResponse`

**Fields**

  - `status` : Integer
  - `body` : String
  - `headers` : Map<String, String>

## record `HttpError`

**Fields**

  - `kind` : [NetworkError](#type-networkerror)
  - `message` : String

## record `HttpOptions`

**Fields**

  - `headers` : Map<String, String> (optional)
  - `timeout` : Integer (optional)

## module `Http`

A capability: every member performs a real network request, so a test can replace it for a lexical region with `with Http = ...` rather than mutating global mock state (kexhq/kex#143).

## function `get`


```kex
get(url) : String -> Result<HttpResponse, HttpError>
get(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `post`


```kex
post(url, body) : String -> String -> Result<HttpResponse, HttpError>
post(url, body) : String -> String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `put`


```kex
put(url, body) : String -> String -> Result<HttpResponse, HttpError>
put(url, body) : String -> String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `patch`


```kex
patch(url, body) : String -> String -> Result<HttpResponse, HttpError>
patch(url, body) : String -> String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `delete`


```kex
delete(url) : String -> Result<HttpResponse, HttpError>
delete(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `head`


```kex
head(url) : String -> Result<HttpResponse, HttpError>
head(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```


## function `options`


```kex
options(url) : String -> Result<HttpResponse, HttpError>
options(url) : String -> HttpOptions -> Result<HttpResponse, HttpError>
```

