---
package: prelude
version: "0.4.0-beta.4-dev"
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

**Examples**

```kex
IO.printLine("${Console.GREEN}ok${Console.RESET}")
IO.printLine(Console.colorize("failed", Console.RED))
```

### `RESET` (constant)

Clears every active style. Ends a styled run started with a color or attribute constant; `colorize` appends it for you.

**Examples**

```kex
"${Console.BOLD}important${Console.RESET}"
```



### `BOLD` (constant)

Renders following text in bold.

**Examples**

```kex
IO.printLine("${Console.BOLD}Summary${Console.RESET}")
```



### `DIM` (constant)

Renders following text dimmed. Useful for secondary detail that should not compete with the main output.

**Examples**

```kex
IO.printLine("done ${Console.DIM}(0.4s)${Console.RESET}")
```



### `ITALIC` (constant)

Renders following text in italics, where the terminal supports it.

**Examples**

_Setting apart a book or command name_

```kex
IO.printLine("run ${Console.colorize("kex check", Console.ITALIC)} next")
```



### `UNDERLINE` (constant)

Underlines following text.

**Examples**

```kex
Console.colorize("https://kex.run", Console.UNDERLINE)
```



### `BLINK` (constant)

Makes following text blink, where the terminal supports it. Most do not, and most users would rather they did not.

**Examples**

_A deliberately attention-grabbing emergency indicator_

```kex
IO.printError(Console.colorize("DATABASE OFFLINE", Console.BLINK))
```



### `REVERSE` (constant)

Swaps the foreground and background colors of following text.

**Examples**

_Highlighting a selected row_

```kex
Console.colorize(row, Console.REVERSE)
```



### `HIDDEN` (constant)

Hides following text: it occupies space but is not drawn.

**Examples**

_Reserving space so changing status text does not shift a table_

```kex
let padding = Console.colorize("..........", Console.HIDDEN)
```



### `STRIKETHROUGH` (constant)

Strikes through following text.

**Examples**

_Showing a completed item_

```kex
Console.colorize(task, Console.STRIKETHROUGH)
```



### `RED` (constant)

Red. Conventionally: errors and failures.

**Examples**

```kex
IO.printError(Console.colorize("error: ${message}", Console.RED))
```



### `GREEN` (constant)

Green. Conventionally: success.

**Examples**

```kex
IO.printLine(Console.colorize("all tests passed", Console.GREEN))
```



### `YELLOW` (constant)

Yellow. Conventionally: warnings.

**Examples**

```kex
IO.warn(Console.colorize("deprecated option", Console.YELLOW))
```



### `BLUE` (constant)

Blue. Useful for informational labels and links.

**Examples**

```kex
IO.printLine(Console.colorize("info:", Console.BLUE) + " cache refreshed")
```



### `MAGENTA` (constant)

Magenta. Useful for highlighting a category distinct from status colors.

**Examples**

```kex
IO.printLine(Console.colorize("migration", Console.MAGENTA) + " 20260830")
```



### `CYAN` (constant)

Cyan. Useful for identifiers, paths, and other values inside prose.

**Examples**

```kex
IO.printLine("wrote ${Console.colorize(path, Console.CYAN)}")
```



### `WHITE` (constant)

White. Useful for primary text on a dark terminal.

**Examples**

```kex
IO.printLine(Console.colorize("Build summary", Console.WHITE))
```



### `GRAY` (constant)

Gray. Conventionally: de-emphasised detail, like `DIM` but as a color.

**Examples**

```kex
IO.printLine(Console.colorize(timestamp, Console.GRAY))
```



### `PURPLE` (constant)

Purple. An alternative accent when magenta is already in use.

**Examples**

```kex
IO.printLine(Console.colorize("plugin", Console.PURPLE) + ": formatter")
```



### `CLEAR` (constant)

Erases the screen and moves the cursor to the top-left corner.

Use it to start a fresh frame. When you are redrawing repeatedly, `HOME` gives a smoother result: see below.

**Examples**

```kex
IO.print(Console.CLEAR)
```



### `HOME` (constant)

Moves the cursor to the top-left corner without erasing anything.

A redraw that starts here paints over the previous frame, so there is no blank flash between frames the way `CLEAR` produces.

**Examples**

_An animation loop that does not flicker_

```kex
frames.each do |frame|
  IO.print(Console.HOME)
  IO.print(frame)
end
```



### `CLEARLINE` (constant)

Erases the current line and returns the cursor to its start.

This is how to write a progress line in place rather than one line per update.

**Examples**

_A progress counter on one line_

```kex
(1..100).items.each do |n|
  IO.print("${Console.CLEARLINE}processing ${n}/100")
end
IO.printLine("")
```



### `colorize`

```kex
colorize(text: String, color: String) -> String
```

Wraps `text` in `color` and appends a reset, so the style ends where the text does.

Preferred over splicing the constants by hand: it cannot leak a style into the rest of the line, and it still produces plain text when color is off.

**Parameters**

  - `text` — the text to style
  - `color` — a style constant from this module

**Returns**: the styled text

**Examples**

```kex
Console.colorize("ok", Console.GREEN)
Console.colorize("error", Console.RED)
```

_Styling a status word inside a longer line_

```kex
IO.printLine("build ${Console.colorize("passed", Console.GREEN)} in 2.1s")
```

### `enabled?` (constant)

```kex
enabled? : Bool
```

Returns `true` when terminal styling is on for this process.

It is `false` under `--no-colors` and when output is redirected. You rarely need to check it (the constants already collapse to `""`) but it is the right test when the alternative is a different layout rather than a different color.

**Examples**

_Falling back to plain markers_

```kex
let bullet = Console.enabled? then "•" else "-"
```


