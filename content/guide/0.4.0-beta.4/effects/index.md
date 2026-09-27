---
id: "guide-0-4-0-beta-4-effects"
title: "Effects and local state"
description: "Pure transformations, explicit effects, and replaceable capabilities."
path: "/guide/0.4.0-beta.4/effects/"
draft: false
template: "page"
---
A pure function computes from values. An effectful function may read or change the outside world, or communicate with another process. Kex uses `foul` to make that distinction visible.

```kex
let formatMessage(name: String) -> String = "Hello, ${name}"
foul printMessage(name: String) -> Void = IO.printLine(formatMessage(name))
foul runEffects1() do
  printMessage("Ada")
end
runEffects1()
```

Pure code cannot call foul code. `main` is implicitly foul. A module has no effect of its own: each function makes its own declaration. There is no `foul module` that silently changes every function inside.

## Local reassignment is not shared mutation

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

`items.push!(3)` rebinds `items` to `items.push(3)`. The binding must be mutable; aliases keep their old values. A local accumulator can be an implementation detail of a pure calculation. State that persists in a running process belongs at an effectful boundary.

## Capabilities

A capability supplies a service with a default implementation. A record can implement it, and `with` can replace the implementation for a region:

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

The replacement reaches calls made through the capability inside helper functions; those helpers do not need a new parameter. Leaving the block restores the previous implementation. A process spawned inside the region inherits its replacements; an already-running process does not change because another process enters a `with` block.

This is especially useful in [tests](../testing/), where a filesystem or environment implementation can supply controlled data. A replacement does not make an effectful interface pure: code still declares and respects its effects.
