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

ANSI terminal styling: colors, text attributes, and cursor control.

Every constant here becomes an empty string when Kex is started with `--no-colors`, or when output is not going to a terminal. You can splice them into a string unconditionally.

`colorize` is usually what you want, since it applies the reset for you.

## constant `RESET`

Clears every active style. Ends a styled run started with a color or attribute constant; `colorize` appends it for you.



## constant `BOLD`

Renders following text in bold.



## constant `DIM`

Renders following text dimmed. Useful for secondary detail that should not compete with the main output.



## constant `ITALIC`

Renders following text in italics, where the terminal supports it.



## constant `UNDERLINE`

Underlines following text.



## constant `BLINK`

Makes following text blink, where the terminal supports it. Most do not, and most users would rather they did not.



## constant `REVERSE`

Swaps the foreground and background colors of following text.



## constant `HIDDEN`

Hides following text: it occupies space but is not drawn.



## constant `STRIKETHROUGH`

Strikes through following text.



## constant `RED`

Red. Conventionally: errors and failures.



## constant `GREEN`

Green. Conventionally: success.



## constant `YELLOW`

Yellow. Conventionally: warnings.



## constant `BLUE`

Blue. Useful for informational labels and links.



## constant `MAGENTA`

Magenta. Useful for highlighting a category distinct from status colors.



## constant `CYAN`

Cyan. Useful for identifiers, paths, and other values inside prose.



## constant `WHITE`

White. Useful for primary text on a dark terminal.



## constant `GRAY`

Gray. Conventionally: de-emphasised detail, like `DIM` but as a color.



## constant `PURPLE`

Purple. An alternative accent when magenta is already in use.



## constant `CLEAR`

Erases the screen and moves the cursor to the top-left corner.

Use it to start a fresh frame. When you are redrawing repeatedly, `HOME` gives a smoother result: see below.



## constant `HOME`

Moves the cursor to the top-left corner without erasing anything.

A redraw that starts here paints over the previous frame, so there is no blank flash between frames the way `CLEAR` produces.



## constant `CLEARLINE`

Erases the current line and returns the cursor to its start.

This is how to write a progress line in place rather than one line per update.



## function `colorize`

Wraps `text` in `color` and appends a reset, so the style ends where the text does.

Preferred over splicing the constants by hand: it cannot leak a style into the rest of the line, and it still produces plain text when color is off.


```kex
colorize(text, color) : String -> String -> String
```


## constant `enabled?`

Returns `true` when terminal styling is on for this process.

It is `false` under `--no-colors` and when output is redirected. You rarely need to check it (the constants already collapse to `""`) but it is the right test when the alternative is a different layout rather than a different color.


