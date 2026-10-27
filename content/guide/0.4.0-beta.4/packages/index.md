---
id: "guide-0-4-0-beta-4-packages"
title: "Packages and tooling"
description: "Create projects, lock dependencies, and build repeatably with Tey."
path: "/guide/0.4.0-beta.4/packages/"
draft: false
template: "page"
---
Use Tey when a program needs multiple source files, dependencies, or repeatable commands. It pairs package operations with the selected Kex toolchain.

## Create a project

```sh
tey new my-app
cd my-app
tey build
tey test
tey run
```

For a library, use `tey new my-library --lib`; for an existing directory, use `tey init` or `tey init --lib`. A library has no executable entry point. Follow the generated layout: declarations under `src/`, specifications under `spec/`, and package metadata in `package.kex`.

## The manifest

This is a **package file**, interpreted by Tey rather than run as an ordinary program:

```text
package "my-library" do
  version("0.1.0")
  description("A small reusable Kex library")
  kex(">= 0.4.0-beta.4")
  license("MIT")
end
```

Set the compiler requirement to a version you actually test. Tey rejects unknown declarations so misspelled manifest fields do not silently disappear.

Use `tey help` to discover commands supported by your installed version. `tey build` compiles the package and `tey test` runs its specs on BEAM. `tey run --interpret` and `tey test --interpret` select the interpreter when needed.

## Dependencies and the lockfile

A Git dependency identifies a repository and version selection. For example:

```sh
tey add greet --git https://github.com/kexhq/greet --tag "~> 0.1"
tey install
```

The manifest holds the constraint; `tey.lock` records the resolved commit and integrity information. Commit the lockfile. Installing a checkout should reproduce its locked dependencies; updating dependencies is an intentional operation with a diff to review and tests to rerun.

A tag constraint selects releases, while a branch or commit selector is useful for deliberate development pins. Before relying on complex dependency graphs, consult the [Tey reference](/tey/) for the resolver behavior of your selected version.

## Project commands

Put repeatable project operations in the manifest. For example, a `command("report", run: "scripts/report.kex", description: "Generate the report")` entry adds `tey report`. A `.kex` entry runs with the selected toolchain and package source roots. A shell command runs as a shell command; its arguments and quoting follow shell rules.

Do not redefine built-in command names such as `test` or `build`. A contributor should be able to use those commands consistently across packages.

## Publish a library

Publishing means making a Git commit reachable under a release tag. Before tagging, run `tey build` and `tey test`, verify public examples, and make the manifest version match the intended tag. Use tags such as `v0.1.0` consistently. Document the dependency declaration in the README, since the repository is the library's distribution page.

These are publishing steps, not commands to run while merely trying the guide. Keep secrets and local build artifacts out of the repository.

## Backend choice

The default BEAM backend supports real networking and BEAM distribution. The interpreter is useful for exploration and checking portable language behavior, but is not a substitute for testing a BEAM service on BEAM. The browser playground runs an interpreter compiled to WebAssembly; it does not mean arbitrary Kex programs compile directly to native browser APIs.
