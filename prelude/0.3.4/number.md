---
package: prelude
version: "0.3.4"
source: number.kex
title: Number
entities:
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: module, name: "Integer" }
  - { kind: module, name: "Float" }
  - { kind: module, name: "Number" }
---

# Number

## make `Integer`


#### `modulo`

Returns `this` modulo `n`. The result has the same sign as `n`, consistent with mathematical modulo (not C remainder).

```kex
modulo(n) : Integer -> Integer
```

**Returns**: `Integer`

**Examples**

```kex
  7.modulo(3)     # => 1
  (-7).modulo(3)  # => 2
```

#### `in?`

Returns `true` if the integer falls within `range` (inclusive).

```kex
in?(range) : Range<Integer> -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  5.in?(1..10)    # => true
  11.in?(1..10)   # => false
```

#### `times`

Calls `f` exactly `this` times, passing the current index (0-based).

```kex
times(block) : (Integer -> Void) -> Void
```

**Returns**: `Void`

**Examples**

```kex
  3.times { |i| IO.printLine(i) }   # prints 0, 1, 2
```

## make `Float`


#### `in?`

Returns `true` if the float falls within `range` (inclusive).

```kex
in?(range) : Range<Float> -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  1.5.in?(1.0..2.0)   # => true
```

## module `Integer`

## function `parse`

Parses `s` in base `radix` (2..36), e.g. `Integer.parse("ff", radix: 16)`. Digits above 9 are accepted in either case.


```kex
parse(s) : String -> Result<Integer, ParseError>
parse(s) : String -> Integer -> Result<Integer, ParseError>
```


## function `parsePrefix`


```kex
parsePrefix(s) : String -> (Integer, String)?
```


## module `Float`

## function `parse`


```kex
parse(s) : String -> Result<Float, ParseError>
```


## function `parsePrefix`


```kex
parsePrefix(s) : String -> (Float, String)?
```


## module `Number`

## function `parse`


```kex
parse(s) : String -> Result<Number, ParseError>
```

