---
package: tey
version: "0.2.1-dev"
source: tey/toolchain.kex
title: Tey.Toolchain
entities:
  - { kind: module, name: "Tey.Toolchain" }
---

# Tey.Toolchain

## module `Tey.Toolchain`

### `home` (foul)

```kex
home -> String
```

### `repository` (foul)

```kex
repository -> String
```

Returns the Git repository Tey reads Kex releases from. `TEY_KEX_REPO` overrides it, for a fork or a mirror.

### `binDirectory` (foul)

```kex
binDirectory -> String
```

Returns the directory holding the `kex` shim. A user puts it on PATH once, and `tey kex use` repoints the shim inside it.

### `shimPath` (foul)

```kex
shimPath -> String
```

### `selected` (foul)

```kex
selected -> String?
```

Returns the version `tey kex use` last selected, or `None`.

### `installedVersions` (foul)

```kex
installedVersions -> [String]
```

Returns the versions installed under the Tey home, newest first.

Leftover staging directories and directories without a `bin/kex` are not listed.

### `binaryOf` (foul)

```kex
binaryOf(version: String) -> String
```

Returns the path of an installed version's `bin/kex`.

### `installed?` (foul)

```kex
installed?(version: String) -> Bool
```

### `pairedTeyEbin` (foul)

```kex
pairedTeyEbin(version: String) -> String
```

Returns the `ebin` directory of the Tey released with a Kex version, the same path `bin/tey` reads.

It sits beside the toolchain, not inside it, because reinstalling a Kex replaces the toolchain's whole directory and a Tey running from there would lose its modules.

### `availableVersions` (foul)

```kex
availableVersions -> Result<[String], String>
```

Returns the released versions, newest first, read from the repository's tags. Tags that are not versions are skipped.

### `newestFirst`

```kex
newestFirst(versions: [String]) -> [String]
```

### `latestStable` (foul)

```kex
latestStable -> Result<String, String>
```

Returns the newest stable release, which `tey kex install` picks when no version is given. Pre-releases are left out.

### `latestIncludingPreReleases` (foul)

```kex
latestIncludingPreReleases -> Result<String, String>
```

Returns the newest release including pre-releases, which `tey kex install --pre` picks. Before a stable release exists, this may be the only way to get one without knowing its number.

### `installedKex` (foul)

```kex
installedKex -> String?
```

### `bundled` (foul)

```kex
bundled -> String?
```

Returns the Kex bundled beside Tey, named by `TEY_BUNDLED_KEX`, or `None` when there is none.

A package manager installs it so the first `tey` command has a compiler without a long build. It is not an installation in the Tey home: `resolved` runs it where it lies, and `tey kex use <its version>` copies it into the home, after which Tey manages it like any other version.

### `bundledVersion` (foul)

```kex
bundledVersion -> String?
```

Returns the version of the bundled Kex, or `None`.

The only way to find out is to run it, so avoid calling this in a loop.

### `selectableToolchains` (foul)

```kex
selectableToolchains -> [Toolchain]
```

Returns every toolchain `tey kex use` can select, newest first: the ones in the Tey home and the bundled one, each with the binary that runs it.

`tey kex list --installed --json` prints this. The bundled Kex is included although it is not installed, because on a fresh install it is the one a bare `kex` runs, and `tey kex use` must be able to select it.

### `selectableVersions` (foul)

```kex
selectableVersions -> [String]
```

Returns every version `tey kex use` can select, newest first.

### `resolveSelector` (foul)

```kex
resolveSelector(selector: String) -> String?
```

Turns the argument of `tey kex use` into a version number.

`latest` means the newest version already on this machine, not the newest release: `use` never downloads anything. `tey kex install` does that.

### `kex` (foul)

```kex
kex -> String
```

Returns the compiler every Tey command runs.

It is `resolved`'s answer (`TEY_KEX`, then the selected toolchain, then the bundled Kex where it lies), or else a bare `kex` from PATH. That last one is a fallback for a source checkout: Tey cannot update it, and it may not be the version `tey kex list` reports.

### `activeInfo` (foul)

```kex
activeInfo -> Result<ToolchainInfo, String>
```

Reads `kex --info` from the selected compiler.

Callers that need several facts read them from one call, so they cannot come from two different binaries if the selection changes in between.

### `runtimeOtpFloor` (foul)

```kex
runtimeOtpFloor -> Integer?
```

Returns the OTP release that compiled the selected toolchain's runtime beams, which is the oldest Erlang that can load them.

It comes from `kex --info`. It is `None` when the toolchain is too old to have `--info`, when the field is missing, or when it is `null` because the compiler was built without `erlc`. A caller should not treat any of these as an error.

### `runningOtpRelease` (foul)

```kex
runningOtpRelease -> Integer?
```

Returns the OTP release of the `erl` that will run, by asking it.

### `erl` (foul)

```kex
erl -> String
```

Returns the `erl` that Tey and Kex will run. `KEX_ERL` overrides it for both, as it does for the compiler.

### `resolved` (foul)

```kex
resolved -> String?
```

Returns the compiler Tey would run, or `None` when there is none.

