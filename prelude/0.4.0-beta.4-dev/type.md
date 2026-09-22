---
package: prelude
version: "0.4.0-beta.4-dev"
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
Type.of(due).fields             # ["year", "month", "day"]
```

The answer comes from the compiler where it can: a checked expression knows things a value cannot carry, such as the unused half of a `Result` or the element type of an empty list. Where the checker has no concrete answer: gradual code, `--no-check`, a value arriving from another process: the value itself is asked instead. That fallback is honest but lossy: an empty list has no element to inspect, and a `Result` only ever holds one side.

**Fields**

  - `name` : String
  - `args` : [Type]
  - `pure` : Bool

## module `Type`

Building and obtaining `Type` values.

## function `of`

Returns the type of `value`.

The entry point to everything else here. Prefer it over matching on the `Type` record directly.


```kex
of(value)
```


## function `named`

Builds a type from its name, for comparing against something you already know.


```kex
named(name)
```


## function `generic`

Builds a type that takes arguments, from its name and those arguments.

Renamed from `Type.with` when `with` became the capability-substitution keyword (kexhq/kex#143).


```kex
generic(name, args)
```


## function `function`

Builds a function type from its parameter types and its result type: in the order a signature is written.


```kex
function(params, result)
```


## function `returnedBy`

Returns the type a named function returns, as answered by the compiler.

Named functions only. A lambda or a function VALUE carries no signature at runtime, and an overloaded name has no single answer: both are compile errors rather than a guess.


```kex
returnedBy(function)
```


## make `Type`

Everything else is a METHOD, not a module function: a module function is only reachable through UFCS in the interpreter, so `Type.of(x).fields` worked there and raised on BEAM.


#### `fields`

Returns a record type's field names, in declaration order. Anything that is not a record answers with an empty list.

Reads the layout the compiler already ships to the runtime for display; there is no separate metadata to keep in step.

```kex
fields : [String]
```

**Returns**: `[String]` — the field names, or `[]`

**Examples**

```kex
Type.of(Point { x: 1, y: 2 }).fields   # => ["x", "y"]
Type.of(42).fields                     # => []
```
_Rendering a record generically_

```kex
Type.of(value).fields.map { |name| "${name}: ..." }.join(", ")
```

#### `constructors`

Returns an ADT's constructor names. Anything that is not an ADT answers with an empty list.

```kex
constructors : [String]
```

**Returns**: `[String]` — the constructor names, or `[]`

**Examples**

```kex
Type.of(Circle(1)).constructors   # => ["Circle", "Square"]
Type.of(42).constructors          # => []
```
_Listing what a sum type can be_

```kex
IO.printLine("one of: ${Type.of(shape).constructors.join(", ")}")
```

#### `record?`

Returns `true` when the type is a record: that is, when it has fields.

```kex
record? : Bool
```

**Returns**: `Bool` — `true` for a record type

**Examples**

```kex
Type.of(Point { x: 1, y: 2 }).record?   # => true
Type.of(42).record?                     # => false
```

#### `adt?`

Returns `true` when the type is a sum type: that is, when it has constructors.

```kex
adt? : Bool
```

**Returns**: `Bool` — `true` for an ADT

**Examples**

```kex
Type.of(Circle(1)).adt?   # => true
Type.of(42).adt?          # => false
```

#### `to`

Renders the type the way it is written in SOURCE, not the way it is stored.

A list reads as `[Integer]`, a tuple as `(Integer, String)`, an optional as `String?`, a map as `{String: Integer}`, and a function as its signature.

```kex
to(String)
```

**Returns**: `String` — the type, as source

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
