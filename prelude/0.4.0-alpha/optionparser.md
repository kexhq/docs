---
package: prelude
version: "0.4.0-alpha"
source: optionparser.kex
title: OptionParser
entities:
  - { kind: type, name: "OptionKind" }
  - { kind: record, name: "OptionSpec" }
  - { kind: type, name: "CommandHandler" }
  - { kind: record, name: "CommandSpec" }
  - { kind: record, name: "OptionConfig" }
  - { kind: record, name: "ParsedOptions" }
  - { kind: type, name: "OptionParseError" }
  - { kind: make, name: "ParsedOptions" }
  - { kind: make, name: "OptionConfig" }
  - { kind: module, name: "OptionParser" }
---

# OptionParser

## type `OptionKind`

Declarative command-line parsing shared by Kex tools and applications.

**Variants**

  - `StringValue`
  - `IntegerValue`
  - `FlagValue`



## record `OptionSpec`

**Fields**

  - `long` : [String](string.md#make-string)
  - `short` : [Char](string.md#make-char)? (optional)
  - `kind` : [OptionKind](#type-optionkind) (optional)
  - `description` : [String](string.md#make-string) (optional)
  - `default` : [String](string.md#make-string)? (optional)
  - `required?` : [Bool](blankable.md#make-bool) (optional)



## type `CommandHandler`

What a command does once the line has been parsed. It receives the parsed options with the command's own words already removed, so `tey add greet` hands its handler `["greet"]`, and returns the process exit code.



## record `CommandSpec`

**Fields**

  - `name` : [String](string.md#make-string)
  - `description` : [String](string.md#make-string) (optional)
  - `usage` : [String](string.md#make-string) (optional)
  - `handler` : [CommandHandler](#type-commandhandler)
  - `section` : [String](string.md#make-string) (optional)



## record `OptionConfig`

**Fields**

  - `name` : [String](string.md#make-string) (optional)
  - `description` : [String](string.md#make-string) (optional)
  - `options` : [[OptionSpec](#record-optionspec)] (optional)
  - `commands` : [[CommandSpec](#record-commandspec)] (optional)

### Methods

#### `string`

```kex
string(long: String, short: Char?, description: String, default: String?, required?: Bool) -> OptionConfig
```

#### `integer`

```kex
integer(long: String, short: Char?, description: String, default: String?, required?: Bool) -> OptionConfig
```

#### `flag`

```kex
flag(long: String, short: Char?, description: String) -> OptionConfig
```

#### `command`

```kex
command(name: String, usage: String, description: String, section: String, handler: CommandHandler) -> OptionConfig
```

Declares a command. `usage` is what the help line shows after the name (`<name>`, `[args...]`); leave it empty for a command that takes none.

#### `parse`

```kex
parse(args: [String]) -> Result<ParsedOptions, OptionParseError>
```

#### `run`

```kex
run(args: [String]) -> Integer
```

Parses `args` and runs the command they name, returning its exit code. A parse failure, an unknown command, or a line with no command at all reports the problem with the help text and returns 1 — the one place that policy has to live for every tool to behave the same way.

#### `printHelp`

```kex
printHelp : Integer
```

#### `help`

```kex
help : String
```

The help text, styled. Every escape comes from `Console`, which the runtime blanks under `--no-colors` and `KEX_COLORS=0`, so the same code produces plain text down a pipe and this needs no second rendering path.

Widths are measured on the UNSTYLED label throughout: an escape sequence has a length that a terminal does not draw, so padding computed from a coloured string lines the columns up on paper and nowhere else.

## record `ParsedOptions`

**Fields**

  - `values` : {[String](string.md#make-string): [String](string.md#make-string)}
  - `arguments` : [[String](string.md#make-string)]

### Methods

#### `value`

```kex
value(name: String, default: String) -> String?
```

#### `flagEnabled?`

```kex
flagEnabled?(name: String) -> Bool
```

#### `integerValue`

```kex
integerValue(name: String) -> Integer?
```

## type `OptionParseError`

**Variants**

  - `UnknownOption(String)`
  - `MissingValue(String)`
  - `UnexpectedValue(String)`
  - `MissingRequired(String)`
  - `InvalidInteger(String, String)`



## module `OptionParser`

### `define`

```kex
define(name: String, description: String) -> OptionConfig
```

### `commandLabel`

```kex
commandLabel(command: CommandSpec) -> String
```

### `commandFor`

```kex
commandFor(commands: [CommandSpec], arguments: [String]) -> (CommandSpec, [String])?
```

The declared command whose words open `arguments`, with what is left after them. Longest match first, so `kex install` is preferred over a `kex` that also exists.

### `opensWith?`

```kex
opensWith?(arguments: [String], name: String) -> Bool
```

### `errorMessage`

```kex
errorMessage(error: OptionParseError) -> String
```

### `parse`

```kex
parse(options: [OptionSpec], args: [String]) -> Result<ParsedOptions, OptionParseError>
```
