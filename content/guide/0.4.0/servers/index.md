---
id: "guide-0-4-0-beta-4-servers"
title: "Typed servers"
description: "Own mutable state behind a checked call and cast protocol."
path: "/guide/0.4.0/servers/"
draft: false
template: "page"
---
The previous chapter sent messages to a worker directly. For state with named operations, a typed server defines those operations in a `serving` block. This counter can report its value, add an amount, and reset:

```kex
record CounterState do
  value : Integer = 0
end

serving CounterState do
  slot current -> Reply<Integer> = { reply: @value }

  slot add(amount: Integer) -> Reply<Integer> do
    new.value = @value + amount
    return { new, reply: new.value }
  end

  slot reset -> Void = New { value: 0 }
end

main do
  let counter = Process.spawn(CounterState {})
  assert(counter.add(3, within: 5000) == Ok(3))
  assert(counter.current() == Ok(3))
  counter.reset()
  assert(counter.current() == Ok(0))
end
```

`Process.spawn(CounterState {})` starts the server with a value of zero. `add(3)` returns `Ok(3)`, and `current()` reads that state. A `Reply<A>` slot is a synchronous call that returns `Result<A, CallError>` because the server may fail or time out. A `Void` slot sends an asynchronous cast; sending it does not itself confirm completion.

The final `current()` observes the preceding `reset()` because messages from this sender preserve order. Another sender could interleave its own work, so that ordering is not a global guarantee.

## State transitions

Each slot handles one operation on the current state. `@value` reads the current field; `New { ... }` builds replacement state. For several updates, the implicit local `new` starts from the current state. The original record is still an immutable value.

| Handler result | Meaning |
| --- | --- |
| `{ reply: value }` | Reply without changing state |
| `{ new, reply: value }` | Replace state and reply |
| `{ new }` | Replace state without an immediate reply |
| A transition with `stop: reason` | Stop after applying the transition |

A call needs a reply. If a slot cannot reply immediately, a foul call slot can keep the typed `from` reference and use `from.reply(value)` later. That reference identifies the call, so overlapping requests can receive their own results.

## Timeouts and retries

A per-call `within:` wins over a handle's `.within(milliseconds)` setting; otherwise the default is 5000 milliseconds. A timeout does not prove that the server made no state change. Retrying `add(3)` blindly can apply it twice. Use request identities or an idempotent operation when retries must be safe.

Keep slot work short. A long blocking operation delays other requests to the same owner; use a task and a deferred reply when the protocol allows it.

## BEAM integration

On BEAM a typed server uses OTP `gen_server` conventions. Hot reload can switch handlers and adapt state fields by name; new fields need defaults or an appropriate upgrade strategy. Test a live migration explicitly rather than assuming that a source-compatible edit is automatically state-compatible.

Use raw processes for custom mailbox protocols and typed servers for state with named requests. Both use the same immutable data and message-passing model.
