---
id: "guide-0-4-0-beta-4-errors"
title: "Optional values and errors"
description: "Represent absence and failure, then choose how to recover."
path: "/guide/0.4.0-beta.4/errors/"
draft: false
template: "page"
---
Use `Optional<A>` when a value might be absent, and `Result<A, E>` when failure carries information. They are ordinary values that can be returned, stored, transformed, and matched.

## Optional values

```kex
let nickname: String? = Just("Ada")
let missingName: String? = None
assert(nickname.map(&.upperCase).or("anonymous") == "ADA")
assert(missingName.or("anonymous") == "anonymous")
assert(nickname.present?)
assert(missingName.none?)
```

`A?` abbreviates `Optional<A>`. `Just(value)` carries a value; `None` carries none. Check `present?` or `none?` when you only need a predicate. Match or transform the optional when you need its payload. Do not use truthiness as an absence test.

`.or(default)` extracts success or supplies a fallback. Its argument is an ordinary argument, so it is evaluated before the call. Use branching when a fallback is expensive or effectful.

## Results

```kex
type PortProblem = NotNumeric | OutsideRange

let parsePort(text: String) -> Result<Integer, PortProblem> do
  match Integer.parse(text) do
    Ok(number) when number >= 1 && number <= 65535 => Ok(number)
    Ok(_) => Error(OutsideRange)
    Error(_) => Error(NotNumeric)
  end
end
assert(parsePort("8080") == Ok(8080))
assert(parsePort("0") == Error(OutsideRange))
assert(parsePort("http") == Error(NotNumeric))
```

A result makes the failure vocabulary part of your interface. Match errors by their constructors or stable fields, rather than by displayed diagnostic text. `ok?` and `error?` check which alternative you have; `.or(default)` also works on results, but discards the error.

Use `map` to transform a successful payload and `flatMap` when the next operation already returns a result or optional. This avoids nesting success wrappers around each other.

## Unwrapping with recovery

`.try` unwraps success and raises the failure payload when there is no success. It is useful when several operations should share a recovery boundary:

```kex
let portDescription(text: String) -> String do
  trying do
    let port = parsePort(text).try
    "port ${port}"
  rescue
    NotNumeric => "enter a number"
    OutsideRange => "enter a port from 1 to 65535"
  end
end
assert(portDescription("8080") == "port 8080")
assert(portDescription("oops") == "enter a number")
```

A function body can also have a `rescue` section. Rescue patterns use the same `=>` spelling as `match`. Catch only failures you can meaningfully handle; a catch-all that replaces every bug with an empty string can make a broken program look successful.

`.try` is not a declaration that a value is safe, and it does not automatically return `Error(...)` from the enclosing function. An unhandled failure aborts that computation. Use explicit result matching at public boundaries when callers should receive a result value.

Failures also arise from invalid operations and failed assertions. Errors-as-values is the normal API style, but it does not mean runtime failures are impossible.
