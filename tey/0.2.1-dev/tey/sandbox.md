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

The path of macOS's `sandbox-exec`, the only sandbox supported so far. On other systems `available?` is false, and a plugin runs only with `--unconfined`.



### `available?` (foul)

```kex
available? -> Bool
```

Returns `true` when this system has the sandbox Tey uses.

### `scratch` (foul)

```kex
scratch -> [String]
```

Returns the directories a Kex child process always needs to write to: the temporary directories and the Kex cache.

### `profile`

```kex
profile(limits: Limits, home: String) -> String
```

Returns the sandbox profile for `limits`. Later rules win, so the profile allows everything, denies network access and file writes, allows writes back under the writable paths, then denies reading credentials.

### `prefix` (foul)

```kex
prefix(limits: Limits) -> Result<([String], String), String>
```

Returns the words to put in front of a command line to run it under `limits`, `sandbox-exec -f <profile>`, and the profile's path. The caller deletes the profile once the child has exited. Fails when no sandbox is available or the profile cannot be written.

## record `Limits`

What a plugin process may do besides reading files and computing.

A plugin is code from a dependency, run on the user's machine. When the user approves what a plugin asks for, Tey runs it inside the operating system's sandbox so it can do no more:

- it can write only under `writable`, plus the temporary directories and
  the Kex cache that compiling and running it need;
- it can use the network only when `network?` is true;
- it cannot read the usual places credentials are kept, such as `~/.ssh`.

Every process the plugin starts has the same limits.

Two permissions are coarser than they look. `Process.Run([...])` is not enforced: the plugin can start any program, though that program has the same limits. `Net.Connect([...])` opens the whole network, not just the listed hosts, because the sandbox filters by address and not by name.

**Fields**

  - `writable` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `network?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)


