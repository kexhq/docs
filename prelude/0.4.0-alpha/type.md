---
package: prelude
version: "0.4.0-alpha"
source: type.kex
title: Type
entities:
  - { kind: record, name: "Type" }
  - { kind: module, name: "Type" }
  - { kind: make, name: "Type" }
---

# Type

## record `Type`

Types as values.

`Type.of(x)` answers what a value IS, as something you can hold, print, compare, and take apart:

  Type.of(42)                     # Type { name: "Integer", args: [] }   Type.of([1, 2]).toString        # "[Integer]"   Type.of(x) == Type.of(y)        # structural equality, like any record   Type.of(due).fields             # ["year", "month", "day"]

The answer comes from the compiler where it can: a checked expression knows things a value cannot carry, such as the unused half of a `Result` or the element type of an empty list. Where the checker has no concrete answer — gradual code, `--no-check`, a value arriving from another process — the value itself is asked instead. That fallback is honest but lossy: an empty list has no element to inspect, and a `Result` only ever holds one side.

**Fields**

  - `name` : String
  - `args` : [Type]
  - `pure` : Bool

## module `Type`

## function `of`

What this value is. Prefer this over matching on the record directly.


```kex
of(value)
```


## function `named`

Builds a type by name, for comparing against something you already know: `Type.of(x) == Type.named("Date")`.


```kex
named(name)
```


## function `generic`

The same, for a type that takes arguments: `Type.of([1]) == Type.generic("List", [Type.named("Integer")])`. Renamed from `Type.with` when `with` became the capability-substitution keyword (kexhq/kex#143).


```kex
generic(name, args)
```


## function `function`

A function type: parameters followed by the result, the way a signature is written — `Type.function([Type.named("String")], Type.named("String"))`.


```kex
function(params, result)
```


## function `returnedBy`

The type a named function returns, answered by the compiler:

  Type.returnedBy(Date.parse).toString   # "Result<Date, TimeError>"

Named functions only. A lambda or a function VALUE carries no signature at runtime, and an overloaded name has no single answer — both are compile errors rather than a guess.


```kex
returnedBy(function)
```


## make `Type`

Everything else is a METHOD, not a module function: a module function is only reachable through UFCS in the interpreter, so `Type.of(x).fields` worked there and raised on BEAM.


