---
id: "guide-0-4-0-beta-4-kex-vs-haskell"
title: "Kex vs Haskell"
description: "Translate functional ideas while accounting for evaluation and effect differences."
path: "/guide/0.4.0/kex-vs-haskell/"
draft: false
template: "page"
---
If you know Haskell, Kex's pure functions and pattern matching will look familiar. The examples below show where the translation changes: ordinary Kex calls evaluate eagerly, named functions need an explicit capture when passed as values, and effectful functions use `foul`.

This page targets Kex 0.4.0 and the conventional Haskell language model. GHC extensions can add capabilities beyond the baseline described here. Haskell's defining features include non-strict evaluation and polymorphic static types. [Haskell language report](https://www.haskell.org/onlinereport/intro.html)

## At a glance

| Idea | Haskell | Kex |
| --- | --- | --- |
| Ordinary evaluation | Non-strict | Eager; explicit streams provide laziness |
| Function application | `add 2 3`; partial application is ordinary application | `add(2, 3)`; capture or partially apply with `~add(2)` |
| Absence | `Maybe a`: `Just a` or `Nothing` | `Optional<A>` or `A?`: `Just(A)` or `None` |
| Reported failure | Often `Either e a` | Commonly `Result<A, E>` |
| Effects | Actions represented by types such as `IO a` | Effectful functions declared with `foul` |
| Shared behavior | Type classes and instances | Traits and `make` implementations |
| Text | Prelude `String` is a character list | `String` and `[Char]` are distinct |

Haskell type classes and Kex traits both describe shared behavior, but their resolution rules are not identical. Read the [Traits chapter](../traits/) for Kex's contracts and receiver dispatch. [Haskell class tutorial](https://www.haskell.org/tutorial/classes.html)

## Transforming a collection

In Haskell:

```haskell
squaresOfEvens :: [Integer] -> [Integer]
squaresOfEvens xs = map (\n -> n * n) (filter even xs)

example :: [Integer]
example = squaresOfEvens [1, 2, 3, 4] -- [4, 16]
```

In Kex using standalone type declarations:

```kex
squaresOfEvens : [Integer] -> [Integer]
let squaresOfEvens(values) do
  values.filter { |n| n % 2 == 0 }.map { |n| n * n }
end

assert(squaresOfEvens([1, 2, 3, 4]) == [4, 16])
```

Separate declarations are also useful when several function clauses share one type. For example:

```kex
factorial : Integer -> Integer
let factorial(1) = 1
let factorial(n) = n * factorial(n - 1)
```

The collection function itself can be written on one line:

```kex
squaresOfEvens : [Integer] -> [Integer]
let squaresOfEvens(values) = values.filter { |n| n % 2 == 0 }.map { |n| n * n }
```

Or put its parameter and return types in the definition:

```kex
let squaresOfEvens(values: [Integer]) -> [Integer] do
  values.filter { |n| n % 2 == 0 }.map { |n| n * n }
end
```

Both versions return `[4, 16]`. The Kex chain reads in traversal order: filter first, then map. UFCS lets the value before a dot supply the first argument. The list pipeline is eager. For an unbounded sequence, choose a stream and bound consumption:

```kex
let naturals = Stream.Sequence(from: 0) { |n| n + 1 }
assert(naturals.map { |n| n * n }.take(4) == [0, 1, 4, 9])
```

The first four values of this stream are `[0, 1, 4, 9]`. A stream lets you work with an unbounded sequence as long as you bound what you consume. A normal Kex list is built eagerly, so an infinite Haskell list cannot be translated to an ordinary list. [Haskell function evaluation](https://www.haskell.org/tutorial/functions.html)

## Capturing and partially applying functions

Haskell's `map (add 10) values` corresponds to an explicit partial application in Kex:

```kex
let add(left: Integer, right: Integer) -> Integer = left + right
let addTen = ~add(10)
assert([1, 2].map(addTen) == [11, 12])
assert([1, 2].map(~add(10)) == [11, 12])
```

`~add(10)` fixes the first argument and gives back a function that adds ten to its input. Both assertions produce `[11, 12]`. The `~` captures a function; `_` can leave a particular argument position open. Merely omitting an argument from an ordinary Kex call does not create another function.

## Pure formatting and effectful output

Haskell distinguishes a pure result from an IO action:

```haskell
greeting :: String -> String
greeting name = "Hello, " ++ name

main :: IO ()
main = putStrLn (greeting "Ada")
```

Kex makes the boundary visible on the declaration:

```kex
greeting : String -> String
let greeting(name) = "Hello, ${name}"

printGreeting : String -> Void
foul printGreeting(name) = IO.printLine(greeting(name))

main do
  printGreeting("Ada")
end
```

`greeting` returns a string and remains pure. `printGreeting` prints it, so its declaration uses `foul`. Calling it executes the effect; Kex does not return an `IO<A>` action for a later caller to run. A pure function cannot call it, while `main` and top-level executable expressions can. Kex's block syntax also has a different meaning from Haskell's monadic `do`. [Haskell IO model](https://www.haskell.org/onlinereport/haskell2010/haskellch7.html)

## Data and migration choices

For domain data, begin with Kex sum types and `match`. Translate a Haskell `Maybe` to `Optional<A>` and an `Either` to a suitable `Result<A, E>`, checking constructor names and parameter order. Use `.try` only when its failure and rescue behavior fits the surrounding function.

Keep pure transformations pure, but revisit evaluation order, strictness, string representation, and resource lifetimes. Kex also permits local `var` reassignment and provides process-owned state; neither requires turning every immutable algorithm into a mutable one.

When moving a larger program, list the libraries it needs and decide which Kex modules will replace them. Revisit evaluation order, string representation, resource lifetimes, and concurrency at each boundary. The small examples above show language translations, not a performance comparison.

Continue with [functions](../functions/), [types](../types/), [errors](../errors/), and [streams](../streams/).
