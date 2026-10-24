---
package: prelude
version: "0.4.0-rc.1-dev"
source: units/data.kex
title: Units.Data
entities:
  - { kind: module, name: "Units.Data" }
---

# Units.Data

## module `Units.Data`

Data sizes: bytes, kilobytes, and their binary counterparts.

Opt-in: nothing here is in scope until `using Units.Data`.

```kex
using Units.Data

main do
  IO.printLine(1500.megabyte.to(String))              # prints: 1500.0 MB
  IO.printLine(1500000000.byteSize.to(String, in: Giga)) # prints: 1.5 GB
end
```

Both families are here and they are not the same: `KB` is 1000 bytes, `KiB` is 1024. Values built from either convert freely, because both are counted in bytes underneath, so `1.gibibyte.convertTo(MiB)` answers 1024 MiB.

Numeric constructors use singular names, as in `Units.SI`: `5.megabyte` and `2.mebibyte`. `byteSize` is an alias for `byte`.

File and payload APIs return integer byte counts. Wrap those counts with `byte` to convert or display them as measurements:

```kex
FS.File.size("report.pdf").map { |n| n.byte.to(String) }
Binary.fromBytes([104, 105]).length.byte.to(String)  # => "2.0 B"
"é".bytes.count.byte.to(String)                    # => "2.0 B"
```

To display binary units, convert to `KiB`, `MiB`, `GiB`, or `TiB`:

```kex
1048576.byte.convertTo(MiB).map { |m| m.to(String) } # => Ok("1.0 MiB")
```

Compare an integer byte count directly with a data-size threshold:

```kex
30000001 > 30.megabyte   # => true
1048576 <= 1.mebibyte    # => true
```

`<`, `>`, `<=`, and `>=` work with the count on either side. A time or SI measure is not a byte threshold and raises an error.

Every value is a `Measure` from the prelude, so its arithmetic and `to(String)` apply unchanged.

### `size`

```kex
size(value: Number, unit: DataUnit) -> Measure
```

`value` of the given data unit, as a `Measure`.

The general constructor the named ones below are written on. Reach for `megabyte`, `kibibyte` and friends when the unit is known at the call site.

**Parameters**

  - `value` — the quantity
  - `unit` — the unit it is counted in

**Returns**: the size

**Examples**

```kex
size(4096, B).to(String)     # => "4096.0 B"
size(1.5, MB).to(String)     # => "1.5 MB"
```

### `convertTo`

```kex
convertTo(measure: Measure, unit: DataUnit) -> Result<Measure, String>
```

Converts a size to another data unit.

Decimal and binary units convert freely, because both are counted in bytes underneath. A measure of some other dimension is an `Error`.

**Parameters**

  - `measure` — the size to convert
  - `unit` — the unit to convert to

**Returns**: the converted size, or why it could not be

**Examples**

```kex
1.gibibyte.convertTo(MiB).map { |m| m.to(String) }   # => Ok("1024.0 MiB")
2.gigabyte.convertTo(MB).map { |m| m.to(String) }    # => Ok("2000.0 MB")
```

### `to`

```kex
to(measure: Measure, in: DataPrefix, in: DataPrefix) -> String?
```

Renders a size at a chosen decimal prefix.

Data prefixes select their standard decimal byte unit. They are targets for formatting, so `Mega` means MB rather than a prefix applied twice to the measure's existing unit. A measure that is not a data size answers `None`.

**Parameters**

  - `String` — the target type
  - `in` — the prefix to display at

**Returns**: the rendered size, or `None`

**Examples**

```kex
1500000000.byteSize.to(String, in: Giga)   # => Just("1.5 GB")
1500000.byteSize.to(String, in: Mega)      # => Just("1.5 MB")
```

### `byteSize`

```kex
byteSize(value: Number) -> Measure
```

`value` bytes.

Named `byteSize` rather than `bytes`, which `String` already uses for its UTF-8 encoding.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
4096.byteSize.to(String)   # => "4096.0 B"
```

_Reporting a file's size_

```kex
FS.File.size("report.pdf").map { |n| n.byte.to(String) }
```

### `byte`

```kex
byte(value: Number) -> Measure
```

`value` bytes, as a `Measure`.

Use this with byte counts from `FS.File.size` or `Binary.length`.

**Parameters**

  - `value` — the byte count

**Returns**: the size

**Examples**

_A binary payload's size_

```kex
let payload = Binary.fromBytes([104, 105])
payload.length.byte.to(String)   # => "2.0 B"
```

### `kilobyte`

```kex
kilobyte(value: Number) -> Measure
```

`value` kilobytes, 1000 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
5.kilobyte.to(String)   # => "5.0 KB"
```

