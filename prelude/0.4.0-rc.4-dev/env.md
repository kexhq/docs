---
package: prelude
version: "0.4.0-rc.4-dev"
source: env.kex
title: ENV
entities:
  - { kind: module, name: "ENV" }
---

# ENV

## module `ENV`

The process environment.

`ENV` has the reading functions of a `Map<String, String>` (`get`, `has?`, `keys`, `values`, `count`, `each`, `entries`), plus `set` and `unset`:

```kex
ENV.get("HOME")                  # => Just("/home/ada")
ENV.get("LOG_LEVEL", "info")     # => "info" when unset
ENV.has?("PATH")                 # => true
```

Reading `ENV` is `foul`, because the same call can return something different on another run although nothing in the function's arguments changed.

To make the dependency visible, pass the environment as a parameter. `main` receives it as its second argument, and reading a parameter is pure:

```kex
main(args, env) do
  let level = env.get("LOG_LEVEL", "info")
  IO.printLine("log level: ${level}")
end
```

### `get` (foul)

```kex
get(key: String, default: String) -> String?
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

### `has?` (foul)

```kex
has?(key: String) -> Bool
```

Returns `true` when `key` is set, whatever its value.

This tells an unset variable from one set to the empty string, which `get` with a default cannot.

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

### `keys` (foul)

```kex
keys -> [String]
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

### `values` (foul)

```kex
values -> [String]
```

Returns every variable value in the environment.

**Returns**: the values

**Examples**

```kex
ENV.values.count   # => 47
```

### `count` (foul)

```kex
count -> Integer
```

Returns how many variables the environment has.

**Returns**: the number of variables

**Examples**

```kex
IO.printLine("environment has ${ENV.count} variables")
```

### `each` (foul)

```kex
each(f: Block<String, String, Void>) -> Void
```

Calls `f` with each variable's name and value.

**Parameters**

  - `f` — called once per variable

**Examples**

_Dumping the environment_

```kex
ENV.each { |name, value| IO.printLine("${name}=${value}") }
```

### `entries` (foul)

```kex
entries -> [(String, String)]
```

Returns the environment as a list of `(name, value)` pairs.

The order is unspecified; sort the list when it matters.

**Returns**: the variables

**Examples**

_Printing the environment in name order_

```kex
ENV.entries.sort.each { |name, value| IO.printLine("${name}=${value}") }
```

### `set` (foul)

```kex
set(name: String, value: String) -> Void
```

Sets an environment variable for this process and every child it starts.

A later `ENV.get` returns the new value, and a program started with `Process.run` afterwards sees it. For instance, `Kex.AST` runs the compiler named by `$KEX`, so a tool can choose that compiler by setting `KEX`.

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

### `unset` (foul)

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
