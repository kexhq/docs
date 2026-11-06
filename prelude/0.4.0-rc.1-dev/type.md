---
package: prelude
version: "0.4.0-rc.1-dev"
source: type.kex
title: Type
entities:
  - { kind: record, name: "Type" }
  - { kind: module, name: "Type" }
  - { kind: make, name: "Type" }
---

# Type

## record `Type`

Types as values.

`Type.of(x)` answers what a value IS, as something you can hold, print, compare, and take apart:

```kex
Type.of(42)                     # Type { name: "Integer", args: [] }
Type.of([1, 2]).to(String)        # "[Integer]"
Type.of(x) == Type.of(y)        # structural equality, like any record
Type.of(due).fieldNames         # ["year", "month", "day"]
```

The answer comes from the compiler where it can: a checked expression knows things a value cannot carry, such as the unused half of a `Result` or the element type of an empty list. Where the checker has no concrete answer: gradual code, `--no-check`, a value arriving from another process: the value itself is asked instead. That fallback is honest but lossy: an empty list has no element to inspect, and a `Result` only ever holds one side.

**Fields**

  - `name` : [String](string.md#make-string)
  - `args` : [[Type](#record-type)]
  - `pure` : [Bool](truthyable.md#make-bool)

### Functions

Reflection functions on runtime type values.

#### `fields`

```kex
fields : [Type.Field]
```

Returns a record type's fields, in declaration order: each one's name, declared type, and whether a value may leave it out. Anything that is not a record answers with an empty list.

The types are the DECLARED ones, as written: `Integer?` is `Type { name: "Option", args: [Integer] }` and a type parameter keeps its own name. That is what a decoder derived from a record needs: which parser each field takes, and which fields it may skip.

**Returns**: the fields, or `[]`

**Examples**

```kex
Type.of(Point { x: 1, y: 2 }).fields.map(&.name)   # => ["x", "y"]
Type.of(Point { x: 1, y: 2 }).fields.first.map { |f| f.valueType.name }
# => Just("Integer")
Type.of(42).fields                                 # => []
```

_The fields a decoder may leave out_

```kex
Type.of(user).fields.filter { |f| f.optional? || f.default? }.map(&.name)
```

#### `fieldNames`

```kex
fieldNames : [String]
```

Returns a record type's field names, in declaration order: `fields` when only the names matter. Anything that is not a record answers with an empty list.

**Returns**: the field names, or `[]`

**Examples**

```kex
Type.of(Point { x: 1, y: 2 }).fieldNames   # => ["x", "y"]
Type.of(due).fieldNames                    # => ["year", "month", "day"]
```

_Rendering a record generically_

```kex
Type.of(value).fieldNames.map { |name| "${name}: ..." }.join(", ")
```

#### `constructors`

```kex
constructors : [Type.Constructor]
```

Returns a sum type's constructors, in declaration order: each one's name and the declared types of its arguments. Anything that is not a sum type answers with an empty list.

**Returns**: the constructors, or `[]`

**Examples**

```kex
Type.of(Circle(1.0)).constructors.map(&.name)    # => ["Circle", "Square"]
Type.of(Circle(1.0)).constructors.map(&.arity)   # => [1, 2]
Type.of(42).constructors                         # => []
```

#### `constructorNames`

```kex
constructorNames : [String]
```

Returns a sum type's constructor names, in declaration order: `constructors` when only the names matter. Anything that is not a sum type answers with an empty list.

**Returns**: the constructor names, or `[]`

**Examples**

```kex
Type.of(Circle(1.0)).constructorNames   # => ["Circle", "Square"]
```

_Listing what a sum type can be_

```kex
IO.printLine("one of: ${Type.of(shape).constructorNames.join(", ")}")
```

#### `record?`

```kex
record? : Bool
```

Returns `true` when the type is a record: that is, when it has fields.

**Returns**: `true` for a record type

**Examples**

```kex
Type.of(Point { x: 1, y: 2 }).record?   # => true
Type.of(42).record?                     # => false
```

#### `adt?`

```kex
adt? : Bool
```

Returns `true` when the type is a sum type: that is, when it has constructors.

**Returns**: `true` for an ADT

**Examples**

```kex
Type.of(Circle(1)).adt?   # => true
Type.of(42).adt?          # => false
```

#### `to`

```kex
to(_) -> String
```

Renders the type the way it is written in SOURCE, not the way it is stored.

A list reads as `[Integer]`, a tuple as `(Integer, String)`, an optional as `String?`, a map as `{String: Integer}`, and a function as its signature.

**Returns**: the type, as source

**Examples**

```kex
Type.of([1, 2]).to(String)      # => "[Integer]"
Type.of((1, "a")).to(String)    # => "(Integer, String)"
Type.of(Just(1)).to(String)     # => "Integer?"
Type.of("hi").to(String)        # => "String"
```

_An error message that names the type_

```kex
die("cannot serialise a ${Type.of(value).to(String)}")
```

## module `Type`

Building and obtaining `Type` values.

### `of`

```kex
of(value: Any) -> Type
```

Returns the type of `value`.

The entry point to everything else here. Prefer it over matching on the `Type` record directly.

**Parameters**

  - `value` — the value to inspect

**Returns**: its type

**Examples**

```kex
Type.of(42)                # => Type { name: "Integer", args: [] }
Type.of([1, 2]).to(String)   # => "[Integer]"
Type.of("hi").to(String)     # => "String"
```

_Reporting an unexpected value_

```kex
IO.printError("expected a list, got ${Type.of(value).to(String)}")
```

### `named`

```kex
named(name: String) -> Type
```

Builds a type from its name, for comparing against something you already know.

**Parameters**

  - `name` — the type name

**Returns**: the named type

**Examples**

```kex
Type.of(42) == Type.named("Integer")   # => true
```

_Checking that a value came back as expected_

```kex
Type.of(parsed) == Type.named("Date")
```

### `generic`

```kex
generic(name: String, args: [Type]) -> Type
```

Builds a type that takes arguments, from its name and those arguments.

**Parameters**

  - `name` — the type name
  - `args` — its type arguments

**Returns**: the generic type

**Examples**

```kex
Type.of([1]) == Type.generic("List", [Type.named("Integer")])   # => true
```

### `function`

```kex
function(params: [Type], result: Type) -> Type
```

Builds a function type from its parameter types and its result type: in the order a signature is written.

**Parameters**

  - `params` — the parameter types
  - `result` — the result type

**Returns**: the function type

**Examples**

```kex
Type.function([Type.named("String")], Type.named("String")).to(String)
# => "String -> String"
```

### `returnedBy`

```kex
returnedBy(function: Any) -> Type
```

Returns the type a named function returns, as answered by the compiler.

Named functions only. A lambda or a function VALUE carries no signature at runtime, and an overloaded name has no single answer: both are compile errors rather than a guess.

**Parameters**

  - `function` — a named function

**Returns**: its return type

**Examples**

```kex
Type.returnedBy(Date.parse).to(String)   # => "Result<Date, TimeError>"
```

## record `Field`

A record field, as `Type.fields` describes it.

**Fields**

  - `name` : [String](string.md#make-string)
  - `valueType` : [Type](#record-type)
  - `optional?` : [Bool](truthyable.md#make-bool)
  - `default?` : [Bool](truthyable.md#make-bool)



## record `Constructor`

A sum type's constructor, as `Type.constructors` describes it.

**Fields**

  - `name` : [String](string.md#make-string)
  - `arity` : [Integer](number.md#make-integer)
  - `argTypes` : [[Type](#record-type)]


