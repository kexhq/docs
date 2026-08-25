---
package: tey
version: "0.2.0-dev"
source: tey/docgen/cli.kex
title: Tey.Docgen.Cli
entities:
  - { kind: module, name: "Tey.Docgen.Cli" }
---

# Tey.Docgen.Cli

## module `Tey.Docgen.Cli`

Command-line interface for docgen: option declarations, dispatch, usage.

Inside a package (a directory with a package.kex), most of the line is already implied — `tey docs build --out <site>` is the whole command:

  cd tey && tey docs build --out ../kdocs

  tey docs build --source src/stdlib --out <dir> \     --package prelude --label "Prelude" --base-url https://docs.kex.run

  tey docs serve --out <dir> --port 4322

A built-in Tey command. Everything after the command word is docgen's own vocabulary — OptionParser passes a command's options through — so no `--` is needed, though `tey docs -- build ...` works too (the `--` is stripped).

## function `options`

A function rather than a module-level constant: on BEAM, calling a make-method (`.parse`, `.help`) on a module-level constant fails with "Undefined function" — the dispatcher doesn't resolve the constant.


```kex
options()
```


## function `dispatch`


```kex
dispatch(args)
```


## function `runCommand`


```kex
runCommand(parsed)
```


## function `printUsage`


```kex
printUsage()
```

