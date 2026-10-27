---
id: "guide-0-4-0-beta-4-processes"
title: "Processes and tasks"
description: "Run independent work and communicate through messages."
path: "/guide/0.4.0-beta.4/processes/"
draft: false
template: "page"
---
A Kex process has its own execution and mailbox. Values are sent as messages; a local `var` is not a shared variable between processes. On BEAM these are lightweight VM processes, not one operating-system process per task.

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

The process handle's type constrains what can be sent to it. `Process.self` identifies the caller so the worker can reply. After handling one message, this worker reaches the end of its body and exits.

`receive` selects a matching message. A receive without a matching message waits; `after timeout:` supplies a bounded wait in milliseconds. The timeout body has no pattern or arrow and shares the receive's closing `end`.

## Long-running processes

Wrap repeated receives in `loop do ... end`, or use a recursive effectful function carrying state. Design a stop message so callers can terminate the worker intentionally. Add a request identifier when multiple requests can be outstanding; a reply's payload alone may not identify which request it belongs to.

Use links or monitors when failure must be observed. A sent message is not an acknowledgment that work completed. If you need request/reply state management, [typed servers](../servers/) provide a more structured interface.

## Tasks

```kex
foul runProcesses2() do
  let firstTask = Task.start { (1..10).reduce(0, ~(+)) }
  let secondTask = Task.start { "kex".upperCase }
  assert(firstTask.await(timeout: 5000) == Ok(55))
  assert(secondTask.await(timeout: 5000) == Ok("KEX"))
end
runProcesses2()
```

Start independent tasks before awaiting either, so their work can overlap. `await` returns a result; handle task failure and timeout rather than assuming a value. A timeout describes the wait, so do not assume that it also cancels underlying work.

## Distribution and deployment

BEAM nodes can be named with `--sname` or `--name` and a shared `--cookie`. The opt-in `Node` module supports connecting and addressing work across nodes. The interpreter remains a local, unnamed node.

Distributed calls add remote failure modes and code-version requirements. Use bounded waits and deploy compatible code to nodes that exchange functions or invoke methods on shared data. Cookies are credentials; keep them out of source control and avoid exposing a development distribution network to untrusted hosts.

The richer declarative supervision DSL is not taught as a working API here. Build supervision against the APIs present in your toolchain and verify restart behavior on your deployment backend.
