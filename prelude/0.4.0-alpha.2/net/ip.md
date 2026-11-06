---
package: prelude
version: "0.4.0-alpha.2"
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

  - `source` : [String](../string.md#make-string)

### Methods

#### `string`

```kex
string : String
```

#### `version`

```kex
version : Integer
```

#### `loopback?`

```kex
loopback? : Bool
```

#### `private?`

```kex
private? : Bool
```

#### `unspecified?`

```kex
unspecified? : Bool
```

#### `multicast?`

```kex
multicast? : Bool
```

## record `Network`

A canonical CIDR network with host bits cleared.

**Fields**

  - `source` : [String](../string.md#make-string)

### Methods

#### `string`

```kex
string : String
```

#### `contains`

```kex
contains(address: Address) -> Bool
```

#### `prefix`

```kex
prefix : Integer
```

#### `first`

```kex
first : Address
```

#### `last`

```kex
last : Address
```

## module `Net.IP.Address`

### `parse`

```kex
parse(text: String) -> Result<Address, NetError>
```

Parses IPv4 or IPv6 text and canonicalizes its spelling.

**Parameters**

  - `text` — an IPv4 dotted quad or IPv6 address

**Returns**: the address, or `Parse`

**Examples**

_+Address.parse("2001:db8::42").try.string+._

```kex

```

## module `Net.IP.Network`

### `parse`

```kex
parse(text: String) -> Result<Network, NetError>
```

Parses a CIDR and clears host bits.

**Parameters**

  - `text` — an address followed by a prefix length

**Returns**: the network, or `Parse`

**Examples**

_+Network.parse("192.0.2.9/24").try.string+ is +"192.0.2.0/24"+._

```kex

```
