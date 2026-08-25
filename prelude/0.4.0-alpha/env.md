---
package: prelude
version: "0.4.0-alpha"
source: env.kex
title: ENV
entities:
  - { kind: module, name: "ENV" }
---

# ENV

## module `ENV`

`ENV` is an immutable `Map<String, String>` snapshot of the process environment, taken once at startup. It supports all regular `Map` operations — `get`, `has?`, `keys`, `count`, `each`, etc.

Although the snapshot itself is immutable, the global `ENV` namespace is an ambient input. Reading it is `foul` because results can differ between process launches without appearing in a function's arguments.

  # Two-argument get returns the default when the key is absent   let logLevel = ENV.get("LOG_LEVEL", "info")

  # Standard Map API works as-is   IO.printLine("has PATH? ${ENV.has?("PATH")}")   IO.printLine("var count: ${ENV.count}")

ENV : Map<String, String>

`main` receives the environment snapshot as its second parameter, which is the same immutable value exposed by global `ENV`. Reading the parameter is pure because the dependency is explicit in the function signature.

## function `get`


```kex
get(key)
```


## function `has?`


```kex
has?(key)
```


## constant `keys`



## constant `values`



## constant `count`



## function `each`


```kex
each(f)
```


## constant `entries`



## function `set`

Sets a variable for THIS process and every child it starts. `ENV` is a snapshot, so it is rebuilt by the write — a later `ENV.get` answers what was set, not what the process started with.

This is how a program decides what a child sees: `Kex.AST` shells out to the compiler named by `$KEX`, so a tool that knows which compiler it means says so here rather than hoping PATH agrees.


```kex
set(name, value)
```


## function `unset`

Removes a variable from this process and its children.


```kex
unset(name)
```

