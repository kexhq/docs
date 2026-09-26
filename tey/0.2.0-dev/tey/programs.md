---
package: tey
version: "0.2.0-dev"
source: tey/programs.kex
title: Tey.Programs
entities:
  - { kind: module, name: "Tey.Programs" }
---

# Tey.Programs

## module `Tey.Programs`

What Tey has put in `${TEY_HOME}/bin`, and who owns each file there.

Every package whose targets Tey installs gets a receipt at `${TEY_HOME}/programs/<name>/receipt.json`. The receipt is the only authority for ownership: a file in the bin directory that no receipt lists is not Tey's to overwrite or delete. Without one, a second package declaring the same target name silently replaced the first package's program, and nothing could say what a file in there was or where it had come from.

Keyed by PACKAGE, not by binary: one package may install several targets, and reinstalling or removing it acts on all of them together.

### `reservedNames` (constant)

```kex
reservedNames : [String]
```

Names that are Tey's own and never a package's to take: the `kex` shim lives in this directory, and replacing it would change which compiler every shell runs.



### `directory`

```kex
directory : String
```

### `classify`

```kex
classify(argument: String) -> ProgramSource
```

A path when it starts like one (`.`, `/`, `~`), a Git URL when it has a scheme or is scp-like (`git@host:owner/repo`), and otherwise the name of an installed program.

### `buildDirectory`

```kex
buildDirectory(name: String) -> String
```

Where a program's staged build tree ends up once it is installed.

### `stagingDirectory`

```kex
stagingDirectory : Result<String, String>
```

A fresh directory to build a program in before it is installed. Beside `programs/` rather than in it, so a half-built tree is never listed as a program, and on the same filesystem, so publishing it is a rename.

### `stage`

```kex
stage(root: String, destination: String) -> Result<Void, String>
```

Copies the tree at `root` into `destination`: what a snapshot would hold, plus a committed `tey.lock` — the dependency versions the program's author tested, which a snapshot leaves out.

### `copyInto`

```kex
copyInto(root: String, relative: String, destination: String) -> Bool
```

### `publishBuild`

```kex
publishBuild(name: String, staged: String) -> Result<Void, String>
```

Replaces a program's build tree with the one it was just installed from. The old tree is moved aside first and removed last, so a failure part way leaves one of the two in place.

### `receiptPath`

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

The decision for one target name, given every receipt and what is on disk. Pure, so the whole rule is testable without a bin directory.

`teyBuilt?` covers the programs a project-local `tey install` put here before receipts existed: they are escripts Tey itself wrote, so taking them into a receipt loses nothing, where refusing would make every existing installation demand `--force` on its next reinstall.

### `refusal`

```kex
refusal(target: String, claim: Claim, path: String, force?: Bool) -> String?
```

Why a claim stops the install, or None when it may go ahead. `--force` takes a name over from another package or from an unowned file, but never from Tey itself.

### `load`

```kex
load(name: String) -> Receipt?
```

### `all`

```kex
all : [Receipt]
```

Every receipt, by package name. An unreadable one is reported rather than skipped silently: skipping it would make the files it owns look unowned.

### `save`

```kex
save(receipt: Receipt) -> Result<Void, String>
```

Written beside the final file and renamed into place, so a reader never sees half a receipt and a failed write leaves the previous one intact.

### `remove`

```kex
remove(name: String) -> Bool
```

### `teyBuilt?`

```kex
teyBuilt?(path: String) -> Bool
```

Whether `path` is an escript Tey's own target build wrote: its emulator line names `kex_main`, which every compiled Kex entry module is called.

### `listLine`

```kex
listLine(receipt: Receipt) -> String
```

The line `tey list` prints for one installed program.

## record `Receipt`

**Fields**

  - `name` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `version` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `sourceKind` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `sourcePath` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `sourceDigest` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `targets` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)
  - `kex` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `otp` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `installedAt` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)



## type `ProgramSource`

What `tey install <argument>` names. `tey add` is how a dependency is added, so an argument to `tey install` always means a program.

**Variants**

  - `PathSource(String)`
  - `GitSource(String)`
  - `InstalledName(String)`



## type `Claim`

What installing one target name would do to the bin directory.

**Variants**

  - `Free`
  - `Mine`
  - `Adopt`
  - `Reserved`
  - `OwnedBy(String)`
  - `Foreign`


