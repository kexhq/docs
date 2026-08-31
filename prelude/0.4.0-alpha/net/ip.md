---
package: prelude
version: "0.4.0-alpha"
source: net/ip.kex
title: Net.IP
entities:
  - { kind: module, name: "Net.IP" }
---

# Net.IP

## module `Net.IP`

Validated, canonical IP addresses and CIDR networks.

```kex
using Net.IP

let address = Address.parse("192.0.2.42").try
let network = Network.parse("192.0.2.0/24").try
network.contains(address)   # => true
```

## record `Address`

A canonical IPv4 or IPv6 address.

The stored spelling is normalized, so addresses that arrived in different forms compare and print consistently. Zone identifiers such as `%en0` are properties of socket endpoints and do not belong here.

**Fields**

  - `source` : String

## record `Network`

A canonical CIDR network with host bits cleared.

Parsing `192.0.2.9/24` therefore produces `192.0.2.0/24`. This makes a `Network` suitable for access-control rules and routing tables: its identity is the range, not whichever host address happened to describe it.

**Fields**

  - `source` : String

## module `Net.IP.Address`

Strict parsing and canonicalization of individual IP addresses.

## function `parse`

Parses IPv4 or IPv6 text and canonicalizes its spelling.


```kex
parse(text) : String -> Result<Address, NetError>
```


## module `Net.IP.Network`

Strict parsing and canonicalization of CIDR networks.

## function `parse`

Parses a CIDR and clears host bits.


```kex
parse(text) : String -> Result<Network, NetError>
```


## make `Address`



## make `Network`


#### `contains`

Returns `true` when `address` falls within this network.

An address from the other family is simply outside the network; callers do not need to compare `version` first.

```kex
contains(address) : Address -> Bool
```

**Returns**: `Bool` — whether `address` belongs to this network

**Examples**

_Checking an application allowlist_

```kex
let office = Network.parse("198.51.100.0/24").try
let allowed? = office.contains(requestAddress)
```
