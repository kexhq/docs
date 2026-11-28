---
package: tey
version: "0.2.1-dev"
source: tey/docgen/cli.kex
title: Tey.Docgen.Cli
entities:
  - { kind: module, name: "Tey.Docgen.Cli" }
---

# Tey.Docgen.Cli

The `tey docs` command line: its options, subcommands and help.

Inside a package (a directory with a package.kex), the package name, release and source directory come from package.kex, so `tey docs build --out <site>` is the whole command:

```kex
cd tey && tey docs build --out ../kdocs

tey docs build --source src/stdlib --out <dir> \
  --package prelude --label "Prelude" --base-url https://docs.kex.run

tey docs serve --out <dir> --port 4322
```

Tey passes everything after `docs` through to these options, so no `--` is needed, though `tey docs -- build ...` also works.

## module `Tey.Docgen.Cli`

### `options` (foul)

```kex
options -> OptionConfig
```

Returns the options and the `build`, `prose` and `serve` subcommands of `tey docs`, from which its help is generated too.

### `dispatch` (foul)

```kex
dispatch(args: [String]) -> Integer
```

### `strict?` (foul)

```kex
strict?(parsed: ParsedOptions) -> Bool
```

Returns `false`, after printing an error and the help, when an unknown option such as `--sorce` was left among the arguments.

OptionParser passes options it does not know on to the command, but these subcommands take none of their own, so a leftover one is a typo.

### `printUsage` (foul)

```kex
printUsage -> Integer
```

Prints the generated help followed by the list of files a build writes, and returns 0.

### `outputsHelp`

```kex
outputsHelp -> String
```

Returns the "Outputs:" help section, styled like OptionParser's own sections: a bold heading, then one aligned row per file.
