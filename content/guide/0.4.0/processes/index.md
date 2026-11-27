---
id: "guide-0-4-0-beta-4-processes"
title: "Processes and tasks"
description: "Run independent work and communicate through messages."
path: "/guide/0.4.0/processes/"
draft: false
template: "page"
---
A process runs independently and receives messages through its mailbox. The next example starts a worker, sends it a name, and waits for a greeting. Each process has its own local bindings; a `var` is not shared between them.

This chapter’s combined example runs on BEAM. The message round trip also works in the interpreter, but beta.4 interpreter task handles fail at `await` with `Error("not a task")`; use BEAM for the task example.

<!-- guide-backend: beam -->

## One request and one reply

```kex
type GreetingMessage = Greet(Process<String>, String)

foul runProcesses1() do
  let worker: Process<GreetingMessage> = spawn do
    receive do
      Greet(sender, name) => sender.send("Hello, ${name}")
    end
  end
  worker.send(Greet(Process.self, "Ada"))
  receive do
    message => assert(message == "Hello, Ada")
  after timeout: 5000
    assert(false, "worker did not reply")
  end
end
runProcesses1()
```

`Process<GreetingMessage>` accepts a `Greet` message. `Process.self` gives the worker a return address, and the caller checks the reply `"Hello, Ada"`. After handling this message, the worker reaches the end of its body and exits. On BEAM, these are lightweight VM processes rather than one operating-system process per task.

The caller's `receive` waits for a matching message. `after timeout: 5000` gives it a five-second limit, so a worker that never replies cannot leave this example waiting forever. The timeout body uses the same closing `end` as the receive.

## Long-running processes

The first worker exits after one request. To keep a worker alive, put its receive in `loop do ... end` or call a recursive effectful function that carries state. Give it a stop message so callers can end it deliberately. If several requests may be waiting for replies, add an identifier to each request and reply.

Use links or monitors when failure must be observed. A sent message is not an acknowledgment that work completed. If you need request/reply state management, [typed servers](../servers/) provide a more structured interface.

## Tasks

A task is useful when you want a result from independent work. Start both tasks before waiting for either one:

```kex
foul runProcesses2() do
  let firstTask = Task.start { (1..10).reduce(0, ~(+)) }
  let secondTask = Task.start { "kex".upperCase }
  assert(firstTask.await(timeout: 5000) == Ok(55))
  assert(secondTask.await(timeout: 5000) == Ok("KEX"))
end
runProcesses2()
```

The first task adds the numbers from one to ten and returns `Ok(55)`. The second uppercases `"kex"` and returns `Ok("KEX")`. Because both start before either `await`, their work can overlap. `await` returns a result, which may instead report failure or a timeout. A timed-out wait does not necessarily cancel the work.

## Distribution and deployment

BEAM nodes can be named with `--sname` or `--name` and a shared `--cookie`. The opt-in `Node` module supports connecting and addressing work across nodes. The interpreter remains a local, unnamed node.

Distributed calls add remote failure modes and code-version requirements. Use bounded waits and deploy compatible code to nodes that exchange functions or invoke methods on shared data. Cookies are credentials; keep them out of source control and avoid exposing a development distribution network to untrusted hosts.

The richer declarative supervision DSL is not taught as a working API here. Build supervision against the APIs present in your toolchain and verify restart behavior on your deployment backend.
