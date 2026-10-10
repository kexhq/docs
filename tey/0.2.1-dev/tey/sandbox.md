---
package: tey
version: "0.2.1-dev"
source: tey/sandbox.kex
title: Tey.Sandbox
entities:
  - { kind: module, name: "Tey.Sandbox" }
---

# Tey.Sandbox

## module `Tey.Sandbox`

### `TOOL` (constant)

macOS's `sandbox-exec`. The only mechanism supported so far; on any other system `available?` is false and the caller has to refuse or be told to run unconfined.



### `available?`

```kex
available? : Bool
```

### `scratch`

```kex
scratch : [String]
```

The directories a Kex child always needs to write to: where the compiler puts its scratch files and its run cache.

### `profile`

```kex
profile(limits: Limits, home: String) -> String
```

The sandbox profile for `limits`. Later rules win, so: allow by default, deny the dangerous classes, then allow back the exceptions.

### `prefix`

```kex
prefix(limits: Limits) -> Result<([String], String), String>
```

The words to put in front of a command line to run it under `limits`: `sandbox-exec -f <profile file>`. The profile file is left for the caller to delete once the child has exited.

## record `Limits`

What a plugin process is allowed to do beyond reading files and computing.

A plugin is code from a dependency, run on the user's machine. Approval says the user accepts what the plugin *asked* for; this is what makes the answer true, by running the child inside the operating system's sandbox:

- it can write only under `writable` (always the temporary directories and
  the Kex cache, which compiling and running its entrypoint need);
- it can use the network only when `network?`;
- it cannot read the places credentials are usually kept.

Everything the child starts inherits the same limits.

What this does NOT do, and must not be mistaken for: `Process.Run([...])` is not enforced — the child can start any program, though that program is held to the same limits — and `Net.Connect([...])` opens the network as a whole rather than to the listed hosts, because the sandbox filters by address and not by name.

**Fields**

  - `writable` : [[String](../../../prelude/0.4.0-rc.1-dev/string.md#make-string)] (optional)
  - `network?` : [Bool](../../../prelude/0.4.0-rc.1-dev/truthyable.md#make-bool) (optional)


