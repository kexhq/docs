---
package: prelude
version: "0.4.0-rc.5-dev"
source: mock.kex
title: Mock
entities:
  - { kind: type, name: "Reader" }
  - { kind: type, name: "Lookup" }
  - { kind: type, name: "Tick" }
  - { kind: type, name: "Writer" }
  - { kind: module, name: "Mock" }
---

# Mock

Test stand-ins for the filesystem, the environment, the clock and the console. Networking mocks are under `Mock.Net`.

There are two kinds. The `Mock.FS`, `Mock.ENV` and `Mock.IO` modules change global state: `Mock.FS.File(path, content)` puts a file in a store that the real `FS.File` reads from, and it stays there until `clear()`. That lets a test write a file and read it back, but it also lets one test see what another left behind, so clear the state in an `after` hook.

The records `Mock.Files`, `Mock.Env` and `Mock.Clock` replace a capability for one block, as in `with FS.File = Mock.Files { ... } do ... end`. They hold no global state and need no clearing.

Everything here is for tests: it is allowed in spec files and the REPL, and needs `--allow-mocks` anywhere else.

## type `Reader`

A read hook for `Mock.Files`: returns a path's content, or `None` for no such file.



## type `Lookup`

A lookup hook for `Mock.Env`: returns a variable's value, or `None` for unset.



## type `Tick`

A hook for `Mock.Clock` that returns the current instant.

**Variants**

  - `Block(DateTime)`



## type `Writer`

A write hook for `Mock.Env`, called with the name and value a program set.

Writes under a `Mock.Env` never reach the real environment, and the record cannot change, so this hook is the only way to see them. An `unset` arrives as the name with an empty value. Without a hook, writes are dropped.



## module `Mock`



## record `Files`

A read-only stand-in for the `FS.File` capability, for `with FS.File = ...`.

It holds no global state and ends with its block. Every write, delete, copy and open fails, so a test that writes a file and reads it back needs `Mock.FS`.

```kex
with FS.File = Mock.Files { files: {"kex.toml": "name = \"demo\""} } do
  assert(loadConfig() == "demo")
end
```

Set `onRead` to compute the answer, for example from the path. When it is set, `files` is not consulted, and its `None` means no such file.

