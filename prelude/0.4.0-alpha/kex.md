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

Types that can be rendered structurally, for a person reading output.

The rendering shows the value's STRUCTURE: quotes on strings, `Just(...)` around an optional, which is what makes it right for debugging and wrong for user-facing text. `Showable` is the other half of that pair.

Every type is inspectable through a structural fallback, so `inspected` and `IO.inspect` work on anything; a type that wants a different rendering overrides `inspectValue`.

```kex
[1, 2].inspected       # => "[1, 2]"
Just("hi").inspected   # => "Just(\"hi\")"
```


#### `inspectValue`

Renders the value structurally, with ANSI colors when `colors` is true.

`inspected` and `IO.inspect` call this for you, passing the console's own color setting: call it directly only when you need to force one.

```kex
inspectValue : Bool -> String
```

**Returns**: `String` — the rendered value

**Examples**

```kex
[1, 2].inspectValue(false)   # => "[1, 2]"
```

## trait `Showable`

Types that have a concise, user-facing text representation.

`Showable` is used by interpolation, printing, and `to(String)`. Its output should describe the value itself rather than its implementation structure: a string is shown without quotes, `Just(x)` is shown as `x`, and `None` is shown as an empty string. Use `Inspectable` when debugging structure matters.

```kex
"hello".showValue          # => "hello"
Just("hello").showValue    # => "hello"
None.showValue             # => ""
```


#### `showValue`

Returns the value's user-facing text representation.

Implement this for domain types whose useful presentation differs from their structural rendering. Keep the result free of ANSI styling so it is safe in files, logs, and interpolation as well as on a terminal.

```kex
showValue : String
```

**Returns**: `String` — the display text

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

The same for Result, with one deliberate asymmetry: SHOWING a result shows what it carries, so `Ok(42)` reads as `42` rather than leaking the wrapper into text, but an `Error` keeps its marker. Dropping it made a failure and a success print identically, and unlike `None` (which shows as "", visibly not a value) there would be nothing left to tell them apart.

The marker is spelled `Error(...)`, matching how the same value renders as an ELEMENT of a collection: `[1, Error(Bad(no))]`. Elements render structurally rather than through showValue (as in Ruby, where `nil.to_s` is "" but `[nil].to_s` is "[nil]"), so this is the one spelling that reads the same at both levels.

What functions RETURN is unchanged: `Integer.parse` still answers with a Result, `IO.inspect` still shows `Ok(42)`, and both arms are still matchable.


#### `showValue`

```kex
showValue(@Ok(x))
```

## module `Kex`

The running toolchain, which backend, which version, which features.

```kex
Kex.BACKEND                  # => Interpreter
Kex.Kernel.VERSION.release   # => "0.4.0"
Kex.Feature.has?(Kex.FS)     # => true
```

## type `Backend`

Which backend is executing the program: the tree-walking `Interpreter`, or the `Beam` virtual machine.



**Variants**

  - `Interpreter`
  - `Beam`

## type `Feature`

An optional capability a build may or may not include. Ask about one with `Kex.Feature.has?` before relying on it.



**Variants**

  - `FS`
  - `Process`

## constant `BACKEND`

Which backend is executing this program.

`interpreted?` and `underBeam?` below are the readable way to ask.



## constant `interpreted?`

Returns `true` when running on the tree-walking interpreter.



## constant `underBeam?`

Returns `true` when running on the BEAM.

The backend a program is on decides what is available: processes and the web server need the BEAM (`kex -R file.kex`).



## module `Kex.Kernel`

Build identity for the compiler and runtime executing this program.

Useful in bug reports, generated artifacts, and compatibility checks where `Kex.BACKEND` alone is not enough to identify the toolchain.

## record `Version`

The toolchain a program is running on. `kex --version` and the REPL banner report the same numbers.

`revision` is the git commit the compiler was built from: `None` when it was built from a source archive rather than a checkout, which is why it is an Optional rather than a String.

**Fields**

  - `major` : Integer
  - `minor` : Integer
  - `patch` : Integer
  - `revision` : String?
  - `preRelease` : String (optional)

## make `Version`



## constant `VERSION`

This build's version.



## module `Kex.Feature`

Which optional capabilities this build includes.

Optional non-network capabilities in this build. Networking has its own granular opt-in `Net.Support` report.

## function `has?`

Returns `true` when this build includes `f`.


```kex
has?(f) : Feature -> Bool
```


## constant `list`

Every optional capability this build includes.



## module `Kex.Interface`

Reading the typed public surface of a compiled Kex module.

## function `read`

Reads the KexI interface chunk of a compiled Kex module: its typed public surface, and answers the decoded term, or None when the file has no such chunk, does not exist, or is not a BEAM artifact.

The term is an ordinary tree of tuples, lists, atoms, integers and strings, so it is walked with normal pattern matching and `Tuple.items`. This exists so that reading it needs no `Erlang.*` interop: it is the one intentional entry point rather than a general term decoder.


```kex
read(path) : FS.FilePath -> Any?
```


## function `inspected`

Returns the pretty-printed representation of any value as a STRING: the same form the REPL echoes. Universal: reachable on every type through UFCS.

Named apart from `inspect`, which prints and returns its INPUT so it can be dropped into a pipeline. Both spellings used to be called `inspect`, and which one a call reached depended on whether it was written `x.inspect` or `IO.inspect(x)`, so `[1, 2].inspect.count` answered 24, the length of the rendered string, rather than 2.


```kex
inspected(value)
```


## function `inspect`

Prints the pretty-printed form of `value` to stderr and returns `value` unchanged, so it can be dropped into any pipeline without changing what flows through it. The same operation as `IO.inspect`, reachable by UFCS.


```kex
inspect(value) : A -> A
```

