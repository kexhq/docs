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

What kind of value an option carries: `StringValue` takes any text, `IntegerValue` must parse as a number, and `FlagValue` takes none at all and reads as `"true"` when present.



**Variants**

  - `StringValue`
  - `IntegerValue`
  - `FlagValue`

## record `OptionSpec`

One declared option. Built for you by the `OptionConfig` builders — you rarely construct one by hand.

**Fields**

  - `long` : String
  - `short` : [Char](string.md#make-char)? (optional)
  - `kind` : [OptionKind](#type-optionkind) (optional)
  - `description` : String (optional)
  - `default` : String? (optional)
  - `required?` : Bool (optional)

## type `CommandHandler`

What a command does once the line has been parsed. It receives the parsed options with the command's own words already removed, so `tey add greet` hands its handler `["greet"]`, and returns the process exit code.



**Variants**

  - _(abstract)_

## record `CommandSpec`

One declared command. Built for you by the `OptionConfig.command` builders.

**Fields**

  - `name` : String
  - `description` : String (optional)
  - `usage` : String (optional)
  - `handler` : [CommandHandler](#type-commandhandler)
  - `section` : String (optional)

## record `OptionConfig`

A tool's whole command-line interface: its name, its options, and its commands.

Build one with `OptionParser.define` and add to it with the chainable `string`, `integer`, `flag` and `command` methods. Each returns a new `OptionConfig`, so the chain reads as one declaration.

**Fields**

  - `name` : String (optional)
  - `description` : String (optional)
  - `options` : [[OptionSpec](#record-optionspec)] (optional)
  - `commands` : [[CommandSpec](#record-commandspec)] (optional)

## record `ParsedOptions`

The result of a successful parse: the option values, and the words that were not options.

**Fields**

  - `values` : {String: String}
  - `arguments` : [String]

## type `OptionParseError`

Why a command line could not be parsed.

`OptionParser.errorMessage` turns one into a sentence for the user; `OptionConfig.run` does that for you.



**Variants**

  - `UnknownOption(String)`
  - `MissingValue(String)`
  - `UnexpectedValue(String)`
  - `MissingRequired(String)`
  - `InvalidInteger(String, String)`

## make `ParsedOptions`


#### `value`

Returns the value given for the option named `name`, or `None` when it was neither supplied nor defaulted.

```kex
value(name)
```

**Returns**: `String?` — the value, or `None`

**Examples**

```kex
options.value("name")     # => Just("Ada")
options.value("missing")  # => None
```

#### `flagEnabled?`

Returns `true` when the flag named `name` was given.

```kex
flagEnabled?(name)
```

**Returns**: `Bool` — `true` when the flag is set

**Examples**

```kex
if options.flagEnabled?("verbose")
  IO.printLine("verbose mode")
end
```

#### `integerValue`

Returns the value of an integer option as an `Integer`, or `None` when it is absent or does not parse.

An option declared with `integer` has already been checked at parse time, so `None` here means absent rather than malformed.

```kex
integerValue(name)
```

**Returns**: `Integer?` — the number, or `None`

**Examples**

```kex
let times = options.integerValue("times").or(1)
```

## make `OptionConfig`


#### `string`

Declares an option that takes a text value.

```kex
string(long, short, description, default, required?)
```

**Returns**: `OptionConfig` — the config, with the option added

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

Declares an option that takes a whole number.

A value that does not parse is rejected at parse time with `InvalidInteger`, so a handler never sees a malformed number. Read it back with `ParsedOptions.integerValue`.

```kex
integer(long, short, description, default, required?)
```

**Returns**: `OptionConfig` — the config, with the option added

**Examples**

```kex
config.integer("port", Just('p'), "port to listen on", Just("8080"), false)
```

#### `flag`

Declares an option that takes no value and is either present or not.

It defaults to `"false"` and reads as `"true"` when given. Read it back with `ParsedOptions.flagEnabled?`. Giving it a value is an error (`UnexpectedValue`).

Declare a flag named `help` if you want `--help` to print the help text — `run` looks for exactly that name, and adds nothing on its own.

```kex
flag(long, short, description)
```

**Returns**: `OptionConfig` — the config, with the flag added

**Examples**

```kex
config
  .flag("verbose", Just('v'), "print more detail")
  .flag("help", Just('h'), "show this help")
```

#### `command`

Declares a command and the function that runs it.

A command name may be several words — `"docs build"` — and the longest match wins, so a group and its subcommands can both be declared. The handler receives the parsed options with the command's own words already removed, and returns the process exit code.

Declares a command. `usage` is what the help line shows after the name (`<name>`, `[args...]`); leave it empty for a command that takes none.

```kex
command(name, description, handler)
```

**Returns**: `OptionConfig` — the config, with the command added

**Examples**

```kex
foul greet(options: ParsedOptions) -> Integer do
  IO.printLine("hello, ${options.value("name", "world")}")
  return 0
end

config.command("greet", "print a greeting", ~greet)
```

#### `parse`

Parses `args` into option values and leftover words, without dispatching to a command.

Use it when the tool has no commands, or when you want to inspect the parse before deciding what to do. `run` is the one-call alternative.

```kex
parse(args)
```

**Returns**: `Result<ParsedOptions, OptionParseError>` — the parse, or why it failed

**Examples**

```kex
match config.parse(args) do
  Ok(options) => IO.printLine(options.value("name", "world"))
  Error(e)    => IO.printError(OptionParser.errorMessage(e))
end
```

#### `run`

Parses `args`, runs the command they name, and returns its exit code.

This is the whole of a tool's `main`: hand it the argument list and pass the result to `System.exit`.

A parse failure, an unknown command, or a line with no command at all reports the problem along with the help text and returns 1 — the one place that policy has to live for every tool to behave the same way. A set `help` flag prints the help and returns 0.

```kex
run(args)
```

**Returns**: `Integer` — the exit code to give the shell

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

Prints the help text and returns 0, the exit code for a successful run.

`run` calls this for you when the `help` flag is set; call it directly when a tool decides on its own that help is the right answer.

```kex
printHelp()
```

**Returns**: `Integer` — always 0

**Examples**

_A tool with no arguments shows its help_

```kex
args.empty? then cli.printHelp else cli.run(args)
```

## module `OptionParser`

## function `define`


```kex
define(name, description)
```


## function `commandLabel`

Returns the label a command is listed under in the help text — its name, followed by its usage when it has one.


```kex
commandLabel(command)
```


## function `commandFor`

Finds the declared command whose words open `arguments`, and returns it with whatever is left after them.

Longest match first, so `"kex install"` is preferred over a `"kex"` that also exists. Answers `None` when no command matches.


```kex
commandFor(commands, arguments)
```


## function `opensWith?`

Returns `true` when `arguments` begins with the words of `name`.

The word-wise prefix test `commandFor` matches with — `"docs build"` opens `["docs", "build", "src"]` but not `["docs"]`.


```kex
opensWith?(arguments, name)
```


## function `errorMessage`

Renders a parse error as a sentence for the user.

`OptionConfig.run` does this for you; call it directly when handling a `parse` result yourself.


```kex
errorMessage(error)
```


## function `parse`

Parses `args` against a list of option and command specs.

The engine behind `OptionConfig.parse`, which is the form to call from ordinary code.


```kex
parse(options, commands, args)
```

