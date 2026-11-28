---
package: prelude
version: "0.4.0-rc.5-dev"
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
  - { kind: function, name: "followedBy" }
  - { kind: function, name: "atom?" }
---

# Kex

## trait `Inspectable`

Types that can be written out structurally, for debugging.

The output shows how the value is built: strings in quotes, `Just(...)` around an optional. Use `Showable` for text meant for users.

Every type is inspectable, so `inspected` and `IO.inspect` work on any value. A type that wants a different rendering overrides `inspectValue`.

```kex
[1, 2].inspected       # => "[1, 2]"
Just("hi").inspected   # => "Just(\"hi\")"
```

Implemented by [`Binary`](binary.md#make-binary), [`Date`](date.md#make-date), [`DateTime`](date_time.md#make-datetime), [`Period`](period.md#make-period), [`Time`](time.md#make-time), [`URI`](uri.md#make-uri), [`URL`](uri.md#make-url), [`Headers`](net/http.md#make-headers).

### Provided functions

#### `inspectValue`

```kex
inspectValue(colors: Bool) -> String
```

Writes the value structurally, with ANSI colors when `colors` is true.

`inspected` and `IO.inspect` call it with the console's color setting. Call it directly only to force colors on or off.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered value

**Examples**

```kex
[1, 2].inspectValue(false)   # => "[1, 2]"
```



## trait `Showable`

Types with a short text form for users.

Interpolation, printing and `to(String)` use `Showable`. A string shows without quotes, `Just(x)` shows as `x`, and `None` shows as an empty string. Use `Inspectable` to see a value's structure.

```kex
"hello".showValue          # => "hello"
Just("hello").showValue    # => "hello"
None.showValue             # => ""
```

Implemented by [`Binary`](binary.md#make-binary), [`Complex`](complex.md#make-complex), [`Date`](date.md#make-date), [`DateTime`](date_time.md#make-datetime), [`Optional<Showable>`](#make-optional-showable), [`Result<X, E>`](#make-result), [`Period`](period.md#make-period), [`Regex`](regex.md#make-regex), [`Time`](time.md#make-time), [`TimeError`](time.md#make-timeerror), [`Measure<D>`](units.md#make-measure), [`URI`](uri.md#make-uri), [`URL`](uri.md#make-url), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack), [`Headers`](net/http.md#make-headers).

### Provided functions

#### `showValue`

```kex
showValue -> String
```

Returns the value's text for users.

Implement it for a type whose useful text differs from its structure. Leave out ANSI styling: the text also goes to files and logs.

**Returns**: the display text

#### `to`

```kex
to(String) -> String?
```



## extends `Optional<Showable>`

More functions for [`Optional`](optional.md#type-optional), added by this module.

Implements [`Showable`](#trait-showable).

### `showValue` (from Showable)

```kex
showValue -> String
```

## extends `Result<X, E>`

More functions for [`Result`](optional.md#type-result), added by this module.

Implements [`Showable`](#trait-showable).

Showing a `Result` shows what it carries, so `Ok(42)` shows as `42`, but an `Error` keeps its marker: `Error(bad)`. Without it a failure and a success would print alike.

The marker matches how an error appears inside a collection, `[1, Error(Bad(no))]`, since elements are written structurally. Inspecting a result, or matching on it, is unaffected.

### `showValue` (from Showable)

```kex
showValue -> String
```

## module `Kex`

The running toolchain: its backend, version and optional features.

```kex
Kex.BACKEND                  # => Interpreter
Kex.BACKEND.compiled?        # => false
Kex.VERSION.release          # => "0.4.0"
Kex.Feature.has?(Kex.FileSystem)   # => true
```

### `BACKEND` (constant)

```kex
BACKEND : Backend
```

The backend running this program. Ask it with `interpreted?`, `compiled?` or `beam?`.

**Examples**

```kex
Kex.BACKEND   # => Interpreter
```



### `VERSION` (constant)

```kex
VERSION : Version
```

This build's version.

**Examples**

```kex
Kex.VERSION.major     # => 0
Kex.VERSION.release   # => "0.4.0-alpha.2"
```

_Reporting the version in a tool's output_

```kex
IO.printLine("built with Kex ${Kex.VERSION.number}")
```



### `load` (foul)

```kex
load(path: String) -> Result<LoadedModule, String>
```

Loads the compiled module at `path`, replacing any older version of it already loaded. See `Kex.LoadedModule`.

**Parameters**

  - `path` — a `.beam` file written by `kex --compile`

**Returns**: the module, or why it could not be loaded

**Examples**

```kex
let theme = Kex.load("build/kex_theme.beam").try
```

### `loaded` (foul)

```kex
loaded(name: Atom) -> LoadedModule?
```

Returns the module already loaded under `name`, or `None`.

**Parameters**

  - `name` — the module's BEAM name

**Returns**: the module

**Examples**

_Loading only once_

```kex
let theme = Kex.loaded(:kex_theme).or(Kex.load(path).try)
```

### `hash`

```kex
hash(value: Any) -> Integer
```

Returns a non-cryptographic hash of any value, an `Integer` from 0 to 2^32 - 1 that is the same for equal values.

It is cheap to compute over a large structure, which suits noticing when data has changed. The number is stable only within one running program: it differs between the interpreter and the BEAM and may change between Kex versions, so do not store or send it. Use `Digest` for that, or where someone could choose inputs to collide.

**Parameters**

  - `value` — the value to hash

**Returns**: the hash, from 0 up to 2^32 - 1

**Examples**

_Noticing that a project's files changed_

```kex
let stamp = Kex.hash(paths.map { |path| (path, FS.File.info(path).try) })
```

## type `Backend`

The backend running the program: the tree-walking `Interpreter` or the `Beam` virtual machine.

**Variants**

  - `Interpreter`
  - `Beam`

### Functions

#### `interpreted?`

```kex
interpreted? -> Bool
```

Returns `true` for the tree-walking interpreter.

**Returns**: `true` for `Interpreter`

**Examples**

```kex
Kex.BACKEND.interpreted?   # => true under `kex -R file.kex`
```

#### `compiled?`

```kex
compiled? -> Bool
```

Returns `true` for a backend that runs compiled code, which today is only the BEAM.

**Returns**: `true` for every backend but the interpreter

**Examples**

```kex
Kex.BACKEND.compiled?   # => true under `kex file.kex`
```

#### `beam?`

```kex
beam? -> Bool
```

Returns `true` for the BEAM virtual machine, which the web server and clustering need.

**Returns**: `true` for `Beam`

**Examples**

```kex
Kex.BACKEND.beam?   # => true under `kex file.kex`
```

## type `Feature`

A capability that some builds leave out. Check it with `Kex.Feature.has?` before relying on it.

`FileSystem` means the program can read and write the host's files (`FS`). `ExternalPrograms` means it can run other programs (`Process.run`, `Process.stream`); the browser build cannot.

Kex's own processes (`spawn`, `receive`) exist on every backend. Networking support is reported separately by `Net.Support.current`.

**Variants**

  - `FileSystem`
  - `ExternalPrograms`



## record `Version`

The version of the Kex toolchain running a program, as `Kex.VERSION` holds it. `kex --version` and the REPL banner report the same numbers.

**Examples**

```kex
Kex.VERSION.major      # => 0
Kex.VERSION.revision   # => Just("a1b2c3d")
Kex.VERSION.number     # => "0.4.0 (a1b2c3d)"
```

**Fields**

  - `major` : [Integer](number.md#make-integer)
  - `minor` : [Integer](number.md#make-integer)
  - `patch` : [Integer](number.md#make-integer)
  - `revision` : [String](string.md#make-string)?
  - `preRelease` : [String](string.md#make-string) (optional)

Implements [`Comparable`](comparable.md#trait-comparable).

### Functions

Versions order by release, the way semantic versioning orders them: major, minor and patch numerically, then a pre-release below its release (`0.4.0-rc.1 < 0.4.0`). The revision is build metadata and does not take part, so two builds of one release compare `Equal`.

#### `tuple`

```kex
tuple -> (Integer, Integer, Integer, String?)
```

Returns the major, minor and patch numbers and the revision as a tuple, for destructuring.

**Returns**: major, minor, patch, revision

**Examples**

```kex
let (major, minor, patch, revision) = Kex.VERSION.tuple
major   # => 0
```

#### `release`

```kex
release -> String
```

Returns the version as `0.4.0`, or `0.4.0-rc.1` for a pre-release. Version ranges are matched against this string.

**Returns**: the release string

**Examples**

```kex
Kex.VERSION.release   # => "0.4.0-alpha.2"
```

#### `number`

```kex
number -> String
```

Returns `release` followed by the build revision, if there is one. This is what `kex --version` and the REPL banner print.

**Returns**: the full version string

**Examples**

```kex
Kex.VERSION.number   # => "0.4.0-alpha.2 (219e625)"
```

_Reporting the toolchain in a tool's output_

```kex
IO.printLine("built with Kex ${Kex.VERSION.number}")
```

#### `compare` (from Comparable)

```kex
compare(other: Version) -> Ordering
```

Compares this version with `other` by release.

Pre-release channels compare one dot-separated part at a time: numeric parts numerically, below any named part; named parts as strings; and a channel that runs out first is the lower (`rc < rc.1`).

**Parameters**

  - `other` — the version to compare against

**Returns**: how this version orders against `other`

**Examples**

```kex
Kex.VERSION.compare(Kex.VERSION)   # => Equal
```

_Requiring a minimum toolchain_

```kex
let floor = Kex.Version { major: 0, minor: 4, patch: 0, revision: None }
Kex.VERSION >= floor   # => true
```

### From [`Comparable`](comparable.md#trait-comparable)

  - [`max`](comparable.md#comparable-max) — Returns the larger of this value and `other`, or this value when they are equal.
  - [`min`](comparable.md#comparable-min) — Returns the smaller of this value and `other`, or this value when they are equal.
  - [`clamp`](comparable.md#comparable-clamp) — Returns this value limited to `low`..`high`: `low` when it is below, `high` when it is above, and the value itself otherwise.
  - [`<`](comparable.md#comparable-op-lt) — Returns `true` when this value orders before `other`.
  - [`>`](comparable.md#comparable-op-gt) — Returns `true` when this value orders after `other`.
  - [`<=`](comparable.md#comparable-op-lt-eq) — Returns `true` when this value orders before `other` or equal to it.
  - [`>=`](comparable.md#comparable-op-gt-eq) — Returns `true` when this value orders after `other` or equal to it.

## record `LoadedModule`

A compiled module loaded into the running program by `Kex.load`.

It is for programs that pick their code at run time, such as a site generator rendering a theme's templates or a plugin host. Compile the source once with `kex --compile -o <dir>`, then load the `.beam` and call into it as often as needed.

Top-level declarations of `<stem>.kex` compile into the module `kex_<stem>`, in `kex_<stem>.beam`. Give each generated file a distinct name, or put its declarations inside a `module`, whose functions compile into `Kex.<Name>`.

Only the BEAM backend can load modules; under the interpreter `Kex.load` returns an `Error`.

```kex
let theme = Kex.load("cache/kex_theme_3f2a.beam").try
let html = theme.call(:render, [context]).try
```

**Fields**

  - `name` : [Atom](atom.md#make-atom)

### Functions

#### `call` (foul)

```kex
call(function: Atom, arguments: [Any]) -> Result<Any, String>
```

Calls the module's function `function` with `arguments`.

A failure inside the call returns an `Error` describing it, as does a function the module does not export with that many arguments. A `foul` function takes a hidden extra argument for its capabilities, so only pure functions can be called this way.

**Parameters**

  - `function` — the function's name
  - `arguments` — its arguments, in order

**Returns**: what the function returned, or why the call failed

**Examples**

```kex
theme.call(:render, [context])   # => Ok("<html>...")
```

## module `Kex.Feature`

Which optional capabilities this build includes. Networking is reported separately by `Net.Support`.

### `has?`

```kex
has?(f: Feature) -> Bool
```

Returns `true` when this build includes `f`.

**Parameters**

  - `f` — the capability to ask about

**Returns**: `true` when it is available

**Examples**

```kex
Kex.Feature.has?(Kex.ExternalPrograms)   # => true, except in a browser
```

### `list` (constant)

```kex
list : [Feature]
```

Returns every optional capability this build includes.

**Examples**

```kex
Kex.Feature.list   # => [FileSystem, ExternalPrograms]
```



## module `Kex.Interface`

Reading the typed public surface of a compiled Kex module.

### `read`

```kex
read(path: FS.FilePath) -> Any?
```

Reads the typed public interface stored in a compiled Kex module. Returns `None` when the file does not exist, is not a `.beam` file, or has no interface chunk.

The term is a tree of tuples, lists, atoms, integers and strings, read with pattern matching and `Tuple.items`.

**Parameters**

  - `path` — the compiled .beam file to read

**Returns**: the decoded interface term, or `None`

**Examples**

```kex
Kex.Interface.read("build/runtime/beam/kex_prelude.beam")
```

## function `inspected`

```kex
inspected(value: Inspectable) -> String
```

Returns the structural text of any value, the form the REPL echoes.

To print a value in the middle of a pipeline, use `inspect` instead.

**Parameters**

  - `value` — any value

**Returns**: its rendered form

**Examples**

```kex
[1, 2].inspected            # => "[1, 2]"
{ a: 1 }.inspected          # => "{ a: 1 }"
{ "a": 1 }.inspected        # => "{ \"a\": 1 }"
Just("hi").inspected        # => "Just(\"hi\")"
```

_Putting a rendering into a message_

```kex
IO.printError("unexpected value: ${value.inspected}")
```

## function `inspect`

```kex
inspect(value: A) -> A
```

Prints `value` and its type to stderr and returns `value` unchanged, so it can go anywhere in a pipeline. The same as `IO.inspect`.

**Parameters**

  - `value` — the value to show

**Returns**: the same value, unchanged

**Examples**

```kex
[1, 2, 3, 4].map { |n| n * 3 }.inspect.filter(~even?)
# stderr: [3, 6, 9, 12] : [Integer]
# => [6, 12]
```

## function `followedBy`

```kex
followedBy(f: (A -> B), g: (B -> C)) -> A -> C
```

Returns a function that applies `f`, then `g` to what `f` returned.

**Parameters**

  - `f` — the function applied first
  - `g` — the function applied to what `f` returns

**Returns**: the composed function

**Examples**

```kex
let inc(n: Integer) -> Integer = n + 1
let double(n: Integer) -> Integer = n * 2

(~inc).followedBy(~double)(3)   # => 8
(~double).followedBy(~inc)(3)   # => 7
```

_Building a step for +map+_

```kex
[1, 2].map((~double).followedBy { |n| "#${n}" })   # => ["#2", "#4"]
```

## function `atom?`

```kex
atom?(value: A) -> Bool
```

Returns `true` when `value` is an atom, such as `:ok`. Universal: reachable on every type through UFCS, so it answers where the static type is `Any`. A `Bool`, `None` and a constructor such as `Red` are values of their own types, not atoms.

On the BEAM a constructor is spelled as an atom of its name, so an atom written like one of the program's constructors or type names (`:Red` next to `type Color = Red | Green`) answers as that constructor or type would, just as `Type.of` does. Lower-case atoms never collide.

**Parameters**

  - `value` — any value

**Returns**: whether the value is an atom

**Examples**

```kex
:ok.atom?      # => true
"ok".atom?     # => false
true.atom?     # => false
```
