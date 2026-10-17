---
package: prelude
version: "0.4.0-beta.4-dev"
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

### `get`

```kex
get(key: String, default) -> String?
```

Returns the value of the environment variable `key`, or `None` when it is not set.

**Parameters**

  - `key` — the variable name

**Returns**: the value, or `None`

**Examples**

```kex
ENV.get("HOME")        # => Just("/home/ada")
ENV.get("NOT_SET")     # => None
```

_Handling both cases explicitly_

```kex
match ENV.get("HOME") do
  Just(home) => IO.printLine("home: ${home}")
  None       => IO.printError("HOME is not set")
end
```

### `has?`

```kex
has?(key: String) -> Bool
```

Returns `true` when `key` is set, whatever its value.

Distinguishes an unset variable from one set to the empty string, which a `get` with a default cannot.

**Parameters**

  - `key` — the variable name

**Returns**: `true` when the variable is set

**Examples**

```kex
ENV.has?("PATH")      # => true
ENV.has?("NOT_SET")   # => false
```

_Turning a flag on by its presence alone_

```kex
let debug = ENV.has?("DEBUG")
```

### `keys`

```kex
keys : [String]
```

Returns every variable name in the environment.

**Returns**: the variable names

**Examples**

```kex
ENV.keys.count   # => 47
```

_Every variable belonging to one tool_

```kex
ENV.keys.filter { |name| name.startsWith?("KEX_") }
```

### `values`

```kex
values : [String]
```

Returns every variable value in the environment.

**Returns**: the values

**Examples**

```kex
ENV.values.count   # => 47
```

### `count`

```kex
count : Integer
```

Returns how many variables the environment has.

**Returns**: the number of variables

**Examples**

```kex
IO.printLine("environment has ${ENV.count} variables")
```

### `each`

```kex
each(f: (String -> String -> Void)) -> Void
```

Calls `f` with each variable's name and value.

**Parameters**

  - `f` — called once per variable

**Examples**

_Dumping the environment_

```kex
ENV.each { |name, value| IO.printLine("${name}=${value}") }
```

### `entries`

```kex
entries : [(String, String)]
```

Returns the environment as a list of `(name, value)` pairs.

The bridge to the `List` operations, sorting, grouping, taking a slice.

**Returns**: the variables

**Examples**

_Printing the environment in name order_

```kex
ENV.entries.each { |name, value| IO.printLine("${name}=${value}") }
```

### `set`

```kex
set(name: String, value: String) -> Void
```

Sets an environment variable for this process and every child it starts.

`ENV` is a snapshot, and the write rebuilds it: a later `ENV.get` answers what was set, not what the process started with.

This is how a program decides what a child sees. `Kex.AST`, for instance, shells out to the compiler named by `$KEX`, so a tool that knows which compiler it means says so here rather than hoping `PATH` agrees.

Sets a variable for THIS process and every child it starts. `ENV` is a snapshot, so it is rebuilt by the write: a later `ENV.get` answers what was set, not what the process started with.

This is how a program decides what a child sees: `Kex.AST` shells out to the compiler named by `$KEX`, so a tool that knows which compiler it means says so here rather than hoping PATH agrees.

**Parameters**

  - `name` — the variable to set
  - `value` — the value to give it

**Examples**

```kex
ENV.set("KEX", "/usr/local/bin/kex")
ENV.get("KEX")   # => Just("/usr/local/bin/kex")
```

_Making a child process quiet_

```kex
ENV.set("NO_COLOR", "1")
```

### `unset`

```kex
unset(name: String) -> Void
```

Removes an environment variable from this process and its children.

**Parameters**

  - `name` — the variable to remove

**Examples**

```kex
ENV.unset("DEBUG")
ENV.has?("DEBUG")   # => false
```

_Making sure a child does not inherit a setting_

```kex
ENV.unset("KEX_TRACE")
```
