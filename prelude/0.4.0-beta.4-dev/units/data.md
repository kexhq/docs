---
package: prelude
version: "0.4.0-beta.4-dev"
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
  IO.printLine(1500.megabytes.to(String))              # prints: 1500.0 MB
  IO.printLine(1500000000.byteSize.to(String, in: Giga)) # prints: 1.5 GB
end
```

Both families are here and they are not the same: `KB` is 1000 bytes, `KiB` is 1024. Values built from either convert freely, because both are counted in bytes underneath, so `1.gibibytes.convertTo(MiB)` answers 1024 MiB.

Every value is a `Measure` from the prelude, so its arithmetic, comparison and `to(String)` apply unchanged.

### `size`

```kex
size(value: Number, unit: DataUnit) -> Measure
```

`value` of the given data unit, as a `Measure`.

The general constructor the named ones below are written on. Reach for `megabytes`, `kibibytes` and friends when the unit is known at the call site.

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
1.gibibytes.convertTo(MiB).map { |m| m.to(String) }   # => Ok("1024.0 MiB")
2.gigabytes.convertTo(MB).map { |m| m.to(String) }    # => Ok("2000.0 MB")
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
FS.File.size(path).map { |n| n.byteSize.to(String, in: Mega) }
```

### `kilobytes`

```kex
kilobytes(value: Number) -> Measure
```

`value` kilobytes, 1000 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
5.kilobytes.to(String)   # => "5.0 KB"
```

### `megabytes`

```kex
megabytes(value: Number) -> Measure
```

`value` megabytes, 1000000 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1500.megabytes.to(String)   # => "1500.0 MB"
```

### `gigabytes`

```kex
gigabytes(value: Number) -> Measure
```

`value` gigabytes, 10^9 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
2.gigabytes.convertTo(MB).map { |m| m.to(String) }   # => Ok("2000.0 MB")
```

### `terabytes`

```kex
terabytes(value: Number) -> Measure
```

`value` terabytes, 10^12 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
2.terabytes.to(String)   # => "2.0 TB"
```

### `kibibytes`

```kex
kibibytes(value: Number) -> Measure
```

`value` kibibytes, 1024 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1024.kibibytes.to(String)   # => "1024.0 KiB"
```

### `mebibytes`

```kex
mebibytes(value: Number) -> Measure
```

`value` mebibytes, 1024^2 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
3.mebibytes.to(String)   # => "3.0 MiB"
```

### `gibibytes`

```kex
gibibytes(value: Number) -> Measure
```

`value` gibibytes, 1024^3 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1.gibibytes.convertTo(MiB).map { |m| m.to(String) }   # => Ok("1024.0 MiB")
```

### `tebibytes`

```kex
tebibytes(value: Number) -> Measure
```

`value` tebibytes, 1024^4 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1.tebibytes.to(String)   # => "1.0 TiB"
```

## type `DataUnit`

The data units this module names: decimal (`KB`, `MB`, `GB`, `TB`) and binary (`KiB`, `MiB`, `GiB`, `TiB`), plus the plain byte `B`.

```kex
1.KB   # 1000 bytes
1.KiB  # 1024 bytes
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

### Methods

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

More methods of [`UnitDefinition`](../units.md#record-unitdefinition), added by this module.

Implements [`Unit`](../units.md#trait-unit).

### `factor` (from Unit)



### `kind` (from Unit)



### `symbol` (from Unit)



## extends `Measure`

More methods of [`Measure`](../units.md#record-measure), added by this module.

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
