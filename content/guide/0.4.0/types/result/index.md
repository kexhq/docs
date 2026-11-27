---
id: "e27130a6b444525342272265038f2f4d3e8254839575c7420f368f3dfaf99689"
title: "Result"
path: "/guide/0.4.0/types/result/"
draft: false
template: "page"
---
`Result` is a sibling of `Optional`. It is defined and works very similarly, but instead of being defined to only wrap one value it can also wrap an error.

## Shape

Within the standard library, `Result` is defined like this:

```kex
# In the prelude:
type Result<T, E> = Ok(T) | Error(E)
```

Instead of `Just`, the `Result`'s value is wrapped via the `Ok` constructor. It wraps the value exactly the same as `Just` does. Moreover, it also has an `Error` constructor which can wrap the error.

## Usage

Let's say we want to convert a string to a number. This operation can fail in many ways (empty input, non-number input, etc), so its errors must be handled appropriately:

```kex
main do
  let r1 = Integer.parse("1337") # => Ok(1337)
  IO.printLine(r1)

  let r2 = Integer.parse("5 EUR") # => Error(ParseError { input: "5 EUR", message: "trailing characters after integer", position: 1, rest: " EUR", value: 5 }) : Result<Integer, ParseError>
end
```

When the conversion is successful, the returned value will be wrapped in the `Ok(T)` constructor. This fact can be then checked in many ways, similarly to `Optional<T>`.

### Using pattern-matching

Normal pattern matching works with both of `Result`'s constructors:

```kex
printParsed : Result<Integer, ParseError> -> Void
foul printParsed(Ok(n))    = IO.printLine("The parsed number is: ${n}")
foul printParsed(Error(_)) = IO.printError("Not a number :(")

main do
  printParsed(Integer.parse("1337"))
end
```

One other way is to pattern-match in the `if let` condition:

```kex
main do
  if let Ok(n) = Integer.parse("1337")
    IO.printLine("The parsed number is: ${n}")
  else
    IO.printLine("Not a number :(")
  end
end
```

```text filename="OUTPUT"
The parsed number is: 1337
```

If the pattern match fails the `else` branch will be executed. This branch is optional, so omitting will work, too:

```kex
main do
  if let Ok(n) = Integer.parse("1337")
    IO.printLine("The parsed number is: ${n}")
  end
end
```

```text filename="OUTPUT"
The parsed number is: 1337
```

If the condition cannot be matched, no code will run.

### Using predicate functions

The `ok?` and `error?` predicates can also be used for checking validity of the computation:

```kex
main do
  let r = Integer.parse("1337")
  if r.ok?
    IO.printLine("The parsed number is: ${r.try}")
  end
end
```

Since, `ok?` is only true

```kex
let parseDigit(ch: Char) -> Result<Integer, String> do
  let isDigit = ch.in?('0'..'9')  # ch.digit? would also work

  return Error("'${ch}' is not a digit") if !isDigit
  return Ok(ch.codepoint - '0'.codepoint)
end
```
