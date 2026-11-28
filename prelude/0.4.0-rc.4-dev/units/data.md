---
package: prelude
version: "0.4.0-rc.4-dev"
source: units/data.kex
title: Units.Data
entities:
  - { kind: module, name: "Units.Data" }
---

# Units.Data

## module `Units.Data`

Data sizes: bytes, kilobytes, and their binary counterparts.

Nothing here is in scope until `using Units.Data`.

```kex
using Units.Data

main do
  IO.printLine(1500.megabyte.to(String))              # prints: 1500.0 MB
  IO.printLine(1500000000.byte.to(String, in: GB).or("")) # prints: 1.5 GB
end
```

There are two families of units: `KB` is 1000 bytes and `KiB` is 1024. Every size is counted in bytes, so the two convert into each other: `1.gibibyte.convertTo(MiB)` gives 1024 MiB.

The constructors have singular names, as in `Units.SI`: `5.megabyte`, `2.mebibyte`. `byteSize` is another name for `byte`.

File and payload functions return plain integer byte counts. Wrap a count with `byte` to convert or display it:

```kex
FS.File.size("report.pdf").map { |n| n.byte.showValue }
Binary.fromBytes([104, 105]).length.byte.to(String)  # => Just("2.0 B")
"é".bytes.count.byte.to(String)                    # => Just("2.0 B")
```

To display a size in a particular unit, name the unit:

```kex
1048576.byte.to(String, in: MiB)                           # => Just("1.0 MiB")
4312.byte.to(String, in: KB, format: Number.format`#.#`)   # => Just("4.3 KB")
1048576.byte.convertTo(MiB).map { |m| m.showValue }        # => Ok("1.0 MiB")
```

An integer byte count compares directly with a data size:

```kex
30000001 > 30.megabyte   # => true
1048576 <= 1.mebibyte    # => true
```

`<`, `>`, `<=` and `>=` work with the count on either side. Comparing a count with a measure that is not a data size, such as a time, fails an assertion.

Every size is a prelude `Measure`, so measure arithmetic and `to(String)` work on it.

### `size`

```kex
size(value: Number, unit: DataUnit) -> Measure<Quantity.Data>
```

Returns a size of `value` in the given data unit.

Use it when the unit is chosen at run time. When it is known in the code, `megabyte`, `kibibyte` and the other named constructors read better.

**Parameters**

  - `value` — the quantity
  - `unit` — the unit it is counted in

**Returns**: the size

**Examples**

```kex
size(4096, B).to(String)     # => Just("4096.0 B")
size(1.5, MB).to(String)     # => Just("1.5 MB")
```

### `convertTo`

```kex
convertTo(measure: Measure<D>, unit: DataUnit) -> Result<Measure<D>, String>
```

Converts a size to another data unit.

Decimal and binary units convert into each other. A measure that is not a data size, such as a time, gives an `Error`.

**Parameters**

  - `measure` — the size to convert
  - `unit` — the unit to convert to

**Returns**: the converted size, or why it could not be converted

**Examples**

```kex
1.gibibyte.convertTo(MiB).map { |m| m.showValue }   # => Ok("1024.0 MiB")
2.gigabyte.convertTo(MB).map { |m| m.showValue }    # => Ok("2000.0 MB")
```

### `byteSize`

```kex
byteSize(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` bytes; the same as `byte`.

It is not called `bytes` because `String.bytes` already gives a string's UTF-8 encoding.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
4096.byteSize.to(String)   # => Just("4096.0 B")
```

_Reporting a file's size_

```kex
FS.File.size("report.pdf").map { |n| n.byte.showValue }
```

### `byte`

```kex
byte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` bytes.

Use it to wrap byte counts from `FS.File.size` or `Binary.length`.

**Parameters**

  - `value` — the byte count

**Returns**: the size

**Examples**

_A binary payload's size_

```kex
let payload = Binary.fromBytes([104, 105])
payload.length.byte.to(String)   # => Just("2.0 B")
```

### `kilobyte`

```kex
kilobyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` kilobytes, 1000 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
5.kilobyte.to(String)   # => Just("5.0 KB")
```

### `megabyte`

```kex
megabyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` megabytes, 1000000 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1500.megabyte.to(String)   # => Just("1500.0 MB")
```

### `gigabyte`

```kex
gigabyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` gigabytes, 10^9 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
2.gigabyte.convertTo(MB).map { |m| m.showValue }   # => Ok("2000.0 MB")
```

### `terabyte`

```kex
terabyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` terabytes, 10^12 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
2.terabyte.to(String)   # => Just("2.0 TB")
```

### `kibibyte`

```kex
kibibyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` kibibytes, 1024 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1024.kibibyte.to(String)   # => Just("1024.0 KiB")
```

### `mebibyte`

```kex
mebibyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` mebibytes, 1024^2 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
3.mebibyte.to(String)   # => Just("3.0 MiB")
```

### `gibibyte`

```kex
gibibyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` gibibytes, 1024^3 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1.gibibyte.convertTo(MiB).map { |m| m.showValue }   # => Ok("1024.0 MiB")
```

### `tebibyte`

```kex
tebibyte(value: Number) -> Measure<Quantity.Data>
```

Returns a size of `value` tebibytes, 1024^4 bytes each.

**Parameters**

  - `value` — the quantity

**Returns**: the size

**Examples**

```kex
1.tebibyte.to(String)   # => Just("1.0 TiB")
```

## type `DataUnit`

The data units: decimal (`KB`, `MB`, `GB`, `TB`), binary (`KiB`, `MiB`, `GiB`, `TiB`), and the byte `B`. A size's `canonical` value is in bytes.

```kex
size(1, KB).canonical    # => 1000.0
size(1, KiB).canonical   # => 1024.0
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
factor -> Float
```

#### `kind` (from Unit)

```kex
kind -> Atom
```

#### `symbol` (from Unit)

```kex
symbol -> String
```

## extends `UnitDefinition`

More functions for [`UnitDefinition`](../units.md#record-unitdefinition), added by this module.

Implements [`Unit`](../units.md#trait-unit).

### `factor` (from Unit)

```kex
factor -> Float
```

### `kind` (from Unit)

```kex
kind -> Atom
```

### `symbol` (from Unit)

```kex
symbol -> String
```

## extends `Measure`

More functions for [`Measure`](../units.md#record-measure), added by this module.

Adds `to(String, in:)` for this module's units, to display a size in a chosen data unit.

### `factor`

```kex
factor -> Float
```

### `kind`

```kex
kind -> Atom
```

### `symbol`

```kex
symbol -> String
```

### `to`

```kex
to(String: Type, in: DataUnit, format: NumberFormat) -> String?
```

Renders a size in the given data unit, decimal or binary.

A measure that is not a data size gives `None`.

**Parameters**

  - `String` — the target type
  - `in` — the unit to display in

**Returns**: the rendered size, or `None`

**Examples**

```kex
1500000000.byte.to(String, in: GB)   # => Just("1.5 GB")
1048576.byte.to(String, in: MiB)     # => Just("1.0 MiB")
1.second.to(String, in: MB)          # => None
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

Lets an integer byte count be compared with a data size.

File and binary sizes are plain integers; with this module imported they compare directly against sizes such as `30.megabyte`. A measure that is not a data size fails an assertion.

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
<(other: Measure<D>) -> Bool
```

### `>`

```kex
>(other: Measure<D>) -> Bool
```

### `<=`

```kex
<=(other: Measure<D>) -> Bool
```

### `>=`

```kex
>=(other: Measure<D>) -> Bool
```
