---
package: tey
version: "0.2.1-dev"
source: tey/self_update.kex
title: Tey.SelfUpdate
entities:
  - { kind: module, name: "Tey.SelfUpdate" }
---

# Tey.SelfUpdate

## module `Tey.SelfUpdate`

### `currentPrefix` (foul)

```kex
currentPrefix -> String?
```

Returns the prefix this Tey is installed under, or `None` when it is not running from an installed launcher (a source checkout, or `erl` started by hand), where there is nothing safe to overwrite. The `bin/tey` launcher exports `TEY_INSTALL_EBIN`, so a released install always knows.

### `installEbin` (foul)

```kex
installEbin -> String?
```

Returns the launcher's own runtime directory, from `TEY_INSTALL_EBIN`, or from `TEY_EBIN` when that is unset. `TEY_EBIN` alone is not enough: it may name the Tey paired with the selected Kex (see `installPaired`), which is not the install to upgrade.

### `prefixOf`

```kex
prefixOf(ebin: String) -> String?
```

Returns `ebin` with its trailing `/lib/kex/tey/ebin` removed. Any other path, such as a checkout's `tey/ebin`, gives `None`: there is no install prefix to upgrade in place.

### `homebrewManaged?`

```kex
homebrewManaged?(prefix: String) -> Bool
```

Returns `true` when the install at `prefix` belongs to Homebrew, which upgrades it with `brew upgrade tey`.

### `manifestVersion`

```kex
manifestVersion(text: String) -> String?
```

Returns the version from the `version("...")` line of a `package.kex` manifest, read as plain text, or `None` when there is no valid one. The manifest reader does not fit here, since it compiles a local package and this text has only been downloaded.

### `compareVersions`

```kex
compareVersions(a: String, b: String) -> Ordering
```

Compares two version strings, for the already-newest check. A version that does not parse compares as older, so a hand-edited development version is never treated as newer than every release and can still be upgraded.

It is built on `newer?` and not `compare`: on the BEAM backend, a trait function from another module's `make ..., implement: Comparable` does not dispatch to a record from outside that module, while a plain `let` such as `newer?` can be called from anywhere.

### `carryBakedErlText`

```kex
carryBakedErlText(oldLauncher: String, newLauncher: String) -> String
```

Returns `newLauncher` with the absolute `erl` path of `oldLauncher` carried over.

A source install (`make -C tey install`) writes an absolute `erl` path into `bin/tey`, while release archives use a bare `erl` found on `PATH`. An upgrade keeps the absolute path. In every other case (no `BAKED_ERL` line, a relative `erl`, the development placeholder) the new launcher is returned unchanged.

### `tagFor`

```kex
tagFor(tags: [String], version: String) -> String?
```

Returns the tag in `tags` that names a Kex version, written with or without a leading `v`. Unlike `Tey.Toolchain.releaseTag`, it takes a tag list that was fetched once, which a scan over many versions needs.

### `firstSelfUpgrading` (constant)

The oldest Tey with an `upgrade` command. Pinning an older one is refused, because that Tey could not run `tey upgrade` to come back; the installer is the way to get one.



### `installedVersion` (foul)

```kex
installedVersion(prefix: String) -> String
```

Returns the version of the Tey installed at `prefix`.

That is not always the running Tey: when the selected Kex has its own Tey unpacked beside it (see `installPaired`), the launcher runs that one. Comparing the running version would then report the install as up to date while it stays old. So the installed launcher is asked directly, pointed at its own runtime. If its answer cannot be read, the running version is returned.

### `upgradeLatest` (foul)

```kex
upgradeLatest(includePre: Bool) -> Result<UpgradeOutcome, String>
```

Runs `tey upgrade`: installs the Tey declared by the newest Kex release's manifest. Only stable releases count unless `includePre` (`--pre`) is set, which reaches a pre-release Tey without knowing its number.

### `upgradePinned` (foul)

```kex
upgradePinned(version: String) -> Result<UpgradeOutcome, String>
```

Runs `tey upgrade <version>`: installs exactly that Tey, from the newest release whose manifest declares it, looking at stable releases first and then pre-releases. Older versions are allowed, which is the way back from a bad release, but not ones older than `firstSelfUpgrading`.

### `installPaired` (foul)

```kex
installPaired(kexVersion: String) -> Result<String?, String>
```

Unpacks the Tey that a Kex release ships beside that toolchain, so `bin/tey` runs it whenever that Kex is selected. Kex and Tey are released as a pair, and a pre-release is only tested as that pair. Nothing installed is replaced, not even a Homebrew keg, so `tey kex install` does this every time.

Returns the Tey version unpacked, or `None` when it was already there; a tag's contents never change.

## type `UpgradeOutcome`

Upgrades Tey itself (`tey upgrade`) when it was installed from a release archive by `install.sh`. A Tey installed by Homebrew is refused; upgrade it with `brew upgrade tey`.

Tey has its own version number (`tey/package.kex`), so the newest Tey is the one declared by the newest Kex release's manifest. The manifest is fetched over HTTPS from raw.githubusercontent.com with curl, or wget when curl is missing, as `Tey.Toolchain.download` does; the GitHub API is not used, so there are no rate limits. The archive is the `tey-<version>.tar.gz` that the release workflow publishes under the same tag as the Kex archives.

The result of `tey upgrade`: the version installed and where, or why nothing was installed.

**Variants**

  - `Upgraded(String, String)`
  - `AlreadyNewest(String)`
  - `NewerThanRelease(String)`


