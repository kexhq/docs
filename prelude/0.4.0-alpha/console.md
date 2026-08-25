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

## constant `RESET`



## constant `BOLD`



## constant `DIM`



## constant `ITALIC`



## constant `UNDERLINE`



## constant `BLINK`



## constant `REVERSE`



## constant `HIDDEN`



## constant `STRIKETHROUGH`



## constant `RED`



## constant `GREEN`



## constant `YELLOW`



## constant `BLUE`



## constant `MAGENTA`



## constant `CYAN`



## constant `WHITE`



## constant `GRAY`



## constant `PURPLE`



## constant `CLEAR`

Cursor and screen control, empty under --no-colors like the styles above. CLEAR erases the screen and homes the cursor; HOME only moves the cursor, so a redraw paints over the previous frame without a blank flash between them; CLEARLINE erases the current line and returns to its start.



## constant `HOME`



## constant `CLEARLINE`



## function `colorize`

Wrap `text` in an ANSI style and reset attributes afterwards.


```kex
colorize(text, color) : String -> String -> String
```


## constant `enabled?`

Whether terminal styling is enabled for this process.


