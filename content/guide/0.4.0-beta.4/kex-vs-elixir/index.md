---
id: "guide-0-4-0-beta-4-kex-vs-elixir"
title: "Kex vs Elixir"
description: "Shared BEAM ideas with different types, effects, and server interfaces."
path: "/guide/0.4.0-beta.4/kex-vs-elixir/"
draft: false
template: "page"
---
Elixir and Kex share a useful foundation: immutable data, pattern matching, and isolated processes communicating through messages. Kex runs on BEAM by default, so an Elixir programmer already knows much of the runtime model. The main changes are Kex's type-oriented declarations, explicit effect boundary, UFCS, and typed `serving` interface.

This page targets **Kex 0.4.0-beta.4**. It distinguishes longstanding Elixir syntax from current compiler capabilities rather than treating Elixir as a language whose tooling never changes.

## At a glance

| Idea | Elixir | Kex |  |
| --- | --- | --- | --- |
| Function declaration | `def` or `defp` inside a module | Pure `let` or effectful `foul` |  |
| Composition | \`value | \> function(args)\` | `value.function(args)` through UFCS |
| Rebinding | A variable may be rebound; values remain immutable | `let` prevents rebinding; `var` permits it |  |
| Structured data | Structs and maps | Records and maps |  |
| Result convention | Often `{:ok, value}` / `{:error, reason}` | `Ok(value)` / `Error(reason)` |  |
| Server behavior | `GenServer` callbacks and public wrapper functions | `serving` slots on record state |  |
| Process interface | Pids and message conventions | `Process<Message>` and typed server handles |  |

Elixir is incorporating gradual set-theoretic analysis into its compiler. Its current documentation describes inference and diagnostics from existing code, with user-provided signatures planned separately. Existing `@spec` declarations and Dialyzer also have their own role. Therefore, “Elixir has no type checking” is not a sound comparison. Kex's relevant distinction here is its checked annotations, declared alternatives, and typed receiver/message interfaces. [Elixir compiler types](https://elixir.hexdocs.pm/gradual-set-theoretic-types.html), [Elixir typespecs](https://elixir.hexdocs.pm/1.17/typespecs.html)

## Pipelines become method chains

Elixir:

```elixir
result =
  [1, 2, 3, 4]
  |> Enum.filter(fn n -> rem(n, 2) == 0 end)
  |> Enum.map(fn n -> n * 10 end)

true = result == [20, 40]
```

Kex:

```kex
let result = [1, 2, 3, 4]
  .filter { |n| n % 2 == 0 }
  .map { |n| n * 10 }

assert(result == [20, 40])
```

The left-hand value supplies the first argument, but the syntax and lookup rules differ. Kex's dot can select receiver behavior; it does not mean an Elixir-style module qualifier in every position. Use `~function` for a named capture and `&.method` for a block that calls a method on its argument.

## Matching a reported result

Elixir:

```elixir
value = {:ok, 42}
message =
  case value do
    {:ok, number} -> "value=#{number}"
    {:error, reason} -> "failed: #{reason}"
  end

true = message == "value=42"
```

Kex:

```kex
let describe(value: Result<Integer, String>) -> String do
  match value do
    Ok(number) => "value=${number}"
    Error(reason) => "failed: ${reason}"
  end
end

assert(describe(Ok(42)) == "value=42")
assert(describe(Error("missing")) == "failed: missing")
```

Kex arms use `=>`, while `->` appears in function types and return annotations. Interpolation uses `${...}`. A declared result type lets the checker reason about its payloads; do not translate every tagged tuple into an unstructured value and discard that information.

## A process is still a process

Elixir processes have mailboxes, send and receive messages, and support links and monitors. This is the right starting model for Kex on BEAM as well. [Elixir processes](https://elixir.hexdocs.pm/processes.html)

Kex can add `Process<Message>` to constrain sends through a handle. That checks the message shape; it does not prove the recipient is alive, that it will reply, or that an operation will finish before a timeout. Keep the failure and lifecycle reasoning you already use in Elixir.

For process-owned state, a Kex protocol can be concise:

```kex
record Counter do
  count : Integer = 0
end

serving Counter do
  slot add(amount: Integer) -> Reply<Integer> do
    new.count = @count + amount
    return { new, reply: new.count }
  end
end

foul demonstrateServer() do
  let counter = Process.spawn(Counter {})
  assert(counter.add(2, within: 5000) == Ok(2))
end
demonstrateServer()
```

In a conventional Elixir GenServer, you define callbacks such as `handle_call` and often expose wrapper functions around `GenServer.call`. Kex derives the request interface from `slot` declarations: `Reply<A>` is a call and `Void` is a cast. On BEAM it uses OTP GenServer conventions. [Elixir GenServer](https://elixir.hexdocs.pm/GenServer.html)

The interface does not remove distributed-systems concerns. A timed-out request may already have changed state; retries need an idempotency decision. Kex's guide does not promise Elixir's full supervision ergonomics merely because the runtime is BEAM.

## Effects, macros, and ecosystem boundaries

Elixir's ordinary function declaration does not separate pure computation from effects. Kex requires `foul` at an effectful function boundary. Separate a pure transformation from the function that logs, reads input, or sends a message.

Elixir macros and Kex `compiled` generation are also different APIs. Port the intended generated interface and verify its expansion rather than translating metaprogramming syntax mechanically.

Shared BEAM foundations make interoperability possible, but do not mean Hex packages become Tey dependencies or every Elixir value has the Kex representation a checked API expects. Audit data representation, lifecycle, and module interfaces at each boundary. Compare real applications before making performance or operational claims.

Continue with [processes](../processes/), [typed servers](../servers/), [effects](../effects/), and [compile-time programming](../compiled/).