### `megabyte`

```kex
megabyte(value: Number) -> Measure
```

`value` megabytes, 1000000 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1500.megabyte.to(String)   # => "1500.0 MB"
```

### `gigabyte`

```kex
gigabyte(value: Number) -> Measure
```

`value` gigabytes, 10^9 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
2.gigabyte.convertTo(MB).map { |m| m.to(String) }   # => Ok("2000.0 MB")
```

### `terabyte`

```kex
terabyte(value: Number) -> Measure
```

`value` terabytes, 10^12 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
2.terabyte.to(String)   # => "2.0 TB"
```

### `kibibyte`

```kex
kibibyte(value: Number) -> Measure
```

`value` kibibytes, 1024 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1024.kibibyte.to(String)   # => "1024.0 KiB"
```

### `mebibyte`

```kex
mebibyte(value: Number) -> Measure
```

`value` mebibytes, 1024^2 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
3.mebibyte.to(String)   # => "3.0 MiB"
```

### `gibibyte`

```kex
gibibyte(value: Number) -> Measure
```

`value` gibibytes, 1024^3 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1.gibibyte.convertTo(MiB).map { |m| m.to(String) }   # => Ok("1024.0 MiB")
```

### `tebibyte`

```kex
tebibyte(value: Number) -> Measure
```

`value` tebibytes, 1024^4 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1.tebibyte.to(String)   # => "1.0 TiB"
```

## type `DataUnit`

The data units this module names: decimal (`KB`, `MB`, `GB`, `TB`) and binary (`KiB`, `MiB`, `GiB`, `TiB`), plus the plain byte `B`.

```kex
size(1, KB).canonical    # => 1000.0 bytes
size(1, KiB).canonical   # => 1024.0 bytes
```

**Variants**

  - `B`
  - `KB`
  - `MB`
  - `GB`
  - `TB`
  - `KiB`
  - `MiB`
  - `GiB`
  - `TiB`

Implements [`Unit`](../units.md#trait-unit).

### Functions

#### `factor` (from Unit)

```kex
factor(_)
```

#### `kind` (from Unit)



#### `symbol` (from Unit)

```kex
symbol(_)
```

## type `DataPrefix`

A decimal prefix to render a size at: `Kilo` means KB, `Mega` means MB, `Giga` means GB.

Data prefixes select their standard decimal byte unit, so `Mega` is MB rather than a prefix applied twice to the measure's existing unit.

**Variants**

  - `Kilo`
  - `Mega`
  - `Giga`



## extends `UnitDefinition`

More functions for [`UnitDefinition`](../units.md#record-unitdefinition), added by this module.

Implements [`Unit`](../units.md#trait-unit).

### `factor` (from Unit)



### `kind` (from Unit)



### `symbol` (from Unit)



## extends `Measure`

More functions for [`Measure`](../units.md#record-measure), added by this module.

The same comparison with the data-size threshold on the left.

### `factor`

```kex
factor : Float
```

### `kind`

```kex
kind : Atom
```

### `symbol`

```kex
symbol : String
```

### `<`

```kex
<(other: Integer) -> Bool
```

### `>`

```kex
>(other: Integer) -> Bool
```

### `<=`

```kex
<=(other: Integer) -> Bool
```

### `>=`

```kex
>=(other: Integer) -> Bool
```

## extends `Integer`

More functions for [`Integer`](../number.md#make-integer), added by this module.

Compares an integer byte count with a data-size threshold.

File and binary sizes stay integers. Import this module to use data units directly in comparisons; only data measures are accepted as thresholds.

**Examples**

_Rejecting an oversized file_

```kex
FS.File.size("report.pdf").map { |count| count > 30.megabyte }
```

_Checking a payload_

```kex
Binary.fromBytes([104, 105]).length < 1.kibibyte  # => true
```

### `<`

```kex
<(other: Measure) -> Bool
```

### `>`

```kex
>(other: Measure) -> Bool
```

### `<=`

```kex
<=(other: Measure) -> Bool
```

### `>=`

```kex
>=(other: Measure) -> Bool
```
