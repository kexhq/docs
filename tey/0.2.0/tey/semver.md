---
package: tey
version: "0.2.0"
source: tey/semver.kex
title: Tey.Semver
entities:
  - { kind: module, name: "Tey.Semver" }
---

# Tey.Semver

## module `Tey.Semver`

## record `SemanticVersion`

**Fields**

  - `major` : Integer
  - `minor` : Integer
  - `patch` : Integer
  - `preRelease` : String (optional)

## make `SemanticVersion` implements Comparable

SemanticVersion is Comparable, so `a.compare(b)` answers Less/Equal/Greater like every other ordered type in the stdlib, and ordering reads as an ordering rather than as sign arithmetic on -1/0/1.


#### `compare`

```kex
compare(other)
```

## function `parseVersion`


```kex
parseVersion(text)
```


## function `release`

The release a version belongs to: `0.4.0-rc.1` → `0.4.0`. Used where a pre-release should count as its eventual release.


```kex
release(text)
```


## function `stable?`

Whether a version is a full release rather than a pre-release. This is the question a download page asks: "what is the current stable Kex?".


```kex
stable?(text)
```


## function `satisfies`


```kex
satisfies(versionText, requirement)
```


## function `intersect`

The requirement satisfied only by versions satisfying BOTH, for when two packages in one graph each ask for the same dependency.

Concatenation, because `satisfies` already reads a requirement as a list of space-separated clauses that must ALL hold: `~> 0.1` and `>= 0.1.5` intersect to `~> 0.1 >= 0.1.5`, which is exactly the question "satisfies both". No interval arithmetic, no second implementation of the operators to keep in step with the first.

An empty intersection is not detected here, and deliberately: `~> 0.1 ~> 0.2` is perfectly well formed and simply matches nothing. Emptiness is a fact about the versions a repository actually publishes, so it is discovered where the tags are (`highest`), where the error can also say what WAS available.


```kex
intersect(a, b)
```


## function `intersectAll`

Every constraint at once. `[]` and `[""]` both mean "no opinion", which is what a package with no version requirement expresses.


```kex
intersectAll(requirements)
```


## function `versionOf`

The version inside a resolved ref: `refs/tags/v0.1.1` and `v0.1.1` both give `0.1.1`. A ref that carries no version (a branch name, a bare commit) gives "", which satisfies nothing and so never claims to meet a range.


```kex
versionOf(ref)
```


## function `channelRank`

Channel precedence, lowest first: prealpha < alpha < beta < rc < release. Plain semver would order these alphabetically — putting `beta` BEFORE `prealpha` — which is not what the words mean, so the ranking is explicit.


```kex
channelRank(channel)
```


## function `range?`

Whether a requested tag is a RANGE rather than one exact tag. `v1.2.0` is a name to look up; `~> 1.2` is a question to answer against everything the repository has.


```kex
range?(requested)
```


## function `newer?`

Descending semantic order, for picking the newest of anything. A tag that is not a version sorts after every tag that is, so a stray `nightly` can never displace a release.


```kex
newer?(a, b)
```


## function `newestFirst`


```kex
newestFirst(versions)
```


## function `highest`

The highest tag that satisfies the requirement — the whole point of writing a range instead of a version. None when nothing does.


```kex
highest(tags, requirement)
```

