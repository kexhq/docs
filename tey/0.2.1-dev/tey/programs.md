---
package: tey
version: "0.2.1-dev"
source: tey/programs.kex
title: Tey.Programs
entities:
  - { kind: module, name: "Tey.Programs" }
---

# Tey.Programs

## module `Tey.Programs`

Records what Tey has installed in `${TEY_HOME}/bin`, and which package owns each file there.

Every package whose targets Tey installs gets a receipt at `${TEY_HOME}/programs/<name>/receipt.json`. Ownership is decided by the receipts alone: a file in the bin directory that no receipt lists is not Tey's to overwrite or delete, and a second package declaring a target name that another package installed is refused unless `--force` is given.

Receipts are kept per package, not per program: one package can install several targets, and reinstalling or removing it acts on all of them.

### `pinnedReason`

```kex
pinnedReason(receipt: Receipt, options: InstallOptions) -> String?
```

Returns the message explaining why reinstalling `receipt` by name has nothing to do, or `None` when it has to be rebuilt.

A program pinned to a tag or an exact commit stays where the user put it, and the message says how to move it. A branch, or `HEAD`, is rebuilt.

### `reservedNames` (constant)

```kex
reservedNames : [String]
```

Returns the target names no package may take. The `kex` shim lives in the bin directory, and replacing it would change which compiler every shell runs.



### `directory` (foul)

```kex
directory -> String
```

### `classify`

```kex
classify(argument: String) -> ProgramSource
```

Decides what `argument` names: a path when it starts with `.`, `/` or `~`, a Git URL when it has a scheme or looks like `git@host:owner/repo`, and otherwise the name of an installed program.

### `buildDirectory` (foul)

```kex
buildDirectory(name: String) -> String
```

Returns the directory that holds a program's build tree once it is installed.

### `stagingDirectory` (foul)

```kex
stagingDirectory -> Result<String, String>
```

Creates a new, empty directory to build a program in before it is installed.

It sits beside `programs/`, so a half-built tree is never listed as a program, and on the same filesystem, so installing it is a rename.

### `stage` (foul)

```kex
stage(root: String, destination: String) -> Result<Void, String>
```

Copies the tree at `root` into `destination`: the files a snapshot would hold, plus a committed `tey.lock`, which a snapshot leaves out. The lock holds the dependency versions the program's author tested.

### `copyInto` (foul)

```kex
copyInto(root: String, relative: String, destination: String) -> Result<Void, String>
```

### `publishBuild` (foul)

```kex
publishBuild(name: String, staged: String) -> Result<Void, String>
```

Replaces a program's build tree with the staged one it was just built in.

The old tree is moved aside first and deleted last, so if a step fails, one of the two trees is still in place.

### `receiptPath` (foul)

```kex
receiptPath(name: String) -> String
```

### `encode`

```kex
encode(receipt: Receipt) -> String
```

### `decode`

```kex
decode(text: String) -> Result<Receipt, String>
```

### `claim`

```kex
claim(target: String, packageName: String, receipts: [Receipt], exists?: Bool, teyBuilt?: Bool) -> Claim
```

Decides what installing `target` for `packageName` would do, given every receipt and whether a file of that name already exists.

`teyBuilt?` covers programs that a project's own `tey install` put in the bin directory before receipts existed. Tey wrote those itself, so they are adopted into the receipt; refusing them would make every such installation need `--force` on its next reinstall.

### `refusal`

```kex
refusal(target: String, claim: Claim, path: String, force?: Bool) -> String?
```

Returns the message explaining why `claim` stops the install, or `None` when it can go ahead.

`--force` takes a name over from another package or from a file Tey did not install, but never a name reserved for Tey.

### `load` (foul)

```kex
load(name: String) -> Receipt?
```

### `all` (foul)

```kex
all -> [Receipt]
```

Returns every receipt, sorted by package name.

A receipt that cannot be parsed is skipped with a warning on stderr, since skipping it quietly would make the files it owns look unowned. A receipt file that cannot be read at all is skipped without one.

### `save` (foul)

```kex
save(receipt: Receipt) -> Result<Void, String>
```

Writes `receipt` to its file.

The receipt is written to a file beside it and renamed into place, so a reader never sees half a receipt and a failed write leaves the old one intact.

### `remove` (foul)

```kex
remove(name: String) -> Result<Void, String>
```

### `teyBuilt?` (foul)

```kex
teyBuilt?(path: String) -> Bool
```

Returns whether `path` is an escript that Tey's target build wrote: its emulator line starts Kex's escript launcher, or names `kex_main` directly, as escripts built before the launcher existed do.

### `listLine`

```kex
listLine(receipt: Receipt) -> String
```

Returns the line `tey list` prints for one installed program.

### `pinText`

```kex
pinText(receipt: Receipt) -> String
```

Returns what a Git install is pinned to, as `tey list` shows it: a tag such as `v0.4.0`, a branch or ref with its commit such as `main (3f9c1a2)`, or a short commit id when an exact commit was asked for.

## record `Receipt`

**Fields**

  - `name` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `version` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sourceKind` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sourcePath` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sourceDigest` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sourceSelector` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sourceRequested` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `sourceCommit` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `selectedTargets` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `targets` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `kex` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `otp` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `installedAt` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)



## record `InstallOptions`

The options `tey install <argument>` was given: the workspace member (`--package`), the Git pin (`--tag`, `--branch` or `--ref`; a `ref` of `HEAD` when none is given), the targets (`--target`; all of them when empty), whether to take over names other packages own (`--force`), and whether to resolve dependencies again instead of using the program's committed lock (`--fresh`).

`pinned?` is true when any pin was given; reinstalling by name keeps the receipt's pin otherwise. `rebuild?` forces a rebuild even when nothing has changed.

**Fields**

  - `packageName` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `force?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)
  - `selector` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `requested` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `pinned?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)
  - `targets` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `fresh?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)
  - `rebuild?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)
  - `approvePlugins?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)



## type `ProgramSource`

What the argument to `tey install` names: a path, a Git URL or the name of an installed program. It always names a program; dependencies are added with `tey add`.

**Variants**

  - `PathSource(String)`
  - `GitSource(String)`
  - `InstalledName(String)`



## type `Claim`

What installing one target name would do to the bin directory: the name is free, already this package's, an old Tey-built file to adopt, reserved for Tey, owned by another package, or a file Tey did not install.

**Variants**

  - `Free`
  - `Mine`
  - `Adopt`
  - `Reserved`
  - `OwnedBy(String)`
  - `Foreign`


