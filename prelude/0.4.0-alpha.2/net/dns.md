---
package: prelude
version: "0.4.0-alpha.2"
source: net/dns.kex
title: Net.DNS
entities:
  - { kind: module, name: "Net.DNS" }
---

# Net.DNS

## module `Net.DNS`

Typed DNS lookup with explicit resolver ownership and bounded caching.

```kex
using Net.DNS

let resolver = Resolver.system.try
let name = Name.parse("example.test").try
let addresses = resolver.addresses(name).try
resolver.close
```



## record `Name`

A validated DNS name with caller-facing and IDNA ASCII spellings.

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

**Parameters**

  - `name` — the validated hostname

**Returns**: addresses or `Resolve`

**Examples**

_+resolver.addresses(Name.parse("example.test").try).try+_

```kex

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

#### `clear`

```kex
clear : Void
```

Empties cached entries without resetting lifetime counters.

#### `statistics`

```kex
statistics : CacheStatistics
```

**Returns**: current entries and lifetime counters

#### `close`

```kex
close : Void
```

Idempotently closes the resolver.

## module `Net.DNS.Name`

### `parse`

```kex
parse(text: String) -> Result<Name, NetError>
```

Validates a name and converts Unicode labels to IDNA ASCII.

**Parameters**

  - `text` — a dotted hostname, optionally with a trailing dot

**Returns**: the name, or `Parse`

**Examples**

_+Name.parse("münich.example").try.ascii+._

```kex

```

## module `Net.DNS.Resolver`

### `system`

```kex
system(cache: CacheOptions) -> Result<Resolver, NetError>
```

Opens a resolver using system configuration and default cache bounds.

**Returns**: a resolver handle

**Examples**

_+Resolver.system.try+_

```kex

```

### `custom`

```kex
custom(options: ResolverOptions) -> Result<Resolver, NetError>
```

Opens an isolated resolver with typed nameservers and query bounds.

**Parameters**

  - `options` — nameservers, search domains, retry count,

**Returns**: a resolver, or `Parse`

**Examples**

_+Resolver.custom(ResolverOptions { nameservers: [Nameserver { address: Net.IP.Address.parse("127.0.0.1").try, port: Net.Port.from(53).try }], timeout: 100.milliseconds }).try+_

```kex

```

## module `Net.DNS.DNS`

### `addresses`

```kex
addresses(name: Name) -> Result<[Net.IP.Address], NetError>
```

Resolves a name once with a short-lived system resolver.

**Parameters**

  - `name` — the validated hostname

**Returns**: addresses or `Resolve`
