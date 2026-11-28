---
package: tey
version: "0.2.1-dev"
source: tey/manifest.kex
title: Tey.Manifest
entities:
  - { kind: module, name: "Tey.Manifest" }
---

# Tey.Manifest

## module `Tey.Manifest`

### `sourceFolder?`

```kex
sourceFolder?(name: String) -> Bool
```

Returns `true` when `name` can be a source folder: a plain, non-hidden directory name at the package's top, not a path, since the name becomes the first part of every module in it.

### `reservedCommands` (constant)

```kex
reservedCommands : [String]
```

The command names Tey handles itself, which a `command(...)` may not take. `tey test` must mean the same in every checkout, so a manifest that redefines one fails to read.

The list lives here because the reader enforces it; `Tey.Cli` is built on this module, so taking the list from its commands would be a cycle. Keep the two in step by hand: one `.command(...)` in `Tey.Cli`, one name here. The first word is enough, so `kex` covers every `kex ...` subcommand.



### `read`

```kex
read(text: String) -> Result<ManifestPackage, String>
```

Reads the text of a `package.kex` into a `ManifestPackage`, or returns the first problem found.

The text is parsed with `Kex.AST`, so the manifest follows the same grammar as any Kex file, comments and multi-line calls included.

### `readWorkspace`

```kex
readWorkspace(text: String) -> Result<ManifestWorkspace, String>
```

Reads a virtual-workspace manifest: a `package.kex` whose root is `workspace`, with no package of its own. For a package that is also a workspace root, `read` returns the workspace in `manifestWorkspace`.

### `readLocal`

```kex
readLocal(text: String) -> Result<[LocalOverride], String>
```

Reads the text of a `package.local.kex`: the `local("name", path: "...")` overrides that point a dependency at a local checkout. Returns an error for anything else in the file, or for a package overridden twice.

## type `DependencySource`

**Variants**

  - `WorkspaceSource`
  - `GitSource(String, String, String, String)`
  - `PathSource(String)`



## record `Dependency`

**Fields**

  - `manifestName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `manifestSource` : [DependencySource](#type-tey-manifest-dependencysource)
  - `manifestGroups` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)



## record `ManifestWorkspace`

**Fields**

  - `memberPatterns` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)



## record `LocalOverride`

**Fields**

  - `localName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `localPath` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `Target`

**Fields**

  - `name` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `entrypoint` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `PluginCapability`

**Fields**

  - `capabilityKind` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `capabilityValues` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)



## record `PluginOption`

**Fields**

  - `optionName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `optionType` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)



## record `PluginOperation`

**Fields**

  - `operationName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `operationEntrypoint` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `operationOptions` : [[PluginOption](#record-tey-manifest-pluginoption)] (optional)



## record `Plugin`

**Fields**

  - `pluginNamespace` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `pluginTeyRequirement` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `pluginCapabilities` : [[PluginCapability](#record-tey-manifest-plugincapability)] (optional)
  - `pluginCommands` : [[PluginOperation](#record-tey-manifest-pluginoperation)] (optional)
  - `pluginGenerators` : [[PluginOperation](#record-tey-manifest-pluginoperation)] (optional)



## record `Command`

A project-specific command, run as `tey <name>`. It puts tasks such as running the linter in the manifest, where a newcomer looks, instead of a Makefile or a `bin/` script.

A name is one word, optionally grouped with a colon: `db:migrate`, `assets:build`.

**Fields**

  - `commandName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `commandRun` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `commandDescription` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)



## record `Toolchain`

A toolchain package: the compiler executable with the runtime and standard library it was built with, installed together so they always match. Kex's own `package.kex` declares one, so the reader must understand it for any tey command to work in the compiler's checkout.

Fields are prefixed, as in `Command`, because a bare `compiler` would be read as a function call on a receiver of unknown type before it is read as a field here.

**Fields**

  - `toolchainName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `toolchainCompiler` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `toolchainRuntime` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `toolchainStdlib` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)



## record `ManifestPackage`

**Fields**

  - `name` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `version` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `description` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `license` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `packageKexRequirement` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `packageOtpRequirement` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `entrypoint` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sourceFolders` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `manifestDependencies` : [Dependency] (optional)
  - `targets` : [[Target](#record-tey-manifest-target)] (optional)
  - `commands` : [[Command](#record-tey-manifest-command)] (optional)
  - `manifestToolchain` : Toolchain? (optional)
  - `manifestWorkspace` : [ManifestWorkspace](#record-tey-manifest-manifestworkspace)? (optional)
  - `plugins` : [[Plugin](#record-tey-manifest-plugin)] (optional)


