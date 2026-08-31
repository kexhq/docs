---
package: prelude
version: "0.4.0-alpha"
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

`Blankable`: types that can be asked whether they hold anything meaningful.

A value is blank when it has no meaningful content: `None`, an empty or all-whitespace string, an empty collection, or `false`. The semantics are Rails's, and the point is the same: one question that works across types, so a validation does not need a different test per field.

```kex
"".blank?        # => true
"   ".blank?     # => true   (unlike "   ".empty?)
[].blank?        # => true
None.blank?      # => true
"hi".present?    # => true
```

`present?` is the negation, and is often what reads better:

```kex
fields.all? { |name, value| value.present? }
```


#### `blank?`

Returns `true` when the value holds nothing meaningful.

What that means is up to each type: whitespace-only for a string, no elements for a collection, `None` for an optional, `false` for a boolean.

```kex
blank? : Bool
```

**Returns**: `Bool` — `true` when the value is blank

**Examples**

```kex
"".blank?      # => true
"  ".blank?    # => true
"hi".blank?    # => false
```

## make `Bool` implements [Blankable](#trait-blankable)



## make `Integer` implements [Blankable](#trait-blankable)


#### `blank?`

Always `false`: every integer is a value, including zero.

```kex
blank? : Bool
```

**Returns**: `Bool` — always `false`

**Examples**

```kex
0.blank?    # => false
42.blank?   # => false
```

## make `Float` implements [Blankable](#trait-blankable)


#### `blank?`

Always `false`: every float is a value, including zero.

```kex
blank? : Bool
```

**Returns**: `Bool` — always `false`

**Examples**

```kex
0.0.blank?   # => false
```

## make `String` implements [Blankable](#trait-blankable)



## make `Optional<X>` implements [Blankable](#trait-blankable)


#### `blank?`

Returns `true` for `None` and `false` for a `Just`: whatever it wraps.

Note that `Just("")` is present, not blank: the optional holds a value, even though that value is itself blank.

```kex
blank? : Bool
```

**Returns**: `Bool` — `true` for `None`

**Examples**

```kex
None.blank?        # => true
Just(1).blank?     # => false
Just("").blank?    # => false
```

## make `[X]` implements [Blankable](#trait-blankable)


#### `blank?`

Returns `true` when the list has no elements.

```kex
blank? : Bool
```

**Returns**: `Bool` — `true` for the empty list

**Examples**

```kex
[].blank?         # => true
[1, 2].blank?     # => false
```
_Reporting an empty result set_

```kex
if matches.blank?
  IO.printLine("no matches")
end
```
