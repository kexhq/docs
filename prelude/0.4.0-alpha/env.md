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

The process environment, as an immutable `Map<String, String>` snapshot taken at startup.

`ENV` supports the whole `Map` API: `get`, `has?`, `keys`, `values`, `count`, `each`, `entries`, so reading a variable looks like any other map lookup:

```kex
ENV.get("HOME")                  # => Just("/home/ada")
ENV.get("LOG_LEVEL", "info")     # => "info" when unset
ENV.has?("PATH")                 # => true
```

The snapshot itself is immutable, but the global `ENV` namespace is an ambient input: the same call can answer differently between runs without anything appearing in a function's arguments. That is why reading it is `foul`.

When you would rather the dependency be visible, take it as a parameter: `main` receives the same snapshot as its second argument, and reading a parameter is pure:

```kex
main(args, env) do
  let level = env.get("LOG_LEVEL", "info")
  IO.printLine("log level: ${level}")
end
```

## function `get`

Returns the value of the environment variable `key`, or `None` when it is not set.


```kex
get(key)
```


## function `has?`

Returns `true` when `key` is set, whatever its value.

Distinguishes an unset variable from one set to the empty string, which a `get` with a default cannot.


```kex
has?(key)
```


## function `keys`

Returns every variable name in the environment.


```kex
keys()
```


## function `values`

Returns every variable value in the environment.


```kex
values()
```


## function `count`

Returns how many variables the environment has.


```kex
count()
```


## function `each`

Calls `f` with each variable's name and value.


```kex
each(f)
```


## function `entries`

Returns the environment as a list of `(name, value)` pairs.

The bridge to the `List` operations, sorting, grouping, taking a slice.


```kex
entries()
```


## function `set`

Sets an environment variable for this process and every child it starts.

`ENV` is a snapshot, and the write rebuilds it: a later `ENV.get` answers what was set, not what the process started with.

This is how a program decides what a child sees. `Kex.AST`, for instance, shells out to the compiler named by `$KEX`, so a tool that knows which compiler it means says so here rather than hoping `PATH` agrees.

Sets a variable for THIS process and every child it starts. `ENV` is a snapshot, so it is rebuilt by the write: a later `ENV.get` answers what was set, not what the process started with.

This is how a program decides what a child sees: `Kex.AST` shells out to the compiler named by `$KEX`, so a tool that knows which compiler it means says so here rather than hoping PATH agrees.


```kex
set(name, value)
```


## function `unset`

Removes an environment variable from this process and its children.


```kex
unset(name)
```

