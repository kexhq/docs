---
package: prelude
version: "0.3.1"
source: test.kex
title: Assert
entities:
  - { kind: function, name: "describe" }
  - { kind: function, name: "it" }
  - { kind: function, name: "before" }
  - { kind: function, name: "after" }
  - { kind: function, name: "assert" }
  - { kind: module, name: "Assert" }
---

# Assert

Kex ships a minimal RSpec-style testing DSL: `describe`, `it`, `before`, `after`, and assertion helpers. These are always in scope — no import needed.

A test file typically looks like:

Run with:   kex my_test.kex

Output uses ✓ / ✗ markers and nests by describe depth.

## function `describe`

```kex
describe(label: String, block: Block<Void>) -> Void
```

Groups related test cases under a label. Calls the block immediately. `describe` blocks may be nested. This is a foul function — it prints output.

**Examples**

```kex
describe "String" do
  describe "count" do
    it "returns character count" do
      assert("hello".count == 5)
    end
  end
end
```

## function `it`

```kex
it(label: String, block: Block<Void>) -> Void
```

Defines a single test case. The block is run and any exception thrown inside it (typically a failed `assert`) marks the test failed without aborting the rest of the suite. This is a foul function — it prints output.

**Examples**

```kex
it "returns true for even numbers" do
  assert(2.even?)
  assert(!3.even?)
end
```

## function `before`

```kex
before : Block<Void> -> Void
```

Registers setup for the current group. `before { ... }` and `before(:each) { ... }` run before every test; `before(:all) { ... }` runs once before the group's tests, following RSpec's scope convention.

## function `after`

```kex
after : Block<Void> -> Void
```

Registers cleanup for the current group. `after { ... }` defaults to `:each`; `after(:all) { ... }` runs once when the group finishes. Cleanup is unconditional, and inner per-test hooks run before outer hooks.

## function `assert`

```kex
assert : Bool -> Bool
assert(value: Bool, message: String) -> Bool
```

Throws a runtime error if `value` is falsy, failing the enclosing `it`. The optional `message` is included in the failure output.

**Parameters**

  - `message` — (optional)

**Examples**

```kex
assert(42 == 42)
assert("hello".count == 5, "count should be 5")
```

## module `Assert`

Focused assertions are ordinary Kex stdlib functions layered on the primitive `assert`, so adding another helper does not require compiler or runtime work.

### `equal`

```kex
equal(actual, expected)
```

### `notEqual`

```kex
notEqual(actual, expected)
```

### `truthy`

```kex
truthy(value)
```

### `falsy`

```kex
falsy(value)
```

### `some`

```kex
some(value)
```

### `none`

```kex
none(value)
```

### `ok`

```kex
ok(value)
```

### `error`

```kex
error(value)
```
