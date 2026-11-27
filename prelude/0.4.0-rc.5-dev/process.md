---
package: prelude
version: "0.4.0-rc.5-dev"
source: process.kex
title: Process
entities:
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
  - { kind: make, name: "Process<X>" }
  - { kind: make, name: "Server<X>" }
  - { kind: make, name: "From<X>" }
  - { kind: module, name: "Task" }
  - { kind: make, name: "Task<X>" }
  - { kind: module, name: "Supervisor" }
  - { kind: make, name: "Reference" }
---

# Process

Processes, tasks and external commands.

Kex's concurrency is the BEAM's: lightweight processes that share nothing and talk by sending messages. This file has three parts.

`Task` runs one piece of work in another process and hands back its result:

```kex
let a = Task.start do expensiveThing(1) end
let b = Task.start do expensiveThing(2) end
(a.await, b.await)
```

`serving` with `Process.spawn` gives a piece of state its own process, with typed calls into it:

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

`Process.run` and `Process.stream` run an external program:

```kex
Process.run("git", ["rev-parse", "HEAD"])
```

## type `Task<A>`

A handle on work running in another process, whose result you can await.

Created by `Task.start`.

### Functions

#### `await`

```kex
await -> Result<X, Any>
```

Waits for the task's result, with no time limit.

**Returns**: the result or failure reason

**Examples**

```kex
Task.start do 1 + 1 end.await   # => Ok(2)
```

```kex
await(timeout: Integer) -> Result<X, Any>
```

Waits for the task's result, giving up after `timeout` milliseconds.

Returns `Error(:timeout)` if the task has not finished in time. The task keeps running.

**Parameters**

  - `timeout` — how long to wait, in milliseconds

**Returns**: the result or failure reason

**Examples**

```kex
let t = Task.start do Task.sleep(2.second) end
t.await(100)   # => Error(:timeout)
```

## type `Reference`

A monitor reference, returned by `monitor` and passed back to `demonitor`.

### Functions

#### `demonitor`

```kex
demonitor -> Void
```

Stops the monitor this reference identifies.

**Examples**

```kex
let ref = worker.monitor
ref.demonitor
```

## type `Process<A>`

A process: what `spawn` makes, what `Process.self` returns, and what `Process.whereIs` finds. `A` is the type of message it accepts, and sending it anything else is a type error. A process obtained without a declared message type takes its `A` from where it is used (`Ping(Process.self)` where a `Process<String>` is expected).

### Functions

Messaging, linking and monitoring a process.

#### `send`

```kex
send(msg: X) -> Void
```

Sends `msg` to the process. `msg` must be of the type the process accepts.

Sending never blocks and never fails, even when the process is gone. Monitor the process when you need to know it is still there.

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

Sends the pair `(Process.self, msg)`, so the receiver knows where to reply.

**Parameters**

  - `msg` — the message to send

**Examples**

```kex
server.sendFrom(:status)   # the server receives (sender, :status)
```

#### `link`

```kex
link -> Void
```

Links the calling process to this one, so that if either exits abnormally the other exits too.

Links work in both directions. Use `monitor` to be told about an exit without exiting yourself.

**Examples**

```kex
worker.link
```

#### `unlink`

```kex
unlink -> Void
```

Removes the link between the calling process and this one.

**Examples**

```kex
worker.unlink
```

#### `monitor`

```kex
monitor -> Reference
```

Starts monitoring this process, and returns the reference that identifies the monitor.

When the monitored process exits, the caller receives a message about it. Unlike `link`, a monitor works in one direction and the caller does not exit with it. Call `demonitor` on the reference to stop.

**Returns**: the monitor reference

**Examples**

```kex
let ref = worker.monitor
ref.demonitor
```

#### `alive?`

```kex
alive? -> Bool
```

Returns `true` when the process is still running.

The process may exit right after you ask. Monitor it when you need to know when it goes.

**Returns**: `true` when the process is alive

**Examples**

```kex
Process.self.alive?   # => true
```

## type `ProcessExitReason`

Why a process ended. The BEAM allows any term as an exit reason, so this is `Any`; the usual ones are `:normal`, `:shutdown` and application error values.

**Variants**

  - `Any`



## record `Reply<A>`

What a synchronous `slot` returns: the reply for the caller, and optionally a new state and a reason to stop.

`reply` goes back to the caller at once. A slot may leave it out only when it answers later with `from.reply(...)`. `new` is the next state; leave it out to keep the current one. `stop` ends the server after the transition. Inside a `serving X` block the checker narrows `new` from `Any?` to `X?`.

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

A caller still waiting for its reply, for a slot that answers later. Call `reply` on it when the answer is ready.

### Functions

#### `reply` (foul)

```kex
reply(value: X) -> Void
```

Sends `value` as the reply to the waiting caller.

