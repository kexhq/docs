---
package: prelude
version: "0.3.1"
source: blankable.kex
title: Blankable
entities:
  - { kind: trait, name: "Blankable" }
  - { kind: make, name: "Bool" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: make, name: "String" }
  - { kind: make, name: "Optional<X>" }
  - { kind: make, name: "[X]" }
---

# Blankable

Blankable — types that can be checked for blankness (Rails semantics). A value is blank when it has no meaningful content: nil-equivalents, empty strings/whitespace, empty collections.

## trait `Blankable`

Implemented by [`Bool`](#make-bool), [`Integer`](#make-integer), [`Float`](#make-float), [`String`](#make-string), [`Optional<X>`](#make-optional), [`[X]`](#make-list), [`Map<K, V>`](map.md#make-map).

### Required methods

#### `blank?`

```kex
blank? : Bool
```



## type `Bool`

Implements [`Blankable`](#trait-blankable), [`Truthyable`](truthyable.md#trait-truthyable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

### Defined in other modules

  - [Truthyable](truthyable.md#make-bool): [`truthy?`](truthyable.md#bool-truthy?)

## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

## extends `Float`

More methods of [`Float`](number.md#make-float), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

## extends `String`

More methods of [`String`](algebra.md#make-string), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

## extends `Optional<X>`

More methods of [`Optional`](optional.md#type-optional), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

## extends `[X]`

More methods of [`List`](list.md#type-list), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```
