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

### `packageManager`

```kex
packageManager : String
```

The machine Tey runs on, as far as telling someone how to fix it goes: which package manager installs what is missing. Tey never runs these commands — installing system packages needs privileges Tey should not ask for — it only prints the one line that does it, so the advice is exact rather than "install GMP somehow".

The package manager this system uses: "brew", "apt", "dnf", "pacman", or "" when it cannot be told. Linux is judged by /etc/os-release's ID plus everything ID_LIKE names, which is what gives Linux Mint and Pop!_OS Ubuntu's answer.

### `installCommand`

```kex
installCommand(manager: String, packages: [String]) -> String?
```

The command installing `packages` with this system's package manager, or None when there is no manager to name. Package names differ between managers, so the caller passes the right list for `packageManager`.

### `librariesHint`

```kex
librariesHint : String
```

The shared libraries a released Kex binary loads: readline, GMP, PCRE2 and (on Linux) OpenSSL 3. Checked against each distro's own package names.

### `gitHint`

```kex
gitHint : String
```

Git: Tey lists Kex releases and fetches every Git dependency with it.
