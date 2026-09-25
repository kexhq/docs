---
package: tey
version: "0.2.0-dev"
source: tey/commands.kex
title: Tey.Commands
entities:
  - { kind: module, name: "Tey.Commands" }
---

# Tey.Commands

## module `Tey.Commands`

### `manifest`

```kex
manifest : Result<ManifestPackage, String>
```

### `lock`

```kex
lock : Integer
```

### `add`

```kex
add(name: String, options: ParsedOptions) -> Integer
```

### `localOverride`

```kex
localOverride(name: String, path: String, remove?: Bool, list?: Bool) -> Integer
```

### `install`

```kex
install(without: String, packageName: String = …) -> Integer
```

`--without dev` leaves a group's dependencies out of this install. The LOCKFILE still lists them — what is omitted is the fetching, so switching the flag off later needs no re-resolve.

### `updateDependencies`

```kex
updateDependencies(name: String = …) -> Integer
```

### `dependencyClosure`

```kex
dependencyClosure(state: LockState, roots: [String]) -> [String]
```

Names affected by a member-local or named update, including transitive dependency edges recorded in the newly resolved graph.

### `mergeUpdate`

```kex
mergeUpdate(previous: LockState, fresh: LockState, roots: [String], wholeWorkspace?: Bool) -> LockState
```

Publishes fresh workspace metadata and selected resolutions while retaining unrelated external pins. Existing approvals are carried forward here and subsequently filtered against the visible declarations by approvePlugins.

### `lockReusable?`

```kex
lockReusable?(state: LockState, manifestFingerprint: String, toolchain: Tey.Toolchain.ToolchainInfo) -> Bool
```

### `validateUpdateName`

```kex
validateUpdateName(members: [Member], name: String) -> Result<Void, String>
```

### `updateScopeMembers`

```kex
updateScopeMembers(context: Context) -> [Member]
```

### `installTargets`

```kex
installTargets : Integer
```

Puts this package's `target(...)` executables where they can be run by name.

`${TEY_HOME}/bin` is a directory Tey already owns and already asks people to put on PATH — it is how the `kex` shim gets there — so a package's programs land beside it rather than needing a second directory and a second instruction.

Only packages that DECLARE a target are affected. A library has none, so `tey install` in one still means exactly what it meant before: fetch the dependencies.

### `installTargetsSelected`

```kex
installTargetsSelected(context: Context, packageName: String) -> Integer
```

### `installMemberTargets`

```kex
installMemberTargets(member: Member) -> Integer
```

### `dependencyRoots`

```kex
dependencyRoots : [String]
```

`--source-root` for every fetched dependency. Without these a dependency is just bytes in the cache: `using Greet` cannot find it, and the package that declared it does not compile. A dependency the lockfile names but the cache does not have is reported rather than quietly dropped — the answer is `tey install`, and silence would look like a broken `using`.

### `sourceRoots`

```kex
sourceRoots : [String]
```

Every `--source-root` a compile of THIS package needs: its own `src/` first, then each dependency's. Own-first is deliberate — a package that shadows a dependency's module name means its own, the same way `--source-root` order already decides that for dependencies among themselves.

### `sourceRootsAt`

```kex
sourceRootsAt(packageRoot: String) -> [String]
```

### `librarySources`

```kex
librarySources : [String]
```

A library's compilable units: every `.kex` directly under `src/`. Not a recursive walk — a nested module is reached by the file that declares it, and compiling it twice by name is how you get a duplicate-module error out of a perfectly good package.

### `librarySourcesAt`

```kex
librarySourcesAt(packageRoot: String) -> [String]
```

Returns units relative to `packageRoot`, not absolute: the compiler double-registers a module's declarations when the entry file it is asked to compile is an absolute path that also falls under an explicit `--source-root` (kexhq/kex#?, surfaced by `tey build`ing Rodolfo — a `private do` function building a record literal of a type carrying earlier `make` methods reported that type's method "defined twice"). A relative unit, resolved through the working directory `streamAt`/`runAt` `cd` into, does not collide with the source-root the same way. Callers must invoke the compiler with `packageRoot` as the working directory.

