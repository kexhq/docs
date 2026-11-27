---
package: prelude
version: "0.4.0-rc.5-dev"
source: console.kex
title: Console
entities:
  - { kind: module, name: "Console" }
---

# Console

## module `Console`

ANSI terminal styling: colors, text attributes and cursor control.

Every constant here is the empty string when styling is off: when stdout is not a terminal, when `NO_COLOR` is set, or when Kex runs with `--no-colors`. `--colors` or `FORCE_COLOR` turns it back on. So the constants can go into a string without a check.

`colorize` is usually the better choice, since it adds the reset for you.

**Examples**

```kex
IO.printLine("${Console.GREEN}ok${Console.RESET}")
IO.printLine(Console.colorize("failed", Console.RED))
```

### `RESET` (constant)

```kex
RESET : String
```

Clears every active style, ending a run started by one of the color or attribute constants. `colorize` appends it for you.

**Examples**

```kex
"${Console.BOLD}important${Console.RESET}"
```



### `BOLD` (constant)

```kex
BOLD : String
```

Renders the text that follows in bold.

**Examples**

```kex
IO.printLine("${Console.BOLD}Summary${Console.RESET}")
```



### `DIM` (constant)

```kex
DIM : String
```

Renders the text that follows dimmed, for detail that should stay in the background.

**Examples**

```kex
IO.printLine("done ${Console.DIM}(0.4s)${Console.RESET}")
```



### `ITALIC` (constant)

```kex
ITALIC : String
```

Renders the text that follows in italics, on terminals that support it.

**Examples**

_Setting apart a command name_

```kex
IO.printLine("run ${Console.colorize("kex check", Console.ITALIC)} next")
```



### `UNDERLINE` (constant)

```kex
UNDERLINE : String
```

Underlines the text that follows.

**Examples**

```kex
Console.colorize("https://kex.run", Console.UNDERLINE)
```



### `BLINK` (constant)

```kex
BLINK : String
```

Makes the text that follows blink, on the few terminals that support it.

**Examples**

_An alarm that must not be missed_

```kex
IO.printError(Console.colorize("DATABASE OFFLINE", Console.BLINK))
```



### `REVERSE` (constant)

```kex
REVERSE : String
```

Swaps the foreground and background colors of the text that follows.

**Examples**

_Highlighting a selected row_

```kex
Console.colorize(row, Console.REVERSE)
```



### `HIDDEN` (constant)

```kex
HIDDEN : String
```

Hides the text that follows: it takes up space but is not drawn.

**Examples**

_Reserving space so a table does not shift when a status changes_

```kex
let padding = Console.colorize("..........", Console.HIDDEN)
```



### `STRIKETHROUGH` (constant)

```kex
STRIKETHROUGH : String
```

Strikes through the text that follows.

**Examples**

_Showing a completed item_

```kex
Console.colorize(task, Console.STRIKETHROUGH)
```



### `RED` (constant)

```kex
RED : String
```

Red, usually for errors and failures.

**Examples**

```kex
IO.printError(Console.colorize("error: ${message}", Console.RED))
```



### `GREEN` (constant)

```kex
GREEN : String
```

Green, usually for success.

**Examples**

```kex
IO.printLine(Console.colorize("all tests passed", Console.GREEN))
```



### `YELLOW` (constant)

```kex
YELLOW : String
```

Yellow, usually for warnings.

**Examples**

```kex
IO.printError(Console.colorize("deprecated option", Console.YELLOW))
```



### `BLUE` (constant)

```kex
BLUE : String
```

Blue, often used for informational labels and links.

**Examples**

```kex
IO.printLine(Console.colorize("info:", Console.BLUE) + " cache refreshed")
```



### `MAGENTA` (constant)

```kex
MAGENTA : String
```

Magenta, for marking a category apart from the status colors.

**Examples**

```kex
IO.printLine(Console.colorize("migration", Console.MAGENTA) + " 20260830")
```



### `CYAN` (constant)

```kex
CYAN : String
```

Cyan, often used for identifiers, paths and other values within text.

**Examples**

```kex
IO.printLine("wrote ${Console.colorize(path, Console.CYAN)}")
```



### `WHITE` (constant)

```kex
WHITE : String
```

White, for primary text on a dark terminal.

**Examples**

```kex
IO.printLine(Console.colorize("Build summary", Console.WHITE))
```



### `GRAY` (constant)

```kex
GRAY : String
```

Gray, for detail that matters less; a color counterpart of `DIM`.

**Examples**

```kex
IO.printLine(Console.colorize(timestamp, Console.GRAY))
```



### `PURPLE` (constant)

```kex
PURPLE : String
```

Purple, a second accent color when magenta is already taken.

**Examples**

```kex
IO.printLine(Console.colorize("plugin", Console.PURPLE) + ": formatter")
```



### `CLEAR` (constant)

```kex
CLEAR : String
```

Erases the screen and moves the cursor to the top-left corner.

To redraw the screen many times, `HOME` avoids the flicker.

**Examples**

```kex
IO.print(Console.CLEAR)
```



### `HOME` (constant)

```kex
HOME : String
```

Moves the cursor to the top-left corner without erasing anything.

A redraw that starts here paints over the previous frame, so the screen does not go blank between frames as it does with `CLEAR`.

**Examples**

_An animation loop that does not flicker_

```kex
frames.each do |frame|
  IO.print(Console.HOME)
  IO.print(frame)
end
```



### `CLEARLINE` (constant)

```kex
CLEARLINE : String
```

Erases the current line and moves the cursor back to its start, so a progress line can be rewritten in place.

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

It cannot leak a style into the rest of the line, which hand-placed constants can. When styling is off it returns `text` unchanged.

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

The constants already turn into `""` when it is off, so a check is only needed when the output should change in some other way, such as a different layout or different characters.

**Examples**

_Falling back to plain markers_

```kex
let bullet = Console.enabled? then "•" else "-"
```


