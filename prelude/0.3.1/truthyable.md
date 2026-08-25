---
package: prelude
version: "0.3.1"
source: truthyable.kex
title: Truthyable
entities:
  - { kind: trait, name: "Truthyable" }
  - { kind: make, name: "Bool" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: make, name: "String" }
  - { kind: make, name: "Optional<X>" }
  - { kind: make, name: "[X]" }
  - { kind: make, name: "Map<K, V>" }
---

# Truthyable

## trait `Truthyable`

Truthyable — types that can be checked for boolean truthiness (Crystal semantics). Only false, None, and () (Void) are falsy; everything else is truthy. There is no NaN to consider: a float operation that would produce one raises instead, matching BEAM (see nonFiniteFloatError in src/interpreter/value.cxx).


#### `truthy?`

```kex
truthy? : Bool
```

## make `Bool` implements [Truthyable](#trait-truthyable)



## make `Integer` implements [Truthyable](#trait-truthyable)


#### `truthy?`

```kex
truthy? : Bool
```

## make `Float` implements [Truthyable](#trait-truthyable)


#### `truthy?`

```kex
truthy? : Bool
```

## make `String` implements [Truthyable](#trait-truthyable)


#### `truthy?`

```kex
truthy? : Bool
```

## make `Optional<X>` implements [Truthyable](#trait-truthyable)


#### `truthy?`

```kex
truthy? : Bool
```

## make `[X]` implements [Truthyable](#trait-truthyable)


#### `truthy?`

```kex
truthy? : Bool
```

## make `Map<K, V>` implements [Truthyable](#trait-truthyable)


#### `truthy?`

```kex
truthy? : Bool
```
