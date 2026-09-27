---
id: "guide-0-4-0-beta-4-testing"
title: "Testing"
description: "Write executable specifications and replace external inputs."
path: "/guide/0.4.0-beta.4/testing/"
draft: false
template: "page"
---
Tests are ordinary Kex programs using standard-library functions. Save this page's examples as `guide.spec.kex` and run `kex guide.spec.kex`, or use `tey test` inside a package.

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

`describe` groups cases; `it` runs a case and reports failures without stopping the other cases. A failed assertion or an unhandled runtime error fails the case. `Assert.equal`, `Assert.ok`, `Assert.error`, `Assert.some`, and `Assert.none` provide focused checks when their diagnostics are helpful.

Test a meaningful behavior and its boundary: successful parsing plus malformed input, a populated collection plus an empty one, or a successful request plus a timeout. Avoid tests that merely restate the implementation's internal steps.

## Replace external inputs

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

A capability fixture changes what `FS.File` calls observe inside the region, including calls inside helpers. Its lifetime ends with the block. `Mock.Env` similarly replaces environment input.

These fixture records are ordinary values. Stateful `Mock.*` functions are different: they mutate mock state and are gated to spec runs, REPLs, or explicit `--allow-mocks` runs. Use them when a test needs write-then-read behavior, and use hooks for cleanup. Do not enable global mocks in a production entry point.

## Hooks and tooling

`before` and `after` hooks are scoped to their `describe`. Per-case setup runs from outer groups inward; teardown runs from inner groups outward. `before(:all)` and `after(:all)` handle group lifetime.

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
