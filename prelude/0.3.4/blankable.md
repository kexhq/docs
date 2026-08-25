---
package: prelude
version: "0.3.4"
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

## trait `Blankable`

Blankable — types that can be checked for blankness (Rails semantics). A value is blank when it has no meaningful content: nil-equivalents, empty strings/whitespace, empty collections.


#### `blank?`

```kex
blank? : Bool
```

## make `Bool` implements [Blankable](#trait-blankable)



## make `Integer` implements [Blankable](#trait-blankable)


#### `blank?`

```kex
blank? : Bool
```

## make `Float` implements [Blankable](#trait-blankable)


#### `blank?`

```kex
blank? : Bool
```

## make `String` implements [Blankable](#trait-blankable)



## make `Optional<X>` implements [Blankable](#trait-blankable)


#### `blank?`

```kex
blank? : Bool
```

## make `[X]` implements [Blankable](#trait-blankable)


#### `blank?`

```kex
blank? : Bool
```
