---
package: prelude
version: "0.4.0-rc.4-dev"
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

Types whose values can be asked whether they count as true.

Only `false` and `None` are falsy. Every other value is truthy, including `0`, `""` and `[]`. `if` and `while` take only a `Bool`, so call `truthy?` or `falsy?` to apply this rule; `Assert.truthy` uses it too.

```kex
0.truthy?       # => true
"".truthy?      # => true
[].truthy?      # => true
None.truthy?    # => false
false.truthy?   # => false
```

To ask whether a value is empty, use `Blankable`'s `blank?` and `present?`.

Implemented by [`Bool`](#make-bool), [`Integer`](#make-integer), [`Float`](#make-float), [`String`](#make-string), [`Optional<X>`](#make-optional), [`[X]`](#make-list), [`Map<K, V>`](#make-map).

### Required functions

#### `truthy?`

```kex
truthy? -> Bool
```

Returns `true` unless the value is `false` or `None`.

**Returns**: `true` unless the value is `false` or `None`

**Examples**

```kex
1.truthy?        # => true
None.truthy?     # => false
```



## type `Bool`

Implements [`Blankable`](blankable.md#trait-blankable), [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? -> Bool
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
not -> Bool
```

Returns the negation of this boolean, the same as `!flag`.

It reads better than `!` at the end of a chain.

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

More functions for [`Integer`](number.md#make-integer), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? -> Bool
```

Always returns `true`, including for zero. Write `count == 0` when zero matters.

**Returns**: always `true`

**Examples**

```kex
0.truthy?    # => true
42.truthy?   # => true
```

## extends `Float`

More functions for [`Float`](number.md#make-float), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? -> Bool
```

Always returns `true`, including for zero.

**Returns**: always `true`

**Examples**

```kex
0.0.truthy?   # => true
```

## extends `String`

More functions for [`String`](string.md#make-string), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? -> Bool
```

Always returns `true`, including for the empty string. Use `blank?` to treat an empty or whitespace-only string as nothing.

**Returns**: always `true`

**Examples**

```kex
"".truthy?   # => true
"".blank?    # => true
```

## extends `Optional<X>`

More functions for [`Optional`](optional.md#type-optional), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? -> Bool
```

Returns `true` for a `Just`, even `Just(false)`, and `false` for `None`.

**Returns**: `true` when a value is present

**Examples**

```kex
Just(0).truthy?    # => true
None.truthy?       # => false
```

## extends `[X]`

More functions for [`List`](list.md#type-list), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? -> Bool
```

Always returns `true`, including for the empty list. Use `empty?` or `blank?` to test for an empty list.

**Returns**: always `true`

**Examples**

```kex
[].truthy?   # => true
[].blank?    # => true
```

## extends `Map<K, V>`

More functions for [`Map`](map.md#type-map), added by this module.

Implements [`Truthyable`](#trait-truthyable).

### `truthy?` (from Truthyable)

```kex
truthy? -> Bool
```

Always returns `true`, including for the empty map.

**Returns**: always `true`

**Examples**

```kex
{}.truthy?   # => true
{}.blank?    # => true
```
