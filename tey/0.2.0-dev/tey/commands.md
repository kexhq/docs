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

## record `WorkspaceRunState`

**Fields**

  - `runStatus` : Integer (optional)
  - `failedMembers` : [String] (optional)

## function `manifest`


```kex
manifest()
```


## function `lock`


```kex
lock()
```


## function `add`


```kex
add(name, options)
```


## function `localOverride`


```kex
localOverride(name, path, remove?, list?)
```


## function `install`

`--without dev` leaves a group's dependencies out of this install. The LOCKFILE still lists them — what is omitted is the fetching, so switching the flag off later needs no re-resolve.


```kex
install(without, packageName)
```


## function `updateDependencies`


```kex
updateDependencies(name)
```


## function `dependencyClosure`

Names affected by a member-local or named update, including transitive dependency edges recorded in the newly resolved graph.


```kex
dependencyClosure(state, roots)
```


## function `mergeUpdate`

Publishes fresh workspace metadata and selected resolutions while retaining unrelated external pins. Existing approvals are carried forward here and subsequently filtered against the visible declarations by approvePlugins.


```kex
mergeUpdate(previous, fresh, roots, wholeWorkspace?)
```


## function `lockReusable?`


```kex
lockReusable?(state, manifestFingerprint, toolchain)
```


## function `validateUpdateName`


```kex
validateUpdateName(members, name)
```


## function `updateScopeMembers`


```kex
updateScopeMembers(context)
```


## function `installTargets`

Puts this package's `target(...)` executables where they can be run by name.

`${TEY_HOME}/bin` is a directory Tey already owns and already asks people to put on PATH — it is how the `kex` shim gets there — so a package's programs land beside it rather than needing a second directory and a second instruction.

Only packages that DECLARE a target are affected. A library has none, so `tey install` in one still means exactly what it meant before: fetch the dependencies.


```kex
installTargets()
```


## function `installTargetsSelected`


```kex
installTargetsSelected(context, packageName)
```


## function `installMemberTargets`


```kex
installMemberTargets(member)
```


## function `dependencyRoots`

`--source-root` for every fetched dependency. Without these a dependency is just bytes in the cache: `using Greet` cannot find it, and the package that declared it does not compile. A dependency the lockfile names but the cache does not have is reported rather than quietly dropped — the answer is `tey install`, and silence would look like a broken `using`.


```kex
dependencyRoots()
```


## function `sourceRoots`

Every `--source-root` a compile of THIS package needs: its own `src/` first, then each dependency's. Own-first is deliberate — a package that shadows a dependency's module name means its own, the same way `--source-root` order already decides that for dependencies among themselves.


```kex
sourceRoots()
```


## function `sourceRootsAt`


```kex
sourceRootsAt(packageRoot)
```


## function `librarySources`

A library's compilable units: every `.kex` directly under `src/`. Not a recursive walk — a nested module is reached by the file that declares it, and compiling it twice by name is how you get a duplicate-module error out of a perfectly good package.


```kex
librarySources()
```


## function `librarySourcesAt`

Returns units relative to `packageRoot`, not absolute: the compiler double-registers a module's declarations when the entry file it is asked to compile is an absolute path that also falls under an explicit `--source-root` (kexhq/kex#?, surfaced by `tey build`ing Rodolfo — a `private do` function building a record literal of a type carrying earlier `make` methods reported that type's method "defined twice"). A relative unit, resolved through the working directory `streamAt`/`runAt` `cd` into, does not collide with the source-root the same way. Callers must invoke the compiler with `packageRoot` as the working directory.


```kex
librarySourcesAt(packageRoot)
```


## function `backendFlags`

What `tey build` produces is what ships, so what `tey run` and `tey test` exercise has to be the same thing — which is what `kex` does with no backend flag at all: it compiles and runs on the BEAM. `-R` tree-walks the source instead, and processes, `Erlang.*` interop and the String/Char representation differ enough between the two that a green interpreter run says nothing about the built package.

`--interpret` is the way back, for a backend gap or a debugging session.


```kex
backendFlags(interpret?)
```


## function `runPackage`


```kex
runPackage(extra, interpret?, packageName)
```


## function `runCommand`

`tey <name>` for a `command(...)` the manifest declares.

A `.kex` script is run through the SELECTED toolchain with this package's source roots already in place — the same environment `tey run` gives, so a release script can `using` the package it is releasing. Anything else is a shell line: `sh -c` is what makes `command("fmt", run: "kex --format src")` behave the way the same line behaves in a terminal, pipes and `&&` included. Trailing arguments are passed as "$@" rather than pasted into the string, so `tey fmt --check` cannot be re-split by the shell.

The `--` before the arguments plays the same role as in runPackage.


```kex
runCommand(command, extra, interpret?)
```


## function `list`


```kex
list()
```


## function `build`


```kex
build()
```


## function `buildSelected`


```kex
buildSelected(packageName, workspace?, requestedJobs)
```


## function `buildMember`


```kex
buildMember(member)
```


## function `testReportingFlags`

How `tey test` should REPORT, as compiler flags (kexhq/kex#199).

`--json` and `--list` are for a tool reading the run rather than a person watching it: one JSON record per case, carrying the file and line of the `it` and of the failure, and — with `--list` — the cases discovered without any of them being run. `--only <name>` narrows the run to one case or one group.

Tey does not interpret any of it: the flags are the compiler's, the records are the compiler's, and this is the mapping from what a person typed to what the compiler is asked. Which is the point — an editor drives `tey test` because Tey knows the package's source roots, not because it wants Tey to reformat the answer (docs/testing.md).


```kex
testReportingFlags(json?, list?, only)
```


## function `testSpecs`

The spec files to run: the ones named on the line, or every `spec/*.spec.kex` when none were. Naming one is what an editor's per-file ▶ needs — and what anyone debugging a single suite in a package with thirty of them wants.


```kex
testSpecs(requested)
```


## function `test`


```kex
test(requested, interpret?, json?, list?, only)
```


## function `testSelected`


```kex
testSelected(requested, packageName, workspace?, interpret?, json?, list?, only, requestedJobs)
```


## function `testAt`


```kex
testAt(packageRoot, requested, interpret?, json?, list?, only)
```


## function `clean`


```kex
clean(all?)
```


## function `setupMergeDriver`


```kex
setupMergeDriver(remove?)
```


## function `new`

`tey new <name>` — a package in a directory of its own, which the command creates. The pair with `init` below follows what `git init` and `cargo new` already taught everyone: `new` makes the directory, `init` adopts the one you are standing in.


```kex
new(directory, library)
```


## function `init`

`tey init` — a package in the CURRENT directory, named after it. This is the half that was missing: a repository someone had already made and cloned had no way to become a package except `tey new` in a temp directory and moving the files over by hand.

The name is overridable because a directory name is not always the package name — `kexhq/greet` checked out as `greet-main` is still `greet`.


```kex
init(name, library)
```

