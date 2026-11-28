---
package: prelude
version: "0.4.0-rc.5-dev"
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

The built-in test functions: `describe`, `it`, `before`, `after` and the assertions.

They are always in scope and need no separate runner. Write a test file and run it with `kex`:

```kex
describe "arithmetic" do
  it "adds numbers" do
    assert(1 + 1 == 2)
  end

  it "multiplies numbers" do
    Assert.equal(3 * 4, 12)
  end
end

$ kex my_test.kex
arithmetic
  ✓ adds numbers
  ✓ multiplies numbers

2 passed, 0 failed
```

Output is indented by `describe` depth. The first failing assertion ends its test and marks it failed; the other tests still run.

A file named `<name>.spec.kex` loads the declarations of `<name>.kex` beside it, so a spec needs no import.

## function `describe`

```kex
describe(label: String, block: Block<Result<Void, Any>>) -> Void
```

Groups related test cases under a label and runs them.

The block runs at once. `describe` blocks nest, and the output is indented to match.

**Parameters**

  - `label` — what this group is about
  - `block` — the tests, and any nested groups

**Examples**

```kex
describe "String" do
  describe "count" do
    it "returns the character count" do
      assert("hello".count == 5)
    end
  end
end
```

## function `it`

```kex
it(label: String, block: Block<Result<Void, Any>>) -> Void
```

Defines a single test case and runs it.

A failed assertion, or anything else that fails inside the block, marks the test failed and the rest of the suite carries on. A `.try` that fails in the block fails the test too, so the body needs no `Ok` or `rescue`.

**Parameters**

  - `label` — what this case establishes, phrased as a claim
  - `block` — the case body

**Examples**

```kex
it "returns true for even numbers" do
  assert(2.even?)
  assert(!3.even?)
end
```

_One behaviour per case_

```kex
it "trims leading whitespace" do
  Assert.equal("  hi".trim, "hi")
end

it "trims trailing whitespace" do
  Assert.equal("hi  ".trim, "hi")
end
```

## function `before`

```kex
before(block: Block<Result<Void, Any>>) -> Void
before(block: Atom) -> Block<Result<Void, Any>> -> Void
```

Registers setup to run before the current group's tests.

`before { ... }` and `before(:each) { ... }` run before every test in the group; `before(:all) { ... }` runs once before the group's first test, following RSpec's scope convention.

**Parameters**

  - `block` — the setup to run

**Examples**

```kex
describe "the parser" do
  before do
    Mock.FS.File("input.txt", "one\ntwo\n")
  end

  it "reads two lines" do
    Assert.equal(FS.File.readLines("input.txt").or([]).count, 2)
  end
end
```

## function `after`

```kex
after(block: Block<Result<Void, Any>>) -> Void
after(block: Atom) -> Block<Result<Void, Any>> -> Void
```

Registers cleanup to run after the current group's tests.

Runs after every test, whether it passed or failed. Inner groups' hooks run before outer ones.

**Parameters**

  - `block` — the cleanup to run

**Examples**

```kex
after do
  FS.File.delete("tmp/out.txt")
end
```

## function `assert`

```kex
assert(value: Bool) -> Bool
assert(value: Bool) -> String -> Bool
```

Fails the enclosing `it` when `value` is `false`.

The `Assert` functions are built on it. Prefer them where one fits, since their failure message shows the values involved.

**Parameters**

  - `value` — the condition that must hold

**Returns**: the value, when it held

**Examples**

```kex
assert(42 == 42)
assert("hello".count == 5)
```

## module `Assert`

Assertions whose failure message shows what was expected and what arrived. They are written in Kex on top of `assert`.

```kex
Assert.equal("hi".upperCase, "HI")
Assert.some(users.first)
Assert.ok(Integer.parse("42"))
```

### `equal`

```kex
equal(actual: A, expected: A) -> Bool
```

Fails unless `actual` equals `expected`, reporting both.

Use it by default for comparisons: unlike `assert(a == b)`, a failure shows both values.

**Parameters**

  - `actual` — the value produced
  - `expected` — the value it should equal

**Returns**: `true` when they are equal

**Examples**

```kex
Assert.equal("hi".upperCase, "HI")
Assert.equal([1, 2, 3].sum, 6)
Assert.equal(config.get(:port), Just(8080))
```

### `notEqual`

```kex
notEqual(actual: A, expected: A) -> Bool
```

Fails when `actual` equals `expected`.

**Parameters**

  - `actual` — the value produced
  - `expected` — the value it should differ from

**Returns**: `true` when they differ

**Examples**

```kex
Assert.notEqual(newId, oldId)
```

### `truthy`

```kex
truthy(value: Truthyable) -> Bool
```

Fails unless `value` is truthy: anything except `false` and `None`.

**Parameters**

  - `value` — the value to test

**Returns**: `true` when the value is truthy

**Examples**

```kex
Assert.truthy("hello".contains?("ell"))
```

### `falsy`

```kex
falsy(value: Truthyable) -> Bool
```

Fails unless `value` is falsy: `false`, `None` or `()`.

**Parameters**

  - `value` — the value to test

**Returns**: `true` when the value is falsy

**Examples**

```kex
Assert.falsy([].any? { |x| x > 0 })
```

### `some`

```kex
some(value: A?) -> Bool
```

Fails unless `value` is a `Just`.

**Parameters**

  - `value` — the optional to test

**Returns**: `true` when a value is present

**Examples**

```kex
Assert.some([1, 2].first)
Assert.some(config.get(:host))
```

### `none`

```kex
none(value: A?) -> Bool
```

Fails unless `value` is `None`.

**Parameters**

  - `value` — the optional to test

**Returns**: `true` when there is no value

**Examples**

```kex
Assert.none([].first)
Assert.none("abc".to(Integer))
```

### `ok`

```kex
ok(value: Result<A, E>) -> Bool
```

Fails unless `value` is an `Ok`.

**Parameters**

  - `value` — the result to test

**Returns**: `true` when the result succeeded

**Examples**

```kex
Assert.ok(Integer.parse("42"))
```

### `error`

```kex
error(value: Result<A, E>) -> Bool
```

Fails unless `value` is an `Error`.

**Parameters**

  - `value` — the result to test

**Returns**: `true` when the result failed

**Examples**

```kex
Assert.error(Integer.parse("4x"))
```
