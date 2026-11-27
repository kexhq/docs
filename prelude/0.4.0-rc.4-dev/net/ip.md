---
package: prelude
version: "0.4.0-rc.4-dev"
source: net/ip.kex
title: Net.IP
entities:
  - { kind: module, name: "Net.IP" }
---

# Net.IP

## module `Net.IP`

IP addresses and CIDR networks, checked and stored in canonical form.

```kex
using Net.IP

let address = Address.parse("192.0.2.42").try
let network = Network.parse("192.0.2.0/24").try
network.contains?(address)   # => true
```



## record `Address`

An IPv4 or IPv6 address.

The text is stored in canonical form, so two spellings of the same address compare equal and print the same. `Address.parse` rejects zone identifiers such as `%en0`.

**Fields**

  - `source` : [String](../string.md#make-string)

### Functions

#### `string`

```kex
string -> String
```

Returns the canonical text form of the address.

**Returns**: canonical address text

**Examples**

_Normalizing an IPv6 address for a log or cache key_

```kex
Address.parse("2001:0db8:0:0::42").try.string   # => "2001:db8::42"
```

#### `version`

```kex
version -> Integer
```

Returns the address family as `4` or `6`.

**Returns**: `4` for IPv4 or `6` for IPv6

**Examples**

_Selecting a family-specific socket policy_

```kex
let family = address.version == 6 then :ipv6 else :ipv4
```

#### `loopback?`

```kex
loopback? -> Bool
```

Returns `true` for a loopback address: anything in `127.0.0.0/8`, or `::1`.

**Returns**: whether this is a loopback address

**Examples**

_Refusing to expose a development service beyond this machine_

```kex
die("development server must use loopback") if !address.loopback?
```

#### `private?`

```kex
private? -> Bool
```

Returns `true` for an address reserved for private networks.

A private address can still belong to another machine, so it does not prove that a peer is trusted.

**Returns**: whether this is a private-use address

**Examples**

_Requiring an internal target_

```kex
die("target must be a private address") if !target.private?
```

#### `unspecified?`

```kex
unspecified? -> Bool
```

Returns `true` for the all-zero address: `0.0.0.0` or `::`.

On a listening endpoint it usually means all local interfaces. It cannot be used as a remote destination.

**Returns**: whether every address bit is zero

**Examples**

_Warning before binding a service on every interface_

```kex
IO.printError("service will be publicly reachable") if bind.unspecified?
```

#### `multicast?`

```kex
multicast? -> Bool
```

Returns `true` when the address names a multicast group.

**Returns**: whether this is a multicast address

**Examples**

_Choosing multicast-specific socket setup_

```kex
let mode = destination.multicast? then :group else :unicast
```

## record `Network`

A CIDR network, stored with its host bits cleared.

Parsing `192.0.2.9/24` gives `192.0.2.0/24`, so two spellings of the same range are equal.

**Fields**

  - `source` : [String](../string.md#make-string)

### Functions

#### `string`

```kex
string -> String
```

Returns the canonical CIDR text, including the prefix length.

**Returns**: canonical CIDR text

**Examples**

```kex
Network.parse("192.0.2.99/24").try.string   # => "192.0.2.0/24"
```

#### `contains?`

```kex
contains?(address: Address) -> Bool
```

Returns `true` when `address` falls within this network.

An address of the other IP version is never inside, so there is no need to compare `version` first.

**Parameters**

  - `address` — the address to test

**Returns**: whether `address` belongs to this network

**Examples**

_Checking an application allowlist_

```kex
let office = Network.parse("198.51.100.0/24").try
let allowed? = office.contains?(requestAddress)
```

#### `prefix`

```kex
prefix -> Integer
```

Returns the number of fixed leading address bits.

**Returns**: the prefix length

**Examples**

```kex
Network.parse("10.0.0.0/8").try.prefix   # => 8
```

#### `first`

```kex
first -> Address
```

Returns the first address in the range, with all host bits cleared.

**Returns**: the first address in the range

**Examples**

```kex
Network.parse("192.0.2.9/24").try.first.string   # => "192.0.2.0"
```

#### `last`

```kex
last -> Address
```

Returns the last address in the range, with all host bits set. For IPv4 this is the broadcast address, which is usually not assignable to a host.

**Returns**: the last address in the range

**Examples**

```kex
Network.parse("192.0.2.9/24").try.last.string   # => "192.0.2.255"
```

## module `Net.IP.Address`

Parsing IP addresses.

### `parse`

```kex
parse(text: String) -> Result<Address, NetError>
```

Parses an IPv4 or IPv6 address. Invalid text is a `NetError` of kind `Parse`.

**Parameters**

  - `text` — an IPv4 dotted quad or IPv6 address

**Returns**: the address, or `Parse`

**Examples**

```kex
Address.parse("2001:0db8::0042").try.string   # => "2001:db8::42"
```

## module `Net.IP.Network`

Parsing CIDR networks.

### `parse`

```kex
parse(text: String) -> Result<Network, NetError>
```

Parses an address and prefix length such as `192.0.2.0/24`, clearing the host bits. Invalid text is a `NetError` of kind `Parse`.

**Parameters**

  - `text` — an address followed by a prefix length

**Returns**: the network, or `Parse`

**Examples**

```kex
Network.parse("192.0.2.9/24").try.string   # => "192.0.2.0/24"
```
