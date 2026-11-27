---
id: "guide-0-4-0-beta-4-testing"
title: "Testing"
description: "Write executable specifications and replace external inputs."
path: "/guide/0.4.0/testing/"
draft: false
template: "page"
---
A test checks what a program does for a chosen input. Kex specifications use ordinary functions and assertions, grouped into named cases. Save this page's examples as `guide.spec.kex` and run `kex guide.spec.kex`, or use `tey test` inside a package.

## Test behavior

```kex
let normalizeName(text: String) -> String = text.trim.lowerCase

describe("normalizeName") do
  it("trims and lowercases") do
    assert(normalizeName("  ADA  ") == "ada")
  end
  it("preserves an empty name as empty") do
    assert(normalizeName("   ") == "")
  end
end
```

The first case checks a name with spaces and uppercase letters; the second checks an empty result. `describe` groups the cases, and `it` runs each one. A failed assertion or unhandled runtime error fails its case. `Assert.equal`, `Assert.ok`, `Assert.error`, `Assert.some`, and `Assert.none` provide more focused diagnostics when needed.

Test a meaningful behavior and its boundary: successful parsing plus malformed input, a populated collection plus an empty one, or a successful request plus a timeout. Avoid tests that merely restate the implementation's internal steps.

## Replace external inputs

The first test used only strings. To test a function that reads a file, provide a controlled file implementation for its call:

```kex
foul loadName(path: String) -> String = normalizeName(FS.File.read(path).try)

describe("loadName") do
  it("uses the file contents") do
    with FS.File = Mock.Files { files: { "name.txt": "  ADA  " } } do
      assert(loadName("name.txt") == "ada")
    end
  end
  it("reports whether a fixture exists") do
    with FS.File = Mock.Files { files: {} } do
      assert(!FS.File.exists?("missing.txt"))
    end
  end
end
```

The fixture gives `loadName` a file containing `"  ADA  "`, so the function returns `"ada"`. The second fixture contains no files and checks the missing case. Calls inside helpers see the replacement too, and the original file implementation returns when the `with` block ends. `Mock.Env` works similarly for environment variables.

These fixture records are ordinary values. Stateful `Mock.*` functions are different: they mutate mock state and are gated to spec runs, REPLs, or explicit `--allow-mocks` runs. Use them when a test needs write-then-read behavior, and use hooks for cleanup. Do not enable global mocks in a production entry point.

## Hooks and tooling

When several cases need the same setup, put it in a `before` hook. Use `after` for cleanup. Both belong to their `describe` group. Per-case setup runs from outer groups inward and cleanup runs in the other direction. `before(:all)` and `after(:all)` run once for a group.

In a package:

```sh
tey test
tey test spec/example.spec.kex
tey test spec/example.spec.kex --only "group > case"
tey test spec/example.spec.kex --json
tey test spec/example.spec.kex --list
```

The compiler equivalents are `--test-only`, `--test-json`, and `--test-list`. Listing skips case bodies, but top-level code and group registration still execute. Keep destructive setup inside appropriately scoped test bodies or hooks.

A sibling `name.spec.kex` can load declarations from `name.kex` without running its demonstration `main`. Package tests should normally import the public module they exercise and run through Tey so dependency source roots are available.
