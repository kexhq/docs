---
package: prelude
version: "0.3.2"
source: console.kex
title: Console
entities:
  - { kind: module, name: "Console" }
---

# Console

## module `Console`

ANSI terminal styling. Color constants become empty strings when Kex is started with --no-colors, so callers can compose them without branching.

### `RESET` (constant)



### `BOLD` (constant)



### `DIM` (constant)



### `ITALIC` (constant)



### `UNDERLINE` (constant)



### `BLINK` (constant)



### `REVERSE` (constant)



### `HIDDEN` (constant)



### `STRIKETHROUGH` (constant)



### `RED` (constant)



### `GREEN` (constant)



### `YELLOW` (constant)



### `BLUE` (constant)



### `MAGENTA` (constant)



### `CYAN` (constant)



### `WHITE` (constant)



### `GRAY` (constant)



### `PURPLE` (constant)



### `colorize`

```kex
colorize(text: String, color: String) -> String
```

Wrap `text` in an ANSI style and reset attributes afterwards.

### `enabled?` (constant)

```kex
enabled? : Bool
```

Whether terminal styling is enabled for this process.


