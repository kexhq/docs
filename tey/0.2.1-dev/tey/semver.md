---
package: tey
version: "0.2.1-dev"
source: tey/semver.kex
title: Tey.Semver
entities:
  - { kind: module, name: "Tey.Semver" }
---

# Tey.Semver

## module `Tey.Semver`

### `parseVersion`

```kex
parseVersion(text: String) -> SemanticVersion?
```

Parses a version such as `0.4.0`, `v0.4.0-rc.1` or `1.2`, or returns `None`. A leading `v` and build metadata after a plus sign are ignored, and a missing minor or patch number counts as 0.

### `release`

```kex
release(text: String) -> String
```

Returns the release a version belongs to, so `0.4.0-rc.1` gives `0.4.0`. Text that is not a version is returned unchanged.

### `stable?`

```kex
stable?(text: String) -> Bool
```

Returns `true` when the text is a version without a pre-release part.

### `satisfies?`

```kex
satisfies?(versionText: String, requirement: String) -> Bool
```

Returns `true` when the version meets every space- or comma-separated clause of `requirement` (`>=`, `<=`, `>`, `<`, `=`, `^`, `~>` or a bare version). An empty requirement or `*` accepts any version.

`~> 0.3` accepts `0.3.x` and `^0.3` accepts `0.x` from `0.3` on. A pre-release meets a requirement only when some clause names a pre-release, so `~> 0.4` does not accept `0.4.0-rc.1`.

### `intersect`

```kex
intersect(a: String, b: String) -> String
```

Returns a requirement met only by versions that meet both `a` and `b`, for when two packages in one graph depend on the same package.

The result joins the two with a space, since `satisfies?` requires every clause to hold: `~> 0.1` and `>= 0.1.5` give `~> 0.1 >= 0.1.5`. An empty or `*` side is dropped.

A requirement that nothing can meet, such as `~> 0.1 ~> 0.2`, is not detected here. `highest` finds it, by returning `None`.

### `intersectAll`

```kex
intersectAll(requirements: [String]) -> String
```

Returns the intersection of all the requirements, as `intersect` does for two. `[]` and `[""]` both give `""`, which accepts any version.

### `versionOf`

```kex
versionOf(ref: String) -> String
```

Returns the version tag inside a resolved ref: `refs/tags/v0.1.1`, `v0.1.1` and `pkg-v0.1.1` all give `v0.1.1`.

A ref without a version, such as a branch name or a commit, gives `""`, which meets no requirement.

### `channelRank`

```kex
channelRank(_: String) -> Integer
```

Returns the rank of a pre-release channel: `prealpha` 1, `alpha` 2, `beta` 3, `rc` 4, and 0 for any other name.

Plain semver would order the channels alphabetically, putting `beta` before `prealpha`.

### `range?`

```kex
range?(requested: String) -> Bool
```

Returns `true` when a requested tag is a version range, such as `~> 1.2`, and `false` for an exact tag such as `v1.2.0`.

### `newer?`

```kex
newer?(a: String, b: String) -> Bool
```

Returns `true` when `a` is a newer version than `b`. A tag that is not a version counts as older than any that is, so a stray `nightly` never wins.

### `newestFirst`

```kex
newestFirst(versions: [String]) -> [String]
```

Returns the versions without duplicates, newest first, with tags that are not versions at the end.

### `highest`

```kex
highest(tags: [String], requirement: String) -> String?
```

Returns the newest tag that meets the requirement, or `None` when none does.

## record `SemanticVersion`

A parsed version number: `major.minor.patch` and an optional pre-release.

**Fields**

  - `major` : [Integer](../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `minor` : [Integer](../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `patch` : [Integer](../../../prelude/0.4.0-rc.5-dev/number.md#make-integer)
  - `preRelease` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)

Implements `Comparable`.

### Functions

Orders versions by number, then by pre-release: a release ranks above its pre-releases, and pre-releases are ordered by channel (`prealpha`, `alpha`, `beta`, `rc`) and then by number.

#### `compare`

```kex
compare(other: SemanticVersion) -> Ordering
```
