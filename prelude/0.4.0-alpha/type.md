---
package: prelude
version: "0.4.0-alpha"
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
Type.of([1, 2]).toString        # "[Integer]"
Type.of(x) == Type.of(y)        # structural equality, like any record
Type.of(due).fields             # ["year", "month", "day"]
```

The answer comes from the compiler where it can: a checked expression knows things a value cannot carry, such as the unused half of a `Result` or the element type of an empty list. Where the checker has no concrete answer — gradual code, `--no-check`, a value arriving from another process — the value itself is asked instead. That fallback is honest but lossy: an empty list has no element to inspect, and a `Result` only ever holds one side.

**Fields**

  - `name` : [String](string.md#make-string)
  - `args` : [[Type](#record-type)]
  - `pure` : [Bool](blankable.md#make-bool)

### Methods

Everything else is a METHOD, not a module function: a module function is only reachable through UFCS in the interpreter, so `Type.of(x).fields` worked there and raised on BEAM.

#### `fields`

```kex
fields : [String]
```

The field names of a record type, in declaration order, or [] for anything else. Reads the layout the compiler already ships to the runtime for display; no separate metadata.

#### `constructors`

```kex
constructors : [String]
```

The constructor names of an ADT, or [] for anything else.

#### `record?`

```kex
record? : Bool
```

"does this have fields" and "does this have constructors".

#### `adt?`

```kex
adt? : Bool
```

#### `toString`

```kex
toString : String
```

The type as it is written in SOURCE, not as it is stored: a list is `[Integer]`, a tuple `(Integer, String)`, an optional `String?`.

## module `Type`

### `of`

```kex
of(value: Any) -> Type
```

What this value is. Prefer this over matching on the record directly.

### `named`

```kex
named(name: String) -> Type
```

Builds a type by name, for comparing against something you already know: `Type.of(x) == Type.named("Date")`.

### `generic`

```kex
generic(name: String, args: [Type]) -> Type
```

The same, for a type that takes arguments: `Type.of([1]) == Type.generic("List", [Type.named("Integer")])`. Renamed from `Type.with` when `with` became the capability-substitution keyword (kexhq/kex#143).

### `function`

```kex
function(params: [Type], result: Type) -> Type
```

A function type: parameters followed by the result, the way a signature is written — `Type.function([Type.named("String")], Type.named("String"))`.

### `returnedBy`

```kex
returnedBy(function: Any) -> Type
```

The type a named function returns, answered by the compiler:

```kex
Type.returnedBy(Date.parse).toString   # "Result<Date, TimeError>"
```

Named functions only. A lambda or a function VALUE carries no signature at runtime, and an overloaded name has no single answer — both are compile errors rather than a guess.
