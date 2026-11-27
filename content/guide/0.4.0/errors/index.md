---
id: "guide-0-4-0-beta-4-errors"
title: "Optional values and errors"
description: "Represent absence and failure, then choose how to recover."
path: "/guide/0.4.0/errors/"
draft: false
template: "page"
---
A lookup might find no value, while a parser might know why it failed. Kex represents these cases with `Optional<A>` and `Result<A, E>`. Both are ordinary values that you can return, store, transform, or match.

## Optional values

The following values show a present name and a missing name:

```kex
let nickname: String? = Just("Ada")
let missingName: String? = None
assert(nickname.map(&.upperCase).or("anonymous") == "ADA")
assert(missingName.or("anonymous") == "anonymous")
assert(nickname.present?)
assert(missingName.none?)
IO.printLine(nickname.map(&.upperCase).or("anonymous"))
IO.printLine(missingName.or("anonymous"))
```

```output filename="OUTPUT"
ADA
anonymous
```

`A?` is short for `Optional<A>`. `Just("Ada")` contains a name, while `None` does not. The first assertion transforms the name to uppercase and extracts `"ADA"`; the second uses `"anonymous"` because the name is missing. Use `present?` or `none?` when you need only a yes-or-no check. Use `match` or a transformation when you need the contained value.

`.or(default)` takes the present value or supplies a fallback. The fallback is an ordinary argument and is evaluated before the call, even when it is not needed. If producing it is expensive or effectful, branch explicitly.

## Results

When a failure needs a reason, return a `Result`. Here a port can fail because its text is not a number or because the number is outside the allowed range:

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

`parsePort("8080")` is `Ok(8080)`. Zero is a number but is outside this function's range, so it produces `Error(OutsideRange)`. `"http"` is not numeric, so it produces `Error(NotNumeric)`. Those named errors tell callers what went wrong without making them inspect diagnostic text.

Use `ok?` and `error?` when you only need to know which alternative you have. `.or(default)` can provide a value, but it discards the error reason.

Use `map` when a successful payload needs a plain transformation. Use `flatMap` when that transformation itself returns an optional or result. Otherwise you would end up with one wrapper nested inside another.

## Unwrapping with recovery

`.try` takes the value out of `Ok` and raises the error when there is no success. `trying` provides a place to handle that error:

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

`portDescription("8080")` returns `"port 8080"`; `portDescription("oops")` returns `"enter a number"`. The rescue arms use the same `=>` spelling as `match`. A function body can also have a `rescue` section. Handle errors for which you can give a meaningful response.

An unhandled `.try` failure stops the current computation; it does not automatically turn the enclosing function's return value into `Error(...)`. At a public boundary where the caller should receive a result, match the result and return an explicit value.

Failures also arise from invalid operations and failed assertions. Errors-as-values is the normal API style, but it does not mean runtime failures are impossible.
