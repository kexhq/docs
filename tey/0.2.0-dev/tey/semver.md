---
package: tey
version: "0.2.0-dev"
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

### `release`

```kex
release(text: String) -> String
```

The release a version belongs to: `0.4.0-rc.1` → `0.4.0`. Used where a pre-release should count as its eventual release.

### `stable?`

```kex
stable?(text: String) -> Bool
```

Whether a version is a full release rather than a pre-release. This is the question a download page asks: "what is the current stable Kex?".

### `satisfies`

```kex
satisfies(versionText: String, requirement: String) -> Bool
```

### `intersect`

```kex
intersect(a: String, b: String) -> String
```

The requirement satisfied only by versions satisfying BOTH, for when two packages in one graph each ask for the same dependency.

Concatenation, because `satisfies` already reads a requirement as a list of space-separated clauses that must ALL hold: `~> 0.1` and `>= 0.1.5` intersect to `~> 0.1 >= 0.1.5`, which is exactly the question "satisfies both". No interval arithmetic, no second implementation of the operators to keep in step with the first.

An empty intersection is not detected here, and deliberately: `~> 0.1 ~> 0.2` is perfectly well formed and simply matches nothing. Emptiness is a fact about the versions a repository actually publishes, so it is discovered where the tags are (`highest`), where the error can also say what WAS available.

### `intersectAll`

```kex
intersectAll(requirements: [String]) -> String
```

Every constraint at once. `[]` and `[""]` both mean "no opinion", which is what a package with no version requirement expresses.

### `versionOf`

```kex
versionOf(ref: String) -> String
```

The version inside a resolved ref: `refs/tags/v0.1.1` and `v0.1.1` both give `0.1.1`. A ref that carries no version (a branch name, a bare commit) gives "", which satisfies nothing and so never claims to meet a range.

### `channelRank`

```kex
channelRank(channel: String) -> Integer
```

Channel precedence, lowest first: prealpha < alpha < beta < rc < release. Plain semver would order these alphabetically — putting `beta` BEFORE `prealpha` — which is not what the words mean, so the ranking is explicit.

### `range?`

```kex
range?(requested: String) -> Bool
```

Whether a requested tag is a RANGE rather than one exact tag. `v1.2.0` is a name to look up; `~> 1.2` is a question to answer against everything the repository has.

### `newer?`

```kex
newer?(a: String, b: String) -> Bool
```

Descending semantic order, for picking the newest of anything. A tag that is not a version sorts after every tag that is, so a stray `nightly` can never displace a release.

### `newestFirst`

```kex
newestFirst(versions: [String]) -> [String]
```

### `highest`

```kex
highest(tags: [String], requirement: String) -> String?
```

The highest tag that satisfies the requirement — the whole point of writing a range instead of a version. None when nothing does.

## record `SemanticVersion`

**Fields**

  - `major` : [Integer](../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `minor` : [Integer](../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `patch` : [Integer](../../../prelude/0.4.0-beta.4-dev/number.md#make-integer)
  - `preRelease` : [String](../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)

Implements `Comparable`.

### Methods

SemanticVersion is Comparable, so `a.compare(b)` answers Less/Equal/Greater like every other ordered type in the stdlib, and ordering reads as an ordering rather than as sign arithmetic on -1/0/1.

#### `compare`

```kex
compare(other: SemanticVersion) -> Ordering
```
