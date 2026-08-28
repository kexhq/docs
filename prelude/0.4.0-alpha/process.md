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

## type `Pid`

Processes, tasks and external commands.

Kex's concurrency is the BEAM's: lightweight processes that share nothing and communicate by message. There are three things here, and they answer different questions.

`Task` runs one piece of work somewhere else and gives you the answer back:

```kex
let a = Task.start do expensiveThing(1) end
let b = Task.start do expensiveThing(2) end
a.await ` b.await
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

An opaque BEAM process identifier.

Obtained from `Process.self` or `Process.whereis+. Send it messages, link to it, monitor it, or ask whether it is still alive.



## type `Task<A>`

A handle on work running in another process, with a result you can await.

Created by `Task.start`.



## type `Reference`

A monitor reference, returned by `monitor` and passed back to `demonitor`.



## type `Process<A>`

A typed process handle: like a `Pid`, but it remembers what kind of message the process accepts.



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

  - `process` : Process<X>
  - `timeout` : Integer (optional)

## module `Process`

Spawning servers, running external commands, and the ambient process operations.

## function `spawn`

Starts a process running the `serving` implementation attached to `state`'s type, and returns a handle on it.

The state you pass is the server's initial state. Every `slot` in the `serving` block becomes a method on the returned `Server`, and each answers a `Result` — a call can time out or find the process gone.


```kex
spawn(state) : X -> Server<X>
```


## function `run`

Runs an executable with an argument vector and captures its output.

No shell is involved, so nothing is glob-expanded or word-split and arguments containing spaces need no quoting. Output is captured as UTF-8 strings.

A non-zero exit status is still `Ok` — the program ran and said something, which is information, not a failure to run it. `Error` means the child could not be started at all.


```kex
run(command, args) : String -> [String] -> Result<ProcessResult, String>
```


## function `stream`

Runs an executable with the CALLER's stdout and stderr, so its output appears as it is produced rather than in one block when it exits.

Answers the exit code; nothing is captured — that is the trade, and it is what a long-running child a person is watching needs (kexhq/kex#187).

`run` remains the one to use when the output is data to be READ.


```kex
stream(command, args) : String -> [String] -> Result<Integer, String>
```


## function `exec`

Runs an executable and returns just its exit code, discarding its output.

A command that could not be started answers `127`, the shell's convention for "command not found". Use `run` when you need the output or want to tell a failed start from a failed run.


```kex
exec(command, args) : String -> [String] -> Integer
```


## function `self`

Returns the calling process's own `Pid`.


```kex
self() : Pid
```


## function `exit`

Sends an exit signal carrying `reason` to `pid`.

`:normal` is the ordinary shutdown reason; `:kill` cannot be trapped.


```kex
exit(pid, reason) : Pid -> X -> Void
```


## function `register`

Registers `pid` under the atom `name`, so it can be found by name rather than by passing the `Pid` around.


```kex
register(pid, name) : Pid -> Atom -> Void
```


## function `whereis`

Returns the `Pid` registered under `name`, or `None` when nothing is.


```kex
whereis(name) : Atom -> Pid?
```


## record `ProcessResult`

What an external command left behind: its exit status and its output.

Returned inside `Ok` by `Process.run`, whatever the exit status.

**Fields**

  - `exitCode` : Integer
  - `stdout` : String
  - `stderr` : String

## make `Pid`


#### `send`

Sends `msg` to the process, unchanged, as a raw BEAM term.

Sending never blocks and never fails, even when the process is gone — that is the BEAM's model, not an oversight. Monitor the process when delivery matters.

```kex
send(msg) : X -> Void
```

**Returns**: `Void`

**Examples**

```kex
worker.send(:stop)
worker.send(("job", 42))
```

#### `sendFrom`

Sends the conventional Erlang sender-bearing pair `{Process.self, msg}`, so the receiver knows where to answer.

```kex
sendFrom(msg) : X -> Void
```

**Returns**: `Void`

**Examples**

```kex
server.sendFrom(:status)   # the server receives (senderPid, :status)
```

## make `Process<X>`

A spawned Process<X> is a typed process handle backed by the same runtime pid. It therefore supports the ordinary pid lifecycle operations without erasing its message type.


#### `send`

Sends `msg` to the process. Unlike `Pid.send`, the message type is checked.

```kex
send(msg) : X -> Void
```

**Returns**: `Void`

#### `sendFrom`

Sends the sender-bearing pair `{Process.self, msg}`, with the message type checked.

```kex
sendFrom(msg) : X -> Void
```

**Returns**: `Void`

## make `Server<X>`


#### `within`

Returns the same server with a different default call timeout, in milliseconds.

The server is untouched — this is a new view of it, so one slow call can be given more room without changing anything for other callers.

```kex
within(timeout) : Integer -> Server<X>
```

**Returns**: `Server<X>` — a view of the server with that timeout

**Examples**

_Giving one call longer to answer_

```kex
api.within(30000).rebuildIndex()
```

## make `From<X>`


#### `reply`

Answers the pending call this value identifies.

A slot that cannot answer immediately — because it is waiting on something else — omits `reply` from its transition and calls this later instead.

```kex
reply(value) : X -> Void
```

**Returns**: `Void`

**Examples**

_Answering after the work is done_

```kex
Task.start do
  from.reply(expensiveThing())
end
```

## module `Task`

Running work in another process and collecting the answer.

## function `sleep`

Suspends for an elapsed duration. Negative durations are treated as zero.


```kex
sleep(duration) : Duration -> Void
```


## function `start`

Runs `f` in a new process and returns a handle on its result.

The block starts immediately, so starting several tasks and awaiting them afterwards is what makes them run at the same time.


```kex
start(f) : Block<X> -> Task
```


## function `awaitAll`

Waits for every task in `tasks` and returns their results, in the order the tasks were given.

Each result comes back wrapped in a `Result`, so one task failing does not cost you the others' answers. That differs from `Task.await` on a single task, which hands back the value itself.


```kex
awaitAll(tasks) : [Task] -> [X]
```


## make `Task`


#### `await`

Waits for the task's result, giving up after `timeout` milliseconds.

Answers `None` if the task has not finished in time. The task itself is not stopped.

```kex
await(timeout) : Integer -> X
```

**Returns**: `X` — the task's result, or `None` on timeout

**Examples**

```kex
let t = Task.start do slowThing() end
t.await(1000)
```

## function `worker`

Wraps a spawn block into a worker spec for `Supervisor.start`.


```kex
worker : Block<Pid> -> (Atom, Block<Pid>)
```


## make `Reference`


