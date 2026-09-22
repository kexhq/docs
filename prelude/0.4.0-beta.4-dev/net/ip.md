---
package: prelude
version: "0.4.0-beta.4-dev"
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


#### `string`

Returns the canonical text form of the address.

```kex
string : String
```

**Returns**: `String` — canonical address text

**Examples**

_Normalizing an IPv6 address for a log or cache key_

```kex
Address.parse("2001:0db8:0:0::42").try.string   # => "2001:db8::42"
```

#### `version`

Returns the address family as `4` or `6`.

```kex
version : Integer
```

**Returns**: `Integer` — `4` for IPv4 or `6` for IPv6

**Examples**

_Selecting a family-specific socket policy_

```kex
let family = address.version == 6 then :ipv6 else :ipv4
```

#### `loopback?`

Returns `true` for an address that routes back to this host.

This covers the IPv4 `127.0.0.0/8` block as well as IPv6 `::1`; it is not limited to the familiar `127.0.0.1` spelling.

```kex
loopback? : Bool
```

**Returns**: `Bool` — whether this is a loopback address

**Examples**

_Refusing to expose a development service beyond this machine_

```kex
die("development server must use loopback") if !address.loopback?
```

#### `private?`

Returns `true` for an address reserved for private networks.

Use this as one signal in a network policy, not as proof that a peer is trusted: private addresses can still belong to another machine.

```kex
private? : Bool
```

**Returns**: `Bool` — whether this is a private-use address

**Examples**

_Rejecting a public target in an internal-only configuration_

```kex
Error("target must be private") if !target.private?
```

#### `unspecified?`

Returns `true` for the all-zero address: `0.0.0.0` or `::`.

On a listening endpoint this usually means "all local interfaces". It is not a usable remote destination.

```kex
unspecified? : Bool
```

**Returns**: `Bool` — whether every address bit is zero

**Examples**

_Warning before binding a service on every interface_

```kex
IO.warn("service will be publicly reachable") if bind.unspecified?
```

#### `multicast?`

Returns `true` when the address names a multicast group.

```kex
multicast? : Bool
```

**Returns**: `Bool` — whether this is a multicast address

**Examples**

_Choosing multicast-specific socket setup_

```kex
let mode = destination.multicast? then :group else :unicast
```

## make `Network`


#### `string`

Returns canonical CIDR text, including the prefix length.

```kex
string : String
```

**Returns**: `String` — canonical CIDR text

**Examples**

```kex
Network.parse("192.0.2.99/24").try.string   # => "192.0.2.0/24"
```

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

#### `prefix`

Returns the number of fixed leading address bits.

```kex
prefix : Integer
```

**Returns**: `Integer` — the prefix length

**Examples**

```kex
Network.parse("10.0.0.0/8").try.prefix   # => 8
```

#### `first`

Returns the first address in the range: the address with all host bits cleared.

```kex
first : Address
```

**Returns**: `Address` — the first address in the range

**Examples**

```kex
Network.parse("192.0.2.9/24").try.first.string   # => "192.0.2.0"
```

#### `last`

Returns the last address in the range: the address with all host bits set.

This is the IPv4 broadcast-shaped endpoint of the mathematical range; the API does not decide whether a protocol permits assigning it to a host.

```kex
last : Address
```

**Returns**: `Address` — the last address in the range

**Examples**

```kex
Network.parse("192.0.2.9/24").try.last.string   # => "192.0.2.255"
```
