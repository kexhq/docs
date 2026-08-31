---
package: prelude
version: "0.4.0-alpha"
source: net/dns.kex
title: Net.DNS
entities:
  - { kind: module, name: "Net.DNS" }
---

# Net.DNS

## module `Net.DNS`

Typed DNS lookup with explicit resolver ownership and bounded caching.

Use `DNS.addresses` for an occasional hostname lookup. Own a `Resolver` when a service performs repeated lookups, needs cache statistics, or must query a particular nameserver. Resolver ownership makes both caching and cleanup visible instead of hiding process-wide state behind every lookup.

```kex
using Net.DNS

let resolver = Resolver.system.try
let name = Name.parse("example.test").try
let addresses = resolver.addresses(name).try
resolver.close
```

## record `Name`

A validated DNS name with caller-facing and IDNA ASCII spellings.

`display` keeps the readable form supplied by the caller; `ascii` is the wire-safe IDNA form used in DNS queries. Keeping both lets an error message say what the user typed without sending noncanonical labels to a resolver.

**Fields**

  - `display` : String
  - `ascii` : String

## type `RecordType`

Record families supported by `Resolver.lookup`.



**Variants**

  - `A`
  - `AAAA`
  - `CNAME`
  - `MX`
  - `TXT`
  - `SRV`
  - `PTR`

## type `DNSSECStatus`

DNSSEC state reported by the underlying resolver. Kex does not independently validate DNSSEC and therefore commonly reports `Indeterminate`.



**Variants**

  - `Secure`
  - `Insecure`
  - `Bogus`
  - `Indeterminate`

## type `DNSRecord`

Typed DNS resource records, preserving MX/SRV priorities and TXT chunks.



**Variants**

  - `AddressRecord(Net.IP.Address)`
  - `CanonicalName(Name)`
  - `MailExchange(Integer, Name)`
  - `TextRecord([String])`
  - `ServiceRecord(Integer, Integer, Net.Port, Name)`
  - `PointerRecord(Name)`

## record `LookupResponse`

Records and the reported DNSSEC state from one lookup.

**Fields**

  - `records` : [[DNSRecord](#type-dnsrecord)]
  - `dnssec` : [DNSSECStatus](#type-dnssecstatus)

## record `CacheOptions`

Bounds for a resolver-owned positive and negative cache.

Positive answers honor their DNS TTL up to `maximumTtl`. Failed lookups are cached for `negativeTtl`, preventing a missing hostname from hammering the configured nameserver on every request.

**Fields**

  - `entries` : Integer (optional)
  - `maximumTtl` : Duration (optional)
  - `negativeTtl` : Duration (optional)

## record `Nameserver`

One DNS server used by a custom resolver.

**Fields**

  - `address` : Net.IP.Address
  - `port` : Net.Port

## record `ResolverOptions`

Isolated resolver configuration. An empty search list only queries the name as written; search domains are tried in order for single-label names.

**Fields**

  - `cache` : [CacheOptions](#record-cacheoptions) (optional)
  - `nameservers` : [[Nameserver](#record-nameserver)]
  - `search` : [[Name](#record-name)] (optional)
  - `retries` : Integer (optional)
  - `timeout` : Duration (optional)

## record `CacheStatistics`

Lifetime cache counters. `clear` empties entries but keeps these counters.

Compare `hits` with `misses` when tuning `entries` or TTL bounds. A rising `evictions` count means the resolver is seeing more distinct names than its cache can retain.

**Fields**

  - `entries` : Integer
  - `hits` : Integer
  - `misses` : Integer
  - `negativeHits` : Integer
  - `evictions` : Integer

## type `Resolver`

An opaque, process-safe resolver that owns its cache.



## module `Net.DNS.Name`

Validation and IDNA conversion for DNS names.

## function `parse`

Validates a name and converts Unicode labels to IDNA ASCII.


```kex
parse(text) : String -> Result<Name, NetError>
```


## module `Net.DNS.Resolver`

Constructors for long-lived, cache-owning resolvers.

## function `system`

Opens a resolver using system configuration and default cache bounds.

Reuse the returned resolver for the lifetime of a service so repeated names benefit from its bounded cache, then close it during shutdown.


```kex
system()
```


## function `custom`

Opens an isolated resolver with typed nameservers and query bounds.

This does not inherit the machine's search domains or nameservers. It is useful for tests, service discovery, and applications with their own DNS policy.


```kex
custom(options)
```


## make `Resolver`


#### `addresses`

Resolves AAAA and A records, returning IPv6 addresses first.

This is the convenient operation for connecting to a host. Use `lookup` when record type, TTL-related behavior, or DNSSEC status matters.

```kex
addresses(name)
```

**Returns**: `Result<[Net.IP.Address], NetError>` — addresses or `Resolve`

**Examples**

_Resolving an application upstream_

```kex
let host = Name.parse("api.example.com").try
let addresses = resolver.addresses(host).try
```

#### `lookup`

Looks up one supported resource-record family.

```kex
lookup(kind, name)
```

**Returns**: `Result<LookupResponse, NetError>` — typed records or `Resolve`

**Examples**

_Discovering a domain's mail exchangers_

```kex
let response = resolver.lookup(MX, Name.parse("example.com").try).try
response.records.each { |record| IO.inspect(record) }
```

#### `clear`

Empties cached entries without resetting lifetime counters.

Existing statistics remain meaningful across a manual refresh, while the next lookup is forced back to DNS.

```kex
clear()
```

**Returns**: `Void`

**Examples**

_Refreshing service discovery after configuration changes_

```kex
resolver.clear
```

#### `statistics`

Reports current occupancy and lifetime cache counters.

```kex
statistics()
```

**Returns**: `CacheStatistics` — current entries and lifetime counters

**Examples**

_Reporting whether the cache is doing useful work_

```kex
let stats = resolver.statistics
IO.printLine("DNS cache: ${stats.hits} hits, ${stats.misses} misses")
```

#### `close`

Idempotently closes the resolver.

Calls after closing fail with `Closed`; closing again is harmless.

```kex
close()
```

**Returns**: `Void`

## module `Net.DNS.DNS`

Convenience lookup operations for callers that do not need resolver ownership or cache reuse.

## function `addresses`

Resolves a name once with a short-lived system resolver.

Prefer this for command-line tools and one-off checks. A server that looks up names repeatedly should own a `Resolver` so it can reuse cached answers.


```kex
addresses(name) : Name -> Result<[Net.IP.Address], NetError>
```

