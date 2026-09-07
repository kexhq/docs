---
package: tey
version: "0.2.0-dev"
source: tey/self_update.kex
title: Tey.SelfUpdate
entities:
  - { kind: module, name: "Tey.SelfUpdate" }
---

# Tey.SelfUpdate

## module `Tey.SelfUpdate`

## type `UpgradeOutcome`

Upgrading Tey itself (`tey upgrade`), for installs that came from a release archive rather than a package manager — see `install.sh` at the repository root. A Homebrew-managed Tey is brew's to upgrade and is refused here.

Tey has its own version and its own cadence (`tey/package.kex`), so it cannot reuse the Kex tag list directly: the newest Tey is the one the newest Kex release's manifest declares. That manifest is read over plain HTTPS (raw.githubusercontent.com) with the same curl-then-wget idiom `Tey.Toolchain.download` already uses — no GitHub API, no rate limits, no clone. The archive itself is the `tey-<version>.tar.gz` the release workflow publishes beside the Kex archives, under the same tag.

What `tey upgrade` found: either the version it installed and where, or why there was nothing to install.



**Variants**

  - `Upgraded(String, String)`
  - `AlreadyNewest(String)`
  - `NewerThanRelease(String)`

## function `currentPrefix`

Where this Tey is installed, or None when it cannot be told — outside an installed launcher (a source checkout, `erl` by hand) there is nothing safe to overwrite. `tey/bin/tey` exports TEY_EBIN before invoking the BEAM, so a released install always knows.


```kex
currentPrefix()
```


## function `prefixOf`

TEY_EBIN with the trailing `/lib/kex/tey/ebin` stripped. Anything else — unset, empty, a checkout's `tey/ebin` — is None: there is no install prefix to upgrade in place.


```kex
prefixOf(ebin)
```


## function `homebrewManaged?`

Whether this install belongs to Homebrew, whose keg bookkeeping Tey must not fight: that Tey upgrades with `brew upgrade tey`.


```kex
homebrewManaged?(prefix)
```


## function `manifestVersion`

The `version("...")` line of a `package.kex` manifest, read as plain text. The manifest reader cannot be used here: it parses a LOCAL package through the selected compiler, and this text was just downloaded, not installed.


```kex
manifestVersion(text)
```


## function `compareVersions`

Ordering for two version strings, for the already-newest guard. Something unparsable compares as older: a hand-edited development version must never read as "newer than every release" and refuse its own upgrade.

Written over `newer?` rather than `compare` on purpose: a trait method from another module's `make ..., implement: Comparable` does not dispatch to a custom record from outside that module on the BEAM backend, while a plain `let` like `newer?` calls anywhere.


```kex
compareVersions(a, b)
```


## function `carryBakedErlText`

A source install (`make -C tey install`) bakes an absolute `erl` into `bin/tey`; release archives bake a bare `erl` resolved from PATH. Upgrading must not silently move the former onto the latter, so the old absolute path is carried into the new launcher. Anything else (no line, a relative `erl`, the dev placeholder) leaves the new launcher exactly as published.


```kex
carryBakedErlText(oldLauncher, newLauncher)
```


## function `tagFor`

The tag naming a Kex version, resolved against a tag list read once — `Tey.Toolchain.releaseTag` answers the same question but re-lists the tags on every call, which a pinned-version scan cannot afford.


```kex
tagFor(tags, version)
```


## function `upgradeLatest`

`tey upgrade` — the newest released Tey: the one the newest Kex release's manifest declares. Stable Kex releases unless `includePre` (`--pre`), which is how a pre-release Tey is reached without knowing its number.


```kex
upgradeLatest(includePre)
```


## function `upgradePinned`

`tey upgrade <version>` — exactly that Tey, from the newest release (stable first, then pre-releases) whose manifest declares it. An older version is allowed: pinning is explicit, and it is the way back from a bad release.


```kex
upgradePinned(version)
```

