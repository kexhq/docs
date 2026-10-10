---
package: tey
version: "0.2.1-dev"
source: tey/docgen/cli.kex
title: Tey.Docgen.Cli
entities:
  - { kind: module, name: "Tey.Docgen.Cli" }
---

# Tey.Docgen.Cli

Command-line interface for docgen: option declarations, dispatch, usage.

Inside a package (a directory with a package.kex), most of the line is already implied — `tey docs build --out <site>` is the whole command:

```kex
cd tey && tey docs build --out ../kdocs

tey docs build --source src/stdlib --out <dir> \
  --package prelude --label "Prelude" --base-url https://docs.kex.run

tey docs serve --out <dir> --port 4322
```

A built-in Tey command. Everything after the command word is docgen's own vocabulary — OptionParser passes a command's options through — so no `--` is needed, though `tey docs -- build ...` works too (the `--` is stripped).

## module `Tey.Docgen.Cli`

### `options`

```kex
options : OptionParser.OptionConfig
```

A function rather than a module-level constant: on BEAM, calling a make-method (`.parse`, `.help`) on a module-level constant fails with "Undefined function" — the dispatcher doesn't resolve the constant.

The three subcommands are declared here, the way Tey declares its own, so `tey docs` help is generated from the same definitions that parse the line and reads like `tey help` does.

### `dispatch`

```kex
dispatch(args: [String]) -> Integer
```

### `strict`

```kex
strict(parsed: OptionParser.ParsedOptions) -> Bool
```

After a command word, OptionParser hands an option it does not know on to the command as an argument, for commands with a vocabulary of their own. These three have none beyond the options above, so one left over is a typo — and `--sorce src` silently documenting the wrong directory is worse than an error.

### `printUsage`

```kex
printUsage : Integer
```

The generated help, then what a build leaves behind — the one part of this command's story that no option or subcommand declares.

### `outputsHelp`

```kex
outputsHelp : String
```

Styled like OptionParser's own blocks: a bold heading, then one aligned row per entry, padded on the unstyled name.
