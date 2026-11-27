---
id: "guide-0-4-0-beta-4-patterns"
title: "Pattern matching"
description: "Destructure data and handle alternatives explicitly."
path: "/guide/0.4.0/patterns/"
draft: false
template: "page"
---
A `match` chooses an action based on a value's shape. In this example, a download is either waiting, complete, or rejected. The rejection case also checks the error code:

```kex
type Download = Waiting | Complete(String) | Rejected(Integer)

let describeDownload(value: Download) -> String do
  match value do
    Waiting => "waiting"
    Complete(path) => "saved to ${path}"
    Rejected(code) when code >= 500 => "server failure"
    Rejected(_) => "request rejected"
  end
end
assert(describeDownload(Complete("report.txt")) == "saved to report.txt")
assert(describeDownload(Rejected(503)) == "server failure")
IO.printLine(describeDownload(Complete("report.txt")))
IO.printLine(describeDownload(Rejected(503)))
```

```output filename="OUTPUT"
saved to report.txt
server failure
```

`Complete(path)` binds the saved path, while `Rejected(_)` ignores a code that the final arm does not need. The `when` guard handles server errors before the more general rejection arm. A match selects the first arm whose pattern and guard succeed. Arms use `=>`; function types and return annotations use `->`.

## Destructuring and list patterns

Patterns can also take a tuple or list apart:

```kex
let (name, score) = ("Ada", 10)
let [head | tail] = [1, 2, 3]
assert(name == "Ada" && score == 10)
assert(head == 1 && tail == [2, 3])

let listShape(values: [Integer]) -> String do
  match values do
    [] => "empty"
    [_] => "one"
    [first | rest] => "${first} followed by ${rest.count}"
  end
end
assert(listShape([]) == "empty")
assert(listShape([4, 5, 6]) == "4 followed by 2")
```

The binding `(name, score)` takes two values from the tuple. `[head | tail]` takes the first list element and leaves the rest in `tail`. Those bindings assume the shape is present. `listShape` uses `match` because its input may be empty, contain one element, or contain several.

## Function clauses

A function can place a pattern directly in its parameter list. Kex tries the clauses in order:

```kex
let factorial(0) -> Integer = 1
let factorial(n: Integer) -> Integer = n * factorial(n - 1)
assert(factorial(5) == 120)
```

The first clause stops recursion at zero; the second multiplies `n` by the result for `n - 1`. `factorial(5)` therefore returns `120`. This version needs a nonnegative input. An `Integer` annotation alone does not exclude negative values, so check that boundary when accepting user input.

## Conditional extraction

Use `if let` when you only need to continue if a value has one particular form:

```kex
let selected: String? = Just("Ada")
if let Just(person) = selected
  assert(person == "Ada")
else
  assert(false)
end
```

`Just(person)` succeeds for the selected name and binds `person` inside that branch. The `else` branch would run for `None`. Use a full `match` when both cases need substantial work or produce a result.

Within a `make` block, `@[]` matches an empty receiver list and `@[first | rest]` matches a nonempty one. Record patterns can select named fields, including fields inside another pattern. Use a small pattern for each decision so readers can see which form is being handled.
