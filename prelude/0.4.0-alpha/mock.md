---
package: prelude
version: "0.4.0-alpha"
source: mock.kex
title: Mock
entities:
  - { kind: type, name: "Reader" }
  - { kind: type, name: "Lookup" }
  - { kind: type, name: "Writer" }
  - { kind: module, name: "Mock" }
---

# Mock

## type `Reader`

Mock — deterministic stand-ins for the world outside the program: the filesystem, the network, the environment, the console.

These are STATEFUL: `Mock.FS.File(path, content)` writes into a store the real `FS.File` then reads back, so a test can write and read again, and `clear()` undoes it. That state is global and lives until cleared, which is what makes hook ordering and write/read round trips testable — and also what makes two tests able to interfere.

When a test only needs canned ANSWERS, replacing the capability is the better tool: `with FS.File = MyFake { ... } do ... end` swaps the implementation for one lexical region, holds no global state, needs no clearing, and cannot leak into another test. See spec/capability_stdlib_fs.kex for the shape of a stand-in (kexhq/kex#143).

Opt-in on purpose (issue #144): this module used to ride along inside http.kex, so `using HTTP` in the prelude made every Mock.* reachable from every program without anyone asking for it. Reachable is still not callable — the runtime denies the mock intrinsics outside spec files, the REPL, and --allow-mocks — but it should also not be in scope by accident. A qualified `Mock.FS.File(...)` auto-loads this file like any other opt-in module.

All Mock.* sub-modules live in a single `module Mock` block so merged compilation units never see duplicate top-level `Mock` modules. A stand-in's read hook: a path in, its content or `None` out.



## type `Lookup`

An environment stand-in's lookup hook: a name in, its value or `None` out.



## type `Writer`

An environment stand-in's WRITE hook: the name and the value a program set. A `Mock.Env` is an immutable record, so a write cannot land in its `vars` — and it must not reach the real environment, or a test would leak a variable into the next one and into anything the suite starts. The hook is how a test observes the write instead: record it, assert on it, or ignore it, which is what `None` does.



## module `Mock`



## record `Files`

A stand-in for the `FS.File` capability, for `with FS.File = ...`. Unlike the `Mock.*` functions below it holds no global state, needs no `clear()`, and cannot leak past its block. What it cannot do is change: `write` then `read` back is not something a value does, so a test needing that round trip still wants `Mock.FS` (kexhq/kex#143).

```kex
with FS.File = Mock.Files { files: {"kex.toml": "name = \"demo\""} } do
  assert(loadConfig() == "demo")
end
```

`onRead` takes over when a test needs an ANSWER rather than a fixture — content derived from the path, a failure on the third call, a record of what was asked for. It is consulted first and its `None` means "no such file", so a callback can model absence too.

**Fields**

  - `files` : [Map](map.md#type-map)<[FS.FilePath](fs.md#type-fs-filepath), [String](string.md#make-string)> (optional)
  - `onRead` : [Reader](#type-reader)? (optional)

Implements `FS.File`.

### Methods

#### `cannedRead`

```kex
cannedRead(path)
```

Named apart from `read`: `this.read(path)` would bind to the capability's own `read : FilePath -> String?`, not to this method.

#### `read`

```kex
read(path)
```

#### `readLines`

```kex
readLines(path)
```

#### `feed`

```kex
feed(path)
```

#### `size`

```kex
size(path)
```

#### `exists?`

```kex
exists?(path)
```

#### `file?`

```kex
file?(path)
```

#### `directory?`

```kex
directory?(path)
```

#### `absolute`

```kex
absolute(path)
```

#### `open`

```kex
open(path, mode)
```

A fake is a value, so there is nowhere for a write to go. Refusing is the honest answer and the useful one: a test that did not expect a write sees it fail rather than silently succeed.

#### `write`

```kex
write(path, content)
```

#### `append`

```kex
append(path, content)
```

#### `delete`

```kex
delete(path)
```

#### `copy`

```kex
copy(src, dst)
```

#### `rename`

```kex
rename(src, dst)
```

## record `Env`

A stand-in for the `ENV` capability. A name simply left out of `vars` reads as unset, which is the whole reason `Mock.ENV.unset` exists — absence is an answer programs act on. `onGet` answers instead of the map when a test wants a rule rather than a fixture.

```kex
with ENV = Mock.Env { vars: {"HOME": "/fake"} } do
  assert(configHome() == "/fake/.config")
end
```

**Fields**

  - `vars` : [Map](map.md#type-map)<[String](string.md#make-string), [String](string.md#make-string)> (optional)
  - `onGet` : [Lookup](#type-lookup)? (optional)
  - `onSet` : [Writer](#type-writer)? (optional)

Implements `ENV`.

### Methods

#### `lookup`

```kex
lookup(key)
```

Named apart from `get`: `this.get(key)` would bind to the capability's own `get`, not to this method.

#### `get`

```kex
get(key, default)
```

#### `has?`

```kex
has?(key)
```

#### `keys`

```kex
keys
```

#### `values`

```kex
values
```

#### `count`

```kex
count
```

#### `each`

```kex
each(f)
```

#### `entries`

```kex
entries
```

#### `set`

```kex
set(name, value)
```

A write goes to `onSet` or nowhere. It must NOT reach the real environment: a substituted ENV is the whole point of the mock, and a test that set a variable would otherwise leak it into the next one and into every process the suite starts. `vars` cannot take it either — a record is immutable — so a test that cares about writes supplies the hook, and one that does not gets a write that goes quietly nowhere.

#### `unset`

```kex
unset(name)
```

## record `Response`

A stand-in for the `Http` capability: one canned response for every request, whatever the verb, URL or body. That is what a client test needs, being about what the program does WITH a response.

NOT named `Http`: a record of that name is indistinguishable from the capability itself at a call site, and the `make` block binds to the capability rather than the record — every request then reaches the real network while the test looks like it is faking one.

**Fields**

  - `status` : [Integer](number.md#make-integer)
  - `body` : [String](string.md#make-string)
  - `headers` : [Map](map.md#type-map)<[String](string.md#make-string), [String](string.md#make-string)> (optional)

Implements `Http`.

### Methods

#### `canned`

The one canned response, built once and returned for every request.

#### `get`

```kex
get(url, opts)
```

#### `post`

```kex
post(url, body, opts)
```

#### `put`

```kex
put(url, body, opts)
```

#### `patch`

```kex
patch(url, body, opts)
```

#### `delete`

```kex
delete(url, opts)
```

#### `head`

```kex
head(url, opts)
```

#### `options`

```kex
options(url, opts)
```

## module `Mock.FS`

### `File`

```kex
File(path: FS.FilePath, content: String) -> Void
```

### `Directory`

```kex
Directory(path: FS.FilePath) -> Void
```

### `clear`

```kex
clear : Void
```

### `files`

```kex
files(entries: Map<FS.FilePath, String>) -> Void
```

The whole fixture in one call, the same shape `Mock.Files { files: ... }` takes — one line instead of one per file (kexhq/kex#143).

### `onRead`

```kex
onRead(reader: Reader) -> Void
```

Answer reads by RULE rather than from a fixture: content derived from the path, a failure on the third call, a record of what was asked for. Consulted before the map, and returning `None` means "no such file", so absence is expressible too.

## module `Mock.Http`

### `start`

```kex
start : Void
```

### `respond`

```kex
respond(status: Integer, body: String) -> Void
respond(status: Integer, body: String) -> Map<String, String> -> Void
```

### `stop`

```kex
stop : Void
```

## module `Mock.ENV`

Overlays the process environment, so a test can say what `ENV` holds instead of depending on how it was launched. `unset` is separate because a variable being ABSENT is an answer programs act on.

### `set`

```kex
set(name: String, value: String) -> Void
```

### `unset`

```kex
unset(name: String) -> Void
```

### `clear`

```kex
clear : Void
```

### `vars`

```kex
vars(entries: Map<String, String>) -> Void
```

The whole overlay in one call, the same shape `Mock.Env { vars: ... }` takes (kexhq/kex#143). There is no `onGet` here: global `ENV` is a materialised Map, so there is nothing for a callback to intercept — use `with ENV = Mock.Env { onGet: ... }` when a rule is what you want.

## module `Mock.IO`

### `start`

```kex
start : Void
```

### `stop`

```kex
stop : Void
```

### `output`

```kex
output : String
```

### `clear`

```kex
clear : Void
```

### `input`

```kex
input(first, second, third, fourth) -> Void
```
