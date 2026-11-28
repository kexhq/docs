---
package: tey
version: "0.2.1-dev"
source: tey/commands.kex
title: Tey.Commands
entities:
  - { kind: module, name: "Tey.Commands" }
---

# Tey.Commands

## module `Tey.Commands`

### `manifest` (foul)

```kex
manifest -> Result<ManifestPackage, String>
```

### `lock` (foul)

```kex
lock -> Integer
```

### `add` (foul)

```kex
add(name: String, options: ParsedOptions) -> Integer
```

### `localOverride` (foul)

```kex
localOverride(name: String, path: String, remove?: Bool, list?: Bool) -> Integer
```

### `install` (foul)

```kex
install(without: String, packageName: String = …) -> Integer
```

`tey install` in a package: installs its dependencies, then its targets.

`--without dev` skips fetching a group's dependencies. The lockfile still lists them, so dropping the flag later needs no new resolve.

### `installWorkspace` (foul)

```kex
installWorkspace(without: String, packageName: String, force?: Bool, approveAll?: Bool) -> Integer
```

Does what `install` does. `force?` lets targets replace programs Tey does not own (see `Tey.Programs.refusal`), and `approveAll?` approves every plugin without asking.

### `installDependencies` (foul)

```kex
installDependencies(context: Context, without: String, approveAll?: Bool) -> Result<Void, String>
```

Does everything `tey install` does before building: resolves the workspace's lock or reuses it, fetches and verifies what it names, approves plugins, and writes the lock.

### `fetchAll` (foul)

```kex
fetchAll(dependencies: [Tey.Lockfile.Dependency]) -> Result<Void, String>
```

### `installPrograms` (foul)

```kex
installPrograms(arguments: [String], options: InstallOptions) -> Integer
```

`tey install <argument>...`: installs a program from a path or a Git URL, or updates installed programs by name. Several arguments must all be names, since a source is one program with its own options.

### `installProgram` (foul)

```kex
installProgram(argument: String, options: InstallOptions) -> Integer
```

### `reinstallProgram` (foul)

```kex
reinstallProgram(name: String, options: InstallOptions) -> Integer
```

`tey install <name>`: updates an installed program by installing it again from the source its receipt records.

A tag or an exact commit stays pinned unless a new `--tag`, `--branch` or `--ref` is given. A branch, HEAD or path is rebuilt only when its commit or content changed, unless `--rebuild` asks for it, say after an Erlang upgrade or a compiler fix.

### `uninstallPrograms` (foul)

```kex
uninstallPrograms(names: [String]) -> Integer
```

`tey uninstall <name>...`: removes the programs each receipt owns, then the receipt and its build tree. A program since replaced by a file Tey did not write is left in place, with a message.

### `uninstallProgram` (foul)

```kex
uninstallProgram(name: String) -> Integer
```

### `installFromPath` (foul)

```kex
installFromPath(path: String, options: InstallOptions) -> Integer
```

Installs the program at `path` without writing to it. The workspace around it is copied to a staging directory, which gets its own lock, dependencies and build, and replaces the program's previous build tree only once its programs are installed. The checkout gains no `ebin/` and no `tey.lock`.

### `installFromGit` (foul)

```kex
installFromGit(url: String, options: InstallOptions) -> Integer
```

Installs a program from a Git repository, at the commit `--tag`, `--branch` or `--ref` names, or at the default branch's HEAD. The commit is fetched into the cache like a dependency and installed from there like a path, so nothing is built inside the cache.

### `previousApprovals` (foul)

```kex
previousApprovals(name: String) -> {String: String}
```

Returns the plugin approvals recorded in the lock of program `name`'s previous install, or none for a first install.

### `programMember` (foul)

```kex
programMember(context: Context, packageName: String) -> Result<Member, String>
```

Returns the workspace member a program install is for: the one `--package` names, or else the one the path is inside.

### `installProgramMember` (foul)

```kex
installProgramMember(context: Context, member: Member, options: InstallOptions, origin: Receipt) -> Integer
```

Finishes a path or Git install once the member is known: refuses a library, checks `--target`, then stages, builds and installs the programs.

### `installStaged` (foul)

```kex
installStaged(context: Context, member: Member, staging: String, options: InstallOptions, origin: Receipt) -> Integer
```

### `updateDependencies` (foul)

```kex
updateDependencies(name: String = …) -> Integer
```

### `dependencyClosure`

```kex
dependencyClosure(state: LockState, roots: [String]) -> [String]
```

