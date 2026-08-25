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

**Fields**

  - `name` : String
  - `description` : String (optional)
  - `usage` : String (optional)
  - `handler` : [CommandHandler](#type-commandhandler)
  - `section` : String (optional)

## record `OptionConfig`

**Fields**

  - `name` : String (optional)
  - `description` : String (optional)
  - `options` : [[OptionSpec](#record-optionspec)] (optional)
  - `commands` : [[CommandSpec](#record-commandspec)] (optional)

## record `ParsedOptions`

**Fields**

  - `values` : {String: String}
  - `arguments` : [String]

## type `OptionParseError`



**Variants**

  - `UnknownOption(String)`
  - `MissingValue(String)`
  - `UnexpectedValue(String)`
  - `MissingRequired(String)`
  - `InvalidInteger(String, String)`

## make `ParsedOptions`


#### `value`

```kex
value(name)
```

#### `flagEnabled?`

```kex
flagEnabled?(name)
```

#### `integerValue`

```kex
integerValue(name)
```

## make `OptionConfig`


#### `string`

```kex
string(long, short, description, default, required?)
```

#### `integer`

```kex
integer(long, short, description, default, required?)
```

#### `flag`

```kex
flag(long, short, description)
```

#### `command`

Declares a command. `usage` is what the help line shows after the name (`<name>`, `[args...]`); leave it empty for a command that takes none.

```kex
command(name, description, handler)
```

#### `parse`

```kex
parse(args)
```

#### `run`

Parses `args` and runs the command they name, returning its exit code. A parse failure, an unknown command, or a line with no command at all reports the problem with the help text and returns 1 — the one place that policy has to live for every tool to behave the same way.

```kex
run(args)
```

## module `OptionParser`

## function `define`


```kex
define(name, description)
```


## function `commandLabel`


```kex
commandLabel(command)
```


## function `commandFor`

The declared command whose words open `arguments`, with what is left after them. Longest match first, so `kex install` is preferred over a `kex` that also exists.


```kex
commandFor(commands, arguments)
```


## function `opensWith?`


```kex
opensWith?(arguments, name)
```


## function `errorMessage`


```kex
errorMessage(error)
```


## function `parse`


```kex
parse(options, commands, args)
```

