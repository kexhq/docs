---
package: prelude
version: "0.4.0-beta.4-dev"
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

Declarative command-line parsing, shared by Kex tools and applications.

You describe the options and commands a tool accepts, and the parser turns an argument list into typed values, dispatches to the right command, and renders the help text.

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

Note that `--help` is not automatic: `run` shows the help when a flag named `help` is set, so declare that flag if you want it.

Start at `OptionParser.define`, chain the `string` / `integer` / `flag` / `command` builders, and finish with `run` (dispatch and exit code) or `parse` (the parsed values, and nothing else).

## type `OptionKind`

What kind of value an option carries: `StringValue` takes any text, `IntegerValue` must parse as a number, and `FlagValue` takes none at all and reads as `"true"` when present.

**Variants**

  - `StringValue`
  - `IntegerValue`
  - `FlagValue`



## record `OptionSpec`

One declared option. Built for you by the `OptionConfig` builders: you rarely construct one by hand.

**Fields**

  - `long` : [String](string.md#make-string)
  - `short` : [Char](string.md#make-char)? (optional)
  - `kind` : [OptionKind](#type-optionkind) (optional)
  - `description` : [String](string.md#make-string) (optional)
  - `default` : [String](string.md#make-string)? (optional)
  - `required?` : [Bool](truthyable.md#make-bool) (optional)



## type `CommandHandler`

What a command does once the line has been parsed. It receives the parsed options with the command's own words already removed, so `tey add greet` hands its handler `["greet"]`, and returns the process exit code.



## record `CommandSpec`

One declared command. Built for you by the `OptionConfig.command` builders.

**Fields**

  - `name` : [String](string.md#make-string)
  - `description` : [String](string.md#make-string) (optional)
  - `usage` : [String](string.md#make-string) (optional)
  - `handler` : [CommandHandler](#type-commandhandler)
  - `passthrough` : [Bool](truthyable.md#make-bool) (optional)
  - `section` : [String](string.md#make-string) (optional)



## record `OptionConfig`

A tool's whole command-line interface: its name, its options, and its commands.

Build one with `OptionParser.define` and add to it with the chainable `string`, `integer`, `flag` and `command` methods. Each returns a new `OptionConfig`, so the chain reads as one declaration.

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

A value that does not parse is rejected at parse time with `InvalidInteger`, so a handler never sees a malformed number. Read it back with `ParsedOptions.integerValue`.

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

Declares an option that takes no value and is either present or not.

It defaults to `"false"` and reads as `"true"` when given. Read it back with `ParsedOptions.flagEnabled?`. Giving it a value is an error (`UnexpectedValue`).

Declare a flag named `help` if you want `--help` to print the help text: `run` looks for exactly that name, and adds nothing on its own.

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

A command name may be several words (`"docs build"`) and the longest match wins, so a group and its subcommands can both be declared. The handler receives the parsed options with the command's own words already removed, and returns the process exit code.

Declares a command. `usage` is what the help line shows after the name (`<name>`, `[args...]`); leave it empty for a command that takes none.

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

Everything after the command's name is handed to the handler in `arguments` untouched, including options this tool also declares. Use it for a subcommand backed by its own `OptionConfig`: without it, an option the outer tool happens to declare too is consumed here and never reaches the subcommand, with no error to say so.

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

Use it when the tool has no commands, or when you want to inspect the parse before deciding what to do. `run` is the one-call alternative.

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

#### `run`

```kex
run(args: [String]) -> Integer
```

Parses `args`, runs the command they name, and returns its exit code.

This is the whole of a tool's `main`: hand it the argument list and pass the result to `System.exit`.

A parse failure, an unknown command, or a line with no command at all reports the problem along with the help text and returns 1: the one place that policy has to live for every tool to behave the same way. A set `help` flag prints the help and returns 0.

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

#### `printHelp`

```kex
printHelp : Integer
```

Prints the help text and returns 0, the exit code for a successful run.

`run` calls this for you when the `help` flag is set; call it directly when a tool decides on its own that help is the right answer.

**Returns**: always 0

**Examples**

_A tool with no arguments shows its help_

```kex
args.empty? then cli.printHelp else cli.run(args)
```

#### `help`

```kex
help : String
```

Returns the tool's help text: its name and description, its options, and its commands grouped by section.

`run` and `printHelp` print this for you; reach for it directly when the text has to go somewhere other than stdout.

The help text, styled. Every escape comes from `Console`, which the runtime blanks under `--no-colors` and `KEX_COLORS=0`, so the same code produces plain text down a pipe and this needs no second rendering path.

Widths are measured on the UNSTYLED label throughout: an escape sequence has a length that a terminal does not draw, so padding computed from a coloured string lines the columns up on paper and nowhere else.

**Returns**: the rendered help text

**Examples**

```kex
IO.printError("${OptionParser.errorMessage(error)}\n\n${cli.help}")
```

## record `ParsedOptions`

The result of a successful parse: the option values, and the words that were not options.

**Fields**

  - `values` : {[String](string.md#make-string): [String](string.md#make-string)}
  - `arguments` : [[String](string.md#make-string)]

### Methods

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

An option declared with `integer` has already been checked at parse time, so `None` here means absent rather than malformed.

**Parameters**

  - `name` — the option's long name, without dashes

**Returns**: the number, or `None`

**Examples**

```kex
let times = options.integerValue("times").or(1)
```

## type `OptionParseError`

Why a command line could not be parsed.

`OptionParser.errorMessage` turns one into a sentence for the user; `OptionConfig.run` does that for you.

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

Starts an immutable command-line interface definition.

Chain options and commands onto the returned `OptionConfig`, then call `parse` with the process arguments. `name` appears in usage text and `description` introduces the generated help page.

**Parameters**

  - `name` — the executable name shown in usage
  - `description` — the one-line purpose of the command

**Returns**: an empty parser configuration

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

Longest match first, so `"kex install"` is preferred over a `"kex"` that also exists. Answers `None` when no command matches.

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

Whether the command `arguments` names parses its own options.

`false` when no command matches yet, so options before any command word are still this parser's to claim.

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

The word-wise prefix test `commandFor` matches with: `"docs build"` opens `["docs", "build", "src"]` but not `["docs"]`.

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

Renders a parse error as a sentence for the user.

`OptionConfig.run` does this for you; call it directly when handling a `parse` result yourself.

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

The engine behind `OptionConfig.parse`, which is the form to call from ordinary code.

**Parameters**

  - `options` — the declared options
  - `commands` — the declared commands
  - `args` — the command-line arguments

**Returns**: the parse, or why it failed
