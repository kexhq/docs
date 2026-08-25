---
package: tey
version: "0.2.0-dev"
source: tey/toolchain.kex
title: Tey.Toolchain
entities:
  - { kind: module, name: "Tey.Toolchain" }
---

# Tey.Toolchain

## module `Tey.Toolchain`

## constant `home`



## constant `repository`

Where `tey kex list` looks for releases. Overridable so a fork or a mirror can be used without patching Tey.



## constant `binDirectory`

The directory holding the `kex` shim. It is what a user puts on PATH once; selecting a version repoints the shim rather than asking them to edit PATH again.



## constant `shimPath`



## constant `selected`

The version `tey kex use` last selected, if any.



## constant `installedVersions`

Versions installed under this Tey home, newest first. Staging leftovers are not installations, and neither is a directory whose `bin/kex` is gone — a half-removed toolchain must not be offered as one somebody can run.



## function `binaryOf`

The `bin/kex` naming an installed version — the toolchain layout every consumer (the shim, `resolved`, the listings) agrees on, in one place.


```kex
binaryOf(version)
```


## function `installed?`


```kex
installed?(version)
```


## constant `availableVersions`

Released versions, newest first, read from the repository's tags. Tags that are not versions are skipped rather than reported as junk.



## function `newestFirst`


```kex
newestFirst(versions)
```


## constant `latestStable`

The newest RELEASED version — what `tey kex install` picks when asked for no version in particular, and what a download page means by "the current Kex". Pre-releases are opt-in by name.



## constant `latestIncludingPreReleases`

The newest version of ANY channel — what `tey kex install --pre` picks. This is how you get onto a beta or an rc without knowing its number: during a pre-stability run there may be nothing else published at all.



## constant `installedKex`



## constant `bundled`

The Kex bundled beside Tey — what a package manager lays down so the first `tey` command has a compiler without a ten-minute build. It is a SEED, not an installation: `kex` below adopts it into the Tey home on first use, and from then on Tey manages that copy like any other version. Nothing outside the Tey home is ever put on PATH, which is the whole point — two `kex` binaries under two managers drift apart.



## constant `bundledVersion`

Which version the bundled Kex is. Answering means RUNNING it, so this is not something to ask inside a loop — but it is the only way to know: the seed is a plain install tree with no version recorded beside it.



## record `Toolchain`

One selectable Kex: the version `tey kex use` names it by, the binary that runs it, and whether it is the bundled seed lying beside Tey rather than an installation in the Tey home.

**Fields**

  - `version` : String
  - `binary` : String
  - `bundled?` : Bool (optional)

## constant `selectableToolchains`

Every version `tey kex use` can select, newest first: the ones in the Tey home, plus the bundled one — each carrying the binary that runs it, which is what a listing meant for tools (`kex list --installed --json`) needs.

The seed belongs here even though it is not installed. It is a real compiler already on the disk, and on a fresh keg it is the one a bare `kex` runs — so leaving it out made `tey kex use <that version>` refuse a version the user had just watched run, with no way back to it short of downloading a second copy of what was already there.



## constant `selectableVersions`

Every version `tey kex use` can select, newest first.



## function `resolveSelector`

Turns what someone typed after `tey kex use` into a version number.

`latest` means the newest Kex this machine can select — NOT the newest released one. `use` selects among what is already here; reaching for something unreleased-and-undownloaded is what `tey kex install` is for, and quietly downloading from a command that reads like "switch to" would be a surprise.


```kex
resolveSelector(selector)
```


## constant `kex`

The compiler every Tey command shells out to.

In order: an explicit TEY_KEX, the selected toolchain, the bundled seed (adopted on the spot), and only then a bare `kex` from PATH. That last one is a fallback for a source checkout, not a supported installation — a `kex` somebody else installed is a `kex` Tey cannot update, and it silently becomes a different version from the one `tey kex list` reports.



## constant `runtimeOtpFloor`

The OTP release that compiled the selected toolchain's runtime beams — the oldest Erlang that can load them, since a `.beam` cannot be read by a runtime older than the `erlc` that produced it.

Read from `kex --info` rather than guessed: the number is a build-time constant inside the binary (KEX_RUNTIME_OTP_FLOOR) and Tey has no other way to see it. `--version` is prose and may be reworded; `--info` is the contract (tests/info_cli_test.cxx pins it).

`None` when the toolchain is too old to have `--info`, when the field is absent, or when it is `null` because the compiler was built without erlc. All three mean the same thing to a caller — "this toolchain does not say" — and none of them is an error worth stopping a build for.



## constant `runningOtpRelease`

The OTP actually about to run, asked of `erl` itself.



## constant `erl`

The `erl` Tey and Kex will spawn. KEX_ERL mirrors what the compiler itself honours, so overriding it moves both rather than half of the pair.



## constant `resolved`

The compiler Tey would run, or None when there is none to run.

The bundled Kex is used WHERE IT LIES rather than copied into the Tey home first. Copying is an install, and an install is not something to do behind someone's back on their first command — it is also impossible where it would be most useful, since Homebrew's post-install sandbox cannot write to the user's home at all. So a fresh Homebrew keg is runnable immediately, nothing is written until `tey kex install` is typed, and a selected version always wins over the bundled one.

Without the last-resort fallback to a bare `kex` from PATH that `kex` above keeps: `kex` on PATH is Tey's own dispatcher, and answering it with its own name would send it round in a circle.



## constant `installBundled`

Takes the bundled Kex into the Tey home so Tey manages it like any other version: `tey kex list` shows it, `tey kex use` can come back to it, and uninstalling whatever replaces it leaves something behind. Only ever done when asked — see `resolved`.



## constant `selectionHealthy?`

Whether the selected toolchain is actually there. A `current` naming a version somebody deleted leaves every command failing on a path that does not exist, which reads like a broken Tey rather than a missing Kex.



## function `installRelease`

Installs a released version by name. The published archive for this machine is the fast path — unpacking one takes seconds where building takes minutes, and it needs no compiler, which is the point: whatever installs Tey should not also have to be able to build Kex.

Falling back to a source build rather than failing keeps the platforms without a published archive working, and covers a release whose upload is incomplete.


```kex
installRelease(version)
```


## type `ArchiveFailure`

Why a published archive could not be installed. The distinction is the point: one of these is routine and one of them is not.



**Variants**

  - `Unavailable(String)`
  - `Corrupt(String)`

## constant `releaseBase`

Where the release archives live. Derived from the repository so a fork only has to set TEY_KEX_REPO, and overridable on its own for a mirror.



## constant `releaseTarget`

The archive naming this machine, matching what the release workflow builds: `kex-0.4.0-macos-arm64.tar.gz`.



## function `installSource`

Installs compiler, runtime BEAM modules and stdlib sources together. The source tree's CMake install layout is the toolchain ABI Tey manages.


```kex
installSource(source, version)
```


## function `uninstall`

Removes an installed toolchain. Refuses to leave the shim pointing at nothing: removing the SELECTED version also clears the selection, and the caller is told to pick another.


```kex
uninstall(version)
```


## function `use`


```kex
use(version)
```

