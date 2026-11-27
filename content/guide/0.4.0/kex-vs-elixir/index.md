---
id: "guide-0-4-0-beta-4-kex-vs-elixir"
title: "Kex vs Elixir"
description: "Shared BEAM ideas with different types, effects, and server interfaces."
path: "/guide/0.4.0/kex-vs-elixir/"
draft: false
template: "page"
---
If you know Elixir, Kex's immutable data, pattern matching, and BEAM processes give you a useful starting point. The examples below translate pipelines and results first, then show Kex's typed server interface. Pay attention to `let`, `foul`, and the meaning of a dot call.

The examples use Kex 0.4.0. Elixir's compiler and typing tools continue to develop, so compare the behavior shown here with the Elixir version you use.

## At a glance

| Idea | Elixir | Kex |  |
| --- | --- | --- | --- |
| Function declaration | `def` or `defp` inside a module | Pure `let` or effectful `foul` |  |
| Composition | \`value \\ | \> function(args)\` | `value.function(args)` |
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
  .filter { |n| n.even? }
  .map { |n| n * 10 }

assert(result == [20, 40])
```

Or as an even more compact solution:

```kex
let result = (1..4).filter(&.even?).map(~(*)(10))
```

Both examples produce `[20, 40]`: first keep the even numbers, then multiply them by ten. In Kex, the value before the dot supplies the first argument, but the syntax and lookup rules differ from Elixir's pipe. Use `~function` for a named capture and `&.method` for a block that calls a method on its argument.

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

Both versions turn a success containing `42` into `"value=42"`. The Kex version also shows the error case, which becomes `"failed: missing"`. Its `Result<Integer, String>` declaration gives the checker the two payload types. Kex match arms use `=>`, and interpolation uses `${...}`.

## A process is still a process

Elixir processes have mailboxes, send and receive messages, and support links and monitors. This is the right starting model for Kex on BEAM as well. [Elixir processes](https://elixir.hexdocs.pm/processes.html)

`Process<Message>` checks the shape of messages sent through a handle. You still need to account for a stopped recipient, a missing reply, and a timeout, just as you would when designing an Elixir process protocol.

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

`counter.add(2)` sends a request and gets `Ok(2)` back. In Elixir, a GenServer normally defines callbacks such as `handle_call` and public wrapper functions. Kex derives the request interface from its `slot` declarations: `Reply<A>` is a call, while `Void` is a cast. On BEAM, it uses OTP GenServer conventions. [Elixir GenServer](https://elixir.hexdocs.pm/GenServer.html)

If a call times out, the server may already have changed its state. Decide whether repeating the request is safe before retrying it. Treat supervision as a separate part of the design and use the APIs available in your Kex toolchain.

## Effects, macros, and ecosystem boundaries

Elixir's ordinary function declaration does not separate pure computation from effects. Kex requires `foul` at an effectful function boundary. Separate a pure transformation from the function that logs, reads input, or sends a message.

Elixir macros and Kex `compiled` generation are also different APIs. Port the intended generated interface and verify its expansion rather than translating metaprogramming syntax mechanically.

When connecting Kex and Elixir code, check the data passed across the boundary, who owns each process, and the module interface on each side. A Hex dependency also needs an explicit integration plan; it is not automatically a Tey package.

Continue with [processes](../processes/), [typed servers](../servers/), [effects](../effects/), and [compile-time programming](../compiled/).
