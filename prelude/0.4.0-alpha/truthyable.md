---
package: prelude
version: "0.4.0-alpha"
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


#### `truthy?`

Returns `true` when the value counts as true in a condition.

```kex
truthy? : Bool
```

**Returns**: `Bool` — `true` unless the value is `false`, `None` or `()`

**Examples**

```kex
1.truthy?        # => true
None.truthy?     # => false
```

## make `Bool` implements [Truthyable](#trait-truthyable)



## make `Integer` implements [Truthyable](#trait-truthyable)


#### `truthy?`

Always `true`, including for zero.

Zero is a number, not an absence. Compare it explicitly when zero means something: `count == 0`.

```kex
truthy? : Bool
```

**Returns**: `Bool` — always `true`

**Examples**

```kex
0.truthy?    # => true
42.truthy?   # => true
```

## make `Float` implements [Truthyable](#trait-truthyable)


#### `truthy?`

Always `true`, including for zero.

```kex
truthy? : Bool
```

**Returns**: `Bool` — always `true`

**Examples**

```kex
0.0.truthy?   # => true
```

## make `String` implements [Truthyable](#trait-truthyable)


#### `truthy?`

Always `true`, including for the empty string.

Use `blank?` from `Blankable` when an empty or whitespace-only string should count as nothing.

```kex
truthy? : Bool
```

**Returns**: `Bool` — always `true`

**Examples**

```kex
"".truthy?      # => true
"".blank?       # => true   (the question usually meant)
```

## make `Optional<X>` implements [Truthyable](#trait-truthyable)


#### `truthy?`

Returns `true` for a `Just` and `false` for `None`.

The one type where truthiness is genuinely about presence, which is what makes an optional usable directly as a condition.

```kex
truthy? : Bool
```

**Returns**: `Bool` — `true` when a value is present

**Examples**

```kex
Just(0).truthy?    # => true
None.truthy?       # => false
```

## make `[X]` implements [Truthyable](#trait-truthyable)


#### `truthy?`

Always `true`, including for the empty list.

Use `empty?` or `blank?` when an empty list should count as nothing.

```kex
truthy? : Bool
```

**Returns**: `Bool` — always `true`

**Examples**

```kex
[].truthy?   # => true
[].blank?    # => true   (the question usually meant)
```

## make `Map<K, V>` implements [Truthyable](#trait-truthyable)


#### `truthy?`

Always `true`, including for the empty map.

```kex
truthy? : Bool
```

**Returns**: `Bool` — always `true`

**Examples**

```kex
{}.truthy?   # => true
{}.blank?    # => true   (the question usually meant)
```
