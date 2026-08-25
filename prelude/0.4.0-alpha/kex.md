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


#### `inspectValue`

```kex
inspectValue : Bool -> String
```

## trait `Showable`


#### `showValue`

```kex
showValue : String
```

## make `Inspectable`

Structural fallback: the runtime only decomposes the value; implementation selection and overrides remain ordinary Kex trait dispatch.


#### `inspectValue`

```kex
inspectValue(colors)
```

## make `Showable`

Current non-colored presentation for the primitive and standard compound types registered as Showable. Domain types can replace this with what their users care about (Time, Date, and DateTime do so in time.kex).


#### `to`

```kex
to(String)
```

## make `Optional<Showable>` implements Showable


#### `showValue`

```kex
showValue(@Just(x))
```

## make `Result<X, E>` implements Showable

The same for Result, with one deliberate asymmetry: SHOWING a result shows what it carries, so `Ok(42)` reads as `42` rather than leaking the wrapper into text — but an `Error` keeps its marker. Dropping it made a failure and a success print identically, and unlike `None` (which shows as "", visibly not a value) there would be nothing left to tell them apart.

The marker is spelled `Error(...)`, matching how the same value renders as an ELEMENT of a collection — `[1, Error(Bad(no))]`. Elements render structurally rather than through showValue (as in Ruby, where `nil.to_s` is "" but `[nil].to_s` is "[nil]"), so this is the one spelling that reads the same at both levels.

What functions RETURN is unchanged: `Integer.parse` still answers with a Result, `IO.inspect` still shows `Ok(42)`, and both arms are still matchable.


#### `showValue`

```kex
showValue(@Ok(x))
```

## module `Kex`

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

## constant `BACKEND`



## constant `interpreted?`



## constant `underBeam?`



## module `Kex.Kernel`

## record `Version`

The toolchain a program is running on. `kex --version` and the REPL banner report the same numbers.

`revision` is the git commit the compiler was built from — `None` when it was built from a source archive rather than a checkout, which is why it is an Optional rather than a String.

**Fields**

  - `major` : Integer
  - `minor` : Integer
  - `patch` : Integer
  - `revision` : String?
  - `preRelease` : String (optional)

## make `Version`



## constant `VERSION`



## module `Kex.Feature`

## function `has?`


```kex
has?(f) : Feature -> Bool
```


## constant `list`



## module `Kex.Interface`

Returns the pretty-printed representation of any value as a STRING — the same form the REPL echoes. Universal: reachable on every type through UFCS.

Named apart from `inspect`, which prints and returns its INPUT so it can be dropped into a pipeline. Both spellings used to be called `inspect`, and which one a call reached depended on whether it was written `x.inspect` or `IO.inspect(x)` — so `[1, 2].inspect.count` answered 24, the length of the rendered string, rather than 2.

## function `read`

Reads the KexI interface chunk of a compiled Kex module — its typed public surface — and answers the decoded term, or None when the file has no such chunk, does not exist, or is not a BEAM artifact.

The term is an ordinary tree of tuples, lists, atoms, integers and strings, so it is walked with normal pattern matching and `Tuple.items`. This exists so that reading it needs no `Erlang.*` interop: it is the one intentional entry point rather than a general term decoder.


```kex
read(path) : FS.FilePath -> Any?
```


## function `inspected`


```kex
inspected(value)
```


## function `inspect`

Prints the pretty-printed form of `value` to stderr and returns `value` unchanged, so it can be dropped into any pipeline without changing what flows through it. The same operation as `IO.inspect`, reachable by UFCS.


```kex
inspect(value) : A -> A
```

