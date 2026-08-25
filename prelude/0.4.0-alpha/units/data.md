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

## type `DataUnit`



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


```kex
size(value, unit)
```


## function `convertTo`


```kex
convertTo(measure, unit)
```


## function `to`

Data prefixes select their standard decimal byte unit.  They are targets for formatting, so `Mega` means MB rather than a prefix applied twice to the measure's existing unit.


```kex
to(measure, String, in)
```


## function `byteSize`


```kex
byteSize(value)
```


## function `kilobytes`


```kex
kilobytes(value)
```


## function `megabytes`


```kex
megabytes(value)
```


## function `gigabytes`


```kex
gigabytes(value)
```


## function `terabytes`


```kex
terabytes(value)
```


## function `kibibytes`


```kex
kibibytes(value)
```


## function `mebibytes`


```kex
mebibytes(value)
```


## function `gibibytes`


```kex
gibibytes(value)
```


## function `tebibytes`


```kex
tebibytes(value)
```