Returns `roots` and every package they depend on, directly or not, in the newly resolved graph: the names an update affects.

### `mergeUpdate`

```kex
mergeUpdate(previous: LockState, fresh: LockState, roots: [String], wholeWorkspace?: Bool) -> LockState
```

Returns the lock after an update: the fresh workspace data and the fresh resolutions for `roots` and what they depend on, with every other external pin kept as it was. With `wholeWorkspace?` everything is fresh. Existing approvals are carried over; `approvePlugins` later drops those that no longer match a declaration.

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

### `installTargetsSelected` (foul)

```kex
installTargetsSelected(context: Context, packageName: String, force?: Bool = …) -> Integer
```

### `installMemberTargets` (foul)

```kex
installMemberTargets(member: Member, force?: Bool = …) -> Integer
```

Installs the package's `target(...)` executables into `${TEY_HOME}/bin`, beside the `kex` shim, and records them in the package's receipt (see `Tey.Programs`). That directory is already on PATH for anyone who set up Tey.

A package without targets, such as a library, is left alone. Every name is checked before anything is built, so a refused install changes nothing.

### `installMemberTargetsFrom` (foul)

```kex
installMemberTargetsFrom(member: Member, force?: Bool, origin: Receipt, selected: [String]) -> Integer
```

Does what `installMemberTargets` does, but records `origin`'s source in the receipt, since a program built in a staging copy came from somewhere else.

`selected` limits the targets installed (`--target`); empty means all.

### `releaseTarget` (foul)

```kex
releaseTarget(owner: String, name: String) -> Result<Void, String>
```

Removes `name` from `owner`'s receipt after another package took it over with `--force`. A receipt left owning nothing is deleted.

### `recordInstall` (foul)

```kex
recordInstall(package: ManifestPackage, origin: Receipt, installed: [String], receipts: [Receipt], claims: [(String, Claim)]) -> Result<Void, String>
```

Writes the package's receipt. Names taken over with `--force` are removed from the other package's receipt, and targets the previous receipt owned but this install no longer declares are deleted from the bin directory.

### `dependencyRoots` (foul)

```kex
dependencyRoots -> [String]
```

Returns a `--source-root` for every fetched dependency of the workspace around the working directory, so `using Greet` can find it. A dependency the lockfile names but the cache lacks is reported, with `tey install` as the fix.

### `dependencyRootsAt` (foul)

```kex
dependencyRootsAt(start: String) -> [String]
```

Does what `dependencyRoots` does for the workspace around `start`. A program installed from a path is built in a staged copy, while the working directory may be another project with its own lockfile.

### `sourceDirectoryAt` (foul)

```kex
sourceDirectoryAt(packageRoot: String) -> String
```

Returns the directory, relative to the package, that its module names are resolved against. That is `src`, or `.` when package.kex lists top-level source folders with `sources(["app", "config", "db"])`, so that `App.Models.User` is `./app/models/user.kex`. An unreadable manifest gives `src`; callers report the manifest problem themselves.

### `sourceUnit`

```kex
sourceUnit(directory: String, path: String) -> String
```

Returns a file in the source directory as a path relative to the package, the form the compiler is given. A directory of `.` adds nothing in front.

### `sourceUnit?`

```kex
sourceUnit?(path: String) -> Bool
```

Returns `true` when a file directly under the source directory is a module to compile. When the package itself is the source directory, its manifests are there too and are skipped.

### `sourceRoots` (foul)

```kex
sourceRoots -> [String]
```

Returns every `--source-root` a compile of this package needs: its own source directory first, then each dependency's. The order means a module name defined both in the package and in a dependency refers to the package's own module.

### `sourceRootsAt` (foul)

```kex
sourceRootsAt(packageRoot: String) -> [String]
```

### `librarySources` (foul)

```kex
librarySources -> [String]
```

Returns a library's compilable units: every `.kex` file directly under its source directory. Subdirectories are not searched, since a nested module is reached through the file that uses it, and naming it as well would compile it twice and report a duplicate module.

### `librarySourcesAt` (foul)

```kex
librarySourcesAt(packageRoot: String) -> [String]
```

Does what `librarySources` does for the package at `packageRoot`, with the units relative to it. Run the compiler with `packageRoot` as the working directory.

The paths are relative because the compiler registers a module's declarations twice when an entry file is given as an absolute path that is also under a `--source-root`, and then reports a function as "defined twice".

### `backendFlags`

```kex
backendFlags(interpret?: Bool) -> [String]
```

Returns the backend flags for `tey run` and `tey test`: none, so they compile and run on the BEAM like the build that ships, or `-R` for the interpreter when `--interpret` is given.

