---
package: prelude
version: "0.4.0-alpha"
source: io.kex
title: IO
entities:
  - { kind: module, name: "IO" }
---

# IO

## module `IO`

## constant `printLine`

Writes each argument to stdout followed by a newline. Multiple arguments are printed consecutively with no separator.



## constant `print`

Writes each argument to stdout without a trailing newline.



## function `inspect`

Pretty-prints a colored inspect representation of `val` to stderr. Returns `val` unchanged so it can be inserted into any pipeline. Treated as pure by the type checker — purity checking ignores this call.


```kex
inspect(val) : A -> A
```


## constant `getLine`

Reads one line from stdin. Returns `None` at end-of-input.



## constant `get`

Reads a single character from stdin. Returns `None` at end-of-input.



## constant `printError`

Writes a line to stderr. Does not exit. Use for error messages that should not go to stdout.



## function `warn`

Alias for `printError` — use when signalling a non-fatal condition.


```kex
warn(msg) : Showable -> Void
```


## function `warning`

Alias for `printError` — longer form of `warn`.


```kex
warning(msg) : Showable -> Void
```

