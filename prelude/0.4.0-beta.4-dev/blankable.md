---
package: prelude
version: "0.4.0-beta.4-dev"
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

Implemented by [`Bool`](#make-bool), [`Integer`](#make-integer), [`Float`](#make-float), [`String`](#make-string), [`Optional<X>`](#make-optional), [`[X]`](#make-list), [`Map<K, V>`](map.md#make-map), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack).

### Required methods

#### `blank?`

```kex
blank? : Bool
```

Returns `true` when the value holds nothing meaningful.

What that means is up to each type: whitespace-only for a string, no elements for a collection, `None` for an optional, `false` for a boolean.

**Returns**: `true` when the value is blank

**Examples**

```kex
"".blank?      # => true
"  ".blank?    # => true
"hi".blank?    # => false
```



## extends `Bool`

More methods of [`Bool`](truthyable.md#make-bool), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` for `false`: the only blank boolean.

**Returns**: `true` when the value is `false`

**Examples**

```kex
false.blank?   # => true
true.blank?    # => false
```

## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

Always `false`: every integer is a value, including zero.

**Returns**: always `false`

**Examples**

```kex
0.blank?    # => false
42.blank?   # => false
```

## extends `Float`

More methods of [`Float`](number.md#make-float), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

Always `false`: every float is a value, including zero.

**Returns**: always `false`

**Examples**

```kex
0.0.blank?   # => false
```

## extends `String`

More methods of [`String`](string.md#make-string), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` when the string is empty or contains only whitespace.

This is what separates it from `empty?`: a string of spaces is not empty, but it is blank, and for user input that is usually the question being asked.

**Returns**: `true` for an empty or whitespace-only string

**Examples**

```kex
"".blank?        # => true
"   ".blank?     # => true
"\n\t".blank?    # => true
" hi ".blank?    # => false
```

_Rejecting an empty answer_

```kex
let name = IO.getLine.or("")
if name.blank?
  IO.printError("a name is required")
end
```

## extends `Optional<X>`

More methods of [`Optional`](optional.md#type-optional), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` for `None` and `false` for a `Just`: whatever it wraps.

Note that `Just("")` is present, not blank: the optional holds a value, even though that value is itself blank.

**Returns**: `true` for `None`

**Examples**

```kex
None.blank?        # => true
Just(1).blank?     # => false
Just("").blank?    # => false
```

## extends `[X]`

More methods of [`List`](list.md#type-list), added by this module.

Implements [`Blankable`](#trait-blankable).

### `blank?` (from Blankable)

```kex
blank? : Bool
```

Returns `true` when the list has no elements.

**Returns**: `true` for the empty list

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
