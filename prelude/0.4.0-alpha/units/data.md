---
package: prelude
version: "0.4.0-alpha"
source: units/data.kex
title: Units.Data
entities:
  - { kind: module, name: "Units.Data" }
---

# Units.Data

## module `Units.Data`

Data sizes: bytes, kilobytes, and their binary counterparts.

Opt-in — nothing here is in scope until `using Units.Data`.

  using Units.Data

  main do     IO.printLine(1500.megabytes.to(String))              # prints: 1500.0 MB     IO.printLine(1500000000.byteSize.to(String, in: Giga)) # prints: 1.5 GB   end

Both families are here and they are not the same: `KB` is 1000 bytes, `KiB` is 1024. Values built from either convert freely, because both are counted in bytes underneath — so `1.gibibytes.convertTo(MiB)` answers 1024 MiB.

Every value is a `Measure` from the prelude, so its arithmetic, comparison and `to(String)` apply unchanged.

## type `DataUnit`

The data units this module names: decimal (`KB`, `MB`, `GB`, `TB`) and binary (`KiB`, `MiB`, `GiB`, `TiB`), plus the plain byte `B`.

  1.KB   # 1000 bytes   1.KiB  # 1024 bytes



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

## type `DataPrefix`

A decimal prefix to render a size at: `Kilo` means KB, `Mega` means MB, `Giga` means GB.

Data prefixes select their standard decimal byte unit, so `Mega` is MB rather than a prefix applied twice to the measure's existing unit.



**Variants**

  - `Kilo`
  - `Mega`
  - `Giga`

## make `DataUnit` implements [Unit](../units.md#trait-unit)


#### `factor`

```kex
factor(@B)
```

#### `symbol`

```kex
symbol(@B)
```

## make `UnitDefinition` implements [Unit](../units.md#trait-unit)



## make `Measure`



## function `size`

`value` of the given data unit, as a `Measure`.

The general constructor the named ones below are written on. Reach for `megabytes`, `kibibytes` and friends when the unit is known at the call site.


```kex
size(value, unit)
```


## function `convertTo`

Converts a size to another data unit.

Decimal and binary units convert freely, because both are counted in bytes underneath. A measure of some other dimension is an `Error`.


```kex
convertTo(measure, unit)
```


## function `to`

Renders a size at a chosen decimal prefix.

Data prefixes select their standard decimal byte unit. They are targets for formatting, so `Mega` means MB rather than a prefix applied twice to the measure's existing unit. A measure that is not a data size answers `None`.


```kex
to(measure, String, in)
```


## function `byteSize`

`value` bytes.

Named `byteSize` rather than `bytes`, which `String` already uses for its UTF-8 encoding.


```kex
byteSize(value)
```


## function `kilobytes`

`value` kilobytes, 1000 bytes each.


```kex
kilobytes(value)
```


## function `megabytes`

`value` megabytes, 1000000 bytes each.


```kex
megabytes(value)
```


## function `gigabytes`

`value` gigabytes, 10^9 bytes each.


```kex
gigabytes(value)
```


## function `terabytes`

`value` terabytes, 10^12 bytes each.


```kex
terabytes(value)
```


## function `kibibytes`

`value` kibibytes, 1024 bytes each.


```kex
kibibytes(value)
```


## function `mebibytes`

`value` mebibytes, 1024^2 bytes each.


```kex
mebibytes(value)
```


## function `gibibytes`

`value` gibibytes, 1024^3 bytes each.


```kex
gibibytes(value)
```


## function `tebibytes`

`value` tebibytes, 1024^4 bytes each.


```kex
tebibytes(value)
```