It tries `TEY_KEX`, then the selected toolchain, then the bundled Kex. The bundled one is run where it lies, not copied into the Tey home: nothing is installed until the user asks, and Homebrew's post-install sandbox could not write to the home anyway. A selected version always wins over it.

Unlike `kex`, this has no fallback to a bare `kex` from PATH, because that `kex` is Tey's own dispatcher and would call itself.

### `installBundled` (foul)

```kex
installBundled -> Result<String, String>
```

Copies the bundled Kex into the Tey home and selects it, so Tey manages it like any other version. This only happens when the user selects the bundled version with `tey kex use`.

### `selectionHealthy?` (foul)

```kex
selectionHealthy? -> Bool
```

Returns `false` when the selected version is no longer installed, so a caller can report a missing Kex instead of failing on a path that does not exist.

### `startupProblem` (foul)

```kex
startupProblem(prefix: String) -> String?
```

Returns why the toolchain installed at `prefix` cannot start, or `None` when `kex --version` runs.

A release archive is a prebuilt binary that loads readline, GMP, PCRE2 and OpenSSL from the system, and on Linux needs glibc 2.38 or later. This finds a missing library right after the install, not on the first real command.

### `installRelease` (foul)

```kex
installRelease(version: String) -> Result<String, String>
```

Installs a released version and selects it, returning its prefix.

It uses the published archive for this machine when there is one, which takes seconds and needs no C++ compiler. When there is no archive for this machine it builds from source. A corrupt archive, or a release that cannot be looked up at all, is an error and does not fall back to a build.

### `releaseBase` (foul)

```kex
releaseBase -> String
```

Returns the base URL of the release archives.

It is derived from `repository`, so a fork only has to set `TEY_KEX_REPO`. `TEY_KEX_RELEASES` overrides it for a mirror.

### `releaseTarget` (foul)

```kex
releaseTarget -> Result<String, String>
```

Returns this machine's part of a release archive name, such as `macos-arm64` in `kex-0.4.0-macos-arm64.tar.gz`.

### `installSource` (foul)

```kex
installSource(source: String, version: String) -> Result<String, String>
```

Builds the Kex source tree at `source` with CMake, installs it as `version` and selects it, returning its prefix.

The compiler, runtime BEAM modules and stdlib sources are installed together, in the CMake install layout that every Tey toolchain has.

### `uninstall` (foul)

```kex
uninstall(version: String) -> Result<String, String>
```

Removes an installed toolchain and returns its former prefix.

Removing the selected version also clears the selection and removes the shim, so the caller should ask the user to select another.

### `use` (foul)

```kex
use(version: String) -> Result<Void, String>
```

Selects an installed version, or the bundled one, and points the shim at it.

### `download` (foul)

```kex
download(url: String, path: String) -> Result<Void, String>
```

Downloads `url` to `path` with curl, or with wget when curl is missing.

The file appears at `path` only once the download is complete. This and the helpers below are public because `Tey.SelfUpdate` (`tey upgrade`) uses them for Tey's own archives.

### `verifyArchive` (foul)

```kex
verifyArchive(archive: String, checksumUrl: String) -> Result<Void, String>
```

Downloads the checksum at `checksumUrl` and checks `archive` against it.

The file is in the `<hash>  <filename>` format that sha256sum and shasum write.

### `checksumOf` (foul)

```kex
checksumOf(path: String) -> Result<String, String>
```

Returns the SHA-256 of the file at `path`, computed by sha256sum or shasum so the file is never read into memory.

### `releaseTag` (foul)

```kex
releaseTag(version: String) -> Result<String, String>
```

Returns the repository tag for `version`, either `0.3.0` or `v0.3.0`.

### `versionOf`

```kex
versionOf(tag: String) -> String?
```

Returns the version a tag names, without a leading `v`, or `None` when the tag is not a version.

**Examples**

```kex
Tey.Toolchain.versionOf("v0.3.0")    # => Just("0.3.0")
Tey.Toolchain.versionOf("nightly")   # => None
```

### `publish` (foul)

```kex
publish(staging: String, prefix: String) -> Result<String, String>
```

Moves a finished staging tree to `prefix`, and returns `prefix`.

When `prefix` already holds a toolchain, the old tree is kept until the new one is in place and put back if the move fails, so a failed reinstall leaves the previous toolchain working.

## record `ToolchainInfo`

What the selected compiler reports about itself through `kex --info`.

The version here can differ from `Kex.VERSION`, which names the compiler that built Tey itself: a project may select a newer or older compiler.

**Fields**

  - `version` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `reportedRuntimeOtpFloor` : [Integer](../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)? (optional)



## record `Toolchain`

A Kex that `tey kex use` can select: its version, the binary that runs it, and whether it is the bundled one beside Tey and not an installation in the Tey home.

**Fields**

  - `version` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `binary` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `bundled?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)



## type `ArchiveFailure`

Why a published archive could not be installed.

`Unavailable` means there is no usable archive for this machine, and a source build may follow. `Corrupt` means the archive did not match its checksum or did not unpack. `Unreachable` means the release's tag could not be looked up.

**Variants**

  - `Unavailable(String)`
  - `Corrupt(String)`
  - `Unreachable(String)`