### `backendFlags`

```kex
backendFlags(interpret?: Bool) -> [String]
```

What `tey build` produces is what ships, so what `tey run` and `tey test` exercise has to be the same thing — which is what `kex` does with no backend flag at all: it compiles and runs on the BEAM. `-R` tree-walks the source instead, and processes, `BEAM.*` interop and the String/Char representation differ enough between the two that a green interpreter run says nothing about the built package.

`--interpret` is the way back, for a backend gap or a debugging session.

### `runPackage`

```kex
runPackage(extra: [String], interpret?: Bool, packageName: String = …) -> Integer
```

### `runCommand`

```kex
runCommand(command: Command, extra: [String], interpret?: Bool) -> Integer
```

`tey <name>` for a `command(...)` the manifest declares.

A `.kex` script is run through the SELECTED toolchain with this package's source roots already in place — the same environment `tey run` gives, so a release script can `using` the package it is releasing. Anything else is a shell line: `sh -c` is what makes `command("fmt", run: "kex --format src")` behave the way the same line behaves in a terminal, pipes and `&&` included. Trailing arguments are passed as "$@" rather than pasted into the string, so `tey fmt --check` cannot be re-split by the shell.

The `--` before the arguments plays the same role as in runPackage.

### `list`

```kex
list : Integer
```

### `build`

```kex
build : Integer
```

### `buildSelected`

```kex
buildSelected(packageName: String, workspace?: Bool, requestedJobs: String = …) -> Integer
```

### `buildMember`

```kex
buildMember(member: Member) -> Integer
```

### `testReportingFlags`

```kex
testReportingFlags(json?: Bool, list?: Bool, only: String) -> [String]
```

How `tey test` should REPORT, as compiler flags (kexhq/kex#199).

`--json` and `--list` are for a tool reading the run rather than a person watching it: one JSON record per case, carrying the file and line of the `it` and of the failure, and — with `--list` — the cases discovered without any of them being run. `--only <name>` narrows the run to one case or one group.

Tey does not interpret any of it: the flags are the compiler's, the records are the compiler's, and this is the mapping from what a person typed to what the compiler is asked. Which is the point — an editor drives `tey test` because Tey knows the package's source roots, not because it wants Tey to reformat the answer (docs/testing.md).

### `testSpecs`

```kex
testSpecs(requested: [String]) -> [String]
```

The spec files to run: the ones named on the line, or every `spec/*.spec.kex` when none were. Naming one is what an editor's per-file ▶ needs — and what anyone debugging a single suite in a package with thirty of them wants.

### `test`

```kex
test(requested: [String], interpret?: Bool, json?: Bool, list?: Bool, only: String) -> Integer
```

### `testSelected`

```kex
testSelected(requested: [String], packageName: String, workspace?: Bool, interpret?: Bool, json?: Bool, list?: Bool, only: String, requestedJobs: String = …) -> Integer
```

### `testAt`

```kex
testAt(packageRoot: String, requested: [String], interpret?: Bool, json?: Bool, list?: Bool, only: String) -> Integer
```

### `clean`

```kex
clean(all?: Bool) -> Integer
```

### `setupMergeDriver`

```kex
setupMergeDriver(remove?: Bool) -> Integer
```

### `new`

```kex
new(directory: String, library: Bool) -> Integer
```

`tey new <name>` — a package in a directory of its own, which the command creates. The pair with `init` below follows what `git init` and `cargo new` already taught everyone: `new` makes the directory, `init` adopts the one you are standing in.

### `init`

```kex
init(name: String, library: Bool) -> Integer
```

`tey init` — a package in the CURRENT directory, named after it. This is the half that was missing: a repository someone had already made and cloned had no way to become a package except `tey new` in a temp directory and moving the files over by hand.

The name is overridable because a directory name is not always the package name — `kexhq/greet` checked out as `greet-main` is still `greet`.

## record `WorkspaceRunState`

**Fields**

  - `runStatus` : [Integer](../../../prelude/0.4.0-beta.4-dev/number.md#make-integer) (optional)
  - `failedMembers` : [[String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string)] (optional)


