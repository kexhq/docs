---
id: "413bae5535e0dd6a04a0a01d7c860b869308f7c28bcbce2861fdd498d0c91580"
title: "Either"
path: "/guide/0.4.0/types/either/"
draft: false
template: "page"
---
`Either` is a type which can wrap two differently typed values.

## Shape

Within the Prelude `Either` is defined like this:

```kex
type Either<L, R> = Left(L) | Right(R)
```

Instead of `Just`, `Either` value is wrapped via either the `Left` or the `Right` constructors. These wrap the value exactly the same as `Just` does and just like in `Optional` (since this is also a sum type) only one can be used at the same time.

## Usage

To use it just wrap the values in either the `Left`  or `Right` constructors:

```kex
let oldOrNewId(account: Account) -> Either<Integer, String> do
  if account.old?
    return Left(account.oldId)
  end

  return Right("id-${account.id}")
end
```

Then other functions could pattern match on them:

```kex
doOperation : Either<Integer, String> -> Void
foul doOperation(Left(oldId))  = # ...
foul doOperation(Right(newId)) = # ...\
```

There is a syntactic sugar for `Either` which allows the simplification of working with them, through `or` between the types:

```kex
oldOrNewId : Account -> Integer or String # same as above

doOperation : Integer or String -> Void
```

> [!TIP]
> Technically `Either` could be used as a result type and some languages do use it. However, Kex comes with `Result` which is much better suited for this reason.
