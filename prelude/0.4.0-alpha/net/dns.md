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

**Fields**

  - `entries` : Integer (optional)
  - `maximumTtl` : Duration (optional)
  - `negativeTtl` : Duration (optional)

## record `CacheStatistics`

Lifetime cache counters. `clear` empties entries but keeps these counters.

**Fields**

  - `entries` : Integer
  - `hits` : Integer
  - `misses` : Integer
  - `negativeHits` : Integer
  - `evictions` : Integer

## type `Resolver`

An opaque, process-safe resolver that owns its cache.



## module `Net.DNS.Name`

## function `parse`

Validates a name and converts Unicode labels to IDNA ASCII.


```kex
parse(text) : String -> Result<Name, NetError>
```


## module `Net.DNS.Resolver`

## function `system`

Opens a resolver using system configuration and default cache bounds.


```kex
system()
```


## make `Resolver`


#### `addresses`

Resolves AAAA and A records, returning IPv6 addresses first.

```kex
addresses(name)
```

**Returns**: `Result<[Net.IP.Address], NetError>` — addresses or `Resolve`

**Examples**

_`resolver.addresses(Name.parse("example.test").try).try`_

```kex

```

#### `lookup`

Looks up one supported resource-record family.

```kex
lookup(kind, name)
```

**Returns**: `Result<LookupResponse, NetError>` — typed records or `Resolve`

#### `clear`

Empties cached entries without resetting lifetime counters.

```kex
clear()
```

**Returns**: `Void`

#### `statistics`

```kex
statistics()
```

**Returns**: `CacheStatistics` — current entries and lifetime counters

#### `close`

Idempotently closes the resolver.

```kex
close()
```

**Returns**: `Void`

## module `Net.DNS.DNS`

## function `addresses`

Resolves a name once with a short-lived system resolver.


```kex
addresses(name) : Name -> Result<[Net.IP.Address], NetError>
```

