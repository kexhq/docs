---
package: prelude
version: "0.4.0-alpha"
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

Process and concurrency primitives — backed by Kex.Intrinsic.Process and the BEAM runtime. Pid is an opaque BEAM process identifier; Task wraps a spawned process with an awaitable result.

## type `Pid`

### Methods

#### `send`

```kex
send(msg: X) -> Void
```

Sends `msg` unchanged as a raw BEAM term.

#### `sendFrom`

```kex
sendFrom(msg: X) -> Void
```

Sends the conventional Erlang sender-bearing pair {Process.self, msg}.

#### `link`

```kex
link : Void
```

Links the calling process to this one (bidirectional exit propagation).

#### `unlink`

```kex
unlink : Void
```

Removes the link between the calling process and this one.

#### `monitor`

```kex
monitor : Reference
```

Starts monitoring this process. Returns a reference for `demonitor`.

#### `alive?`

```kex
alive? : Bool
```

Returns `true` if the process is currently alive.

## type `Task<A>`

### Methods

#### `await`

```kex
await : X
```

Waits for the task's result indefinitely.

```kex
await(timeout: Integer) -> X
```

Waits for the task's result, with a timeout in milliseconds. Returns `None` on timeout.

## type `Reference`

### Methods

#### `demonitor`

```kex
demonitor : Void
```

Stops monitoring the process that produced this reference.

## type `Process<A>`

### Methods

A spawned Process<X> is a typed process handle backed by the same runtime pid. It therefore supports the ordinary pid lifecycle operations without erasing its message type.

#### `send`

```kex
send(msg: X) -> Void
```

#### `sendFrom`

```kex
sendFrom(msg: X) -> Void
```

#### `link`

```kex
link : Void
```

#### `unlink`

```kex
unlink : Void
```

#### `monitor`

```kex
monitor : Reference
```

#### `alive?`

```kex
alive? : Bool
```

## type `ProcessExitReason`

A process termination reason. This remains open because the BEAM permits any term as an exit reason; conventional values include `:normal`, `:shutdown`, and structured application errors.

**Variants**

  - `Any`



## record `Reply<A>`

Describes the transition returned by a synchronous serving slot.

`reply` answers the caller immediately. A slot may omit it only when it sends a deferred response with `from.reply(...)`. `new` installs the next serving state; omitting it preserves the current state. `stop` terminates the server after applying the transition. Within a `serving X` block, the checker narrows `new` from `Any?` to `X?`.

**Fields**

  - `reply` : A
  - `new` : Any? (optional)
  - `stop` : [ProcessExitReason](#type-processexitreason)? (optional)



## type `From<A>`

### Methods

#### `reply`

```kex
reply(value: X) -> Void
```

Completes the pending call identified by this caller/reference pair.

#### `pid`

```kex
pid : Pid
```

## type `CallError`

**Variants**

  - `Timeout`
  - `NoProcess`
  - `CallFailed`



## record `Server<X>`

**Fields**

  - `process` : [Process](#type-process)<X>
  - `timeout` : [Integer](number.md#make-integer) (optional)

### Methods

#### `within`

```kex
within(timeout: Integer) -> Server<X>
```

Return an immutable view of the same server with a new default call timeout.

#### `link`

```kex
link : Void
```

#### `unlink`

```kex
unlink : Void
```

#### `monitor`

```kex
monitor : Reference
```

#### `alive?`

```kex
alive? : Bool
```

## module `Process`

### `spawn`

```kex
spawn(state: X) -> Server<X>
```

Starts a process-backed server for the serving implementation attached to X.

### `run`

```kex
run(command: String, args: [String]) -> Result<ProcessResult, String>
```

Run an executable directly with an argv vector. No shell is involved. Output is captured as UTF-8 strings; a non-zero child status is still a successful ProcessResult, while failure to start the child is Error.

### `stream`

```kex
stream(command: String, args: [String]) -> Result<Integer, String>
```

Run an executable with the CALLER's stdout and stderr, so its output appears as it is produced rather than in one block when it exits. Answers the exit code; nothing is captured — that is the trade, and it is what a long-running child a person is watching needs (kexhq/kex#187).

`run` remains the one to use when the output is data to be READ.

### `exec`

```kex
exec(command: String, args: [String]) -> Integer
```

### `self`

```kex
self : Pid
```

Returns the calling process's Pid.

### `exit`

```kex
exit(pid: Pid, reason: X) -> Void
```

Sends an exit signal with `reason` to `pid`.

### `register`

```kex
register(pid: Pid, name: Atom) -> Void
```

Registers `pid` under the given atom `name`.

### `whereis`

```kex
whereis(name: Atom) -> Pid?
```

Returns the Pid registered under `name`, or None.

## record `ProcessResult`

**Fields**

  - `exitCode` : [Integer](number.md#make-integer)
  - `stdout` : [String](string.md#make-string)
  - `stderr` : [String](string.md#make-string)



## module `Task`

### `start`

```kex
start(f: Block<X>) -> Task
```

Spawns a new process that runs `f` and returns a Task handle.

### `awaitAll`

```kex
awaitAll(tasks: [Task]) -> [X]
```

Awaits all tasks in `tasks`, returning their results.

## function `worker`

```kex
worker : Block<Pid> -> (Atom, Block<Pid>)
```

Wraps a spawn block into a worker spec for Supervisor.start.
