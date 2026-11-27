---
package: tey
version: "0.2.1-dev"
source: tey/host.kex
title: Tey.Host
entities:
  - { kind: module, name: "Tey.Host" }
---

# Tey.Host

## module `Tey.Host`

### `packageManager` (foul)

```kex
packageManager -> String
```

Finds the system's package manager, so Tey can print the exact command that installs something missing. Tey never runs these commands itself, since installing system packages needs privileges it should not ask for.

Returns the package manager this system uses: "brew", "apt", "dnf", "pacman", or "" when it cannot be told. On Linux it goes by `ID` and `ID_LIKE` in `/etc/os-release`, so derivatives such as Linux Mint and Pop!_OS get Ubuntu's answer.

### `installCommand` (foul)

```kex
installCommand(manager: String, packages: [String]) -> String?
```

Returns the command that installs `packages` with `manager`, or `None` for an unknown manager. Package names differ between managers, so the caller passes the names for that manager.

### `librariesHint` (foul)

```kex
librariesHint -> String
```

Returns how to install the shared libraries a released Kex binary loads: readline, GMP, PCRE2 and, on Linux, OpenSSL 3, under each distribution's own package names. Without a known package manager it names the libraries.

### `gitHint` (foul)

```kex
gitHint -> String
```

Returns how to install Git, which Tey uses to list Kex releases and to fetch Git dependencies.
