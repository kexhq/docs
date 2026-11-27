---
id: "guide-0-4-0-beta-4-effects"
title: "Effects and local state"
description: "Pure transformations, explicit effects, and replaceable capabilities."
path: "/guide/0.4.0/effects/"
draft: false
template: "page"
---
A pure function computes a value from its inputs. Printing that value changes what someone outside the function can observe, so Kex marks the printing function with `foul`:

```kex
let formatMessage(name: String) -> String = "Hello, ${name}"
foul printMessage(name: String) -> Void = IO.printLine(formatMessage(name))
foul runEffects1() do
  printMessage("Ada")
end
runEffects1()
```

```output filename="OUTPUT"
Hello, Ada
```

`formatMessage` builds a string and `printMessage` writes it to the screen. Pure code cannot call foul code. `main` is implicitly foul, and each function in a module declares its own effect boundary.

## Local reassignment is not shared mutation

The next example changes local bindings without changing values held by other bindings:

```kex
let sumTo(limit: Integer) -> Integer do
  var total = 0
  var current = 1
  while current <= limit do
    total = total + current
    current = current + 1
  end
  total
end
assert(sumTo(4) == 10)

foul demonstrateEffects1() do
  var items = [1, 2]
  let earlier = items
  items.push!(3)
  assert(items == [1, 2, 3])
  assert(earlier == [1, 2])
end
demonstrateEffects1()
```

`sumTo(4)` returns `10`. Its `var` bindings change only during that calculation, so the function can remain pure. In the second part, `items.push!(3)` rebinds `items` to a new list. `earlier` still holds `[1, 2]`. A `!` call requires a mutable binding, but it does not mutate every value that was copied from that binding.

## Capabilities

Sometimes you want to replace an effectful service without changing every function that calls it. A capability provides a default implementation, and `with` supplies another implementation for one region. Here a fixed clock replaces a default clock:

```kex
capability GuideClock do
  foul now() -> Integer = 1000
end

record FixedGuideClock do
  value : Integer
end

make FixedGuideClock, implement: GuideClock do
  foul now() -> Integer = @value
end

foul timestamp() -> Integer = GuideClock.now()

foul runEffects2() do
  assert(timestamp() == 1000)
  with GuideClock = FixedGuideClock { value: 42 } do
    assert(timestamp() == 42)
  end
  assert(timestamp() == 1000)
end
runEffects2()
```

The first `timestamp()` returns `1000`, the call inside `with` returns `42`, and the final call returns `1000` again. The replacement reaches the call through `timestamp`, so that helper does not need a clock parameter. Leaving the block restores the prior implementation.

A process started inside the region inherits its replacements. A process that was already running does not change when another process enters `with`.

This is especially useful in [tests](../testing/), where a filesystem or environment implementation can supply controlled data. A replacement does not make an effectful interface pure: code still declares and respects its effects.
