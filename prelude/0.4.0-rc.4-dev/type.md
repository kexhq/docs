---
package: prelude
version: "0.4.0-rc.4-dev"
source: type.kex
title: Type
entities:
  - { kind: record, name: "Type" }
  - { kind: module, name: "Type" }
  - { kind: make, name: "Type.Field" }
  - { kind: make, name: "Type<T>" }
---

# Type

## record `Type<T>`

Types as values.

`Type.of(x)` returns the type of a value as a record you can print, compare and take apart:

```kex
Type.of(42)                  # => Type { args: [], name: "Integer", pure?: true }
Type.of([1, 2]).to(String)   # => Just("[Integer]")
Type.of(x) == Type.of(y)     # compares like any record
Type.of(due).fieldNames      # => ["year", "month", "day"]
```

Where it can, the answer comes from the type checker, which knows things a value does not carry, such as the error type of an `Ok` or the element type of an empty list. Where the checker has no concrete type (untyped code, `--no-check`, a value received from another process), the value itself is inspected, and that answer is less complete: an empty list has no element to look at, and a `Result` holds only one side.

**Fields**

  - `name` : [String](string.md#make-string)
  - `args` : [[Type](#record-type)]
  - `pure?` : [Bool](truthyable.md#make-bool)

### Functions

Reflection functions on runtime type values.

#### `fields`

```kex
fields -> [Type.Field]
```

Returns a record type's fields in declaration order, or `[]` for anything that is not a record.

Each field has its name, its declared type and whether it may be left out. The types are as declared: `Integer?` is `Type { name: "Option", args: [Integer] }`, and a type parameter keeps its own name.

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
fieldNames -> [String]
```

Returns a record type's field names in declaration order, or `[]` for anything that is not a record.

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
constructors -> [Type.Constructor]
```

Returns a sum type's constructors in declaration order, each with its name and argument types, or `[]` for anything that is not a sum type.

**Returns**: the constructors, or `[]`

**Examples**

```kex
Type.of(Circle(1.0)).constructors.map(&.name)    # => ["Circle", "Square"]
Type.of(Circle(1.0)).constructors.map(&.arity)   # => [1, 2]
Type.of(42).constructors                         # => []
```

#### `constructorNames`

```kex
constructorNames -> [String]
```

Returns a sum type's constructor names in declaration order, or `[]` for anything that is not a sum type.

**Returns**: the constructor names, or `[]`

**Examples**

```kex
Type.of(Circle(1.0)).constructorNames   # => ["Circle", "Square"]
```

_Listing what a sum type can be_

```kex
IO.printLine("one of: ${Type.of(shape).constructorNames.join(", ")}")
```

#### `constructorValues`

```kex
constructorValues -> [String]
```

Returns the stored spelling of each constructor without arguments, in snake case and declaration order: `ReadOnly` is `"read_only"`.

#### `constructorValue`

```kex
constructorValue(value: Any) -> String?
```

Returns the stored spelling of `value`, a constructor of this type without arguments, or `None` when it is not one.

#### `construct`

```kex
construct(values: {String: Any}) -> Result<T, String>
```

Builds a record of this type from a map of field names to values.

Use it in a library that maps data it does not define, such as database rows, decoded JSON or form fields, onto the caller's records. A field missing from `values` takes its default, or `None` when it is optional. A missing required field, a key that names no field and a value of the wrong type are each an error naming the field. Values are not converted: `"5"` is not an `Integer`, so convert first, with `Type.Field.parse` or `"5".to(Integer)`.

**Parameters**

  - `values` — the field values, by field name

**Returns**: the record, or what was wrong. It is a `User` for `Type.of(User)`; for a type found by name (`Type.named`) the checker cannot know `T`, and the value is checked where it is used

**Examples**

```kex
Type.named("User").construct({"id": "u1", "email": "ada@example.com"})
# => Ok(User { admin?: false, email: "ada@example.com", id: "u1" })
Type.named("User").construct({"id": "u1", "mail": "x"})
# => Error("unknown field \"mail\" for User")
```

#### `variant`

```kex
variant(name: String, args: [Any]) -> Result<T, String>
```

Builds the value of this sum type's constructor `name` from its arguments, for example turning `"Direct"` read from a database back into `Direct`.

The arguments are checked against the constructor's declared types and number.

**Parameters**

  - `name` — the constructor's name, as `constructorNames` lists it
  - `args` — its arguments; leave them out for a nullary constructor

**Returns**: the value, or what was wrong

**Examples**

```kex
Type.named("Kind").variant("Direct")         # => Ok(Direct)
Type.named("Shape").variant("Circle", [2.0]) # => Ok(Circle(2.0))
Type.named("Kind").variant("Nope")           # => Error("Kind has no constructor Nope")
```

#### `parse`

```kex
parse(text: String) -> Result<T, String>
```

Parses `text` as a value of this type, for turning text from a database cell, form field or query parameter into a value for `construct`.

`String`, `Integer`, `Float`, `Bool` (`"true"` or `"false"`) and `Char` (one character) are read as written. `T?` parses a `T` and wraps it in `Just`; no text parses as `None`, so leave an absent value out of `construct`'s map. A constructor without arguments is read from its exact name, its name in any case, or its snake-case spelling: `"channel"` is `Channel` and `"read_only"` is `ReadOnly`. A spelling that matches more than one constructor is an error.

**Parameters**

  - `text` — the text to read

**Returns**: the value, or why `text` is not one

**Examples**

```kex
Type.named("Integer").parse("42")    # => Ok(42)
Type.named("Integer").parse("4x")    # => Error("expected Integer, got \"4x\"")
Type.named("Kind").parse("channel")  # => Ok(Channel)
```

#### `nullaryNamed`

```kex
nullaryNamed(text: String) -> String?
```

The nullary constructor `text` names, including its snake-case value. Exact constructor names take precedence; a normalized spelling must be unambiguous.

#### `record?`

```kex
record? -> Bool
```

Returns `true` when the type is a record with at least one field.

**Returns**: `true` for a record type

**Examples**

```kex
Type.of(Point { x: 1, y: 2 }).record?   # => true
Type.of(42).record?                     # => false
```

#### `adt?`

```kex
adt? -> Bool
```

Returns `true` when the type is a sum type.

**Returns**: `true` for an ADT

**Examples**

```kex
Type.of(Circle(1)).adt?   # => true
Type.of(42).adt?          # => false
```

#### `to`

```kex
to(String) -> String?
```

Returns the type as it is written in source, always wrapped in `Just`.

A list reads as `[Integer]`, a tuple as `(Integer, String)`, an optional as `String?`, a map as `{String: Integer}`, and a function as its signature.

**Returns**: the type, as source

**Examples**

```kex
Type.of([1, 2]).to(String)      # => Just("[Integer]")
Type.of((1, "a")).to(String)    # => Just("(Integer, String)")
Type.of(Just(1)).to(String)     # => Just("Integer?")
Type.of("hi").to(String)        # => Just("String")
```

_An error message that names the type_

```kex
die("cannot serialise a ${Type.of(value)}")
```

#### `showValue`

```kex
showValue -> String
```

Returns the type as it is written in source. String interpolation uses this.

**Returns**: the type, as source

**Examples**

```kex
"${Type.of([1, 2])}"   # => "[Integer]"
```

## module `Type`

Building and obtaining `Type` values.

### `of`

```kex
of(value: A) -> Type<A>
```

Returns the type of `value`.

The name of a record or sum type, used as a value, stands for the type itself: `Type.of(User)` is `User`'s type. A library can take a `Type<T>` parameter this way and so learn its `T` from the caller.

**Parameters**

  - `value` — the value to inspect

**Returns**: its type, from the checker where it has one

**Examples**

```kex
Type.of(42)                  # => Type { args: [], name: "Integer", pure?: true }
Type.of([1, 2]).to(String)   # => Just("[Integer]")
Type.of("hi").to(String)     # => Just("String")
```

_Reporting an unexpected value_

```kex
IO.printError("expected a list, got ${Type.of(value).to(String)}")
```

_Taking a type from the caller_

```kex
let select(as: Type<T>) -> Result<[T], String> do
  ...                            # rows decoded with as.construct
end
select(as: User)                 # a Result<[User], String>
```

### `named`

```kex
named(name: String) -> Type
```

Returns the type with this name and no arguments, for comparing with `Type.of`.

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

Returns the type with this name and these type arguments.

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

Returns the function type with these parameter types and result type.

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

Returns the return type of a named function, as the checker sees it.

Only a named function works. Passing a lambda, a function held in a variable or an overloaded name is a compile error.

**Parameters**

  - `function` — a named function

**Returns**: its return type

**Examples**

```kex
Type.returnedBy(Date.parse).to(String)   # => "Result<Date, TimeError>"
```

### `fieldValues`

```kex
fieldValues(value: Any) -> [Any]?
```

Returns a record's field values in declaration order, or `None` for anything that is not a record.

The order is that of `Type.of(record).fields`, so the two zip into name/value pairs. This lets generic code such as an encoder read a record without knowing its type. A tuple is not a record; use its `items`.

**Parameters**

  - `value` — the record to read

**Returns**: its field values, or `None`

**Examples**

```kex
Type.fieldValues(Point { x: 1, y: 2 })   # => Just([1, 2])
Type.fieldValues((1, 2))                 # => None
```

_A record as a map from field names_

```kex
Type.of(user).fields.map(&.name).zip(Type.fieldValues(user).or([]))
```

### `parsed`

```kex
parsed(_: Any?, _expected: Type, _text: String) -> Result<Any, String>
```

Turns the result of a text conversion into a `Result`, with an error naming `expected` and `text` when the conversion gave `None`.

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



## type `Type.Field`

### `parse`

```kex
parse(text: String) -> Result<Any, String>
```

Parses `text` as a value of this field's declared type, as `Type.parse` does, with the field's name in the error.

Use it to turn text from a database row or a form into the typed values `construct` takes.

**Parameters**

  - `text` — the text to read

**Returns**: the value, or why `text` is not one

**Examples**

```kex
Type.named("User").fields.first.map { |field| field.parse("u1") }
# => Just(Ok("u1"))
```


