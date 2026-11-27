---
package: prelude
version: "0.4.0-rc.4-dev"
source: option_parser.kex
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

Command-line parsing for Kex tools and programs.

Declare the options and commands a tool accepts. The parser checks an argument list against them, runs the command it names, and writes the help text.

```kex
foul greet(options: ParsedOptions) -> Integer do
  IO.printLine("hello, ${options.value("name", "world")}")
  return 0
end

main(args) do
  let cli = OptionParser.define("demo", "a small demo tool")
    .string("name", Just('n'), "who to greet", Just("world"), false)
    .flag("help", Just('h'), "show this help")
    .command("greet", "", "print a greeting", ~greet)
  System.exit(cli.run(args))
end

$ demo greet --name Ada
hello, Ada
```

`--help` is not built in: `run` prints the help when a flag named `help` is set, so declare that flag to get it.

Start with `OptionParser.define`, chain `string`, `integer`, `flag` and `command` onto it, and finish with `run`, which runs the command and returns an exit code, or `parse`, which only returns the parsed values.

## type `OptionKind`

The kind of value an option takes.

`StringValue` takes any text, `IntegerValue` takes a whole number, and `FlagValue` takes no value and reads as `"true"` when given.

**Variants**

  - `StringValue`
  - `IntegerValue`
  - `FlagValue`



## record `OptionSpec`

One declared option. The `OptionConfig` builders make these, so you rarely write one yourself.

