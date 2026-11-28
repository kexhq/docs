---
package: prelude
version: "0.4.0-alpha"
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



### `CLEAR` (constant)

Cursor and screen control, empty under --no-colors like the styles above. CLEAR erases the screen and homes the cursor; HOME only moves the cursor, so a redraw paints over the previous frame without a blank flash between them; CLEARLINE erases the current line and returns to its start.



### `HOME` (constant)



### `CLEARLINE` (constant)



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


