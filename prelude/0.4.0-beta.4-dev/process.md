---
package: prelude
version: "0.4.0-beta.4-dev"
source: process.kex
title: Process
entities:
  - { kind: type, name: "Pid" }
  - { kind: type, name: "Task" }
  - { kind: type, name: "Reference" }
  - { kind: type, name: "Process" }
  - { kind: type, name: "ProcessExitReason" }
  - { kind: record, name: "Reply" }
  - { kind: type, name: "From" }
  - { kind: type, name: "CallError" }
  - { kind: record, name: "Server" }
  - { kind: module, name: "Process" }
  - { kind: record, name: "ProcessResult" }
  - { kind: make, name: "Pid" }
  - { kind: make, name: "Process<X>" }
  - { kind: make, name: "Server<X>" }
  - { kind: make, name: "From<X>" }
  - { kind: module, name: "Task" }
  - { kind: make, name: "Task" }
  - { kind: function, name: "worker" }
  - { kind: make, name: "Reference" }
---

# Process

Processes, tasks and external commands.

Kex's concurrency is the BEAM's: lightweight processes that share nothing and communicate by message. There are three things here, and they answer different questions.

`Task` runs one piece of work somewhere else and gives you the answer back:

```kex
let a = Task.start do expensiveThing(1) end
let b = Task.start do expensiveThing(2) end
a.await + b.await
```

`serving` plus `Process.spawn` gives a piece of state its own process, with typed calls into it:

```kex
record RateLimiter do
  remaining : Integer
end

serving RateLimiter do
  slot allowed? -> Reply<Bool> do
    let allowed = @remaining > 0
    new.remaining = allowed then @remaining - 1 else @remaining
    return { new, reply: allowed }
  end
end

let api = Process.spawn(RateLimiter { remaining: 2 })
api.allowed?()   # => Ok(true)
```

`Process.run` and `Process.stream` run an external program.

```kex
Process.run("git", ["rev-parse", "HEAD"])
```

Backed by Kex.Intrinsic.Process and the BEAM runtime.

## type `Pid`

An opaque BEAM process identifier.

Obtained from `Process.self` or `Process.whereIs`. Send it messages, link to it, monitor it, or ask whether it is still alive.

### Methods

#### `send`

```kex
send(msg: X) -> Void
```

Sends `msg` to the process, unchanged, as a raw BEAM term.

Sending never blocks and never fails, even when the process is gone: that is the BEAM's model, not an oversight. Monitor the process when delivery matters.

**Parameters**

  - `msg` — the message to send

**Examples**

```kex
worker.send(:stop)
worker.send(("job", 42))
```

#### `sendFrom`

```kex
sendFrom(msg: X) -> Void
```

Sends the conventional Erlang sender-bearing pair `{Process.self, msg}`, so the receiver knows where to answer.

**Parameters**

  - `msg` — the message to send

**Examples**

```kex
server.sendFrom(:status)   # the server receives (senderPid, :status)
```

#### `link`

```kex
link : Void
```

Links the calling process to this one, so that either one exiting abnormally takes the other down.

Linking is bidirectional and is how a group of processes is made to fail together. Use `monitor` when you want to be told about a death without sharing it.

**Examples**

```kex
worker.link
```

#### `unlink`

```kex
unlink : Void
```

Removes the link between the calling process and this one.

**Examples**

```kex
worker.unlink
```

#### `monitor`

```kex
monitor : Reference
```

Starts monitoring this process, and returns the reference that identifies the monitor.

When the monitored process exits, the caller receives a message about it. Unlike `link`, a monitor is one-directional and does not propagate the exit. Pass the reference to `demonitor` to stop.

**Returns**: the monitor reference

**Examples**

```kex
let ref = worker.monitor
ref.demonitor
```

#### `alive?`

```kex
alive? : Bool
```

Returns `true` when the process is still running.

Inherently a snapshot: the process may exit immediately after you ask. Monitor it when the answer has to stay true.

**Returns**: `true` when the process is alive

**Examples**

```kex
Process.self.alive?   # => true
```

