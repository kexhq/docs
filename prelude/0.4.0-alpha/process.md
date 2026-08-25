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

Process and concurrency primitives — backed by Kex.Intrinsic.Process and the BEAM runtime. Pid is an opaque BEAM process identifier; Task wraps a spawned process with an awaitable result.



## type `Task<A>`



## type `Reference`



## type `Process<A>`



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



## type `CallError`



**Variants**

  - `Timeout`
  - `NoProcess`
  - `CallFailed`

## record `Server<X>`

**Fields**

  - `process` : Process<X>
  - `timeout` : Integer (optional)

## module `Process`

## function `spawn`

Starts a process-backed server for the serving implementation attached to X.


```kex
spawn(state) : X -> Server<X>
```


## function `run`

Run an executable directly with an argv vector. No shell is involved. Output is captured as UTF-8 strings; a non-zero child status is still a successful ProcessResult, while failure to start the child is Error.


```kex
run(command, args) : String -> [String] -> Result<ProcessResult, String>
```


## function `stream`

Run an executable with the CALLER's stdout and stderr, so its output appears as it is produced rather than in one block when it exits. Answers the exit code; nothing is captured — that is the trade, and it is what a long-running child a person is watching needs (kexhq/kex#187).

`run` remains the one to use when the output is data to be READ.


```kex
stream(command, args) : String -> [String] -> Result<Integer, String>
```


## function `exec`


```kex
exec(command, args) : String -> [String] -> Integer
```


## constant `self`

Returns the calling process's Pid.



## function `exit`

Sends an exit signal with `reason` to `pid`.


```kex
exit(pid, reason) : Pid -> X -> Void
```


## function `register`

Registers `pid` under the given atom `name`.


```kex
register(pid, name) : Pid -> Atom -> Void
```


## function `whereis`

Returns the Pid registered under `name`, or None.


```kex
whereis(name) : Atom -> Pid?
```


## record `ProcessResult`

**Fields**

  - `exitCode` : Integer
  - `stdout` : String
  - `stderr` : String

## make `Pid`


#### `send`

Sends `msg` unchanged as a raw BEAM term.

```kex
send(msg) : X -> Void
```

#### `sendFrom`

Sends the conventional Erlang sender-bearing pair {Process.self, msg}.

```kex
sendFrom(msg) : X -> Void
```

## make `Process<X>`

A spawned Process<X> is a typed process handle backed by the same runtime pid. It therefore supports the ordinary pid lifecycle operations without erasing its message type.


#### `send`

```kex
send(msg) : X -> Void
```

#### `sendFrom`

```kex
sendFrom(msg) : X -> Void
```

## make `Server<X>`


#### `within`

Return an immutable view of the same server with a new default call timeout.

```kex
within(timeout) : Integer -> Server<X>
```

## make `From<X>`


#### `reply`

Completes the pending call identified by this caller/reference pair.

```kex
reply(value) : X -> Void
```

## module `Task`

## function `start`

Spawns a new process that runs `f` and returns a Task handle.


```kex
start(f) : Block<X> -> Task
```


## function `awaitAll`

Awaits all tasks in `tasks`, returning their results.


```kex
awaitAll(tasks) : [Task] -> [X]
```


## make `Task`


#### `await`

Waits for the task's result, with a timeout in milliseconds. Returns `None` on timeout.

```kex
await(timeout) : Integer -> X
```

## function `worker`

Wraps a spawn block into a worker spec for Supervisor.start.


```kex
worker : Block<Pid> -> (Atom, Block<Pid>)
```


## make `Reference`