**Fields**

  - `long` : [String](string.md#make-string)
  - `short` : [Char](string.md#make-char)? (optional)
  - `kind` : [OptionKind](#type-optionkind) (optional)
  - `description` : [String](string.md#make-string) (optional)
  - `default` : [String](string.md#make-string)? (optional)
  - `required?` : [Bool](truthyable.md#make-bool) (optional)



## type `CommandHandler`

The function that runs a command. It gets the parsed options with the command's own words removed from `arguments`, so `tey add greet` passes `["greet"]`, and returns the process exit code.



## record `CommandSpec`

One declared command. The `OptionConfig.command` builders make these.

**Fields**

  - `name` : [String](string.md#make-string)
  - `description` : [String](string.md#make-string) (optional)
  - `usage` : [String](string.md#make-string) (optional)
  - `handler` : [CommandHandler](#type-commandhandler)
  - `passthrough?` : [Bool](truthyable.md#make-bool) (optional)
  - `section` : [String](string.md#make-string) (optional)



## record `OptionConfig`

A tool's whole command-line interface: its name, its options, and its commands.

Start one with `OptionParser.define` and chain `string`, `integer`, `flag` and `command` onto it. Each returns a new `OptionConfig`.

**Fields**

  - `name` : [String](string.md#make-string) (optional)
  - `description` : [String](string.md#make-string) (optional)
  - `options` : [[OptionSpec](#record-optionspec)] (optional)
  - `commands` : [[CommandSpec](#record-commandspec)] (optional)

### Functions

#### `string`

```kex
string(long: String, short: Char?, description: String, default: String?, required?: Bool) -> OptionConfig
```

Declares an option that takes a text value.

**Parameters**

  - `long` — the long spelling, without dashes
  - `short` — an optional one-character spelling
  - `description` — the help-text description
  - `default` — the value used when the option is absent
  - `required?` — whether the option must be given

**Returns**: the config, with the option added

**Examples**

```kex
OptionParser.define("demo", "a small demo tool")
  .string("name", Just('n'), "who to greet", Just("world"), false)
```

_An option the tool cannot run without_

```kex
config.string("output", Just('o'), "where to write", None, true)
```

#### `integer`

```kex
integer(long: String, short: Char?, description: String, default: String?, required?: Bool) -> OptionConfig
```

Declares an option that takes a whole number.

A value that is not a whole number fails the parse with `InvalidInteger`, so a handler never sees one. Read the value with `ParsedOptions.integerValue`.

**Parameters**

  - `long` — the long spelling, without dashes
  - `short` — an optional one-character spelling
  - `description` — the help-text description
  - `default` — the value used when the option is absent
  - `required?` — whether the option must be given

**Returns**: the config, with the option added

**Examples**

```kex
config.integer("port", Just('p'), "port to listen on", Just("8080"), false)
```

#### `flag`

```kex
flag(long: String, short: Char?, description: String) -> OptionConfig
```

Declares an option that takes no value.

It is `"false"` unless given, then `"true"`; read it with `ParsedOptions.flagEnabled?`. Giving it a value, as in `--verbose=yes`, is an `UnexpectedValue` error.

`run` prints the help text when a flag named `help` is set, and declares no such flag itself.

**Parameters**

  - `long` — the long spelling, without dashes
  - `short` — an optional one-character spelling
  - `description` — the help-text description

**Returns**: the config, with the flag added

**Examples**

```kex
config
  .flag("verbose", Just('v'), "print more detail")
  .flag("help", Just('h'), "show this help")
```

#### `command`

```kex
command(name: String, usage: String, description: String, section: String, handler: CommandHandler) -> OptionConfig
```

Declares a command and the function that runs it.

A command name may be several words (`"docs build"`); the longest match wins, so a group and its subcommands can both be declared. The handler gets the parsed options without the command's own words, and returns the process exit code.

**Parameters**

  - `name` — the command's name, one or more words
  - `description` — the help-text description
  - `handler` — what to run

**Returns**: the config, with the command added

**Examples**

```kex
foul greet(options: ParsedOptions) -> Integer do
  IO.printLine("hello, ${options.value("name", "world")}")
  return 0
end

config.command("greet", "print a greeting", ~greet)
```

#### `passthroughCommand`

```kex
passthroughCommand(name: String, usage: String, description: String, handler: CommandHandler) -> OptionConfig
```

Declares a command that parses its own options.

Everything after the command's name reaches the handler unchanged in `arguments`, including options this tool also declares. Use it for a subcommand with its own `OptionConfig`. With a plain `command`, an option that both declare is taken by the outer tool and the subcommand never sees it, without any error.

**Parameters**

  - `name` — the command's name, one or more words
  - `usage` — the argument shape shown in the help text
  - `description` — the help-text description
  - `handler` — what to run

**Returns**: the config, with the command added

**Examples**

```kex
config.passthroughCommand("docs", "<build|serve>",
                          "generate documentation", ~docs)
```

#### `parse`

```kex
parse(args: [String]) -> Result<ParsedOptions, OptionParseError>
```

Parses `args` into option values and leftover words, without dispatching to a command.

Use it when the tool has no commands, or to look at the result before deciding what to do. `run` parses and dispatches in one call.

**Parameters**

  - `args` — the command-line arguments

**Returns**: the parse, or why it failed

**Examples**

```kex
match config.parse(args) do
  Ok(options) => IO.printLine(options.value("name", "world"))
  Error(e)    => IO.printError(OptionParser.errorMessage(e))
end
```

#### `run` (foul)

```kex
run(args: [String]) -> Integer
```

Parses `args`, runs the command they name, and returns its exit code.

Pass the result to `System.exit`.

A parse error or an unknown command prints the error and the help text to stderr and returns 1. A set `help` flag, or no arguments at all, prints the help and returns 0.

**Parameters**

  - `args` — the command-line arguments

**Returns**: the exit code to give the shell

**Examples**

```kex
main(args) do
  let cli = OptionParser.define("demo", "a small demo tool")
    .flag("help", Just('h'), "show this help")
    .command("greet", "", "print a greeting", ~greet)
  System.exit(cli.run(args))
end
```

#### `printHelp` (foul)

```kex
printHelp -> Integer
```

Prints the help text and returns 0, the exit code for a successful run.

`run` calls it when the `help` flag is set. Call it yourself when the tool should show its help for some other reason.

**Returns**: always 0

**Examples**

_A tool with no arguments shows its help_

```kex
args.empty? then cli.printHelp else cli.run(args)
```

#### `help`

```kex
help -> String
```

Returns the tool's help text: its name and description, its options, and its commands grouped by section.

`run` and `printHelp` print it to stdout; use this to send it elsewhere. It is coloured with `Console` escapes, which are empty under `--no-colors` and `KEX_COLORS=0`.

**Returns**: the help text

**Examples**

```kex
IO.printError("${OptionParser.errorMessage(error)}\n\n${cli.help}")
```

## record `ParsedOptions`

The result of a successful parse: the option values, and the words that were not options.

**Fields**

  - `values` : {[String](string.md#make-string): [String](string.md#make-string)}
  - `arguments` : [[String](string.md#make-string)]

### Functions

#### `value`

```kex
value(name: String, default: String) -> String?
```

Returns the value given for the option named `name`, or `None` when it was neither supplied nor defaulted.

**Parameters**

  - `name` — the option's long name, without dashes

**Returns**: the value, or `None`

**Examples**

```kex
options.value("name")     # => Just("Ada")
options.value("missing")  # => None
```

#### `flagEnabled?`

```kex
flagEnabled?(name: String) -> Bool
```

Returns `true` when the flag named `name` was given.

**Parameters**

  - `name` — the flag's long name, without dashes

**Returns**: `true` when the flag is set

**Examples**

```kex
if options.flagEnabled?("verbose")
  IO.printLine("verbose mode")
end
```

#### `integerValue`

```kex
integerValue(name: String) -> Integer?
```

Returns the value of an integer option as an `Integer`, or `None` when it is absent or does not parse.

An option declared with `integer` is checked during parsing, so for one of those `None` means the option was absent.

**Parameters**

  - `name` — the option's long name, without dashes

**Returns**: the number, or `None`

**Examples**

```kex
let times = options.integerValue("times").or(1)
```

## type `OptionParseError`

Why a command line could not be parsed.

`OptionParser.errorMessage` turns one into a message for the user, and `OptionConfig.run` prints that message for you.

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

Returns an empty `OptionConfig` for a tool, to chain options and commands onto.

`name` and `description` head the help text.

**Parameters**

  - `name` — the tool's name
  - `description` — a one-line summary of the tool

**Returns**: a configuration with no options or commands

**Examples**

_Defining a small file-conversion command_

```kex
let cli = OptionParser.define("convert", "Convert a document to PDF")
  .string("input", Just('i'), "Source document", None, true)
  .flag("verbose", Just('v'), "Show conversion details")
```

### `commandLabel`

```kex
commandLabel(command: CommandSpec) -> String
```

Returns the label a command is listed under in the help text: its name, followed by its usage when it has one.

**Parameters**

  - `command` — the command to label

**Returns**: the help-text label

**Examples**

```kex
OptionParser.commandLabel(spec)   # => "build <file>"
```

### `commandFor`

```kex
commandFor(commands: [CommandSpec], arguments: [String]) -> (CommandSpec, [String])?
```

Finds the declared command whose words open `arguments`, and returns it with whatever is left after them.

The command with the most words wins, so `"docs build"` is chosen over a `"docs"` that also exists. Returns `None` when no command matches.

**Parameters**

  - `commands` — the declared commands
  - `arguments` — the positional words from the command line

**Returns**: the command and the remaining words

**Examples**

```kex
OptionParser.commandFor(commands, ["docs", "build", "src"])
# => Just((docsBuildSpec, ["src"]))
```

### `passthrough?`

```kex
passthrough?(commands: [CommandSpec], arguments: [String]) -> Bool
```

Returns whether the command that `arguments` names is a passthrough command.

Returns `false` while no command matches, so options before the command word still belong to this parser.

**Parameters**

  - `commands` — the declared commands
  - `arguments` — the positional words seen so far

**Returns**: `true` when a matched command is passthrough

**Examples**

```kex
OptionParser.passthrough?(commands, ["docs", "build"])   # => true
OptionParser.passthrough?(commands, [])                  # => false
```

### `opensWith?`

```kex
opensWith?(arguments: [String], name: String) -> Bool
```

Returns `true` when `arguments` begins with the words of `name`.

This is the test `commandFor` uses: `"docs build"` opens `["docs", "build", "src"]` but not `["docs"]`.

**Parameters**

  - `arguments` — the positional words from the command line
  - `name` — the command name, one or more words

**Returns**: `true` when the words match at the front

**Examples**

```kex
OptionParser.opensWith?(["docs", "build"], "docs")   # => true
OptionParser.opensWith?(["docs"], "docs build")      # => false
```

### `errorMessage`

```kex
errorMessage(error: OptionParseError) -> String
```

Returns a parse error as a message for the user.

`OptionConfig.run` uses it. Call it when you handle a `parse` result yourself.

**Parameters**

  - `error` — the failure to describe

**Returns**: the message to show

**Examples**

```kex
OptionParser.errorMessage(UnknownOption("--nope"))
# => "unknown option '--nope'"
OptionParser.errorMessage(MissingValue("output"))
# => "--output requires a value"
```

### `parse`

```kex
parse(options: [OptionSpec], commands: [CommandSpec], args: [String]) -> Result<ParsedOptions, OptionParseError>
```

Parses `args` against a list of option and command specs.

`OptionConfig.parse` calls this; use that instead.

**Parameters**

  - `options` — the declared options
  - `commands` — the declared commands
  - `args` — the command-line arguments

**Returns**: the parse, or why it failed
