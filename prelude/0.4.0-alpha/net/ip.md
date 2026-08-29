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

A canonical IPv4 or IPv6 address. Zone identifiers belong to endpoints.

**Fields**

  - `source` : String

## record `Network`

A canonical CIDR network with host bits cleared.

**Fields**

  - `source` : String

## module `Net.IP.Address`

## function `parse`

Parses IPv4 or IPv6 text and canonicalizes its spelling.


```kex
parse(text) : String -> Result<Address, NetError>
```


## module `Net.IP.Network`

## function `parse`

Parses a CIDR and clears host bits.


```kex
parse(text) : String -> Result<Network, NetError>
```


## make `Address`



## make `Network`


#### `contains`

```kex
contains(address) : Address -> Bool
```
