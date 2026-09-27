---
id: "guide-0-4-0-beta-4-patterns"
title: "Pattern matching"
description: "Destructure data and handle alternatives explicitly."
path: "/guide/0.4.0-beta.4/patterns/"
draft: false
template: "page"
---
A match selects the first arm whose pattern and guard succeed. `=>` separates a pattern from its result; `->` belongs to function types and return annotations.

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
```

A variable pattern binds the matched value. `_` ignores it. A `when` guard adds a condition after a structural match. Handle every alternative; a broad wildcard is convenient but can conceal a new constructor that deserves its own behavior.

## Destructuring and list patterns

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

A destructuring binding assumes the shape matches. Use a `match` when a value might be empty or have another shape, rather than destructuring unknown input unconditionally.

## Function clauses

```kex
let factorial(0) -> Integer = 1
let factorial(n: Integer) -> Integer = n * factorial(n - 1)
assert(factorial(5) == 120)
```

Clauses are tried in order. This factorial is defined for nonnegative inputs; a production API should reject negative input before recursing. Matching clauses do not automatically establish a domain invariant for every value of the annotated type.

## Conditional extraction

```kex
let selected: String? = Just("Ada")
if let Just(person) = selected
  assert(person == "Ada")
else
  assert(false)
end
```

The extracted name belongs to the successful branch. This is useful when only success needs work; use `match` when both branches produce an important result.

Within `make`, receiver patterns such as `@[]` and `@[first | rest]` match `this` itself. Record patterns can select named fields and nest inside other patterns. Prefer small, readable patterns to a large destructuring expression that hides the decision being made.