**Fields**

  - `files` : [Map](map.md#type-map)<[FS.FilePath](fs.md#type-fs-filepath), [String](string.md#make-string)> (optional)
  - `onRead` : [Reader](#type-reader)? (optional)

Implements `FS.File`.

### Functions

#### `cannedRead` (foul)

```kex
cannedRead(path: FS.FilePath) -> String?
```

Named apart from `read`: `this.read(path)` would bind to the capability's own `read : FilePath -> String?`, not to this function.

#### `read` (foul)

```kex
read(path)
```

#### `readBytes` (foul)

```kex
readBytes(path)
```

#### `readLines` (foul)

```kex
readLines(path)
```

#### `feed` (foul)

```kex
feed(path)
```

#### `size` (foul)

```kex
size(path)
```

#### `exists?` (foul)

```kex
exists?(path)
```

#### `file?` (foul)

```kex
file?(path)
```

#### `directory?` (foul)

```kex
directory?(path)
```

#### `absolute` (foul)

```kex
absolute(path)
```

#### `canonical` (foul)

```kex
canonical(path)
```

#### `symlink?` (foul)

```kex
symlink?(path)
```

#### `info` (foul)

```kex
info(path)
```

#### `open` (foul)

```kex
open(path, mode, block)
```

A fake is a value, so there is nowhere for a write to go. Failing lets a test that did not expect a write notice it.

#### `write` (foul)

```kex
write(path, content)
```

#### `writeBytes` (foul)

```kex
writeBytes(path, content)
```

#### `append` (foul)

```kex
append(path, content)
```

#### `delete` (foul)

```kex
delete(path)
```

#### `copy` (foul)

```kex
copy(src, dst)
```

#### `rename` (foul)

```kex
rename(src, dst)
```

#### `changePermission` (foul)

```kex
changePermission(path, permissions)
```

#### `changeMode` (foul)

```kex
changeMode(path, mode)
```

## record `Env`

A stand-in for the `ENV` capability, for `with ENV = ...`.

A name not in `vars` reads as unset. Set `onGet` to compute values instead, and `onSet` to see what the program writes.

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

### Functions

#### `lookup` (foul)

```kex
lookup(key: String) -> String?
```

Named apart from `get`: `this.get(key)` would bind to the capability's own `get`, not to this function.

#### `get` (foul)

```kex
get(key, default)
```

#### `has?` (foul)

```kex
has?(key)
```

#### `keys` (foul)

```kex
keys
```

#### `values` (foul)

```kex
values
```

#### `count` (foul)

```kex
count
```

#### `each` (foul)

```kex
each(f)
```

#### `entries` (foul)

```kex
entries
```

#### `set` (foul)

```kex
set(name, value)
```

A write goes to `onSet` or is dropped. It must not reach the real environment, where it would leak into later tests and into every process the suite starts, and `vars` cannot change.

#### `unset` (foul)

```kex
unset(name)
```

## record `Clock`

A stand-in for the `Time.Clock` capability, for `with Time.Clock = ...`. Inside the block, `Time.now`, `Date.today` and `DateTime.utcNow` read from it.

```kex
with Time.Clock = Mock.Clock { at: DateTime.parse("2026-07-30T14:03:00Z").try } do
  assert(Date.today().iso == "2026-07-30")
end
```

The clock is frozen at `at`, zone included, so `Date.today()` is the date in the zone you wrote, not the zone of the machine running the test.

A frozen clock makes every measured interval zero. For a clock that runs, set `onNow`: a block uses the clock of the place it was written, so one written outside the `with` reads the real clock.

```kex
with Time.Clock = Mock.Clock { onNow: Just({ DateTime.now() + 3.day }) } do
  let started = DateTime.epochNanos()
  runTheThing()
  assert(DateTime.epochNanos() > started)
end
```

**Fields**

  - `at` : [DateTime](date_time.md#record-datetime) (optional)
  - `onNow` : [Tick](#type-tick)? (optional)

Implements `Time.Clock`.

### Functions

#### `now` (foul)

```kex
now
```

## module `Mock.FS`

A global stand-in for the filesystem: files a test declares here are what the real `FS.File` reads.

The store lasts until `clear`, so clear it in an `after` hook or the next test sees the same files.

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

### `File` (foul)

```kex
File(path: FS.FilePath, content: String) -> Void
```

Declares one file and its content.

**Parameters**

  - `path` — the path the file appears at
  - `content` — its contents

**Examples**

```kex
Mock.FS.File("app.conf", "port = 8080\n")
```

### `Directory` (foul)

```kex
Directory(path: FS.FilePath) -> Void
```

Declares a directory at `path`.

**Parameters**

  - `path` — the directory to declare

**Examples**

```kex
Mock.FS.Directory("src")
```

### `clear` (foul)

```kex
clear -> Void
```

Empties the store, removing every file and directory declared so far.

Call it in an `after` hook, since the store is shared by every test.

**Examples**

```kex
after do
  Mock.FS.clear()
end
```

### `files` (foul)

```kex
files(entries: Map<FS.FilePath, String>) -> Void
```

Declares several files at once, from a map of paths to contents (the shape `Mock.Files` takes).

**Parameters**

  - `entries` — paths to their contents

**Examples**

```kex
Mock.FS.files({
  "app.conf": "port = 8080\n",
  "hosts":    "localhost\n"
})
```

### `onRead` (foul)

```kex
onRead(reader: Reader) -> Void
```

Serves reads from `reader` in place of the declared files.

Use it when the content depends on the path. While it is set, files declared with `File` or `files` are not read, and `None` from `reader` means no such file.

**Parameters**

  - `reader` — returns a path's content, or `None`

**Examples**

_Every .txt path has content, nothing else exists_

```kex
Mock.FS.onRead do |path|
  path.endsWith?(".txt") then Just("stub") else None
end
```

## module `Mock.ENV`

A global overlay on the process environment, so a test decides what `ENV` holds.

The overlay lasts until `clear`, so clear it in an `after` hook.

```kex
Mock.ENV.vars({ "HOME": "/fake", "LOG_LEVEL": "debug" })
assert(configPath() == "/fake/.config")
Mock.ENV.clear()
```

### `set` (foul)

```kex
set(name: String, value: String) -> Void
```

Sets one variable in the overlay.

**Parameters**

  - `name` — the variable name
  - `value` — its value

**Examples**

```kex
Mock.ENV.set("LOG_LEVEL", "debug")
```

### `unset` (foul)

```kex
unset(name: String) -> Void
```

Makes a variable read as unset, whatever the real environment holds.

**Parameters**

  - `name` — the variable to remove

**Examples**

_Testing the unset path_

```kex
Mock.ENV.unset("HOME")
Assert.equal(configPath(), ".")
```

### `clear` (foul)

```kex
clear -> Void
```

Removes the whole overlay, restoring the real environment.

**Examples**

```kex
after do
  Mock.ENV.clear()
end
```

### `vars` (foul)

```kex
vars(entries: Map<String, String>) -> Void
```

Declares the whole overlay in one call.

To compute values per lookup, use `with ENV = Mock.Env { onGet: ... }`.

**Parameters**

  - `entries` — variable names to their values

**Examples**

```kex
Mock.ENV.vars({ "HOME": "/fake", "LOG_LEVEL": "debug" })
```

## module `Mock.IO`

A global stand-in for the console: it captures what a program prints and feeds it lines as if they had been typed.

```kex
Mock.IO.start()
Mock.IO.input("Ada", "42")
greet()
Assert.equal(Mock.IO.output(), "hello, Ada\n")
Mock.IO.stop()
```

### `start` (foul)

```kex
start -> Void
```

Starts capturing output and serving queued input.

**Examples**

```kex
before do
  Mock.IO.start()
end
```

### `stop` (foul)

```kex
stop -> Void
```

Stops capturing, and restores the real console.

**Examples**

```kex
after do
  Mock.IO.stop()
end
```

### `output` (foul)

```kex
output -> String
```

Returns everything the program has printed since capturing started.

Newlines are included, so a single `IO.printLine("hi")` gives `"hi\n"`.

**Returns**: the captured output

**Examples**

```kex
Mock.IO.start()
IO.printLine("hello")
Assert.equal(Mock.IO.output(), "hello\n")
```

### `clear` (foul)

```kex
clear -> Void
```

Discards the output captured so far and keeps capturing.

Use it between phases of a test when only the later output matters.

**Examples**

```kex
setUpNoisily()
Mock.IO.clear()
theThingUnderTest()
Assert.equal(Mock.IO.output(), "done\n")
```

### `input` (foul)

```kex
input(first: String, second: String, third: String, fourth: String) -> Void
```

Queues the lines `IO.getLine` will return, in order.

Takes a list, or up to four lines as separate arguments. Calls add to the queue. Once it is empty, `IO.getLine` returns `None` and `IO.readLine` returns `Ok(None)`, as at the end of real input.

**Parameters**

  - `lines` — the lines to serve, in order (one line, or a list of them)

**Examples**

_A list of lines_

```kex
Mock.IO.input(["Ada", "42"])
```

_The same, as separate arguments_

```kex
Mock.IO.input("Ada", "42")
```

## module `Mock.Net`

Scripted inputs for testing HTTP, DNS, sockets and WebSockets.



## module `Mock.Net.HTTP`

Scripted HTTP responses.



## record `Transport`

Responses a scripted transport returns, in order.

**Fields**

  - `responses` : [Any]



## module `Mock.Net.DNS`

Scripted DNS answers.



## record `ResolverScript`

The addresses each hostname resolves to.

**Fields**

  - `answers` : {[String](string.md#make-string): [[String](string.md#make-string)]}



## module `Mock.Net.Socket`

Scripted socket data.



## record `Script`

Chunks delivered in order as incoming socket data.

**Fields**

  - `incoming` : [[Binary](binary.md#type-binary)]



## module `Mock.Net.WebSocket`

Scripted WebSocket messages.



## record `Script`

Messages a scripted connection delivers, in order.

**Fields**

  - `incoming` : [Any]


