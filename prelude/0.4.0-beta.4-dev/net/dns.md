---
package: prelude
version: "0.4.0-beta.4-dev"
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

  - `display` : [String](../string.md#make-string)
  - `ascii` : [String](../string.md#make-string)



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

  - `records` : [[DNSRecord](#type-net-dns-dnsrecord)]
  - `dnssec` : [DNSSECStatus](#type-net-dns-dnssecstatus)



## record `CacheOptions`

Bounds for a resolver-owned positive and negative cache.

Positive answers honor their DNS TTL up to `maximumTtl`. Failed lookups are cached for `negativeTtl`, preventing a missing hostname from hammering the configured nameserver on every request.

**Fields**

  - `entries` : [Integer](../number.md#make-integer) (optional)
  - `maximumTtl` : [Duration](../units.md#record-duration) (optional)
  - `negativeTtl` : [Duration](../units.md#record-duration) (optional)



## record `Nameserver`

One DNS server used by a custom resolver.

**Fields**

  - `address` : Net.IP.Address
  - `port` : Net.Port



## record `ResolverOptions`

Isolated resolver configuration. An empty search list only queries the name as written; search domains are tried in order for single-label names.

**Fields**

  - `cache` : [CacheOptions](#record-net-dns-cacheoptions) (optional)
  - `nameservers` : [[Nameserver](#record-net-dns-nameserver)]
  - `search` : [[Name](#record-net-dns-name)] (optional)
  - `retries` : [Integer](../number.md#make-integer) (optional)
  - `timeout` : [Duration](../units.md#record-duration) (optional)



## record `CacheStatistics`

Lifetime cache counters. `clear` empties entries but keeps these counters.

Compare `hits` with `misses` when tuning `entries` or TTL bounds. A rising `evictions` count means the resolver is seeing more distinct names than its cache can retain.

**Fields**

  - `entries` : [Integer](../number.md#make-integer)
  - `hits` : [Integer](../number.md#make-integer)
  - `misses` : [Integer](../number.md#make-integer)
  - `negativeHits` : [Integer](../number.md#make-integer)
  - `evictions` : [Integer](../number.md#make-integer)



## type `Resolver`

An opaque, process-safe resolver that owns its cache.

### Methods

#### `addresses`

```kex
addresses(name: Name) -> Result<[Net.IP.Address], NetError>
```

Resolves AAAA and A records, returning IPv6 addresses first.

This is the convenient operation for connecting to a host. Use `lookup` when record type, TTL-related behavior, or DNSSEC status matters.

**Parameters**

  - `name` — the validated hostname

**Returns**: addresses or `Resolve`

**Examples**

_Resolving an application upstream_

```kex
let host = Name.parse("api.example.com").try
let addresses = resolver.addresses(host).try
```

#### `lookup`

```kex
lookup(kind: RecordType, name: Name) -> Result<LookupResponse, NetError>
```

Looks up one supported resource-record family.

**Parameters**

  - `kind` — the requested family
  - `name` — the validated owner name

**Returns**: typed records or `Resolve`

**Examples**

_Discovering a domain's mail exchangers_

```kex
let response = resolver.lookup(MX, Name.parse("example.com").try).try
response.records.each { |record| IO.inspect(record) }
```

#### `clear`

```kex
clear : Void
```

Empties cached entries without resetting lifetime counters.

Existing statistics remain meaningful across a manual refresh, while the next lookup is forced back to DNS.

**Examples**

_Refreshing service discovery after configuration changes_

```kex
resolver.clear
```

#### `statistics`

```kex
statistics : CacheStatistics
```

Reports current occupancy and lifetime cache counters.

**Returns**: current entries and lifetime counters

**Examples**

_Reporting whether the cache is doing useful work_

```kex
let stats = resolver.statistics
IO.printLine("DNS cache: ${stats.hits} hits, ${stats.misses} misses")
```

#### `close`

```kex
close : Void
```

Idempotently closes the resolver.

Calls after closing fail with `Closed`; closing again is harmless.

## module `Net.DNS.Name`

Validation and IDNA conversion for DNS names.

### `parse`

```kex
parse(text: String) -> Result<Name, NetError>
```

Validates a name and converts Unicode labels to IDNA ASCII.

**Parameters**

  - `text` — a dotted hostname, optionally with a trailing dot

**Returns**: the name, or `Parse`

**Examples**

_Preparing a user-supplied hostname for lookup_

```kex
let name = Name.parse("münich.example").try
IO.printLine(name.display)
resolver.addresses(name).try
```

## module `Net.DNS.Resolver`

Constructors for long-lived, cache-owning resolvers.

### `system`

```kex
system(cache: CacheOptions) -> Result<Resolver, NetError>
```

Opens a resolver using system configuration and default cache bounds.

Reuse the returned resolver for the lifetime of a service so repeated names benefit from its bounded cache, then close it during shutdown.

**Returns**: a resolver handle

**Examples**

_A service-owned resolver_

```kex
let resolver = Resolver.system.try
let upstream = resolver.addresses(Name.parse("api.example.com").try).try
resolver.close
```

### `custom`

```kex
custom(options: ResolverOptions) -> Result<Resolver, NetError>
```

Opens an isolated resolver with typed nameservers and query bounds.

This does not inherit the machine's search domains or nameservers. It is useful for tests, service discovery, and applications with their own DNS policy.

**Parameters**

  - `options` — nameservers, search domains, retry count,

**Returns**: a resolver, or `Parse`

**Examples**

_Querying a DNS server used by a local integration test_

```kex
let nameserver = Nameserver {
  address: Net.IP.Address.parse("127.0.0.1").try,
  port: Net.Port.from(5353).try
}
Resolver.custom(ResolverOptions {
  nameservers: [nameserver],
  timeout: 100.milliseconds
}).try
```

## module `Net.DNS.DNS`

Convenience lookup operations for callers that do not need resolver ownership or cache reuse.

### `addresses`

```kex
addresses(name: Name) -> Result<[Net.IP.Address], NetError>
```

Resolves a name once with a short-lived system resolver.

Prefer this for command-line tools and one-off checks. A server that looks up names repeatedly should own a `Resolver` so it can reuse cached answers.

**Parameters**

  - `name` — the validated hostname

**Returns**: addresses or `Resolve`

**Examples**

_Resolving one host in a short-lived command_

```kex
let addresses = DNS.addresses(Name.parse("example.com").try).try
```
