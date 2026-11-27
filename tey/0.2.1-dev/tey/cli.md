---
package: tey
version: "0.2.1-dev"
source: tey/cli.kex
title: Tey.Cli
entities:
  - { kind: module, name: "Tey.Cli" }
---

# Tey.Cli

## module `Tey.Cli`

### `parser` (foul)

```kex
parser -> OptionConfig
```

Returns Tey's built-in options and commands as one `OptionConfig`.

`OptionParser` matches the command words, removes them, and passes the rest to the handler. The help text and the dispatch come from this one list, so they cannot disagree.

### `cli` (foul)

```kex
cli -> OptionConfig
```

Returns the parser Tey runs: `parser` plus one command for each `command(...)` in the current package's manifest.

Because they are declared like the built-ins, package commands appear in `tey help` and in the unknown-command message. They cannot shadow a built-in, since the manifest reader rejects those names (`Tey.Manifest.reservedCommands`), and they are listed under their own "Package commands" heading so a reader knows to look in package.kex.

### `dispatch` (foul)

```kex
dispatch(args: [String]) -> Integer
```

Runs the Tey command line `args` and returns the exit code.

The color flags are handled first, by setting `NO_COLOR`. The line is then parsed once to answer what `run` cannot, namely whether it asks for `--version` and whether it names a built-in command, and handed to `run`, which parses it again and dispatches. A parse error is left for `run` to report with the help text.

### `colorFlag?`

```kex
colorFlag?(argument: String) -> Bool
```

Returns whether `argument` turns colors off.

Both `--no-color` and `--no-colors`, the spelling `kex` uses, are accepted.

### `plain?`

```kex
plain?(args: [String]) -> Bool
```

Returns whether `args` asks for output without colors.

Only arguments before a bare `--` count; those after it belong to the program being run, which may have a `--no-color` of its own.

### `withoutColorFlags`

```kex
withoutColorFlags(args: [String]) -> [String]
```

Returns `args` without the color flags before any bare `--`.

`dispatch` handles those flags itself by setting `NO_COLOR`, which `Console`, every child `kex` and the parser's error text all read. Removing them here makes the flag work anywhere on the line, including after `tey docs`, whose own parser does not know it.

### `dispatchArguments` (foul)

```kex
dispatchArguments(args: [String]) -> Integer
```

### `relayColors` (foul)

```kex
relayColors -> Void
```

Sets `FORCE_COLOR` so every `kex` that Tey starts uses colors when Tey does.

It does nothing when colors are off or `NO_COLOR` is set, so `NO_COLOR` still wins in every child. `Kex.AST` passes `--no-colors`, which overrides this, so output Tey parses back has no escape codes.

### `announceToolchain` (foul)

```kex
announceToolchain -> Void
```

Sets `KEX` to the compiler Tey selected, so the rest of the process uses it.

`Kex.AST`, which reads `package.kex`, runs the compiler named by `KEX` and otherwise whatever `kex` is on PATH. Tey is started by `erl`, not by `kex`, so without this a manifest would be read by an unrelated compiler, or by none when `kex` lives only inside the Tey home. A `KEX` that is already set is left alone.
