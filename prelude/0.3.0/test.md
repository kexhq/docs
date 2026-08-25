---
package: prelude
version: "0.3.0"
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

Kex ships a minimal RSpec-style testing DSL: `describe`, `it`, `before`, `after`, and assertion helpers. These are always in scope — no import needed.

A test file typically looks like:

    it "multiplies numbers" do       assert(3 * 4 == 12, "expected 12")     end   end

Run with:   kex my_test.kex

Output uses ✓ / ✗ markers and nests by describe depth.

Groups related test cases under a label. Calls the block immediately. `describe+ blocks may be nested. This is a foul function — it prints output.


```kex
describe : String -> Block<Void> -> Void
```


## function `it`

Defines a single test case. The block is run and any exception thrown inside it (typically a failed `assert`) marks the test failed without aborting the rest of the suite. This is a foul function — it prints output.


```kex
it : String -> Block<Void> -> Void
```


## function `before`

Registers setup for the current group. `before { ... }` and `before(:each) { ... }` run before every test; `before(:all) { ... }` runs once before the group's tests, following RSpec's scope convention.


```kex
before : Block<Void> -> Void
```


## function `after`

Registers cleanup for the current group. `after { ... }` defaults to `:each`; `after(:all) { ... }` runs once when the group finishes. Cleanup is unconditional, and inner per-test hooks run before outer hooks.


```kex
after : Block<Void> -> Void
```


## function `assert`

Throws a runtime error if `value` is falsy, failing the enclosing `it`. The optional `message` is included in the failure output.


```kex
assert : Bool -> Bool
assert : Bool -> String -> Bool
```


## module `Assert`

Focused assertions are ordinary Kex stdlib functions layered on the primitive `assert`, so adding another helper does not require compiler or runtime work.

## function `equal`


```kex
equal(actual, expected)
```


## function `notEqual`


```kex
notEqual(actual, expected)
```


## function `truthy`


```kex
truthy(value)
```


## function `falsy`


```kex
falsy(value)
```


## function `some`


```kex
some(value)
```


## function `none`


```kex
none(value)
```


## function `ok`


```kex
ok(value)
```


## function `error`


```kex
error(value)
```

