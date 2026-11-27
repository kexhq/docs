---
id: "guide-0-4-0-beta-4-records"
title: "Records and methods"
description: "Named fields, constructors, receiver methods, and immutable updates."
path: "/guide/0.4.0/records/"
draft: false
template: "page"
---
A record groups named fields into one value. Here an account needs a name, while its points and active status have defaults:

```kex
record Account do
  name : String
  points : Integer = 0
  active? : Bool = true
end

let originalAccount = Account { name: "Ada" }
assert(originalAccount.points == 0)
IO.printLine(originalAccount.points)
```

```output filename="OUTPUT"
0
```

`originalAccount` has zero points even though the constructor supplied only `name`. A caller can set `points` or `active?` explicitly when the defaults are not appropriate.

## Add behavior with `make`

```kex
record Greeter do
  name : String = "Anonymous"
end

make Greeter do
  let greet do
    "Hello, ${@name}!"
  end
end

main do
  let john = Greeter { name = "John" }
  IO.printLine(john.greet)
end
```

Use a `make` block when a function belongs to a particular receiver type. The next example adds a label and two ways to produce an updated account:

```kex
using Units.SI

type CityCoordinate = (String, Float, Float)

make CityCoordinate do
  let distanceTo(other: This) do
    let (myCity, myLat, myLon) = this
    let (yourCity, yourLat, yourLon) = other

    # use Haversine formula over the two coordinates (not shown)
    let result = 1_000 # Haversine.compute(myLat...)

    return result.kilometer
  end
end

main do
  let bp : CityCoordinate = ("Budapest", 17.3, 47.3)
  let cities: [CityCoordinate] = [
     ("Paris", 44.11, 12.11),
     ("London", 12.33, 12.11)
  ]

  let distances = cities.map(&.distanceTo(bp))
end
```



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

`originalAccount.earn(10)` returns an account with ten points. The assertion below it shows that the original still has zero: the method made a new value. Inside `make Account`, `this` is the current account, and `@name` is short for `this.name`. `This` refers to the Account type.

`New { points: ... }` copies the receiver and changes one field. When you need several updates, use the local `new` as `deactivate` does. Each assignment rebuilds and rebinds that local value; returning `new` gives the caller the result.

There is also `This { ... }`, which starts with the record's declared defaults. Choose `New` to preserve fields from the current account and `This` to build a fresh account.

## Update outside a method

You can also build a modified record without a receiver method:

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

`renamed` copies `rewarded` and changes only `name`, so its points remain ten. `editable.points = 25` is possible because `editable` is a `var`; it rebinds that local to the updated record. Spread entries apply from left to right, so a later field wins. For a nested record, rebuild the inner value and then the outer one.

## Constructors in a module

Sometimes callers should use a named way to create a record. A module with the same name can hold those constructors:

```kex
module Account do
  let Guest = Account { name: "guest", active?: false }
  let Named(name: String) -> Account = Account { name: name }
end
assert(Account.Guest.active? == false)
assert(Account.Named("Lin").name == "Lin")
```

`Account.Guest` is a ready-made value. `Account.Named("Lin")` builds a named account. The record defines its fields, the module holds constructors and constants, and the `make` block holds methods on an account value. Module functions have no implicit receiver, so the capitalized constructors stay qualified.

Methods can also define the fixed operators for a type. If you add equality or ordering, make its meaning consistent for every value of that type. The [Traits chapter](../traits/) shows how to share algorithms across types that provide the same operations.
