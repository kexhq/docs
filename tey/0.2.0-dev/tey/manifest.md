---
package: tey
version: "0.2.0-dev"
source: tey/manifest.kex
title: Tey.Manifest
entities:
  - { kind: module, name: "Tey.Manifest" }
---

# Tey.Manifest

## module `Tey.Manifest`

### `reservedCommands` (constant)

```kex
reservedCommands : [String]
```

The command names Tey answers itself. A `command(...)` may not take one of them: `tey test` must mean the same thing in every checkout, so a manifest that tries to redefine it is an error at read time rather than a silent shadow. Kept here because the READER is what enforces it, and Tey.Cli cannot be asked: it is built on this module, so reading the list off its declared commands would be a cycle. The two have to be kept in step by hand — one `.command(...)` in Tey.Cli, one name here (the first word is enough: `kex` covers every `kex ...` subcommand).



### `read`

```kex
read(text: String) -> Result<ManifestPackage, String>
```

Reads a `package.kex`.

The compiler parses the manifest. Tey only interprets the resulting Kex AST, so comments, multiline calls, strings, and future grammar fixes cannot drift from the language that actually compiles package.kex.

### `readWorkspace`

```kex
readWorkspace(text: String) -> Result<ManifestWorkspace, String>
```

Reads a virtual-workspace manifest: a package.kex whose root is `workspace` rather than a publishable package. Package-root workspaces are returned on ManifestPackage.manifestWorkspace by `read` above.

### `readLocal`

```kex
readLocal(text: String) -> Result<[LocalOverride], String>
```

## type `DependencySource`

**Variants**

  - `WorkspaceSource`
  - `GitSource(String, String, String, String)`
  - `PathSource(String)`



## record `Dependency`

**Fields**

  - `manifestName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `manifestSource` : [DependencySource](#type-tey-manifest-dependencysource)
  - `manifestGroups` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)



## record `ManifestWorkspace`

**Fields**

  - `memberPatterns` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)



## record `LocalOverride`

**Fields**

  - `localName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `localPath` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `Target`

**Fields**

  - `name` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `entrypoint` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `PluginCapability`

**Fields**

  - `capabilityKind` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `capabilityValues` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)



## record `PluginOption`

**Fields**

  - `optionName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `optionType` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)



## record `PluginOperation`

**Fields**

  - `operationName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `operationEntrypoint` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `operationOptions` : [[PluginOption](#record-tey-manifest-pluginoption)] (optional)



## record `Plugin`

**Fields**

  - `pluginNamespace` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `pluginTeyRequirement` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `pluginCapabilities` : [[PluginCapability](#record-tey-manifest-plugincapability)] (optional)
  - `pluginCommands` : [[PluginOperation](#record-tey-manifest-pluginoperation)] (optional)
  - `pluginGenerators` : [[PluginOperation](#record-tey-manifest-pluginoperation)] (optional)



## record `Command`

A project-specific command, run as `tey <name>`. Without these every package grows a Makefile or a bin/ script beside package.kex for "the way you run the linter", which the manifest — the one file a newcomer reads — says nothing about.

A name is one word, grouped with a colon: `db:migrate`, `assets:build`.

**Fields**

  - `commandName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `commandRun` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `commandDescription` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)



## record `Toolchain`

A toolchain package: the compiler executable plus the runtime and standard library it was built with, installed together so the three can never drift apart. Kex's own `package.kex` is the one that declares it — and a reader that did not know the declaration could not run any tey command from the compiler's own checkout, which is where it is most used.

Fields are prefixed like Command's: a bare `compiler` would be read as a method on an unpinned receiver before it is read as a field here.

**Fields**

  - `toolchainName` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `toolchainCompiler` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `toolchainRuntime` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `toolchainStdlib` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)



## record `ManifestPackage`

**Fields**

  - `name` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `version` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `description` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `license` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `packageKexRequirement` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `packageOtpRequirement` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `entrypoint` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `manifestDependencies` : [Dependency] (optional)
  - `targets` : [[Target](#record-tey-manifest-target)] (optional)
  - `commands` : [[Command](#record-tey-manifest-command)] (optional)
  - `manifestToolchain` : Toolchain? (optional)
  - `manifestWorkspace` : [ManifestWorkspace](#record-tey-manifest-manifestworkspace)? (optional)
  - `plugins` : [[Plugin](#record-tey-manifest-plugin)] (optional)


