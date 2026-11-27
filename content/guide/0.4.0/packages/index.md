---
id: "guide-0-4-0-beta-4-packages"
title: "Packages and tooling"
description: "Create projects, lock dependencies, and build repeatably with Tey."
path: "/guide/0.4.0/packages/"
draft: false
template: "page"
---
A single `.kex` file is enough for the first programs in this guide. When you add files, dependencies, or tests, Tey gives them a project layout and repeatable commands. It also selects the matching Kex toolchain.

## Create a project

```sh
tey new my-app
cd my-app
tey build
tey test
tey run
```

`tey new my-app` creates the project, then `build`, `test`, and `run` work inside it. For a library, use `tey new my-library --lib`; an existing directory can use `tey init` or `tey init --lib`. Put source under `src/`, tests under `spec/`, and package metadata in `package.kex`.

## The manifest

The manifest tells Tey what the project is and which compiler versions it accepts:

This is a **package file**, interpreted by Tey rather than run as an ordinary program:

```text
package "my-library" do
  version("0.1.0")
  description("A small reusable Kex library")
  kex(">= 0.4.0")
  license("MIT")
end
```

The package is named `my-library`, has version `0.1.0`, and asks for Kex 0.4.0 or newer. Set that requirement to a version you have tested. Tey rejects unknown declarations, so a misspelled field does not silently disappear.

Use `tey help` to discover commands supported by your installed version. `tey build` compiles the package and `tey test` runs its specs on BEAM. `tey run --interpret` and `tey test --interpret` select the interpreter when needed.

## Dependencies and the lockfile

When a project uses another package, declare where Tey should get it:

A Git dependency identifies a repository and version selection. For example:

```sh
tey add greet --git https://github.com/kexhq/greet --tag "~> 0.1"
tey install
```

`tey add` records the version constraint in the manifest, and `tey install` resolves it. `tey.lock` records the chosen commit and integrity information. Commit that file so another checkout can install the same versions. Review a lockfile diff when intentionally updating dependencies.

A tag constraint selects releases, while a branch or commit selector is useful for deliberate development pins. Before relying on complex dependency graphs, consult the [Tey reference](/tey/) for the resolver behavior of your selected version.

## Project commands

Put repeatable project operations in the manifest. For example, a `command("report", run: "scripts/report.kex", description: "Generate the report")` entry adds `tey report`. A `.kex` entry runs with the selected toolchain and package source roots. A shell command runs as a shell command; its arguments and quoting follow shell rules.

Do not redefine built-in command names such as `test` or `build`. A contributor should be able to use those commands consistently across packages.

## Publish a library

Publishing means making a Git commit reachable under a release tag. Before tagging, run `tey build` and `tey test`, verify public examples, and make the manifest version match the intended tag. Use tags such as `v0.1.0` consistently. Document the dependency declaration in the README, since the repository is the library's distribution page.

These are publishing steps, not commands to run while merely trying the guide. Keep secrets and local build artifacts out of the repository.

## Backend choice

The default BEAM backend supports real networking and BEAM distribution. The interpreter is useful for exploration and checking portable language behavior, but is not a substitute for testing a BEAM service on BEAM. The browser playground runs an interpreter compiled to WebAssembly; it does not mean arbitrary Kex programs compile directly to native browser APIs.
