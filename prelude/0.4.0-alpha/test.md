---
package: prelude
version: "0.4.0-alpha"
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

## function `describe`

The built-in testing DSL: `describe`, `it`, `before`, `after`, and assertion helpers.

Everything here is always in scope: no import, and no separate test runner. Write a test file and run it with `kex`:

```kex
describe "arithmetic" do
  it "adds numbers" do
    assert(1 ` 1 == 2)
  end

  it "multiplies numbers" do
    Assert.equal(3 * 4, 12)
  end
end

$ kex my_test.kex
arithmetic
  ✓ adds numbers
  ✓ multiplies numbers
```

Output uses ✓ / ✗ markers and nests by `describe` depth. A failing `assert` marks its test failed and moves on; the rest of the suite still runs.

A file named `<name>.spec.kex` automatically loads the declarations of `<name>.kex` beside it, so a spec needs no import and no `main` wrapper.

Groups related test cases under a label, and runs them.

The block is called immediately. `describe+ blocks nest, and the output is indented to match. This is a foul function: it prints.


```kex
describe : String -> Block<Void> -> Void
```


## function `it`

Defines a single test case, and runs it.

The block runs, and anything thrown inside it: typically a failed `assert`: marks the test failed without aborting the rest of the suite. This is a foul function: it prints.


```kex
it : String -> Block<Void> -> Void
```


## function `before`

Registers setup to run before the current group's tests.

`before { ... }` and `before(:each) { ... }` run before every test in the group; `before(:all) { ... }` runs once before the group's first test, following RSpec's scope convention.


```kex
before : Block<Void> -> Void
before : Atom -> Block<Void> -> Void
```


## function `after`

Registers cleanup to run after the current group's tests.

Defaults to `:each`. Cleanup is unconditional: it runs whether the test passed or failed, and inner per-test hooks run before outer hooks.


```kex
after : Block<Void> -> Void
after : Atom -> Block<Void> -> Void
```


## function `assert`

Fails the enclosing `it` when `value` is falsy.

The primitive every other assertion is built on. Prefer the `Assert` helpers where one fits: they report what was expected and what arrived, which a bare `assert` cannot.


```kex
assert : Bool -> Bool
assert : Bool -> String -> Bool
```


## module `Assert`

Focused assertions, each reporting what was expected and what arrived.

These are ordinary Kex stdlib functions layered on the primitive `assert`, so adding another helper does not require compiler or runtime work.

```kex
Assert.equal("hi".upperCase, "HI")
Assert.some(users.first)
Assert.ok(Integer.parse("42"))
```

## function `equal`

Fails unless `actual` equals `expected`, reporting both.

The assertion to reach for by default: a failure tells you what arrived, which `assert(a == b)` does not.


```kex
equal(actual, expected)
```


## function `notEqual`

Fails when `actual` equals `expected`.


```kex
notEqual(actual, expected)
```


## function `truthy`

Fails unless `value` is truthy: anything except `false`, `None` and `()`.


```kex
truthy(value)
```


## function `falsy`

Fails unless `value` is falsy: `false`, `None` or `()`.


```kex
falsy(value)
```


## function `some`

Fails unless `value` is a `Just`.


```kex
some(value)
```


## function `none`

Fails unless `value` is `None`.


```kex
none(value)
```


## function `ok`

Fails unless `value` is an `Ok`.


```kex
ok(value)
```


## function `error`

Fails unless `value` is an `Error`.


```kex
error(value)
```

