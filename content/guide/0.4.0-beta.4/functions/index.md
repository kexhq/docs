---
id: "guide-0-4-0-beta-4-functions"
title: "Functions and blocks"
description: "Declarations, UFCS, higher-order functions, and closures."
path: "/guide/0.4.0-beta.4/functions/"
draft: false
template: "page"
---
Functions are values, and functions that accept other functions are the normal way to express traversal, callbacks, and composition.

## Define an interface

```kex
let add(left: Integer, right: Integer) -> Integer = left + right
let welcome(name: String, punctuation: String = "!") -> String do
  "Hello, ${name}${punctuation}"
end
assert(add(2, 3) == 5)
assert(welcome("Ada") == "Hello, Ada!")
assert(welcome("Ada", punctuation: ".") == "Hello, Ada.")
```

Use `=` for a single expression and `do ... end` for a body with several steps. Default arguments make an option optional at the call site. Named arguments are useful when several parameters would otherwise be hard to distinguish.

## UFCS and receiver methods

A free function can be called with its first argument before the dot:

```kex
assert(2.add(3) == add(2, 3))
```

A `make` block supplies methods for a receiver type. Kex resolves methods and free functions using the receiver and the declarations in scope. Avoid unrelated overloads with indistinguishable signatures; qualify a module call when imports make a name ambiguous.

## Pass a function

A block supplies a function directly; `~name` captures an existing function:

```kex
let triple(n: Integer) -> Integer = n * 3
let fromBlock = [1, 2, 3].map { |n| n * 3 }
let fromCapture = [1, 2, 3].map(~triple)
let lengths = ["a", "abcd"].map(&.count)
assert(fromBlock == fromCapture)
assert(lengths == [1, 4])
```

`&.count` means `{ |value| value.count }`. It calls a method on the argument; `~count` captures a named function. A multiline callback uses `do |value| ... end`.

## Partial application

```kex
let plusTen = ~add(10)
let subtractFive = ~(-)(_, 5)
assert(plusTen(7) == 17)
assert(subtractFive(12) == 7)
assert([1, 2, 3].reduce(0, ~(+)) == 6)
```

Captured arguments fill parameters from left to right. `_` leaves a particular position open. `~(+)` captures an operator as a function. Capturing `&&` or `||` produces an ordinary function, so its arguments are evaluated before the call; it does not preserve the operators' short-circuit behavior.

## Closures and captured bindings

```kex
foul demonstrateFunctions1() do
  let amount = 10
  let snapshot = { amount }
  assert(snapshot() == 10)
end
demonstrateFunctions1()
```

Capture immutable bindings when you want portable closure behavior. In the tested beta.4 toolchain, BEAM snapshots a captured `var`, but the interpreter observes later reassignment of that binding. Avoid depending on mutable-capture behavior in code intended for both backends. Use a process when several pieces of concurrent code need one owner for changing state.

For decisions expressed as multiple function clauses, continue with [Pattern matching](../patterns/).