Processes, `BEAM.*` interop and the String and Char representation differ between the two backends, so a passing interpreter run says little about the built package. `--interpret` is for working around a backend gap or for debugging.

### `runPackage` (foul)

```kex
runPackage(extra: [String], interpret?: Bool, packageName: String = …) -> Integer
```

### `runCommand` (foul)

```kex
runCommand(command: Command, extra: [String], interpret?: Bool) -> Integer
```

`tey <name>` for a `command(...)` the manifest declares.

A `.kex` script runs on the selected toolchain with this package's source roots, as `tey run` would, so a release script can `using` the package it releases. Anything else runs as a shell line with `sh -c`, so `command("fmt", run: "kex --format src")` behaves as it would in a terminal, pipes and `&&` included. Extra arguments are passed as `"$@"`, so the shell does not split them again.

### `generate` (foul)

```kex
generate(arguments: [String]) -> Integer
```

`tey generate <namespace>:<generator> [--option value ...] [--force]`

Runs a generator that a direct dependency declares in its `plugin` block. The plugin runs as a child process. It gets the invocation as one line of JSON on stdin and replies with the files it wants written. Tey writes them, only inside the workspace, and asks before replacing a file (`--force` answers yes). The child runs in the operating system's sandbox, with no network and no writing outside scratch space; `--unconfined` lifts that, with a warning.

### `pluginCommand` (foul)

```kex
pluginCommand(arguments: [String]) -> Integer
```

`tey plugin <namespace>:<command> [--option value ...]`

Runs a command that a direct dependency declares in its `plugin` block, limited to what the plugin declared and the user approved.

### `list` (foul)

```kex
list -> Integer
```

`tey list`: prints the locked dependencies, then the programs Tey has installed. Outside a project it prints only the programs.

### `listPrograms` (foul)

```kex
listPrograms(programs: [Receipt]) -> Void
```

### `build` (foul)

```kex
build -> Integer
```

### `buildSelected` (foul)

```kex
buildSelected(packageName: String, workspace?: Bool, requestedJobs: String = …) -> Integer
```

### `buildMember` (foul)

```kex
buildMember(member: Member) -> Integer
```

### `testReportingFlags`

```kex
testReportingFlags(json?: Bool, list?: Bool, only: String) -> [String]
```

Returns the compiler flags for how `tey test` reports (kexhq/kex#199).

`--json` prints one JSON record per case, with the file and line of the `it` and of any failure. `--list` prints the cases found without running them, and wins over `--json`. `--only <name>` runs one case or one group.

The flags and the records are the compiler's; Tey only passes them on. Editors run `tey test` because Tey knows the package's source roots (see docs/testing.md).

### `testSpecs` (foul)

```kex
testSpecs(requested: [String]) -> [String]
```

Returns the spec files to run: the ones named on the command line, or every `spec/*.spec.kex` when none are named. Naming one runs a single suite, as an editor's per-file run button does.

### `test` (foul)

```kex
test(requested: [String], interpret?: Bool, json?: Bool, list?: Bool, only: String) -> Integer
```

### `testSelected` (foul)

```kex
testSelected(requested: [String], packageName: String, workspace?: Bool, interpret?: Bool, json?: Bool, list?: Bool, only: String, requestedJobs: String = …) -> Integer
```

### `testAt` (foul)

```kex
testAt(packageRoot: String, requested: [String], interpret?: Bool, json?: Bool, list?: Bool, only: String) -> Integer
```

### `clean` (foul)

```kex
clean(all?: Bool) -> Integer
```

### `setupMergeDriver` (foul)

```kex
setupMergeDriver(remove?: Bool) -> Integer
```

### `new` (foul)

```kex
new(directory: String, library: Bool, agentFiles: Bool) -> Integer
```

`tey new <directory>`: creates the directory and a package in it, named after the directory's last component, so `tey new /tmp/ooo` makes `ooo`. Like `cargo new`, it makes the directory; `init` uses the current one.

### `init` (foul)

```kex
init(name: String, library: Bool, agentFiles: Bool) -> Integer
```

`tey init [name]`: makes the current directory a package, such as an existing repository. Files already there are kept.

The package is named after the directory unless `name` is given, for a checkout such as `greet-main` whose package is `greet`.

## record `WorkspaceRunState`

**Fields**

  - `runStatus` : [Integer](../../../prelude/0.4.0-rc.5-dev/number.md#make-integer) (optional)
  - `failedMembers` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)