## type `Task<A>`

A handle on work running in another process, with a result you can await.

Created by `Task.start`.

### Methods

#### `await`

```kex
await : X
```

Waits for the task's result, for as long as it takes.

**Returns**: the task's result

**Examples**

```kex
Task.start do 1 + 1 end.await   # => 2
```

```kex
await(timeout: Integer) -> X
```

Waits for the task's result, giving up after `timeout` milliseconds.

Answers `None` if the task has not finished in time. The task itself is not stopped.

**Parameters**

  - `timeout` — how long to wait, in milliseconds

**Returns**: the task's result, or `None` on timeout

**Examples**

```kex
let t = Task.start do slowThing() end
t.await(1000)
```

## type `Reference`

A monitor reference, returned by `monitor` and passed back to `demonitor`.

### Methods

#### `demonitor`

```kex
demonitor : Void
```

Stops the monitor this reference identifies.

**Examples**

```kex
let ref = worker.monitor
ref.demonitor
```

## type `Process<A>`

A typed process handle: like a `Pid`, but it remembers what kind of message the process accepts.

### Methods

A spawned Process<X> is a typed process handle backed by the same runtime pid. It therefore supports the ordinary pid lifecycle operations without erasing its message type.

#### `send`

```kex
send(msg: X) -> Void
```

Sends `msg` to the process. Unlike `Pid.send`, the message type is checked.

**Parameters**

  - `msg` — the message to send

#### `sendFrom`

```kex
sendFrom(msg: X) -> Void
```

Sends the sender-bearing pair `{Process.self, msg}`, with the message type checked.

**Parameters**

  - `msg` — the message to send

#### `link`

```kex
link : Void
```

Links the calling process to this one. See `Pid.link`.

#### `unlink`

```kex
unlink : Void
```

Removes the link between the calling process and this one.

#### `monitor`

```kex
monitor : Reference
```

Starts monitoring this process. See `Pid.monitor`.

**Returns**: the monitor reference

#### `alive?`

```kex
alive? : Bool
```

Returns `true` when the process is still running.

**Returns**: `true` when the process is alive

## type `ProcessExitReason`

A process termination reason. This remains open because the BEAM permits any term as an exit reason; conventional values include `:normal`, `:shutdown`, and structured application errors.

**Variants**

  - `Any`



## record `Reply<A>`

What a synchronous `slot` returns: an answer for the caller, and optionally a new state and a reason to stop.

`reply` answers the caller immediately. A slot may omit it only when it sends a deferred response with `from.reply(...)`. `new` installs the next serving state; omitting it preserves the current state. `stop` terminates the server after applying the transition. Within a `serving X` block, the checker narrows `new` from `Any?` to `X?`.

```kex
slot allowed? -> Reply<Bool> do
  let allowed = @remaining > 0
  new.remaining = allowed then @remaining - 1 else @remaining
  return { new, reply: allowed }
end

slot stop -> Reply<Integer> = { stop: :normal, reply: @remaining }
```