A slot that cannot reply at once, because it is waiting on something else, leaves `reply` out of its `Reply` and calls this later.

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
pid -> Process<A>
```

Returns the waiting caller.

**Returns**: the caller

## type `CallError`

Why a call into a server failed: it timed out, the process is gone, or it crashed while handling the call.

**Variants**

  - `Timeout`
  - `NoProcess`
  - `CallFailed`



## record `Server<X>`

A running server and the default timeout for calls into it.

Returned by `Process.spawn`. Each `slot` in the type's `serving` block becomes a function on this `Server` that returns a `Result`.

**Fields**

  - `process` : [Process](#type-process)<X>
  - `timeout` : [Integer](number.md#make-integer) (optional)

### Functions

#### `within`

```kex
within(timeout: Integer) -> Server<X>
```

Returns a handle on the same server with a different call timeout, in milliseconds.

The server and other handles on it are unchanged, so one slow call can be given longer without affecting anyone else.

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
link -> Void
```

Links the calling process to the server. See `Process.link`.

**Examples**

```kex
api.link
```

#### `unlink`

```kex
unlink -> Void
```

Removes the link between the calling process and the server.

#### `monitor`

```kex
monitor -> Reference
```

Starts monitoring the server. See `Process.monitor`.

**Returns**: the monitor reference

#### `alive?`

```kex
alive? -> Bool
```

Returns `true` when the server is still running.

**Returns**: `true` when the server is alive

**Examples**

```kex
api.alive?   # => true
```

## module `Process`

Spawning servers, running external commands, and operations on the calling process.

### `spawn` (foul)

```kex
spawn(state: X) -> Server<X>
```

Starts a process running the `serving` block of `state`'s type, with `state` as its initial state, and returns a handle on it.

Each `slot` in the `serving` block becomes a function on the returned `Server`. Each returns a `Result`, because a call can time out or find the process gone.

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

### `run` (foul)

```kex
run(command: String, args: [String]) -> Result<ProcessResult, String>
run(command: String, args: [String], timeoutMs: Integer) -> Result<ProcessResult, String>
```

Runs an executable with a list of arguments and captures its output.

No shell is involved: nothing is glob-expanded or split on spaces, and an argument containing spaces needs no quoting. Output is read as UTF-8.

A non-zero exit status is still `Ok`; check `exitCode` on the result. `Error` means the program could not be started at all.

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
Process.run("no-such-command", [])   # => Error("executable not found: no-such-command")
```

_Reading a command's output as data_

```kex
Process.run("git", ["rev-parse", "HEAD"])
  .map { |r| r.stdout.trim }
  .or("unknown")
