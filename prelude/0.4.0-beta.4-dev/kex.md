---
package: prelude
version: "0.4.0-beta.4-dev"
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

Implemented by [`Binary`](binary.md#make-binary), [`Period`](time.md#make-period), [`Date`](time.md#make-date), [`Time`](time.md#make-time), [`DateTime`](time.md#make-datetime), [`URI`](uri.md#make-uri), [`URL`](uri.md#make-url), [`Headers`](net/http.md#make-headers).

### Provided methods

#### `inspectValue`

```kex
inspectValue(colors: Bool) -> String
```

Renders the value structurally, with ANSI colors when `colors` is true.

`inspected` and `IO.inspect` call this for you, passing the console's own color setting: call it directly only when you need to force one.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered value

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

Implemented by [`Binary`](binary.md#make-binary), [`Optional<Showable>`](#make-optional-showable), [`Result<X, E>`](#make-result), [`Period`](time.md#make-period), [`Date`](time.md#make-date), [`Time`](time.md#make-time), [`DateTime`](time.md#make-datetime), [`Measure`](units.md#make-measure), [`URI`](uri.md#make-uri), [`URL`](uri.md#make-url), [`Queue<A>`](data/queue.md#make-queue), [`Set<A>`](data/set.md#make-set), [`UnorderedSet<A>`](data/set.md#make-unorderedset), [`Stack<A>`](data/stack.md#make-stack), [`Headers`](net/http.md#make-headers).

### Provided methods

#### `showValue`

```kex
showValue : String
```

Returns the value's user-facing text representation.

Implement this for domain types whose useful presentation differs from their structural rendering. Keep the result free of ANSI styling so it is safe in files, logs, and interpolation as well as on a terminal.

**Returns**: the display text

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

The same for Result, with one deliberate asymmetry: SHOWING a result shows what it carries, so `Ok(42)` reads as `42` rather than leaking the wrapper into text, but an `Error` keeps its marker. Dropping it made a failure and a success print identically, and unlike `None` (which shows as "", visibly not a value) there would be nothing left to tell them apart.

The marker is spelled `Error(...)`, matching how the same value renders as an ELEMENT of a collection: `[1, Error(Bad(no))]`. Elements render structurally rather than through showValue (as in Ruby, where `nil.to_s` is "" but `[nil].to_s` is "[nil]"), so this is the one spelling that reads the same at both levels.

What functions RETURN is unchanged: `Integer.parse` still answers with a Result, `IO.inspect` still shows `Ok(42)`, and both arms are still matchable.

### `showValue` (from Showable)

```kex
showValue(_)
```

## module `Kex`

The running toolchain, which backend, which version, which features.

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

Which backend is executing this program.

Its `interpreted?`, `compiled?` and `beam?` are the readable way to ask.

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



### `load`

```kex
load(path: String) -> Result<LoadedModule, String>
```

Loads the compiled module at `path`, replacing an older version of it that is already loaded. See `Kex.LoadedModule`.

**Parameters**

  - `path` — a `.beam` file written by `kex --compile`

**Returns**: the module, or why it could not be

**Examples**

```kex
let theme = Kex.load("build/kex_theme.beam").try
```

### `loaded`

```kex
loaded(name: Atom) -> LoadedModule?
```

The module already loaded under `name`, or `None` when there is none.

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

A non-cryptographic hash of any value: a non-negative `Integer` below 2^32, the same for equal values.

Cheap to compute over a whole structure, with no string built along the way, which suits fingerprinting data to notice when it changed. It is stable only within one running program: the number differs between the interpreter and the BEAM, and may change between Kex versions, so never store it or send it anywhere. Use `Digest` for that, or for anything an adversary could choose collisions for.

**Parameters**

  - `value` — the value to hash

**Returns**: the hash, from 0 up to 2^32 - 1

**Examples**

_Noticing that a project's files changed_

```kex
let stamp = Kex.hash(paths.map { |path| (path, FS.File.info(path).try) })
```

## type `Backend`

Which backend is executing the program: the tree-walking `Interpreter`, or the `Beam` virtual machine.

**Variants**

  - `Interpreter`
  - `Beam`

### Methods

#### `interpreted?`

```kex
interpreted? : Bool
```

Whether this is the tree-walking interpreter.

**Returns**: `true` for `Interpreter`

**Examples**

```kex
Kex.BACKEND.interpreted?   # => true under `kex -R file.kex`
```

#### `compiled?`

```kex
compiled? : Bool
```

Whether this backend runs compiled code: today, the BEAM.

**Returns**: `true` for every backend but the interpreter

**Examples**

```kex
Kex.BACKEND.compiled?   # => true under `kex file.kex`
```

#### `beam?`

```kex
beam? : Bool
```

Whether this is the BEAM virtual machine. Processes, the web server and clustering need it.

**Returns**: `true` for `Beam`

**Examples**

```kex
Kex.BACKEND.beam?   # => true under `kex file.kex`
```

## type `Feature`

An optional capability a build may or may not include. Ask about one with `Kex.Feature.has?` before relying on it.

`FileSystem`: the program can read and write the host's files (`FS`). `ExternalPrograms`: it can run other programs (`Process.run`, `Process.stream`), which the browser build cannot.

Kex's own processes (`spawn`, `receive`) are not optional: every backend has them. Networking has its finer-grained report, `Net.Support.current`.

**Variants**

  - `FileSystem`
  - `ExternalPrograms`



## record `Version`

Build identity for the compiler and runtime executing this program: `Version` and `VERSION` below.

Useful in bug reports, generated artifacts, and compatibility checks where `Kex.BACKEND` alone is not enough to identify the toolchain. The toolchain a program is running on. `kex --version` and the REPL banner report the same numbers.

`revision` is the git commit the compiler was built from: `None` when it was built from a source archive rather than a checkout, which is why it is an Optional rather than a String.

**Examples**

```kex
Kex.VERSION.major        # => 0
Kex.VERSION.revision     # => Just("a1b2c3d")
Kex.VERSION.to(String)   # => "0.3.0 (a1b2c3d)"
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

The version's four values as a tuple, for destructuring.

A tuple cannot carry accessors of its own: there is no named type for a `make` block to target, so the record is the value and this is the view.

**Returns**: major, minor, patch, revision

**Examples**

```kex
let (major, minor, patch, revision) = Kex.VERSION.tuple
major   # => 0
```

#### `release`

```kex
release : String
```

The three numbers, plus the pre-release channel when there is one.

`0.4.0`, or `0.4.0-rc.1` on a pre-release build. What a version RANGE is matched against, so the channel has to be in it.

**Returns**: the release string

**Examples**

```kex
Kex.VERSION.release   # => "0.4.0-alpha.2"
```

#### `number`

```kex
number : String
```

The release string with the build revision after it, when there is one.

This is what `kex --version` and the REPL banner print.

`to(String)`: the language's conversion protocol, and what this should really be: is deliberately NOT defined here: a second `to(String)` implementation anywhere in the prelude breaks type-directed `to` dispatch for every prelude type on BEAM, so adding one here silently broke `3.kilo.watt.to(String)`. Pinned by spec/prelude_to_string_dispatch.kex; restore this as `to(String)` once that dispatcher is fixed.

**Returns**: the full version string

**Examples**

```kex
Kex.VERSION.number   # => "0.4.0-alpha.2 (219e625)"
```

_Reporting the toolchain in a tool's output_

```kex
IO.printLine("built with Kex ${Kex.VERSION.number}")
```

## record `LoadedModule`

A compiled module loaded into the running program by `Kex.load`.

For a program that decides at run time what code it needs: a site generator rendering a theme's templates, a plugin host. Compile the source with `kex --compile -o <dir>` once, then load the `.beam` and call it as often as needed, without starting another VM for every call (kexhq/kex#399).

Every entry module is named after its file (`kex_<stem>.beam` for `<stem>.kex`), and so is everything declared at the top level of that file. A `let render = Template.html(Kex.embed(path))` written outside any `module` therefore lands in `kex_<stem>`, not in a module the file names; give each generated file a distinct name, or put the declaration inside a `module`, whose functions compile into `Kex.<Name>`.

The BEAM backend only: under the interpreter, `Kex.load` answers an error.

```kex
let theme = Kex.load("cache/kex_theme_3f2a.beam").try
let html = theme.call(:render, [context]).try
```

**Fields**

  - `name` : [Atom](atom.md#make-atom)

### Methods

#### `call`

```kex
call(function: Atom, arguments: [Any]) -> Result<Any, String>
```

Calls the module's function `function` with `arguments`.

A failure inside the call is an `Error` describing it, not a crash of the caller, and so is a function the module does not export with that many arguments. A `foul` function takes one argument more than it declares, its capabilities, so call pure functions this way.

**Parameters**

  - `function` — the function's name
  - `arguments` — its arguments, in order

**Returns**: what the function returned, or why the

**Examples**

```kex
theme.call(:render, [context])   # => Ok("<html>...")
```

## module `Kex.Feature`

Which optional capabilities this build includes.

Optional non-network capabilities in this build. Networking has its own granular opt-in `Net.Support` report.

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

Every optional capability this build includes.

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

Reads the KexI interface chunk of a compiled Kex module: its typed public surface, and answers the decoded term, or None when the file has no such chunk, does not exist, or is not a BEAM artifact.

The term is an ordinary tree of tuples, lists, atoms, integers and strings, so it is walked with normal pattern matching and `Tuple.items`. This exists so that reading it needs no `BEAM.*` interop: it is the one intentional entry point rather than a general term decoder.

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

Returns the pretty-printed representation of any value as a STRING: the same form the REPL echoes. Universal: reachable on every type through UFCS.

Named apart from `inspect`, which prints and returns its INPUT so it can be dropped into a pipeline. Both spellings used to be called `inspect`, and which one a call reached depended on whether it was written `x.inspect` or `IO.inspect(x)`, so `[1, 2].inspect.count` answered 24, the length of the rendered string, rather than 2.

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

Prints the pretty-printed form of `value` to stderr and returns `value` unchanged, so it can be dropped into any pipeline without changing what flows through it. The same operation as `IO.inspect`, reachable by UFCS.

**Parameters**

  - `value` — the value to show

**Returns**: the same value, unchanged

**Examples**

```kex
[1, 2, 3, 4].map { |n| n * 3 }.inspect.filter(~even?)
# stderr: [3, 6, 9, 12] : [Int]
# => [6, 12]
```
