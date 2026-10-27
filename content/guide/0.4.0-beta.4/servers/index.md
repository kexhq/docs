---
id: "guide-0-4-0-beta-4-servers"
title: "Typed servers"
description: "Own mutable state behind a checked call and cast protocol."
path: "/guide/0.4.0-beta.4/servers/"
draft: false
template: "page"
---
A `serving` block defines a request protocol for record state. `Process.spawn(state)` starts its owner and returns a typed server handle. Callers use methods on that handle rather than constructing mailbox messages manually.

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

A `Reply<A>` slot is a synchronous call. The caller receives `Result<A, CallError>`, since a server can stop, fail, or time out. A `Void` slot is an asynchronous cast: returning from the send does not itself confirm completion.

Messages from the same sender preserve ordering, so the final `current()` call above observes the preceding reset cast. This is not a global ordering guarantee across independent senders.

## State transitions

The handler reads the current receiver through `@field`. `New { ... }` creates replacement state; implicit `new` supports several functional updates. The original state remains immutable.

| Handler result | Meaning |
| --- | --- |
| `{ reply: value }` | Reply without changing state |
| `{ new, reply: value }` | Replace state and reply |
| `{ new }` | Replace state without an immediate reply |
| A transition with `stop: reason` | Stop after applying the transition |

A call cannot simply forget its reply. Deferred replies use the typed `from` reference inside a foul call slot, with `from.reply(value)` used later. That reference includes the call identity, so overlapping calls can receive the correct response.

## Timeouts and retries

A per-call `within:` wins over a handle's `.within(milliseconds)` setting; otherwise the default is 5000 milliseconds. A timeout does not prove that the server made no state change. Retrying `add(3)` blindly can apply it twice. Use request identities or an idempotent operation when retries must be safe.

Keep slot work short. A long blocking operation delays other requests to the same owner; use a task and a deferred reply when the protocol allows it.

## BEAM integration

On BEAM a typed server uses OTP `gen_server` conventions. Hot reload can switch handlers and adapt state fields by name; new fields need defaults or an appropriate upgrade strategy. Test a live migration explicitly rather than assuming that a source-compatible edit is automatically state-compatible.

Use raw processes for custom mailbox protocols and typed servers for state with named requests. Both use the same immutable data and message-passing model.