**Fields**

  - `reply` : A
  - `new` : Any? (optional)
  - `stop` : [ProcessExitReason](#type-processexitreason)? (optional)



## type `From<A>`

The identity of a pending caller, for a slot that answers later rather than immediately. Hand it `reply` when the answer is ready.

### Methods

#### `reply`

```kex
reply(value: X) -> Void
```

Answers the pending call this value identifies.

A slot that cannot answer immediately, because it is waiting on something else: omits `reply` from its transition and calls this later instead.

**Parameters**

  - `value` — the answer to send

**Examples**

_Answering after the work is done_

```kex
Task.start do
  from.reply(expensiveThing())
end
```

#### `pid`

```kex
pid : Pid
```

Returns the waiting caller's `Pid`.

**Returns**: the caller

## type `CallError`

Why a call into a server failed: it took too long, the process is gone, or it crashed handling the call.

**Variants**

  - `Timeout`
  - `NoProcess`
  - `CallFailed`



## record `Server<X>`

A running server and the default timeout for calls into it.

Returned by `Process.spawn`. Every `slot` declared in the type's `serving` block becomes a method on it, answering a `Result`.

**Fields**

  - `process` : [Process](#type-process)<X>
  - `timeout` : [Integer](number.md#make-integer) (optional)

### Methods

#### `within`

```kex
within(timeout: Integer) -> Server<X>
```

Returns the same server with a different default call timeout, in milliseconds.

The server is untouched: this is a new view of it, so one slow call can be given more room without changing anything for other callers.

**Parameters**

  - `timeout` — the call timeout in milliseconds

**Returns**: a view of the server with that timeout

**Examples**

_Giving one call longer to answer_

```kex
api.within(30000).rebuildIndex()
```

#### `link`

```kex
link : Void
```

Links the calling process to the server. See `Pid.link`.

**Examples**

```kex
api.link
```

#### `unlink`

```kex
unlink : Void
```

Removes the link between the calling process and the server.

#### `monitor`

```kex
monitor : Reference
```

Starts monitoring the server. See `Pid.monitor`.

**Returns**: the monitor reference

#### `alive?`

```kex
alive? : Bool
```

Returns `true` when the server is still running.

**Returns**: `true` when the server is alive

**Examples**

```kex
api.alive?   # => true
```

## module `Process`

Spawning servers, running external commands, and the ambient process operations.

### `spawn`

```kex
spawn(state: X) -> Server<X>
```

Starts a process running the `serving` implementation attached to `state`'s type, and returns a handle on it.

The state you pass is the server's initial state. Every `slot` in the `serving` block becomes a method on the returned `Server`, and each answers a `Result`: a call can time out or find the process gone.

**Parameters**

  - `state` — the server's initial state

**Returns**: a handle on the running server

**Examples**

```kex
let api = Process.spawn(RateLimiter { remaining: 2 })
api.allowed?()   # => Ok(true)
api.allowed?()   # => Ok(true)
api.allowed?()   # => Ok(false)
api.stop()
```

### `run`

```kex
run(command: String, args: [String]) -> Result<ProcessResult, String>
run(command: String, args: [String]) -> Integer -> Result<ProcessResult, String>
```

Runs an executable with an argument vector and captures its output.

No shell is involved, so nothing is glob-expanded or word-split and arguments containing spaces need no quoting. Output is captured as UTF-8 strings.

A non-zero exit status is still `Ok`: the program ran and said something, which is information, not a failure to run it. `Error` means the child could not be started at all.

**Parameters**

  - `command` — the executable to run
  - `args` — its arguments, one per element

**Returns**: the captured result, or why it could not start

**Examples**

```kex
match Process.run("echo", ["hello"]) do
  Ok(r)    => IO.printLine(r.stdout.trim)   # prints: hello
  Error(e) => IO.printError(e)
end
```

_A non-zero status is still Ok_

```kex
Process.run("false", [])   # => Ok(ProcessResult { exitCode: 1, ... })
```

_A command that does not exist is an Error_

```kex
Process.run("no-such-command", [])   # => Error("executable not found")
```

_Reading a command's output as data_

```kex
Process.run("git", ["rev-parse", "HEAD"])
  .map { |r| r.stdout.trim }
  .or("unknown")
```

### `stream`

```kex
stream(command: String, args: [String]) -> Result<Integer, String>
```

Runs an executable with the CALLER's stdout and stderr, so its output appears as it is produced rather than in one block when it exits.

Answers the exit code; nothing is captured: that is the trade, and it is what a long-running child a person is watching needs (kexhq/kex#187).

`run` remains the one to use when the output is data to be READ.

**Parameters**

  - `command` — the executable to run
  - `args` — its arguments, one per element

**Returns**: the exit code, or why it could not start

**Examples**

_Watching a build as it runs_

```kex
match Process.stream("make", ["-j8"]) do
  Ok(0)    => IO.printLine("build succeeded")
  Ok(code) => IO.printError("build failed with ${code}")
  Error(e) => IO.printError(e)
end
```

### `exec`

```kex
exec(command: String, args: [String]) -> Integer
```

Runs an executable and returns just its exit code, discarding its output.

A command that could not be started answers `127`, the shell's convention for "command not found". Use `run` when you need the output or want to tell a failed start from a failed run.

**Parameters**

  - `command` — the executable to run
  - `args` — its arguments, one per element

**Returns**: the exit code, or `127` if it could not start

**Examples**

```kex
Process.exec("true", [])              # => 0
Process.exec("false", [])             # => 1
Process.exec("no-such-command", [])   # => 127
```

_Testing for a tool's presence_

```kex
let haveGit = Process.exec("git", ["--version"]) == 0
```

### `self`

```kex
self : Pid
```

Returns the calling process's own `Pid`.

**Returns**: this process's identifier

**Examples**

_Telling another process where to answer_

```kex
worker.send((Process.self, :ping))
```

### `exit`

```kex
exit(pid: Pid, reason: X) -> Void
```

Sends an exit signal carrying `reason` to `pid`.

`:normal` is the ordinary shutdown reason; `:kill` cannot be trapped.

**Parameters**

  - `pid` — the process to signal
  - `reason` — the exit reason

**Examples**

```kex
Process.exit(worker, :shutdown)
```

### `register`

```kex
register(pid: Pid, name: Atom) -> Void
register(pid: Process<X>, name: Atom) -> Void
```

Registers `pid` under the atom `name`, so it can be found by name rather than by passing the `Pid` around.

**Parameters**

  - `pid` — the process to register
  - `name` — the name to register it under

**Examples**

```kex
Process.register(Process.self, :main)
```

### `whereIs`

```kex
whereIs(name: Atom) -> Pid?
```

Returns the `Pid` registered under `name`, or `None` when nothing is.

**Parameters**

  - `name` — the registered name

**Returns**: the process, or `None`

**Examples**

```kex
Process.whereIs(:main)        # => Just(pid)
Process.whereIs(:not_there)   # => None
```

_Sending to a named process if it is there_

```kex
Process.whereIs(:logger).map { |pid| pid.send(message) }
```

## record `ProcessResult`

What an external command left behind: its exit status and its output.

Returned inside `Ok` by `Process.run`, whatever the exit status.

**Fields**

  - `exitCode` : [Integer](number.md#make-integer)
  - `stdout` : [String](string.md#make-string)
  - `stderr` : [String](string.md#make-string)



## module `Task`

Running work in another process and collecting the answer.

### `sleep`

```kex
sleep(duration: Duration) -> Void
```

Suspends for an elapsed duration. Negative durations are treated as zero.

### `start`

```kex
start(f: Block<X>) -> Task
```

Runs `f` in a new process and returns a handle on its result.

The block starts immediately, so starting several tasks and awaiting them afterwards is what makes them run at the same time.

**Parameters**

  - `f` — the work to run

**Returns**: a handle on the result

**Examples**

```kex
let t = Task.start do 1 + 1 end
t.await   # => 2
```

_Two pieces of work at once_

```kex
let a = Task.start do slowThing("a") end
let b = Task.start do slowThing("b") end
(a.await, b.await)
```

### `awaitAll`

```kex
awaitAll(tasks: [Task]) -> [X]
```

Waits for every task in `tasks` and returns their results, in the order the tasks were given.

Each result comes back wrapped in a `Result`, so one task failing does not cost you the others' answers. That differs from `Task.await` on a single task, which hands back the value itself.

**Parameters**

  - `tasks` — the tasks to wait for

**Returns**: their results, in order

**Examples**

```kex
let tasks = [Task.start do 1 end, Task.start do 2 end]
Task.awaitAll(tasks)   # => [Ok(1), Ok(2)]
```

_Fanning work out over a list_

```kex
let results = Task.awaitAll(paths.map { |p| Task.start do process(p) end })
```

## function `worker`

```kex
worker(block: Block<Pid>) -> (Atom, Block<Pid>)
```

Wraps a spawn block into a worker spec for `Supervisor.start`.

**Parameters**

  - `block` — the block that spawns the worker

**Returns**: the worker spec
