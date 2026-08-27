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



**Variants**

  - _(abstract)_

## type `Lookup`

An environment stand-in's lookup hook: a name in, its value or `None` out.



**Variants**

  - _(abstract)_

## type `Writer`

An environment stand-in's WRITE hook: the name and the value a program set. A `Mock.Env` is an immutable record, so a write cannot land in its `vars` — and it must not reach the real environment, or a test would leak a variable into the next one and into anything the suite starts. The hook is how a test observes the write instead: record it, assert on it, or ignore it, which is what `None` does.



**Variants**

  - _(abstract)_

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

  - `files` : Map<[FS.FilePath](fs.md#type-filepath), String> (optional)
  - `onRead` : [Reader](#type-reader)? (optional)

## record `Env`

A stand-in for the `ENV` capability. A name simply left out of `vars` reads as unset, which is the whole reason `Mock.ENV.unset` exists — absence is an answer programs act on. `onGet` answers instead of the map when a test wants a rule rather than a fixture.

```kex
with ENV = Mock.Env { vars: {"HOME": "/fake"} } do
  assert(configHome() == "/fake/.config")
end
```

**Fields**

  - `vars` : Map<String, String> (optional)
  - `onGet` : [Lookup](#type-lookup)? (optional)
  - `onSet` : [Writer](#type-writer)? (optional)

## record `Response`

A stand-in for the `Http` capability: one canned response for every request, whatever the verb, URL or body. That is what a client test needs, being about what the program does WITH a response.

NOT named `Http`: a record of that name is indistinguishable from the capability itself at a call site, and the `make` block binds to the capability rather than the record — every request then reaches the real network while the test looks like it is faking one.

**Fields**

  - `status` : Integer
  - `body` : String
  - `headers` : Map<String, String> (optional)

## module `Mock.FS`

A stateful stand-in for the filesystem: files a test declares, that the real `FS.File` then reads back.

The store is global and lives until `clear`, which is what makes a write followed by a read testable — and what makes two tests able to interfere. Clear it in an `after` hook.

```kex
describe "the config loader" do
  before do
    Mock.FS.files({ "app.conf": "port = 8080\n" })
  end

  after do
    Mock.FS.clear()
  end

  it "reads the port" do
    Assert.equal(loadPort(), 8080)
  end
end
```

## function `File`

Declares one file and its content.


```kex
File(path, content) : FS.FilePath -> String -> Void
```


## function `Directory`

Declares a directory at `path`.


```kex
Directory(path) : FS.FilePath -> Void
```


## function `clear`

Empties the store, so nothing declared so far is visible any more.

Call it in an `after` hook — the store is global, and what one test leaves behind the next one sees.


```kex
clear() : Void
```


## function `files`

Declares the whole fixture in one call.

The same shape `Mock.Files { files: ... }` takes — one line instead of one per file (kexhq/kex#143).


```kex
files(entries) : Map<FS.FilePath, String> -> Void
```


## function `onRead`

Answers reads by RULE rather than from a fixture.

Content derived from the path, a failure on the third call, a record of what was asked for. Consulted before the map, and returning `None` means "no such file", so absence is expressible too.


```kex
onRead(reader) : Reader -> Void
```


## module `Mock.Http`

A stateful stand-in for the network: responses a test queues, that the real `Http` then hands back.

Responses are consumed in FIFO order — the first `respond` answers the first request. When the queue runs out, the next request answers `Error(HttpError)` with kind `MockEmpty`, so a test that made more calls than it expected fails rather than reaching the network.

```kex
Mock.Http.start()
Mock.Http.respond(200, "{\"ok\": true}")
assert(fetchStatus() == "ok")
Mock.Http.stop()
```

## function `start`

Starts intercepting HTTP requests. Call it before queueing responses.


```kex
start() : Void
```


## function `respond`

Queues one response, to be handed to the next request.


```kex
respond(status, body) : Integer -> String -> Void
respond(status, body) : Integer -> String -> Map<String, String> -> Void
```


## function `stop`

Stops intercepting, and discards anything still queued.


```kex
stop() : Void
```


## module `Mock.ENV`

Overlays the process environment, so a test can say what `ENV` holds instead of depending on how it was launched.

The overlay is global and lives until `clear` — clear it in an `after` hook.

```kex
Mock.ENV.vars({ "HOME": "/fake", "LOG_LEVEL": "debug" })
assert(configPath() == "/fake/.config")
Mock.ENV.clear()
```

## function `set`

Sets one variable in the overlay.


```kex
set(name, value) : String -> String -> Void
```


## function `unset`

Removes one variable from the overlay, so it reads as unset.

Separate from `set` because a variable being ABSENT is an answer programs act on, and there is no value that means it.


```kex
unset(name) : String -> Void
```


## function `clear`

Removes the whole overlay, restoring the real environment.


```kex
clear() : Void
```


## function `vars`

Declares the whole overlay in one call.

The same shape `Mock.Env { vars: ... }` takes (kexhq/kex#143). There is no `onGet` here: global `ENV` is a materialised Map, so there is nothing for a callback to intercept — use `with ENV = Mock.Env { onGet: ... }` when a rule is what you want.


```kex
vars(entries) : Map<String, String> -> Void
```


## module `Mock.IO`

A stateful stand-in for the console: captures what a program prints, and feeds it lines as if they had been typed.

The way to test a program that talks to a person without one being there.

```kex
Mock.IO.start()
Mock.IO.input("Ada", "42")
greet()
Assert.equal(Mock.IO.output(), "hello, Ada\n")
Mock.IO.stop()
```

## function `start`

Starts capturing output and serving queued input.


```kex
start()
```


## function `stop`

Stops capturing, and restores the real console.


```kex
stop()
```


## function `output`

Everything the program has printed since capturing started.

Newlines are included, so a single `IO.printLine("hi")` gives `"hi\n"`.


```kex
output()
```


## function `clear`

Discards the captured output, while continuing to capture.

Useful between phases of one test, when only the later output matters.


```kex
clear()
```


## function `input`

Queues the lines `IO.getLine` will return, in order.

Takes a list, or up to four lines as separate arguments. Once they run out, `IO.getLine` answers `None` — end of input, exactly as a closed stdin would.


```kex
input(lines)
```


## make `Files` implements [FS.File](fs.md#module-fs-file)


#### `cannedRead`

Named apart from `read`: `this.read(path)` would bind to the capability's own `read : FilePath -> String?`, not to this method.

```kex
cannedRead(path)
```

#### `read`

```kex
read(path)
```

#### `readBytes`

```kex
readBytes(path)
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

A fake is a value, so there is nowhere for a write to go. Refusing is the honest answer and the useful one: a test that did not expect a write sees it fail rather than silently succeed.

```kex
open(path, mode)
```

#### `write`

```kex
write(path, content)
```

#### `writeBytes`

```kex
writeBytes(path, content)
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

## make `Env` implements [ENV](env.md#module-env)


#### `lookup`

Named apart from `get`: `this.get(key)` would bind to the capability's own `get`, not to this method.

```kex
lookup(key)
```

#### `get`

```kex
get(key)
```

#### `has?`

```kex
has?(key)
```

#### `keys`

```kex
keys()
```

#### `values`

```kex
values()
```

#### `count`

```kex
count()
```

#### `each`

```kex
each(f)
```

#### `entries`

```kex
entries()
```

#### `set`

A write goes to `onSet` or nowhere. It must NOT reach the real environment: a substituted ENV is the whole point of the mock, and a test that set a variable would otherwise leak it into the next one and into every process the suite starts. `vars` cannot take it either — a record is immutable — so a test that cares about writes supplies the hook, and one that does not gets a write that goes quietly nowhere.

```kex
set(name, value)
```

#### `unset`

```kex
unset(name)
```

## make `Response` implements [Http](http.md#module-http)


#### `get`

```kex
get(url)
```

#### `post`

```kex
post(url, body)
```

#### `put`

```kex
put(url, body)
```

#### `patch`

```kex
patch(url, body)
```

#### `delete`

```kex
delete(url)
```

#### `head`

```kex
head(url)
```

#### `options`

```kex
options(url)
```
