---
package: prelude
version: "0.3.3"
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

Truthyable — types that can be checked for boolean truthiness (Crystal semantics). Only false, None, and () (Void) are falsy; everything else is truthy. There is no NaN to consider: a float operation that would produce one raises instead, matching BEAM (see nonFiniteFloatError in src/interpreter/value.cxx).

## trait `Truthyable`

Implemented by [`Bool`](#make-bool), [`Integer`](#make-integer), [`Float`](#make-float), [`String`](#make-string), [`Optional<X>`](#make-optional), [`[X]`](#make-list), [`Map<K, V>`](#make-map).

### Required methods

#### `truthy?`

```kex
truthy? : Bool
```



## extends `Bool`

More methods of [`Bool`](blankable.md#make-bool), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

## extends `Float`

More methods of [`Float`](number.md#make-float), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

## extends `String`

More methods of [`String`](algebra.md#make-string), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

## extends `Optional<X>`

More methods of [`Optional`](optional.md#type-optional), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

## extends `[X]`

More methods of [`List`](list.md#type-list), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

## extends `Map<K, V>`

More methods of [`Map`](map.md#type-map), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```
