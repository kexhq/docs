---
id: "guide-0-4-0-beta-4-records"
title: "Records and methods"
description: "Named fields, constructors, receiver methods, and immutable updates."
path: "/guide/0.4.0-beta.4/records/"
draft: false
template: "page"
---
A record groups named fields into a value. Required fields must be supplied; defaults let callers omit fields whose initial value is conventional.

```kex
record Account do
  name : String
  points : Integer = 0
  active? : Bool = true
end

let originalAccount = Account { name: "Ada" }
assert(originalAccount.points == 0)
```

## Add behavior with make

```kex
make Account do
  let label -> String = "${@name}: ${@points}"
  let earn(amount: Integer) -> Account = New { points: @points + amount }

  let deactivate -> Account do
    new.active? = false
    new.points = 0
    return new
  end
end

let rewarded = originalAccount.earn(10)
assert(rewarded.points == 10)
assert(originalAccount.points == 0)
assert(rewarded.deactivate.active? == false)
```

Inside `make Account`, `this` is the current Account value and `This` denotes its type. `@name` abbreviates `this.name`. `New { ... }` copies the receiver and replaces the specified fields.

For several updates, the implicit local `new` starts as the receiver. Assigning `new.points` rebuilds and rebinds that local value. Return it to expose the updated record.

`This { ... }` starts from the record's declared defaults, not the receiver's current fields. Use `New` when you mean an update, and `This` when you mean a fresh construction.

## Update outside a method

```kex
foul demonstrateRecords1() do
  let renamed = Account { ...rewarded, name: "Grace" }
  var editable = Account { name: "Ada", points: 10 }
  editable.points = 25
  assert(renamed.name == "Grace")
  assert(renamed.points == 10)
  assert(editable.points == 25)
  assert(rewarded.points == 10)
end
demonstrateRecords1()
```

Spread entries apply left to right. A later field overrides an earlier spread. Direct field assignment requires a mutable binding and replaces its value. For nested updates, rebuild the inner record and then the outer one; do not assume a chain such as `account.profile.name = ...` is supported.

## Type-level constructors

```kex
module Account do
  let Guest = Account { name: "guest", active?: false }
  let Named(name: String) -> Account = Account { name: name }
end
assert(Account.Guest.active? == false)
assert(Account.Named("Lin").name == "Lin")
```

The same name can have a `record` for data, a `module` for constructors and constants, and a `make` block for instance behavior. Module functions have no implicit receiver. Capitalized constructors remain qualified, such as `Account.Named(...)`.

Methods can overload the fixed operators when that gives the type a clear meaning. Keep equality and ordering consistent; use [traits](../traits/) when shared algorithms need a contract.
