---
package: prelude
version: "0.4.0-alpha"
source: kex.kex
title: Kex
entities:
  - { kind: trait, name: "Inspectable" }
  - { kind: trait, name: "Showable" }
  - { kind: make, name: "Inspectable" }
  - { kind: make, name: "Showable" }
  - { kind: make, name: "Optional<Showable>" }
  - { kind: make, name: "Result<X, E>" }
  - { kind: module, name: "Kex" }
  - { kind: module, name: "Kex.Interface" }
  - { kind: function, name: "inspected" }
  - { kind: function, name: "inspect" }
---

# Kex

## trait `Inspectable`

### Provided methods

#### `inspectValue`

```kex
inspectValue : Bool -> String
```



## trait `Showable`

Implemented by [`Optional<Showable>`](#make-optional-showable), [`Result<X, E>`](#make-result), [`Set<A>`](set.md#make-set), [`UnorderedSet<A>`](set.md#make-unorderedset).

### Provided methods

#### `showValue`

```kex
showValue : String
```

#### `to`

```kex
to(_)
```



## extends `Optional<Showable>`

More methods of [`Optional`](optional.md#type-optional), added by this module.

Implements [`Showable`](#trait-showable).

### `showValue` (from Showable)

```kex
showValue(_)
```

## extends `Result<X, E>`

More methods of [`Result`](optional.md#type-result), added by this module.

Implements [`Showable`](#trait-showable).

The same for Result, with one deliberate asymmetry: SHOWING a result shows what it carries, so `Ok(42)` reads as `42` rather than leaking the wrapper into text — but an `Error` keeps its marker. Dropping it made a failure and a success print identically, and unlike `None` (which shows as "", visibly not a value) there would be nothing left to tell them apart.

The marker is spelled `Error(...)`, matching how the same value renders as an ELEMENT of a collection — `[1, Error(Bad(no))]`. Elements render structurally rather than through showValue (as in Ruby, where `nil.to_s` is "" but `[nil].to_s` is "[nil]"), so this is the one spelling that reads the same at both levels.

What functions RETURN is unchanged: `Integer.parse` still answers with a Result, `IO.inspect` still shows `Ok(42)`, and both arms are still matchable.

### `showValue` (from Showable)

```kex
showValue(_)
```

## module `Kex`

### `BACKEND` (constant)

```kex
BACKEND : Backend
```



### `interpreted?` (constant)



### `underBeam?` (constant)



## type `Backend`

**Variants**

  - `Interpreter`
  - `Beam`



## type `Feature`

**Variants**

  - `Http`
  - `FS`
  - `Process`
  - `WebServer`



## module `Kex.Kernel`

### `VERSION` (constant)

```kex
VERSION : Version
```



## record `Version`

The toolchain a program is running on. `kex --version` and the REPL banner report the same numbers.

`revision` is the git commit the compiler was built from — `None` when it was built from a source archive rather than a checkout, which is why it is an Optional rather than a String.

**Examples**

```kex
Kex.Kernel.VERSION.major        # => 0
Kex.Kernel.VERSION.revision     # => Just("a1b2c3d")
Kex.Kernel.VERSION.to(String)   # => "0.3.0 (a1b2c3d)"
```

**Fields**

  - `major` : [Integer](number.md#make-integer)
  - `minor` : [Integer](number.md#make-integer)
  - `patch` : [Integer](number.md#make-integer)
  - `revision` : [String](string.md#make-string)?
  - `preRelease` : [String](string.md#make-string) (optional)

### Methods

#### `tuple`

```kex
tuple : (Integer, Integer, Integer, String?)
```

The three numbers, without the revision.

`to(String)` — the language's conversion protocol, and what this should really be — is deliberately NOT defined here: a second `to(String)` implementation anywhere in the prelude breaks type-directed `to` dispatch for every prelude type on BEAM, so adding one here silently broke `3.kilo.watt.to(String)`. Pinned by spec/prelude_to_string_dispatch.kex; restore this as `to(String)` once that dispatcher is fixed.

The same four values as a tuple, for destructuring. A tuple cannot carry accessors of its own — there is no named type for a `make` block to target — so the record is the value and this is the view.

**Examples**

```kex
Kex.Kernel.VERSION.number       # => "0.3.0"
```

```kex
let (major, minor, patch, revision) = Kex.Kernel.VERSION.tuple
```

#### `release`

```kex
release : String
```

`0.4.0`, or `0.4.0-rc.1` on a pre-release build. What a version RANGE is matched against, so the channel has to be in it.

#### `number`

```kex
number : String
```

## module `Kex.Feature`

### `has?`

```kex
has?(f: Feature) -> Bool
```

### `list` (constant)

```kex
list : [Feature]
```



## module `Kex.Interface`

Returns the pretty-printed representation of any value as a STRING — the same form the REPL echoes. Universal: reachable on every type through UFCS.

Named apart from `inspect`, which prints and returns its INPUT so it can be dropped into a pipeline. Both spellings used to be called `inspect`, and which one a call reached depended on whether it was written `x.inspect` or `IO.inspect(x)` — so `[1, 2].inspect.count` answered 24, the length of the rendered string, rather than 2.

**Examples**

```kex
[1, 2].inspected          # => "[1, 2]"
{ a: 1 }.inspected        # => "{ a: 1 }"
Just("hi").inspected      # => "Just(\"hi\")"
```

### `read`

```kex
read(path: FS.FilePath) -> Any?
```

Reads the KexI interface chunk of a compiled Kex module — its typed public surface — and answers the decoded term, or None when the file has no such chunk, does not exist, or is not a BEAM artifact.

The term is an ordinary tree of tuples, lists, atoms, integers and strings, so it is walked with normal pattern matching and `Tuple.items`. This exists so that reading it needs no `Erlang.*` interop: it is the one intentional entry point rather than a general term decoder.

**Examples**

```kex
Kex.Interface.read("build/runtime/beam/kex_prelude.beam")
```

## function `inspected`

```kex
inspected(value: Inspectable)
```

## function `inspect`

```kex
inspect(value: A) -> A
```

Prints the pretty-printed form of `value` to stderr and returns `value` unchanged, so it can be dropped into any pipeline without changing what flows through it. The same operation as `IO.inspect`, reachable by UFCS.

**Examples**

```kex
xs.map(~double).inspect.filter(~even?)
```