```

### `stream` (foul)

```kex
stream(command: String, args: [String]) -> Result<Integer, String>
```

Runs an executable connected to the caller's stdin, stdout and stderr, and returns its exit code.

Output appears as the program writes it, and a program that reads the terminal (a REPL, a password prompt) can. Nothing is captured; use `run` when you need the output as a string.

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

### `exec` (foul)

```kex
exec(command: String, args: [String]) -> Integer
```

Runs an executable and returns its exit code, discarding its output.

A command that could not be started gives `127`, the shell's code for "command not found". Use `run` when you need the output or must tell a failed start from a failed run.

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

### `self` (foul)

```kex
self -> Process<A>
```

Returns the calling process.

**Returns**: this process

**Examples**

_Telling another process where to answer_

```kex
worker.send((Process.self, :ping))
```

### `exit` (foul)

```kex
exit(pid: Process<A>, reason: X) -> Void
```

Sends an exit signal carrying `reason` to `pid`.

`:normal` is the usual shutdown reason; `:kill` cannot be trapped.

**Parameters**

  - `pid` — the process to signal
  - `reason` — the exit reason

**Examples**

```kex
Process.exit(worker, :shutdown)
```

### `register` (foul)

```kex
register(process: Process<X>, name: Atom) -> Void
```

Registers `process` under the atom `name`, so other processes can find it with `whereIs`.

**Parameters**

  - `process` — the process to register
  - `name` — the name to register it under

**Examples**

```kex
let logger = spawn do logLoop() end
Process.register(logger, :logger)
Process.register(Process.self, :main)
```

### `whereIs` (foul)

```kex
whereIs(name: Atom) -> Process<A>?
```

Returns the process registered under `name`, or `None` when nothing is.

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

## type `Shared<X>`

A named, typed slot that any process can read directly.

State kept in a `serving` process is copied into the caller on every read, which is costly for a large value that every request reads. A `Shared` value is stored once for the whole node (on the BEAM, in `persistent_term`), and reading it copies nothing however large it is.

Writing is the expensive part: replacing a value makes the runtime scan every process for references to the old one. Use it for state that is read constantly and written rarely, such as configuration or a loaded site, not for a counter.

Get a handle with `Process.Shared.named`. The name alone identifies the slot, so two handles with the same name share it. Nothing checks that they agree on the type parameter, so give every handle on one name the same one.

**Examples**

_Loading once, reading from every request handler_

```kex
let site : Process.Shared<Site> = Process.Shared.named("site")
site.put(loadSite(root))
...
let current = site.get.or(emptySite)
```

### Functions

#### `put` (foul)

```kex
put(value: X) -> Void
```

Stores `value`, replacing whatever the slot held.

This is expensive; see `Process.Shared`.

**Parameters**

  - `value` — the value to store

#### `get` (foul)

```kex
get -> X?
```

Returns the stored value, or `None` when nothing has been stored yet.

This is cheap whatever the value's size.

**Returns**: the stored value

#### `delete` (foul)

```kex
delete -> X?
```

Empties the slot and returns what it held.

**Returns**: the value it held, or `None` when it held none

## module `Process.Shared`

### `named`

```kex
named(name: String) -> Process.Shared<X>
```

Returns the handle on the slot called `name`. Nothing is stored or read until `put` or `get`.

**Parameters**

  - `name` — the slot's name

**Returns**: a handle on the slot

## record `ProcessResult`

The exit status and output of an external command.

`Process.run` returns it inside `Ok` whatever the exit status.

**Fields**

  - `exitCode` : [Integer](number.md#make-integer)
  - `stdout` : [String](string.md#make-string)
  - `stderr` : [String](string.md#make-string)



## module `Task`

Running work in another process and collecting the answer.

### `sleep` (foul)

```kex
sleep(duration: Duration) -> Void
```

Suspends the calling process for `duration`. A negative duration counts as zero.

**Parameters**

  - `duration` — how long to sleep

**Examples**

```kex
Task.sleep(500.millisecond)
```

### `start` (foul)

```kex
start(f: Block<X>) -> Task<X>
```

Runs `f` in a new process and returns a handle on its result.

The block starts at once. To run several pieces of work at the same time, start all the tasks first and await them afterwards.

**Parameters**

  - `f` — the work to run

**Returns**: a handle on the result

**Examples**

```kex
let t = Task.start do 1 + 1 end
t.await   # => Ok(2)
```

_Two pieces of work at once_

```kex
let a = Task.start do slowThing("a") end
let b = Task.start do slowThing("b") end
(a.await, b.await)
```

### `awaitAll` (foul)

```kex
awaitAll(tasks: [Task<X>]) -> [Result<X, Any>]
```

Waits for every task in `tasks` and returns their results in the same order.

Each result is a `Result`, as from `await`, so one failed task does not lose the others' results.

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

## module `Supervisor`

Supervision trees: processes that restart the processes under them when they crash.

### `start` (foul)

```kex
start(restart: Atom, children: Block<[(Atom, Block<Process<A>>)]>) -> Result<Process<A>, Any>
start(restart: Atom, children: [(Atom, Block<Process<A>>)]) -> Result<Process<A>, Any>
```

Starts a supervisor over the children its block lists, one per line: +Supervisor.worker+s and nested +Supervisor.supervisor+s. When a child crashes, `restart` decides which children restart:

- `:only_crashed`: the crashed child
- `:crashed_and_newer`: it and the children listed after it
- `:all`: every child

The interpreter (`kex -R`) supports only `:only_crashed`, and no nested supervisors.

**Parameters**

  - `restart` — the restart strategy
  - `children` — the block listing the children

**Returns**: the supervisor, or why it failed to start

**Examples**

```kex
using Supervisor
start(restart: :only_crashed) do
  worker { startCache() }
  supervisor(restart: :all) do
    worker { startPool() }
    worker { startListener() }
  end
end
```

### `worker`

```kex
worker(start: Block<Process<A>>) -> (Atom, Block<Process<A>>)
```

Returns a child spec whose block is run to start the child and again to restart it. The block must spawn the worker and return it.

**Parameters**

  - `start` — the block that spawns the worker

**Returns**: the worker spec

**Examples**

```kex
Supervisor.worker { spawn do cacheLoop([]) end }
```

### `supervisor`

```kex
supervisor(restart: Atom, children: Block<[(Atom, Block<Process<A>>)]>) -> (Atom, Block<Process<A>>)
supervisor(restart: Atom, children: [(Atom, Block<Process<A>>)]) -> (Atom, Block<Process<A>>)
```

Returns a child spec for a supervisor over the children its block lists, one per line.

The parent starts it, and restarts it with all its children when the parent's strategy says so. `restart` takes the same strategies as `Supervisor.start`. It needs the BEAM backend (plain `kex`); `kex -R` does not support it.

**Parameters**

  - `restart` — `:only_crashed`, `:all` or `:crashed_and_newer`
  - `children` — the block listing its children

**Returns**: the supervisor spec

**Examples**

```kex
Supervisor.supervisor(restart: :all) do
  Supervisor.worker { startPool() }
  Supervisor.worker { startListener() }
end
```
