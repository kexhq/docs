---
package: prelude
version: "0.4.0-beta.4-dev"
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

`Truthyable`: what counts as true when a value is used as a condition.

The rule is Crystal's, and it is short: only `false`, `None` and `()` are falsy. Everything else is truthy, including `0`, `""` and `[]`, which some languages treat as false and Kex deliberately does not.

```kex
0.truthy?       # => true
"".truthy?      # => true
[].truthy?      # => true
None.truthy?    # => false
false.truthy?   # => false
```

When you want the "is there anything here" question instead, that is `Blankable`'s `blank?` / `present?`.

There is no NaN to consider: a float operation that would produce one raises instead, matching BEAM (see nonFiniteFloatError in src/interpreter/value.cxx).

Implemented by [`Bool`](#make-bool), [`Integer`](#make-integer), [`Float`](#make-float), [`String`](#make-string), [`Optional<X>`](#make-optional), [`[X]`](#make-list), [`Map<K, V>`](#make-map).

### Required methods

#### `truthy?`

```kex
truthy? : Bool
```

Returns `true` when the value counts as true in a condition.

**Returns**: `true` unless the value is `false`, `None` or `()`

**Examples**

```kex
1.truthy?        # => true
None.truthy?     # => false
```



## type `Bool`

Implements [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

Returns the boolean itself.

**Returns**: the value

**Examples**

```kex
true.truthy?    # => true
false.truthy?   # => false
```

### `not`

```kex
not : Bool
```

Returns the negation of this boolean.

`!flag` says the same thing, and is the spelling to reach for when the value is already to hand. This one exists for the position `!` cannot take: the end of a chain, where what is being negated is whatever the chain just produced. `falsy?` answers the same question for any `Truthyable` value; `not` is the one that both takes and answers a `Bool`.

**Returns**: `false` for `true`, and `true` for `false`

**Examples**

```kex
true.not    # => false
false.not   # => true
```

_At the end of a chain_

```kex
book.borrowed?.not
```

### Defined in other modules

  - [Blankable](blankable.md#make-bool): [`blank?`](blankable.md#bool-blank?)

## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

Always `true`, including for zero.

Zero is a number, not an absence. Compare it explicitly when zero means something: `count == 0`.

**Returns**: always `true`

**Examples**

```kex
0.truthy?    # => true
42.truthy?   # => true
```

## extends `Float`

More methods of [`Float`](number.md#make-float), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

Always `true`, including for zero.

**Returns**: always `true`

**Examples**

```kex
0.0.truthy?   # => true
```

## extends `String`

More methods of [`String`](string.md#make-string), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

Always `true`, including for the empty string.

Use `blank?` from `Blankable` when an empty or whitespace-only string should count as nothing.

**Returns**: always `true`

**Examples**

```kex
"".truthy?      # => true
"".blank?       # => true   (the question usually meant)
```

## extends `Optional<X>`

More methods of [`Optional`](optional.md#type-optional), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

Returns `true` for a `Just` and `false` for `None`.

The one type where truthiness is genuinely about presence, which is what makes an optional usable directly as a condition.

**Returns**: `true` when a value is present

**Examples**

```kex
Just(0).truthy?    # => true
None.truthy?       # => false
```

## extends `[X]`

More methods of [`List`](list.md#type-list), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

Always `true`, including for the empty list.

Use `empty?` or `blank?` when an empty list should count as nothing.

**Returns**: always `true`

**Examples**

```kex
[].truthy?   # => true
[].blank?    # => true   (the question usually meant)
```

## extends `Map<K, V>`

More methods of [`Map`](map.md#type-map), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? : Bool
```

Always `true`, including for the empty map.

**Returns**: always `true`

**Examples**

```kex
{}.truthy?   # => true
{}.blank?    # => true   (the question usually meant)
```
