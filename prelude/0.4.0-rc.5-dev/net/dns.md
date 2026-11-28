---
package: prelude
version: "0.4.0-rc.5-dev"
source: net/dns.kex
title: Net.DNS
entities:
  - { kind: module, name: "Net.DNS" }
---

# Net.DNS

## module `Net.DNS`

DNS lookups, with resolvers that own a bounded cache.

Use `DNS.addresses` for an occasional lookup. Open a `Resolver` when a service looks names up repeatedly, wants cache statistics or must query a particular nameserver; the cache lives in the resolver and is freed when you close it. On the interpreter (`kex -R`), lookups work only through a mock.

```kex
using Net.DNS

let resolver = Resolver.system.try
let name = Name.parse("example.test").try
let addresses = resolver.addresses(name).try
resolver.close
```



## record `Name`

A validated DNS name, in the caller's spelling and in IDNA ASCII.

`display` is the name as the caller wrote it, for messages. `ascii` is the IDNA form sent in queries.

**Fields**

  - `display` : [String](../string.md#make-string)
  - `ascii` : [String](../string.md#make-string)



## type `RecordType`

The record types `Resolver.lookup` can ask for.

**Variants**

  - `A`
  - `AAAA`
  - `CNAME`
  - `MX`
  - `TXT`
  - `SRV`
  - `PTR`



## type `DNSSECStatus`

The DNSSEC state the system resolver reported. Kex does not validate DNSSEC itself, so this is often `Indeterminate`.

**Variants**

  - `Secure`
  - `Insecure`
  - `Bogus`
  - `Indeterminate`



## type `DNSRecord`

A DNS resource record. MX and SRV records keep their priorities (and SRV its weight and port), and a TXT record keeps its separate strings.

**Variants**

  - `AddressRecord(Net.IP.Address)`
  - `CanonicalName(Name)`
  - `MailExchange(Integer, Name)`
  - `TextRecord([String])`
  - `ServiceRecord(Integer, Integer, Net.Port, Name)`
  - `PointerRecord(Name)`



## record `LookupResponse`

The records from one lookup and their DNSSEC state.

**Fields**

  - `records` : [[DNSRecord](#type-net-dns-dnsrecord)]
  - `dnssec` : [DNSSECStatus](#type-net-dns-dnssecstatus)



## record `CacheOptions`

Limits for a resolver's cache.

`entries` caps the number of cached names. An answer is kept for its DNS TTL, but no longer than `maximumTtl`. A failed lookup is kept for `negativeTtl`, so a missing hostname is not sent to the nameserver on every request.

**Fields**

  - `entries` : [Integer](../number.md#make-integer) (optional)
  - `maximumTtl` : Duration (optional)
  - `negativeTtl` : Duration (optional)



## record `Nameserver`

A DNS server for `Resolver.custom` to query.

**Fields**

  - `address` : Net.IP.Address
  - `port` : Net.Port



## record `ResolverOptions`

Settings for `Resolver.custom`.

With an empty `search` list only the name as written is queried. Otherwise the search domains are tried in order for a name with a single label. `retries` and `timeout` apply to each query.

**Fields**

  - `cache` : [CacheOptions](#record-net-dns-cacheoptions) (optional)
  - `nameservers` : [[Nameserver](#record-net-dns-nameserver)]
  - `search` : [[Name](#record-net-dns-name)] (optional)
  - `retries` : [Integer](../number.md#make-integer) (optional)
  - `timeout` : Duration (optional)



## record `CacheStatistics`

A resolver's cache counters, counted since it was opened. `entries` is the current number of cached names; `clear` resets it but not the counters.

Compare `hits` with `misses` when tuning `CacheOptions`. A rising `evictions` count means the resolver sees more distinct names than its cache holds.

**Fields**

  - `entries` : [Integer](../number.md#make-integer)
  - `hits` : [Integer](../number.md#make-integer)
  - `misses` : [Integer](../number.md#make-integer)
  - `negativeHits` : [Integer](../number.md#make-integer)
  - `evictions` : [Integer](../number.md#make-integer)



## type `Resolver`

A resolver and its cache. Any process may use it.

### Functions

#### `addresses` (foul)

```kex
addresses(name: Name) -> Result<[Net.IP.Address], NetError>
```

Resolves AAAA and A records, returning IPv6 addresses first.

Use it to find a host to connect to. Use `lookup` for other record types or the DNSSEC state.

**Parameters**

  - `name` — the validated hostname

**Returns**: the addresses, or a `Resolve` error

**Examples**

_Resolving an application upstream_

```kex
let host = Name.parse("api.example.com").try
let addresses = resolver.addresses(host).try
```

#### `lookup` (foul)

```kex
lookup(kind: RecordType, name: Name) -> Result<LookupResponse, NetError>
```

Looks up the records of one type for `name`.

**Parameters**

  - `kind` — the record type to ask for
  - `name` — the validated name

**Returns**: the records, or a `Resolve` error

**Examples**

_Discovering a domain's mail exchangers_

```kex
let response = resolver.lookup(MX, Name.parse("example.com").try).try
response.records.each { |record| IO.inspect(record) }
```

#### `clear` (foul)

```kex
clear -> Void
```

Empties the cache, so the next lookup of each name goes to DNS. The `statistics` counters are kept.

**Examples**

_Refreshing service discovery after configuration changes_

```kex
resolver.clear
```

#### `statistics` (foul)

```kex
statistics -> CacheStatistics
```

Returns the number of cached names and the cache counters.

**Returns**: the cache's size and counters

**Examples**

_Reporting whether the cache is doing useful work_

```kex
let stats = resolver.statistics
IO.printLine("DNS cache: ${stats.hits} hits, ${stats.misses} misses")
```

#### `close` (foul)

```kex
close -> Void
```

Closes the resolver and frees its cache.

Lookups after closing fail with a `Closed` error. Closing twice is harmless.

## module `Net.DNS.Name`

Parsing DNS names.

### `parse`

```kex
parse(text: String) -> Result<Name, NetError>
```

Parses a hostname, converting Unicode labels to IDNA ASCII.

**Parameters**

  - `text` — a dotted hostname, optionally with a trailing dot

**Returns**: the name, or a `Parse` error

**Examples**

_Preparing a user-supplied hostname for lookup_

```kex
let name = Name.parse("münich.example").try
IO.printLine(name.display)
resolver.addresses(name).try
```

## module `Net.DNS.Resolver`

Opening resolvers.

### `system` (foul)

```kex
system(cache: CacheOptions) -> Result<Resolver, NetError>
```

Opens a resolver that uses the system's DNS configuration and the default `CacheOptions`.

Keep it for the life of a service so repeated names are answered from its cache, and close it at shutdown.

**Returns**: a resolver handle

**Examples**

_A service-owned resolver_

```kex
let resolver = Resolver.system.try
let upstream = resolver.addresses(Name.parse("api.example.com").try).try
resolver.close
```

### `custom` (foul)

```kex
custom(options: ResolverOptions) -> Result<Resolver, NetError>
```

Opens a resolver that queries the given nameservers.

It ignores the machine's nameservers and search domains. Use it for tests, service discovery, or an application with its own DNS settings.

**Parameters**

  - `options` — nameservers, search domains, retry count, per-query timeout, and cache bounds

**Returns**: a resolver, or a `Parse` error

**Examples**

_Querying a DNS server used by a local integration test_

```kex
let nameserver = Nameserver {
  address: Net.IP.Address.parse("127.0.0.1").try,
  port: Net.Port.from(5353).try
}
Resolver.custom(ResolverOptions {
  nameservers: [nameserver],
  timeout: 100.millisecond
}).try
```

## module `Net.DNS.DNS`

One-off lookups, for callers that do not need a `Resolver` of their own.

### `addresses` (foul)

```kex
addresses(name: Name) -> Result<[Net.IP.Address], NetError>
```

Resolves a name to its addresses with a resolver opened for this one lookup.

Use it in command-line tools and one-off checks. A server that looks up names repeatedly should open a `Resolver`, which caches answers.

**Parameters**

  - `name` — the validated hostname

**Returns**: the addresses, or a `Resolve` error

**Examples**

_Resolving one host in a short-lived command_

```kex
let addresses = DNS.addresses(Name.parse("example.com").try).try
```
